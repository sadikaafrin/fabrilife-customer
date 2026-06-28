import { Link } from 'react-router-dom';
import { useCart } from "../CartContext";

function BottomNavbar() {

    const { cartCount } = useCart();

    // Get logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));


    /* OPEN CART BUTTON */
    const openCartBar = () => {
        const cart = document.querySelector('.cart');
        cart.style.right = '0';
    }
    /* END */
    
    return ( 
        <>
            <div className="bottom-nav-mobile nav-page" style={{zIndex: 99}}>
                <ul>
                    <li>
                        <Link to="/">
                            <i className="ri-home-4-line"></i>
                            <p>Home</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/categories">
                            <i className="ri-menu-2-line"></i>
                            <p>Category</p>
                        </Link>
                    </li>
                    <li>
                        <a onClick={openCartBar} style={{ cursor: 'pointer' }}>
                            <div className="cart-icon-mobile">
                                <i className="ri-shopping-cart-2-line"></i>
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </div>
                            <p>Cart</p>
                        </a>
                    </li>
                    <li>
                        <Link to="/contact-us">
                            <i className="ri-chat-3-line"></i>
                            <p>Chat</p>
                        </Link>
                    </li>
                    <li>
                        <Link to={user ? "/dashboard" : "/login"}>
                            <i className="ri-user-line"></i>
                            <p>{user ? 'Account' : 'Login'}</p>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
     );
}

export default BottomNavbar;