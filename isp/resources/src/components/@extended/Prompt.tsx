import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {GuardedPromise} from "@/lib/utils";
import {Modal} from "@/utils/shortcuts";
import {LoadingButton} from "@mui/lab";
import {Typography} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

type PromptOptions<T> = {
    onSubmit?: (value: string) => (T | Promise<T>),
    label?: string;
}

const prompt = function <T>(title?: string, message?: string,
                            options?: PromptOptions<T>
) {
    return GuardedPromise(() => {
        return new Promise<T | null>((resolve) => {
            const mc: { close: () => void; setLoading?: (v: boolean) => void, sE?: any } = {
                close: () => {
                }
            };

            const subMitFn = options?.onSubmit ?? (async v => v as T)
            Modal({
                size: "xs",
                content: function Content(m) {
                    mc.close = m.close;
                    const [loading, setLoading] = React.useState(false);
                    const [error, sE] = React.useState('');
                    mc.setLoading = setLoading;
                    //@ts-ignore
                    mc.sE = sE;
                    return (
                        <>
                            <DialogTitle sx={{p: 0}}>{title}</DialogTitle>
                            {
                                message && (
                                    <DialogContentText>
                                        {message}
                                    </DialogContentText>
                                )
                            }
                            <TextField
                                autoFocus
                                required
                                autoComplete={"off"}
                                margin="dense"
                                id="promp-input"
                                name="input"
                                label={options?.label ?? "Enter your Input"}
                                type="text"
                                fullWidth
                                variant="standard"
                            />
                            {/*Error show*/}
                            {
                                error && (
                                    <Typography color="error" className={"flex capitalize mt-2 items-start text-xs gap-1"}
                                                sx={{display: 'nonde'}}>
                                        <ErrorIcon sx={{fontSize: '1rem'}}/>
                                        {error}
                                    </Typography>
                                )
                            }
                            <DialogActions>
                                <Button

                                    onClick={() => {
                                        m.close()
                                        resolve(null)
                                    }
                                    }>Cancel</Button>
                                <LoadingButton
                                    loading={loading}
                                    type="submit">Continue</LoadingButton>
                            </DialogActions>
                        </>
                    )
                },
                slotProps: {
                    paper: {
                        component: 'form',
                        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            mc.setLoading?.(true);
                            mc.sE('');
                            try {
                                const formData = new FormData(event.currentTarget);
                                const formJson = Object.fromEntries((formData as any).entries());
                                const input = formJson.input;
                                const res = await subMitFn(input)
                                mc?.close()
                                resolve(res)
                            } catch (e) {
                                //@ts-ignore
                                mc.sE(e instanceof Error ? (e?.message ?? "Something went wrong!") : String(e))
                            } finally {
                                mc.setLoading?.(false)
                            }
                        },
                    },
                }
            })
        })
    })
}

export default prompt;
