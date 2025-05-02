import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getContractDetail, confirmContractAndCreateRoomStay, getContractTerm, updateContract } from "../../Services/Landlord/contractLandlord";
import { ArrowLeft, FileText, User, Home, Calendar, Clock, Upload, Tag, MapPin, CreditCard, UserCheck, Phone, Mail, Users } from "lucide-react";
import { toast } from "react-toastify";
import "./ContractLandDetail.scss";

const ContractLandDetail = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Get the referring page from location state, default to contracts list
  const referringPage = location.state?.from || "c";

  useEffect(() => {
    const fetchContractDetail = async () => {
      try {
        const response = await getContractDetail(contractId);
        setContract(response);
        console.log("Full Contract Details:", response);
      } catch (error) {
        console.error("❌ Error fetching contract details:", error);
        toast.error("Failed to fetch contract details");
      } finally {
        setLoading(false);
      }
    };

    fetchContractDetail();
  }, [contractId]);

  const handleGoBack = () => {
    navigate(referringPage);
  };


  const formatDate = (dateString) => {
    return dateString 
      ? new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'N/A';
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    
    const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, '')) : price;
    
    if (isNaN(numericPrice)) return 'N/A';
    
    return `${numericPrice.toLocaleString()} VNĐ`;
  };

// Create a separate function for uploading a new contract
const handleContractUpload = async (event) => {
  const file = event.target.files[0];
  
  if (file && file.type !== 'application/pdf') {
    toast.error('Please upload only PDF files');
    return;
  }

  try {
    setUploadLoading(true);
    await confirmContractAndCreateRoomStay(contractId, file);
    toast.success('Contract uploaded successfully');
    const updatedContract = await getContractDetail(contractId);
    setContract(updatedContract);
  } catch (error) {
    console.error("❌ Error uploading contract:", error);
    toast.error(error.message || 'Failed to upload contract');
  } finally {
    setUploadLoading(false);
  }
};

const handleContractUpdate = async (event) => {
  const file = event.target.files[0];
  
  if (file && file.type !== 'application/pdf') {
    toast.error('Please upload only PDF files');
    return;
  }

  try {
    setUploadLoading(true);
    await updateContract(contractId, file);
    toast.success('Contract updated successfully');
    const updatedContract = await getContractDetail(contractId);
    setContract(updatedContract);
  } catch (error) {
    console.error("❌ Error updating contract:", error);
    toast.error(error.message || 'Failed to update contract');
  } finally {
    setUploadLoading(false);
  }
};

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    
    if (file && file.type !== 'application/pdf') {
      toast.error('Please upload only PDF files');
      return;
    }

    try {
      setUploadLoading(true);
      await confirmContractAndCreateRoomStay(contractId, file);
      toast.success('Contract uploaded successfully');
      const updatedContract = await getContractDetail(contractId);
      setContract(updatedContract);
    } catch (error) {
      console.error("❌ Error uploading contract:", error);
      toast.error(error.message || 'Failed to upload contract');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleGenerateTemplate = async () => {
    try {
      console.log("Contract object:", contract); // Debug log
      
      // Check if contract has roomId instead of rentalRoomId
      const roomId = contract?.room?.roomId;
      if (!roomId) {
        toast.error('Room ID is missing');
        return;
      }

      setUploadLoading(true);
      const response = await getContractTerm(roomId);
      if (response.isSuccess && response.data.term) {
        window.open(response.data.term, '_blank');
        toast.success('Contract template generated successfully');
      } else {
        toast.error('Failed to generate contract template');
      }
    } catch (error) {
      console.error("❌ Error generating template:", error);
      toast.error(error.message || 'Failed to generate template');
    } finally {
      setUploadLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'expired': return 'status-expired';
      case 'active': return 'status-active';
      case 'proccessing': return 'status-pending';
      default: return 'status-default';
    }
  };

  const formatDurationRental = (duration) => {
    return duration ? `${duration} months` : 'N/A';
  };

  const handleTermClick = () => {
    if (contract.term) {
      window.open(contract.term, '_blank');
    } else {
      toast.error('Term PDF not available');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="modern-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="empty-state">
        <div className="empty-state-content">
          <FileText className="icon-large" />
          <h2>No Contract Found</h2>
          <p>The requested contract could not be found.</p>
          <button onClick={() => window.history.back()} className="btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
<div className="contract-detail">
      <div className="detail-card">
        {/* Header */}
        <div className="contract-header">
  <div className="back-button-container">
    <button 
      onClick={handleGoBack}
      className="back-button"
      aria-label="Go Back"
    >
      <ArrowLeft className="icon" />
    </button>
  </div>
  <div className="header-content">
    <div className="header-icon">
      <FileText className="icon" />
    </div>
    <h1 className="header-title">Contract Details</h1>
  </div>
  <div className="status-badge">
    <span className={`status ${getStatusColor(contract?.status)}`}>
      {contract?.status}
    </span>
  </div>
</div>


        {/* Contract Overview Section */}
        <div className="section-grid">
          <div className="section contract-overview">
            <div className="section-header">
              <Tag className="section-icon" />
              <h2 className="section-title">Contract Overview</h2>
            </div>
            <div className="info-cards">
              <div className="info-card">
                <p className="info-label">Contract ID</p>
                <p className="info-value">{contract.contractId}</p>
              </div>
              <div className="info-card">
                <p className="info-label">Status</p>
                <span className={`status-pill ${getStatusColor(contract.status)}`}>
                  {contract.status}
                </span>
              </div>
              <div className="info-card">
                <p className="info-label">Create Date</p>
                <p className="info-value">{formatDate(contract.createDate)}</p>
              </div>
              {contract.status === "Active" && (
                <button 
                  onClick={handleTermClick}
                  className="btn-primary term-button"
                >
                  <FileText className="icon" />
                  View Contract Term (PDF)
                </button>
              )}
            </div>
          </div>

          {/* Contract Dates Section */}
          <div className="section contract-dates">
            <div className="section-header">
              <Calendar className="section-icon" />
              <h2 className="section-title">Contract Dates</h2>
            </div>
            <div className="dates-grid">
              <div className="date-card">
                <Calendar className="date-icon" />
                <div className="date-content">
                  <p className="date-label">Start Date</p>
                  <p className="date-value">{formatDate(contract.startDate)}</p>
                </div>
              </div>
              <div className="date-card">
                <Calendar className="date-icon" />
                <div className="date-content">
                  <p className="date-label">End Date</p>
                  <p className="date-value">{formatDate(contract.endDate)}</p>
                </div>
              </div>
              <div className="date-card duration">
                <Clock className="date-icon" />
                <div className="date-content">
                  <p className="date-label">Duration Rental</p>
                  <p className="date-value">{formatDurationRental(contract.durationOfRental)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Room Information Section */}
        <div className="section room-information">
          <div className="section-header">
            <Home className="section-icon" />
            <h2 className="section-title">Room Information</h2>
          </div>
          <div className="grid-layout">
            {[ 
              { label: 'Room Number', value: contract.room.roomNumber, icon: <Home className="card-icon" /> },
              { label: 'Room Type', value: contract.room.roomTypeName, icon: <Tag className="card-icon" /> },
              { label: 'Location', value: contract.room.location, icon: <MapPin className="card-icon" /> },
              { label: 'Deposit', value: formatPrice(contract.room.deposite), icon: <CreditCard className="card-icon" /> },
              { label: 'Max Occupancy', value: contract.room.maxOccupancy, icon: <Users className="card-icon" /> },
              { label: 'Room Type Status', value: contract.room.roomTypeStatus, icon: <Home className="card-icon" /> }
            ].map(({ label, value, icon }) => (
              <div key={label} className="info-tile">
                <div className="tile-icon">
                  {icon}
                </div>
                <div className="tile-content">
                  <p className="tile-label">{label}</p>
                  <p className="tile-value">{value || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Information Section */}
        <div className="section customer-information">
          <div className="section-header">
            <User className="section-icon" />
            <h2 className="section-title">Customer Information</h2>
          </div>
          <div className="grid-layout">
            {[ 
              { label: 'Full Name', value: contract.customer.fullName, icon: <User className="card-icon" /> },
              { label: 'Phone Number', value: contract.customer.phoneNumber, icon: <Phone className="card-icon" /> },
              { label: 'Email', value: contract.customer.email, icon: <Mail className="card-icon" /> },
              { label: 'Customer Type', value: contract.customer.customerType, icon: <UserCheck className="card-icon" /> },
              { label: 'Gender', value: contract.customer.gender, icon: <Users className="card-icon" /> },
              { label: 'Preferred Location', value: contract.customer.preferredLocation, icon: <MapPin className="card-icon" /> }
            ].map(({ label, value, icon }) => (
              <div key={label} className="info-tile">
                <div className="tile-icon">
                  {icon}
                </div>
                <div className="tile-content">
                  <p className="tile-label">{label}</p>
                  <p className="tile-value">{value || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Customer Details Section */}
        <div className="section additional-details">
          <div className="section-header">
            <UserCheck className="section-icon" />
            <h2 className="section-title">Additional Customer Details</h2>
          </div>
          <div className="details-grid">
            {[
              { label: 'Preferences', value: contract.customer.preferences },
              { label: 'Life Style', value: contract.customer.lifeStyle },
              { label: 'Budget Range', value: formatPrice(contract.customer.budgetRange) },
              { label: 'Requirements', value: contract.customer.requirement }
            ].map(({ label, value }) => (
              <div key={label} className="detail-card">
                <p className="detail-label">{label}</p>
                <p className="detail-value">{value || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upload/Update Section */}
{(contract.status === "Proccessing" || contract.status === "Active") && (
  <div className="upload-section">
    <div className="upload-buttons">
      {contract.status === "Proccessing" && (
        <>
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handleContractUpload}
            className="file-input" 
            id="contract-upload"
            disabled={uploadLoading}
          />
          <label 
            htmlFor="contract-upload" 
            className={`upload-button ${uploadLoading ? 'loading' : ''}`}
          >
            {uploadLoading ? (
              <div className="loading-text">
                <div className="upload-spinner"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              <>
                <Upload className="icon" />
                <span>Upload Contract PDF</span>
              </>
            )}
          </label>
          
          <button
            onClick={handleGenerateTemplate}
            className={`generate-button ${uploadLoading ? 'loading' : ''}`}
            disabled={uploadLoading}
          >
            <FileText className="icon" />
            <span>Generate Template</span>
          </button>
        </>
      )}

      {contract.status === "Active" && (
        <>
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handleContractUpdate}
            className="file-input" 
            id="contract-update"
            disabled={uploadLoading}
          />
          <label 
            htmlFor="contract-update" 
            className={`upload-button ${uploadLoading ? 'loading' : ''}`}
          >
            {uploadLoading ? (
              <div className="loading-text">
                <div className="upload-spinner"></div>
                <span>Updating...</span>
              </div>
            ) : (
              <>
                <Upload className="icon" />
                <span>Update Contract PDF</span>
              </>
            )}
          </label>
        </>
      )}
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default ContractLandDetail;