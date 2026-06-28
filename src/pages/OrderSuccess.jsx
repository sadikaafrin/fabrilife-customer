import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function OrderSuccess() {
    const navigate = useNavigate();
    const location = useLocation();

    // Get order data from navigation state
    const orderData = location.state?.orderData;
    const invoiceNo = location.state?.invoiceNo;

    // If no invoice number, redirect to home
    useEffect(() => {
        if (!invoiceNo) {
            navigate('/');
        }
    }, [invoiceNo, navigate]);

    if (!invoiceNo || !orderData) {
        return null;
    }

    const { customerInfo, items, pricing, paymentInfo } = orderData;

    return (
        <>
            <Header />

            <div className="container py-5" style={{ minHeight: "70vh" }}>
                <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "900px", borderRadius: "20px" }}>

                    {/* Success Header */}
                    <div className="text-center mb-4">
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: 'linear-gradient(135deg, #6da538 0%, #004d1f 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '48px',
                            color: 'white',
                            fontWeight: 'bold',
                            margin: '0 auto 1rem'
                        }}>
                            ✓
                        </div>
                        <h2 className="fw-bold text-dark">Order Placed Successfully!</h2>
                        <p className="text-muted">
                            Thank you for your purchase. Your order has been confirmed and is being processed.
                        </p>
                    </div>

                    {/* Invoice Number */}
                    <div className="p-3 bg-light rounded mb-4 text-center">
                        <p className="fw-semibold mb-1">Invoice Number</p>
                        <h4 className="text-success fw-bold">{invoiceNo}</h4>
                    </div>

                    {/* Customer Information */}
                    <div className="mb-4">
                        <h5 className="fw-bold mb-3 pb-2 border-bottom">Customer Information</h5>
                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <p className="mb-1"><strong>Name:</strong> {customerInfo.fullName}</p>
                                <p className="mb-1"><strong>Phone:</strong> {customerInfo.phone}</p>
                                {customerInfo.email && <p className="mb-1"><strong>Email:</strong> {customerInfo.email}</p>}
                            </div>
                            <div className="col-md-6 mb-2">
                                <p className="mb-1"><strong>Address:</strong> {customerInfo.address}</p>
                                <p className="mb-1"><strong>City:</strong> {customerInfo.city}</p>
                            </div>
                        </div>
                        {customerInfo.orderNote && (
                            <p className="mb-1 mt-2"><strong>Order Note:</strong> {customerInfo.orderNote}</p>
                        )}
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                        <h5 className="fw-bold mb-3 pb-2 ">Order Items</h5>
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead className="table-light">
                                    <tr>
                                        <th>Product</th>
                                        <th>Size</th>
                                        <th>Color</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.size || 'N/A'}</td>
                                            <td>{item.color || 'N/A'}</td>
                                            <td>৳ {item.price}</td>
                                            <td>{item.quantity}</td>
                                            <td>৳ {(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pricing Summary */}
                    <div className="mb-4">
                        <h5 className="fw-bold mb-3 pb-2 border-bottom">Order Summary</h5>
                        <div className="row">
                            <div className="col-md-6 ms-auto">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <span className="fw-semibold">৳ {pricing.subtotal}</span>
                                </div>
                                {pricing.discount > 0 && (
                                    <div className="d-flex justify-content-between mb-2 text-success">
                                        <span>Discount:</span>
                                        <span className="fw-semibold">- ৳ {pricing.discount}</span>
                                    </div>
                                )}
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Shipping:</span>
                                    <span className="fw-semibold">
                                        {pricing.shipping === 0 ? 'Free' : `৳ ${pricing.shipping}`}
                                    </span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <span className="fw-bold fs-5">Total:</span>
                                    <span className="fw-bold fs-5 text-success">৳ {pricing.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="mb-4">
                        <h5 className="fw-bold mb-3 pb-2 border-bottom">Payment Information</h5>
                        <p className="mb-1"><strong>Payment Method:</strong> {paymentInfo.method}</p>
                        {paymentInfo.accNum && (
                            <p className="mb-1"><strong>Account Number:</strong> {paymentInfo.accNum}</p>
                        )}
                        {paymentInfo.transactionID && (
                            <p className="mb-1"><strong>Transaction ID:</strong> {paymentInfo.transactionID}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center mt-4">
                        <Link to="/">
                            <button style={{background: '#4e4e4e'}} className="btn py-3 px-4 text-white">Back to Home</button>
                        </Link>
                        <Link to="/order-tracking">
                            <button className="btn btn-dark py-3 px-4">Track Order</button>
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default OrderSuccess;