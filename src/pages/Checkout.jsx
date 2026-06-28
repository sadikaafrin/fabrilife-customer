import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import useWebInfo from "../data/useWebInfo";
import Swal from "sweetalert2";

import Header from '../components/Header';
import Footer from '../components/Footer';

import { useCart } from "../CartContext";

import useCoupon from "../data/useCoupon";      // Import hook
import useDiscounts from "../data/useDiscounts";  // Import hook

import { dataLayerPush } from "../assets/js/main";
import { sendSMS } from "../assets/js/main";
import SSLLOGO from '../assets/img/sslcommerz.png';

function Checkout() {

    const navigate = useNavigate();

    const { webInfo } = useWebInfo();

    const [user, setUser] = useState(null);
    
    // START Coupon
    const [couponCode, setCouponCode] = useState("");
    const { coupon, loading: couponLoading, error: couponError, setCoupon } = useCoupon(couponCode);
    const [discountAmount, setDiscountAmount] = useState(0);

    
    // Load user data from localStorage on component mount
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } 
    }, []);


    // Handle Apply Coupon
    const handleApplyCoupon = () => {
        if (!couponCode) {
            Swal.fire("Error", "Please enter a coupon code!", "error");
            return;
        }

        if (!coupon || !coupon.coupon_discount) {
            Swal.fire("Error", "Invalid or expired coupon!", "error");
            setDiscountAmount(0);
            return;
        }

        // coupon.coupon_discount is percentage
        const discount = (Number(coupon.coupon_discount) / 100) * totalPrice;

        // optional: round to 2 decimals
        // setDiscountAmount(discount.toFixed(2)); 
       
        setDiscountAmount(Number(((Number(coupon.coupon_discount) / 100) * totalPrice).toFixed(2)));

        Swal.fire(
            "Success", 
            `Coupon applied! You got ${coupon.coupon_discount}% off, Discount: ৳ ${discount.toFixed(2)}`, 
            "success"
        );
    };

    // END Coupon


    // Cart Data
    const {
        carts,
        totalPrice,
        removeCart,
        incrementQuantity,
        decrementQuantity,
        shippingCharge,
        setShippingCharge,
        finalPrice,
        clearCart
    } = useCart();

    // Prevent duplicate log in StrictMode
    const loggedRef = useRef(false);

    //  Push to GTM dataLayer
    useEffect(() => {
        if (loggedRef.current) return;
        if (!carts || carts.length === 0) return;
    
        dataLayerPush("begin_checkout", carts.map(item => ({
        code: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
        subCategory: item.sub_category,
        variant: item.size
        })));
    
        loggedRef.current = true;
    }, [carts]);
    // END


    // Delivery Information
    const inside_location = webInfo?.inside_location || "Dhaka";
    const inside_delivery_charge = webInfo?.inside_delivery_charge || 80;
    const outside_delivery_charge = webInfo?.outside_delivery_charge || 150;


    const [selectedCity, setSelectedCity] = useState(`Inside ${inside_location}`);

    const deliveryOptions = [
        { id: "inside", label: `Inside ${inside_location}`, charge: inside_delivery_charge },
        { id: "outside", label: `Outside ${inside_location}`, charge: outside_delivery_charge }
    ];

    // Payment Method
    const [paymentMethod, setPaymentMethod] = useState("cod"); // default Cash on Delivery

    const paymentMethods = [
        { id: "bKash", name: "bKash", accordionId: "flush-collapseOne" },
        { id: "nagad", name: "Nagad", accordionId: "flush-collapseTwo" },
        { id: "rocket", name: "Rocket", accordionId: "flush-collapseThree" },
        { id: "upay", name: "Upay", accordionId: "flush-collapseFour" },
    ];

    const renderPaymentInputs = (id, name) => {
        if (paymentMethod !== id) return null;
        return (
            <div className="input-area">
                <div className="input-box">
                    <label htmlFor={`${id}_accNum`}>
                        <b>
                            Your {name} Account Number<i className="text-danger">*</i>
                        </b>
                    </label>
                    <input
                        name="accNum"
                        className="custom-input"
                        id={`${id}_accNum`}
                        type="text"
                        placeholder="01XXXXXXXXX"
                        required
                    />
                </div>
                <br />
                <div className="input-box">
                    <label htmlFor={`${id}_transactionID`}>
                        <b>
                            Your {name} Transaction ID<i className="text-danger">*</i>
                        </b>
                    </label>
                    <input
                        name="transactionID"
                        className="custom-input"
                        id={`${id}_transactionID`}
                        type="text"
                        placeholder="Enter Transaction ID"
                        required
                    />
                </div>
            </div>
        );
    };

    // START PURCHASE DISCOUNTS
    const { discount } = useDiscounts(totalPrice);
    const [purchaseDiscountAmount, setPurchaseDiscountAmount] = useState(0);

    useEffect(() => {
        if (discount) {

            // console.log(discount.discount_amount);
            // console.log(discount.free_shipping);
            // console.log(discount.extra_amount);

            if (discount.free_shipping == 1) {
                setShippingCharge(0);
            } else {
                // reset shipping charge based on selected city if no free shipping
                const selected = deliveryOptions.find(opt => opt.label === selectedCity);
                setShippingCharge(selected ? selected.charge : 0);
            }

            if (discount.discount_amount != 0) {
                // setPurchaseDiscountAmount(discount.discount_amount);
                setPurchaseDiscountAmount(Number(discount.discount_amount.toFixed(2)));
            }
        }
    }, [discount, selectedCity]);
    // END PURCHASE DISCOUNTS

    // Handle Place Order
    const [loading, setLoading] = useState(false);
    const [blockedWarning, setBlockedWarning] = useState(null);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Get logged-in user from localStorage
        const user = JSON.parse(localStorage.getItem('user'));

        if (carts.length === 0) {
            Swal.fire("Error", "Your cart is empty!", "error");
            setLoading(false);
            return;
        }

        const form = e.target;
        const userFullName = form.fullName.value;
        const userPhone = form.phone.value;
        const userEmail = form.email.value;
        const userAddress = form.address.value;
        const cityAddress = selectedCity;
        const invoiceNo = "INV-" + Date.now();

        // Mobile Banking Information
        const accNum = form.accNum?.value || "";
        const transactionID = form.transactionID?.value || "";
        const orderNote = form.orderNote?.value || "";


        const orders = carts.map((item) => ({
            user_id: user?.id || "",
            user_full_name: userFullName,
            user_phone: userPhone,
            user_email: userEmail,
            user_address: userAddress,
            city_address: cityAddress,
            invoice_no: invoiceNo,
            product_id: item.id,
            product_title: item.name,
            product_quantity: item.quantity,
            product_size: item.size || "",
            product_color: item.colorName || "",
            product_category: item.category || "",
            product_sub_category: item.sub_category || "",
            product_price: item.price,
            total_price: item.price * item.quantity, // ensure numeric
            payment_method: paymentMethod === "cod" ? "Cash On Delivery" : paymentMethod,
            accNum: accNum,
            transactionID: transactionID,
            order_note: orderNote
        }));


        try {

            const API_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_PLACE_ORDER_URL;

            const res = await fetch(`${API_URL}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orders)
            });

            const data = await res.json();
            if (data.success) {
                //Swal.fire("Success", data.message, "success");

                // Push to GTM dataLayer
                dataLayerPush("purchase", orders.map(item => ({
                    code: item.product_id,
                    name: item.product_title,
                    price: item.product_price,
                    quantity: item.product_quantity,
                    category: item.product_category,
                    subCategory: item.product_sub_category,
                    variant: item.product_size
                })));
                // END
                
                // Send SMS
                //sendSMS(userPhone, "Your Order Has Been Confirmed - Invoice No: " + invoiceNo + ". For Contact: 01XXXXXXX - Brand Name");
                // END

                clearCart(); // Clear cart after order

                if (paymentMethod === "sslcommerz") {
                    
                    // Redirect to SSLCommerz payment page
                    window.location.href = data.payment_url;
                    return;

                } else {

                    navigate("/order-success", { 
                        state: { 
                            invoiceNo,
                            orderData: {
                                customerInfo: {
                                    fullName: userFullName,
                                    phone: userPhone,
                                    email: userEmail,
                                    address: userAddress,
                                    city: cityAddress,
                                    orderNote: orderNote
                                },
                                items: carts.map(item => ({
                                    name: item.name,
                                    size: item.size || 'N/A',
                                    color: item.colorName || 'N/A',
                                    price: item.price,
                                    quantity: item.quantity,
                                    image: item.image,
                                    category: item.category,
                                    sub_category: item.sub_category
                                })),
                                pricing: {
                                    subtotal: totalPrice,
                                    discount: Number(discountAmount) + Number(purchaseDiscountAmount),
                                    shipping: shippingCharge,
                                    total: Number(finalPrice) - Number(discountAmount) - Number(purchaseDiscountAmount)
                                },
                                paymentInfo: {
                                    method: paymentMethod === "cod" ? "Cash On Delivery" : paymentMethod,
                                    accNum: accNum,
                                    transactionID: transactionID
                                }
                            }
                        } 
                    });

                }
                
            } else if (data.status === "warning") {
                setBlockedWarning(data.message);
            } else {
                Swal.fire("Error", data.message, "error");
            }
        } catch (err) {
            Swal.fire("Error", "Something went wrong!", "error");
        } finally {

            setLoading(false);

            // ADD Order Discount
            if (discountAmount > 0 || purchaseDiscountAmount > 0) {

                const discountData = {
                    invoice_no: invoiceNo, // same as the order invoice
                    total_order_amount: totalPrice,
                    total_discount_amount: Number(discountAmount) + Number(purchaseDiscountAmount),
                    free_shipping: discount?.free_shipping === 1 ? 1 : 0
                };

                // Then create FormData
                const formData = new FormData();
                formData.append("invoice_no", discountData.invoice_no);
                formData.append("total_order_amount", discountData.total_order_amount);
                formData.append("total_discount_amount", discountData.total_discount_amount);
                formData.append("free_shipping", discountData.free_shipping);

                const API_URL2 = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_ADD_ORDER_DISCOUNT_URL;

                // Send request
                const res2 = await fetch(
                    `${API_URL2}`,
                    {
                        method: "POST",
                        body: formData
                    }
                );

            }
            // END
        }
    };

    return (
        <>
            <Header />

            <section className="checkout pt-5">
                <div className="container">
                    {/* Hero Section */}
                    <div style={{
                        textAlign: 'center',
                        maxWidth: '600px',
                        margin: '0 auto 30px'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
                        }}>
                            <i className="ri-secure-payment-line" style={{ fontSize: '28px', color: '#fff' }}></i>
                        </div>
                        <h1 style={{
                            fontSize: '28px',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            marginBottom: '12px'
                        }}>
                            Secure Checkout
                        </h1>
                        <p style={{
                            fontSize: '16px',
                            color: '#666'
                        }}>
                            Complete your order securely and safely
                        </p>
                    </div>
                    <br />
                    <form onSubmit={handlePlaceOrder}>
                        <div className="checkout-container">

                            {/* Left Area */}
                            <div className="checkout">
                                <div className="title">Billing Address</div><br />
                                <div className="content">
                                    <div className="user-details full-input-box">
                                        <div className="form-group py-2">
                                            <span className="details">Full Name<i className="text-danger">*</i></span>
                                            <input
                                            className="custom-input"
                                            name="fullName" 
                                            type="text" 
                                            placeholder="Enter your full name" 
                                            defaultValue={`${user?.first_name || ''} ${user?.last_name || ''}`.trim()}
                                            required />
                                        </div>
                                        <div className="form-group py-2">
                                            <span className="details">Phone Number<i className="text-danger">*</i></span>
                                            <input 
                                            className="custom-input" 
                                            minLength="11" 
                                            name="phone" 
                                            type="text" 
                                            placeholder="Enter your number" 
                                            required 
                                            defaultValue={user?.phone || ''}
                                            />
                                        </div>
                                        <div className="form-group py-2">
                                            <span className="details">Email (Optional)</span>
                                            <input 
                                            className="custom-input" 
                                            name="email" 
                                            type="email" 
                                            placeholder="Enter your email" 
                                            defaultValue={user?.email || ''}
                                            />
                                        </div>
                                        <div className="form-group py-2">
                                            <span className="details">Address<i className="text-danger">*</i></span>
                                            <textarea name="address" placeholder="Enter your address" required rows="3"></textarea>
                                        </div>

                                        <div className="form-group py-2">
                                            <span className="details">Order Note (Optional)<i className="text-danger"></i></span>
                                            <textarea name="orderNote" placeholder="Enter your order note" rows="3"></textarea>
                                        </div>

                                        <br />

                                        {/* Delivery Options */}
                                        <div className="radio-input-box">
                                            <span className="details">Choose Your Delivery Location<i className="text-danger">*</i></span>
                                            {deliveryOptions.map((option) => (
                                                <div key={option.id}>
                                                    <input
                                                        type="radio"
                                                        name="city"
                                                        id={option.id}
                                                        value={option.label}
                                                        checked={selectedCity === option.label}
                                                        onChange={() => {
                                                            setSelectedCity(option.label);
                                                            setShippingCharge(option.charge);
                                                        }}
                                                    />
                                                    <label htmlFor={option.id}>{option.label}</label>
                                                </div>
                                            ))}
                                            <br />
                                            <i>
                                                {deliveryOptions.map((option) => (
                                                    <p key={option.id} className="text-muted">
                                                        * Delivery Charge {option.label} {option.charge} ৳
                                                    </p>
                                                ))}
                                            </i>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* Right Area */}
                            <div className="order-info">

                                <div className="products-info">
                                    <div className="title">Your Order</div><br />

                                    {/* Empty State */}
                                    {carts.length === 0 ? (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '60px 20px',
                                            background: '#f9fafb',
                                            borderRadius: '16px',
                                            border: '2px dashed #ccc'
                                        }}>
                                            <div style={{
                                                width: '80px',
                                                height: '80px',
                                                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto 20px'
                                            }}>
                                                <i className="ri-shopping-bag-line" style={{ fontSize: '36px', color: '#9ca3af' }}></i>
                                            </div>
                                            <h3 style={{
                                                fontSize: '20px',
                                                fontWeight: '600',
                                                color: '#1f2937',
                                                marginBottom: '8px'
                                            }}>
                                                No items in your order
                                            </h3>
                                            <p style={{
                                                fontSize: '15px',
                                                color: '#6b7280',
                                                marginBottom: '24px'
                                            }}>
                                                Add some products to your cart to continue
                                            </p>
                                            <Link 
                                                to="/shop" 
                                                style={{
                                                    display: 'inline-block',
                                                    padding: '12px 28px',
                                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                    color: '#fff',
                                                    borderRadius: '10px',
                                                    textDecoration: 'none',
                                                    fontWeight: '500',
                                                    fontSize: '15px',
                                                    transition: 'transform 0.2s'
                                                }}
                                                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                            >
                                                Continue Shopping
                                            </Link>
                                        </div>
                                    ) : (
                                        <>
                                            {discount && (
                                                <div className="alert alert-primary" role="alert" id="discount-alert">
                                                    {discount.discount_amount > 0 ? (
                                                        <>
                                                            You got <strong>৳ {discount.discount_amount}</strong> discount{" "}
                                                            {discount.free_shipping == 1 && " + Free Shipping!"}
                                                            {discount.extra_amount > 0 && (
                                                                <> | Add ৳ {discount.extra_amount} more to unlock the next discount.</>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            No discount yet. Spend ৳ {discount.extra_amount} more to unlock your first discount.
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            <div className="order-list">
                                                <div className="order-titles">
                                                    <h5>Products</h5>
                                                    <h5>Price</h5>
                                                </div>

                                                {/* <hr /> */}

                                                <div className="order-items">
                                                {carts.map((product, index) => (
                                                    <div key={index} className="order-item bg-white p-2 rounded-3 border">
                                                        
                                                        {/* LEFT COLUMN - Product Information */}
                                                        <div className="order-product-info">
                                                            <div className="cart-box">
                                                                {/* Image Column */}
                                                                <img src={product.image} alt="cart-img" />
                                                                
                                                                {/* Details Column */}
                                                                <div className="cart-details">
                                                                    {/* Product Name */}
                                                                    <h2 className="cart-product-title">{product.name}</h2>
                                                                    
                                                                    {/* Size & Color Row (2 columns) */}
<div className="size-color-row">
    {/* If size exists, show Size first */}
    {product.size && (
        <div>
            <span>Size:</span>
            <span>{product.size}</span>
        </div>
    )}

    {/* Always show Color if exists */}
    {product.colorName && (
        <div>
            <span>Color:</span>
            {product.colorHex && (
                <span
                    style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: product.colorHex,
                        border: '1px solid #ddd',
                        display: 'inline-block',
                        margin: '0 4px'
                    }}
                ></span>
            )}
            <span>{product.colorName}</span>
        </div>
    )}
</div>


                                                                    {/* Unit Price Row */}
                                                                    <div className="unit-price">
                                                                        ৳ {product.price}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* RIGHT COLUMN - Actions */}
                                                        <div className="order-item-actions">
                                                            {/* Row 1: Quantity Controls */}
                                                            <div className="cart-quantity">
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => decrementQuantity(product.id, product.size, product.colorName)} 
                                                                    className="decrement"
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="number">{product.quantity}</span>
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => incrementQuantity(product.id, product.size, product.colorName)} 
                                                                    className="increment"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>

                                                            {/* Row 2: Total Price & Remove Button (2 columns) */}
                                                            <div className="order-item-bottom">
                                                                {/* Total Price */}
                                                                <div className="order-product-price">
                                                                    ৳ {product.price * product.quantity}
                                                                </div>

                                                                {/* Remove Button */}
                                                                <i
                                                                    onClick={() => removeCart(product.id, product.size, product.colorName)}
                                                                    className="border ri-delete-bin-line cart-remove"
                                                                    style={{ cursor: "pointer" }}
                                                                ></i>
                                                            </div>
                                                        </div>

                                                    </div>
                                                ))}
                                            </div>

                                                <br />
                                                {/* <hr /> */}

                                                <div className="subtotal">
                                                    <div className="subtotal-title"><b>Subtotal</b></div>
                                                    <div className="subtotal-price amount">৳ {totalPrice}</div>
                                                </div><br />

                                                <div className="subtotal">
                                                    <div className="subtotal-title"><b>Discount</b></div>
                                                    <div className="subtotal-price amount">৳ {Number(discountAmount) + Number(purchaseDiscountAmount)}</div>
                                                </div><br />
                                                
                                                <div className="shipping">
                                                    <div className="shipping-title"><b>Shipping</b></div>
                                                    <div className="shipping-price amount">৳ {shippingCharge}</div>
                                                </div>
                                                <hr />

                                                <div className="total-product-price">
                                                    <div className="total-product-price-title"><b>Total</b></div>
                                                    <div className="total-product-price-price amount">
                                                        ৳ {Number(finalPrice) - Number(discountAmount) - Number(purchaseDiscountAmount)}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <br />

                                {/* COUPON */}
                                <div className="order-list">
                                    <div className="title">Coupon Code</div>
                                    <br />

                                    <div className="d-flex gap-2">
                                        <input
                                            type="text"
                                            className="p-3 custom-input"
                                            id="coupon"
                                            name="coupon"
                                            placeholder="Enter coupon code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-dark px-4"
                                            onClick={handleApplyCoupon}
                                        >
                                            Apply
                                        </button>
                                    </div>

                                    {discountAmount > 0 && (
                                        <p className="text-success mt-2">Discount Applied: ৳ {discountAmount}</p>
                                    )}
                                </div>
                                {/* END COUPON */}


                                <br />
                                <div className="payment-info">
                                    <div className="title">Payment Method</div><br />

                                    {/* COD */}
                                    <div className="selection-box">
                                        <p>Pay With Cash Upon Delivery</p><br />
                                        <div className="radio-input-box">
                                            <input
                                                type="radio"
                                                id="cod"
                                                name="payment_method"
                                                value="Cash On Delivery"
                                                checked={paymentMethod === "cod"}
                                                onChange={() => setPaymentMethod("cod")}
                                            />
                                            <label htmlFor="cod">Cash On Delivery</label>
                                        </div>
                                    </div>

                                    {/* SSLCOMMERZ */}
                                    <div className="selection-box">
                                        <p>Online Payment</p><br />
                                        <div className="radio-input-box">
                                            <input
                                                type="radio"
                                                id="sslcommerz"
                                                name="payment_method"
                                                value="sslcommerz"
                                                checked={paymentMethod === "sslcommerz"}
                                                onChange={() => setPaymentMethod("sslcommerz")}
                                            />
                                            <label htmlFor="sslcommerz"><img className="w-25" src={SSLLOGO} alt="" /></label>
                                        </div>
                                    </div>

                                    {/* Mobile Banking */}
                                    <div className="selection-box">
                                        <p>Mobile Banking</p><br />
                                        <div className="accordion accordion-flush" id="accordionFlushExample">
                                            {paymentMethods.map((method) => (
                                                <div className="accordion-item" key={method.id}>
                                                    <h2 className="accordion-header" id={`heading-${method.id}`}>
                                                        <button
                                                            className="accordion-button collapsed"
                                                            type="button"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target={`#${method.accordionId}`}
                                                            aria-expanded="false"
                                                            aria-controls={method.accordionId}
                                                            onClick={() => setPaymentMethod(method.id)}
                                                        >
                                                            <div className="radio-input-box">
                                                                <input
                                                                    type="radio"
                                                                    id={method.id}
                                                                    name="payment_method"
                                                                    value={method.name}
                                                                    checked={paymentMethod === method.id}
                                                                    onChange={() => setPaymentMethod(method.id)}
                                                                />
                                                                <label htmlFor={method.id}>{method.name}</label>
                                                            </div>
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id={method.accordionId}
                                                        className="accordion-collapse collapse"
                                                        aria-labelledby={`heading-${method.id}`}
                                                        data-bs-parent="#accordionFlushExample"
                                                    >
                                                        <div className="accordion-body">
                                                            <div className="payment-instructions">
                                                                <p>1. Go to your {method.name} app</p>
                                                                <p>2. Choose "Send Money"</p>
                                                                <p>3. Enter account number</p>
                                                                <p>4. Enter total amount</p>
                                                                <p>5. Confirm with PIN</p>
                                                                <p>6. Paste Transaction ID below</p>
                                                            </div>
                                                            <br />
                                                            <i>You need to send us</i> <b>৳{Number(finalPrice) - Number(discountAmount) - Number(purchaseDiscountAmount)}</b>
                                                            <br />
                                                            <i>Account Type:</i> <b>Personal</b>
                                                            <br />
                                                            <i>Account Number:</i> <b>{webInfo?.acc_num}</b>
                                                            <br /><br />
                                                            {renderPaymentInputs(method.id, method.name)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    
                                    <div className="button">
                                        <input className="btn btn-dark" type="submit" value={loading ? "Placing..." : "Place Order"} disabled={loading} />
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </form>
                   
                </div>
            </section>

            {/* Blocked Customer Warning Overlay */}
            {blockedWarning && (
                <div className="blocked-warning-overlay" onClick={() => setBlockedWarning(null)}>
                    <div className="blocked-warning-card" onClick={(e) => e.stopPropagation()}>
                        <button className="blocked-warning-close" onClick={() => setBlockedWarning(null)}>
                            <i className="ri-close-line"></i>
                        </button>
                        <div className="blocked-warning-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                        <h2 className="blocked-warning-title">Account Restricted</h2>
                        <p className="blocked-warning-message">{blockedWarning}</p>
                        <div className="blocked-warning-divider"></div>
                        <p className="blocked-warning-subtext">Need help? Reach out to our support team via WhatsApp for quick assistance.</p>
                        <a
                            href={`https://api.whatsapp.com/send?phone=${webInfo?.wp_api_num}&text=Hello%2C%20I%20need%20help%20with%20my%20account.%20My%20profile%20seems%20to%20be%20restricted.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="blocked-warning-whatsapp-btn"
                        >
                            <i className="ri-whatsapp-line"></i>
                            Contact on WhatsApp
                        </a>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

export default Checkout;