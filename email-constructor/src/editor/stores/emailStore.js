import { defineStore } from 'pinia';
import { templateRegistry } from '../../templates/index.js';

function generateId() {
  return crypto.randomUUID 
    ? crypto.randomUUID() 
    : `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const useEmailStore = defineStore('email', {
  state: () => ({
    document: {
      version: 1,
      meta: {
        subject: 'Тема письма',
        headerVariant: 'white',
        footerVariant: 'default'
      },
      blocks: []
    },
    selectedBlockId: null
  }),

  getters: {
    selectedBlock(state) {
      if (!state.selectedBlockId) return null;

      const findBlock = (blocks) => {
        for (const block of blocks) {
          if (block.id === state.selectedBlockId) return block;
          if (block.children) {
            const found = findBlock(block.children);
            if (found) return found;
          }
        }
        return null;
      };

      return findBlock(state.document.blocks);
    },

    templateForBlock: () => (block) => {
      if (!block) return null;
      return templateRegistry[block.type] || null;
    }
  },

  actions: {
    findBlockById(blocks, blockId) {
      for (const block of blocks) {
        if (block.id === blockId) return block;
        if (block.children) {
          const found = this.findBlockById(block.children, blockId);
          if (found) return found;
        }
      }
      return null;
    },

    addBlock(parentId, type) {
      const template = templateRegistry[type];
      if (!template) {
        console.error(`Шаблон ${type} не найден`);
        return;
      }

      const newBlock = {
        id: generateId(),
        type: type,
        props: {},
        content: '',
        children: template.isContainer ? [] : undefined
      };

      if (template.options) {
        Object.keys(template.options).forEach(key => {
          const option = template.options[key];
          if (option.default !== undefined) {
            newBlock.props[key] = option.default;
          }
        });
      }

      if (parentId === null) {
        this.document.blocks.push(newBlock);
      } else {
        const parent = this.findBlockById(this.document.blocks, parentId);
        if (parent && parent.children) {
          parent.children.push(newBlock);
        }
      }

      this.selectedBlockId = newBlock.id;
    },

    removeBlock(blockId) {
      const removeFromArray = (blocks) => {
        const index = blocks.findIndex(b => b.id === blockId);
        if (index !== -1) {
          blocks.splice(index, 1);
          return true;
        }
        for (const block of blocks) {
          if (block.children && removeFromArray(block.children)) {
            return true;
          }
        }
        return false;
      };

      removeFromArray(this.document.blocks);
      
      if (this.selectedBlockId === blockId) {
        this.selectedBlockId = null;
      }
    },

    moveBlock(blockId, direction) {
      const findAndMove = (blocks) => {
        const index = blocks.findIndex(b => b.id === blockId);
        
        if (index !== -1) {
          if (direction === 'up' && index > 0) {
            [blocks[index - 1], blocks[index]] = [blocks[index], blocks[index - 1]];
            return true;
          }
          if (direction === 'down' && index < blocks.length - 1) {
            [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]];
            return true;
          }
          return false;
        }

        for (const block of blocks) {
          if (block.children && findAndMove(block.children)) {
            return true;
          }
        }
        return false;
      };

      findAndMove(this.document.blocks);
    },

    updateProps(blockId, props) {
      const block = this.findBlockById(this.document.blocks, blockId);
      if (block) {
        block.props = { ...block.props, ...props };
      }
    },

    updateContent(blockId, content) {
      const block = this.findBlockById(this.document.blocks, blockId);
      if (block) {
        block.content = content;
      }
    },

    selectBlock(blockId) {
      this.selectedBlockId = blockId;
    },

    updateMeta(field, value) {
      this.document.meta[field] = value;
    },

    loadDocument(doc) {
      this.document = doc;
      this.selectedBlockId = null;
    }
  }
});