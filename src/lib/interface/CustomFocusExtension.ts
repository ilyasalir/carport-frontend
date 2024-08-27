import { Extension } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';

const CustomFocusExtension = Extension.create({
  name: 'customFocus',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            focus: (view) => {
              view.dom.classList.add('tiptap-focused');
              return false; // Return false to allow default behavior
            },
            blur: (view) => {
              view.dom.classList.remove('tiptap-focused');
              return false; // Return false to allow default behavior
            },
          },
        },
      }),
    ];
  },

  addGlobalStyle() {
    return `
      .tiptap-focused {
        border: 2px solid blue; /* Example focus style */
        outline: none; /* Remove default outline */
      }
    `;
  },
});

export default CustomFocusExtension;
