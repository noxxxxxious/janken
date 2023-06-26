import mongoose from "mongoose"
import 'dotenv/config'

if(!process.env.MONGODB_URL) throw new Error("Unable to determine process.env.MONGODB_URL")

await mongoose.connect(process.env.MONGODB_URL)

export default mongoose