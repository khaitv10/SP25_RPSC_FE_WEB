import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./NotFoundPage.scss"; // You'll need to create this file
import logo from "../../assets/logoEasyRommie.png";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    if (isRedirecting && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isRedirecting && countdown === 0) {
      navigate("/");
    }
  }, [countdown, navigate, isRedirecting]);

  const handleStopRedirect = () => {
    setIsRedirecting(false);
  };

  const handleRedirectNow = () => {
    navigate("/");
  };

  const handleExploreOptions = () => {
    navigate("/landlord/dashboard");
  };

  return (
    <div className="not-found-container">
      <img src={logo} alt="EasyRoomie Logo" className="not-found-logo" />

      <div className="not-found-box">
        <div className="not-found-left">
          <div className="animation-container">
            <div className="cow">
              <div className="head">
                <div className="face"></div>
              </div>
              <div className="leg b l"></div>
              <div className="leg b r"></div>
              <div className="leg f l"></div>
              <div className="leg f r"></div>
              <div className="tail"></div>
            </div>
            <div className="well"></div>
            <div className="error-text">
              <h2>404</h2>
            </div>
          </div>
          <div className="message-text">
            <h2>Oops! Lost in Space</h2>
            <p>The page you're looking for seems to have wandered off. Let's help you find your way back.</p>
          </div>
        </div>
        
        <div className="not-found-right">
          <div className="not-found-header">
            <h3>404 Not Found</h3>
            <p>We couldn't locate the page you requested</p>
          </div>
          
          <div className="not-found-content">
            <div className="status-info">
              <div className="status-code">404</div>
              <div className="status-description">
                <h4>Page Not Found</h4>
                <p>The page you're looking for doesn't exist or has been moved.</p>
              </div>
            </div>

            <div className="redirect-message">
              {isRedirecting ? (
                <p>You will be automatically redirected to the homepage in <span className="countdown">{countdown}</span> seconds.</p>
              ) : (
                <p>Automatic redirect has been stopped. You can use the buttons below to navigate.</p>
              )}
            </div>

            <div className="suggestion-list">
              <h4>Here's what you can do:</h4>
              <ul>
                <li>Check the URL for any typing errors</li>
                <li>Go back to the previous page</li>
                <li>Visit our homepage</li>
                <li>Contact our support team for assistance</li>
              </ul>
            </div>

            <div className="action-buttons">
              {isRedirecting ? (
                <button className="secondary-btn" onClick={handleStopRedirect}>
                  Stop Redirect
                </button>
              ) : (
                <button className="back-btn" onClick={() => window.history.back()}>
                  Go Back
                </button>
              )}
              <button className="home-btn" onClick={handleRedirectNow}>
                Go to Homepage
              </button>
            </div>
          </div>

          <div className="support-info">
            <p>Need help? Contact our support team at <a href="mailto:easyroomie.RPSC@gmail.com">easyroomie.RPSC@gmail.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;