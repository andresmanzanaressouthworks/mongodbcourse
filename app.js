const MongoClient = require("mongodb").MongoClient;

const circulationRepo = require("./repos/circulationRepo");
const data = require("./circulation.json");
const assert = require("assert");

const url = "mongodb://localhost:27017";
const dbName = "circulation";

async function main() {
  const client = new MongoClient(url);
  await client.connect();

  try {
    const results = await circulationRepo.loadData(data);
    assert.strictEqual(data.length, results.insertedCount);

    const getData = await circulationRepo.get();
    assert.strictEqual(data.length, getData.length);

    const filterData = await circulationRepo.get({
      Newspaper: getData[4].Newspaper,
    });
    assert.deepStrictEqual(filterData[0], getData[4]);

    const limitData = await circulationRepo.get({}, 3);
    assert.strictEqual(limitData.length, 3);

    const byId = await circulationRepo.getById(getData[4]._id.toString());
    assert.deepStrictEqual(byId, getData[4]);

    const item = {
      Newspaper: "Los Andes",
      "Daily Circulation, 2004": 2192,
      "Daily Circulation, 2013": 1674,
      "Change in Daily Circulation, 2004-2013": -24,
      "Pulitzer Prize Winners and Finalists, 1990-2003": 1,
      "Pulitzer Prize Winners and Finalists, 2004-2014": 1,
      "Pulitzer Prize Winners and Finalists, 1990-2014": 2,
    };

    const addItem = await circulationRepo.addItem(item);
    assert(addItem._id);

    const updateItem = {
      Newspaper: "Los Andes",
      "Daily Circulation, 2004": 2192,
      "Daily Circulation, 2013": 1674,
      "Change in Daily Circulation, 2004-2013": -24,
      "Pulitzer Prize Winners and Finalists, 1990-2003": 1,
      "Pulitzer Prize Winners and Finalists, 2004-2014": 1,
      "Pulitzer Prize Winners and Finalists, 1990-2014": 2,
    };

    const update = await circulationRepo.updateItem(
      getData[4]._id.toString(),
      updateItem
    );

    await circulationRepo.removeItem(getData[4]._id.toString());
  } catch (error) {
    console.log(error);
  } finally {
    const admin = client.db(dbName).admin();
    await client.db(dbName).dropDatabase();
    client.close();
  }
}

main();
