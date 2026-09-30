<script setup>
import { computed } from 'vue';
import { useEmailStore } from '../stores/emailStore.js';
import { templateRegistry } from '../../templates/index.js';
import TextField from './TextField.vue';

const store = useEmailStore();

const selectedBlock = computed(() => store.selectedBlock);
const template = computed(() => {
  if (!selectedBlock.value) return null;
  return templateRegistry[selectedBlock.value.type] || null;
});

// Преобразуем options шаблона в массив для удобного рендера
const optionsList = computed(() => {
  if (!template.value?.options) return [];
  return Object.entries(template.value.options).map(([key, opt]) => ({
    key,
    ...opt
  }));
});

/**
 * Получаем текущее значение опции.
 * Для атомарных блоков (не контейнеров) поле content хранится в node.content,
 * а не в node.props.
 */
function getOptionValue(optionKey) {
  const block = selectedBlock.value;
  if (!block) return '';

  if (optionKey === 'content' && !template.value?.isContainer) {
    return block.content || '';
  }

  const propValue = block.props?.[optionKey];
  if (propValue !== undefined) return propValue;

  // Если значения нет — берём default из шаблона
  return template.value?.options?.[optionKey]?.default ?? '';
}

/**
 * Обновляем значение опции.
 * Для content атомарных блоков — вызываем updateContent,
 * для остальных — updateProps.
 */
function updateOption(optionKey, value) {
  const block = selectedBlock.value;
  if (!block) return;

  if (optionKey === 'content' && !template.value?.isContainer) {
    store.updateContent(block.id, value);
    return;
  }

  store.updateProps(block.id, { [optionKey]: value });
}

/**
 * Нормализуем список вариантов для select.
 * Поддерживаем два формата:
 *   - массив строк: ['a', 'b']
 *   - массив объектов: [{ value: 'a', label: 'A' }, ...]
 */
function normalizeSelectOptions(opt) {
  if (!opt.options) return [];
  return opt.options.map(o => {
    if (typeof o === 'string') return { value: o, label: o };
    return o;
  });
}
</script>

<template>
  <div class="inspector">
    <!-- Блок выбран — показываем его опции -->
    <template v-if="selectedBlock && template">
      <h3 class="inspector-title">{{ template.title }}</h3>

      <div v-if="optionsList.length === 0" class="inspector-empty">
        У этого блока нет настраиваемых опций
      </div>

      <div
        v-for="opt in optionsList"
        :key="opt.key"
        class="inspector-field"
      >
        <label class="inspector-label">
          {{ opt.label || opt.key }}
          <span v-if="opt.required" class="inspector-required">*</span>
        </label>

        <!-- text -->
        <input
          v-if="opt.type === 'text'"
          type="text"
          class="inspector-input"
          :value="getOptionValue(opt.key)"
          :placeholder="opt.placeholder || ''"
          @input="updateOption(opt.key, $event.target.value)"
        />

        <!-- textarea -->
        <textarea
          v-else-if="opt.type === 'textarea'"
          class="inspector-input inspector-textarea"
          :value="getOptionValue(opt.key)"
          :placeholder="opt.placeholder || ''"
          rows="4"
          @input="updateOption(opt.key, $event.target.value)"
        ></textarea>

        <!-- richtext -->
        <TextField
          v-else-if="opt.type === 'richtext'"
          :modelValue="getOptionValue(opt.key)"
          :placeholder="opt.placeholder || ''"
          @update:modelValue="updateOption(opt.key, $event)"
        />

        <!-- url -->
        <input
          v-else-if="opt.type === 'url'"
          type="url"
          class="inspector-input"
          :value="getOptionValue(opt.key)"
          placeholder="https://"
          @input="updateOption(opt.key, $event.target.value)"
        />

        <!-- select -->
        <select
          v-else-if="opt.type === 'select'"
          class="inspector-input"
          :value="getOptionValue(opt.key)"
          @change="updateOption(opt.key, $event.target.value)"
        >
          <option
            v-for="o in normalizeSelectOptions(opt)"
            :key="o.value"
            :value="o.value"
          >
            {{ o.label }}
          </option>
        </select>

        <!-- image -->
        <div v-else-if="opt.type === 'image'" class="inspector-image">
          <input
            type="url"
            class="inspector-input"
            :value="getOptionValue(opt.key)"
            placeholder="https://..."
            @input="updateOption(opt.key, $event.target.value)"
          />
          <img
            v-if="getOptionValue(opt.key)"
            :src="getOptionValue(opt.key)"
            class="inspector-image-preview"
            alt="preview"
          />
        </div>

        <!-- boolean -->
        <label v-else-if="opt.type === 'boolean'" class="inspector-checkbox">
          <input
            type="checkbox"
            :checked="getOptionValue(opt.key)"
            @change="updateOption(opt.key, $event.target.checked)"
          />
          <span>{{ opt.checkboxLabel || 'Включено' }}</span>
        </label>

        <!-- number -->
        <input
          v-else-if="opt.type === 'number'"
          type="number"
          class="inspector-input"
          :value="getOptionValue(opt.key)"
          @input="updateOption(opt.key, Number($event.target.value))"
        />

        <!-- fallback -->
        <div v-else class="inspector-unknown">
          Неизвестный тип опции: {{ opt.type }}
        </div>
      </div>
    </template>

    <!-- Блок не выбран -->
    <div v-else class="inspector-placeholder">
      Выберите блок в дереве для редактирования его опций
    </div>
  </div>
</template>

<style scoped>
.inspector {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

.inspector-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #1A1230;
  font-weight: 600;
}

.inspector-empty,
.inspector-placeholder {
  color: #999;
  font-size: 13px;
  text-align: center;
  padding: 16px 0;
}

.inspector-field {
  margin-bottom: 14px;
}

.inspector-field:last-child {
  margin-bottom: 0;
}

.inspector-label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.inspector-required {
  color: #FF0F43;
  margin-left: 2px;
}

.inspector-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}

.inspector-input:focus {
  outline: none;
  border-color: #FF0F43;
}

.inspector-textarea {
  resize: vertical;
  line-height: 1.4;
}

.inspector-image {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.inspector-image-preview {
  max-width: 100%;
  max-height: 120px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  object-fit: contain;
  background: #f5f5f5;
}

.inspector-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #1A1230;
  cursor: pointer;
}

.inspector-checkbox input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.inspector-unknown {
  font-size: 12px;
  color: #FF0F43;
  padding: 6px 8px;
  background: #fff5f7;
  border-radius: 4px;
}
</style>