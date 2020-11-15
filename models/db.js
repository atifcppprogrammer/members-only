const mongoClient = require('mongodb').MongoClient;

const collectionNames = [ 'messages', 'users' ];
const databaseName = 'membersOnlyDB';
const connectionString = process.env.mongoConnectionString || 
  'mongodb://localhost:27017/membersOnlyDB';

exports.makeConnection = async () => {
  const options = { useUnifiedTopology: true };
  const result = await mongoClient.connect(connectionString, options)
    .then(client => ({ error: null, data: client }))
    .catch(error => ({ error, data: null }));
  if (result.error) throw result.error;
  this.client = result.data;
  const db = result.data.db(databaseName);
  this.messages = db.collection(collectionNames[0]);
  this.users = db.collection(collectionNames[1]);
}

exports.messages = undefined;
exports.client = undefined;
exports.users = undefined;
