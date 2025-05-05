import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Tag, Row, Col, Spin, 
  Empty, Pagination, Space, Input, Badge,
  Image, Button, Tooltip, Tabs, Table, Avatar,
  Dropdown, Menu, Statistic, Segmented, Modal
} from 'antd';
import { 
  HomeOutlined, DollarOutlined, UserOutlined, 
  SearchOutlined, LoadingOutlined, FilterOutlined,
  EditOutlined, DeleteOutlined, EyeOutlined, CloseOutlined,
  MailOutlined, PhoneOutlined, ClockCircleOutlined,
  PlusOutlined, EnvironmentOutlined, TeamOutlined,
  AreaChartOutlined, AppstoreOutlined, UnorderedListOutlined,
  EllipsisOutlined, StarOutlined, BellOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import roomAPI from '../../Services/Room/roomAPI';
import postAPI from '../../Services/Post/postAPI';
import './PostList.scss';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

const PostList = () => {
  const navigate = useNavigate();
  
  // States for Room List Tab
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState('list');

  // States for Post List Tab
  const [postList, setPostList] = useState([]);
  const [postLoading, setPostLoading] = useState(true);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('1');

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  
  // State for room deletion modal
  const [isRoomDeleteModalVisible, setIsRoomDeleteModalVisible] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchPostList();
  }, []);

  useEffect(() => {
    const filteredPosts = searchQuery
      ? allPosts.filter(post => 
          post.roomNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.location?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : allPosts;

    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    setPosts(paginatedPosts);
    setTotal(filteredPosts.length);
  }, [allPosts, pageIndex, pageSize, searchQuery]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await roomAPI.getLandlordRooms(1, 100);
      if (response.isSuccess) {
        setAllPosts(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch posts');
      }
    } catch (error) {
      toast.error('Failed to fetch posts');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostList = async () => {
    try {
      setPostLoading(true);
      const data = await postAPI.getLandlordCustomerPosts();
      setPostList(data);
    } catch (error) {
      toast.error('Failed to fetch post list');
      console.error('Error:', error);
    } finally {
      setPostLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPageIndex(1);
  };

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const clearSearch = () => {
    setSearchValue('');
    setSearchQuery('');
    setPageIndex(1);
  };

  const handlePageChange = (page, size) => {
    setPageIndex(page);
    setPageSize(size);
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'Available':
        return <Tag color="success" icon={<StarOutlined />}>Available</Tag>;
      case 'Renting':
        return <Tag color="warning" icon={<BellOutlined />}>Renting</Tag>;
      case 'Active':
        return <Tag color="success" icon={<StarOutlined />}>Active</Tag>;
      case 'Inactive':
        return <Tag color="error" icon={<CloseOutlined />}>Inactive</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setIsDeleteModalVisible(true);
  };
  
  // Function to handle room delete button click
  const handleRoomDeleteClick = (room) => {
    setRoomToDelete(room);
    setIsRoomDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    
    try {
      const result = await postAPI.inactivatePost(postToDelete.postId);
      toast.success(result.message || 'Post inactivated successfully');
      // Refresh the post list
      fetchPostList();
    } catch (error) {
      toast.error('Failed to inactivate post');
      console.error('Error:', error);
    } finally {
      setIsDeleteModalVisible(false);
      setPostToDelete(null);
    }
  };
  
// Function to handle room deletion confirmation
// Function to handle room deletion confirmation
const handleConfirmRoomDelete = async () => {
  if (!roomToDelete) return;
  
  try {
    // Find the active postRoom from the postRooms array
    const activePostRoom = roomToDelete.postRooms?.find(post => post.status === "Active");
    
    if (!activePostRoom) {
      toast.error('No active post found for this room');
      return;
    }
    
    const postRoomId = activePostRoom.postRoomId;
    console.log('postRoomId to deactivate:', postRoomId);

    const result = await roomAPI.inactivePostRoom(postRoomId);
    toast.success('Room post deactivated successfully');
    // Refresh the room list
    fetchPosts();
  } catch (error) {
    toast.error('Failed to deactivate room post');
    console.error('Error:', error);
  } finally {
    setIsRoomDeleteModalVisible(false);
    setRoomToDelete(null);
  }
};

  // Navigation functions
  const navigateToCreatePost = () => {
    navigate('/landlord/post/create-room-post');
  };

  const navigateToRoomDetail = (roomId) => {
    navigate(`/landlord/post/roompostdetail/${roomId}`);
  };
  
  const navigateToPostDetail = (postId) => {
    navigate(`/landlord/post/post-detail-cus/${postId}`);
  };

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // Room action menu
  const roomActionMenu = (room) => (
    <Menu>
      <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => navigateToRoomDetail(room.roomId)}>
        View Details
      </Menu.Item>
      <Menu.Item 
        key="delete" 
        danger 
        icon={<DeleteOutlined />} 
        onClick={(e) => {
          e.domEvent.stopPropagation();
          handleRoomDeleteClick(room);
        }}
      >
        Delete Post
      </Menu.Item>
    </Menu>
  );

  // Post list columns
  const postListColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (price) => (
        <Text strong style={{ color: '#1677ff' }}>
          {formatPrice(price)}
        </Text>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status)
    },
    {
      title: 'Customer',
      key: 'customer',
      width: 300,
      render: (_, record) => (
        <Space className="customer-info">
          <Avatar 
            src={record.customerAvatar} 
            size="large"
            icon={<UserOutlined />}
          />
          <Space direction="vertical" size={0}>
            <Text strong>{record.customerName}</Text>
            <Space size={12}>
              <Text type="secondary">
                <MailOutlined /> {record.customerEmail}
              </Text>
            </Space>
          </Space>
        </Space>
      )
    },
    {
      title: 'Phone',
      dataIndex: 'customerPhone',
      key: 'customerPhone',
      width: 200
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => (
        <Text type="secondary">
          <ClockCircleOutlined style={{ marginRight: 8 }} />
          {formatDate(date)}
        </Text>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="middle"
            onClick={() => navigateToPostDetail(record.postId)}
          >
            View
          </Button>
          <Button 
            danger
            icon={<DeleteOutlined />}
            size="middle"
            onClick={() => handleDeleteClick(record)}
          >
            Remove
          </Button>
        </Space>
      )
    }
  ];

  const renderLoadingState = () => (
    <div className="loading-container">
      <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      <Text strong style={{ marginTop: 16, fontSize: 16 }}>Loading your properties...</Text>
    </div>
  );

  const renderRoomListHeader = () => (
    <div className="tab-header">
      <div className="left-section">
        <Title level={4}>Your Properties</Title>
        <Text type="secondary">Manage your property listings and room posts</Text>
      </div>
      
      <div className="right-section">
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={navigateToCreatePost}
        >
          Create Room Post
        </Button>
      </div>
    </div>
  );

  const renderSearchAndFilters = () => (
    <div className="search-container">
      <div className="search-wrapper">
        <Input
          placeholder="Search by title, room number, or location..."
          prefix={<SearchOutlined className="search-icon" />}
          value={searchValue}
          onChange={onSearchChange}
          onPressEnter={() => handleSearch(searchValue)}
          suffix={
            searchValue ? 
            <CloseOutlined onClick={clearSearch} className="clear-icon" /> : 
            null
          }
        />
        <Button 
          type="primary" 
          onClick={() => handleSearch(searchValue)}
        >
          Search
        </Button>
      </div>
      
      <div className="view-controls">
        <Segmented
          value={viewMode}
          onChange={setViewMode}
          options={[
            {
              value: 'grid',
              icon: <AppstoreOutlined />,
              label: 'Grid'
            },
            {
              value: 'list',
              icon: <UnorderedListOutlined />,
              label: 'List'
            }
          ]}
        />
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <Empty 
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <Space direction="vertical" size="small">
          <Text strong style={{ fontSize: 16 }}>
            {searchQuery 
              ? `No properties found matching "${searchQuery}"` 
              : "No properties found"
            }
          </Text>
          <Text type="secondary">
            {searchQuery 
              ? "Try using different keywords or clear your search" 
              : "Add your first property to get started"
            }
          </Text>
        </Space>
      } 
      className="empty-state"
    >
      
    </Empty>
  );

  const renderGridView = () => (
    <Row gutter={[24, 24]} className="post-grid">
      {posts.map((post) => (
        <Col xs={24} md={12} xl={8} key={post.roomId}>
          <Card 
            className="post-card"
            cover={
              <div className="post-image-container">
                <Image
                  src={post.roomImages?.[0]?.imageUrl || 'https://via.placeholder.com/640x360'}
                  alt={post.title}
                  preview={false}
                  className="post-image"
                />
                {post.roomImages?.length > 0 && (
                  <div className="image-count-badge">
                    <EyeOutlined /> {post.roomImages.length} photos
                  </div>
                )}
                {getStatusTag(post.status)}
              </div>
            }
            actions={[
              <Button 
                type="text" 
                icon={<EyeOutlined />}
                onClick={() => navigateToRoomDetail(post.roomId)}
              >
                View
              </Button>,
              <Button type="text" icon={<EditOutlined />}>
                Edit
              </Button>,
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
                onClick={() => handleRoomDeleteClick(post)}
              >
                Delete
              </Button>
            ]}
          >
            <div className="post-content">
              <Title level={4} className="post-title">{post.title}</Title>
              
              <div className="post-meta">
                <Text className="location">
                  <EnvironmentOutlined /> {post.location}
                </Text>
                <Statistic 
                  value={post.price} 
                  prefix={<DollarOutlined />}
                  suffix="/month"
                  valueStyle={{ 
                    color: '#1677ff',
                    fontSize: '18px',
                    fontWeight: 600 
                  }}
                  className="price-display"
                />
              </div>

              <div className="post-details">
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <div className="detail-item">
                      <HomeOutlined />
                      <div>
                        <Text type="secondary">Room</Text>
                        <Text strong>{post.roomNumber}</Text>
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="detail-item">
                      <AreaChartOutlined />
                      <div>
                        <Text type="secondary">Area</Text>
                        <Text strong>{post.area}m²</Text>
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="detail-item">
                      <TeamOutlined />
                      <div>
                        <Text type="secondary">Max</Text>
                        <Text strong>{post.maxOccupancy}</Text>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="post-amenities">
                <Text type="secondary">Amenities</Text>
                <div className="amenities-list">
                  {(post.roomAmentiesLists || []).slice(0, 4).map((amenity) => (
                    <Tag key={amenity.amenityId} className="amenity-tag">{amenity.name}</Tag>
                  ))}
                  {(post.roomAmentiesLists || []).length > 4 && (
                    <Tag className="more-tag">+{post.roomAmentiesLists.length - 4} more</Tag>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const renderListView = () => (
    <Table
      dataSource={posts}
      rowKey="roomId"
      pagination={false}
      className="room-list-table"
      columns={[
        {
          title: 'Property',
          key: 'property',
          render: (_, post) => (
            <Space size={16}>
              <Image
                src={post.roomImages?.[0]?.imageUrl || 'https://via.placeholder.com/120x80'}
                alt={post.title}
                preview={false}
                width={120}
                height={80}
                style={{ borderRadius: '8px', objectFit: 'cover' }}
              />
              <Space direction="vertical" size={4}>
                <Text strong style={{ fontSize: '16px' }}>{post.title}</Text>
                <Text type="secondary">
                  <EnvironmentOutlined /> {post.location}
                </Text>
                <Space size={12}>
                  <Text type="secondary"><HomeOutlined /> Room {post.roomNumber}</Text>
                  <Text type="secondary"><AreaChartOutlined /> {post.area}m²</Text>
                </Space>
              </Space>
            </Space>
          )
        },
        {
          title: 'Price',
          dataIndex: 'price',
          key: 'price',
          width: 150,
          render: (price) => (
            <Text strong style={{ color: '#1677ff', fontSize: '16px' }}>
              {formatPrice(price)}
            </Text>
          )
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          width: 120,
          render: (status) => getStatusTag(status)
        },
        {
          title: 'Type',
          dataIndex: 'roomTypeName',
          key: 'roomTypeName',
          width: 120
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 180,
          render: (_, post) => (
            <Space>
              <Button 
                type="primary" 
                icon={<EyeOutlined />} 
                size="middle"
                onClick={() => navigateToRoomDetail(post.roomId)}
              >
                View
              </Button>
              <Button 
                danger
                icon={<DeleteOutlined />}
                size="middle"
                onClick={() => handleRoomDeleteClick(post)}
              >
                Delete
              </Button>
            </Space>
          )
        }
      ]}
    />
  );

  const renderPagination = () => (
    total > pageSize && (
      <div className="pagination-container">
        <Pagination
          current={pageIndex}
          pageSize={pageSize}
          total={total}
          onChange={handlePageChange}
          showQuickJumper
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} properties`}
        />
      </div>
    )
  );

  if (loading && activeTab === '1') {
    return renderLoadingState();
  }

  if (postLoading && activeTab === '2') {
    return renderLoadingState();
  }

  return (
    <div className="post-list-section">
      <ToastContainer position="top-right" autoClose={3000} />
      <Tabs defaultActiveKey="1" onChange={handleTabChange} className="post-list-tabs">
        <TabPane tab={<span><AppstoreOutlined /> Properties</span>} key="1">
          {renderRoomListHeader()}
          {renderSearchAndFilters()}

          {posts.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              {viewMode === 'grid' ? renderGridView() : renderListView()}
              {renderPagination()}
            </>
          )}
        </TabPane>

        <TabPane tab={<span><UserOutlined /> Customer Posts</span>} key="2">
          <div className="tab-header">
            <div className="left-section">
              <Title level={4}>Customer Inquiries</Title>
              <Text type="secondary">Manage customer post requests for your properties</Text>
            </div>
          </div>
          
          <div className="search-container">
            <div className="search-wrapper">
              <Input
                placeholder="Search by customer name or room title..."
                prefix={<SearchOutlined className="search-icon" />}
                suffix={<FilterOutlined />}
              />
              <Button type="primary">Search</Button>
            </div>
          </div>

          <Table
            columns={postListColumns}
            dataSource={postList}
            rowKey="postId"
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} inquiries`
            }}
            className="post-list-table"
          />
        </TabPane>
      </Tabs>

      {/* Modal for Customer Post deletion */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setPostToDelete(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to remove this post?</p>
        {postToDelete && (
          <div style={{ marginTop: '16px' }}>
            <p><strong>Title:</strong> {postToDelete.title}</p>
            <p><strong>Customer:</strong> {postToDelete.customerName}</p>
          </div>
        )}
      </Modal>

      {/* Modal for Room Post deletion */}
      <Modal
        title="Confirm Delete"
        open={isRoomDeleteModalVisible}
        onOk={handleConfirmRoomDelete}
        onCancel={() => {
          setIsRoomDeleteModalVisible(false);
          setRoomToDelete(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to deactivate this room post?</p>
        {roomToDelete && (
          <div style={{ marginTop: '16px' }}>
            <p><strong>Title:</strong> {roomToDelete.title}</p>
            <p><strong>Room Number:</strong> {roomToDelete.roomNumber}</p>
            <p><strong>Location:</strong> {roomToDelete.location}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PostList;