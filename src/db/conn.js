const mongoose = require('mongoose');

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

async function main() {
  try {
    await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.tmhl4pi.mongodb.net/?retryWrites=true&w=majority`)
    console.log("Connection succesfully")
  } catch (err) {
    console.log(err);
  }
}

module.exports = main;