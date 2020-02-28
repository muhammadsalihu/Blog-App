const { MongoClient } = require("mongodb");
import Admin from "../models/user-type/admin";

describe("Insert", () => {
  let connection;
  let db;

  console.log(global.__MONGO_URI__);
  console.log(global.__MONGO_DB_NAME__);

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true
    });
    db = await connection.db(global.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  it("should insert a doc into collection", async () => {});
});

test("Test mutations", () => {});

// global.__MONGO_DB_NAME__ = "jest"
// global.__MONGO_DB_NAME__ = "mongodb://127.0.0.1:60832/jest?"
