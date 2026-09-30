import { tokens } from '../../core/tokens.js';

export const buttonTemplate = {
  type: 'button',
  title: 'Кнопка',
  category: 'content',
  
  options: {
    text: {
      type: 'text',
      label: 'Текст кнопки',
      default: 'Заполнить анкету'
    },
    url: {
      type: 'url',
      label: 'Ссылка',
      default: 'https://example.com'
    },
    width: {
      type: 'number',
      label: 'Ширина (px)',
      default: 200
    },
    height: {
      type: 'number',
      label: 'Высота (px)',
      default: 40
    },
    fontSize: {
      type: 'number',
      label: 'Размер шрифта (pt)',
      default: 10.5
    }
  },

  isContainer: false,
  
  // Кнопку можно класть практически везде
  allowedParents: ['root', 'card-simple', 'card-heading'],

  /**
   * @param {object} props - значения опций
   * @param {string} children - не используется
   * @param {object} ctx - контекст
   */
  render: (props, children, ctx) => {
    const text = props.text || 'Кнопка';
    const url = props.url || '#';
    const width = props.width || 200;
    const height = props.height || 40;
    const fontSize = props.fontSize || 10.5;
    
    // Цвета берем из токенов (с фоллбэком на ваши проверенные значения из примера)
    const bgColor = tokens.colors.accent || '#F20B36';
    const textColor = tokens.colors.white || '#ffffff';

    // Строго ваша верстка, подставлены только переменные
    return `
<div>
  <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:${height}px;v-text-anchor:middle;width:${width}px;" arcsize="25" stroke="f" fillcolor="${bgColor}">
        <w:anchorlock/>
        <center style="color:${textColor};font-family:sans-serif;font-size:${fontSize}pt;">
        ${text}
        </center>
      </v:roundrect>
    <![endif]-->
  <!--[if !mso]> <!-->
  <table cellspacing="0" cellpadding="0">
    <tbody>
      <tr>
        <td align="center" width="${width}" height="${height}" bgcolor="${bgColor}" style="-webkit-border-radius: 25px; -moz-border-radius: 25px; border-radius: 25px; color: ${textColor}; display: block;">
          <a href="${url}" style="color: ${textColor}; font-size:${fontSize}pt; font-family:sans-serif; text-decoration: none; line-height:${height}px; width:100%; display:inline-block">
            ${text}
          </a>
        </td>
      </tr>
    </tbody>
  </table>
  <!-- <![endif]-->
</div>
    `.trim();
  }
};