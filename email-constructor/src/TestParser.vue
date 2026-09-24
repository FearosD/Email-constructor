<script setup>
import { ref, computed } from 'vue';
import { parse } from './core/parser.js';
import Typograf from 'typograf';

// Инициализируем типограф (русская и английская раскладки)
const tp = new Typograf({ locale: ['ru', 'en-US'] });

// Исходный "грязный" текст из макета
const rawText = ref(`Спикер - Михаил Денисаев, начальник Управления правового обеспечения основной деятельности ГБУ "Центр налоговых доходов" Департамента экономической политики и развития города Москвы.

Модератор - Эдвард Аветисянц, советник Правового управления Правительства Москвы.`);

// Текст после типографа (с ним мы будем работать и добавлять разметку)
const markupText = ref('');

// Функция для кнопки "Типограф"
function applyTypograf() {
  // execute() заменяет кавычки, тире, пробелы на HTML-сущности
  markupText.value = tp.execute(rawText.value);
}

// Реактивно вычисляем финальный HTML через наш парсер
const htmlOutput = computed(() => parse(markupText.value));
</script>

<template>
  <div style="padding: 20px; display: flex; gap: 20px; font-family: sans-serif; max-width: 1200px; margin: 0 auto;">
    
    <!-- Левая колонка: Исходник и Типограф -->
    <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
      <h3>1. Исходный текст (из макета)</h3>
      <textarea 
        v-model="rawText" 
        style="width: 100%; height: 150px; font-family: monospace; padding: 10px; border: 1px solid #ccc; border-radius: 4px;"
        placeholder="Вставьте текст из Figma..."
      ></textarea>
      
      <button 
        @click="applyTypograf"
        style="padding: 10px 20px; background: #FF0F43; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; align-self: flex-start;"
      >
        ✨ Применить Типограф
      </button>

      <h3 style="margin-top: 20px;">2. Разметка (добавьте ** # [ссылка])</h3>
      <textarea 
        v-model="markupText" 
        style="width: 100%; height: 200px; font-family: monospace; padding: 10px; border: 1px solid #ccc; border-radius: 4px;"
        placeholder="Здесь появится текст после типографа. Добавьте разметку..."
      ></textarea>
    </div>

    <!-- Правая колонка: Результат -->
    <div style="flex: 1; display: flex; flex-direction: column; gap: 20px;">
      <div>
        <h3>Визуальный результат</h3>
        <div style="border: 1px solid #ccc; padding: 15px; background: #fff; min-height: 100px;" v-html="htmlOutput"></div>
      </div>
      
      <div>
        <h3>Сгенерированный HTML-код</h3>
        <pre style="background: #f4f4f4; padding: 10px; overflow: auto; max-height: 300px; font-size: 12px; border: 1px solid #ddd; border-radius: 4px;">{{ htmlOutput }}</pre>
      </div>
    </div>
  </div>
</template>