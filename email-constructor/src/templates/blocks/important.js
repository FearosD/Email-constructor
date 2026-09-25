import { tokens } from '../../tokens.js';

export const importantTemplate = {
	type: 'important',
	title: 'Важно',
	category: 'content',

	options: {
		content: {
			type: 'richtext',
			label: 'Текст',
		},
	},

	isContainer: false,

	// Блок может быть в корне письма или внутри белых плашек
	allowedParents: ['root', 'card-simple', 'card-heading'],

	/**
	 * @param {object} props - значения опций (content)
	 * @param {string} children - не используется (isContainer: false)
	 * @param {object} ctx - контекст
	 */
	render: (props, children, ctx) => {
		// props.content уже прошёл через парсер и содержит готовый HTML
		const contentHtml = props.content || '';

		// Динамическая ширина из контекста
		const totalWidth = ctx.contentWidth || 500;
		const lineWidth = 12; // хардкод ширины столбца с красной линией
		const contentWidth = totalWidth - lineWidth; // контентная часть

		return `
      <table style="padding: 0; text-align: left; margin: 0 auto; border-spacing: 0; border-collapse: collapse;" border="0" width="${totalWidth}" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td valign="top" width="${lineWidth}" style="border-left: 4px solid ${tokens.colors.accent};">
            </td>
            <td valign="center" width="${contentWidth}" align="left">
              ${contentHtml}
            </td>
          </tr>
        </tbody>
      </table>
    `;
	},
};
