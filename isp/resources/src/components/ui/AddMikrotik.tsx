import React, {useRef, useState} from "react";
import {usePolling} from "@/hooks/usePolling";
import {api} from "@/utils/api";
import {
    Box,
    Button,
    TextField,
    Typography,
    Stepper,
    Step,
    StepLabel,
    StepIcon,
    Paper,
    IconButton,
    Tooltip,
    Alert,
    CircularProgress,
    useTheme,
    alpha,
    Fade,
    Zoom
} from '@mui/material';
import {
    Close,
    Wifi,
    Memory,
    Router,
    ContentCopy,
    CheckCircle,
    Terminal,
    Info
} from '@mui/icons-material';

type RouterForm = {
    mtkName: string;
    location: string;
    ip: string;
    username: string;
    password: string;
};

interface AddMikrotikModalProps {
    onClose: () => void;
    data: {
        name: string,
        info: any
    };
}

export default function AddMikrotikDevice({onClose, data}: AddMikrotikModalProps) {
    const name = data.name;
    const theme = useTheme();
    const [step, setStep] = useState(0); // Changed to 0-based for MUI Stepper
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<RouterForm>({
        mtkName: name ?? "Mikrotik1",
        location: "",
        ip: "",
        username: "",
        password: ""
    });


    const t_disp = `
<span style='color: #c084fc'>:do</span> {
  <span style='color: #5eead4'>:local</span> <span style='color: #fdba74'>url</span> <span style='color: #93c5fd'>"${
        //@ts-ignore
        data.pvr_url}"</span>;
  <span style='color: #5eead4'>/tool fetch</span> <span style='color: #5eead4'>url=</span><span style='color: #fdba74'>$url</span> <span style='color: #5eead4'>dst-path=</span><span style='color: #fdba74'>${
        //@ts-ignore
        data.rsc_file}</span>;
  <span style='color: #c084fc'>:delay</span> <span style='color: #fdba74'>2s</span>;
  <span style='color: #5eead4'>/import</span> <span style='color: #fdba74'>${
        //@ts-ignore
        data.rsc_file}</span>;
} <span style='color: #5eead4'>on-error=</span> {
  <span style='color: #c084fc'>:put</span> <span style='color: #93c5fd'>"Error occurred during configuration. Check internet and retry."</span>;
}`;
    const terminal_val = {
        //@ts-ignore
        txt: data.script || '',
        display: t_disp,
        error: undefined,
        status: "complete",
    };
    const [terminal, setTerminal] = useState<{
        txt: string; error?: string, display: string; status: '' | 'processing' | 'complete'
        //@ts-ignore
    }>(terminal_val);

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const steps = [
        {
            label: "Connection",
            description: "Basic device information",
            icon: <Wifi/>
        },
        {
            label: "Device Details",
            description: "Provisioning command",
            icon: <Memory/>
        },
        {
            label: "Service Setup",
            description: "Configure PPPoE and Hotspot",
            icon: <Router/>
        }
    ];

    const renderStepContent = () => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{mt: 3}}>
                        {terminal.status !== '' && <TerminalView info={terminal}/>}
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{mt: 3}}>
                        <TextField
                            fullWidth
                            label="Provisioning Command"
                            multiline
                            rows={4}
                            placeholder="Paste provisioning command..."
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '& fieldset': {
                                        borderColor: alpha(theme.palette.primary.main, 0.3),
                                        borderWidth: 2
                                    }
                                }
                            }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                            Paste the command to be run on your Mikrotik to automate setup.
                        </Typography>
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{mt: 3}}>
                        <TextField
                            fullWidth
                            label="PPPoE / Hotspot Setup"
                            multiline
                            rows={4}
                            placeholder="Paste your setup config here..."
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '& fieldset': {
                                        borderColor: alpha(theme.palette.primary.main, 0.3),
                                        borderWidth: 2
                                    }
                                }
                            }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                            Provide your desired PPPoE / Hotspot setup script or details.
                        </Typography>
                    </Box>
                );
            default:
                return null;
        }
    };

    function handleSubmit() {
        setLoading(true);
        if (step === 0) {
            setTerminal(prev => ({...prev, status: 'processing', error: undefined}));
            // api.post<{
            //     error?: string;
            //     script?: string;
            //     pvr_url?: string;
            //     rsc_file?: string;
            // }>({
            //     url: "/api/routers/provision/",
            //     data: {router_name: form.mtkName}
            // })
            //     .then(d => {
            //         if (d.data.error)
            //             return setTerminal(prev => ({...prev, error: d.data.error}));
            //
            //
            //         setLoading(false);
            //     });
        } else {
            nextStep();
            setLoading(false);
        }
    }

    return (
        <Box

            sx={{
                height: '100%',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
            <Paper
                elevation={0}
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    p: 0
                }}
            >
                {/* Header */}


                {/* Content */}
                <Box sx={{flex: 1, p: 1, overflow: 'auto'}}>
                    {/* Stepper */}
                    <Paper
                        sx={{
                            p: 1,
                            mb: 1,
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            background: alpha(theme.palette.background.paper, 0.7)
                        }}
                    >
                        <Stepper
                            activeStep={step}
                            alternativeLabel
                            sx={{
                                '& .MuiStepConnector-line': {
                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                    borderTopWidth: 3
                                },
                                '& .Mui-active .MuiStepConnector-line': {
                                    borderColor: theme.palette.primary.main
                                },
                                '& .Mui-completed .MuiStepConnector-line': {
                                    borderColor: theme.palette.success.main
                                }
                            }}
                        >
                            {steps.map((stepItem, index) => (
                                <Step key={stepItem.label}>
                                    <StepLabel
                                        StepIconComponent={({active, completed}) => (
                                            <Box
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    position: 'relative',
                                                    background: completed ?
                                                        `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.dark} 90%)` :
                                                        active ?
                                                            `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)` :
                                                            alpha(theme.palette.grey[400], 0.3),
                                                    color: 'white',
                                                    boxShadow: active || completed ?
                                                        `0 4px 15px ${alpha(active ? theme.palette.primary.main : theme.palette.success.main, 0.4)}` :
                                                        'none',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                {completed ? (
                                                    <Zoom in={completed}>
                                                        <CheckCircle sx={{fontSize: 24}}/>
                                                    </Zoom>
                                                ) : (
                                                    React.cloneElement(stepItem.icon, {sx: {fontSize: 24}})
                                                )}
                                            </Box>
                                        )}
                                        sx={{
                                            '& .MuiStepLabel-label': {
                                                fontWeight: 600,
                                                color: step === index ? 'primary.main' :
                                                    step > index ? 'success.main' : 'text.secondary'
                                            }
                                        }}
                                    >
                                        <Box sx={{textAlign: 'center'}}>
                                            <Typography variant="subtitle1" sx={{fontWeight: 600}}>
                                                {stepItem.label}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {stepItem.description}
                                            </Typography>
                                        </Box>
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Paper>

                    {/* Form Content */}
                    <Box
                        sx={{
                            p: 2,
                        }}
                    >
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}>
                            <Fade in={true} key={step}>
                                <Box>
                                    {renderStepContent()}
                                </Box>
                            </Fade>

                            {/* Action Buttons */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 4,
                                pt: 3,
                                borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                            }}>
                                <Button
                                    variant="outlined"
                                    onClick={prevStep}
                                    disabled={step === 0}
                                    sx={{
                                        borderRadius: 2,
                                        py: 1,
                                        px: 3,
                                        borderWidth: 2,
                                        fontWeight: 600,
                                        '&:hover': {
                                            borderWidth: 2
                                        }
                                    }}
                                >
                                    Go Back
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        borderRadius: 2,
                                        py: 1,
                                        px: 3,
                                        fontWeight: 600,
                                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                                        boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
                                        '&:hover': {
                                            background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {loading && <CircularProgress size={20} sx={{mr: 1, color: 'white'}}/>}
                                    {step < 2 ? 'Next Step' : 'Finish Setup'}
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}

interface TerminalViewProps {
    info: {
        txt: string;
        display: string;
        status: '' | 'processing' | 'complete';
        error?: string;
    };
}

interface DataItem {
    id: number;
    value: string;
}

const TerminalView: React.FC<TerminalViewProps> = ({info}) => {
    const theme = useTheme();
    const [copied, setCopied] = useState(false);

    const fetchData = async (): Promise<DataItem[]> => {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return response.json();
    };

    usePolling({
        fetchFn: fetchData,
        respectVisibility: true,
        fetchOnMount: true,
        onSuccess: (data) => console.log('Successfully fetched data:', data),
        onError: (error) => console.error('Error fetching data:', error),
        onNetworkError: () => {
        }
    });

    const copyBtnRef = useRef<HTMLButtonElement>(null);

    const handleCopy = () => {
        const compactScript = info.txt.replace(/\s+/g, ' ');

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(compactScript)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch(fallbackCopy);
        } else {
            fallbackCopy();
        }

        function fallbackCopy() {
            try {
                const tempEl = document.createElement("textarea");
                tempEl.value = compactScript;
                tempEl.setAttribute("readonly", "");
                tempEl.style.position = "absolute";
                tempEl.style.left = "-9999px";
                document.body.appendChild(tempEl);

                if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
                    tempEl.contentEditable = String(true);
                    tempEl.readOnly = false;
                    const range = document.createRange();
                    range.selectNodeContents(tempEl);
                    const selection = window.getSelection();
                    selection?.removeAllRanges();
                    selection?.addRange(range);
                    tempEl.setSelectionRange(0, 999999);
                } else {
                    tempEl.select();
                }

                const success = document.execCommand("copy");
                document.body.removeChild(tempEl);

                if (success) {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                } else {
                    alert("Please press Ctrl+C to copy the script");
                }
            } catch {
                prompt("Copy this script manually:", compactScript);
            }
        }
    };

    if (info.status === "complete") {
        return (
            <Paper
                elevation={3}
                sx={{
                    position: 'relative',
                    mt: 3,
                    background: '#151515',
                    color: '#ccc',
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                }}
            >
                <Box sx={{position: 'relative'}}>
                    <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                        <Button
                            ref={copyBtnRef}
                            onClick={handleCopy}
                            variant="contained"
                            size="small"
                            startIcon={<ContentCopy sx={{fontSize: 16}}/>}
                            sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                zIndex: 2,
                                minWidth: 80,
                                borderRadius: 2,
                                background: copied ?
                                    `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.dark} 90%)` :
                                    `linear-gradient(45deg, ${theme.palette.grey[700]} 30%, ${theme.palette.grey[800]} 90%)`,
                                '&:hover': {
                                    background: copied ?
                                        `linear-gradient(45deg, ${theme.palette.success.dark} 30%, ${theme.palette.success.main} 90%)` :
                                        `linear-gradient(45deg, ${theme.palette.grey[600]} 30%, ${theme.palette.grey[700]} 90%)`
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </Button>
                    </Tooltip>

                    <Box sx={{p: 3, pr: 6, fontFamily: 'monospace'}}>
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 3, color: 'white'}}>
                            <Terminal sx={{mr: 1, fontSize: 20}}/>
                            <Typography variant="body1" sx={{fontFamily: 'monospace'}}>
                                Copy and paste this command on your MikroTik Terminal
                            </Typography>
                        </Box>

                        <Box
                            component="pre"
                            sx={{
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-all',
                                m: 0,
                                fontFamily: 'monospace',
                                fontSize: '0.875rem',
                                lineHeight: 1.5
                            }}
                            dangerouslySetInnerHTML={{__html: info.display}}
                        />

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            mt: 3,
                            pt: 2,
                            borderTop: '1px solid #333'
                        }}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, color: 'white'}}>
                                <Typography variant="body2" sx={{fontFamily: 'monospace'}}>
                                    Waiting for connection
                                </Typography>
                                <CircularProgress size={16} sx={{color: theme.palette.warning.main}}/>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        );
    }

    return (
        <Paper
            elevation={2}
            sx={{
                mt: 3,
                p: 2,
                background: '#1a1a1a',
                color: 'white',
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
            }}
        >
            {info.error ? (
                <Alert
                    severity="error"
                    icon={<Info/>}
                    sx={{
                        background: alpha(theme.palette.error.main, 0.1),
                        color: theme.palette.error.main,
                        border: `1px solid ${theme.palette.error.main}`,
                        '& .MuiAlert-icon': {
                            color: theme.palette.error.main
                        }
                    }}
                >
                    {info.error}
                </Alert>
            ) : (
                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <Typography variant="body2" sx={{fontFamily: 'monospace'}}>
                        Creating provision script
                    </Typography>
                    <CircularProgress size={20} sx={{color: theme.palette.primary.main}}/>
                </Box>
            )}
        </Paper>
    );
};