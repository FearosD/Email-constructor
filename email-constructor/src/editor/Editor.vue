<script setup>
import { onMounted } from 'vue';
import { useEmailStore } from './stores/emailStore.js';
import { testDocument } from './testDocument.js';
import BlockTree from './components/BlockTree.vue';

const store = useEmailStore();

onMounted(() => {
  store.loadDocument(testDocument);
});
</script>

<template>
  <div class="editor">
    <div class="editor-layout">
      <div class="editor-sidebar">
        <BlockTree />
      </div>
      
      <div class="editor-main">
        <div class="placeholder">
          <h2>Редактор email-писем</h2>
          <p>Дерево блоков загружено. Следующие этапы: палитра, инспектор, превью.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor {
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
}

.editor-layout {
  display: flex;
  height: 100%;
  gap: 16px;
  padding: 16px;
}

.editor-sidebar {
  width: 320px;
  flex-shrink: 0;
}

.editor-main {
  flex: 1;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  text-align: center;
  color: #666;
}

.placeholder h2 {
  color: #1A1230;
  margin-bottom: 8px;
}
</style>