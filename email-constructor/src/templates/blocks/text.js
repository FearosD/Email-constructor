export const textTemplate = {
    type: 'text',
    title: 'Текст',
    category: 'content',
    
    options: {
      content: {
        type: 'richtext',
        label: 'Текст'
      }
    },
  
    isContainer: false,
    
    // Текст может быть в корне письма или внутри белых плашек
    allowedParents: ['root', 'card-simple', 'card-heading'],
  
    /**
     * @param {object} props - значения опций (content)
     * @param {string} children - не используется (isContainer: false)
     * @param {object} ctx - контекст
     */
    render: (props, children, ctx) => {
      // props.content уже прошёл через парсер и содержит готовый HTML
      // (заголовки, списки, жирный текст, ссылки — всё уже обёрнуто в <span> с инлайн-стилями)
      return props.content || '';
    }
  };