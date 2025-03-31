import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getContractDetail, confirmContractAndCreateRoomStay } from "../../Services/Landlord/contractLandlord";
import { ArrowLeft, FileText, User, Home, Calendar, Clock, Upload, Tag, MapPin, CreditCard, UserCheck } from "lucide-react";
import { toast } from "react-toastify";
import { Phone, Mail, Users } from 'lucide-react';

const ContractLandDetail = () => {
  const { contractId } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);

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

  const formatDate = (dateString) => {
    return dateString 
      ? new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'N/A';
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

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'expired': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="spinner animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="container mx-auto px-4 py-8 text-center bg-gray-50 min-h-screen">
        <p className="text-gray-500 text-xl">No contract found.</p>
      </div>
    );
  }

  return (
    <div className="contract-detail bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="detail-card max-w-6xl w-full mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-5 flex items-center justify-between">
          <button 
            onClick={() => window.history.back()}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="h-7 w-7" />
          </button>
          <div className="flex items-center space-x-3 text-white">
            <FileText className="h-6 w-6" />
            <h1 className="text-2xl font-bold tracking-wide">Contract Details</h1>
          </div>
        </div>

        {/* Contract Overview */}
        <div className="grid md:grid-cols-2 gap-6 p-6 border-b border-gray-200">
          <div>
            <div className="flex items-center mb-4">
              <Tag className="h-5 w-5 mr-3 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-700">Contract Overview</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <p className="text-xs text-gray-500 mb-1">Contract ID</p>
                <p className="font-medium text-gray-800">{contract.contractId}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}>
                  {contract.status}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <p className="text-xs text-gray-500 mb-1">Create Date</p>
                <p className="font-medium text-gray-800">{formatDate(contract.createDate)}</p>
              </div>
              {contract.status === "Active" && (
                <div className="mt-4">
                  <button
                    onClick={handleTermClick}
                    className="px-6 py-3 rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    View Contract Term (PDF)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Contract Dates */}
          <div>
            <div className="flex items-center mb-4">
              <Calendar className="h-5 w-5 mr-3 text-purple-500" />
              <h2 className="text-lg font-semibold text-gray-700">Contract Dates</h2>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <p className="text-xs text-gray-500 mb-1">Start Date</p>
                <p className="font-medium text-gray-800">{formatDate(contract.startDate)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <p className="text-xs text-gray-500 mb-1">End Date</p>
                <p className="font-medium text-gray-800">{formatDate(contract.endDate)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <p className="text-xs text-gray-500 mb-1 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Duration Rental
                </p>
                <p className="font-medium text-green-600">{formatDurationRental(contract.durationOfRental)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Room Details */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Home className="h-5 w-5 mr-3 text-green-500" />
            Room Information
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[ 
              { label: 'Room Number', value: contract.room.roomNumber, icon: <Home className="h-5 w-5 text-green-500" /> },
              { label: 'Room Type', value: contract.room.roomTypeName, icon: <Tag className="h-5 w-5 text-blue-500" /> },
              { label: 'Location', value: contract.room.location, icon: <MapPin className="h-5 w-5 text-red-500" /> },
              { label: 'Deposit', value: `$${contract.room.deposite || 0}`, icon: <CreditCard className="h-5 w-5 text-purple-500" /> },
              { label: 'Max Occupancy', value: contract.room.maxOccupancy, icon: <Users className="h-5 w-5 text-orange-500" /> },
              { label: 'Room Type Status', value: contract.room.roomTypeStatus, icon: <Home className="h-5 w-5 text-green-500" /> }
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-gray-50 p-3 rounded-lg flex items-center shadow-md">
                <div className="mr-3">{icon}</div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className="font-medium text-gray-800">{value || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Information */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <User className="h-5 w-5 mr-3 text-blue-500" />
            Customer Information
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[ 
              { label: 'Full Name', value: contract.customer.fullName, icon: <User className="h-5 w-5 text-blue-500" /> },
              { label: 'Phone Number', value: contract.customer.phoneNumber, icon: <Phone className="h-5 w-5 text-green-500" /> },
              { label: 'Email', value: contract.customer.email, icon: <Mail className="h-5 w-5 text-red-500" /> },
              { label: 'Customer Type', value: contract.customer.customerType, icon: <UserCheck className="h-5 w-5 text-purple-500" /> },
              { label: 'Gender', value: contract.customer.gender, icon: <Users className="h-5 w-5 text-pink-500" /> },
              { label: 'Preferred Location', value: contract.customer.preferredLocation, icon: <MapPin className="h-5 w-5 text-orange-500" /> }
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-gray-50 p-3 rounded-lg flex items-center">
                <div className="mr-3">{icon}</div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className="font-medium text-gray-800">{value || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

       

        {/* Additional Customer Details */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <UserCheck className="h-5 w-5 mr-3 text-purple-500" />
            Additional Customer Details
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Preferences', value: contract.customer.preferences },
              { label: 'Life Style', value: contract.customer.lifeStyle },
              { label: 'Budget Range', value: contract.customer.budgetRange },
              { label: 'Requirements', value: contract.customer.requirement }
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="font-medium text-gray-800">{value || 'N/A'}</p>
              </div>
            ))}
          </div>
          
        </div>

        {contract.status === "Pending" && (
          <div className="px-6 py-5 border-t border-gray-200 flex justify-center">
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileUpload}
              className="hidden" 
              id="contract-upload"
              disabled={uploadLoading}
            />
            <label 
              htmlFor="contract-upload" 
              className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-semibold transition-colors ${
                uploadLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 cursor-pointer'
              }`}
            >
              {uploadLoading ? (
                <div className="flex items-center">
                  <div className="spinner animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Uploading...
                </div>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Contract PDF
                </>
              )}
            </label>
          </div>
          
        )}
      </div>
    </div>
    
  );
};

export default ContractLandDetail;