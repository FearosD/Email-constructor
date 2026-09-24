// src/core/tokens.js

export const tokens = {
    spacing: 16,
    fontFamily: 'Arial, sans-serif',
    colors: {
      text: '#1A1230',
      accent: '#FF0F43',
      background: '#ffffff',
      cardBg: '#f5f5f5',
    },
    typography: {
      h1: { size: 24, lineHeight: 1.3 },
      h2: { size: 20, lineHeight: 1.3 },
      body: { size: 14, lineHeight: 1.3 },
    },
  };
  
  /**
   * Генерирует базовую строку инлайн-стилей для email.
   * @param {number} size - размер шрифта в px
   * @param {string} color - цвет текста (по умолчанию из токенов)
   * @returns {string} Готовая строка стилей
   */
  export function getBaseStyle(size, color = tokens.colors.text) {
    return `text-align: left; font: ${size}px ${tokens.fontFamily}; color: ${color}; line-height: ${tokens.typography.body.lineHeight}; -webkit-text-size-adjust:none;`;
  }