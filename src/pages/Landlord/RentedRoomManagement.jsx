import React, { useEffect, useState } from "react";
import { Skeleton, Card } from "antd";
import RentedRoomCard from "../../components/Landlord/RentedRoomCard";
import "./RentedRoomManagement.scss";

const mockData = [
    {
        RoomId: "101",
        RoomNumber: "A101",
        Title: "Luxury Apartment",
        Status: "Rented",
        Location: "Downtown, New York",
        MaxOccupants: 3,
    },
    {
        RoomId: "102",
        RoomNumber: "B202",
        Title: "Studio Apartment",
        Status: "Rented",
        Location: "Central Park, NY",
        MaxOccupants: 2,
    },
    {
        RoomId: "103",
        RoomNumber: "C303",
        Title: "Cozy Room",
        Status: "Rented",
        Location: "Brooklyn, NY",
        MaxOccupants: 4,
    },
];

const RentedRoomManagement = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRentedRooms();
    }, []);

    const fetchRentedRooms = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/rooms/rented");
            if (!response.ok) throw new Error("Failed to fetch data");
            const data = await response.json();
            setRooms(data.length > 0 ? data : mockData); // Nếu API rỗng, dùng mockData
        } catch (error) {
            console.error("Error fetching rented rooms:", error);
            setRooms(mockData); // Dùng dữ liệu giả khi lỗi API
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rented-room-management">
            <h1 className="title">🏠 Rented Rooms</h1>
            <div className="room-list">
                {loading ? (
                    Array(3).fill().map((_, index) => (
                        <Card key={index} className="room-card">
                            <Skeleton active />
                        </Card>
                    ))
                ) : (
                    rooms.map((room) => <RentedRoomCard key={room.RoomId} room={room} />)
                )}
            </div>
        </div>
    );
};

export default RentedRoomManagement;
