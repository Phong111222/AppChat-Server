import mongoose from 'mongoose';

// export const MongoConnect = () => {
//   let gfs = null;
//   mongoose.connect(
//     process.env.URI,
//     {
//       useCreateIndex: true,
//       useNewUrlParser: true,
//       useFindAndModify: true,
//       useUnifiedTopology: true,
//     },
//     (err) => {
//       if (err) {
//         throw err;
//       }

//       console.log('Connected MongoDB');
//       const connect = mongoose.connection;
//       gfs = new mongoose.mongo.GridFSBucket(connect.db, {
//         bucketName: 'fileUploaded',
//       });
//     }
//   );
// };

export class ConnectMongo {
  constructor() {
    this.gfs = null;
  }
  static getConnect() {
    mongoose.connect(process.env.URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
    // khoi tao bucket ngay luc ket noi mongodb
    const connect = mongoose.connection;

    connect.once('open', () => {
      console.log('DB is connected');

      this.gfs = new mongoose.mongo.GridFSBucket(connect.db, {
        bucketName: process.env.MONGO_BUCKET,
      });
    });
  }
}

// export default MongoConnect;
