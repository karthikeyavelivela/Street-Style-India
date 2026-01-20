import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Loading from './components/ui/Loading';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Admin from './pages/admin/Admin';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Returns from './pages/Returns';
import FAQ from './pages/FAQ';
import Shipping from './pages/Shipping';
import OrderDetails from './pages/OrderDetails';

const UserLayoutWrapper = ({ children }) => {
  return <Layout>{children}</Layout>;
};

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    isAdmin ? (
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    ) : (
      <UserLayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Profile />} />
          <Route path="/order/:id" element={<OrderDetails />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping" element={<Shipping />} />

          <Route path="*" element={<div className="container mx-auto px-4 py-20 text-center text-4xl font-black">404 - Page Not Found</div>} />
        </Routes>
      </UserLayoutWrapper>
    )
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      {loading && <Loading onComplete={() => setLoading(false)} />}
      {!loading && <AppContent />}
    </Router>
  );
}

export default App;
