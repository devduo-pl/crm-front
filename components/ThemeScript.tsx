"use client";

export function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
          document.body.classList.toggle('dark', savedTheme === 'dark');
        } else {
          document.body.classList.toggle('dark', systemPrefersDark);
        }
      } catch (e) {
        console.error('Error setting theme:', e);
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
