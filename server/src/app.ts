import express,{Request,Response}from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import { MAX_JSON_PAYLOAD_SIZE,STATIC_FOLDER_NAME } from "./constants"
import userRouter from "./routes/user.route"
export const app = express()

app.use(cors())

app.use(express.json({ limit: MAX_JSON_PAYLOAD_SIZE }));
app.use(express.urlencoded({ extended: true, limit: MAX_JSON_PAYLOAD_SIZE }));
app.use(express.static(STATIC_FOLDER_NAME));
app.use(cookieParser(process.env.COOKIE_SECRET));



app.use('/api/v1/auth',userRouter)


