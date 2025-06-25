import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import {
    Box,
    Button,
    Typography,
    Link,
    Alert,
    CircularProgress,
    Paper,
    Container,
    Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import LogoutIcon from '@mui/icons-material/Logout';

interface VerifyEmailProps {
    status?: string;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    maxWidth: 500,
    width: '100%',
    margin: 'auto',
    marginTop: theme.spacing(8),
    borderRadius: theme.spacing(2),
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
}));

const ResendButton = styled(Button)(({ theme }) => ({
    height: 48,
    fontSize: '1rem',
    fontWeight: 500,
    textTransform: 'none',
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.grey[900],
    border: `1px solid ${theme.palette.grey[300]}`,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    '&:hover': {
        backgroundColor: theme.palette.grey[200],
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
    '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
    },
    ...(theme.palette.mode === 'dark' && {
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.grey[100],
        border: `1px solid ${theme.palette.grey[600]}`,
        '&:hover': {
            backgroundColor: theme.palette.grey[700],
        },
    }),
}));

export default function VerifyEmail({ status }: VerifyEmailProps) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <Container component="main" maxWidth="sm">
            <Head title="Email verification" />
            
            <StyledPaper elevation={3}>
                <Box sx={{ mb: 3 }}>
                    <EmailIcon 
                        sx={{ 
                            fontSize: 48, 
                            color: 'success.main', 
                            mb: 2 
                        }} 
                    />
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                        Verify email
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                        Please verify your email address by clicking on the link we just emailed to you.
                    </Typography>
                </Box>

                {status === 'verification-link-sent' && (
                    <Alert 
                        severity="success" 
                        sx={{ 
                            mb: 3, 
                            borderRadius: 2,
                            textAlign: 'left'
                        }}
                    >
                        A new verification link has been sent to the email address you provided during registration.
                    </Alert>
                )}

                <Box component="form" onSubmit={submit}>
                    <Stack spacing={3} alignItems="center">
                        <ResendButton
                            type="submit"
                            fullWidth
                            disabled={processing}
                            startIcon={
                                processing ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : (
                                    <EmailIcon />
                                )
                            }
                        >
                            {processing ? 'Sending...' : 'Resend Verification Email'}
                        </ResendButton>

                        <Link
                            href={route('logout')}
                            component="button"
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                // Handle logout via Inertia
                                post(route('logout'));
                            }}
                            color="success.main"
                            sx={{ 
                                textDecoration: 'none',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                '&:hover': { 
                                    textDecoration: 'underline' 
                                }
                            }}
                        >
                            <LogoutIcon sx={{ fontSize: 16 }} />
                            Sign Out
                        </Link>
                    </Stack>
                </Box>
            </StyledPaper>
        </Container>
    );
}