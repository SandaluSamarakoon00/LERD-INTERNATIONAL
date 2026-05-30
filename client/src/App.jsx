import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import BuyProduct from './pages/BuyProduct'
import Contact from './pages/Contact'
import Spotlight from './pages/Spotlight'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AddProduct from './pages/admin/AddProduct'
import ProductList from './pages/admin/ProductList'
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
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin dashboard */}
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="sell" element={<SellProduct />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="users"     element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
