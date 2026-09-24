// src/core/context.js
import { tokens } from './tokens.js';

/**
 * Создаёт начальный контекст для корневого уровня рендеринга
 * @returns {Object} Начальный контекст
 */
export function getInitialContext() {
  return {
    depth: 0,
    contentWidth: 500,       // Доступная ширина контента (600 - 50*2)
    parentType: 'root',      // Тип родительского блока
    tokens: tokens           // Ссылка на дизайн-токены
  };
}

/**
 * Строит контекст рендеринга для дочернего блока на основе родительского
 * @param {Object} parentContext - Контекст родительского блока
 * @param {string} blockType - Тип текущего (дочернего) блока
 * @returns {Object} Новый контекст для дочернего блока
 */
export function buildContext(parentContext, blockType) {
  // Увеличиваем уровень вложенности на 1
  const newDepth = parentContext.depth + 1;
  
  // Уменьшаем доступную ширину на базовый отступ с двух сторон
  // Math.max гарантирует, что ширина не уйдёт в отрицательные значения
  const spacingReduction = parentContext.tokens.spacing * 2;
  const newWidth = Math.max(0, parentContext.contentWidth - spacingReduction);
  
  return {
    depth: newDepth,
    contentWidth: newWidth,
    parentType: blockType,
    tokens: parentContext.tokens
  };
}