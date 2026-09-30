import mongoose from"mongoose"
import dotenv from "dotenv"
dotenv.config();
const connectDB = async()=>{
    try{
           await mongoose.connect(process.env.MONGO_URI);
         console.log("connected succefuly")
    }catch(error){

        console.error("failed to connect with the db :",error.message)
          process.exit(1)
    }

}
export default connectDB