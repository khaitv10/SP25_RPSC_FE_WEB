import React, { useEffect, useState } from "react";
import { Table, Typography, Spin, Button, Card, Modal } from "antd";
import { getServicePackageByLandlord } from "../../Services/serviceApi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import "./PricingTable1.scss";

const PricingTable = () => {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getServicePackageByLandlord();
        setPricingData(data || []);
      } catch (err) {
        setError(err.message || "Lỗi khi lấy dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ textAlign: "center" }}><Spin size="large" /></div>;
  if (error) return <Typography.Text type="danger">{error}</Typography.Text>;
  if (!pricingData.length) return <Typography.Text style={{ color: "#888" }}>Không có dữ liệu hiển thị.</Typography.Text>;

  const allDurations = Array.from(new Set(pricingData.flatMap(item => item.listServicePrice?.map(p => p.duration) || [])))
    .sort((a, b) => Number(a) - Number(b));
  const paginatedData = pricingData.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const handlePaymentClick = (packageData, service) => {
    const newPackage = {
      duration: service.duration,  
      type: packageData.type,
      highLightTime: packageData.highLightTime,
      maxPost: packageData.maxPost,
      label: packageData.label,
      name: service.name,
      description: service.description,
      serviceDetailId: service.serviceDetailId,
      packageId: service.packageId,
      priceId: service.priceId,
      price: service.price.toLocaleString() + " VND",
    };
  
    console.log("📌 Đã chọn gói dịch vụ:", newPackage);
    setSelectedPackage(newPackage);
    setIsModalOpen(true);
  };
  
  const handleConfirmPayment = () => {
    if (selectedPackage) {
      console.log("duration123123", selectedPackage.duration);
      navigate("/landlord/packagecontract", {
        state: {
          name: selectedPackage.name,
          price: selectedPackage.price,
          duration: selectedPackage.duration || "Không xác định",
          titleColor: "#FF5733", 
          packageId: selectedPackage.packageId,
          serviceDetailId: selectedPackage.serviceDetailId,
          priceId: selectedPackage.priceId,
        },
      });
    }
  };

  const columns = [
    {
      title: <>📌 Loại tin</>,
      dataIndex: "type",
      key: "type",
      fixed: "left",
      render: (_, record) => <b>{record.label}</b>,
      width: "20%",
    },
    ...paginatedData.map((item, index) => ({
      title: <>⭐ {item.type}</>,
      key: `column-${index}`,
      align: "center",
      width: "20%",
      render: (_, record) => {
        if (record.type === "price") {
          const service = item.listServicePrice?.find((p) => p.duration === record.duration);
          return service ? (
            <Button type="link" onClick={() => handlePaymentClick(item, service)}>
              {service.price.toLocaleString()} VND
            </Button>
          ) : "N/A";
        }
        if (record.type === "highLightTime") return item.highLightTime;
        if (record.type === "maxPost") return item.maxPost;
        if (record.type === "label") return item.label;
        return item[record.type] ? <>❌</> : <>✅</>;
      },
    })),
  ];

  while (columns.length < 5) {
    columns.push({
      title: "",
      key: `empty-${columns.length}`,
      width: "20%",
      render: () => null,
    });
  }

  const dataSource = [
    ...allDurations.map(duration => ({ 
      key: `duration-${duration}`, 
      label: <>⏳ Giá {duration} ngày</>, 
      type: "price", 
      duration 
    })),
    { key: "highLightTime", label: <>🌟 Nổi bật</>, type: "highLightTime" },
    { key: "maxPost", label: <>📝 Số bài đăng</>, type: "maxPost" },
    { key: "label", label: <>🏷️ Nhãn</>, type: "label" },
    { key: "autoApprove", label: <>⚡ Tự động duyệt</>, type: "autoApprove" },
    { key: "showCallButton", label: <>📞 Hiển thị nút gọi điện</>, type: "showCallButton" },
  ];

  return (
    <div className="pricing-table-wrapper">
    <div className="pricing-table-container">
      <Typography.Title level={5} className="table-title">📋 Bảng giá tin đăng</Typography.Title>
      <Card className="custom-table">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              bordered
            />
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Modal Xác Nhận Gói Dịch Vụ */}
      <Modal
        title="🛒 Confirm your Service Package"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}  
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>,
          <Button key="pay" type="primary" onClick={handleConfirmPayment}>
            Buy Now
          </Button> 
        ]}
      >
        {selectedPackage && (
          <div>
            <p><b>📌 Loại tin:</b> {selectedPackage.type}</p>
            <p><b>⭐ Gói dịch vụ:</b> {selectedPackage.name}</p>
            <p><b>📝 Mô tả:</b> {selectedPackage.description}</p>
            <p><b>⏱️ Thời gian:</b> {selectedPackage.duration} ngày</p>
            <p><b>📊 Số bài đăng:</b> {selectedPackage.maxPost}</p>
            <p><b>🏷️ Nhãn:</b> {selectedPackage.label}</p>
            <p><b>🌟 Nổi bật:</b> {selectedPackage.highLightTime}</p>
            <p><b>💰 Giá:</b> {selectedPackage.price}</p>
          </div>
        )}
      </Modal>

      {/* Nút phân trang */}
      <div className="pagination-box">
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            type="primary"
            onClick={() => setPage(prev => (prev === 0 ? Math.floor(pricingData.length / itemsPerPage) : prev - 1))}
          >
            ⬅️ 
          </Button>
        </motion.div>

        <motion.div
          key={page}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <Typography.Text className="page-indicator">{page + 1} / {Math.ceil(pricingData.length / itemsPerPage)}</Typography.Text>
        </motion.div>

        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            type="primary"
            onClick={() => setPage(prev => (prev + 1) * itemsPerPage >= pricingData.length ? 0 : prev + 1)}
          >
            ➡️
          </Button>
        </motion.div>
      </div>
      </div>
    </div>
  );
};

export default PricingTable;