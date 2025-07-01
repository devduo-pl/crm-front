"use client";

export function ThemeScript() {
  const themeScript = `
    (function() {
      function applyTheme() {
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
      }

      // Wait for document.body to be available
      if (document.body) {
        // Body is already available
        applyTheme();
      } else {
        // Wait for DOM to load
        document.addEventListener('DOMContentLoaded', applyTheme);
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
