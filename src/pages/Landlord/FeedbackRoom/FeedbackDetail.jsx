import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box, Typography, Paper, Button, Avatar, Grid, Card, 
    CardContent, IconButton, Rating, CircularProgress
} from "@mui/material";
import { 
    ArrowBack as BackIcon, 
    ArrowForward as NextIcon, 
    Refresh as RetryIcon, 
    StarRounded as StarIcon 
} from "@mui/icons-material";
import { getFeedbackById } from "../../../Services/Landlord/feedbackApi";
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

    if (loading) {
        return (
            <Box className={styles["feedback-detail-loading"]}>
                <CircularProgress size={60} thickness={4} color="primary" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box className={styles["feedback-detail-error"]}>
                <Typography variant="h6" color="error">{error}</Typography>
                <Button 
                    onClick={fetchFeedback} 
                    variant="contained" 
                    color="primary" 
                    className={styles["feedback-detail-retry-button"]}
                >
                    <RetryIcon /> Thử lại
                </Button>
            </Box>
        );
    }

    if (!feedback) {
        return (
            <Box className={styles["feedback-detail-error"]}>
                <Typography variant="h6" color="textSecondary">
                    Feedback không tồn tại
                </Typography>
            </Box>
        );
    }

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % feedback.imageUrls.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + feedback.imageUrls.length) % feedback.imageUrls.length);

    const getInitials = (name) => {
        return name.split(' ').map(word => word[0]).join('').toUpperCase();
    };

    return (
        <Box className={styles["feedback-detail-container"]}>
            <Paper className={styles["feedback-detail-wrapper"]}>
                <Box className={styles["feedback-detail-header"]}>
                    <IconButton 
                        className={styles["feedback-detail-back-button"]} 
                        onClick={() => navigate(-1)}
                    >
                        <BackIcon />
                    </IconButton>
                    <Typography variant="h4">Chi tiết Feedback</Typography>
                </Box>

                <Box className={styles["feedback-detail-content"]}>
                    <Box className={styles["feedback-detail-info"]}>
                        <Box className={styles["feedback-detail-user-info"]}>
                            <Box className={styles["feedback-detail-avatar"]}>
                                {getInitials(feedback.reviewerName)}
                            </Box>
                            <Box className={styles["feedback-detail-user-details"]}>
                                <Typography variant="h6">{feedback.reviewerName}</Typography>
                                <Typography variant="body2">Phòng {feedback.roomNumber}</Typography>
                                <Typography variant="body2">{feedback.reviewerPhoneNumber}</Typography>
                            </Box>
                        </Box>

                        <Box className={styles["feedback-detail-meta"]}>
                            <Box className={styles["feedback-detail-meta-item"]}>
                                <span>Loại:</span>
                                <span className={styles["feedback-detail-badge"]}>{feedback.type}</span>
                            </Box>
                            
                            <Box className={styles["feedback-detail-meta-item"]}>
                                <span>Đánh giá:</span>
                                <Box className={styles["feedback-detail-stars"]}>
                                    <Rating 
                                        value={feedback.rating} 
                                        readOnly 
                                        icon={<StarIcon className={styles["feedback-detail-star-full"]} />}
                                        emptyIcon={<StarIcon className={styles["feedback-detail-star-empty"]} />}
                                    />
                                    <Typography className={styles["feedback-detail-rating-value"]}>
                                        ({feedback.rating}/5)
                                    </Typography>
                                </Box>
                            </Box>

                            <Box className={styles["feedback-detail-meta-item"]}>
                                <span>Ngày:</span>
                                {new Date(feedback.createdDate).toLocaleDateString()}
                            </Box>
                        </Box>

                        <Box className={styles["feedback-detail-description"]}>
                            <Typography variant="h6">Nội dung</Typography>
                            <Typography>{feedback.description}</Typography>
                        </Box>
                    </Box>

                    <Box className={styles["feedback-detail-images"]}>
                        <Box className={styles["feedback-detail-image-carousel"]}>
                            {feedback.imageUrls.length > 0 ? (
                                <>
                                    <IconButton 
                                        className={`${styles["feedback-detail-image-nav-button"]} ${styles.left}`} 
                                        onClick={prevImage}
                                    >
                                        <BackIcon />
                                    </IconButton>
                                    
                                    <img 
                                        src={feedback.imageUrls[currentImageIndex]} 
                                        alt={`Feedback image ${currentImageIndex + 1}`} 
                                        className={styles["feedback-detail-image"]} 
                                    />
                                    
                                    <IconButton 
                                        className={`${styles["feedback-detail-image-nav-button"]} ${styles.right}`} 
                                        onClick={nextImage}
                                    >
                                        <NextIcon />
                                    </IconButton>

                                    <Typography className={styles["feedback-detail-image-counter"]}>
                                        {currentImageIndex + 1} / {feedback.imageUrls.length}
                                    </Typography>
                                </>
                            ) : (
                                <Typography className={styles["feedback-detail-no-images"]}>
                                    Không có hình ảnh
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default FeedbackDetail;