// Login.tsx - Updated login component
import {Head, useForm} from '@inertiajs/react';
import React, {FormEventHandler} from 'react';
import {
    Box,
    TextField,
    Checkbox,
    FormControlLabel,
    Typography,
    Link,
    Alert,
    CircularProgress,
    Stack,
    Divider,
    IconButton,
    InputAdornment,
} from '@mui/material';
import {Visibility, VisibilityOff, Info} from '@mui/icons-material';
import {styled} from '@mui/material/styles';
import AuthLayout from "@/layouts/auth-layout";
import Button from "@/components/auth/Button";
import {api} from "@/utils/api";
import {ROUTES} from "@/utils/routes";
// import AuthLayout from "../../layouts/auth-layout";
// import AuthSplitLayout from "@/layouts/auth/auth-split-layout";

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

const DemoAlert = styled(Alert)(({theme}) => ({
    backgroundColor: 'rgba(0, 167, 111, 0.08)',
    color: '#00A76F',
    border: '1px solid rgba(0, 167, 111, 0.2)',
    borderRadius: theme.spacing(1.5),
    '& .MuiAlert-icon': {
        color: '#00A76F',
    },
}));

export default function Login({status, canResetPassword}: LoginProps) {
    const {data, setData, errors} = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const [processing, setProcessing] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const [showPassword, setShowPassword] = React.useState(false);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);

        try {
            const response = await fetch('/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    remember: data.remember,
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                window.location.href = result.redirect || '/dashboard/';
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <AuthLayout>
            <Head title="Log in"/>

            <Stack spacing={3}>
                {/* Header */}
                <Box>
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 1,
                            fontWeight: 600,
                            color: 'text.primary'
                        }}
                    >
                        Sign in to your account
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Don't have an account?{' '}
                        <Link
                            href="/auth/register/"
                            color="primary"
                            sx={{
                                textDecoration: 'none',
                                fontWeight: 500,
                                color: '#00A76F',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            Get started
                        </Link>
                    </Typography>
                </Box>

                <Divider/>

                {/* Status Alert */}
                {status && (
                    <Alert
                        severity="success"
                        sx={{borderRadius: 1.5}}
                    >
                        {status}
                    </Alert>
                )}

                {/* Form */}
                <Box component="form" onSubmit={submit} noValidate>
                    <Stack spacing={3}>
                        <TextField
                            id="email"
                            name="email"
                            type="email"
                            label="Email address"
                            placeholder="Enter your email"
                            required
                            fullWidth
                            autoFocus
                            autoComplete="off"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1.5,
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#00A76F',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#00A76F',
                                },
                            }}
                        />

                        <TextField
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            placeholder="Enter your password"
                            required
                            fullWidth
                            autoComplete={"off"}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            size="small"
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1.5,
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#00A76F',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#00A76F',
                                },
                            }}
                        />

                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        sx={{
                                            color: '#00A76F',
                                            '&.Mui-checked': {
                                                color: '#00A76F',
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Typography variant="body2">
                                        Remember me
                                    </Typography>
                                }
                            />

                            {canResetPassword && (
                                <Link
                                    href="/auth/password/reset/"
                                    variant="body2"
                                    sx={{
                                        color: '#00A76F',
                                        textDecoration: 'none',
                                        fontWeight: 500,
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </Box>
                        {
                            error && (
                                <>
                                    {/*error*/}
                                    <Typography variant="body2" color="error">
                                        {error}
                                    </Typography>
                                </>
                            )
                        }
                        <Button
                            loading={processing}
                            label={'Sign in | Signing in...'}/>
                    </Stack>
                </Box>
            </Stack>
        </AuthLayout>
    );
}