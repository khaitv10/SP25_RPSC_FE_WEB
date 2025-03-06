import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomTypeDetail } from "../../../Services/Admin/roomTypeAPI";
import "./RoomTypeDetail.scss";
import room from "../../../assets/room.jpg";

const RoomTypeDetail = () => {
    const { roomTypeId } = useParams();
    const [roomType, setRoomType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

    const DEFAULT_IMAGE = "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";

    useEffect(() => {
        fetchRoomTypeDetail();
    }, []);

    const fetchRoomTypeDetail = async () => {
        try {
            setLoading(true);
            const response = await getRoomTypeDetail(roomTypeId);
            console.log("API Response:", response);

            let data = response.data;

            if (!data.roomImageUrls || data.roomImageUrls.length === 0) {
                data.roomImageUrls = [room];
            }

            setRoomType(data);
        } catch (error) {
            console.error("Failed to fetch room type details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevImage = () => {
        if (!roomType || !roomType.roomImageUrls || roomType.roomImageUrls.length === 0) return;
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? roomType.roomImageUrls.length - 1 : prevIndex - 1
        );
    };

    const handleNextImage = () => {
        if (!roomType || !roomType.roomImageUrls || roomType.roomImageUrls.length === 0) return;
        setCurrentImageIndex((prevIndex) =>
            prevIndex === roomType.roomImageUrls.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="container">
            <h1 className="title">Room Type Details</h1>

            {loading ? (
                <p>Loading...</p>
            ) : roomType ? (
                <div className="detailsLayout">
                    {/* Left Column */}
                    <div className="leftColumn">
                        <div className="formGroup">
                            <label>Room Type Name</label>
                            <div className="infoBox">{roomType.roomTypeName || ""}</div>
                        </div>

                        <div className="grid">
                            <div className="formGroup">
                                <label>Deposit</label>
                                <div className="infoBox">{roomType.deposite ? `$${roomType.deposite}` : ""}</div>
                            </div>

                            <div className="formGroup">
                                <label>Square</label>
                                <div className="infoBox">{roomType.square ? `${roomType.square} m²` : ""}</div>
                            </div>
                        </div>

                        <div className="grid">
                            <div className="formGroup">
                                <label>Status</label>
                                <div className="infoBox">{roomType.status || ""}</div>
                            </div>

                            <div className="formGroup">
                                <label>Created At</label>
                                <div className="infoBox">{roomType.createdAt ? new Date(roomType.createdAt).toLocaleString() : ""}</div>
                            </div>
                        </div>

                        <div className="formGroup">
                            <label>Address</label>
                            <div className="infoBox">{roomType.address || ""}</div>
                        </div>

                        <div className="grid">
                            <div className="formGroup">
                                <label>Landlord</label>
                                <div className="infoBox">{roomType.landlordName || ""}</div>
                            </div>

                            <div className="formGroup">
                                <label>Room Price</label>
                                <div className="infoBox">{roomType.roomPrices && roomType.roomPrices.length > 0 ? `$${roomType.roomPrices.join(", ")}` : ""}</div>
                            </div>
                        </div>

                        {/* Services List */}
                        <div className="servicesList">
                            <label>Services</label>
                            {roomType.roomServiceNames && roomType.roomServiceNames.length > 0 ? (
                                <ul>
                                    {roomType.roomServiceNames.map((service, index) => (
                                        <li key={index}>
                                            <span className="serviceName">{service}</span>
                                            <span className="servicePrice">${roomType.roomServicePrices[index]}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="infoBox"></div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Image Carousel */}
                    <div className="rightColumn">
                        <div className="imageCarousel">
                            <button className="prevBtn" onClick={handlePrevImage}>&lt;</button>
                            <img src={roomType.roomImageUrls[currentImageIndex]} alt="Room" />
                            <button className="nextBtn" onClick={handleNextImage}>&gt;</button>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Room type not found.</p>
            )}
        </div>
    );
};

export default RoomTypeDetail;
