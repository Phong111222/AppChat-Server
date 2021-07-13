import mongoose from 'mongoose';

const MongoConnect = () => {
  mongoose.connect(
    process.env.URI,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        throw err;
      }
      console.log('Connected MongoDB');
    }
  );
};

export default MongoConnect;
