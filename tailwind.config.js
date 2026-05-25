/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'vscode-bg': '#1e1e1e',
        'vscode-sidebar': '#252526',
        'vscode-header': '#2d2d2d',
        'vscode-border': '#3e3e42',
        'vscode-text': '#cccccc',
        'vscode-accent': '#007acc',
        'vscode-accent-hover': '#0098ff',
        'vscode-button': '#0e639c',
        'vscode-button-hover': '#1177bb',
        'vscode-input': '#3c3c3c',
        'vscode-highlight': '#264f78',
        'vscode-green': '#4ec9b0',
        'vscode-yellow': '#dcdcaa',
        'vscode-purple': '#c586c0',
        'vscode-orange': '#ce9178',
      },
    },
  },
  plugins: [],
}
