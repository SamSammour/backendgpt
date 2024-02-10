const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes/api");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", routes);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something went wrong please try after some time!");
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
