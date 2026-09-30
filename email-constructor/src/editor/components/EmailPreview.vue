<template>
	<div class="email-preview">
		<div class="preview-header">
			<h3>Превью письма</h3>
		</div>
		<div class="preview-frame">
			<iframe
				:srcdoc="htmlContent"
				class="preview-iframe"
				title="Превью письма"
			></iframe>
		</div>
	</div>
</template>

<script setup>
	import { computed } from 'vue';
	import { storeToRefs } from 'pinia';
	import { useEmailStore } from '../stores/emailStore.js';
	import { renderEmail } from '../../core/renderer.js';

	const store = useEmailStore();
	const { document: doc } = storeToRefs(store);

	const htmlContent = computed(() => {
		try {
			return renderEmail(doc.value);
		} catch (error) {
			console.error('[EmailPreview] Ошибка рендеринга:', error);
			return `<html><body><p style="color:red;padding:20px;font-family:Arial,sans-serif;">Ошибка рендеринга: ${error.message}</p></body></html>`;
		}
	});
</script>

<style scoped>
	.email-preview {
		display: flex;
		flex-direction: column;
		height: 100%;
        width: 100%;  
	}

	.preview-header {
		padding: 12px 16px;
		background: #fff;
		border-bottom: 1px solid #e0e0e0;
		flex-shrink: 0;
	}

	.preview-header h3 {
		margin: 0;
		font-size: 14px;
		font-weight: 600;
		color: #1a1230;
	}

	.preview-frame {
		flex: 1;
		min-height: 0;
		overflow: hidden;
		padding: 0px;
		background: #e8e8e8;
	}

	.preview-iframe {
		width: 100%;
		height: 100%;
		border: none;
		background: #fff;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
</style>