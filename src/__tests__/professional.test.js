const mongoose = require("mongoose");
const UserModel = require("../../src/models/user");
const adminData = {
  email: "john@harden.com",
  password: "password",
  full_name: "Harden john"
};
const dbUrl = process.env.DB_UR;
describe("User Model Test", () => {
  // Connect to Mongo memory server
  // By using mongoose.connect
  let connection;
  let db;

  beforeAll(async () => {
    connection = await mongoose.connect(process.env.DB_UR, {
      useNewUrlParser: true
    });
    db = await connection.db(process.env.DB_UR);
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  it("create & save user successfully", async () => {
    const validUser = new UserModel(adminData);
    const savedUser = await validUser.save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedUser._id).toBeDefined();
    expect(savedUser.full_name).toBe(adminData.full_name);
    expect(savedUser.email).toBe(adminData.email);
    expect(savedUser.password).toBe(adminData.password);
  });
});

// Create User without required field
it("create user without required field should failed", async () => {
  const userWithoutRequiredField = new UserModel({ full_name: "Shark" });
  let err;
  try {
    const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
    error = savedUserWithoutRequiredField;
  } catch (error) {
    err = error;
  }
  expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  expect(err.errors.email).toBeDefined();
  expect(err.errors.password).toBeDefined();
});
