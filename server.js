const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
//const morgan= require('morgan');

const rateLimit = require('express-rate-limit');


const cors = require("cors");

const compression = require("compression");

dotenv.config({ path: "config.env" });

const mountRoutes = require("./routes");

const dbConnection = require("./config/database");

const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");

const { webhookCheckout } = require("./services/orderService");


dbConnection();

const app = express();

//enable other domains oto access your application (cors)
app.use(cors());
app.options("*", cors());
app.use(compression());

//checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

//middle wares

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

const limiter= rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 ,// limit each IP to 100 requests per windowMs

  message: "Too many requests from this IP, please try again later.",
  statusCode: 429,
 // onLimit: (req, res, next) => {


})

app.use('/api',limiter);


mountRoutes(app);

app.all("*", (req, res, next) => {
  // const err =new Error(  `can't find this route ${req.originalUrl}`);
  // next(err.message);
  next(new ApiError(`Cant't find this route : ${req.originalUrl}`, 400));
});

app.use(globalError);

app.get("/", (req, res) => {
  res.send("our api v3");
});

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(process.env.NODE_ENV);
  console.log("app running");
});

//Events=> list => callback(err)
process.on("unhandledRejection", (err) => {
  console.error(`UnhandeldRejection Erros:${err.name}|${err.message}`);

  server.close(() => {
    console.error(`Shuting down ...`);
    process.exit(1);
  });
});
