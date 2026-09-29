<script setup>
import { computed } from 'vue';
import {useEmailStore} from '../stores/emailStore.js'
import { templateRegistry } from '../../templates/index.js';

const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  depth: {
    type: Number,
    default: 0
  }
});

const store = useEmailStore();

const template = computed(() => {
  return templateRegistry[props.block.type] || null;
});

const isSelected = computed(() => {
  return store.selectedBlockId === props.block.id;
});

const isContainer = computed(() => {
  return template.value?.isContainer || false;
});

function selectBlock() {
  store.selectBlock(props.block.id);
}

function moveUp() {
  store.moveBlock(props.block.id, 'up');
}

function moveDown() {
  store.moveBlock(props.block.id, 'down');
}

function removeBlock() {
  if (confirm(`Удалить блок "${template.value?.title || props.block.type}"?`)) {
    store.removeBlock(props.block.id);
  }
}
</script>

<template>
  <div class="block-tree-item" :class="{ selected: isSelected }" :style="{ paddingLeft: depth * 16 + 'px' }">
    <div class="block-item-header" @click="selectBlock">
      <span class="block-title">{{ template?.title || block.type }}</span>
      
      <div class="block-controls">
        <button @click.stop="moveUp" title="Переместить вверх">↑</button>
        <button @click.stop="moveDown" title="Переместить вниз">↓</button>
        <button @click.stop="removeBlock" title="Удалить">×</button>
      </div>
    </div>

    <!-- Рекурсивный рендер детей для контейнеров -->
    <div v-if="isContainer && block.children && block.children.length > 0" class="block-children">
      <BlockTreeItem 
        v-for="child in block.children" 
        :key="child.id" 
        :block="child" 
        :depth="depth + 1" 
      />
    </div>
  </div>
</template>

<style scoped>
.block-tree-item {
  border-left: 2px solid transparent;
  transition: all 0.2s;
}

.block-tree-item.selected {
  border-left-color: #FF0F43;
  background-color: #fff5f7;
}

.block-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.block-item-header:hover {
  background-color: #f9f9f9;
}

.block-title {
  font-size: 14px;
  color: #1A1230;
  font-weight: 500;
}

.block-controls {
  display: flex;
  gap: 4px;
}

.block-controls button {
  width: 24px;
  height: 24px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.block-controls button:hover {
  background-color: #f0f0f0;
  border-color: #999;
}

.block-children {
  margin-left: 8px;
}
</style>