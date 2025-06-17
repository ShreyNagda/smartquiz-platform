import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};
export default async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already Connected to Database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: "RealtimeQuizPlatform",
    });

    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected successfully!");
  } catch (error) {
    console.log("Connection error " + error);
    process.exit(1);
  }
}
