import React, {useRef} from "react";
import Signal from "@/lib/Signal";
import {
    Dialog,
    DialogContent,
    Zoom,
    Backdrop,
    Grow,
    SxProps,
    DialogTitle,
    Box,
    Typography,
    IconButton,
    alpha,
    useTheme, useMediaQuery, DialogProps,
    Theme
} from "@mui/material";
import ZoomIn from "@/components/ZoomIn"
import CreateClient from "@/components/ui/CreateClient";
import CreatePackage from "@/components/ui/CreatePackage";
import AddMikrotikDevice from "@/components/ui/AddMikrotik";
import Draggable from 'react-draggable';
import Paper, {PaperProps} from '@mui/material/Paper';
import {Close, Router} from "@mui/icons-material";
import prompt from "@/components/@extended/Prompt";
import devices from "@/api/controllers/equipment-controller";

interface ModalController {
    close: () => void;
    onClose: (fn: (e: { preventDefault: () => void }) => void) => void;
}

type ModalProps = {
    content: (props: ModalController) => React.ReactNode;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    fullWidth?: boolean;
    disableBackdropClick?: boolean;
    hideBackdrop?: boolean;
    scaleTransition?: boolean;
    sx?: SxProps<Theme>,
    header?: React.FC,

} & Omit<Partial<DialogProps>, 'content'>;

interface ModalData {
    content: ModalProps["content"];
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    fullWidth?: boolean;
    disableBackdropClick?: boolean;
    hideBackdrop?: boolean;
    scaleTransition?: boolean;
    onCloseCallback?: (e: { preventDefault: () => void }) => void;
}

function DragablePaperComponent(props: PaperProps) {
    const nodeRef = React.useRef<HTMLDivElement>(null);
    return (
        <Draggable
            nodeRef={nodeRef as React.RefObject<HTMLDivElement>}
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} ref={nodeRef}/>
        </Draggable>
    );
}

export function Modal({
                          content,
                          size = "sm",
                          fullWidth = true,
                          disableBackdropClick = false,
                          hideBackdrop = false,
                          scaleTransition = true,
                          sx,
                          header,
                          ...extra
                      }: ModalProps): void {

    const modalData: ModalData = {
        content,
        maxWidth: size,
        fullWidth,
        disableBackdropClick,
        hideBackdrop,
        scaleTransition
    };

    Signal.trigger("__modal", function Callback({open, close, cls}: any) {
        const theme = useTheme();
        const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

        return <Dialog
            open={open}
            onClose={() => {
                close()
            }}
            fullScreen={fullScreen}
            maxWidth={modalData.maxWidth}
            fullWidth={modalData.fullWidth}
            // disableBackdropClick={modalData.disableBackdropClick}
            hideBackdrop={modalData.hideBackdrop}
            //@ts-ignore
            TransitionComponent={ZoomIn}
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: {
                        sm: '24px'
                    },
                },
            }}
            PaperComponent={DragablePaperComponent}
            tabIndex={-1}
            className={cls}
            {...extra}
        >   {
            //@ts-ignore
            header?.({close})}
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

Modal.addMikrotik = async function (fn?: () => void) {
    const data = await prompt<{ info: any, name: string }>(
        "Name Of Your Mikrotik Device",
        "This name will serve as the device's identity — you can verify it on your Mikrotik under **System → Identity**.",
        {
            async onSubmit(v) {
                const data = await devices.provision(v);
                if (!data) {
                    throw "Failed to setup Mikrotik device. Please try again.";
                }
                if (!data.ok)
                    throw data.error;
                console.log(data)
                const {ok, ...info} = data;
                return {name: v, ...info};
            },
            label: "Mikrotik Device Name",
        }
    );

    if (!data) return;
    Modal({
        content: m => {
            return <AddMikrotikDevice data={data} onClose={(e: any) => {
                fn?.(e);
                m.close()
            }}/>
        },
        size: "md",
        sx: {p: 0},
        header: function Header({...props}: any) {
            const theme = useTheme();
            return (<DialogTitle sx={{p: 0}} style={{cursor: 'move'}} id="draggable-dialog-title">
                <Box sx={{
                    px: 2, py: 1,
                    borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    background: `black`,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -30,
                            right: -30,
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            background: alpha('#fff', 0.1),
                            zIndex: 0
                        }}
                    />

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <Box>
                            <div className="flex gap-2 items-start">
                                <Router sx={{fontSize: 32}}/>
                                <div className={"flex flex-col gap-2"}>
                                    <Typography variant="h4" sx={{fontWeight: 700, mb: 0.5}}>
                                        Mikrotik SetUp Wizard
                                    </Typography>
                                    <Typography variant="body1" component="p" sx={{opacity: 0.9}}>
                                        Connect{" "}
                                        <Typography
                                            color="primary"
                                            component="span"
                                            variant="body1"
                                            className={"capitalize"}
                                            sx={{fontWeight: 700, mb: 0.5, display: "inline"}} // important
                                        >
                                            {name}
                                        </Typography>{" "}
                                        router to enable automated management
                                    </Typography>

                                </div>
                            </div>
                        </Box>
                        <IconButton
                            onClick={props?.close}
                            sx={{
                                color: 'white',
                                bgcolor: alpha('#fff', 0.2),
                                '&:hover': {
                                    bgcolor: alpha('#fff', 0.3),
                                    transform: 'rotate(90deg)'
                                },
                                transition: 'all 0.3s ease',
                                borderRadius: "50%"
                            }}
                        >
                            <Close/>
                        </IconButton>
                    </Box>
                </Box>
            </DialogTitle>)
        }
    })
}