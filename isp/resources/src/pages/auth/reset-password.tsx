import {Head, useForm} from '@inertiajs/react';
import React, {FormEventHandler} from 'react';
import {
    Box,
    TextField,
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

type ResetPasswordForm = {
    password: string;
    password_confirmation: string;
    uid: string;
    token: string;
};

interface ResetPasswordProps {
    uid?: string;
    token?: string;
    errors?: Record<string, string[]>;
}

export default function ResetPassword({uid, token, errors: serverErrors}: ResetPasswordProps) {
    const {data, setData} = useForm<ResetPasswordForm>({
        password: '',
        password_confirmation: '',
        uid: uid || '',
        token: token || '',
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
            const response = await fetch('/auth/password/reset/confirm/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                    uid: data.uid,
                    token: data.token,
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                window.location.href = result.redirect || '/auth/login/';
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
            <Head title="Reset Password"/>

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
                        Reset your password
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Please enter your new password below.
                    </Typography>
                </Box>

                <Divider/>

                {/* General Error */}
                {errors.general && (
                    <Alert severity="error" sx={{borderRadius: 1.5}}>
                        {errors.general[0]}
                    </Alert>
                )}

                {errors.token && (
                    <Alert severity="error" sx={{borderRadius: 1.5}}>
                        {errors.token[0]}
                    </Alert>
                )}

                {/* Form */}
                <Box component="form" onSubmit={submit} noValidate>
                    <Stack spacing={3}>
                        <TextField
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            label="New Password"
                            placeholder="Enter your new password"
                            required
                            fullWidth
                            autoFocus
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
                            label="Confirm New Password"
                            placeholder="Confirm your new password"
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

                        <Button
                            loading={processing}
                            label={'Reset Password | Resetting...'}
                        />
                    </Stack>
                </Box>

                {/* Footer */}
                <Box sx={{textAlign: 'center'}}>
                    <Typography variant="body2" color="text.secondary">
                        Remember your password?{' '}
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
                            Back to login
                        </Link>
                    </Typography>
                </Box>
            </Stack>
        </AuthLayout>
    );
}