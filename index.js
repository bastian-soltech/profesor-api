import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import compression from "compression";
import fs from 'fs';
import apiRoutes from "./src/routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Swagger document
const swaggerPath = path.join(__dirname, "docs", "swagger_output.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(compression());

// Routes
app.use("/api", apiRoutes);

app.get('/docs-json', (req, res) => {
  res.json(swaggerDocument);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "docs.html"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/docs`);
});
