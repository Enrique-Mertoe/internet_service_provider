import "vite/modulepreload-polyfill";
import {createRoot} from 'react-dom/client';
import {createInertiaApp} from "@inertiajs/react";
import {resolvePageComponent} from "./helpers";
import "@/css/main.css"
import {BrowserRouter} from "react-router-dom";
import SignalProvider from "@/providers/SignalProvider";
//@ts-ignore
import ThemeCustomization from "@/themes"
import "@fontsource/orbitron/700.css"



createInertiaApp({
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({el, App, props}) {
        createRoot(el).render((<BrowserRouter>
            <ThemeCustomization>
                <App {...props} />
                {/*<LocationHandler />*/}
                <SignalProvider/>
            </ThemeCustomization>
        </BrowserRouter>));
    },
    progress: {
        color: '#4B5563'
    }
}).then(() => {
});
