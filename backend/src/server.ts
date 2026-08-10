import express from "express";
import cors from "cors";
import developerRoutes from "./routes/developer.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Task Assignment API is running"
  });
});

app.use("/api/developers", developerRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});