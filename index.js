const express = require("express");
const { request } = require("https");
const app = express();  
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());

const dbPath = path.join(__dirname, "sqlite.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database   
    });
    app.listen(4000, () => {
      console.log(`Server Running at http://localhost:4000/`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();


app.get("/Datta/", async (req, res) => {
  
    const getQueryDatta = "SELECT * FROM Datta";
    const datas = await db.all(getQueryDatta);

    res.send(datas);
});

app.post("/Datta/", async (request, response) => {
  const bookDetails = request.body;
  const {
    name,age,salary,
  } = bookDetails;
  const addBookQuery = `INSERT INTO
      Datta ( name,age,salary)
    VALUES
      (
        '${name}',
         ${age},
         ${salary}
      );`;

  const dbResponse = await db.run(addBookQuery);
  const dataId = dbResponse.lastID;
  response.send({ dataId: dataId });
});


app.put("/Datta/", async (request, response) => {
  try {
    const { name } = request.body;
    const updateDattaQuery = `
      UPDATE Datta
      SET name = '${name}'
    `;
    await db.run(updateDattaQuery);
    response.send("Data Updated Successfully");
  } catch (error) {
    console.error(`Error updating data: ${error.message}`);
    response.status(500).send("Internal Server Error");
  }
});

app.delete("/Datta/", async (request, response) => {
  try {
    const { name } = request.body;
    const updateDattaQuery = `
      UPDATE Datta
      SET name = '${name}'
    `;
    await db.run(updateDattaQuery);
    response.send("Data Updated Successfully");
  } catch (error) {
    console.error(`Error updating data: ${error.message}`);
    response.status(500).send("Internal Server Error");
  }
});


