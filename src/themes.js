export const THEMES = {
  NeoLab: {
    '--bg-primary': '#0d1117',
    '--bg-secondary': '#121a24',
    '--bg-card': '#182232',
    '--border': '#2a3a53',
    '--text-primary': '#e6edf3',
    '--text-secondary': '#95a6ba',
    '--text-muted': '#6f8095',
    '--accent': '#2f81f7',
    '--accent-glow': 'rgba(47, 129, 247, 0.25)',
    '--gradient-start': '#2f81f7',
    '--gradient-end': '#56d4dd'
  },
  Paper: {
    '--bg-primary': '#f8f4ea',
    '--bg-secondary': '#f2ecdd',
    '--bg-card': '#fffdf6',
    '--border': '#dfd6c4',
    '--text-primary': '#2f2a23',
    '--text-secondary': '#62584a',
    '--text-muted': '#8a7e6d',
    '--accent': '#955f2d',
    '--accent-glow': 'rgba(149, 95, 45, 0.22)',
    '--gradient-start': '#955f2d',
    '--gradient-end': '#d49f63'
  },
  Noir: {
    '--bg-primary': '#121212',
    '--bg-secondary': '#171717',
    '--bg-card': '#1f1f1f',
    '--border': '#2e2e2e',
    '--text-primary': '#f4f4f4',
    '--text-secondary': '#b4b4b4',
    '--text-muted': '#888888',
    '--accent': '#f25f5c',
    '--accent-glow': 'rgba(242, 95, 92, 0.28)',
    '--gradient-start': '#f25f5c',
    '--gradient-end': '#f7b267'
  },
  Brutal: {
    '--bg-primary': '#fff74d',
    '--bg-secondary': '#fef08a',
    '--bg-card': '#ffffff',
    '--border': '#141414',
    '--text-primary': '#0f0f0f',
    '--text-secondary': '#222222',
    '--text-muted': '#444444',
    '--accent': '#ff2e00',
    '--accent-glow': 'rgba(255, 46, 0, 0.25)',
    '--gradient-start': '#ff2e00',
    '--gradient-end': '#ff8a00'
  },
  Soft: {
    '--bg-primary': '#f2f7ff',
    '--bg-secondary': '#e8f0fd',
    '--bg-card': '#ffffff',
    '--border': '#cfdcf0',
    '--text-primary': '#22324d',
    '--text-secondary': '#4e5f7f',
    '--text-muted': '#6e81a5',
    '--accent': '#4d7cff',
    '--accent-glow': 'rgba(77, 124, 255, 0.26)',
    '--gradient-start': '#4d7cff',
    '--gradient-end': '#68c0ff'
  },
  RetroTerminal: {
    '--bg-primary': '#0a120d',
    '--bg-secondary': '#0f1a12',
    '--bg-card': '#101d14',
    '--border': '#2a4f2e',
    '--text-primary': '#8ef79f',
    '--text-secondary': '#5fcf74',
    '--text-muted': '#3e9955',
    '--accent': '#7dff8a',
    '--accent-glow': 'rgba(125, 255, 138, 0.22)',
    '--gradient-start': '#7dff8a',
    '--gradient-end': '#56d364'
  },
  Candy: {
    '--bg-primary': '#fff1f6',
    '--bg-secondary': '#ffe2ee',
    '--bg-card': '#ffffff',
    '--border': '#ffc8df',
    '--text-primary': '#5b2942',
    '--text-secondary': '#7f4762',
    '--text-muted': '#a06a84',
    '--accent': '#e83e8c',
    '--accent-glow': 'rgba(232, 62, 140, 0.22)',
    '--gradient-start': '#e83e8c',
    '--gradient-end': '#ff8fab'
  },
  Mono: {
    '--bg-primary': '#f4f4f4',
    '--bg-secondary': '#ebebeb',
    '--bg-card': '#ffffff',
    '--border': '#c8c8c8',
    '--text-primary': '#1d1d1d',
    '--text-secondary': '#414141',
    '--text-muted': '#666666',
    '--accent': '#242424',
    '--accent-glow': 'rgba(36, 36, 36, 0.20)',
    '--gradient-start': '#242424',
    '--gradient-end': '#606060'
  }
};

export const THEME_NAMES = Object.keys(THEMES);

export function applyTheme(themeName) {
  const root = document.documentElement;
  const selected = THEMES[themeName] || THEMES.NeoLab;
  for (const [key, value] of Object.entries(selected)) {
    root.style.setProperty(key, value);
  }
}
