const bcrypt = require("bcrypt");

async function generateHash() {
  const password = "Vale2312D";
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log("Hash generado:", hash);
}

generateHash();
