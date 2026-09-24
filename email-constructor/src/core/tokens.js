/**
 * Централизованное хранилище дизайн-токенов.
 * Используется рендерером и шаблонами для генерации inline-стилей.
 */
export const tokens = {
	// Базовый отступ (в пикселях)
	spacing: 16,
	letterSpacing: 0,

	// Основной шрифт
	fontFamily: 'Arial, sans-serif',

	// Цветовая палитра
	colors: {
		text: '#1A1230',
		accent: '#FF0F43', // красный (для важных элементов)
		background: '#ffffff',
		cardBg: '#f5f5f5',
	},

	// Типографика
	typography: {
		h1: { size: 24, lineHeight: 1.3 },
		h2: { size: 20, lineHeight: 1.3 },
		body: { size: 14, lineHeight: 1.3 },
	},
};
