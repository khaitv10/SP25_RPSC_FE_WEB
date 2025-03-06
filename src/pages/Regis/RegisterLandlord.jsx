import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, TextField, Button, Typography, Card, CardContent, Input } from "@mui/material";
import { styled } from "@mui/system";
import { registerLandlord } from "../../Services/userAPI";
import "./RegisterLandlord.scss";

const StyledCard = styled(Card)({
    maxWidth: 500,
    margin: "auto",
    padding: 20,
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: 12,
});

const RegisterLandlord = () => {
    const location = useLocation();
    const email = location.state?.email || ""; // Nhận email nhưng không hiển thị

    const [formData, setFormData] = useState({
        CompanyName: "",
        NumberRoom: "",
        LicenseNumber: "",
        BankName: "",
        BankNumber: "",
        WorkshopImages: [],
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, WorkshopImages: Array.from(e.target.files) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("Email", email);
        data.append("CompanyName", formData.CompanyName);
        data.append("NumberRoom", formData.NumberRoom);
        data.append("LicenseNumber", formData.LicenseNumber);
        data.append("BankName", formData.BankName);
        data.append("BankNumber", formData.BankNumber);
        formData.WorkshopImages.forEach((file) => {
            data.append("WorkshopImages", file);
        });

        try {
            const response = await registerLandlord(data);
            console.log("Success:", response);
            alert("Register successfully!");
        } catch (error) {
            console.error("Error:", error);
            alert("Registration failed!");
        }
    };

    return (
        <Container maxWidth="sm">
            <StyledCard>
                <CardContent>
                    <Typography variant="h5" gutterBottom align="center">
                        Register Landlord
                    </Typography>
                    <form onSubmit={handleSubmit} className="register-form">
                        <TextField label="Company Name" name="CompanyName" fullWidth required onChange={handleChange} margin="normal" />
                        <TextField label="Number of Rooms" name="NumberRoom" fullWidth required onChange={handleChange} margin="normal" />
                        <TextField label="License Number" name="LicenseNumber" fullWidth required onChange={handleChange} margin="normal" />
                        <TextField label="Bank Name" name="BankName" fullWidth required onChange={handleChange} margin="normal" />
                        <TextField label="Bank Number" name="BankNumber" fullWidth required onChange={handleChange} margin="normal" />
                        <Input type="file" multiple fullWidth onChange={handleFileChange} className="file-input" />
                        <Button type="submit" variant="contained" color="primary" fullWidth className="submit-btn">
                            Register
                        </Button>
                    </form>
                </CardContent>
            </StyledCard>
        </Container>
    );
};

export default RegisterLandlord;
