import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase } from "./db";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

async function startServer() {
  try {
    // Validate critical environment variables
    const requiredEnvVars = ['DATABASE_URL'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
      log(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
      throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }

    // Set production defaults
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    log(`🔧 Environment: ${process.env.NODE_ENV}`);

    // Validate port configuration early
    const port = parseInt(process.env.PORT || '5000', 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      log(`❌ Invalid port configuration: ${process.env.PORT}`);
      throw new Error(`Invalid port number: ${process.env.PORT}`);
    }

    // Initialize database connection with retry logic
    log("🔄 Initializing database connection...");
    await initializeDatabase();
    log("✅ Database initialized successfully");

    // Register routes with error handling
    log("🔄 Setting up routes...");
    const server = await registerRoutes(app);
    log("✅ Routes registered successfully");

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      log(`Error: ${message}`);
      res.status(status).json({ message });
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    
    log(`🔄 Starting server on port ${port}...`);
    
    // Start server with comprehensive error handling
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`🚀 Server successfully started!`);
      log(`📍 Port: ${port}`);
      log(`🌐 Host: 0.0.0.0 (accessible from anywhere)`);
      log(`🔧 Environment: ${process.env.NODE_ENV}`);
      log(`💚 Health check: /health`);
      log(`📊 API endpoints: /api/*`);
    });

    // Handle server startup errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        log(`❌ Port ${port} is already in use`);
        process.exit(1);
      } else if (error.code === 'EACCES') {
        log(`❌ Permission denied to bind to port ${port}`);
        process.exit(1);
      } else {
        log(`❌ Server error: ${error.message}`);
        process.exit(1);
      }
    });

    // Graceful shutdown handling
    const gracefulShutdown = (signal: string) => {
      log(`Received ${signal}. Closing server gracefully...`);
      server.close((err) => {
        if (err) {
          log(`Error during graceful shutdown: ${err.message}`);
          process.exit(1);
        }
        log('Server closed gracefully');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    return server;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`💥 Critical startup error: ${errorMessage}`);
    
    // Log additional context in development
    if (process.env.NODE_ENV === 'development' && error instanceof Error && error.stack) {
      log(`Stack trace: ${error.stack}`);
    }
    
    // Attempt graceful cleanup before exit
    try {
      // Close any open database connections
      process.exit(1);
    } catch (cleanupError) {
      log(`Error during cleanup: ${cleanupError}`);
      process.exit(1);
    }
  }
}

// Ensure uncaught exceptions and unhandled rejections are logged
process.on('uncaughtException', (error) => {
  log(`💥 Uncaught Exception: ${error.message}`);
  log(`Stack: ${error.stack}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`💥 Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

// Start the server
startServer().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  log(`💥 Unexpected error during startup: ${errorMessage}`);
  process.exit(1);
});
