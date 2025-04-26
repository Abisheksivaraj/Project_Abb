const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const login = require("./Route/LoginRoute");
app.use(login);

const data = require("./Route/GetCollection");
app.use(data);



const login = require("./Route/LoginRoute");
app.use(login);
























app.get("/", (req, res) => {
  return res.status(200).send({
    message: "ABB Project backend running successfully",
    status: true,
  });
});

module.exports = app;
