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
} from '@mui/material';
import AuthLayout from "@/layouts/auth-layout";
import Button from "@/components/auth/Button";

type ForgotPasswordForm = {
    email: string;
};

interface ForgotPasswordProps {
    status?: string;
    errors?: Record<string, string[]>;
}

export default function ForgotPassword({status, errors: serverErrors}: ForgotPasswordProps) {
    const {data, setData} = useForm<ForgotPasswordForm>({
        email: '',
    });

    const [processing, setProcessing] = React.useState(false);
    const [errors, setErrors] = React.useState<Record<string, string[]>>(serverErrors || {});
    const [successMessage, setSuccessMessage] = React.useState(status || '');

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await fetch('/auth/password/reset/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    email: data.email,
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                setSuccessMessage(result.message || 'Password reset email sent!');
            } else {
                setErrors(result.errors || {});
            }
        } catch (error) {
            setErrors({ general: ['Network error. Please try again.'] });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AuthLayout>
            <Head title="Forgot Password"/>

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
                        Forgot your password?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        No problem. Just let us know your email address and we will email you a password reset link.
                    </Typography>
                </Box>

                <Divider/>

                {/* Status Alert */}
                {successMessage && (
                    <Alert
                        severity="success"
                        sx={{borderRadius: 1.5}}
                    >
                        {successMessage}
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
                            id="email"
                            name="email"
                            type="email"
                            label="Email address"
                            placeholder="Enter your email"
                            required
                            fullWidth
                            autoFocus
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

                        <Button
                            loading={processing}
                            label={'Send Password Reset Link | Sending...'}
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