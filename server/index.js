import dotenv from "dotenv";
import connectDB from "./config/database.js";
import app from "./app.js";

// for potential test suite i may add later
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

dotenv.config({
  path: '.env.test',
  override: true
});

const startServer = async () => {
  try {
    await connectDB();

    app.on("error", (error) => {
      console.log("ERROR", error);
      throw error;
    });

    app.listen(process.env.PORT || 3001, () => {
      console.log(`Server is running on port :
        ${process.env.PORT}`)
    });
  } catch (error) {
    console.log("MongoDB connection failed", error);
  }
}
console.log('Loaded env file:', envFile);
console.log('Mongo URI:', process.env.MONGODB_URI);

startServer();