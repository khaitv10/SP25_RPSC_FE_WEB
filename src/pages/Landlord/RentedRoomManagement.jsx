import React, { useEffect, useState } from "react";
import { Skeleton, Card } from "antd";
import RentedRoomCard from "../../components/Landlord/RentedRoomCard";
import { getRoomStaysByLandlord } from "../../Services/Landlord/roomStayApi";
import "./RentedRoomManagement.scss";

const RentedRoomManagement = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRentedRooms();
    }, []);

    const fetchRentedRooms = async () => {
        try {
            setLoading(true);
            const response = await getRoomStaysByLandlord();
            console.log("API Response:", response); 
    
            if (response?.data?.roomStays?.length > 0) {
                setRooms(response.data.roomStays);
                console.log("Updated rooms state:", response.data.roomStays); // 🟢 Kiểm tra rooms
            } else {
                setRooms([]);
                console.log("No rented rooms found.");
            }
        } catch (error) {
            console.error("Error fetching rented rooms:", error);
            setRooms([]);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="rented-room-management">
            <h1 className="title">🏠 Rented Rooms</h1>
            <div className="room-list">
                {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index} className="room-card">
                            <Skeleton active />
                        </Card>
                    ))
                ) : rooms.length > 0 ? (
                    rooms.map((room) => (
                        <RentedRoomCard key={room.roomStayId} room={room} />
                    ))
                ) : (
                    <p className="no-rooms-message">No rented rooms available.</p>
                )}
            </div>
        </div>
    );
};

export default RentedRoomManagement;
