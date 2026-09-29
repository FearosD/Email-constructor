<script setup>
import { computed } from 'vue';
import { useEmailStore } from '../stores/emailStore.js';
import { templateRegistry } from '../../templates/index.js';

const store = useEmailStore();

// Поиск родителя блока по ID
function findParent(blocks, blockId) {
  for (const block of blocks) {
    if (block.children) {
      for (const child of block.children) {
        if (child.id === blockId) return block;
      }
      const found = findParent(block.children, blockId);
      if (found) return found;
    }
  }
  return null;
}

// Определяем тип родителя, в который будем добавлять (технический)
const targetParentType = computed(() => {
  const selected = store.selectedBlock;
  if (!selected) return 'root';
  
  const template = store.templateForBlock(selected);
  if (template?.isContainer) return selected.type;
  
  // Атомарный блок — ищем его родителя
  const parent = findParent(store.document.blocks, selected.id);
  return parent ? parent.type : 'root';
});

// Человекопонятное название целевого родителя
const targetParentTitle = computed(() => {
  const type = targetParentType.value;
  if (type === 'root') return 'корень';
  const tpl = templateRegistry[type];
  return tpl?.title || type;
});

// Определяем, выбран ли атомарный блок (не контейнер)
const isAtomicSelected = computed(() => {
  const selected = store.selectedBlock;
  if (!selected) return false;
  const template = store.templateForBlock(selected);
  return template && !template.isContainer;
});

// Человекопонятное название выбранного блока (для подсказки)
const selectedBlockTitle = computed(() => {
  const selected = store.selectedBlock;
  if (!selected) return '';
  const template = store.templateForBlock(selected);
  return template?.title || selected.type;
});

// Фильтруем доступные шаблоны
const availableTemplates = computed(() => {
  const targetType = targetParentType.value;
  return Object.values(templateRegistry).filter(tpl => {
    if (tpl.isSystem) return false;
    return tpl.allowedParents.includes(targetType);
  });
});

// Группируем по категориям
const groupedTemplates = computed(() => {
  const groups = {
    layout: { title: 'Контейнеры', templates: [] },
    content: { title: 'Контент', templates: [] }
  };
  
  for (const tpl of availableTemplates.value) {
    const category = tpl.category || 'content';
    if (groups[category]) {
      groups[category].templates.push(tpl);
    }
  }
  
  return Object.values(groups).filter(g => g.templates.length > 0);
});

// Добавление блока
function addBlock(type) {
  const selected = store.selectedBlock;
  const template = templateRegistry[type];
  
  if (selected && templateRegistry[selected.type]?.isContainer) {
    store.addBlock(selected.id, type);
  } else {
    const parent = selected ? findParent(store.document.blocks, selected.id) : null;
    store.addBlock(parent?.id || null, type);
  }
}
</script>

<template>
  <div class="palette">
    <h3 class="palette-title">Добавить блок</h3>
    
    <div v-if="!availableTemplates.length" class="palette-empty">
      Нет доступных блоков для этого контекста
    </div>
    
    <div v-for="group in groupedTemplates" :key="group.title" class="palette-group">
      <div class="palette-group-title">{{ group.title }}</div>
      <div class="palette-items">
        <button
          v-for="tpl in group.templates"
          :key="tpl.type"
          class="palette-item"
          @click="addBlock(tpl.type)"
        >
          {{ tpl.title }}
        </button>
      </div>
    </div>
    
    <div v-if="store.selectedBlock" class="palette-context">
      <span class="palette-context-label">Контекст:</span>
      <span class="palette-context-value">{{ targetParentTitle }}</span>
      <span v-if="isAtomicSelected" class="palette-context-hint">
        (рядом с «{{ selectedBlockTitle }}»)
      </span>
    </div>
    <div v-else class="palette-context">
      <span class="palette-context-label">Контекст:</span>
      <span class="palette-context-value">корень</span>
    </div>
  </div>
</template>

<style scoped>
.palette {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.palette-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #1A1230;
  font-weight: 600;
}

.palette-empty {
  color: #999;
  font-size: 13px;
  text-align: center;
  padding: 16px 0;
}

.palette-group {
  margin-bottom: 16px;
}

.palette-group:last-child {
  margin-bottom: 0;
}

.palette-group-title {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  font-weight: 600;
}

.palette-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.palette-item {
  padding: 10px 12px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #1A1230;
  text-align: left;
  transition: all 0.2s;
}

.palette-item:hover {
  background: #FF0F43;
  color: white;
  border-color: #FF0F43;
}

.palette-context {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
  font-size: 12px;
  color: #666;
}

.palette-context-label {
  color: #999;
}

.palette-context-value {
  color: #1A1230;
  font-weight: 500;
  margin-left: 4px;
}

.palette-context-hint {
  color: #999;
  font-style: italic;
  margin-left: 4px;
}
</style>