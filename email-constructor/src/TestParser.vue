<script setup>
import { ref, computed } from 'vue';
import { parse } from './core/parser.js';

// Тестовые данные по умолчанию (ваши примеры)
const inputText = ref(`# **Здравствуйте!**

Это обычный текст с **жирным** словом.
А вот {red}важный красный текст{/red}.

Ссылка: [Google](https://google.com)

- пункт 1
- пункт 2
1. первый
2. второй

{br}
Код для проверки экранирования: <div class="test">&</div>`);

// Реактивно вычисляем результат парсинга
const htmlOutput = computed(() => parse(inputText.value));
</script>

<template>
  <div style="padding: 20px; display: flex; gap: 20px; font-family: sans-serif;">
    <!-- Левая колонка: Ввод -->
    <div style="flex: 1;">
      <h3>Ввод (разметка)</h3>
      <textarea 
        v-model="inputText" 
        style="width: 400px; height: 400px; font-family: monospace; padding: 10px;"
      ></textarea>
    </div>

    <!-- Правая колонка: Результат -->
    <div style="flex: 1; display: flex; flex-direction: column; gap: 20px;">
      <div>
        <h3>Визуальный результат</h3>
        <!-- v-html безопасно рендерит наш проверенный HTML -->
        <div style="width:400px; border: 1px solid #ccc; padding: 10px; background: #fff;" v-html="htmlOutput"></div>
      </div>
      
      <!-- <div>
        <h3>Сгенерированный HTML-код</h3>
        <pre style="background: #f4f4f4; padding: 10px; overflow: auto; max-height: 200px; font-size: 12px;">{{ htmlOutput }}</pre>
      </div> -->
    </div>
  </div>
</template>