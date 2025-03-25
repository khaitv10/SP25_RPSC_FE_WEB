import React, { useState, useEffect } from "react";
import { Search, Eye, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLandlordFeedbacks } from "../../../Services/Landlord/feedbackApi";
import './FeedbackRoom.scss';

const FeedbackRoom = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10; // Increased rows per page
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const data = await getLandlordFeedbacks();
        setFeedbacks(data.feebacks);
      } catch (err) {
        setError(err.message || "Error loading feedbacks");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const StarRating = ({ rating }) => {
    return (
      <div className="feedback-room-star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`feedback-room-star-rating-star ${
              rating >= star 
                ? 'feedback-room-star-rating-star-full' 
                : rating >= star - 0.5 
                ? 'feedback-room-star-rating-star-half' 
                : 'feedback-room-star-rating-star-empty'
            }`}
          >
            ★
          </span>
        ))}
        <span className="feedback-room-star-rating-value">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const filteredFeedbacks = feedbacks.filter((feedback) =>
    feedback.roomNumber.includes(search)
  );

  const paginatedFeedbacks = filteredFeedbacks.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="feedback-room-container">
      <div className="feedback-room-wrapper">
        <header className="feedback-room-header">
          <div className="feedback-room-header-title">
            <MessageSquare className="feedback-room-header-icon" />
            <h1>Feedback Reports</h1>
          </div>
          <div className="feedback-room-header-info">
            {filteredFeedbacks.length} feedback reports found
          </div>
        </header>

        <div className="feedback-room-search-container">
          <div className="feedback-room-search">
            <Search className="feedback-room-search-icon" />
            <input 
              type="text" 
              placeholder="Search Room Number" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="feedback-room-search-input"
            />
          </div>
        </div>

        <div className="feedback-room-table-container">
          <table className="feedback-room-table">
            <thead>
              <tr>
                <th>Reviewer Name</th>
                <th>Phone</th>
                <th>Room Number</th>
                <th>Type</th>
                <th>Rating</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFeedbacks.map((feedback) => (
                <tr key={feedback.feedbackID}>
                  <td>{feedback.reviewerName}</td>
                  <td>{feedback.reviewerPhoneNumber}</td>
                  <td>{feedback.roomNumber}</td>
                  <td>
                    <span className={`feedback-room-table-badge 
                      ${feedback.type === 'Issue' 
                        ? 'feedback-room-table-badge-issue' 
                        : feedback.type === 'Suggestion' 
                        ? 'feedback-room-table-badge-suggestion' 
                        : 'feedback-room-table-badge-default'}`}
                    >
                      {feedback.type}
                    </span>
                  </td>
                  <td>
                    <StarRating rating={feedback.rating} />
                  </td>
                  <td>{new Date(feedback.createdDate).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <button 
                      onClick={() => navigate(`/landlord/feedback/${feedback.feedbackID}`)}
                      className="feedback-room-table-action"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeedbackRoom;