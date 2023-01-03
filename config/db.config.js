import mongoose from 'mongoose';
let bucket;

export default function connDB() {
  mongoose.set('strictQuery', true);
  mongoose
    .connect(process.env.MONGO_DB_CONN_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('connected to db');
      const db = mongoose.connections[0].db
      bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "uploads"
      });
    });
}
