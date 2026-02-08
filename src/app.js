const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const locationRoutes = require("./routes/locationRoutes");
const weatherRoutes = require("./routes/weatherRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


// API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resource", locationRoutes); // важно: как в требованиях
app.use("/api/weather", weatherRoutes);

// фронтенд как статика (чтобы было “website”)
app.use(express.static(require("path").join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.json({
    message: "Weather Forecast API is running ",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      weather: "/api/weather",
      resources: "/api/resource"
    }
  });
});


app.use(notFound);
app.use(errorHandler);

module.exports = app;
