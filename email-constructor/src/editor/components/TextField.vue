<script setup>
	import { ref, computed } from 'vue';
	import Typograf from 'typograf';

	const props = defineProps({
		modelValue: { type: String, default: '' },
		placeholder: { type: String, default: '' },
	});

	const emit = defineEmits(['update:modelValue']);

	const tp = new Typograf({ locale: ['ru', 'en-US'] });

	const showSpecialChars = ref(false);

	const localValue = computed({
		get: () => props.modelValue,
		set: (val) => emit('update:modelValue', val),
	});

	const visualizedText = computed(() => {
		if (!props.modelValue) return '';

		// Шаг 1: Экранируем HTML
		let text = props.modelValue
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');

		// Шаг 2: Заменяем Unicode-символы на подсвеченный текст
		// display содержит &amp;nbsp; — браузер покажет текст "&nbsp;", а не неразрывный пробел
		const replacements = [
			{
				pattern: /\u00A0/g,
				display: '&amp;nbsp;',
				title: 'Неразрывный пробел',
			},
			{ pattern: /\u2014/g, display: '&amp;mdash;', title: 'Длинное тире' },
			{ pattern: /\u2013/g, display: '&amp;ndash;', title: 'Короткое тире' },
			{
				pattern: /\u00AB/g,
				display: '&amp;laquo;',
				title: 'Открывающая кавычка',
			},
			{
				pattern: /\u00BB/g,
				display: '&amp;raquo;',
				title: 'Закрывающая кавычка',
			},
			{ pattern: /\u2026/g, display: '&amp;hellip;', title: 'Многоточие' },
		];

		for (const { pattern, display, title } of replacements) {
			text = text.replace(
				pattern,
				`<span class="char" title="${title}">${display}</span>`
			);
		}

		return text;
	});

	function applyTypograf() {
		if (!localValue.value) return;
		const processed = tp.execute(localValue.value);
		localValue.value = processed;
	}
</script>

<template>
  <div class="text-field">
    <textarea
      class="text-field-input"
      v-model="localValue"
      :placeholder="placeholder"
      rows="10"
    ></textarea>

    <div
      v-if="showSpecialChars && modelValue"
      class="special-chars-preview"
      v-html="visualizedText"
    ></div>

    <!-- Подсказка по синтаксису -->
    <div class="text-field-hint">
      <div class="hint-item"><code>**жирный**</code></div>
      <div class="hint-item"><code>[ссылка](url)</code></div>
      <div class="hint-item"><code>{red}текст{/red}</code></div>
      <div class="hint-item"><code>{br}</code></div>
      <div class="hint-item"><code>{nobr}...{/nobr}</code></div>
      <div class="hint-item"><code># Заголовок</code></div>
      <div class="hint-item"><code>## Подзаголовок</code></div>
      <div class="hint-item"><code>- пункт</code></div>
      <div class="hint-item"><code>1. пункт</code></div>
    </div>

    <div class="text-field-actions">
      <button
        type="button"
        class="text-field-toggle-btn"
        :class="{ active: showSpecialChars }"
        @click="showSpecialChars = !showSpecialChars"
        title="Показать/скрыть спецсимволы"
      >
         Спецсимволы
      </button>
      <button
        type="button"
        class="text-field-typo-btn"
        @click="applyTypograf"
      >
        Типограф
      </button>
    </div>
  </div>
</template>

<style scoped>
	.text-field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.text-field-input {
		width: 100%;
		padding: 8px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 13px;
		font-family: inherit;
		resize: vertical;
		box-sizing: border-box;
		line-height: 1.4;
	}

	.text-field-input:focus {
		outline: none;
		border-color: #ff0f43;
	}

	.special-chars-preview {
		padding: 8px;
		border: 1px dashed #ffc107;
		border-radius: 4px;
		background: #fffef5;
		font-size: 13px;
		line-height: 1.6;
		white-space: pre-wrap;
		word-break: break-word;
		color: #1a1230;
		font-family: 'Courier New', Courier, monospace;
	}

	.special-chars-preview .char {
		background: #fff3cd;
		border: 1px solid #ffc107;
		border-radius: 3px;
		padding: 1px 4px;
		font-family: 'Courier New', Courier, monospace;
		font-size: 12px;
		color: #856404;
		cursor: help;
		user-select: all;
	}

	.special-chars-preview .char:hover {
		background: #ffc107;
		color: #1a1230;
	}

  .text-field-hint {
  font-size: 10px;
  color: #999;
  line-height: 1.3;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hint-item {
  display: flex;
  align-items: center;
}

.text-field-hint code {
  background: #f5f5f5;
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 10px;
  color: #666;
}

	.text-field-actions {
		display: flex;
		gap: 6px;
		justify-content: flex-end;
	}

	.text-field-typo-btn,
	.text-field-toggle-btn {
		padding: 4px 10px;
		background: #f5f5f5;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 12px;
		color: #666;
		cursor: pointer;
		white-space: nowrap;
		transition: all 0.2s;
	}

	.text-field-typo-btn:hover {
		background: #ff0f43;
		color: white;
		border-color: #ff0f43;
	}

	.text-field-toggle-btn:hover {
		background: #e0e0e0;
		color: #1a1230;
	}

	.text-field-toggle-btn.active {
		background: #fff3cd;
		border-color: #ffc107;
		color: #856404;
	}
</style>
