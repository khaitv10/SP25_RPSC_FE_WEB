import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box, Typography, Paper, Button, Avatar, Grid, Card, CardContent, IconButton, Rating, CircularProgress
} from "@mui/material";
import { ArrowBack, ArrowForward, Refresh } from "@mui/icons-material";
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
        return <Typography variant="h6" sx={{ textAlign: "center", mt: 5 }}><CircularProgress /></Typography>;
    }

    if (error) {
        return (
            <Box sx={{ textAlign: "center", mt: 5 }}>
                <Typography variant="h6" sx={{ color: "red", mb: 2 }}>{error}</Typography>
                <Button onClick={fetchFeedback} variant="contained" color="primary" startIcon={<Refresh />}>
                    Thử lại
                </Button>
            </Box>
        );
    }

    if (!feedback) {
        return <Typography variant="h6" sx={{ textAlign: "center", mt: 5 }}>Feedback không tồn tại</Typography>;
    }

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % feedback.imageUrls.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + feedback.imageUrls.length) % feedback.imageUrls.length);

    return (
        <Box className={styles["feedback-container"]}>
            <Paper className={styles["feedback-paper"]}>
                <Typography variant="h4" className={styles["feedback-title"]}>Feedback Detail</Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Card className={styles["info-card"]}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={2} mb={2}>
                                    <Avatar src="https://i.pravatar.cc/150" sx={{ width: 64, height: 64 }} />
                                    <Box>
                                        <Typography variant="h6">{feedback.reviewerName}</Typography>
                                        <Typography variant="body2" color="textSecondary">Số phòng: {feedback.roomNumber}</Typography>
                                        <Typography variant="body2" color="textSecondary">Số điện thoại: {feedback.reviewerPhoneNumber}</Typography>
                                    </Box>
                                </Box>

                                <Box className={styles["info-field"]}>
                                    <Typography className={styles["info-label"]}>Loại:</Typography>
                                    <Typography className={styles["info-value"]}>{feedback.type}</Typography>
                                </Box>

                                <Box className={styles["info-field"]}>
                                    <Typography className={styles["info-label"]}>Đánh giá:</Typography>
                                    <Rating value={feedback.rating} readOnly />
                                </Box>

                                <Box className={styles["info-field"]}>
                                    <Typography className={styles["info-label"]}>Ngày tạo:</Typography>
                                    <Typography className={styles["info-value"]}>{new Date(feedback.createdDate).toLocaleDateString()}</Typography>
                                </Box>

                                <Typography variant="h6" sx={{ mt: 2 }}>Nội dung:</Typography>
                                <Typography sx={{ background: "#fff", padding: "10px", borderRadius: "8px", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)" }}>
                                    {feedback.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Right Column - Images */}
                    <Grid item xs={12} md={6} textAlign="center">
                        <Typography variant="h6" sx={{ mb: 2 }}>Hình ảnh</Typography>
                        {feedback.imageUrls.length > 0 ? (
                            <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", maxWidth: "100%", height: "auto" }}>
                                <IconButton onClick={prevImage} sx={{ position: "absolute", left: -10, backgroundColor: "rgba(0,0,0,0.5)", color: "white" }}>
                                    <ArrowBack />
                                </IconButton>

                                <img
                                    src={feedback.imageUrls[currentImageIndex]}
                                    alt="feedback"
                                    style={{ width: "100%", maxWidth: "450px", height: "auto", borderRadius: "10px", boxShadow: "0px 6px 15px rgba(0,0,0,0.3)" }}
                                />

                                <IconButton onClick={nextImage} sx={{ position: "absolute", right: -10, backgroundColor: "rgba(0,0,0,0.5)", color: "white" }}>
                                    <ArrowForward />
                                </IconButton>
                            </Box>
                        ) : (
                            <Typography variant="body1" color="textSecondary">Không có hình ảnh</Typography>
                        )}
                    </Grid>
                </Grid>

                <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Button className={styles["go-back-button"]} onClick={() => navigate(-1)}>
                        Quay lại
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default FeedbackDetail;
