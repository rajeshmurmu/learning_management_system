import express from "express";
import cors from "cors";
import cookiesParser from "cookie-parser";
import morgan from "morgan";

const app = express();

// middlewares
app.use(morgan("tiny"));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.static("public"));
// app.use(express.static("temp"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiesParser());

// routes

// user
import userRoutes from "./routes/user.routes.js";
app.use("/api/v1/user", userRoutes);

// courses
import courseRoutes from "./routes/course.routes.js";
app.use("/api/v1/courses", courseRoutes);

// lectures
import lectureRoutes from "./routes/lecture.routes.js";
app.use("/api/v1/lectures", lectureRoutes);

// media upload
import mediaRoutes from "./routes/media.routes.js";
app.use("/api/v1/media", mediaRoutes);

// orders
import orderRoutes from "./routes/order.routes.js";
app.use("/api/v1/order", orderRoutes);

// webhooks
import webhookRoutes from "./webhooks/order.webhook.js";
app.use("/api/v1/webhooks", webhookRoutes);

app.get("/", (req, res) => {
  res.send("Hello World! | This is learning management api route home");
});
export default app;
