import { templateRegistry } from '../templates/index.js';

/**
 * Валидирует JSON-модель письма перед экспортом.
 * @param {Object} document - Объект модели письма { meta, blocks }
 * @returns {Array} Массив объектов ошибок/предупреждений: { level, blockId, message }
 */
export function validate(document) {
	const errors = [];

	// Базовая проверка структуры документа
	if (!document || !Array.isArray(document.blocks)) {
		errors.push({
			level: 'error',
			blockId: 'root',
			message: 'Некорректная структура документа: отсутствует массив blocks',
		});
		return errors;
	}

	/**
	 * Рекурсивная функция проверки отдельного блока
	 * @param {Object} block - Текущий блок
	 * @param {string} parentType - Тип родительского блока (для проверки allowedParents)
	 */
	function checkBlock(block, parentType = 'root') {
		const template = templateRegistry[block.type];

		// 1. Проверка существования шаблона в реестре
		if (!template) {
			errors.push({
				level: 'error',
				blockId: block.id || 'unknown',
				message: `Неизвестный тип блока: '${block.type}'`,
			});
			return; // Дальнейшая проверка бессмысленна без шаблона
		}

		// 2. Проверка допустимой вложенности (allowedParents)
		if (!template.allowedParents.includes(parentType)) {
			errors.push({
				level: 'error',
				blockId: block.id,
				message: `Блок '${
					block.type
				}' не может находиться внутри '${parentType}'. Допустимые родители: ${template.allowedParents.join(
					', '
				)}`,
			});
		}

		const props = block.props || {};

		// 3. Проверка опций шаблона
		for (const [key, option] of Object.entries(template.options || {})) {
			const value = props[key];

			// 3.1. Проверка обязательных полей (required: true)
			if (option.required) {
				const isEmpty =
					!value || (typeof value === 'string' && value.trim() === '');
				if (isEmpty) {
					errors.push({
						level: 'error',
						blockId: block.id,
						message: `Обязательное поле '${key}' не заполнено в блоке '${block.type}'`,
					});
				}
			}

			// 3.2. Проверка ссылок (тип url)
			if (option.type === 'url' && value && typeof value === 'string') {
				const isValidUrl =
					value.startsWith('http://') ||
					value.startsWith('https://') ||
					value.startsWith('mailto:');
				if (!isValidUrl) {
					errors.push({
						level: 'error',
						blockId: block.id,
						message: `Поле '${key}' должно быть корректной ссылкой (начинаться с http://, https:// или mailto:)`,
					});
				}
			}

			// 3.3. Проверка картинок (наличие атрибута alt, значение может быть пустым)
			if (option.type === 'image' && value) {
				// Проверяем наличие ключа 'alt' в props или в объекте value
				const hasAltAttribute =
					(typeof value === 'object' && value !== null && 'alt' in value) ||
					'alt' in props;

				if (!hasAltAttribute) {
					errors.push({
						level: 'warning',
						blockId: block.id,
						message: `Для изображения в поле '${key}' отсутствует атрибут alt (укажите alt="" для декоративных картинок)`,
					});
				}
			}
		}

		// 4. Рекурсивная проверка дочерних блоков (если это контейнер)
		if (template.isContainer && Array.isArray(block.children)) {
			for (const child of block.children) {
				checkBlock(child, block.type);
			}
		}
	}

	// Запускаем проверку для всех корневых блоков
	for (const block of document.blocks) {
		checkBlock(block, 'root');
	}

	return errors;
}
