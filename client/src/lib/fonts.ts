// This file loads and defines fonts used in the application
import { createGlobalStyle } from 'styled-components';

// Define global fonts using CDN (avoiding local binary font files)
export const GlobalFonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
`;

// Font family constants
export const FONT_ORBITRON = "'Orbitron', sans-serif";
export const FONT_RAJDHANI = "'Rajdhani', sans-serif";
