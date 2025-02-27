import React, { useState } from "react";
import {
  Container,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper
} from "@mui/material";
import "./packageLandlord.scss";

const pricingData = {
  "1 tuần": [
    { posts: "15 bài", price: "15,000" },
    { posts: "20 bài", price: "19,000" },
    { posts: "30 bài", price: "29,000" },
    { posts: "Không giới hạn", price: "40,000" }
  ],
  "1 tháng": [
    { posts: "15 bài", price: "49,000" },
    { posts: "20 bài", price: "59,000" },
    { posts: "30 bài", price: "69,000" },
    { posts: "Không giới hạn", price: "80,000" }
  ],
  "3 tháng": [
    { posts: "15 bài/tháng (tổng 45 bài)", price: "99,000" },
    { posts: "20 bài/tháng (tổng 60 bài)", price: "109,000" },
    { posts: "30 bài/tháng (tổng 90 bài)", price: "119,000" },
    { posts: "Không giới hạn", price: "150,000" }
  ],
  "6 tháng": [
    { posts: "15 bài/tháng (tổng 90 bài)", price: "169,000" },
    { posts: "20 bài/tháng (tổng 120 bài)", price: "199,000" },
    { posts: "30 bài/tháng (tổng 180 bài)", price: "219,000" },
    { posts: "Không giới hạn", price: "250,000" }
  ],
  "1 năm": [
    { posts: "15 bài/tháng (tổng 180 bài)", price: "249,000" },
    { posts: "20 bài/tháng (tổng 240 bài)", price: "269,000" },
    { posts: "30 bài/tháng (tổng 360 bài)", price: "299,000" },
    { posts: "Không giới hạn", price: "350,000" }
  ]
};

const PackageLandlord = () => {
  const [selectedDuration, setSelectedDuration] = useState("1 tuần");

  return (
    <Container maxWidth="sm" className="package-container">
      <Typography variant="h5" className="title">
        Chọn gói dịch vụ
      </Typography>

      <FormControl fullWidth className="select-box">
        <Select
          value={selectedDuration}
          onChange={(e) => setSelectedDuration(e.target.value)}
        >
          {Object.keys(pricingData).map((duration) => (
            <MenuItem key={duration} value={duration}>
              {duration}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow className="table-header">
              <TableCell>Số bài đăng</TableCell>
              <TableCell>Giá tiền (VND)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pricingData[selectedDuration].map((row, index) => (
              <TableRow key={index} className="table-row">
                <TableCell>{row.posts}</TableCell>
                <TableCell>{row.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PackageLandlord;
