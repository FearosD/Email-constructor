/**
 * Тестовая JSON-модель письма.
 * Используется только для разработки и проверки работы редактора.
 * Перед продакшеном — удалить или заменить на пустую модель.
 */
export const testDocument = {
  "version": 1,
  "meta": {
    "subject": "Тестовое письмо",
    "headerVariant": "white",
    "footerVariant": "default"
  },
  "blocks": [
    {
      "id": "d4e8db0e-2d1e-4774-8fed-534711984859",
      "type": "card-simple",
      "props": {},
      "content": "",
      "children": [
        {
          "id": "19979f22-e4a3-49e9-b632-511cc2061272",
          "type": "image",
          "props": {
            "height": 148,
            "spacing": "double",
            "src": "https://mguu.ru/files/emails/ks/375/images/header.png"
          },
          "content": ""
        },
        {
          "id": "ee7b19db-4aef-4fc3-944f-391b82421d71",
          "type": "text",
          "props": {},
          "content": "# Здравствуйте!\n\nРады видеть Вас в числе участников вебинара {red}**«Вебинар».**{/red}"
        }
      ]
    },
    {
      "id": "4737cd2b-ed1e-4031-bf11-f96fa7718bf3",
      "type": "card-simple",
      "props": {},
      "content": "",
      "children": [
        {
          "id": "c348c2b3-96f9-4374-b276-5bd73e66203e",
          "type": "text",
          "props": {},
          "content": "Будущий текст"
        }
      ]
    },
    {
      "id": "87b5937e-6e49-4c95-af25-f5a25ca1d623",
      "type": "support",
      "props": {},
      "content": "**Если у Вас появятся вопросы,** пожалуйста, напишите нам&nbsp;по&nbsp;адресу [ks@mos.ru](mailto:ks@mos.ru) или позвоните по&nbsp;номеру {nobr}+7 (495) 957-75-75{/nobr}. Мы всегда рады помочь!"
    },
    {
      "id": "ffc72633-1bef-4039-bb1d-44a857dfa6af",
      "type": "goodluck",
      "props": {},
      "content": "## Желаем удачи!"
    }
  ]
}
  
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