import { validate } from './validator.js';

// Заведомо битая модель для тестирования
const brokenDocument = {
  version: 1,
  meta: { subject: 'Тест', preheader: '', headerVariant: 'white' },
  blocks: [
    {
      id: 'b1',
      type: 'card-simple',
      props: {},
      children: [
        {
          id: 'b2',
          type: 'card-grey',
          content: '', // Пустой контент при required: true (если бы он был required)
        },
        {
          id: 'b3',
          type: 'text',
          content: 'Проверка ссылки',
          props: {
            // Допустим, мы добавили опцию url в text для теста
            linkUrl: 'ftp://bad-link.com' // Ошибка: не http/https
          }
        },
        {
          id: 'b4',
          type: 'unknown-block-type', // Ошибка: неизвестный тип
          props: {}
        }
      ]
    },
    {
      id: 'b5',
      type: 'card-grey',
      props: {},
      // Ошибка вложенности: card-grey не может быть в root, только внутри card-simple или card-heading
    }
  ]
};

// Запуск валидации
const validationResults = validate(brokenDocument);

console.log('--- Результаты валидации ---');
console.table(validationResults);