import React, {useState} from 'react';
import {router} from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    TextField,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
    Alert,
    Paper
} from '@mui/material';
//@ts-ignore
import ThemeCustomization from '@/themes';
import {api} from "@/utils/api";
import {route} from "@/utils/routes";

interface CompanySetupProps {
    user: {
        name: string;
        email: string;
    };
    currencies: Array<{
        value: string;
        label: string;
    }>;
    billing_cycles: Array<{
        value: string;
        label: string;
    }>;
    errors?: {
        [key: string]: string[];
    };
}

function CompanySetupPage({user, currencies, billing_cycles, errors: e = {}}: CompanySetupProps) {
    const [formData, setFormData] = useState({
        company_name: '',
        email: user.email,
        phone: '',
        address: '',
        website: '',
        currency: 'KES',
        billing_cycle: 'monthly'
    });
    const [errors, sE] = useState(e);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const {data, error} = await api.post<{ success: boolean, errors: any, redirect?: any }>({
            route: "AUTH_COMPANY_SETUP",
            data: formData
        });
        setIsLoading(false);
        if (!data?.success) {
            sE(data?.errors || {});
            return;
        }
        route(data?.redirect ?? "/")
    };

    return (
        <Container maxWidth="sm" sx={{py: 4}}>
            <Box sx={{textAlign: 'center', mb: 4}}>
                <Typography variant="h3" sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                    mb: 1
                }}>
                    Welcome to Your ISP Management Platform
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{mb: 1}}>
                    Hi {user.name}! Let's set up your company profile
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Please provide your company information to get started with managing your ISP business
                </Typography>
            </Box>

            <Paper className={"bg-transparent !border !border-gray-100 "} elevation={0} sx={{
                borderRadius: 3,
                overflow: 'hidden',
                borderColor: 'primary',

            }}>
                <Box sx={{
                    p: 3,
                }}>
                    <Typography variant="h5" sx={{fontWeight: 600, mb: 1}}>
                        Company Setup
                    </Typography>
                    <Typography variant="body2" sx={{opacity: 0.9}}>
                        Complete your company profile to access the full dashboard
                    </Typography>
                </Box>

                <CardContent sx={{p: 4}}>
                    {Object.keys(errors).length > 0 && (
                        <Alert severity="error" sx={{mb: 3}}>
                            Please correct the errors below and try again.
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Company Information Section */}
                            <Grid size={12}>
                                <Typography variant="h6" sx={{
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    mb: 2,
                                    borderBottom: '2px solid',
                                    borderColor: 'primary.light',
                                    pb: 1
                                }}>
                                    Company Information
                                </Typography>
                            </Grid>

                            <div className="grid w-full grid-cols-2 gap-4">
                                <Grid container size={{
                                    xs: 12
                                }}>
                                    <TextField
                                        fullWidth
                                        label="Company Name"
                                        value={formData.company_name}
                                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                                        error={!!errors.company_name}
                                        helperText={errors.company_name?.[0]}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid size={{xs: 12, md: 6}}>
                                    <TextField
                                        fullWidth
                                        label="Company Email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        error={!!errors.email}
                                        helperText={errors.email?.[0]}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid size={{xs: 12, md: 6}}>
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        error={!!errors.phone}
                                        helperText={errors.phone?.[0]}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid size={{xs: 12, md: 6}}>
                                    <TextField
                                        fullWidth
                                        label="Website (Optional)"
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => handleInputChange('website', e.target.value)}
                                        error={!!errors.website}
                                        helperText={errors.website?.[0]}
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid size={"grow"}>
                                    <TextField
                                        fullWidth
                                        label="Company Address"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        error={!!errors.address}
                                        helperText={errors.address?.[0]}
                                        required
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                    />
                                </Grid>
                            </div>


                            {/* Business Settings Section */}
                            <Grid size={12}>
                                <div className={"flex"}>
                                    <Typography variant="h6" sx={{
                                        color: 'primary.main',
                                        fontWeight: 600,
                                        mb: 2,
                                        mt: 2,
                                        borderBottom: '2px solid',
                                        borderColor: 'primary.light',
                                        pb: 1
                                    }}>
                                        Business Settings
                                    </Typography>
                                </div>
                            </Grid>

                            <div className="grid grid-cols-2 gap-2 w-full">
                                <Grid size={{xs: 12, md: 6}}>
                                    <FormControl fullWidth>
                                        <InputLabel>Currency</InputLabel>
                                        <Select
                                            value={formData.currency}
                                            label="Currency"
                                            onChange={(e) => handleInputChange('currency', e.target.value)}
                                        >
                                            {currencies.map((currency) => (
                                                <MenuItem key={currency.value} value={currency.value}>
                                                    {currency.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid size={{xs: 12, md: 6}}>
                                    <FormControl fullWidth>
                                        <InputLabel>Default Billing Cycle</InputLabel>
                                        <Select
                                            value={formData.billing_cycle}
                                            label="Default Billing Cycle"
                                            onChange={(e) => handleInputChange('billing_cycle', e.target.value)}
                                        >
                                            {billing_cycles.map((cycle) => (
                                                <MenuItem key={cycle.value} value={cycle.value}>
                                                    {cycle.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </div>

                            <Grid size={"grow"} sx={{mt: 3}}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    className={"!rounded-full"}
                                    variant="contained"
                                    disabled={isLoading}
                                    sx={{
                                        py: 1,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
                                        },
                                        '&:disabled': {
                                            background: 'rgba(0, 0, 0, 0.12)',
                                        }
                                    }}
                                >
                                    {isLoading ? (
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <CircularProgress size={24} sx={{color: 'white'}}/>
                                            Setting up your company...
                                        </Box>
                                    ) : (
                                        'Complete Setup'
                                    )}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Paper>

            <Box sx={{textAlign: 'center', mt: 3}}>
                <Typography variant="body2" color="text.secondary">
                    Need help? Contact our support team for assistance with setup.
                </Typography>
            </Box>
        </Container>
    );
}

export default function Page(props: CompanySetupProps) {
    return (
        <ThemeCustomization>
            <>
                <CompanySetupPage {...props} />
            </>
        </ThemeCustomization>
    );
}