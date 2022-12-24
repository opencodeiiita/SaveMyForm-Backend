import mongoose from 'mongoose';
import {config} from 'dotenv';
config();

export default function connDB() {
  mongoose.set('strictQuery', true);
  mongoose
    .connect(process.env.MONGO_DB_CONN_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('connected to db');
    });
}
