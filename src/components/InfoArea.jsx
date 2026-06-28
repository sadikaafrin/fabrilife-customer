// Info Icon Image
import INFO1 from '../assets/img/f-icon1.png'
import INFO2 from '../assets/img/f-icon2.png'
import INFO3 from '../assets/img/f-icon3.png'
import INFO4 from '../assets/img/f-icon4.png'

function InfoArea() {
    return ( 
        <>
            <div className="info-area d-none d-md-block">
                <div className="container">

                    <div className="row features-inner py-3 py-md-5" style={{ background: '#fff', padding: '40px 0' }}>
                        {/* <!-- single features --> */}
                        <div className="col-md-3">
                            <div className="single-features text-center" style={{ borderRight: '1px solid #eeeeee' }}>
                                <div className="f-icon" style={{ marginBottom: '20px' }}>
                                    <img src={INFO1} alt="" />
                                </div>
                                <h6>Fast Delivery</h6>
                                <p>Fast Shipping on all order</p>
                            </div>
                        </div>
                        {/* <!-- single features --> */}
                        <div className="col-md-3">
                            <div className="single-features text-center" style={{ borderRight: '1px solid #eeeeee' }}>
                                <div className="f-icon" style={{ marginBottom: '20px' }}>
                                    <img src={INFO2} alt="" />
                                </div>
                                <h6>Return Policy</h6>
                                <p>Easy return facility for any problem</p>
                            </div>
                        </div>
                        {/* <!-- single features --> */}
                        <div className="col-md-3">
                            <div className="single-features text-center" style={{ borderRight: '1px solid #eeeeee' }}>
                                <div className="f-icon" style={{ marginBottom: '20px' }}>
                                    <img src={INFO3} alt="" />
                                </div>
                                <h6>24/7 Support</h6>
                                <p>24 hours live support at your service</p>
                            </div>
                        </div>
                        {/* <!-- single features --> */}
                        <div className="col-md-3">
                            <div className="single-features text-center">
                                <div className="f-icon" style={{ marginBottom: '20px' }}>
                                    <img src={INFO4} alt="" />
                                </div>
                                <h6>Secure Payment</h6>
                                <p>We accept all the payment method</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
     );
}

export default InfoArea;