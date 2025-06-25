import "vite/modulepreload-polyfill";
import {createRoot} from 'react-dom/client';
import {createInertiaApp} from "@inertiajs/react";
import {resolvePageComponent} from "./helpers";
import "@/css/main.css"
import {BrowserRouter} from "react-router-dom";

createInertiaApp({
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({el, App, props}) {
        createRoot(el).render((<BrowserRouter>
            <>
                <App {...props} />
                {/*<LocationHandler />*/}
            </>
        </BrowserRouter>));
    },
    progress: {
        color: '#4B5563'
    }
}).then(() => {
});
