// src/core/parser.js
import { tokens, getBaseStyle } from './tokens.js';

// ---------- Утилиты ----------

/**
 * Экранирует HTML-символы, но НЕ трогает уже готовые валидные сущности,
 * которые мог добавить типограф (например, &nbsp;, &mdash;, &laquo;).
 */
function escapeHtml(str) {
  return str
    // 1. Сначала экранируем угловые скобки (они не могут быть частью сущности)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // 2. Экранируем &, только если за ним НЕ идёт известная HTML-сущность
    .replace(/&(?!amp;|lt;|gt;|quot;|nbsp;|mdash;|ndash;|laquo;|raquo;|hellip;|#\d+;|#x[0-9a-fA-F]+;)/g, '&amp;');
}

// ---------- Инлайн-парсер ----------

/**
 * Преобразует инлайн-разметку внутри одной строки.
 * @param {string} text - исходный текст
 * @param {number} size - размер шрифта для базовых стилей (важно для корректного рендера ссылок)
 */
function parseInline(text, size = tokens.typography.body.size) {
  const baseStyle = getBaseStyle(size);

  // 1. Ссылки [текст](url) -> <a> с полным набором инлайн-стилей
  // Делаем это первым, чтобы содержимое ссылки не было случайно обработано другими правилами
  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    `<a href="$2" style="${baseStyle}">$1</a>`
  );

  // 2. Жирный текст **текст** -> <b>текст</b>
  // Ленивый квантификатор (.+?) гарантирует, что незакрытые ** останутся как есть
  text = text.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

  // 3. Красный текст {red}текст{/red} -> <span> с акцентным цветом
  text = text.replace(
    /\{red\}(.+?)\{\/red\}/g,
    `<span style="color: ${tokens.colors.accent};">$1</span>`
  );

  // 4. Принудительный перенос внутри строки
  text = text.replace(/\{br\}/g, '<br>');

  return text;
}

// ---------- Блочный парсер ----------

/**
 * Классифицирует одну строку текста.
 */
function classifyLine(line) {
  // Заголовки: проверяем ## перед #, чтобы не срезать часть строки
  if (line.startsWith('## ')) return { kind: 'h2', payload: line.slice(3) };
  if (line.startsWith('# ')) return { kind: 'h1', payload: line.slice(2) };
  
  // Маркированный список: строго в начале строки
  if (line.startsWith('- ')) return { kind: 'ul', payload: line.slice(2) };

  // Нумерованный список: цифра + точка + пробел в начале строки
  const olMatch = line.match(/^(\d+)\.\s+(.+)$/);
  if (olMatch) return { kind: 'ol', payload: olMatch[2] };

  // Пустая строка или строка, состоящая только из {br}
  if (line.trim() === '' || line.trim() === '{br}') {
    return { kind: 'br' };
  }

  // Всё остальное — обычный параграф
  return { kind: 'paragraph', payload: line };
}

/**
 * Разбивает текст на блоки, группируя смежные элементы списков.
 */
function buildBlocks(rawText) {
  const lines = rawText.split('\n');
  const blocks = [];
  let currentList = null;

  const flushList = () => {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  };

  for (const rawLine of lines) {
    // Пустая строка = визуальный отступ между блоками
    if (rawLine.trim() === '') {
      flushList();
      blocks.push({ type: 'br' });
      continue;
    }

    // Сначала экранируем HTML, потом классифицируем
    const line = escapeHtml(rawLine);
    const classified = classifyLine(line);

    // Обработка списков
    if (classified.kind === 'ul' || classified.kind === 'ol') {
      // Если тип списка сменился (например, после ul идет ol) — закрываем предыдущий
      if (currentList && currentList.type !== classified.kind) {
        flushList();
      }
      if (!currentList) {
        currentList = { type: classified.kind, items: [] };
      }
      // Элементы списка всегда рендерятся с размером шрифта body (14px)
      const listSize = tokens.typography?.body?.size || 14;
      currentList.items.push(parseInline(classified.payload, listSize));
      continue;
    }

    // Любой не-списочный блок закрывает текущий список
    flushList();

    if (classified.kind === 'br') {
      blocks.push({ type: 'br' });
    } else {
      // Для заголовков и параграфов передаем их размер шрифта, 
      // чтобы ссылки внутри них тоже имели правильный размер
      const typographyConfig = tokens.typography?.[classified.kind];
      const fontSize = typographyConfig?.size || tokens.typography?.body?.size || 14;
      
      blocks.push({
        type: classified.kind,
        content: parseInline(classified.payload, fontSize),
      });
    }
  }

  // Не забываем закрыть список, если он был в конце текста
  flushList();
  return blocks;
}

// ---------- Рендер блоков в HTML ----------

function renderBlocks(blocks) {
  return blocks.map((block) => {
    switch (block.type) {
      case 'h1': {
        const style = getBaseStyle(tokens.typography.h1.size);
        // <br> внутри span, как в вашем примере
        return `<span style="${style}"><b>${block.content}</b><br></span>`;
      }
      case 'h2': {
        const style = getBaseStyle(tokens.typography.h2.size);
        return `<span style="${style}"><b>${block.content}</b><br></span>`;
      }
      case 'paragraph': {
        const style = getBaseStyle(tokens.typography.body.size);
        return `<span style="${style}">${block.content}<br></span>`;
      }
      case 'br':
        // Одиночный <br> между спанами дает "интуитивный" отступ
        return `<br>`;
      case 'ul': {
        const liStyle = getBaseStyle(tokens.typography.body.size);
        const items = block.items.map((i) => `<li style="${liStyle}">${i}</li>`).join('');
        return `<ul style="padding-left: 20px;">${items}</ul>`;
      }
      case 'ol': {
        const liStyle = getBaseStyle(tokens.typography.body.size);
        const items = block.items.map((i) => `<li style="${liStyle}">${i}</li>`).join('');
        return `<ol style="padding-left: 20px;">${items}</ol>`;
      }
      default:
        return '';
    }
  }).join('\n');
}

// ---------- Публичный API ----------

/**
 * Главная функция парсера.
 * Принимает строку с разметкой, возвращает HTML.
 */
export function parse(text) {
  if (typeof text !== 'string') return '';
  if (text.trim() === '') return '';
  
  const blocks = buildBlocks(text);
  return renderBlocks(blocks);
}