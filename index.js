const connnectToMongo = require("./db");

connnectToMongo();

const express = require("express")
const app = express()
const port = 3000



// Available Routes

app.use("/api/auth", require("./routes/auth"));

app.use("/api/notes", require("./routes/notes"));




















app.listen(port, () => {
  console.log(`Server live at http://localhost:${port}`)
})