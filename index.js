const express = require("express");
require("dotenv").config();
const connectDb = require("./config/dbConnection");
const noteRoutes = require("./routes/noteRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandling");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
const cors = require("cors");
app = express();

app.use(cors());

connectDb();
const port = process.env.PORT;
app.use(express.json());

//routes
app.use("/api/note", noteRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", userRoutes);

//error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log("done");
});
