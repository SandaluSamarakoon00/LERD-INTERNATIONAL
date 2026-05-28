import HeroSection from '../components/home/HeroSection'
import FeaturedProducts from '../components/home/FeaturedProducts'
import BrandStory from '../components/home/BrandStory'
import Testimonials from '../components/home/Testimonials'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <BrandStory />
    </>
  )
}
