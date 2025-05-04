import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFeedbackById } from "../../../Services/Landlord/feedbackApi";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import styles from "./FeedbackDetail.module.scss";

const FeedbackDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const fetchFeedback = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getFeedbackById(id);
            if (data?.isSuccess) {
                setFeedback(data.data);
            } else {
                setError(data.message || "Không thể lấy dữ liệu feedback.");
            }
        } catch (err) {
            setError(err.message || "Có lỗi xảy ra khi lấy dữ liệu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, [id]);

    const nextImage = () => {
        if (feedback?.imageUrls?.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % feedback.imageUrls.length);
        }
    };
    
    const prevImage = () => {
        if (feedback?.imageUrls?.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + feedback.imageUrls.length) % feedback.imageUrls.length);
        }
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 3);
    };

    const renderStars = (rating) => {
        return (
            <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                        key={star} 
                        className={`${styles.star} ${rating >= star ? styles.active : ''}`}
                    >
                        ★
                    </span>
                ))}
                <span className={styles.ratingValue}>({rating}/5)</span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Đang tải...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h3>Không thể tải dữ liệu</h3>
                    <p>{error}</p>
                    <button 
                        onClick={fetchFeedback} 
                        className={styles.retryButton}
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (!feedback) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h3>Không tìm thấy</h3>
                    <p>Feedback không tồn tại hoặc đã bị xóa</p>
                    <button 
                        onClick={() => navigate(-1)} 
                        className={styles.retryButton}
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <button 
                        className={styles.backButton} 
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1>Feedback</h1>
                </div>

                <div className={styles.content}>
                    <div className={styles.infoSection}>
                        <div className={styles.userInfo}>
                            <div className={styles.avatar}>
                                {getInitials(feedback.reviewerName)}
                            </div>
                            <div className={styles.userDetails}>
                                <h2>{feedback.reviewerName}</h2>
                                <p>Phòng {feedback.roomNumber}</p>
                                <p>{feedback.reviewerPhoneNumber}</p>
                            </div>
                        </div>

                        <div className={styles.metaItems}>
                            
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Đánh giá:</span>
                                <span className={styles.metaValue}>
                                    {renderStars(feedback.rating)}
                                </span>
                            </div>

                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Ngày:</span>
                                <span className={styles.metaValue}>
                                    {new Date(feedback.createdDate).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        </div>

                        <div className={styles.description}>
                            <h3>Nội dung</h3>
                            <p>{feedback.description}</p>
                        </div>
                    </div>

                    <div className={styles.imageSection}>
                        {feedback.imageUrls && feedback.imageUrls.length > 0 ? (
                            <div className={styles.imageCarousel}>
                                <img 
                                    src={feedback.imageUrls[currentImageIndex]} 
                                    alt={`Feedback image ${currentImageIndex + 1}`} 
                                    className={styles.image} 
                                />
                                
                                {feedback.imageUrls.length > 1 && (
                                    <>
                                        <button 
                                            className={`${styles.imageNav} ${styles.prev}`}
                                            onClick={prevImage}
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        
                                        <button 
                                            className={`${styles.imageNav} ${styles.next}`}
                                            onClick={nextImage}
                                            aria-label="Next image"
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    </>
                                )}
                                
                                <div className={styles.imageCounter}>
                                    {currentImageIndex + 1} / {feedback.imageUrls.length}
                                </div>
                            </div>
                        ) : (
                            <div className={styles.noImages}>
                                <p>Không có hình ảnh</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackDetail;