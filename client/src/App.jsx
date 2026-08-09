import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { CartProvider } from './context/CartContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import BuyProduct from './pages/BuyProduct'
import Contact from './pages/Contact'
import Spotlight from './pages/Spotlight'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import AdminLayout from './pages/admin/AdminLayout'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import Novara from './pages/Novara'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Checkout from './pages/Checkout'
import PaymentReturn from './pages/PaymentReturn'
import PaymentCancel from './pages/PaymentCancel'
import Dashboard from './pages/admin/Dashboard'
import AddProduct from './pages/admin/AddProduct'
import ProductList from './pages/admin/ProductList'
import AddBlog from './pages/admin/AddBlog'
import BlogList from './pages/admin/BlogList'
import Orders from './pages/admin/Orders'
import SellProduct from './pages/admin/SellProduct'
import Inventory from './pages/admin/Inventory'
import Users from './pages/admin/Users'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <CartProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="login" element={<Login />} />

        {/* Main site */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<BuyProduct />} />
          <Route path="spotlight" element={<Spotlight />} />
          <Route path="novara" element={<Novara />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogPost />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="contact" element={<Contact />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment/success" element={<PaymentReturn />} />
          <Route path="payment/cancel" element={<PaymentCancel />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin dashboard — protected: redirects guests to /login, non-admins to / */}
        <Route path="admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="orders"   element={<Orders />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="add-blog" element={<AddBlog />} />
          <Route path="blogs" element={<BlogList />} />
          <Route path="sell" element={<SellProduct />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="users"     element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </CartProvider>
  )
}
