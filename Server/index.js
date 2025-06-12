import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import _ from "lodash";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://coursemacy.onrender.com",
];

// ✅ Log incoming origin (for debugging CORS issues)
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});

// ✅ CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // important for cookies
}));

// ✅ Basic middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/media", mediaRoute);

// ✅ Serve frontend (if deploying fullstack on Render)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/Client/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "Client", "dist", "index.html"));
});

// ✅ Start server
app.listen(PORT, () => {
  connectDB();
  console.log(`✅ Server running on port ${PORT}`);
});

 