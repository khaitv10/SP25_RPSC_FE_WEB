import React, { useState, useEffect, useRef, useCallback } from "react";
import { sendMessageToUser, getChatHistory, getHistoryByUserId } from "../../Services/Landlord/chatAPI";
import { Input, Button, Avatar, List, message as antMessage } from "antd";
import { SendOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons";
import * as signalR from "@microsoft/signalr";
import "./ChatPage.scss";

const ChatPage = () => {
    const [chatList, setChatList] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [hubConnection, setHubConnection] = useState(null);
    const messagesEndRef = useRef(null);

    const userId = localStorage.getItem("userId") || "";

    const lastMessageRef = useRef({
        message: null,
        timestamp: 0
    });


    // Memoized function to setup SignalR connection
    const setupSignalR = useCallback(async () => {
        if (!userId) {
            antMessage.error("User ID not found!");
            return;
        }

        if (hubConnection) return;

        const connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5262/chatHub")
            .withAutomaticReconnect()
            .build();

        try {
            await connection.start();
            setHubConnection(connection);

            await connection.invoke("JoinChat", userId);

            connection.on("ReceiveMessage", (senderId, receiverId, message, clientTimestamp) => {
                setMessages((prevMessages) => {
                    // Check for duplicates based on message content and timestamp
                    const isDuplicate = prevMessages.some(
                        m => m.message === message && 
                             m.clientTimestamp === clientTimestamp
                    );

                    if (!isDuplicate) {
                        return [
                            ...prevMessages,
                            { 
                                senderId, 
                                receiverId, 
                                message,
                                clientTimestamp
                            }
                        ];
                    }

                    return prevMessages;
                });
            });
            
        } catch (error) {
            antMessage.error("Connection failed!");
        }

        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, [userId]);

    // Initial setup effect
    useEffect(() => {
        fetchChatList();
        setupSignalR();
    }, [setupSignalR]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (hubConnection) {
            const messageHandler = (senderId, receiverId, message) => {
                setMessages((prevMessages) => {
                    // Prevent duplicate messages
                    const isDuplicate = prevMessages.some(
                        m => m.message === message && 
                             m.senderId === senderId && 
                             m.receiverId === receiverId
                    );
                    
                    if (!isDuplicate) {
                        return [
                            ...prevMessages,
                            { 
                                senderId, 
                                receiverId, 
                                message 
                            }
                        ];
                    }
                    
                    return prevMessages;
                });
            };
    
            hubConnection.on("ReceiveMessage", messageHandler);
    
            return () => {
                hubConnection.off("ReceiveMessage", messageHandler);
            };
        }
    }, [hubConnection]);

    // Fetch chat list
    const fetchChatList = async () => {
        try {
            const history = await getHistoryByUserId();
            setChatList(history);
        } catch (error) {
            antMessage.error("Failed to fetch chat list");
        }
    };

    // Open a specific chat
    const openChat = async (receiver) => {
        if (!receiver?.id) return;

        setActiveChat(receiver);

        try {
            const data = await getChatHistory(receiver.id);
            setMessages(data);
        } catch (error) {
            antMessage.error("Failed to load chat history");
        }
    };

    const handleSendMessage = async () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage || !activeChat?.id) {
            antMessage.warning("Không thể gửi tin nhắn trống");
            return;
        }
    
        const currentTime = Date.now();
    
        try {
            await sendMessageToUser(userId, activeChat.id, message);
    
            const newMessage = { 
                message,
                sender: {
                    senderId: userId,
                    senderUsername: "Current User",
                    senderProfileUrl: "your-avatar-url"
                },
                receiver: {
                    receiverId: activeChat.id,
                    receiverUsername: activeChat.username,
                    receiverProfileUrl: activeChat.avatar
                },
                clientTimestamp: currentTime,
                createdAt: new Date().toISOString()
            };
    
            setMessages((prev) => [...prev, newMessage]);
    
            if (hubConnection) {
                await hubConnection.invoke("SendMessageToUser", userId, activeChat.id, message, currentTime);
            }
    
        } catch (error) {
            antMessage.error("Gửi tin nhắn thất bại");
        }
    
        // Đảm bảo ô nhập liệu được đặt lại
        setMessage("");
    };
    
    
    
    
    return (
        <div className="chat-wrapper bg-gradient-to-br from-gray-100 to-gray-200 h-screen flex">
            {/* Sidebar with chat list */}
            <div className="chat-sidebar w-1/4 bg-white border-r border-gray-200 shadow-2xl p-4">
                <h3 className="text-2xl font-extrabold mb-6 flex items-center text-gray-800">
                    <MessageOutlined className="mr-3 text-blue-600" />
                    Chats
                </h3>
                <List
                    dataSource={chatList}
                    renderItem={(chat) => (
                        <List.Item
                            onClick={() => chat.receiver && openChat(chat.receiver)}
                            className={`
                                cursor-pointer hover:bg-blue-50 p-3 rounded-lg transition-all duration-200 
                                ${activeChat?.id === chat.receiver?.id 
                                    ? "bg-blue-100 shadow-md" 
                                    : "hover:shadow-sm"
                                }
                            `}
                        >
                            <Avatar 
                                icon={<UserOutlined />} 
                                src={chat.receiver?.avatar} 
                                className="mr-4 border-2 border-blue-200" 
                                size="large"
                            />
                            <div className="flex-grow">
                                <div className="font-bold text-gray-800">{chat.receiver?.username || "Unknown"}</div>
                                <div className="text-gray-500 text-sm truncate">
                                    {chat.latestMessage || "No recent messages"}
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            </div>

            {/* Main chat container */}
            <div className="chat-container w-3/4 flex flex-col">
                <div className="chat-header bg-white border-b border-gray-200 p-4 shadow-md">
                    {activeChat ? (
                        <div className="flex items-center">
                            <Avatar 
                                icon={<UserOutlined />} 
                                src={activeChat.avatar} 
                                className="mr-4 border-2 border-green-200" 
                                size="large"
                            />
                            <div>
                                <div className="font-bold text-xl text-gray-800">{activeChat.username}</div>
                                <div className="text-green-600 text-xs font-semibold">
                                    <span className="animate-pulse mr-2 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                                    Online
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500 text-lg">Select a conversation</div>
                    )}
                </div>

                {/* In the chat-messages section, replace the existing messages rendering with this: */}
                <div className="chat-messages flex-grow overflow-y-auto p-6 bg-gray-50 space-y-4">
                    {messages.map((msg, index) => {
                        // Determine if the current user is the sender
                        const isCurrentUserSender = msg.sender?.senderId === userId;
                        
                        return (
                            <div 
                                key={index} 
                                className={`flex items-end ${isCurrentUserSender ? "justify-end" : "justify-start"}`}
                            >
                                {!isCurrentUserSender && (
                                    <Avatar 
                                        icon={<UserOutlined />} 
                                        src={msg.sender?.senderProfileUrl}
                                        className="mr-3 mb-2" 
                                        size="small"
                                    />
                                )}
                                <div 
                                    className={`
                                        max-w-[70%] p-3 rounded-2xl 
                                        ${isCurrentUserSender 
                                            ? "bg-blue-500 text-white rounded-br-none" 
                                            : "bg-white text-gray-800 rounded-bl-none shadow-md"}
                                        transition-all duration-200 ease-in-out
                                    `}
                                >
                                    {msg.message}
                                </div>
                                {isCurrentUserSender && (
                                    <Avatar 
                                        icon={<UserOutlined />} 
                                        src={msg.sender?.senderProfileUrl}
                                        className="ml-3 mb-2" 
                                        size="small"
                                    />
                                )}
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {activeChat && (
                    <div className="chat-input p-5 bg-white border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                        <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onPressEnter={handleSendMessage}
                            placeholder="Nhập tin nhắn..."
                            className="flex-grow border rounded-lg p-2 focus:outline-none"
                        />


                            <Button 
                                type="primary" 
                                icon={<SendOutlined />} 
                                onClick={handleSendMessage}
                                className="bg-blue-500 hover:bg-blue-600 rounded-full p-2 flex items-center justify-center"
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;