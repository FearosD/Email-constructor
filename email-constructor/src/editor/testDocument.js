/**
 * Тестовая JSON-модель письма.
 * Используется только для разработки и проверки работы редактора.
 * Перед продакшеном — удалить или заменить на пустую модель.
 */
export const testDocument = {
    version: 1,
    meta: {
      subject: 'Тестовое письмо',
      preheader: 'Проверка работы редактора',
      headerVariant: 'white',
      footerVariant: 'default'
    },
    blocks: [
      {
        id: 'test-1',
        type: 'card-heading',
        props: {
          heading: 'Заголовок карточки',
          icon: 'desktop'
        },
        children: [
          {
            id: 'test-2',
            type: 'text',
            content: 'Текст внутри карточки'
          },
          {
            id: 'test-3',
            type: 'card-grey',
            content: 'Серая плашка с текстом'
          }
        ]
      },
      {
        id: 'test-4',
        type: 'important',
        content: 'Важно! Это блок important'
      }
    ]
  };
  
  // Пустая модель — для переключения, когда тестовые данные не нужны
  export const emptyDocument = {
    version: 1,
    meta: {
      subject: 'Тема письма',
      preheader: 'Прехедер',
      headerVariant: 'white',
      footerVariant: 'default'
    },
    blocks: []
  };