const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const express = require("express");
const path = require("path");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const pdf = require("html-pdf");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const morgan = require("morgan");
const authRouter = require("./routes/auth");
const protectedRouter = require("./routes/protect");
const connectDB = require("./config/db");

process.on("uncaughtRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT REJECTION! SHUTTING DOWN");
  process.exit(1);
});
 
connectDB();

const pdfTemplate = require("./documents");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

//Data Sanitization  against NoSql query injecton
app.use(mongoSanitize());

//Data Sanitization against xss
app.use(xss());

app.use("/api/auth", authRouter);
app.use("/api/protect", protectedRouter);

//PDF CREATING ROUTES
app.post("/api/create-pdf", (req, res) => {
  pdf.create(pdfTemplate(req.body), {}).toFile("result.pdf", (err) => {
    if (err) {
      res.send(Promise.reject());
    }

    res.send(Promise.resolve());
  });
});

app.get("/api/fetch-pdf", (req, res) => {
  res.sendFile(`${__dirname}/result.pdf`);
});

app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("App running..");
  });
}

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
