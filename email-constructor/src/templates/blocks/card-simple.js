import { tokens } from '../../tokens.js';

export const cardSimpleTemplate = {
	type: 'card-simple',
	title: 'Простая плашка',
	category: 'layout',

	// Опций нет — плашка всегда белая, пользователь цвет не меняет
	options: {},

	isContainer: true,

	allowedChildren: ['text', 'button', 'important', 'card-grey', 'image'],

	allowedParents: ['root'],

	/**
	 * @param {object} props - пусто (опций нет)
	 * @param {string} children - HTML дочерних блоков
	 * @param {object} ctx - контекст
	 */
	render: (props, children, ctx) => {
		const totalWidth = ctx.contentWidth || 500;
		const sidePadding = tokens.spacing; // 16px из токенов
		const contentWidth = totalWidth - sidePadding * 2; // 500 - 32 = 468

		return `
      <table style="padding: 0; text-align: left; margin: 0 auto; border-spacing: 0; border-collapse: collapse; border-radius: 16px; -webkit-border-radius: 16px; -moz-border-radius: 16px; overflow: hidden;" border="0" width="${totalWidth}" cellspacing="0" cellpadding="0" bgcolor="${tokens.colors.background}">
        <tbody>
          <tr>
            <td valign="top" width="${sidePadding}"></td>
            <td valign="top" width="${contentWidth}" align="left">
              <br>
              ${children}
              <span style="font: 14px Arial, sans-serif; color: ${tokens.colors.background}; line-height: 1.3; -webkit-text-size-adjust:none;">.<br></span>
            </td>
            <td valign="top" width="${sidePadding}"></td>
          </tr>
        </tbody>
      </table>
    `;
	},
};
