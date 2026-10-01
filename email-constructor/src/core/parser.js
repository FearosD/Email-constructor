// src/core/parser.js
import { tokens, getBaseStyle } from './tokens.js';

// ---------- Утилиты ----------
function escapeHtml(str) {
  return str
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/&(?!amp;|lt;|gt;|quot;|nbsp;|mdash;|ndash;|laquo;|raquo;|hellip;|#\d+;|#x[0-9a-fA-F]+;)/g, '&');
}

// ---------- Инлайн-парсер ----------
function parseInline(text, size = tokens.typography.body.size) {
  const baseStyle = getBaseStyle(size);
  
  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    `<a href="$2" style="${baseStyle}">$1</a>`
  );
  
  text = text.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  
  text = text.replace(
    /\{red\}(.+?)\{\/red\}/g,
    `<span style="color: ${tokens.colors.accent};">$1</span>`
  );
  
  text = text.replace(/\{nobr\}(.+?)\{\/nobr\}/g, '<nobr>$1</nobr>');
  
  text = text.replace(/\{br\}/g, '<br>');
  
  return text;
}

// ---------- Блочный парсер ----------
function classifyLine(line) {
  if (line.startsWith('## ')) return { kind: 'h2', payload: line.slice(3) };
  if (line.startsWith('# ')) return { kind: 'h1', payload: line.slice(2) };
  if (line.startsWith('- ')) return { kind: 'ul', payload: line.slice(2) };
  
  const olMatch = line.match(/^(\d+)\.\s+(.+)$/);
  if (olMatch) return { kind: 'ol', number: olMatch[1], payload: olMatch[2] };
  
  if (line.trim() === '' || line.trim() === '{br}') {
    return { kind: 'br' };
  }
  
  return { kind: 'paragraph', payload: line };
}

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
    if (rawLine.trim() === '') {
      flushList();
      blocks.push({ type: 'br' });
      continue;
    }
    
    const line = escapeHtml(rawLine);
    const classified = classifyLine(line);
    
    if (classified.kind === 'ul' || classified.kind === 'ol') {
      if (currentList && currentList.type !== classified.kind) {
        flushList();
      }
      if (!currentList) {
        currentList = { type: classified.kind, items: [] };
      }
      
      const listSize = tokens.typography?.body?.size || 14;
      const parsedText = parseInline(classified.payload, listSize);
      
      // Для нумерованного списка сохраняем номер
      if (classified.kind === 'ol') {
        currentList.items.push({
          number: classified.number,
          text: parsedText
        });
      } else {
        currentList.items.push(parsedText);
      }
      continue;
    }
    
    flushList();
    
    if (classified.kind === 'br') {
      blocks.push({ type: 'br' });
    } else {
      const typographyConfig = tokens.typography?.[classified.kind];
      const fontSize = typographyConfig?.size || tokens.typography?.body?.size || 14;
      blocks.push({
        type: classified.kind,
        content: parseInline(classified.payload, fontSize),
      });
    }
  }
  
  flushList();
  return blocks;
}

// ---------- Рендер блоков в HTML ----------

// Рендер маркированного списка (таблица)
function renderUlTable(items) {
  const markerStyle = `font: 18px ${tokens.fontFamily}; color: ${tokens.colors.text}; line-height: 20px; -webkit-text-size-adjust:none;`;
  const textStyle = `text-align: left; font: ${tokens.typography.body.size}px ${tokens.fontFamily}; color: ${tokens.colors.text}; line-height: ${tokens.typography.body.lineHeight}; -webkit-text-size-adjust:none;`;
  
  const rows = items.map((text) => `
    <tr>
      <td align="center" valign="top" width="20" style="padding:0 0 0 0; border-collapse:collapse">
        <span style="${markerStyle}">&nbsp;•&nbsp;</span>
      </td>
      <td valign="top" align="left">
        <span style="${textStyle}">${text}<br></span>
      </td>
    </tr>
  `).join('');
  
  return `
    <table style="padding: 0; text-align: left; margin: 0 auto; border-spacing: 0; border-collapse: collapse; overflow: hidden;" border="0" width="100%" cellspacing="0" cellpadding="0">
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

// Рендер нумерованного списка (таблица)
function renderOlTable(items) {
  const markerStyle = `text-align: center; font: ${tokens.typography.body.size}px ${tokens.fontFamily}; color: ${tokens.colors.text}; line-height: ${tokens.typography.body.lineHeight}; -webkit-text-size-adjust:none;`;
  const textStyle = `text-align: left; font: ${tokens.typography.body.size}px ${tokens.fontFamily}; color: ${tokens.colors.text}; line-height: ${tokens.typography.body.lineHeight}; -webkit-text-size-adjust:none;`;
  
  const rows = items.map((item) => `
    <tr>
      <td align="center" valign="top" width="20" style="padding:0 0 0 0; border-collapse:collapse">
        <span style="${markerStyle}">${item.number}.</span>
      </td>
      <td valign="top" align="left">
        <span style="${textStyle}">${item.text}<br></span>
      </td>
    </tr>
  `).join('');
  
  return `
    <table style="padding: 0; text-align: left; margin: 0 auto; border-spacing: 0; border-collapse: collapse; overflow: hidden;" border="0" width="100%" cellspacing="0" cellpadding="0">
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function renderBlocks(blocks) {
  return blocks.map((block) => {
    switch (block.type) {
      case 'h1': {
        const style = getBaseStyle(tokens.typography.h1.size);
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
        return `<br>`;
      case 'ul':
        return renderUlTable(block.items);
      case 'ol':
        return renderOlTable(block.items);
      default:
        return '';
    }
  }).join('\n');
}

// ---------- Публичный API ----------
export function parse(text) {
  if (typeof text !== 'string') return '';
  if (text.trim() === '') return '';
  const blocks = buildBlocks(text);
  return renderBlocks(blocks);
}