import mongoose from "mongoose";

export async function connectToDB() {
  console.log(process.env.MONGO_DB);
  mongoose
    .connect(process.env.MONGO_DB || "")
    .then(() => console.log("DB Connected!"));
  mongoose.set("strictQuery", true);
}

export default mongoose;
