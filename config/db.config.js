import mongoose from 'mongoose';

export default function connDB() {
  mongoose
    .connect(process.env.MONGO_DB_CONN_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('connected to db');
    });
}
