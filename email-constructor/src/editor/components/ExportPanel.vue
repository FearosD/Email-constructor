<script setup>
import { ref, computed } from 'vue';
import { useEmailStore } from '../stores/emailStore.js';
import { validate } from '../../core/validator.js';
import { renderEmail } from '../../core/renderer.js';

const store = useEmailStore();
const errors = ref([]);
const showErrors = ref(false);

// Переименовали, чтобы не конфликтовать с window.document
const emailDocument = computed(() => store.document);

function sanitizeFilename(text) {
  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() || 'letter';
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement('a'); // Явно указываем window
  link.href = url;
  link.download = filename;
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function runValidation() {
  const validationErrors = validate(emailDocument.value);
  errors.value = validationErrors.filter(e => e.level === 'error');
  showErrors.value = errors.value.length > 0;
  return errors.value.length === 0;
}

function exportHTML() {
  if (!runValidation()) return;
  
  const html = renderEmail(emailDocument.value);
  const filename = `${sanitizeFilename(emailDocument.value.meta.subject)}.html`;
  downloadFile(html, filename, 'text/html');
}

function exportJSON() {
  if (!runValidation()) return;
  
  const json = JSON.stringify(emailDocument.value, null, 2);
  const filename = `${sanitizeFilename(emailDocument.value.meta.subject)}.json`;
  downloadFile(json, filename, 'application/json');
}
</script>

<template>
  <div class="export-panel">
    <h3>Экспорт</h3>
    
    <div class="export-buttons">
      <button @click="exportHTML" class="btn-export">
        Экспорт HTML
      </button>
      <button @click="exportJSON" class="btn-export">
        Экспорт JSON
      </button>
    </div>
    
    <div v-if="showErrors" class="errors-list">
      <h4>Ошибки валидации:</h4>
      <ul>
        <li v-for="(error, index) in errors" :key="index">
          {{ error.message }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.export-panel {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

.export-panel h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #1A1230;
  font-weight: 600;
}

.export-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-export {
  padding: 10px 16px;
  background: #FF0F43;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-export:hover {
  background: #e00e3d;
}

.errors-list {
  margin-top: 16px;
  padding: 12px;
  background: #fff5f7;
  border: 1px solid #ffcdd2;
  border-radius: 6px;
}

.errors-list h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #d32f2f;
}

.errors-list ul {
  margin: 0;
  padding-left: 20px;
}

.errors-list li {
  font-size: 13px;
  color: #d32f2f;
  margin-bottom: 4px;
}
</style>