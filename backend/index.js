const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
require("dotenv").config({ path: "../backend/.env" });

const app = express();
const PORT = process.env.PORT;  

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  cors({
    
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.use(
  express.static("public", {
    setHeaders: (res, path) => {
      if (path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
      if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
        res.setHeader("Content-Type", "image/jpeg");
      }
      if (path.endsWith(".png")) {
        res.setHeader("Content-Type", "image/png");
      }
    },
  })
);

app.get("/", (req, res) => {
  return res.status(200).send({ message: "Welcome" });
});


module.exports = app;

app.listen(PORT, async () => {
  await connectDb();
  console.log("Website is Running on:" + PORT);
});