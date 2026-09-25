import { tokens } from '../../core/tokens.js';

export const cardHeadingTemplate = {
	type: 'card-heading',
	title: 'Плашка с заголовком',
	category: 'layout',

	options: {
		heading: {
			type: 'richtext',
			label: 'Заголовок',
			// Убираем <b>, так как парсер добавит его сам
			default: 'На вебинаре Вы узнаете:',
		},
		icon: {
			type: 'select',
			label: 'Иконка',
			options: [
				{ value: 'desktop', label: 'Компьютер' },
				{ value: 'man', label: 'Человек' },
				{ value: 'book', label: 'Книга' },
			],
			default: 'desktop',
		},
	},

	isContainer: true,

	// Те же потомки, что и у простой плашки + наша будущая серая плашка и текстовый блок
	allowedChildren: ['text', 'button', 'important', 'card-grey', 'image'],

	allowedParents: ['root'],

	/**
	 * @param {object} props - значения опций (heading, icon)
	 * @param {string} children - HTML дочерних блоков
	 * @param {object} ctx - контекст
	 */
	render: (props, children, ctx) => {
		const totalWidth = ctx.contentWidth || 500;
		const sidePadding = 16; // tokens.spacing
		const contentWidth = totalWidth - sidePadding * 2; // 500 - 32 = 468

		const iconVariant = props.icon || 'desktop';
		const iconSrc = `https://mguu.ru/files/emails/wi_kp_template/images/icon_${iconVariant}.png`;
		const iconSrcSet = `https://mguu.ru/files/emails/wi_kp_template/images/icon_${iconVariant}@2x.png 2x`;

		// Ширина для заголовка: общая ширина контента минус ширина иконки (468 - 34 = 434)
		const headingWidth = contentWidth - 34;

		// Предполагается, что к props.heading уже был применен парсер,
		// и headingHtml содержит готовый код вида:
		// <span style="..."><b>На вебинаре Вы узнаете:</b><br></span>
		const headingHtml = props.heading || '';

		return `
      <table style="padding: 0; text-align: left; margin: 0 auto; border-spacing: 0; border-collapse: collapse; border-radius: 16px; -webkit-border-radius: 16px; -moz-border-radius: 16px; overflow: hidden;" border="0" width="${totalWidth}" cellspacing="0" cellpadding="0" bgcolor="${tokens.colors.background}">
        <tbody>
          <tr>
            <td valign="top" width="${sidePadding}"></td>
            <td valign="center" width="${headingWidth}" align="left">
              <br>
              ${headingHtml} 
            </td>
            <td valign="top" width="34" align="right">
              <br>
              <img src="${iconSrc}" srcset="${iconSrcSet}" alt="" width="34" height="24" style="border:0;">
            </td>
            <td valign="top" width="${sidePadding}"></td>
          </tr>
          <!-- ... нижняя строка с children ... -->
          <tr>
            <td valign="top" width="${sidePadding}"></td>
            <td valign="center" width="${contentWidth}" align="left" colspan="2">
              ${children}
              <!-- Костыль-распорка, цвет совпадает с фоном плашки (#ffffff) -->
              <span style="font: 14px Arial, sans-serif; color: #ffffff; line-height: 1.3; -webkit-text-size-adjust:none;">.<br></span>
            </td>
            <td valign="top" width="${sidePadding}"></td>
          </tr>
        </tbody>
      </table>
    `;
	},
};
