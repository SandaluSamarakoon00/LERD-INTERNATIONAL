import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="pt-24 min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="font-serif text-8xl text-leather-200 mb-4">404</p>
      <h1 className="font-serif text-3xl text-leather-800 mb-4">Page not found</h1>
      <Link to="/" className="text-yellow-600 hover:text-yellow-500 text-sm underline">Go back home</Link>
    </div>
  )
}
