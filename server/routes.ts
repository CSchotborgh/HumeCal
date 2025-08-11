import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { checkDatabaseConnection } from "./db";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Comprehensive health check endpoint for deployment monitoring
  app.get('/health', async (_req, res) => {
    try {
      const startTime = Date.now();
      const isDatabaseHealthy = await checkDatabaseConnection();
      const dbResponseTime = Date.now() - startTime;
      
      const health = {
        status: isDatabaseHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        database: {
          status: isDatabaseHealthy ? 'connected' : 'disconnected',
          responseTime: `${dbResponseTime}ms`
        },
        server: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          environment: process.env.NODE_ENV || 'development',
          nodeVersion: process.version,
          port: process.env.PORT || '5000'
        },
        checks: {
          database: isDatabaseHealthy,
          envVars: !!process.env.DATABASE_URL,
        }
      };
      
      const statusCode = isDatabaseHealthy ? 200 : 503;
      res.status(statusCode).json(health);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: errorMessage,
        server: {
          uptime: process.uptime(),
          environment: process.env.NODE_ENV || 'development'
        }
      });
    }
  });

  // Basic liveness probe for Kubernetes/container orchestration
  app.get('/health/live', (_req, res) => {
    res.status(200).json({ status: 'alive', timestamp: new Date().toISOString() });
  });

  // Readiness probe - checks if app is ready to serve traffic
  app.get('/health/ready', async (_req, res) => {
    try {
      const isDatabaseHealthy = await checkDatabaseConnection();
      if (isDatabaseHealthy) {
        res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
      } else {
        res.status(503).json({ status: 'not ready', reason: 'database unavailable' });
      }
    } catch (error) {
      res.status(503).json({ status: 'not ready', reason: 'health check failed' });
    }
  });

  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get all events
  app.get("/api/events", async (_req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ 
        message: "Failed to fetch events",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined
      });
    }
  });

  // Get single event by ID
  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  // Get events by date range
  app.get("/api/events/range/:startDate/:endDate", async (req, res) => {
    try {
      const { startDate, endDate } = req.params;
      const events = await storage.getEventsByDateRange(startDate, endDate);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events by date range" });
    }
  });

  // Get events by type
  app.get("/api/events/type/:eventType", async (req, res) => {
    try {
      const events = await storage.getEventsByType(req.params.eventType);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events by type" });
    }
  });

  // User favorites routes (protected)
  app.get("/api/favorites", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { eventId } = req.body;
      
      if (!eventId) {
        return res.status(400).json({ message: "Event ID is required" });
      }

      // Check if event exists
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if already favorited
      const isFav = await storage.isFavorite(userId, eventId);
      if (isFav) {
        return res.status(409).json({ message: "Event already favorited" });
      }

      const favorite = await storage.addFavorite(userId, eventId);
      res.status(201).json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites/:eventId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { eventId } = req.params;

      await storage.removeFavorite(userId, eventId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  app.get("/api/favorites/check/:eventId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { eventId } = req.params;
      
      const isFavorite = await storage.isFavorite(userId, eventId);
      res.json({ isFavorite });
    } catch (error) {
      console.error("Error checking favorite:", error);
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });

  // Calendar sync routes (protected)
  app.put("/api/calendar-sync", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { enabled, googleCalendarId, outlookCalendarId } = req.body;

      const user = await storage.updateCalendarSync(
        userId, 
        enabled, 
        googleCalendarId, 
        outlookCalendarId
      );
      res.json(user);
    } catch (error) {
      console.error("Error updating calendar sync:", error);
      res.status(500).json({ message: "Failed to update calendar sync" });
    }
  });

  app.get("/api/sync-logs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const logs = await storage.getSyncLogs(userId);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching sync logs:", error);
      res.status(500).json({ message: "Failed to fetch sync logs" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
