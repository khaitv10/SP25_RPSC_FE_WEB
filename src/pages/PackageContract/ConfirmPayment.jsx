import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosClient from '../../Services/axios/config';
import styles from './ConfirmPayment.module.css';
import logo from '../../assets/logoEasyRommie.png';

const ConfirmPayment = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [paymentResponse, setPaymentResponse] = useState(null);
    const [loading, setLoading] = useState(true);

    const code = queryParams.get('code');
    const id = queryParams.get('id');
    const cancel = queryParams.get('cancel');
    const status = queryParams.get('status');
    const orderCode = queryParams.get('orderCode');
    const roleUserId = localStorage.getItem('roleUserId');


    const transactionInfo = status === 'PAID' ? 'Thank you for your purchase!' : 'Your order was cancelled';
    const isSuccess = status === 'PAID';

    useEffect(() => {
        const handlePaymentResponse = async () => {
            try {
                const response = await axiosClient.post('api/payment/package/handle-response', {
                    landlordId: roleUserId,
                    transactionInfo,
                    transactionNumber: orderCode,
                    isSuccess,
                });

                setPaymentResponse(response.data);
            } catch (error) {
                console.error("Error during API call", error);
            } finally {
                setLoading(false);
            }
        };

        handlePaymentResponse();
    }, [roleUserId, transactionInfo, orderCode, isSuccess]);

    const { amount, amountPaid, status: paymentStatus, orderCode: paymentOrderCode, createdAt } = paymentResponse?.paymentLinkInformation || {};
    const isPaid = paymentStatus === "PAID";

    return (
        <div className={styles.paymentSuccess}>
            <div className={styles.paymentCard}>
                <img src={logo} alt="Logo" className={styles.logoImage} />
                <h2 className={styles.title}>Receiptify</h2>
                <div className={styles.paymentInfo}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <p><strong>Payment Information:</strong></p>
                            <p>Payment Status: <span className={isPaid ? styles.paid : styles.cancelled}>{isPaid ? "Successful" : "Cancelled"}</span></p>
                            <p>Order Information: {paymentOrderCode}</p>
                            <p>Amount: {new Intl.NumberFormat('vi-VN').format(amount)} VND</p>
                            <p>Amount Paid: {new Intl.NumberFormat('vi-VN').format(amountPaid)} VND</p>
                            <p>Amount Remaining: {new Intl.NumberFormat('vi-VN').format(amount - amountPaid)} VND</p>
                            <p>Created At: {new Date(createdAt).toLocaleString('vi-VN')}</p>
                        </>
                    )}
                </div>
                <div className={styles.messageContainer}>
                    <h1 className={styles.message}>
                        {isPaid ? "Thank you for your purchase!" : "Your order was cancelled."}
                    </h1>
                </div>
            </div>

        </div>
    );
};

export default ConfirmPayment;
