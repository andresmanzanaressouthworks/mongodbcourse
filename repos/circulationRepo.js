const { MongoClient, ObjectID } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "circulation";

function circulationRepo() {
  function loadData(data) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        const results = await db.collection("newspaper").insertMany(data);
        resolve(results);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }
  function get(query, limit) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        let items = await db.collection("newspaper").find(query);
        if (limit > 0) {
          items = items.limit(limit);
        }
        resolve(await items.toArray());
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }
  function getById(id) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        const item = await db
          .collection("newspaper")
          .findOne({ _id: ObjectID(id) });
        resolve(item);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }
  function updateItem(id, data) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        const item = await db
          .collection("newspaper")
          .findOneAndReplace({ _id: ObjectID(id) }, data);
        resolve(item);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function addItem(data) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        const item = await db.collection("newspaper").insertOne(data);
        resolve(item.ops[0]);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function removeItem(id) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        const item = await db
          .collection("newspaper")
          .findOneAndDelete({ _id: ObjectID(id) });
        resolve(item.deleteCount === 1);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  return { loadData, get, getById, addItem, updateItem, removeItem };
}

module.exports = circulationRepo();
