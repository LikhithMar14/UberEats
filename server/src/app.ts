import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import { MAX_JSON_PAYLOAD_SIZE,STATIC_FOLDER_NAME } from "./constants"
import userRouter from "./routes/user.route"
import restaurantRouter from "./routes/restaurant.route"
import menuRouter from "./routes/menu.route"
import orderRouter from "./routes/order.route"
export const app = express()


app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}))

app.use(express.json({ limit: MAX_JSON_PAYLOAD_SIZE }));
app.use(express.urlencoded({ extended: true, limit: MAX_JSON_PAYLOAD_SIZE }));
app.use(express.static(STATIC_FOLDER_NAME));
app.use(cookieParser(process.env.COOKIE_SECRET));


app.use('/api/v1/auth',userRouter)
app.use('/api/v1/restaurant',restaurantRouter)
app.use('/api/v1/menu',menuRouter)
app.use('/api/v1/order',orderRouter)    


