import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Paper } from "@mui/material";
import { FaEye, FaEdit } from "react-icons/fa";

const contracts = [
  { package: "Gói 1 tháng", price: "300,000 VND", landlord: "Nguyen Xuan Tien", phone: "0903764392", duration: "1 tháng", startDate: "23/12/2024", endDate: "23/01/2025", status: "Active" },
  { package: "Gói 1 tuần", price: "150,000 VND", landlord: "Tran Vu Tien", phone: "0903764391", duration: "1 tuần", startDate: "23/12/2024", endDate: "30/12/2024", status: "Inactive" },
  { package: "Gói 3 tháng", price: "900,000 VND", landlord: "Nguyen Nhat Tien", phone: "0903764390", duration: "3 tháng", startDate: "23/12/2024", endDate: "23/03/2024", status: "Active" },
];

const ContractManagement = () => {
  return (
    <div style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <Button variant="contained" color="primary" style={{ marginRight: "10px" }}>
            Active
          </Button>
          <Button variant="contained" color="secondary">
            Inactive
          </Button>
        </div>
        <TextField label="Search Package service" variant="outlined" />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Package service</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Landlord</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map((contract, index) => (
              <TableRow key={index}>
                <TableCell>{contract.package}</TableCell>
                <TableCell>{contract.price}</TableCell>
                <TableCell>{contract.landlord}</TableCell>
                <TableCell>{contract.phone}</TableCell>
                <TableCell>{contract.duration}</TableCell>
                <TableCell>{contract.startDate}</TableCell>
                <TableCell>{contract.endDate}</TableCell>
                <TableCell style={{ color: contract.status === "Active" ? "green" : "red" }}>
                  {contract.status}
                </TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" style={{ marginRight: "10px" }}>
                    <FaEye />
                  </Button>
                  <Button variant="outlined" color="secondary">
                    <FaEdit />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ContractManagement;
