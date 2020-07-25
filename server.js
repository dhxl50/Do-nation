const express = require("express");
const bodyParser = require("body-parser");
const xlsx = require('xlsx');
const fs = require("fs");
const mysql = require("mysql");

const app = express();
const port = process.env.PORT || 5000;

const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
console.log(conf);

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database,
});

function handleDisconnect() {
  connection.connect(function (err) {
    if (err) {
      console.log("error when connecting to connection:", err);
      setTimeout(handleDisconnect, 2000);
    }
  });

  connection.on("error", function (err) {
    console.log("connection error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      return handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/general_donation_data", (req, res) => {
  const sql_getData = `SELECT * FROM G_Donation;`;
  connection.query(sql_getData, (err, rows, fields) => {
    if (rows.length) {
      return console.log(rows);
    }else{
      console.log("No data");
    }
  });
});




app.post("/api/general_donation_data", (req, res) => {
  const data = req.body;
  const sql =
    "INSERT INTO G_Donation(title,author,registerTime,content,goal) VALUES(?,?,?,?,?,?);";

  // const params = [
  //   data.title,
  //   data.author,
  //   data.registerTime,
  //   data.content,
  //   data.goal
  // ];
  const params = [
    "123",
    "하와와",
    "",
    data.content,
    data.goal
  ];
  connection.query(sql, params, (err, rows, fields) => {
    if (err) {
      res.send({
        code: 400,
        message: "error",
      });
    } else {
      res.send({
        code: 200,
        message: "success",
      });
    }
  });
});

app.get("/api/general_donation_records", (req, res) => {
  const donationId = 1; //req.body.id; 로 교체
  let sql_usercheck = `SELECT * FROM GD_Record WHERE id = ${donationId};`;
  connection.query(sql_usercheck, (err, rows, fields) => {
    if (rows.length) {
      return res.send(rows);
    }else{
      console.log("No data");
    }
  });
});

app.post("/api/general_donation_records", (req, res) => {
  const data = req.body;
  const sql =
    "INSERT INTO GD_Record(recordId,donatorName,donatedMoney,donationTime) VALUES(?,?,?,?);";
  const params = [
    data.recordId,
    data.donatorName,
    data.donatedMoney,
    data.donationTime,
  ];
  console.log(params);
  connection.query(sql, params, (err, rows, fields) => {
    if (err) {
      res.send({
        code: 400,
        message: "error",
      });
    } else {
      res.send({
        code: 200,
        message: "success",
      });
    }
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));