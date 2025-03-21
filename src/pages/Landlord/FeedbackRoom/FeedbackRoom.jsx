import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    InputBase,
    Pagination,
    Typography,
    Box,
    Rating,
    CircularProgress
} from "@mui/material";
import { Eye, Search, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLandlordFeedbacks } from "../../../Services/Landlord/feedbackApi";

const FeedbackRoom = () => {
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const data = await getLandlordFeedbacks();
                setFeedbacks(data.feebacks);
            } catch (err) {
                setError(err.message || "Lỗi khi tải feedbacks");
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, []);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const filteredFeedbacks = feedbacks.filter((feedback) =>
        feedback.roomNumber.includes(search)
    );

    const totalPages = Math.ceil(filteredFeedbacks.length / rowsPerPage);

    return (
        <Box sx={{ width: "100%" }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
                <MessageSquare size={28} color="#F9A856" />
                <Typography variant="h4" fontWeight="bold">
                    Feedback Reports
                </Typography>
            </Box>

            <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
                {/* Thanh tìm kiếm */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#f0f0f0",
                        padding: "6px 10px",
                        borderRadius: "20px",
                        width: "250px",
                        marginBottom: "10px",
                    }}
                >
                    <Search size={18} style={{ marginRight: 5, color: "#888" }} />
                    <InputBase
                        placeholder="Search Room Number"
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ fontSize: "14px" }}
                    />
                </div>

                {/* Xử lý trạng thái tải dữ liệu */}
                {loading ? (
                    <Box display="flex" justifyContent="center" mt={3}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error" textAlign="center">
                        {error}
                    </Typography>
                ) : (
                    <>
                        {/* Bảng dữ liệu */}
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>ReviewerName</TableCell>
                                        <TableCell>ReviewerPhone</TableCell>
                                        <TableCell>RoomNumber</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Rate</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredFeedbacks
                                        .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                                        .map((feedback) => (
                                            <TableRow key={feedback.feedbackID}>
                                                <TableCell>{feedback.feedbackID}</TableCell>
                                                <TableCell>{feedback.reviewerName}</TableCell>
                                                <TableCell>{feedback.reviewerPhoneNumber}</TableCell>
                                                <TableCell>{feedback.roomNumber}</TableCell>
                                                <TableCell>{feedback.type}</TableCell>
                                                <TableCell>
                                                    <Rating value={feedback.rating} precision={0.5} readOnly />
                                                </TableCell>
                                                <TableCell>{new Date(feedback.createdDate).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => navigate(`/landlord/feedback/${feedback.feedbackID}`)}>
                                                        <Eye size={18} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Phân trang */}
                        <div style={{ display: "flex", justifyContent: "right", marginTop: "10px" }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handleChangePage}
                                shape="rounded"
                                sx={{
                                    "& .MuiPaginationItem-root": {
                                        color: "#333",
                                        borderRadius: "8px",
                                    },
                                    "& .Mui-selected": {
                                        backgroundColor: "#F9A856",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        "&:hover": {
                                            backgroundColor: "#F9A856",
                                        },
                                    },
                                }}
                            />
                        </div>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default FeedbackRoom;
