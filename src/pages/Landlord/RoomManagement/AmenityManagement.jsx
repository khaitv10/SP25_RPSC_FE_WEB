import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Spin,
  Empty,
  Tag,
  Skeleton,
  Typography,
  Modal,
  Form,
  Input,
  InputNumber,
  Pagination,
  Space,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  AppstoreOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UnorderedListOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  getAllAmenities,
  createAmenity,
  UpdateAmenity,
  DeleteAmenity,
} from "../../../Services/Landlord/amenityAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AmenityManagement.scss";

const { Title, Text } = Typography;

const AmenityManagement = () => {
  const [isAmenityModalOpen, setIsAmenityModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [deletingAmenity, setDeletingAmenity] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Pagination and search states
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchAmenities(searchQuery, currentPage, pageSize);
  }, [currentPage, pageSize, searchQuery]);

  const fetchAmenities = async (search = "", page = 1, size = 6) => {
    setLoading(true);
    try {
      const response = await getAllAmenities(search, page, size);
      console.log("Fetched Amenities Data: ", response);

      if (response?.amenties && Array.isArray(response.amenties)) {
        setAmenities(response.amenties);
        setTotalItems(response.totalAmenties || 0);
      } else {
        // toast.error("Invalid data format: Expected 'amenties' array");
      }
    } catch (error) {
      //toast.error("Error fetching amenities");
      //console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAmenity = async () => {
    try {
      // Validate form fields
      const values = await form.validateFields();
      setSubmitting(true);

      // Prepare data according to the API request model
      const amenityData = {
        name: values.name,
        compensation: values.compensation,
      };

      // Call the create API
      const response = await createAmenity(amenityData);

      // Show success message
      toast.success("Amenity created successfully!");

      // Close modal and reset form
      setIsAmenityModalOpen(false);
      form.resetFields();

      // Refresh the amenities list
      fetchAmenities(searchQuery, currentPage, pageSize);
    } catch (error) {
      if (error.errorInfo) {
        // This is a form validation error
        console.log("Form validation failed:", error);
      } else {
        // This is an API error
        toast.error(
          "Failed to create amenity: " + (error.message || "Unknown error"),
        );
        console.error("API Error:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsAmenityModalOpen(false);
    form.resetFields();
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    setSearchQuery(searchValue);
  };

  const handleReset = () => {
    setSearchValue("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const getStatusTag = (status) => {
    if (status.toLowerCase() === "active") {
      return (
        <Tag color="success" icon={<CheckCircleOutlined />}>
          {status}
        </Tag>
      );
    } else {
      return (
        <Tag color="error" icon={<CloseCircleOutlined />}>
          {status}
        </Tag>
      );
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Loading skeletons
  const renderSkeletons = () => {
    return Array(pageSize)
      .fill(null)
      .map((_, index) => (
        <Card key={`skeleton-${index}`} className="amenity-card">
          <Skeleton active avatar paragraph={{ rows: 2 }} />
        </Card>
      ));
  };

  const handleEdit = (amenity) => {
    setEditingAmenity(amenity);
    editForm.setFieldsValue({
      name: amenity.name,
      compensation: amenity.compensation,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateAmenity = async () => {
    try {
      const values = await editForm.validateFields();
      setSubmitting(true);

      const amenityData = {
        name: values.name,
        compensation: values.compensation,
      };

      await UpdateAmenity(amenityData, editingAmenity.roomAmentyId);
      toast.success("Amenity updated successfully!");
      setIsEditModalOpen(false);
      editForm.resetFields();
      fetchAmenities(searchQuery, currentPage, pageSize);
    } catch (error) {
      if (error.errorInfo) {
        console.log("Form validation failed:", error);
      } else {
        toast.error(
          "Failed to update amenity: " + (error.message || "Unknown error"),
        );
        console.error("API Error:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    editForm.resetFields();
    setEditingAmenity(null);
  };

  const handleDelete = (amenity) => {
    setDeletingAmenity(amenity);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setSubmitting(true);
      await DeleteAmenity(deletingAmenity.roomAmentyId);

      toast.success("Amenity deleted successfully!");
      setIsDeleteModalOpen(false);
      setDeletingAmenity(null);
      fetchAmenities(searchQuery, currentPage, pageSize);
    } catch (error) {
      toast.error(
        "Failed to delete amenity: " + (error.message || "Unknown error"),
      );
      console.error("API Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingAmenity(null);
  };

  return (
    <div className="amenity-management">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <Title level={2} className="title">
            <span className="icon">✨</span> My Amenities
          </Title>
          <Text type="secondary" className="subtitle">
            Manage your property amenities in one place
          </Text>
        </div>

        <div className="action-buttons">
          <Button
            className="view-toggle-btn"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            icon={
              viewMode === "grid" ? (
                <UnorderedListOutlined />
              ) : (
                <AppstoreOutlined />
              )
            }
          >
            {viewMode === "grid" ? "List View" : "Grid View"}
          </Button>

          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setIsAmenityModalOpen(true)}
            className="create-btn"
          >
            Create New Amenity
          </Button>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="stats-overview">
        <Card className="stat-card">
          <div className="stat-icon total-icon">
            <AppstoreOutlined />
          </div>
          <div className="stat-content">
            <Text type="secondary">Total Amenities</Text>
            <Title level={3}>{totalItems}</Title>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon active-icon">
            <CheckCircleOutlined />
          </div>
          <div className="stat-content">
            <Text type="secondary">Active</Text>
            <Title level={3}>
              {
                amenities.filter(
                  (item) => item.status?.toLowerCase() === "active",
                ).length
              }
            </Title>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon inactive-icon">
            <CloseCircleOutlined />
          </div>
          <div className="stat-content">
            <Text type="secondary">Inactive</Text>
            <Title level={3}>
              {
                amenities.filter(
                  (item) => item.status?.toLowerCase() !== "active",
                ).length
              }
            </Title>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <Input
          placeholder="Search amenities..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onPressEnter={handleSearch}
          prefix={<SearchOutlined className="search-icon" />}
          suffix={
            <Space>
              {searchValue && (
                <Button
                  type="text"
                  size="small"
                  onClick={() => setSearchValue("")}
                >
                  Clear
                </Button>
              )}
              <Button type="primary" onClick={handleSearch}>
                Search
              </Button>
              <Tooltip title="Reset filters">
                <Button icon={<ReloadOutlined />} onClick={handleReset} />
              </Tooltip>
            </Space>
          }
          className="search-input"
        />
      </div>

      {/* Amenities List */}
      <div className={`amenity-container ${viewMode}-view`}>
        {loading ? (
          renderSkeletons()
        ) : amenities.length === 0 ? (
          <Empty
            description={
              searchQuery
                ? "No amenities match your search"
                : "No amenities found"
            }
            className="empty-state"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          amenities.map((amenity) => (
            <Card
              key={amenity.roomAmentyId}
              className="amenity-card"
              hoverable
              actions={[
                <Button
                  type="text"
                  key="edit"
                  onClick={() => handleEdit(amenity)}
                >
                  Edit
                </Button>,
                <Button
                  type="text"
                  danger
                  key="delete"
                  onClick={() => handleDelete(amenity)}
                >
                  Delete
                </Button>,
              ]}
            >
              <div className="amenity-header">
                <div className="amenity-icon">
                  {amenity.name?.charAt(0) || "A"}
                </div>
                <div className="amenity-title">
                  <Title level={4}>{amenity.name}</Title>
                  {getStatusTag(amenity.status || "Inactive")}
                </div>
              </div>

              <div className="amenity-details">
                <div className="detail-item">
                  <DollarOutlined className="detail-icon" />
                  <div className="detail-content">
                    <Text type="secondary">Compensation</Text>
                    <Text strong className="compensation">
                      {formatCurrency(amenity.compensation || 0)}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && amenities.length > 0 && (
        <div className="pagination-container">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={["6", "12", "24", "48"]}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
          />
        </div>
      )}

      {/* Create Amenity Modal */}
      <Modal
        title={
          <div className="modal-title">
            <PlusOutlined className="modal-icon" />
            <span>Create New Amenity</span>
          </div>
        }
        open={isAmenityModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            onClick={handleCreateAmenity}
          >
            Create
          </Button>,
        ]}
        className="amenity-modal"
      >
        <Form form={form} layout="vertical" className="amenity-form">
          <Form.Item
            name="name"
            label="Amenity Name"
            rules={[
              { required: true, message: "Please enter the amenity name" },
              { max: 100, message: "Name cannot exceed 100 characters" },
            ]}
          >
            <Input placeholder="Enter amenity name" />
          </Form.Item>

          <Form.Item
            name="compensation"
            label="Compensation (VNĐ)"
            rules={[
              {
                required: true,
                message: "Please enter the compensation amount",
              },
              {
                type: "number",
                min: 0,
                message: "Compensation must be a positive value",
              },
            ]}
          >
            <InputNumber
              placeholder="Enter compensation amount"
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              min={0}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Amenity Modal */}
      <Modal
        title={
          <div className="modal-title">
            <PlusOutlined className="modal-icon" />
            <span>Edit Amenity</span>
          </div>
        }
        open={isEditModalOpen}
        onCancel={handleCancelEdit}
        footer={[
          <Button key="cancel" onClick={handleCancelEdit}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            onClick={handleUpdateAmenity}
          >
            Update
          </Button>,
        ]}
        className="amenity-modal"
      >
        <Form form={editForm} layout="vertical" className="amenity-form">
          {/* <Form.Item name="roomAmentyId" label="Amenity ID">
            <Input disabled value={editingAmenity?.roomAmentyId} />
          </Form.Item> */}

          <Form.Item
            name="name"
            label="Amenity Name"
            rules={[
              { required: true, message: "Please enter the amenity name" },
              { max: 100, message: "Name cannot exceed 100 characters" },
            ]}
          >
            <Input placeholder="Enter amenity name" />
          </Form.Item>

          <Form.Item
            name="compensation"
            label="Compensation (VNĐ)"
            rules={[
              {
                required: true,
                message: "Please enter the compensation amount",
              },
              {
                type: "number",
                min: 0,
                message: "Compensation must be a positive value",
              },
            ]}
          >
            <InputNumber
              placeholder="Enter compensation amount"
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              min={0}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <div className="modal-title">
            <ExclamationCircleOutlined
              className="modal-icon"
              style={{ color: "#ff4d4f" }}
            />
            <span>Delete Amenity</span>
          </div>
        }
        open={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        footer={[
          <Button key="cancel" onClick={handleCancelDelete}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            loading={submitting}
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>,
        ]}
        className="amenity-modal"
      >
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this amenity?</p>
          {deletingAmenity && (
            <div className="amenity-details mt-3">
              <p>
                <strong>Name:</strong> {deletingAmenity.name}
              </p>
              <p>
                <strong>Compensation:</strong>{" "}
                {formatCurrency(deletingAmenity.compensation)}
              </p>
            </div>
          )}
          <p className="warning-text">This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
};

export default AmenityManagement;
