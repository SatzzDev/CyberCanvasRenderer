import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { profile, Welcome, Goodbye } from "./lib/canvas-generator";
import fs from "fs";
import path from "path";

// Extend Request interface to include multer file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Ensure font directories exist
const fontsDir = path.join(process.cwd(), 'server/lib/fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

// Setup multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to generate profile image
  app.post('/api/generate/profile', upload.single('avatar'), async (req: MulterRequest, res) => {
    try {
      const { username } = req.body;
      const isPremium = req.body.isPremium === 'true';
      const isOwner = req.body.isOwner === 'true';
      const extraGlow = req.body.extraGlow === 'true';
      const scanEffect = req.body.scanEffect === 'true';
      const matrixRain = req.body.matrixRain === 'true';
      const circuitBg = req.body.circuitBg === 'true';
      
      if (!username || !req.file) {
        return res.status(400).send('Username and avatar are required');
      }
      
      const options = { extraGlow, scanEffect, matrixRain, circuitBg };
      const buffer = await profile(username, req.file.buffer, isPremium, isOwner, options);
      
      res.set('Content-Type', 'image/png');
      return res.send(buffer);
    } catch (error) {
      console.error('Error generating profile image:', error);
      return res.status(500).send('Failed to generate profile image');
    }
  });
  
  // API route to generate welcome image
  app.post('/api/generate/welcome', upload.single('avatar'), async (req: MulterRequest, res) => {
    try {
      const { username, serverName = 'CyberServer' } = req.body;
      const extraGlow = req.body.extraGlow === 'true';
      const scanEffect = req.body.scanEffect === 'true';
      const matrixRain = req.body.matrixRain === 'true';
      const circuitBg = req.body.circuitBg === 'true';
      
      if (!username || !req.file) {
        return res.status(400).send('Username and avatar are required');
      }
      
      const options = { extraGlow, scanEffect, matrixRain, circuitBg };
      const buffer = await Welcome(username, req.file.buffer, serverName, options);
      
      res.set('Content-Type', 'image/png');
      return res.send(buffer);
    } catch (error) {
      console.error('Error generating welcome image:', error);
      return res.status(500).send('Failed to generate welcome image');
    }
  });
  
  // API route to generate goodbye image
  app.post('/api/generate/goodbye', upload.single('avatar'), async (req: MulterRequest, res) => {
    try {
      const { username, serverName = 'CyberServer' } = req.body;
      const extraGlow = req.body.extraGlow === 'true';
      const scanEffect = req.body.scanEffect === 'true';
      const matrixRain = req.body.matrixRain === 'true';
      const circuitBg = req.body.circuitBg === 'true';
      
      if (!username || !req.file) {
        return res.status(400).send('Username and avatar are required');
      }
      
      const options = { extraGlow, scanEffect, matrixRain, circuitBg };
      const buffer = await Goodbye(username, req.file.buffer, serverName, options);
      
      res.set('Content-Type', 'image/png');
      return res.send(buffer);
    } catch (error) {
      console.error('Error generating goodbye image:', error);
      return res.status(500).send('Failed to generate goodbye image');
    }
  });

  // Create and return HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
