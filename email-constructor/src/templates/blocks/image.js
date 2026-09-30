export const imageTemplate = {
    type: 'image',
    title: 'Изображение',
    category: 'content',
    
    options: {
      src: {
        type: 'url',
        label: 'URL изображения'
      },
      height: {
        type: 'number',
        label: 'Высота (px)',
        default: ''
      },
      spacing: {
        type: 'select',
        label: 'Отступ снизу',
        options: [
          { value: 'single', label: 'Одинарный (1 BR)' },
          { value: 'double', label: 'Двойной (2 BR)' }
        ],
        default: 'single'
      }
    },
  
    isContainer: false,
    
    // Пока только card-simple, в будущем расширим при необходимости
    allowedParents: ['card-simple'],
  
    /**
     * @param {object} props - значения опций
     * @param {string} children - не используется
     * @param {object} ctx - контекст
     */
    render: (props, children, ctx) => {
      const width = ctx.contentWidth || 468;
      const src = props.src || '';
      const height = props.height || '';
      const spacing = props.spacing || 'single';
      
      // Если URL пустой, ничего не рендерим
      if (!src) return '';
      
      // Автоматическая генерация srcset для retina
      let srcset = '';
      if (src.endsWith('.png')) {
        srcset = src.replace('.png', '@2x.png 2x');
      } else if (src.endsWith('.jpg') || src.endsWith('.jpeg')) {
        srcset = src.replace(/\.jpe?g$/i, '@2x.jpg 2x');
      } else if (src.endsWith('.gif')) {
        srcset = src.replace('.gif', '@2x.gif 2x');
      }
      
      // Отступ снизу
      const spacingHtml = spacing === 'double' ? '<br><br>' : '<br>';
  
      // Строго ваша верстка, без добавленных мной стилей
      return `
        <img src="${src}" srcset="${srcset}" alt="" width="${width}" height="${height}">
        ${spacingHtml}
      `;
    }
  };