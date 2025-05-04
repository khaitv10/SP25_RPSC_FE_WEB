import React, { useState, useEffect } from "react";
import { Search, Eye, MessageSquare, ChevronLeft, ChevronRight, Loader, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLandlordFeedbacks } from "../../../Services/Landlord/feedbackApi";
import './FeedbackRoom.scss';

const FeedbackRoom = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const data = await getLandlordFeedbacks();
        // Fix the typo in the API response
        setFeedbacks(data.feedbacks || data.feebacks || []);
      } catch (err) {
        setError(err.message || "Error loading feedbacks");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  // Update total pages when feedbacks or search changes
  useEffect(() => {
    if (filteredFeedbacks.length > 0) {
      setTotalPages(Math.ceil(filteredFeedbacks.length / rowsPerPage));
      // Reset to page 1 when search changes
      if (page > Math.ceil(filteredFeedbacks.length / rowsPerPage)) {
        setPage(1);
      }
    } else {
      setTotalPages(1);
    }
  }, [feedbacks, search, rowsPerPage]);

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
    feedback.roomNumber.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedFeedbacks = filteredFeedbacks.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // Scroll to top of table when page changes
      document.querySelector('.feedback-room-table-container').scrollTop = 0;
    }
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setPage(1);
  };

  if (loading) {
    return (
      <div className="feedback-room-container">
        <div className="feedback-room-loading">
          <Loader className="feedback-room-loading-icon" />
          <p>Loading feedback reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feedback-room-container">
        <div className="feedback-room-error">
          <AlertCircle className="feedback-room-error-icon" />
          <h2>Error Loading Feedbacks</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="feedback-room-error-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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

        <div className="feedback-room-controls">
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
          
          <div className="feedback-room-page-size">
            <label htmlFor="rowsPerPage">Show:</label>
            <select 
              id="rowsPerPage" 
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="feedback-room-page-size-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {filteredFeedbacks.length === 0 ? (
          <div className="feedback-room-empty">
            <MessageSquare className="feedback-room-empty-icon" />
            <h2>No Feedback Reports Found</h2>
            <p>Try changing your search criteria or check back later.</p>
          </div>
        ) : (
          <>
            <div className="feedback-room-table-container">
              <table className="feedback-room-table">
                <thead>
                  <tr>
                    <th>Reviewer Name</th>
                    {/* <th>Phone</th> */}
                    <th>Room Number</th>
                    <th>Rating</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFeedbacks.map((feedback) => (
                    <tr key={feedback.feedbackID}>
                      <td>{feedback.reviewerName}</td>
                      {/* <td>{feedback.reviewerPhoneNumber}</td> */}
                      <td>{feedback.roomNumber}</td>
                      <td>
                        <StarRating rating={feedback.rating} />
                      </td>
                      <td>{new Date(feedback.createdDate).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <button 
                          onClick={() => navigate(`/landlord/feedback/${feedback.feedbackID}`)}
                          className="feedback-room-table-action"
                          aria-label="View feedback details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="feedback-room-pagination">
              <div className="feedback-room-pagination-info">
                Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredFeedbacks.length)} of {filteredFeedbacks.length} entries
              </div>
              <div className="feedback-room-pagination-controls">
                <button 
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="feedback-room-pagination-button"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {/* Generate page buttons with ellipsis for many pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(pageNum => 
                    pageNum === 1 || 
                    pageNum === totalPages || 
                    Math.abs(pageNum - page) <= 1
                  )
                  .map((pageNum, index, array) => {
                    // Add ellipsis if there are gaps
                    if (index > 0 && pageNum - array[index - 1] > 1) {
                      return (
                        <React.Fragment key={`ellipsis-${pageNum}`}>
                          <span className="feedback-room-pagination-ellipsis">...</span>
                          <button 
                            onClick={() => handlePageChange(pageNum)}
                            className={`feedback-room-pagination-button ${page === pageNum ? 'active' : ''}`}
                          >
                            {pageNum}
                          </button>
                        </React.Fragment>
                      );
                    }
                    return (
                      <button 
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`feedback-room-pagination-button ${page === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })
                }
                
                <button 
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="feedback-room-pagination-button"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackRoom;