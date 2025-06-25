import {Head, useForm} from '@inertiajs/react';
import React, {FormEventHandler} from 'react';
import {
    Box,
    TextField,
    Typography,
    Alert,
    Stack,
    Divider,
    IconButton,
    InputAdornment,
} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import AuthLayout from "@/layouts/auth-layout";
import Button from "@/components/auth/Button";

type ConfirmPasswordForm = {
    current_password: string;
    password: string;
    password_confirmation: string;
};

interface ConfirmPasswordProps {
    user?: {
        name: string;
        email: string;
    };
    errors?: Record<string, string[]>;
}

export default function ConfirmPassword({user, errors: serverErrors}: ConfirmPasswordProps) {
    const {data, setData} = useForm<ConfirmPasswordForm>({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [processing, setProcessing] = React.useState(false);
    const [errors, setErrors] = React.useState<Record<string, string[]>>(serverErrors || {});
    const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const response = await fetch('/auth/change-password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    current_password: data.current_password,
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                setSuccessMessage(result.message || 'Password changed successfully!');
                setData('current_password', '');
                setData('password', '');
                setData('password_confirmation', '');
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
            <Head title="Change Password"/>

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
                        Change Password
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Update your password to keep your account secure.
                    </Typography>
                </Box>

                <Divider/>

                {/* Success Message */}
                {successMessage && (
                    <Alert severity="success" sx={{borderRadius: 1.5}}>
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
                            id="current_password"
                            name="current_password"
                            type={showCurrentPassword ? 'text' : 'password'}
                            label="Current Password"
                            placeholder="Enter your current password"
                            required
                            fullWidth
                            autoFocus
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            error={!!errors.current_password}
                            helperText={errors.current_password?.[0]}
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            edge="end"
                                            size="small"
                                        >
                                            {showCurrentPassword ? <VisibilityOff/> : <Visibility/>}
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
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            label="New Password"
                            placeholder="Enter your new password"
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
                                            onClick={() => setShowPassword(!showPassword)}
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
                                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
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
                            label={'Update Password | Updating...'}
                        />
                    </Stack>
                </Box>
            </Stack>
        </AuthLayout>
    );
}