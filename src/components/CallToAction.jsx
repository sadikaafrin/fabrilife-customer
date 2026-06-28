import { Link } from 'react-router-dom';

function CallToAction() {
    return ( 
        <>
            <section className="py-5 bg-dark text-white">
                <div className="container text-center">
                    <h2 className="display-5 fw-bold mb-3">Ready to Experience Excellence?</h2>
                    <p className="lead mb-4">
                        Join thousands of satisfied customers and discover why Our Brand is the preferred choice for your culinary needs.
                    </p>
                    <Link to="/shop" className="btn btn-light btn-lg px-5 rounded-pill">
                        Get Started Today
                    </Link>
                </div>
            </section>
        </> 
    );
}

export default CallToAction;