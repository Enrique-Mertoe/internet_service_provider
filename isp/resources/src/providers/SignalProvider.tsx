/**
 * Project: F2Net
 * File: SignalProvider.tsx
 * Author: Mike Miller
 * Created: 2025-06-26
 * Description: Manages a modal stack using global Signal triggers to pause/resume UI layers.
 *
 * © 2025 Mike Miller. All rights reserved.
 */

import Signal from "@/lib/Signal";
import React, {ReactNode, useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";

type ModalEntry = {
    id: string;
    element: ReactNode;
};
const tree: ModalEntry[] = []
export default function SignalProvider() {
    const [modals, setModals] = useState<ModalEntry[]>([]);
    useEffect(() => {
        const h1 = (content: React.FC<{ close: any }>) => {
            const id = uuidv4();
            Signal.trigger("__modal:pause")
            const modal: ModalEntry = {
                id,
                element: (<ModalProvider cont={content} id={id} onClose={() => {
                    //take last on an array
                    tree.pop()
                    const prev = tree?.[tree.length - 1];
                    Signal.trigger("__modal:resume", prev?.id)
                    setTimeout(() => {

                        setModals((prev) => prev.filter((m) => m.id !== id));
                    }, 200);
                }}/>)
            }
            tree.push(modal)
            setModals(prev => ([...prev, modal]));
        }
        Signal.on("__modal", h1);

        return () => {
            Signal.off("__modal", h1);
        };
    }, []);

    return (
        <>
            {modals.map(({id, element}) => (
                <React.Fragment key={id}>{element}</React.Fragment>
            ))}
        </>
    );
}

const ModalProvider = ({onClose, cont: Content, id}: any) => {
    const [open, setOpen] = useState(true);
    const [pause, setPause] = useState(false);
    useEffect(() => {
        const h1 = () =>
            setPause(true);
        const h2 = (id2: any) => {
            if (id === id2)
                setPause(false)
        }
        Signal.on("__modal:pause", h1);
        Signal.on("__modal:resume", h2)
        return () => {
            Signal.off("__modal:pause", h1);
            Signal.off("__modal:resume", h2);
        }
    }, [id]);
    return (
        <Content cls={pause ? "opacity-0" : ""} open={open} close={() => {
            setOpen(false)
            onClose()
        }}/>
    )
}