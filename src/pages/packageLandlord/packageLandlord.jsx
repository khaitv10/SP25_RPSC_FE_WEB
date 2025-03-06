import React, { useEffect, useState } from "react";
import { getServicePackageByLandlord } from "../../Services/serviceApi";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Chip,
  CircularProgress,
} from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import "./packageLandlord.scss";

const PackageLandlord = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getServicePackageByLandlord();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="package-landlord">
      <Typography variant="h4" className="title">
        <AccountBalanceWalletOutlinedIcon sx={{ mr: 1 }} />
        Gói Dịch Vụ Cho Chủ Nhà
      </Typography>
      {loading ? (
        <div className="loading">
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={3}>
          {packages.map((pkg) => (
            <Grid item xs={12} sm={6} md={4} key={pkg.packageId}>
              <Card className="package-card">
                <CardHeader
                  title={pkg.name}
                  subheader={`${pkg.duration} ngày`}
                  className="card-header"
                />
                <CardContent>
                  <Typography variant="body2" className="description">
                    {pkg.description}
                  </Typography>
                  <div className="services">
                    {pkg.listServicePrice.map((service) => (
                      <Chip
                        key={service.serviceDetailId}
                        label={`${service.type} - ${
                          service.limitPost ? `${service.limitPost} bài` : "Không giới hạn"
                        } - ${service.price.toLocaleString()} VND`}
                        className="service-chip"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default PackageLandlord;
