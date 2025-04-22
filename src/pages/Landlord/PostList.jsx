import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Tag, Row, Col, Spin, 
  Empty, Pagination, Space, Input, Alert, Badge,
  Image, Divider, Button, Tooltip, Tabs, Table, Avatar
} from 'antd';
import { 
  HomeOutlined, DollarOutlined, UserOutlined, 
  SearchOutlined, LoadingOutlined, InfoCircleOutlined,
  EditOutlined, DeleteOutlined, EyeOutlined, CloseOutlined,
  MailOutlined, PhoneOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import roomAPI from '../../Services/Room/roomAPI';
import postAPI from '../../Services/Post/postAPI';
import './PostList.scss';

const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

const PostList = () => {
  // States for Room List Tab
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [total, setTotal] = useState(0);

  // States for Post List Tab
  const [postList, setPostList] = useState([]);
  const [postLoading, setPostLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    fetchPostList();
  }, []);

  useEffect(() => {
    const filteredPosts = searchQuery
      ? allPosts.filter(post => 
          post.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        return <Tag color="green">Available</Tag>;
      case 'Renting':
        return <Tag color="orange">Renting</Tag>;
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
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleInactivatePost = async (postId) => {
    try {
      const result = await postAPI.inactivatePost(postId);
      toast.success(result.message || 'Post inactivated successfully');
      // Refresh the post list
      fetchPostList();
    } catch (error) {
      toast.error('Failed to inactivate post');
      console.error('Error:', error);
    }
  };

  const postListColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Room',
      dataIndex: 'roomTitle',
      key: 'roomTitle',
      width: 200
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (price) => formatPrice(price)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Customer',
      key: 'customer',
      width: 300,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <Avatar 
              src={record.customerAvatar} 
              size="large"
              icon={<UserOutlined />}
            />
            <Space direction="vertical" size={0}>
              <Text strong>{record.customerName}</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {record.customerEmail}
              </Text>
            </Space>
          </Space>
          <Space>
            <PhoneOutlined style={{ color: '#1890ff' }} />
            <Text>{record.customerPhone}</Text>
          </Space>
        </Space>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (date) => (
        <Space>
          <ClockCircleOutlined style={{ color: '#1890ff' }} />
          <Text>{formatDate(date)}</Text>
        </Space>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button type="text" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="Inactivate Post">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              onClick={() => handleInactivatePost(record.postId)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  if (loading || postLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="post-list-section">
      <Tabs defaultActiveKey="1" className="post-list-tabs">
        <TabPane tab="Room List" key="1">
          <Alert
            message="Room Posts"
            description="Manage and view all your room listings. You can edit, delete, or view details of each post."
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            closable
            style={{ 
              marginBottom: '32px', 
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)'
            }}
          />

          <div className="search-container">
            <Space>
              <Search
                placeholder="Search by room number or title"
                allowClear
                enterButton={<Button type="primary" icon={<SearchOutlined />}>Search</Button>}
                size="large"
                value={searchValue}
                onChange={onSearchChange}
                onSearch={handleSearch}
                style={{ width: 400 }}
              />
              {searchQuery && (
                <Button onClick={clearSearch} type="text" icon={<CloseOutlined />}>Clear</Button>
              )}
            </Space>
          </div>

          {posts.length === 0 ? (
            <Empty 
              description={
                searchQuery 
                  ? `No posts found matching "${searchQuery}"` 
                  : "No posts found"
              } 
              style={{ 
                margin: '40px 0',
                padding: '40px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)'
              }}
            />
          ) : (
            <>
              <Row gutter={[24, 24]} className="post-grid">
                {posts.map((post) => (
                  <Col xs={24} sm={12} lg={8} key={post.roomId}>
                    <Card 
                      className="post-card"
                      cover={
                        <div className="post-image-container">
                          <Image
                            src={post.roomImages[0]?.imageUrl}
                            alt={post.title}
                            preview={false}
                            className="post-image"
                          />
                          <Badge 
                            count={post.roomImages.length} 
                            className="image-count-badge"
                            showZero
                          >
                            <EyeOutlined />
                          </Badge>
                        </div>
                      }
                      actions={[
                        <Tooltip title="View Details">
                          <Button type="text" icon={<EyeOutlined />} />
                        </Tooltip>,
                        <Tooltip title="Edit Post">
                          <Button type="text" icon={<EditOutlined />} />
                        </Tooltip>,
                        <Tooltip title="Delete Post">
                          <Button type="text" danger icon={<DeleteOutlined />} />
                        </Tooltip>
                      ]}
                    >
                      <div className="post-content">
                        <div className="post-header">
                          <Title level={4} className="post-title">{post.title}</Title>
                          {getStatusTag(post.status)}
                        </div>
                        
                        <div className="post-meta">
                          <Space>
                            <Text><HomeOutlined /> Room {post.roomNumber}</Text>
                            <Text><DollarOutlined /> {formatPrice(post.price)}/month</Text>
                          </Space>
                        </div>

                        <div className="post-details">
                          <Row gutter={[16, 16]}>
                            <Col span={12}>
                              <Text strong>Location:</Text>
                              <Text>{post.location}</Text>
                            </Col>
                            <Col span={12}>
                              <Text strong>Room Type:</Text>
                              <Text>{post.roomTypeName}</Text>
                            </Col>
                            <Col span={12}>
                              <Text strong>Area:</Text>
                              <Text>{post.area}m²</Text>
                            </Col>
                            <Col span={12}>
                              <Text strong>Max Occupancy:</Text>
                              <Text>{post.maxOccupancy} people</Text>
                            </Col>
                          </Row>
                        </div>

                        <div className="post-amenities">
                          <Text strong>Amenities:</Text>
                          <div className="amenities-list">
                            {post.roomAmentiesLists.map((amenity) => (
                              <Tag key={amenity.amenityId}>{amenity.name}</Tag>
                            ))}
                          </div>
                        </div>

                        <div className="post-services">
                          <Text strong>Services:</Text>
                          <div className="services-list">
                            {post.roomServices.map((service) => (
                              <Tag key={service.serviceId}>
                                {service.serviceName} ({formatPrice(service.cost)}/unit)
                              </Tag>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              {total > pageSize && (
                <div className="pagination-container">
                  <Pagination
                    current={pageIndex}
                    pageSize={pageSize}
                    total={total}
                    onChange={handlePageChange}
                    showQuickJumper
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} posts`}
                  />
                </div>
              )}
            </>
          )}
        </TabPane>

        <TabPane tab="Post List" key="2">
          <Alert
            message="Customer Posts"
            description="View and manage customer posts looking for roommates."
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            closable
            style={{ 
              marginBottom: '32px', 
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)'
            }}
          />

          <Table
            columns={postListColumns}
            dataSource={postList}
            rowKey="postId"
            pagination={{
              pageSize: 5,
              showSizeChanger: false,
              showQuickJumper: true
            }}
            className="post-list-table"
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PostList; 