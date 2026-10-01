export const goodluckTemplate = {
    type: 'goodluck',
    title: 'Прощание',
    category: 'content',
    
    options: {
      content: {
        type: 'richtext',
        label: 'Текст'
      }
    },
  
    isContainer: false,
    allowedParents: ['root'],
  
    // Исправлено: разметка вместо HTML
    defaultContent: '## Желаем удачи!',
  
    render: (props, children, ctx) => {
      const contentHtml = props.content || '';
  
      return `
      <table style="padding: 0; text-align: left; margin: 0 auto; border-spacing: 0; border-collapse: collapse; border-radius: 16px; -webkit-border-radius: 16px; -moz-border-radius: 16px; overflow: hidden;" border="0" width="500" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
      <tbody>
        <tr>
          <td valign="top" width="16">
          </td>
          <td valign="center" width="434" align="left">
            <br>
            ${contentHtml}
            <span style="font: 14px Arial, sans-serif; color: #ffffff; line-height: 1.3; -webkit-text-size-adjust:none;">.<br></span>
          </td>
          <td valign="middle" width="34" align="right">
            <img src="https://mguu.ru/files/emails/wi_kp_template/images/icon_book.png" srcset="https://mguu.ru/files/emails/wi_kp_template/images/icon_book@2x.png 2x" alt="" width="34" height="24">
          </td>
          <td valign="top" width="16">
          </td>
        </tr>
      </tbody>
    </table>
      `;
    }
  };