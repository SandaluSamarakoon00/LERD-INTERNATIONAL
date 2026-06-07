import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CartSidebar from '../cart/CartSidebar'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartSidebar />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <div className="pb-16 md:pb-0">
        <Footer />
      </div>
    </div>
  )
}
