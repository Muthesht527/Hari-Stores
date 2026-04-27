import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: "majority",
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);

    // Fix corrupted unique index on User collection
    try {
      const userCollection = conn.connection.collection("users");
      await userCollection.dropIndex("firebaseUid_1");
      console.log("Dropped corrupted firebaseUid index");
    } catch (indexError) {
      if (indexError.code !== 27) {
        // 27 = index doesn't exist (normal case)
        console.log("Index fix status:", indexError.message);
      }
    }
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};
