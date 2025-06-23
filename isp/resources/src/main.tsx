import "vite/modulepreload-polyfill";
import {createRoot} from 'react-dom/client';
import {createInertiaApp} from "@inertiajs/react";
import {resolvePageComponent} from "./helpers";

// createInertiaApp({
//     resolve: (name) => {
//         return resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'))
//     },
//     setup({el, App, props}) {
//         const root = createRoot(el);
//         console.log('ert');
//         root.render(<App {...props} />);
//     },
//     progress: {
//         color: '#4B5563'
//     }
// }).then();
document.addEventListener('DOMContentLoaded', () => {
  createInertiaApp({
    resolve: (name) => {
      const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
      return pages[`./pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
      createRoot(el).render(<App {...props} />);
    }
  }).then(() => {});
});
