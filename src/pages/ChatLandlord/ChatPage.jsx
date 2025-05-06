import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input, Button, Avatar, List, Badge, Tooltip, Spin } from "antd";
import { 
  SendOutlined, 
  UserOutlined, 
  EllipsisOutlined, 
  PictureOutlined, 
  SmileOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import * as signalR from "@microsoft/signalr";
import { sendMessageToUser, getChatHistory, getHistoryByUserId } from "../../Services/Landlord/chatAPI";
import axiosClient from "../../Services/axios/config";
import "./ChatPage.scss";

const ChatPage = () => {
    const [chatList, setChatList] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [hubConnection, setHubConnection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const messagesEndRef = useRef(null);

    const userId = localStorage.getItem("userId") || "";

    // Check if we have a target user from post detail page
    useEffect(() => {
        const targetUserId = sessionStorage.getItem("contactTargetUserId");
        const targetUsername = sessionStorage.getItem("contactTargetUsername");
        const targetAvatar = sessionStorage.getItem("contactTargetAvatar");
        
        // If we have target user data, create or open chat with that user
        if (targetUserId && targetUsername) {
            // Create a chat partner object
            const chatPartner = {
                id: targetUserId,
                username: targetUsername,
                avatar: targetAvatar || "",
                isOnline: false // Default to offline since we don't know
            };
            
            // Set as active chat and fetch history
            setActiveChat(chatPartner);
            
            // Clear the session storage to prevent reopening on page refresh
            sessionStorage.removeItem("contactTargetUserId");
            sessionStorage.removeItem("contactTargetUsername");
            sessionStorage.removeItem("contactTargetAvatar");
            
            // After setting up, fetch chat history for this user
            getChatHistory(targetUserId)
                .then(data => {
                    setMessages(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Failed to load chat history:", error);
                    setLoading(false);
                    setMessages([]); // Set empty messages if this is a new conversation
                });
        }
    }, []);

    // Get the hub URL from axiosClient baseURL
    const getHubUrl = () => {
        const baseURL = axiosClient.defaults.baseURL;
        // Use the same baseURL from axiosClient configuration
        return `${baseURL}chatHub`;
    };

    // Memoized function to setup SignalR connection
    const setupSignalR = useCallback(async () => {
        if (!userId) {
            console.error("User ID not found!");
            return;
        }

        if (hubConnection) return;

        const hubUrl = getHubUrl();
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl)
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
                        // If this is a message from someone we're not currently chatting with,
                        // update the chat list to show a new message indicator
                        if (activeChat?.id !== senderId && senderId !== userId) {
                            fetchChatList();
                        }
                        
                        return [
                            ...prevMessages,
                            { 
                                senderId, 
                                receiverId, 
                                message,
                                clientTimestamp,
                                createdAt: new Date().toISOString()
                            }
                        ];
                    }

                    return prevMessages;
                });
            });
            
        } catch (error) {
            console.error("Connection failed:", error);
        }

        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, [userId, activeChat, hubConnection]);

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

    const fetchChatList = async () => {
        setLoading(true);
        try {
            const history = await getHistoryByUserId();
            
            // Transform the chat list to show the other person in each conversation
            const processedChats = history.map(chat => {
                // Check if current user is the sender
                const isCurrentUserSender = chat.sender.id === userId;
                
                // Create a new chat object with the correct person to display
                return {
                    ...chat,
                    // If current user is the sender, display the receiver as the chat partner
                    // If current user is the receiver, display the sender as the chat partner
                    chatPartner: isCurrentUserSender ? chat.receiver : chat.sender,
                    hasUnread: chat.unreadCount > 0 && !isCurrentUserSender,
                    lastMessageTime: new Date(chat.lastMessageTime || Date.now())
                };
            });
            
            // Filter out self-chats and deduplicate chats by unique partner
            const uniqueChats = [];
            const chatPartnerIds = new Set();
            
            for (const chat of processedChats) {
                // Skip self-chats
                if (chat.sender.id === chat.receiver.id) {
                    continue;
                }
                
                // Only add this chat if we haven't seen this partner before
                if (!chatPartnerIds.has(chat.chatPartner.id)) {
                    chatPartnerIds.add(chat.chatPartner.id);
                    uniqueChats.push(chat);
                }
            }
            
            // Sort by latest message time
            uniqueChats.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
            
            setChatList(uniqueChats);
        } catch (error) {
            console.error("Failed to load chat list:", error);
        } finally {
            setLoading(false);
        }
    };

    // Open a specific chat
    const openChat = async (chatPartner) => {
        if (!chatPartner?.id) return;

        setActiveChat(chatPartner);
        setLoading(true);

        try {
            const data = await getChatHistory(chatPartner.id);
            setMessages(data);
        } catch (error) {
            console.error("Failed to load chat history:", error);
            // If this is a new conversation, set empty messages
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage || !activeChat?.id) {
            return;
        }
    
        const currentTime = Date.now();
    
        try {
            // Clear the input field immediately for better UX
            setMessage("");
            
            await sendMessageToUser(userId, activeChat.id, trimmedMessage);
    
            const newMessage = { 
                message: trimmedMessage,
                sender: {
                    senderId: userId,
                    senderUsername: "Current User",
                    senderProfileUrl: localStorage.getItem("userAvatar") || ""
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
                await hubConnection.invoke("SendMessageToUser", userId, activeChat.id, trimmedMessage, currentTime);
            }

            // Update our chat list to reflect the new message
            fetchChatList();
    
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    // Format time for messages
    const formatMessageTime = (dateString) => {
        if (!dateString) return "";
        
        const date = new Date(dateString);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        
        if (isToday) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
                   ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    };

    const filteredChatList = chatList.filter(chat => 
        chat.chatPartner?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getMessageDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    };

    // Group messages by date
    const groupedMessages = messages.reduce((groups, message) => {
        const date = getMessageDate(message.createdAt);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    return (
        <div className="chat-app">
            {/* Sidebar with chat list */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <h2>Messages</h2>
                    <div className="search-container">
                        <Input
                            placeholder="Search conversations..."
                            prefix={<i className="fas fa-search" />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                <div className="conversations-list">
                    {loading && !activeChat ? (
                        <div className="loading-container">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <List
                            dataSource={filteredChatList}
                            renderItem={(chat) => (
                                <div 
                                    className={`conversation-item ${activeChat?.id === chat.chatPartner?.id ? 'active' : ''}`}
                                    onClick={() => openChat(chat.chatPartner)}
                                >
                                    <div className="avatar-container">
                                        <Avatar 
                                            src={chat.chatPartner?.avatar}
                                            icon={!chat.chatPartner?.avatar && <UserOutlined />}
                                            size={50}
                                            className="user-avatar"
                                        />
                                        {chat.chatPartner?.isOnline && (
                                            <Badge status="success" className="online-badge" />
                                        )}
                                    </div>
                                    <div className="conversation-info">
                                        <div className="conversation-meta">
                                            <h4>{chat.chatPartner?.username || "Unknown"}</h4>
                                            <span className="time">
                                                {formatMessageTime(chat.lastMessageTime)}
                                            </span>
                                        </div>
                                        <div className="conversation-preview">
                                            <p>{chat.latestMessage || "No messages yet"}</p>
                                            {chat.hasUnread && <Badge count={chat.unreadCount} />}
                                        </div>
                                    </div>
                                </div>
                            )}
                            locale={{ emptyText: "No conversations found" }}
                        />
                    )}
                </div>
            </div>

            {/* Main chat container */}
            <div className="chat-container">
                {activeChat ? (
                    <>
                        <div className="chat-header">
                            <div className="chat-user-info">
                                <Avatar 
                                    src={activeChat.avatar}
                                    icon={!activeChat.avatar && <UserOutlined />}
                                    size={40}
                                />
                                <div className="user-details">
                                    <h3>{activeChat.username}</h3>
                                    <span className="status">
                                        {activeChat.isOnline ? "Online" : "Offline"}
                                    </span>
                                </div>
                            </div>
                            
                        </div>

                        <div className="messages-container">
                            {loading ? (
                                <div className="loading-container">
                                    <Spin size="large" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="no-messages">
                                    <p>No messages yet. Start a conversation!</p>
                                </div>
                            ) : (
                                <>
                                    {Object.entries(groupedMessages).map(([date, messagesForDate]) => (
                                        <div key={date} className="message-group">
                                            <div className="date-divider">
                                                <span>{date}</span>
                                            </div>
                                            {messagesForDate.map((msg, index) => {
                                                const isCurrentUserSender = msg.sender?.senderId === userId;
                                                return (
                                                    <div 
                                                        key={index} 
                                                        className={`message ${isCurrentUserSender ? "sent" : "received"}`}
                                                    >
                                                        {!isCurrentUserSender && (
                                                            <Avatar 
                                                                src={msg.sender?.senderProfileUrl}
                                                                icon={!msg.sender?.senderProfileUrl && <UserOutlined />}
                                                                size={32}
                                                            />
                                                        )}
                                                        <div className="message-bubble">
                                                            <p>{msg.message}</p>
                                                            <span className="timestamp">
                                                                {formatMessageTime(msg.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        <div className="chat-input-area">
                            <div className="input-container">
                                
                                <Input
                                    placeholder="Type a message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onPressEnter={handleSendMessage}
                                    suffix={
                                        <Tooltip title="Emoji">
                                            <Button 
                                                icon={<SmileOutlined />} 
                                                shape="circle" 
                                                className="emoji-button"
                                                type="text"
                                            />
                                        </Tooltip>
                                    }
                                />
                                
                                <Button
                                    icon={<SendOutlined />}
                                    onClick={handleSendMessage}
                                    type="primary"
                                    shape="circle"
                                    className="send-button"
                                    disabled={!message.trim()}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <div className="welcome-message">
                            <i className="fas fa-comments welcome-icon"></i>
                            <h2>Welcome to your messages</h2>
                            <p>Select a conversation to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;