import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  Box,
  Button,
  CardContent,
  Typography,
  List,
  ListItem,
  TextField,
  Container,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const schema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên."),
  signature: z.string().min(1, "Vui lòng ký trước khi xác nhận."),
});

const PackageContract = () => {
  const userSignatureRef = useRef(null);
  const [, setUserSignature] = useState(null);
  const location = useLocation();

  // Hardcoded values
  const user = {
    fullname: "Nguyen Vi Lord",
    representativeId: "12345",
  };
  const selectedPlan = {
    packageName: "Premium Plan",
    price: 100000,
    packageId: "67890",
    duration: 12,
  };
  const paymentMethod = "VnPay";

  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      signature: "",
    },
  });

  const predefinedSignature =
    "https://res.cloudinary.com/dzoxs1sd7/image/upload/easyroomie-sign";

  const clearSignature = () => {
    userSignatureRef.current?.clear();
    setUserSignature(null);
    setValue("signature", "");
    setValue("fullName", "");
  };

  const handleSignatureEnd = () => {
    if (userSignatureRef.current && !userSignatureRef.current.isEmpty()) {
      const signatureData = userSignatureRef.current.toDataURL();
      setUserSignature(signatureData);
      setValue("signature", signatureData);
      clearErrors("signature");
    }
  };

  const formattedDate = new Date().toLocaleDateString("en-EN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  const onSubmit = async (data) => {
    if (user && selectedPlan && paymentMethod) {
      setIsLoading(true);
      try {
        // Simulate a successful response
        const response = {
          statusCode: 201,
          data: "https://vnpay-redirect-link.com", // Example URL for VnPay redirection
        };

        console.log(paymentMethod);
        console.log(response);

        if (response.statusCode === 201 && response.data) {
          toast.success("Payment successful");
          if (paymentMethod === "VnPay") {
            if (typeof response.data === "string") {
              window.location.replace(response.data);
            } else {
              toast.error("Invalid response data");
            }
          } else if (paymentMethod === "1") {
            if (
              typeof response.data !== "string" &&
              response.data.checkoutUrl
            ) {
              window.location.replace(response.data.checkoutUrl);
            } else {
              toast.error("Invalid response data");
            }
          }
        } else {
          toast.error("Payment failed");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      <Container
        maxWidth="md"
        sx={{ boxShadow: 3, background: "white", pt: 2, pb: 3 }}
      >
        <CardContent>
          <Typography variant="h6" textAlign="center" fontWeight="bold" mb={1}>
            Platform EasyRoomie
          </Typography>
          <Typography variant="h5" textAlign="center" fontWeight="bold">
            HỢP ĐỒNG DỊCH VỤ
          </Typography>

          <Typography variant="body1" mt={3} mb={2}>
            <b>BÊN A (BÊN CUNG CẤP DỊCH VỤ):</b> EasyRoomie - Nhà cung cấp dịch vụ
            phần mềm
            <br />
            <b>Địa chỉ:</b> Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố
            Thủ Đức, Hồ Chí Minh
            <br />
            <b>Đại diện:</b> Nguyễn Trần Vĩ Đức
            <br />
            <b>Chức vụ:</b> Giám đốc Công ty
            <br />
            <b>Số điện thoại:</b> 0385928575
            <br />
            <b>Email:</b> easyroomie.RPSC@gmail.com
          </Typography>

          <Typography variant="body1" mt={3} mb={2}>
            <b>BÊN B (BÊN SỬ DỤNG DỊCH VỤ - LANDLORD):</b> <span>{user?.fullname}</span>
            <br />
            <b>Số điện thoại:</b> ...
            <br />
            <b>Email:</b> ...
          </Typography>

          <div className="w-full border-t border-gray-300 opacity-50 mt-3"></div>

          <List>
            <ListItem>
              <b>Điều 1: Nội dung hợp đồng</b>
            </ListItem>
            <ListItem>
              <span>
                🎯 Bên A đồng ý cung cấp cho Bên B gói dịch vụ{" "}
                <b>{selectedPlan?.packageName}</b>, bao gồm quyền đăng tải số
                lượng bài viết ... trong thời gian{" "}
                <b>{selectedPlan?.duration} tháng</b>, kể từ ngày ký hợp đồng.
              </span>
            </ListItem>

            <ListItem>
              <b>Điều 2: Thời hạn hợp đồng</b>
            </ListItem>
            <ListItem>
              <span>Hợp đồng có hiệu lực từ ngày ... đến ngày ...</span>
            </ListItem>

            <ListItem>
              <b>Điều 3: Phí dịch vụ và phương thức thanh toán</b>
            </ListItem>
            <ListItem>
              <span>• Phí dịch vụ: {formatPrice(selectedPlan?.price)} /tháng</span>
            </ListItem>
            <ListItem>
              <span>• Phương thức thanh toán: chuyển khoản</span>
            </ListItem>
            <ListItem>
              <span>• Thời hạn thanh toán: ...</span>
            </ListItem>

            <ListItem>
              <b>Điều 4: Quyền và nghĩa vụ của các bên</b>
            </ListItem>
            <ListItem>
              <span>
                Bên A: Cung cấp dịch vụ đúng nội dung đã cam kết, đảm bảo hệ
                thống hoạt động ổn định, hỗ trợ kỹ thuật trong quá trình sử dụng
                dịch vụ.
              </span>
            </ListItem>
            <ListItem>
              <span>
                Bên B: Thanh toán đầy đủ và đúng hạn, sử dụng dịch vụ đúng mục
                đích, không vi phạm pháp luật, chịu trách nhiệm về nội dung
                đăng tải trên hệ thống.
              </span>
            </ListItem>

            <ListItem>
              <b>Điều 5: Chấm dứt hợp đồng</b>
            </ListItem>
            <ListItem>
              <span>
                Hợp đồng có thể chấm dứt trong các trường hợp:
                <br />
                • Hết thời hạn hợp đồng mà không gia hạn
                <br />
                • Một trong hai bên vi phạm nghiêm trọng nghĩa vụ hợp đồng
              </span>
            </ListItem>

            <ListItem>
              <b>Điều 6: Giải quyết tranh chấp</b>
            </ListItem>
            <ListItem>
              <span>
                Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương
                lượng. Nếu không thành, sẽ đưa ra tòa án có thẩm quyền.
              </span>
            </ListItem>

            <ListItem>
              <b>Điều 7: Điều khoản thi hành</b>
            </ListItem>
            <ListItem>
              <span>
                Hợp đồng có hiệu lực từ ngày ký và được lập thành hai (02) bản,
                mỗi bên giữ một (01) bản có giá trị pháp lý như nhau.
              </span>
            </ListItem>
          </List>

          <Grid container spacing={2} mt={1}>
            <Grid item md={6} xs={12}>
              <Typography fontWeight="bold" textAlign={"center"}>
                Chữ ký Bên A:
              </Typography>
              <Box
                sx={{
                  border: "1px solid gray",
                  padding: 1,
                  display: "flex",
                  justifyContent: "center",
                  height: 100,
                }}
              >
                <img
                  src={predefinedSignature}
                  alt="Company Signature"
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
              </Box>
            </Grid>

            <Grid item md={6} xs={12}>
              <Typography fontWeight="bold" textAlign={"center"}>
                Chữ ký Bên B:
              </Typography>
              <Box
                sx={{
                  border: "1px solid gray",
                  padding: 1,
                  height: 100,
                  backgroundColor: "#fff",
                }}
              >
                <SignatureCanvas
                  ref={userSignatureRef}
                  penColor="black"
                  canvasProps={{ style: { width: "100%", height: "100%" } }}
                  onEnd={handleSignatureEnd}
                />
              </Box>
              {errors.signature && (
                <Typography color="error">{errors.signature.message}</Typography>
              )}
              <div className="w-full flex justify-center">
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Họ và tên của bạn"
                      variant="standard"
                      margin="normal"
                      error={!!errors.fullName}
                      helperText={errors.fullName?.message}
                    />
                  )}
                />
              </div>
            </Grid>
          </Grid>

          <Typography textAlign="center" variant="h6" mt={3}>
            Ngày ký hợp đồng: {formattedDate}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button variant="contained" color="error" onClick={clearSignature}>
              Xóa và ký lại
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Xác nhận chữ ký"
              )}
            </Button>
          </Box>
        </CardContent>
      </Container>
    </Box>
  );
};

export default PackageContract;
