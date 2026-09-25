import {tokens} from '../../tokens.js';

export const cardGreyTemplate = {
  type: 'card-grey',
  title: 'Серая плашка',
  category: 'content',
  
  options: {
    content: {
      type: 'richtext',
      label: 'Текст'
    }
  },

  isContainer: false,
  
  // Может быть только внутри белых плашек
  allowedParents: ['card-simple', 'card-heading'],

  /**
   * @param {object} props - значения опций (content)
   * @param {string} children - не используется
   * @param {object} ctx - контекст
   */
  render: (props, children, ctx) => {
    // Парсер уже обработал текст
    const contentHtml = props.content || '';
    
    // Цвет берем из токенов (если там задан cardBg, иначе фоллбэк на #F5F5F5)
    const bgColor = tokens.colors.cardBg || '#F5F5F5';

    return `
      <table style="padding: 0; text-align: left; margin: 0 auto; border-spacing: 0; border-collapse: collapse; border-radius: 8px; -webkit-border-radius: 8px; -moz-border-radius: 8px; overflow: hidden;" border="0" width="468" cellspacing="0" cellpadding="0" bgcolor="${bgColor}">
        <tbody>
          <tr>
            <td valign="top" width="16"></td>
            <td valign="center" width="436" align="left">
              <br>
              ${contentHtml}
              <span style="font: 14px Arial, sans-serif; color: ${bgColor}; line-height: 1.3; -webkit-text-size-adjust:none;">.<br></span>
            </td>
            <td valign="top" width="16"></td>
          </tr>
        </tbody>
      </table>
    `;
  }
};