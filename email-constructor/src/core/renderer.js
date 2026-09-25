// src/core/renderer.js
import { templateRegistry } from '../templates/index.js';
import { getInitialContext, buildContext } from './context.js';
import { parse } from './parser.js';

/**
 * Рендерит один узел JSON-модели и его дочерние элементы
 * @param {Object} node - Узел модели { type, props, children }
 * @param {Object} ctx - Контекст рендеринга
 * @returns {string} HTML-строка
 */
function renderBlock(node, ctx) {
	const template = templateRegistry[node.type];

	if (!template) {
		console.warn(
			`[Renderer] Шаблон для типа "${node.type}" не найден в реестре`
		);
		return '';
	}

	// 1. Подготовка props (безопасный парсинг richtext)
	const processedProps = { ...(node.props || {}) };

	// Если у блока есть верхнеуровневое поле content (как в Structure.md 6.2)
	if (node.content && typeof node.content === 'string') {
		processedProps.content = node.content;
	}

	if (template.options) {
		for (const [key, optionDef] of Object.entries(template.options)) {
			if (optionDef.type === 'richtext') {
				const rawText = processedProps[key];
				// Парсим только если это строка и она ещё не содержит HTML-тегов
				if (typeof rawText === 'string' && !rawText.includes('<')) {
					processedProps[key] = parse(rawText);
				}
			}
		}
	}

	// 2. Рендер дочерних элементов (если блок является контейнером)
	let childrenHtml = '';
	if (template.isContainer && node.children && node.children.length > 0) {
		const childCtx = buildContext(ctx, node.type);
		childrenHtml = node.children
			.map((child) => renderBlock(child, childCtx))
			.join('<br>');
	}

	// 3. Вызов функции render конкретного шаблона
	if (node.type === 'header') {
		const variant = node.props?.variant || 'white';
		return template.render(variant, ctx);
	}

	if (node.type === 'footer') {
		return template.render(ctx);
	}

	if (template.isContainer) {
		return template.render(processedProps, childrenHtml, ctx);
	}

	// Атомарные блоки
	return template.render(processedProps, '', ctx);
}

/**
 * Главная функция рендеринга всего письма
 * @param {Object} model - JSON-модель письма { meta, blocks }
 * @returns {string} Полный валидный HTML-документ
 */
export function renderEmail(model) {
	const ctx = getInitialContext();
	const meta = model.meta || {};

	// 1. Шапка (системный блок, рендерится вне контентной колонки 500px)
	const headerVariant = meta.headerVariant || 'white';
	const headerHtml = templateRegistry['header'].render(headerVariant, ctx);

	// 2. Контентные блоки (рендерятся внутри колонки 500px)
	const contentHtml = (model.blocks || [])
		.map((block) => renderBlock(block, ctx))
		.join('<br><br>');

	// Контентная обёртка: 50px | 500px | 50px
	const contentWrapper = `
  <table style="padding: 0; text-align: left; margin: 0 auto; border-spacing: 0; border-collapse: collapse;" border="0" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td valign="top" width="50" align="left">
        &nbsp;
      </td>
      <td valign="top" width="500">
            ${contentHtml}
            </td>
            <td valign="top" width="50" align="left">
              &nbsp;
            </td>
          </tr>
        </tbody>
  </table>
  `;

	// 3. Подвал (системный блок, содержит собственную таблицу 600px)
	const footerHtml = templateRegistry['footer'].render(ctx);

	// 4. Сборка полного документа
	return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title></title>
  </head> 
  <body style="margin:0; padding:0; font-size: 14px; line-height: 100%; font-family: Arial, sans-serif; vertical-align: top; text-align: left; color: #10161E;">
    <noscript><img src="/2213a85ee3b3195a64a5e38df112ca76.gif" width="0" height="0" alt="" /></noscript>
    <table style="padding: 0; margin: 0;" border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
      <tbody>
        <tr>
          <td align="center" height="100%" width="100%">
  
            <table style="padding: 0; margin: 0;" border="0" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
              <tbody>
                <tr>
                  <td style="padding: 0;" valign="top" bgcolor="#F5F5F5">
         <!-- шапка -->
          ${headerHtml}
        <!-- Контент -->
          ${contentWrapper}
        <!-- Подвал -->
          ${footerHtml}
          </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</tbody>
</table>
</body>
</html>
`;
}

export default renderEmail;

const testObject = {
	version: 1,
	meta: {
		subject: 'Тестовое письмо',
		preheader: 'Проверка рендерера и вложенности',
		headerVariant: 'red',
		footerVariant: 'default',
	},
	blocks: [
		{
			id: 'c1',
			type: 'card-simple',
			props: {},
			children: [
				{
					id: 't1',
					type: 'text',
					content:
						'Привет! Это **важный** текст с {red}красным{/red} акцентом и [ссылкой](https://example.com).',
				},
				{
					id: 'g1',
					type: 'card-grey',
					content:
						'А это серая плашка внутри белой. Её ширина должна быть строго 468px.',
				},
			],
		},
		{
			id: 'i1',
			type: 'important',
			content:
				'# Напоминаем,{br}что после завершения курса вы получите сертификат.',
		},
	],
};

// console.log(renderEmail(testObject));
