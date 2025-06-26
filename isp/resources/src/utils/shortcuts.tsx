import React, {useRef} from "react";
import Signal from "@/lib/Signal";
import {Dialog, DialogContent, Zoom, Backdrop, Grow, SxProps} from "@mui/material";
import ZoomIn from "@/components/ZoomIn"
import CreateClient from "@/components/ui/CreateClient";
import CreatePackage from "@/components/ui/CreatePackage";

interface ModalController {
    close: () => void;
    onClose: (fn: (e: { preventDefault: () => void }) => void) => void;
}

interface ModalProps {
    content: (props: ModalController) => React.ReactNode;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    fullWidth?: boolean;
    disableBackdropClick?: boolean;
    hideBackdrop?: boolean;
    scaleTransition?: boolean;
    sx?: SxProps
}

interface ModalData {
    content: ModalProps["content"];
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    fullWidth?: boolean;
    disableBackdropClick?: boolean;
    hideBackdrop?: boolean;
    scaleTransition?: boolean;
    onCloseCallback?: (e: { preventDefault: () => void }) => void;
}

export function Modal({
                          content,
                          size = "sm",
                          fullWidth = true,
                          disableBackdropClick = false,
                          hideBackdrop = false,
                          scaleTransition = true,
                          sx
                      }: ModalProps): void {

    const modalData: ModalData = {
        content,
        maxWidth: size,
        fullWidth,
        disableBackdropClick,
        hideBackdrop,
        scaleTransition
    };

    Signal.trigger("__modal", ({open, close, cls}: any) => {
        return <Dialog
            open={open}
            onClose={() => {
                close()
            }}
            maxWidth={modalData.maxWidth}
            fullWidth={modalData.fullWidth}
            // disableBackdropClick={modalData.disableBackdropClick}
            hideBackdrop={modalData.hideBackdrop}
            //@ts-ignore
            TransitionComponent={ZoomIn}
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '24px',
                },
            }}
            tabIndex={-1}
            className={cls}
        >
            <DialogContent sx={sx}>
                {modalData.content({
                    close: () => {
                        close()
                    },
                    onClose: (fn) => {
                        modalData.onCloseCallback = fn;
                    }
                })}
            </DialogContent>
        </Dialog>
    });
}


Modal.addClient = function (fn?: () => void) {
    Modal({
        content: m => {
            return <CreateClient onClose={m.close}/>
        },
        size: "md"
    })
}

Modal.addPackage = function (fn?: () => void) {
    Modal({
        content: m => {
            return <CreatePackage onClose={(e: any) => {
                fn?.(e);
                m.close()
            }}/>
        },
        size: "md"
    })
}