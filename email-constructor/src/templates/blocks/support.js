export const supportTemplate = {
    type: 'support',
    title: 'Техподдержка',
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
    defaultContent: '**Если у Вас появятся вопросы,** пожалуйста, напишите нам&nbsp;по&nbsp;адресу [ks@mos.ru](mailto:ks@mos.ru) или позвоните по&nbsp;номеру {nobr}+7 (495) 957-75-75{/nobr}. Мы всегда рады помочь!',
  
    render: (props, children, ctx) => {
      const contentHtml = props.content || '';
  
      return `
        <table style="padding: 0; text-align: left; margin: 0 auto; border-spacing: 0; border-collapse: collapse; border-radius: 16px; -webkit-border-radius: 16px; -moz-border-radius: 16px; overflow: hidden;" border="0" width="500" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
          <tbody>
            <tr>
              <td valign="top" width="16"></td>
              <td valign="center" width="434" align="left">
                <br>
                ${contentHtml}
                <span style="font: 14px Arial, sans-serif; color: #ffffff; line-height: 1.3; -webkit-text-size-adjust:none;">.<br></span>
              </td>
              <td valign="middle" width="34" align="right">
                <img src="https://mguu.ru/files/emails/wi_kp_template/images/icon_mail.png" srcset="https://mguu.ru/files/emails/wi_kp_template/images/icon_mail@2x.png 2x" alt="" width="34" height="24" style="border:0;">
              </td>
              <td valign="top" width="16"></td>
            </tr>
          </tbody>
        </table>
      `;
    }
  };