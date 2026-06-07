import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import productRoutes from './routes/products.js'
import orderRoutes  from './routes/orders.js'
import userRoutes   from './routes/users.js'
import cartRoutes   from './routes/cart.js'
import authRoutes   from './routes/auth.js'

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => res.json({ message: 'LERD API is running' }))

app.use('/api/products', productRoutes)
app.use('/api/orders',   orderRoutes)
app.use('/api/users',    userRoutes)
app.use('/api/cart',     cartRoutes)
app.use('/api/auth',     authRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
