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
    Stack,
    Divider,
    IconButton,
    InputAdornment,
} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import AuthLayout from "@/layouts/auth-layout";
import Button from "@/components/auth/Button";

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    terms: boolean;
};

interface RegisterProps {
    status?: string;
    errors?: Record<string, string[]>;
}

export default function Register({status, errors: serverErrors}: RegisterProps) {
    const {data, setData} = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const [processing, setProcessing] = React.useState(false);
    const [errors, setErrors] = React.useState<Record<string, string[]>>(serverErrors || {});
    const [showPassword, setShowPassword] = React.useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = React.useState(false);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await fetch('/auth/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                window.location.href = result.redirect || '/dashboard/';
            } else {
                setErrors(result.errors || {});
            }
        } catch (error) {
            setErrors({ general: ['Network error. Please try again.'] });
        } finally {
            setProcessing(false);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowPasswordConfirmation = () => {
        setShowPasswordConfirmation(!showPasswordConfirmation);
    };

    return (
        <AuthLayout>
            <Head title="Register"/>

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
                        Get started absolutely free
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Already have an account?{' '}
                        <Link
                            href="/auth/login/"
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
                            Sign in
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

                {/* General Error */}
                {errors.general && (
                    <Alert severity="error" sx={{borderRadius: 1.5}}>
                        {errors.general[0]}
                    </Alert>
                )}

                {/* Form */}
                <Box component="form" onSubmit={submit} noValidate>
                    <Stack spacing={3}>
                        <TextField
                            id="name"
                            name="name"
                            type="text"
                            label="Full Name"
                            placeholder="Enter your full name"
                            required
                            fullWidth
                            autoFocus
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name?.[0]}
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
                            id="email"
                            name="email"
                            type="email"
                            label="Email address"
                            placeholder="Enter your email"
                            required
                            fullWidth
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email?.[0]}
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
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password?.[0]}
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

                        <TextField
                            id="password_confirmation"
                            name="password_confirmation"
                            type={showPasswordConfirmation ? 'text' : 'password'}
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            required
                            fullWidth
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            error={!!errors.password_confirmation}
                            helperText={errors.password_confirmation?.[0]}
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPasswordConfirmation}
                                            edge="end"
                                            size="small"
                                        >
                                            {showPasswordConfirmation ? <VisibilityOff/> : <Visibility/>}
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

                        <FormControlLabel
                            control={
                                <Checkbox
                                    id="terms"
                                    name="terms"
                                    checked={data.terms}
                                    onChange={(e) => setData('terms', e.target.checked)}
                                    required
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
                                    I agree to the{' '}
                                    <Link
                                        href="#"
                                        color="primary"
                                        sx={{
                                            color: '#00A76F',
                                            textDecoration: 'none',
                                            fontWeight: 500,
                                            '&:hover': {
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        Terms of Service
                                    </Link>
                                    {' '}and{' '}
                                    <Link
                                        href="#"
                                        color="primary"
                                        sx={{
                                            color: '#00A76F',
                                            textDecoration: 'none',
                                            fontWeight: 500,
                                            '&:hover': {
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        Privacy Policy
                                    </Link>
                                </Typography>
                            }
                        />

                        <Button
                            loading={processing}
                            label={'Create account | Creating account...'}
                        />
                    </Stack>
                </Box>
            </Stack>
        </AuthLayout>
    );
}