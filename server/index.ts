import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple demo API endpoints for frontend demo
app.get('/api/posts', (req, res) => {
  res.json([]);
});

app.get('/api/stock-tips', (req, res) => {
  res.json([]);
});

app.get('/api/market-data', (req, res) => {
  res.json([
    { symbol: 'AAPL', name: 'Apple Inc.', price: '150.00', change: '+2.50', changePercent: '+1.69%' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: '420.00', change: '+5.20', changePercent: '+1.25%' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '140.00', change: '-1.80', changePercent: '-1.27%' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '185.00', change: '+8.50', changePercent: '+4.81%' }
  ]);
});

app.post('/api/posts', (req, res) => {
  res.status(201).json({ id: Date.now().toString(), ...req.body, createdAt: new Date() });
});

app.post('/api/stock-tips', (req, res) => {
  res.status(201).json({ id: Date.now().toString(), ...req.body, createdAt: new Date() });
});

// All other API routes return empty responses
app.get('/api/*', (req, res) => {
  res.json([]);
});

app.post('/api/*', (req, res) => {
  res.status(201).json({ id: Date.now().toString(), message: 'Demo endpoint' });
});

(async () => {
  const server = createServer(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // Setup vite in development and serve static files in production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = 5000;
  server.listen({
    port,
    host: "127.0.0.1",
    // reusePort: true,
  }, () => {
    log(`Frontend demo server running on port ${port}`);
  });
})();