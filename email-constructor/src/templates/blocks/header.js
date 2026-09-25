export const headerTemplate = {
    type: 'system-header',
    title: 'Шапка',
    category: 'system',
    isSystem: true,
    
    variants: {
      white: {
        src: 'https://mguu.ru/files/emails/kp_gos/images/logos1.png',
        srcset: 'https://mguu.ru/files/emails/kp_gos/images/logos@2x.png 2x',
      },
      red: {
        src: 'https://mguu.ru/files/emails/wi_kp_vystup/images/logos.png',
        srcset: 'https://mguu.ru/files/emails/wi_kp_vystup/images/logos@2x.png 2x',
      }
    },
  
    /**
     * @param {string} variant - 'white' или 'red' (берется из meta.headerVariant)
     * @param {object} ctx - контекст рендеринга
     */
    render: (variant = 'white', ctx) => {
      const imgData = headerTemplate.variants[variant] || headerTemplate.variants.white;
      
      // Строго исходная верстка без добавления лишних инлайн-стилей
      return `<img src="${imgData.src}" srcset="${imgData.srcset}" alt="" width="600" height="95" style="float:right">`;
    }
  };