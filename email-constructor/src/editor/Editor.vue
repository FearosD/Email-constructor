<script setup>
	import { onMounted } from 'vue';
	import { useEmailStore } from './stores/emailStore.js';
	import { testDocument } from './testDocument.js';
	import BlockTree from './components/BlockTree.vue';
	import BlockPalette from './components/BlockPalette.vue';
	import ExportPanel from './components/ExportPanel.vue';
	import BlockInspector from './components/BlockInspector.vue';
	import EmailPreview from './components/EmailPreview.vue';

	const store = useEmailStore();

	onMounted(() => {
		store.loadDocument(testDocument);
	});
</script>

<template>
	<div class="editor">
		<div class="editor-layout">
			<div class="editor-sidebar">
				<BlockPalette />
				<BlockTree />
			</div>
			<div class="editor-main">
				<EmailPreview />
			</div>
			<div class="editor-right-panel">
				<div class="meta-editor">
					<h3>Настройки письма</h3>
					<div class="meta-field">
						<label>Тема:</label>
						<input
							type="text"
							:value="store.document.meta.subject"
							@input="store.updateMeta('subject', $event.target.value)" />
					</div>
					<div class="meta-field">
						<label>Вариант шапки:</label>
						<select
							:value="store.document.meta.headerVariant"
							@change="store.updateMeta('headerVariant', $event.target.value)">
							<option value="white">Белая</option>
							<option value="red">Красная</option>
						</select>
					</div>
				</div>

				<BlockInspector />

				<ExportPanel />
			</div>
		</div>
	</div>
</template>

<style scoped>
	.editor {
		width: 100%;
		height: 100vh;
		background-color: #f5f5f5;
		overflow: hidden;
	}

	.editor-layout {
		display: flex;
		height: 100%;
		gap: 16px;
		padding: 16px;
		box-sizing: border-box;
		overflow: hidden;
	}

	.editor-sidebar {
		width: 320px;
		flex-shrink: 0;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	/* Палитра: не сжимается, скроллится если длинная, но не больше 45% высоты */
	.editor-sidebar > :first-child {
		flex-shrink: 0;
		overflow-y: auto;
		max-height: 45%;
	}

	/* Дерево: занимает всё оставшееся пространство */
	.editor-sidebar > :last-child {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
	}

	.editor-main {
    flex: 1;
    min-height: 0;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    display: flex;
    overflow: hidden;
}

	.editor-right-panel {
		width: 360px;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: 16px;
		height: 100%;
		overflow-y: auto;
	}

	/* Инспектор занимает всё свободное место, скроллится при необходимости */
	.editor-right-panel > .inspector {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
	}

	.meta-editor {
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 16px;
	}

	.meta-editor h3 {
		margin: 0 0 16px 0;
		font-size: 16px;
		color: #1a1230;
		font-weight: 600;
	}

	.meta-field {
		margin-bottom: 12px;
	}

	.meta-field label {
		display: block;
		font-size: 13px;
		color: #666;
		margin-bottom: 4px;
	}

	.meta-field input,
	.meta-field select {
		width: 100%;
		padding: 8px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 14px;
		box-sizing: border-box;
	}

	.meta-field input:focus,
	.meta-field select:focus {
		outline: none;
		border-color: #ff0f43;
	}
</style>
