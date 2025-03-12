import React, { useEffect, useState, useMemo } from "react";
import { getServicePackageByLandlord } from "../../Services/serviceApi";
import "./PricingTable.scss";

const PricingTable = () => {
  const [pricingData, setPricingData] = useState([]);

  useEffect(() => {
    const fetchPricingData = async () => {
        try {
          const response = await getServicePackageByLandlord();
          if (response && response.length > 0) {
            // Lấy giá theo từng gói
            const pricePerWeekData = response.find((pkg) => pkg.duration === 7);
            const pricePerMonthData = response.find((pkg) => pkg.duration === 30);
      
            const transformedData = response[0].listServicePrice.map((item) => {
                const weeklyPrice = pricePerWeekData?.listServicePrice.find((p) => p.type === item.type)?.price || 0;
                const monthlyPrice = pricePerMonthData?.listServicePrice.find((p) => p.type === item.type)?.price || 0;
                console.log("Loại tin:", item.type); 
                // Xác định kích thước tin dựa vào loại tin
                let size = "Nhỏ"; // Mặc định là "Nhỏ" cho TIN THƯỜNG
                if (item.type.includes("Vip 1") || item.type.includes("Vip 2")) {
                  size = "Vừa";
                } else if (item.type.includes("Vip 3")) {
                  size = "Lớn";
                } else if (item.type.includes("Vip 4")) {
                  size = "Rất lớn";
                }
              
                return {
                  type: item.type,
                  color: item.type.toLowerCase().replace(/\s+/g, ""),
                  pricePerDay: `${item.price.toLocaleString()} VNĐ`,
                  pricePerWeek: `${weeklyPrice.toLocaleString()} VNĐ`,
                  pricePerMonth: `${monthlyPrice.toLocaleString()} VNĐ`,
                  boostPrice: "2.000 VNĐ",
                  titleColor: item.limitPost,
                  size, // ✅ Gán kích thước tin đã được xác định
                  autoApprove: true,
                  callButton: false,
                };
              });
              
      
            setPricingData(transformedData);
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu từ API:", error);
        }
      };
      

    fetchPricingData();
  }, []);

  // Mapping màu sắc tiêu đề
  const getTitleColor = (title) => {
    if (!title) return "black";
    if (title.includes("XANH")) return "blue";
    if (title.includes("CAM")) return "orange";
    if (title.includes("HỒNG")) return "hotpink";
    if (title.includes("ĐỎ")) return "red";
    return "black";
  };

  // Tạo bảng dữ liệu để tránh render lại không cần thiết
  const renderTableData = useMemo(() => {
    if (pricingData.length === 0) return null;

    return (
      <tbody>
        {/* Giá ngày */}
        <tr>
          <td>Giá ngày</td>
          {pricingData.map((item, index) => (
            <td key={index}>
              <strong>{item.pricePerDay}</strong>
              <span className="note">(Tối thiểu 3 ngày)</span>
            </td>
          ))}
        </tr>

        {/* Giá tuần */}
        <tr>
          <td>Giá tuần</td>
          {pricingData.map((item, index) => (
            <td key={index}>
              <strong>{item.pricePerWeek}</strong>
            </td>
          ))}
        </tr>

        {/* Giá tháng */}
        <tr>
          <td>Giá tháng</td>
          {pricingData.map((item, index) => (
            <td key={index}>
              <strong>{item.pricePerMonth}</strong>
            </td>
          ))}
        </tr>

        {/* Màu sắc tiêu đề */}
        <tr>
          <td>Màu sắc tiêu đề</td>
          {pricingData.map((item, index) => (
            <td
              key={index}
              style={{
                color: getTitleColor(item.titleColor),
                fontWeight: "bold",
                textTransform: item.titleColor.includes("IN HOA")
                  ? "uppercase"
                  : "none",
              }}
            >
              {item.titleColor}
            </td>
          ))}
        </tr>

        {/* Kích thước tin */}
        <tr>
          <td>Kích thước tin</td>
          {pricingData.map((item, index) => (
            <td key={index}>{item.size}</td>
          ))}
        </tr>

        {/* Tự động duyệt */}
        <tr>
          <td>Tự động duyệt</td>
          {pricingData.map((item, index) => (
            <td key={index}>
              {item.autoApprove ? (
                <span className="check-icon">✔️</span>
              ) : (
                <span className="cross-icon">❌</span>
              )}
            </td>
          ))}
        </tr>

        {/* Hiển thị nút gọi điện */}
        <tr>
          <td>Hiển thị nút gọi điện</td>
          {pricingData.map((item, index) => (
            <td key={index}>
              {item.callButton ? (
                <span className="check-icon">✔️</span>
              ) : (
                <span className="cross-icon">❌</span>
              )}
            </td>
          ))}
        </tr>
      </tbody>
    );
  }, [pricingData]);

  return (
    <div className="pricing-table">
      <h2 className="table-title">Bảng giá tin đăng</h2>
      <p className="table-subtitle">Áp dụng từ 01/01/2025</p>

      <table className="table">
        <thead>
          <tr>
            <td>Màu sắc tiêu đề</td>
            <th style={{ backgroundColor: "lightblue", color: "black" }}>TIN THƯỜNG</th>
            <th style={{ backgroundColor: "blue", color: "white" }}>TIN VIP 1</th>
            <th style={{ backgroundColor: "orange", color: "white" }}>TIN VIP 2</th>
            <th style={{ backgroundColor: "hotpink", color: "white" }}>TIN VIP 3</th>
            <th style={{ backgroundColor: "red", color: "white" }}>TIN VIP 4</th>
          </tr>
        </thead>
        {renderTableData}
      </table>
    </div>
  );
};

export default PricingTable;
