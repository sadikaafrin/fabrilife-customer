import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Styles
import './assets/css/theme.css';
import './assets/css/style.css';
import './assets/css/navbar.css';
import './assets/css/cartbar.css';
import './assets/css/home.css';
import './assets/css/productList.css';
import './assets/css/product.css';
import './assets/css/profile.css';
import './assets/css/checkout.css';
import './assets/css/viewCart.css';
import './assets/css/login.css';
import './assets/css/form.css';
import './assets/css/header.css';
import './assets/css/category.css';

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Category from "./pages/Category";
import SubCategory from "./pages/SubCategory";
import OrderTracking from "./pages/OrderTracking";
import SearchResults from "./pages/SearchResults";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Dashboard from "./pages/Dashboard";
import Wishlist from "./pages/Wishlist";
import ViewCart from "./pages/ViewCart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Product from "./pages/Product";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Faq from "./pages/Faq";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ShippingDelivery from "./pages/ShippingDelivery";
import TermsAndCondition from "./pages/TermsAndCondition";
import Categories from './pages/Categories';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';


import ScrollToTop from "./ScrollToTop";
import PageTracker from './PageTracker.jsx';


function App() {

  return (
    <>
      <Router>
        <ScrollToTop />
        <PageTracker />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/sub-category/:slug" element={<SubCategory />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/view-cart" element={<ViewCart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy-and-policy" element={<PrivacyPolicy />} />
          <Route path="/shipping-and-delivery" element={<ShippingDelivery />} />
          <Route path="/terms-and-conditions" element={<TermsAndCondition />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog-details/:slug" element={<BlogDetails />} />
        </Routes>
      </Router>
    </>
  )
}

export default App