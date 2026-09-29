<script setup>
import { computed } from 'vue';
import { useEmailStore } from '../stores/emailStore.js';
import BlockTreeItem from './BlockTreeItem.vue';

const store = useEmailStore();

const blocks = computed(() => store.document.blocks);
const hasBlocks = computed(() => blocks.value.length > 0);
</script>

<template>
  <div class="block-tree">
    <div class="tree-header">
      <h3>Структура письма</h3>
    </div>

    <div v-if="hasBlocks" class="tree-content">
      <BlockTreeItem 
        v-for="block in blocks" 
        :key="block.id" 
        :block="block" 
        :depth="0" 
      />
    </div>

    <div v-else class="tree-empty">
      <p>Добавьте первый блок</p>
    </div>
  </div>
</template>

<style scoped>
.block-tree {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.tree-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fafafa;
}

.tree-header h3 {
  margin: 0;
  font-size: 16px;
  color: #1A1230;
  font-weight: 600;
}

.tree-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.tree-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  padding: 32px;
  text-align: center;
}
</style>