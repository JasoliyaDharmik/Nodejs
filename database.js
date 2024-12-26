require('dotenv').config();
const { MongoClient } = require('mongodb');

// Connection URL
const url = process.env.DATABASE_URL;
const client = new MongoClient(url);

// Database Name
const dbName = 'Learning';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('Users');

  // the following code examples can be pasted here...
  const data = {
    _id: "1",
    firstName: "dharmik",
    lastName: "jasoliya",
    age: "24"
  }
  const insertResult = await collection.insertMany([data]);
  console.log('Inserted documents =>', insertResult);

  //   const filteredDocs = await collection.find({ age: "124" }).toArray();
  // console.log(filteredDocs);

  // const updateResult = await collection.updateOne({ age: "24" }, { $set: { city: "Bhavnagar" } });
  // console.log(updateResult);

  // const deleteResult = await collection.deleteMany({ age: "24" });
  // console.log('Deleted documents =>', deleteResult);

  // const findResult = await collection.find({}).toArray();
  // console.log('Found documents =>', findResult);

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());