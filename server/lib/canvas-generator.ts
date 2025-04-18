import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'path';
import fs from 'fs';

// Register fonts (commented out for now to avoid errors)
const fontsDir = path.join(process.cwd(), 'server/lib/fonts');
console.log('Using system fonts for now');

// Define font constants
const ORBITRON_FONT = 'bold 60px Arial';
const RAJDHANI_FONT = 'bold 40px Arial';
const TERMINAL_FONT = 'bold 22px monospace';
const SMALL_FONT = 'bold 18px monospace'; // Increased from 14px to 18px for better visibility

// Color constants - Enhanced cyberpunk theme
const COLORS = {
  DARK_BG: '#0F0F1A',
  DARKER_BG: '#090916',
  CYBER_BLUE: '#00FFFF',
  CYBER_GREEN: '#39FF14',
  CYBER_PINK: '#FF00E6',
  CYBER_PURPLE: '#B026FF',
  CYBER_GOLD: '#FFC107',
  CYBER_RED: '#FF3D3D',
  CYBER_ORANGE: '#FF7D3D',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY: '#A0A0A0',
  DARK_BLUE: '#0A1933',
  DARK_GREEN: '#0A3320',
  DARK_PURPLE: '#1A0A33',
};

// Helper functions
const createGlow = (ctx: any, x: number, y: number, width: number, height: number, color: string, blurLevel = 20) => {
  ctx.shadowColor = color;
  ctx.shadowBlur = blurLevel;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
};

const drawHexagon = (ctx: any, x: number, y: number, size: number, fill = true, stroke = false) => {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angleDeg = 60 * i - 30;
    const angleRad = (Math.PI / 180) * angleDeg;
    const xPos = x + size * Math.cos(angleRad);
    const yPos = y + size * Math.sin(angleRad);
    if (i === 0) {
      ctx.moveTo(xPos, yPos);
    } else {
      ctx.lineTo(xPos, yPos);
    }
  }
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
};

const drawHexagonalAvatar = (ctx: any, x: number, y: number, size: number, avatar: any, borderColor: string, extraGlow = false) => {
  // Draw border with glow
  ctx.save();
  if (extraGlow) {
    createGlow(ctx, 0, 0, 0, 0, borderColor, 30);
  } else {
    createGlow(ctx, 0, 0, 0, 0, borderColor, 15);
  }
  ctx.fillStyle = borderColor;
  drawHexagon(ctx, x, y, size + 10);
  ctx.restore();
  
  // Create a clipping path for the avatar
  ctx.save();
  drawHexagon(ctx, x, y, size, false, false);
  ctx.clip();
  
  // Draw the avatar image
  ctx.drawImage(avatar, x - size, y - size, size * 2, size * 2);
  
  // Add an overlay gradient
  const gradient = ctx.createLinearGradient(x, y - size, x, y + size);
  gradient.addColorStop(0, `${borderColor}20`);
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.globalCompositeOperation = 'overlay';
  drawHexagon(ctx, x, y, size);
  
  ctx.restore();
};

const drawCircuitPattern = (ctx: any, x: number, y: number, width: number, height: number, color: string, opacity = 0.15) => {
  const originalAlpha = ctx.globalAlpha;
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = color;
  
  // Horizontal lines
  const hSpacing = 40;
  for (let i = 0; i < height; i += hSpacing) {
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y + i);
    ctx.lineTo(x + width, y + i);
    ctx.stroke();
  }
  
  // Vertical lines
  const vSpacing = 40;
  for (let i = 0; i < width; i += vSpacing) {
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + i, y);
    ctx.lineTo(x + i, y + height);
    ctx.stroke();
  }
  
  // Dots
  for (let i = 0; i < width; i += vSpacing) {
    for (let j = 0; j < height; j += hSpacing) {
      if (Math.random() > 0.7) { // Random dots
        ctx.beginPath();
        ctx.arc(x + i, y + j, 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }
  }
  
  // Some random circuit lines
  for (let i = 0; i < 10; i++) {
    const startX = x + Math.random() * width;
    const startY = y + Math.random() * height;
    let currentX = startX;
    let currentY = startY;
    
    ctx.beginPath();
    ctx.moveTo(currentX, currentY);
    
    // Create a path with multiple turns
    for (let j = 0; j < 3; j++) {
      // Decide if we're going horizontal or vertical
      if (Math.random() > 0.5) {
        currentX = x + Math.round((currentX - x + (Math.random() - 0.5) * 200) / vSpacing) * vSpacing;
      } else {
        currentY = y + Math.round((currentY - y + (Math.random() - 0.5) * 200) / hSpacing) * hSpacing;
      }
      ctx.lineTo(currentX, currentY);
    }
    
    ctx.stroke();
  }
  
  ctx.globalAlpha = originalAlpha;
};

const drawScanLine = (ctx: any, x: number, y: number, width: number, height: number, color: string, opacity = 0.5) => {
  const originalAlpha = ctx.globalAlpha;
  ctx.globalAlpha = opacity;
  
  // Create a gradient for the scan line
  const scanGradient = ctx.createLinearGradient(x, y, x + width, y);
  scanGradient.addColorStop(0, 'transparent');
  scanGradient.addColorStop(0.3, color + '80');
  scanGradient.addColorStop(0.5, color);
  scanGradient.addColorStop(0.7, color + '80');
  scanGradient.addColorStop(1, 'transparent');
  
  ctx.fillStyle = scanGradient;
  ctx.fillRect(x, y, width, 5);
  
  ctx.globalAlpha = originalAlpha;
};

const drawMatrixRain = (ctx: any, x: number, y: number, width: number, height: number, color: string, opacity = 0.15) => {
  const originalAlpha = ctx.globalAlpha;
  ctx.globalAlpha = opacity;
  
  ctx.fillStyle = color;
  const characters = '01';
  ctx.font = '10px monospace';
  
  // Draw a limited number of matrix columns
  for (let i = 0; i < width; i += 15) {
    const columnHeight = Math.random() * height;
    for (let j = 0; j < columnHeight; j += 12) {
      if (Math.random() > 0.5) { // Add some randomness
        const char = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(char, x + i, y + j);
      }
    }
  }
  
  ctx.globalAlpha = originalAlpha;
};

const drawCyberGrid = (ctx: any, x: number, y: number, width: number, height: number, color: string, opacity = 0.2) => {
  const originalAlpha = ctx.globalAlpha;
  ctx.globalAlpha = opacity;
  
  // Grid lines
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;
  
  const gridSize = 20;
  for (let i = 0; i <= width; i += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x + i, y);
    ctx.lineTo(x + i, y + height);
    ctx.stroke();
  }
  
  for (let i = 0; i <= height; i += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, y + i);
    ctx.lineTo(x + width, y + i);
    ctx.stroke();
  }
  
  ctx.globalAlpha = originalAlpha;
};

// Main profile function
export const profile = async (username: string, avatarBuffer: Buffer, isPremium = false, isOwner = false, options = {}) => {
  const extraGlow = (options as any).extraGlow || false;
  const scanEffect = (options as any).scanEffect || false;
  const matrixRain = (options as any).matrixRain || false;
  const circuitBg = (options as any).circuitBg || false;
  
  const canvas = createCanvas(1280, 480);
  const ctx = canvas.getContext('2d');
  
  // Base background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, COLORS.DARKER_BG);
  gradient.addColorStop(1, COLORS.DARK_BG);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add cyber grid
  drawCyberGrid(ctx, 0, 0, canvas.width, canvas.height, isPremium || isOwner ? COLORS.CYBER_GOLD : COLORS.CYBER_BLUE);
  
  // Add circuit pattern if enabled
  if (circuitBg) {
    drawCircuitPattern(
      ctx, 
      0, 
      0, 
      canvas.width, 
      canvas.height, 
      isPremium || isOwner ? COLORS.CYBER_GOLD : COLORS.CYBER_BLUE,
      0.1
    );
  }
  
  // Add matrix rain if enabled
  if (matrixRain) {
    drawMatrixRain(
      ctx, 
      0, 
      0, 
      canvas.width, 
      canvas.height,
      isPremium || isOwner ? COLORS.CYBER_GOLD : COLORS.CYBER_GREEN
    );
  }
  
  // Add scan line effect if enabled
  if (scanEffect) {
    // Positioned at 1/3 of the height
    drawScanLine(
      ctx, 
      0, 
      canvas.height / 3, 
      canvas.width, 
      5, 
      isPremium || isOwner ? COLORS.CYBER_GOLD : COLORS.CYBER_BLUE
    );
  }
  
  // Color settings based on status
  const borderColor = isOwner ? COLORS.CYBER_GOLD : isPremium ? COLORS.CYBER_GOLD : COLORS.CYBER_BLUE;
  const buttonColor = isOwner ? COLORS.CYBER_GOLD : isPremium ? COLORS.CYBER_GOLD : COLORS.CYBER_BLUE;
  const textColor = isOwner || isPremium ? COLORS.BLACK : COLORS.WHITE;

  // Draw crown for owner
  if (isOwner) {
    const crown = await loadImage('https://raw.githubusercontent.com/SatzzDev/IDK/main/routes/assets/images/crown.png');
    createGlow(ctx, 0, 0, 0, 0, COLORS.CYBER_GOLD, 25);
    ctx.drawImage(crown, 190, 10, 100, 100);
    ctx.shadowBlur = 0;
  }
  
  // Load the avatar image
  const avatar = await loadImage(avatarBuffer);
  
  // Draw hexagonal avatar instead of circular
  drawHexagonalAvatar(ctx, 240, 240, 120, avatar, borderColor, extraGlow);
  
  // Username with glowing effect
  ctx.font = ORBITRON_FONT;
  createGlow(ctx, 0, 0, 0, 0, borderColor, extraGlow ? 30 : 15);
  ctx.fillStyle = COLORS.WHITE;
  ctx.textAlign = 'center';
  ctx.fillText(username.toUpperCase(), 700, 260);
  
  // Underline the username
  const textWidth = ctx.measureText(username.toUpperCase()).width;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(700 - textWidth / 2, 270);
  ctx.lineTo(700 + textWidth / 2, 270);
  ctx.stroke();
  
  // Verified badge for premium or owner
  if (isPremium || isOwner) {
    const verified = await loadImage('https://raw.githubusercontent.com/SatzzDev/IDK/main/routes/assets/images/verify.png');
    createGlow(ctx, 0, 0, 0, 0, COLORS.CYBER_GOLD, 15);
    const logoX = 700 + textWidth / 2 + 10;
    const logoY = 260 - 40;
    ctx.drawImage(verified, logoX, logoY, 50, 50);
    ctx.shadowBlur = 0;
  }
  
  // Status button
  const buttonWidth = 220;
  const buttonHeight = 60;
  const buttonX = 130;
  const buttonY = 400;
  
  // Button gradient background
  const buttonGradient = ctx.createLinearGradient(buttonX, buttonY, buttonX + buttonWidth, buttonY);
  buttonGradient.addColorStop(0, `${buttonColor}40`);
  buttonGradient.addColorStop(1, `${buttonColor}10`);
  
  ctx.fillStyle = buttonGradient;
  createGlow(ctx, buttonX, buttonY, buttonWidth, buttonHeight, buttonColor, 15);
  ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
  ctx.shadowBlur = 0;
  
  // Button border
  ctx.strokeStyle = buttonColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
  
  // Button text
  ctx.font = 'bold 30px Arial';
  // Use white text with colored glow for better visibility
  ctx.fillStyle = COLORS.WHITE;
  createGlow(ctx, 0, 0, 0, 0, isPremium || isOwner ? COLORS.CYBER_GOLD : COLORS.CYBER_BLUE, 15);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(isOwner ? 'OWNER' : isPremium ? 'PREMIUM' : 'FREE', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
  ctx.shadowBlur = 0;
  
  // Add cyber grid to button
  drawCyberGrid(ctx, buttonX, buttonY, buttonWidth, buttonHeight, buttonColor, 0.3);
  
  // Creator signature
  ctx.globalAlpha = 0.7; // Slightly more visible
  ctx.font = SMALL_FONT;
  createGlow(ctx, 0, 0, 0, 0, COLORS.CYBER_BLUE, 5); // Subtle glow for signature
  ctx.fillStyle = COLORS.WHITE; // White text for better visibility
  ctx.fillText('Created By SatzzDev', 1170, 465);
  ctx.shadowBlur = 0; // Reset shadow
  ctx.globalAlpha = 1;
  
  return canvas.toBuffer('image/png');
};

// Welcome function - Enhanced cyber edition
export const Welcome = async (username: string, avatarBuffer: Buffer, serverName: string = 'CyberServer', options = {}) => {
  try {
    const extraGlow = (options as any).extraGlow || false;
    const scanEffect = (options as any).scanEffect || false;
    const matrixRain = (options as any).matrixRain || false;
    const circuitBg = (options as any).circuitBg || false;
    
    const canvas = createCanvas(1920, 768);
    const ctx = canvas.getContext('2d');
    
    // Enhanced background with gradients
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width / 1.5
    );
    gradient.addColorStop(0, COLORS.DARK_GREEN);
    gradient.addColorStop(0.6, COLORS.DARKER_BG);
    gradient.addColorStop(1, COLORS.BLACK);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add ambient glow
    const glowGradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.height / 2
    );
    glowGradient.addColorStop(0, `${COLORS.CYBER_GREEN}20`);
    glowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add cyber grid with more advanced pattern
    drawCyberGrid(ctx, 0, 0, canvas.width, canvas.height, COLORS.CYBER_GREEN, 0.2);
    
    // Add more decorative elements - circular patterns
    ctx.save();
    ctx.strokeStyle = `${COLORS.CYBER_GREEN}30`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const radius = 100 + i * 150;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Add dash pattern to middle circle
      if (i === 1) {
        ctx.setLineDash([5, 15]);
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius + 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    ctx.restore();
    
    // Add circuit pattern if enabled
    if (circuitBg) {
      drawCircuitPattern(ctx, 0, 0, canvas.width, canvas.height, COLORS.CYBER_GREEN, 0.15);
    }
    
    // Add matrix rain if enabled
    if (matrixRain) {
      drawMatrixRain(ctx, 0, 0, canvas.width, canvas.height, COLORS.CYBER_GREEN, 0.2);
    }
    
    // Add scan line effect if enabled (multiple lines for more impact)
    if (scanEffect) {
      drawScanLine(ctx, 0, canvas.height / 4, canvas.width, 5, COLORS.CYBER_GREEN, 0.6);
      drawScanLine(ctx, 0, canvas.height / 2, canvas.width, 5, COLORS.CYBER_GREEN, 0.4);
      drawScanLine(ctx, 0, canvas.height * 3/4, canvas.width, 5, COLORS.CYBER_GREEN, 0.6);
    }
    
    // Load avatar image
    const avatar = await loadImage(avatarBuffer);
    
    // Create hexagonal avatar with enhanced glow
    drawHexagonalAvatar(
      ctx, 
      canvas.width / 2, 
      canvas.height / 3, 
      100, 
      avatar, 
      COLORS.CYBER_GREEN, 
      extraGlow
    );
    
    // Add data visualization lines around avatar (decorative)
    ctx.save();
    ctx.strokeStyle = COLORS.CYBER_GREEN;
    ctx.setLineDash([5, 10]);
    ctx.lineWidth = 1;
    
    // Draw multiple lines extending from avatar
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 3;
    for (let angle = 0; angle < 360; angle += 45) {
      const radians = (angle * Math.PI) / 180;
      const startX = centerX + Math.cos(radians) * 130;
      const startY = centerY + Math.sin(radians) * 130;
      const endX = centerX + Math.cos(radians) * 200;
      const endY = centerY + Math.sin(radians) * 200;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Add dots at end of lines
      ctx.beginPath();
      ctx.arc(endX, endY, 3, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.CYBER_GREEN;
      ctx.fill();
    }
    ctx.restore();
    
    // Username text with enhanced glow effect
    ctx.font = ORBITRON_FONT;
    createGlow(ctx, 0, 0, 0, 0, COLORS.CYBER_GREEN, extraGlow ? 40 : 25);
    ctx.fillStyle = COLORS.WHITE;
    ctx.textAlign = 'center';
    ctx.fillText(username.toUpperCase(), centerX, centerY + 220);
    ctx.shadowBlur = 0;
    
    // Futuristic underline
    const textWidth = ctx.measureText(username.toUpperCase()).width;
    const lineGradient = ctx.createLinearGradient(
      centerX - textWidth/2 - 20, 
      centerY + 235, 
      centerX + textWidth/2 + 20, 
      centerY + 235
    );
    lineGradient.addColorStop(0, 'transparent');
    lineGradient.addColorStop(0.2, COLORS.CYBER_GREEN);
    lineGradient.addColorStop(0.8, COLORS.CYBER_GREEN);
    lineGradient.addColorStop(1, 'transparent');
    
    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX - textWidth/2 - 20, centerY + 235);
    ctx.lineTo(centerX + textWidth/2 + 20, centerY + 235);
    ctx.stroke();
    
    // Add smaller decorative line
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - textWidth/4, centerY + 245);
    ctx.lineTo(centerX + textWidth/4, centerY + 245);
    ctx.stroke();
    
    // Welcome message with gradient text
    const welcomeGradient = ctx.createLinearGradient(
      centerX - 200, 
      centerY + 300, 
      centerX + 200, 
      centerY + 300
    );
    welcomeGradient.addColorStop(0, COLORS.CYBER_GREEN);
    welcomeGradient.addColorStop(1, COLORS.CYBER_BLUE);
    
    ctx.font = RAJDHANI_FONT;
    createGlow(ctx, 0, 0, 0, 0, COLORS.CYBER_GREEN, 15);
    ctx.fillStyle = welcomeGradient;
    ctx.fillText(`WELCOME TO ${serverName.toUpperCase()}`, centerX, centerY + 300);
    ctx.shadowBlur = 0;
    
    // Enhanced terminal display with futuristic design
    ctx.save();
    // Terminal background
    const terminalWidth = 500;
    const terminalHeight = 80;
    const terminalX = centerX - terminalWidth/2;
    const terminalY = centerY + 350;
    
    // Terminal glow effect
    createGlow(ctx, 0, 0, 0, 0, COLORS.CYBER_GREEN, 20);
    const terminalGradient = ctx.createLinearGradient(
      terminalX, 
      terminalY, 
      terminalX + terminalWidth, 
      terminalY
    );
    terminalGradient.addColorStop(0, `${COLORS.CYBER_GREEN}10`);
    terminalGradient.addColorStop(0.5, `${COLORS.CYBER_GREEN}30`);
    terminalGradient.addColorStop(1, `${COLORS.CYBER_GREEN}10`);
    
    ctx.fillStyle = terminalGradient;
    ctx.fillRect(terminalX, terminalY, terminalWidth, terminalHeight);
    
    // Terminal border
    ctx.strokeStyle = COLORS.CYBER_GREEN;
    ctx.lineWidth = 2;
    ctx.strokeRect(terminalX, terminalY, terminalWidth, terminalHeight);
    
    // Add corner accents
    const cornerSize = 10;
    // Top left
    ctx.beginPath();
    ctx.moveTo(terminalX, terminalY + cornerSize);
    ctx.lineTo(terminalX, terminalY);
    ctx.lineTo(terminalX + cornerSize, terminalY);
    ctx.stroke();
    
    // Top right
    ctx.beginPath();
    ctx.moveTo(terminalX + terminalWidth - cornerSize, terminalY);
    ctx.lineTo(terminalX + terminalWidth, terminalY);
    ctx.lineTo(terminalX + terminalWidth, terminalY + cornerSize);
    ctx.stroke();
    
    // Bottom left
    ctx.beginPath();
    ctx.moveTo(terminalX, terminalY + terminalHeight - cornerSize);
    ctx.lineTo(terminalX, terminalY + terminalHeight);
    ctx.lineTo(terminalX + cornerSize, terminalY + terminalHeight);
    ctx.stroke();
    
    // Bottom right
    ctx.beginPath();
    ctx.moveTo(terminalX + terminalWidth - cornerSize, terminalY + terminalHeight);
    ctx.lineTo(terminalX + terminalWidth, terminalY + terminalHeight);
    ctx.lineTo(terminalX + terminalWidth, terminalY + terminalHeight - cornerSize);
    ctx.stroke();
    
    // Terminal text
    ctx.font = TERMINAL_FONT;
    // Add stronger glow effect to terminal text
    createGlow(ctx, 0, 0, 0, 0, COLORS.CYBER_GREEN, 20);
    ctx.fillStyle = COLORS.WHITE; // Change to white for better visibility
    // Center text properly to stay within the terminal box
    ctx.textAlign = 'center';
    ctx.fillText('// ACCESS GRANTED //', centerX, terminalY + 30);
    ctx.fillText('// CONNECTION ESTABLISHED //', centerX, terminalY + 50);
    ctx.shadowBlur = 0;
    
    
    ctx.restore();
    
    // Add more decorative elements
    for (let i = 0; i < 8; i++) {
      const size = 30 + Math.random() * 80;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      
      ctx.save();
      ctx.strokeStyle = `${COLORS.CYBER_GREEN}20`;
      ctx.lineWidth = 1;
      if (Math.random() > 0.5) {
        drawHexagon(ctx, x, y, size, false, true);
      } else {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
    
    return canvas.toBuffer('image/png');
  } catch (error) {
    console.error('Failed to create welcome image:', error);
    throw error;
  }
};

// Goodbye function - Enhanced cyber edition
export const Goodbye = async (username: string, avatarBuffer: Buffer, serverName: string = 'CyberServer', options = {}) => {
  try {
    const extraGlow = (options as any).extraGlow || false;
    const scanEffect = (options as any).scanEffect || false;
    const matrixRain = (options as any).matrixRain || false;
    const circuitBg = (options as any).circuitBg || false;
    
    const canvas = createCanvas(1920, 768);
    const ctx = canvas.getContext('2d');
    
    // Advanced dark background with purple tint for goodbye theme
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width / 1.5
    );
    gradient.addColorStop(0, COLORS.DARK_PURPLE);
    gradient.addColorStop(0.6, COLORS.DARKER_BG);
    gradient.addColorStop(1, COLORS.BLACK);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add ambient pink/purple glow
    const glowGradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.height / 2
    );
    glowGradient.addColorStop(0, `${COLORS.CYBER_PINK}15`);
    glowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add glitched cyber grid effect for "disconnection" vibes
    drawCyberGrid(ctx, 0, 0, canvas.width, canvas.height, COLORS.CYBER_PINK, 0.15);
    
    // Add glitched lines to show disconnection
    ctx.save();
    ctx.strokeStyle = `${COLORS.CYBER_PINK}40`;
    ctx.lineWidth = 2;
    for (let i = 0; i < 15; i++) {
      const y = Math.random() * canvas.height;
      const width = 50 + Math.random() * 200;
      const x = Math.random() * (canvas.width - width);
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y);
      ctx.stroke();
    }
    ctx.restore();
    
    // Add circuit pattern if enabled
    if (circuitBg) {
      drawCircuitPattern(ctx, 0, 0, canvas.width, canvas.height, COLORS.CYBER_PINK, 0.15);
    }
    
    // Add matrix rain if enabled - more chaotic for shutdown effect
    if (matrixRain) {
      drawMatrixRain(ctx, 0, 0, canvas.width, canvas.height, COLORS.CYBER_PINK, 0.25);
    }
    
    // Add glitched scan lines if enabled (multiple with varying opacity for "error" effect)
    if (scanEffect) {
      // Add more scan lines to create a glitched effect
      for (let i = 0; i < 6; i++) {
        const y = Math.random() * canvas.height;
        const opacity = 0.3 + Math.random() * 0.4;
        drawScanLine(ctx, 0, y, canvas.width, 5, COLORS.CYBER_PINK, opacity);
      }
    }
    
    // Load avatar image
    const avatar = await loadImage(avatarBuffer);
    
    // Create hexagonal avatar with "disconnect" glitch effect
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 3;
    
    // Draw avatar with hexagonal shape and glitch effect
    drawHexagonalAvatar(ctx, centerX, centerY, 100, avatar, COLORS.CYBER_PINK, extraGlow);
    
    // Add "corrupted" glitch effect around avatar
    ctx.save();
    ctx.strokeStyle = COLORS.CYBER_PINK;
    ctx.lineWidth = 1;
    
    // Glitched disconnected data lines
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * 360;
      const radians = (angle * Math.PI) / 180;
      const length = 30 + Math.random() * 100;
      const startDistance = 110 + Math.random() * 20;
      
      const startX = centerX + Math.cos(radians) * startDistance;
      const startY = centerY + Math.sin(radians) * startDistance;
      const endX = centerX + Math.cos(radians) * (startDistance + length);
      const endY = centerY + Math.sin(radians) * (startDistance + length);
      
      ctx.globalAlpha = 0.3 + Math.random() * 0.5;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
    
    // Username text with glitched effect
    ctx.font = ORBITRON_FONT;
    createGlow(ctx, 0, 0, 0, 0, COLORS.CYBER_PINK, extraGlow ? 35 : 20);
    
    // Draw username with slight offset for glitch effect
    ctx.fillStyle = `${COLORS.CYBER_PURPLE}90`;
    ctx.textAlign = 'center';
    ctx.fillText(username.toUpperCase(), centerX + 4, centerY + 220 + 4);
    
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillText(username.toUpperCase(), centerX, centerY + 220);
    ctx.shadowBlur = 0;
    
    // Glitched underline effect
    const textWidth = ctx.measureText(username.toUpperCase()).width;
    
    // Main underline with gradient
    const lineGradient = ctx.createLinearGradient(
      centerX - textWidth/2 - 30, 
      centerY + 235, 
      centerX + textWidth/2 + 30, 
      centerY + 235
    );
    lineGradient.addColorStop(0, 'transparent');
    lineGradient.addColorStop(0.3, COLORS.CYBER_PINK);
    lineGradient.addColorStop(0.7, COLORS.CYBER_PURPLE);
    lineGradient.addColorStop(1, 'transparent');
    
    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX - textWidth/2 - 30, centerY + 235);
    ctx.lineTo(centerX + textWidth/2 + 30, centerY + 235);
    ctx.stroke();
    
    // Add glitched smaller decorative lines
    for (let i = 0; i < 3; i++) {
      const width = textWidth * (0.2 + Math.random() * 0.3);
      const x = centerX - textWidth/2 + Math.random() * (textWidth - width);
      const y = centerY + 245 + i * 4;
      
      ctx.lineWidth = 1;
      ctx.strokeStyle = Math.random() > 0.5 ? COLORS.CYBER_PINK : COLORS.CYBER_PURPLE;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y);
      ctx.stroke();
    }
    
    // Goodbye message with gradient pink/purple
    const byeGradient = ctx.createLinearGradient(
      centerX - 200, 
      centerY + 300, 
      centerX + 200, 
      centerY + 300
    );
    byeGradient.addColorStop(0, COLORS.CYBER_PINK);
    byeGradient.addColorStop(1, COLORS.CYBER_PURPLE);
    
    ctx.font = RAJDHANI_FONT;
    createGlow(ctx, 0, 0, 0, 0, COLORS.CYBER_PINK, 15);
    ctx.fillStyle = byeGradient;
    ctx.fillText(`GOODBYE FROM ${serverName.toUpperCase()}`, centerX, centerY + 300);
    ctx.shadowBlur = 0;
    
    // Enhanced terminal disconnect display
    ctx.save();
    // Terminal background with glitch effect
    const terminalWidth = 520;
    const terminalHeight = 100;
    const terminalX = centerX - terminalWidth/2;
    const terminalY = centerY + 350;
    
    // Add glitched terminal background
    createGlow(ctx, 0, 0, 0, 0, COLORS.CYBER_PINK, 15);
    const terminalGradient = ctx.createLinearGradient(
      terminalX, 
      terminalY, 
      terminalX + terminalWidth, 
      terminalY + terminalHeight
    );
    terminalGradient.addColorStop(0, `${COLORS.CYBER_PINK}10`);
    terminalGradient.addColorStop(0.5, `${COLORS.CYBER_PURPLE}20`);
    terminalGradient.addColorStop(1, `${COLORS.CYBER_PINK}10`);
    
    ctx.fillStyle = terminalGradient;
    ctx.fillRect(terminalX, terminalY, terminalWidth, terminalHeight);
    
    // Glitched terminal border
    ctx.strokeStyle = COLORS.CYBER_PINK;
    ctx.lineWidth = 2;
    ctx.setLineDash([15, 5, 2, 5]);
    ctx.strokeRect(terminalX, terminalY, terminalWidth, terminalHeight);
    ctx.setLineDash([]);
    
    // Add glitched corner accents
    const cornerSize = 15;
    
    // Top left corner with glitch
    ctx.beginPath();
    ctx.moveTo(terminalX, terminalY + cornerSize);
    ctx.lineTo(terminalX, terminalY);
    ctx.lineTo(terminalX + cornerSize + 5, terminalY); // Intentional "glitch" +5
    ctx.stroke();
    
    // Top right corner with glitch
    ctx.beginPath();
    ctx.moveTo(terminalX + terminalWidth - cornerSize, terminalY);
    ctx.lineTo(terminalX + terminalWidth, terminalY);
    ctx.lineTo(terminalX + terminalWidth, terminalY + cornerSize - 3); // Intentional "glitch" -3
    ctx.stroke();
    
    // Bottom corners
    ctx.beginPath();
    ctx.moveTo(terminalX, terminalY + terminalHeight - cornerSize);
    ctx.lineTo(terminalX, terminalY + terminalHeight);
    ctx.lineTo(terminalX + cornerSize, terminalY + terminalHeight);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(terminalX + terminalWidth - cornerSize, terminalY + terminalHeight);
    ctx.lineTo(terminalX + terminalWidth, terminalY + terminalHeight);
    ctx.lineTo(terminalX + terminalWidth, terminalY + terminalHeight - cornerSize);
    ctx.stroke();
    
    // Terminal disconnection text with glitch effect
    ctx.font = TERMINAL_FONT;
    // Add stronger glow effect for error text
    createGlow(ctx, 0, 0, 0, 0, COLORS.CYBER_RED, 25);
    ctx.fillStyle = COLORS.WHITE; // Change to white for better visibility
    // Center text properly and split into two lines to stay within the terminal box
    ctx.textAlign = 'center';
    ctx.fillText('// CONNECTION TERMINATED //', centerX, terminalY + 30);
    ctx.fillText('// SYSTEM OFFLINE //', centerX, terminalY + 50);
    ctx.shadowBlur = 0;
    
  
    
    // Add more decorative "disconnected" elements
    for (let i = 0; i < 12; i++) {
      const size = 20 + Math.random() * 100;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      
      ctx.save();
      // Randomize opacity for "disconnection" effect
      ctx.globalAlpha = 0.1 + Math.random() * 0.2;
      
      // Add different geometric shapes
      if (Math.random() > 0.7) {
        // Hexagons
        ctx.strokeStyle = COLORS.CYBER_PINK;
        ctx.lineWidth = 1;
        drawHexagon(ctx, x, y, size, false, true);
      } else if (Math.random() > 0.5) {
        // Circles
        ctx.strokeStyle = COLORS.CYBER_PURPLE;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Error squares
        ctx.strokeStyle = COLORS.CYBER_RED;
        ctx.lineWidth = 1;
        ctx.strokeRect(x - size/2, y - size/2, size, size);
        
        // "X" inside some squares
        if (Math.random() > 0.5) {
          ctx.beginPath();
          ctx.moveTo(x - size/3, y - size/3);
          ctx.lineTo(x + size/3, y + size/3);
          ctx.moveTo(x + size/3, y - size/3);
          ctx.lineTo(x - size/3, y + size/3);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
    
    return canvas.toBuffer('image/png');
  } catch (error) {
    console.error('Failed to create goodbye image:', error);
    throw error;
  }
};

// Export functions
export default { profile, Welcome, Goodbye };
