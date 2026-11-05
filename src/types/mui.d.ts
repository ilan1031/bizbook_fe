// Custom theme keys used by src/app/theme.ts (and read across the app via theme.palette.*).
import "@mui/material/styles";

interface AppPaletteExtras {
  custom: { greenGradient: string };
  menu: {
    active: string;
    hover: string;
    text: { active: string; normal: string; disabled: string; default: string };
    collapse: { background: string; active: string };
  };
  hover: { background: string; text: string; borderRadius: string; Margin: string };
}

declare module "@mui/material/styles" {
  interface Palette extends AppPaletteExtras {}
  interface PaletteOptions extends Partial<AppPaletteExtras> {}
  interface PaletteColor {
    navbar?: string;
  }
  interface SimplePaletteColorOptions {
    navbar?: string;
  }
}
