import { headerTemplate } from './blocks/header.js';
import { footerTemplate } from './blocks/footer.js';
import { cardSimpleTemplate } from './blocks/card-simple.js';
import { cardHeadingTemplate } from './blocks/card-heading.js';
import { importantTemplate } from './blocks/important.js';
import { cardGreyTemplate } from './blocks/card-grey.js';
import { textTemplate } from './blocks/text.js';

/**
 * Реестр шаблонов блоков.
 * 
 * Используется:
 * - Палитрой (BlockPalette) — для отображения доступных блоков
 * - Инспектором (BlockInspector) — для построения полей опций
 * - Рендерером (renderer.js) — для поиска шаблона по типу блока
 * - Валидатором (validator.js) — для проверки правил вложенности
 */
export const templateRegistry = {
  // Системные блоки (не показываются в палитре, но нужны рендереру)
  'header': headerTemplate,
  'footer': footerTemplate,
  
  // Контейнеры (layout)
  'card-simple': cardSimpleTemplate,
  'card-heading': cardHeadingTemplate,
  
  // Контентные блоки
  'text': textTemplate,
  'important': importantTemplate,
  'card-grey': cardGreyTemplate,
};

// Экспорт по умолчанию для удобства импорта
export default templateRegistry;