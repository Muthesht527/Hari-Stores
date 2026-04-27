import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: "majority",
    });
    
    console.log(`✓ MongoDB connected: ${conn.connection.host}`);

    // Fix corrupted unique index on User collection
    try {
      const userCollection = conn.connection.collection("users");
      await userCollection.dropIndex("firebaseUid_1");
      console.log("✓ Dropped corrupted firebaseUid index");
    } catch (indexError) {
      if (indexError.code !== 27) {
        // 27 = index doesn't exist (normal case, will be recreated)
        console.log("ℹ Index info:", indexError.message);
      }
    }
  } catch (error) {
    console.error(`✗ MongoDB connection failed: ${error.message}`);
    console.error(`Connection string: ${process.env.MONGODB_URI?.substring(0, 30)}...`);
    throw error; // Re-throw for server.js to catch
  }
};
