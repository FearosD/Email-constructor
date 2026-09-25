export const footerTemplate = {
    type: 'system-footer',
    title: 'Подвал',
    category: 'system',
    isSystem: true,
  
    /**
     * @param {object} ctx - контекст рендеринга
     */
    render: (ctx) => {
      return `
  <img src="https://mguu.ru/files/emails/wi_kp_template/images/footer.png" srcset="https://mguu.ru/files/emails/wi_kp_template/images/footer@2x.png 2x" alt="" width="600" height="97" style="float:right">
  <table style="padding: 0; text-align: left; margin: 0 auto; background: #ffffff;" border="0" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
    <tbody>
      <tr>
        <td valign="top" width="50"></td>
        <td valign="top" width="500" style="text-align: left; font: 14px Arial, sans-serif; color: #000000; line-height: 1.3; -webkit-text-size-adjust:none;">
          <span style="text-align: left; font: 14px Arial, sans-serif; color: #000000; line-height: 1.3; -webkit-text-size-adjust:none;">Команда&nbsp;Управления<br>кадровых сервисов <br>Правительства Москвы<br><br></span>
        </td>
        <td valign="top" width="50"></td>
      </tr>
      <tr>
        <td valign="top" width="50"></td>
        <td valign="top" width="500" style="text-align: left; font: 10px Arial, sans-serif; color: #000000; line-height: 1.3; -webkit-text-size-adjust:none;">
          <table style="padding: 0; text-align: left; margin: 0 auto;" border="0" width="500" cellspacing="0" cellpadding="0">
            <tbody>
              <tr>
                <td valign="top" width="112" style="border-right: 1px solid #E8E8E8; text-align: left; font: 10px Arial, sans-serif; color: #000000; line-height: 12px; -webkit-text-size-adjust:none;">
                  <img src="https://mguu.ru/files/emails/wi_kp_template/images/n_footer_icon1.png" alt="" width="24" height="30" style="border:0; margin:0;"><br>
                  <a href="https://talent.mos.ru/training//?utm_source=email&amp;utm_medium=service_letter_mass&amp;utm_campaign=newpodval" style="text-align: left; font: 10px Arial, sans-serif; color: #000000; line-height: 12px; -webkit-text-size-adjust:none;">Витрина кадровых сервисов</a><span style="text-align: left; font: 10px Arial, sans-serif; color: #000000; line-height: 12px; -webkit-text-size-adjust:none;">:<br>выбрать обучение<br></span>
                </td>
                <td valign="top" width="17">&nbsp;</td>
                <td valign="top" width="112" style="border-right: 1px solid #E8E8E8; text-align: left; font: 10px Arial, sans-serif; color: #000000; line-height: 12px; -webkit-text-size-adjust:none;">
                  <img src="https://mguu.ru/files/emails/wi_kp_template/images/n_footer_icon2.png" alt="" width="24" height="30" style="border:0; margin:0;"><br>
                  <a href="https://t.me/ks_pm" style="text-align: left; font: 10px Arial, sans-serif; color: #000000; line-height: 12px; -webkit-text-size-adjust:none;">«Команда Москвы»</a><span style="text-align: left; font: 10px Arial, sans-serif; color: #000000; line-height: 12px; -webkit-text-size-adjust:none;">:<br>быть в&nbsp;курсе самого важного<br></span>
                </td>
                <td valign="top" width="17">&nbsp;</td>
                <td valign="top" width="112" style="border-right: 1px solid #E8E8E8; text-align: left; font: 10px Arial, sans-serif; color: #000000; line-height: 12px; -webkit-text-size-adjust:none;">
                  <img src="https://mguu.ru/files/emails/wi_kp_template/images/n_footer_icon4.png" alt="" width="24" height="30" style="border:0; margin:0;"><br>
                  <a href="https://max.ru/ks_pm" style="text-align: left; font: 10px Arial, sans-serif; color: #000000; line-height: 12px; -webkit-text-size-adjust:none;">«Команда Москвы»</a><span style="text-align: left; font: 10px Arial, sans-serif; color: #000000; line-height: 12px; -webkit-text-size-adjust:none;">:<br>читать новости в&nbsp;«Максе»<br></span>
                </td>
                <td valign="top" width="17">&nbsp;</td>
                <td valign="top" width="113" style="text-align: left; font: 10px Arial, sans-serif; color: #000000; line-height: 12px; -webkit-text-size-adjust:none;">
                  <img src="https://mguu.ru/files/emails/wi_kp_template/images/n_footer_icon3.png" alt="" width="24" height="30" style="border:0; margin:0;"><br>
                  <span style="text-align: left; font: 10px Arial, sans-serif; color: #000000; line-height: 12px; -webkit-text-size-adjust:none;">Единая линия поддержки:<br></span>
                  <a href="tel:+74959577575" style="text-align: left; font: 10px Arial, sans-serif; color: #000000; line-height: 12px; -webkit-text-size-adjust:none;">+7&nbsp;(495)&nbsp;957-75-75</a>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
        <td valign="top" width="50"></td>
      </tr>
      <tr>
        <td valign="top" width="50"></td>
        <td valign="top" width="500" height="30"><br></td>
        <td valign="top" width="50"></td>
      </tr>
      <tr>
        <td valign="top" width="600" height="4" colspan="3" style="border-top: 4px solid #FF0F43;"></td>
      </tr>
    </tbody>
  </table>
      `.trim();
    }
  };