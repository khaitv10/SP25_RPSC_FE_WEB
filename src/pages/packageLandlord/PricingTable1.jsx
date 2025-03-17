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

  // 🆕 Mở modal khi bấm vào giá tiền
  const handlePaymentClick = (packageData, service) => {
    setSelectedPackage({
      type: packageData.type,
      highLight: packageData.highLight,
      size: packageData.size,
      name: service.name,
      description: service.description,
      serviceDetailId: service.serviceDetailId,
      packageId: service.packageId,
      priceId: service.priceId,
      price: service.price.toLocaleString() + " VND",
    });
    setIsModalOpen(true);
  };

  // 🆕 Xử lý khi bấm "Thanh toán"
  const handleConfirmPayment = () => {
    if (selectedPackage) {
      navigate("/landlord/packagecontract", {
        state: {
          name: selectedPackage.name,
          price: selectedPackage.price,
          duration: selectedPackage.duration || "Không xác định",
          titleColor: "#FF5733", // 🆕 Màu tiêu đề
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
    ...allDurations.map(duration => ({ key: `duration-${duration}`, label: <>⏳ Giá {duration} ngày</>, type: "price", duration })),
    { key: "autoApprove", label: <>⚡ Tự động duyệt</>, type: "autoApprove" },
    { key: "showCallButton", label: <>📞 Hiển thị nút gọi điện</>, type: "showCallButton" },
  ];

  return (
    <div className="pricing-table-container">
      <Typography.Title level={4} className="table-title">📋 Bảng giá tin đăng</Typography.Title>
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

      {/* 🆕 Modal Xác Nhận Gói Dịch Vụ */}
      <Modal
        title="🛒 Xác nhận Gói Dịch Vụ"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>Hủy</Button>,
          <Button key="pay" type="primary" onClick={handleConfirmPayment}>
            Thanh toán
          </Button>
        ]}
      >
        {selectedPackage && (
          <div>
            <p><b>📌 Loại tin:</b> {selectedPackage.type}</p>
            <p><b>⭐ Gói dịch vụ:</b> {selectedPackage.name}</p>
            <p><b>📝 Mô tả:</b> {selectedPackage.description}</p>
            <p><b>📏 Kích thước:</b> {selectedPackage.size}</p>
            <p><b>📌 Nổi bật:</b> {selectedPackage.highLight}</p>
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
  );
};

export default PricingTable;
