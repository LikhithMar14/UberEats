import dotenv from "dotenv"
import {app} from './app'
import { prisma } from "./prismaClient"

dotenv.config({path:'.env'})

const port = process.env.PORT || 8000



app.listen(port, (err?: Error) => {
    if (err) {
      console.error('Error starting the server:', err);
      process.exit(1);
    } else {
      console.log(`Server is running at port: ${port}`);
    }
  });

