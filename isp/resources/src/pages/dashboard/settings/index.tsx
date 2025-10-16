import React, { useState } from 'react';
import DashboardLayout from "@/layouts/Dashboard"
import ThemeCustomization from "@/themes"
import {
    Box,
    Container,
    Paper,
    Tabs,
    Tab,
    Breadcrumbs,
    Typography,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Person,
    Description,
    AccountBox,
    Lock,
    Group,
    Settings as SettingsIcon,
    Home,
    NavigateNext
} from '@mui/icons-material';

// Tab panel content components
const ProfileTab = () => (
    <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
            Account Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
            Manage your basic profile information, including name, email, and avatar.
        </Typography>
    </Box>
);

const PersonalTab = () => (
    <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
            Personal Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
            Update your personal details such as address, phone number, and preferences.
        </Typography>
    </Box>
);

const MyAccountTab = () => (
    <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
            My Account
        </Typography>
        <Typography variant="body2" color="text.secondary">
            View and manage your account details, subscription, and billing information.
        </Typography>
    </Box>
);

const ChangePasswordTab = () => (
    <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
            Change Password
        </Typography>
        <Typography variant="body2" color="text.secondary">
            Update your password and security settings for better account protection.
        </Typography>
    </Box>
);

const RoleTab = () => (
    <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
            Role Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
            View your current role and permissions within the ISP system.
        </Typography>
    </Box>
);

const SettingsTab = () => (
    <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
            Account Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
            Configure your account preferences, notifications, and system settings.
        </Typography>
    </Box>
);

// Tab configuration
const tabConfig = [
    {
        label: 'Profile',
        icon: Person,
        component: ProfileTab,
        breadcrumb: 'Account Profile'
    },
    {
        label: 'Personal',
        icon: Description,
        component: PersonalTab,
        breadcrumb: 'Personal'
    },
    {
        label: 'My Account',
        icon: AccountBox,
        component: MyAccountTab,
        breadcrumb: 'My Account'
    },
    {
        label: 'Change Password',
        icon: Lock,
        component: ChangePasswordTab,
        breadcrumb: 'Change Password'
    },
    {
        label: 'Role',
        icon: Group,
        component: RoleTab,
        breadcrumb: 'Role'
    },
    {
        label: 'Settings',
        icon: SettingsIcon,
        component: SettingsTab,
        breadcrumb: 'Settings'
    }
];

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`account-tabpanel-${index}`}
            aria-labelledby={`account-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `account-tab-${index}`,
        'aria-controls': `account-tabpanel-${index}`,
    };
}

function AccountSettings() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [value, setValue] = useState(3); // Default to "Change Password" tab as shown in HTML

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const currentTab = tabConfig[value];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs
                separator={<NavigateNext fontSize="small" />}
                aria-label="breadcrumb"
                sx={{ mb: 3 }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Home sx={{ fontSize: '1rem' }} />
                    <Typography color="text.primary" sx={{ fontSize: '0.875rem' }}>
                        Home
                    </Typography>
                </Box>
                <Typography color="text.primary" sx={{ fontSize: '0.875rem' }}>
                    Account Profile
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    {currentTab.breadcrumb}
                </Typography>
            </Breadcrumbs>

            {/* Main Content */}
            <Paper 
                elevation={1} 
                sx={{ 
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: `1px solid ${theme.palette.divider}`
                }}
            >
                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="account profile tab"
                        variant={isMobile ? "scrollable" : "standard"}
                        scrollButtons={isMobile ? "auto" : false}
                        sx={{
                            '& .MuiTab-root': {
                                minHeight: 72,
                                textTransform: 'none',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: theme.palette.text.secondary,
                                '&.Mui-selected': {
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                },
                                '&:hover': {
                                    color: theme.palette.primary.main,
                                    backgroundColor: theme.palette.action.hover,
                                },
                            },
                            '& .MuiTab-iconWrapper': {
                                marginBottom: '4px',
                            },
                            '& .MuiTabs-indicator': {
                                height: 3,
                                borderRadius: '2px 2px 0 0',
                            },
                        }}
                    >
                        {tabConfig.map((tab, index) => {
                            const IconComponent = tab.icon;
                            return (
                                <Tab
                                    key={index}
                                    icon={<IconComponent />}
                                    label={tab.label}
                                    {...a11yProps(index)}
                                    sx={{
                                        flexDirection: 'column',
                                        gap: 0.5,
                                    }}
                                />
                            );
                        })}
                    </Tabs>
                </Box>

                {/* Tab Content */}
                {tabConfig.map((tab, index) => {
                    const TabComponent = tab.component;
                    return (
                        <TabPanel key={index} value={value} index={index}>
                            <TabComponent />
                        </TabPanel>
                    );
                })}
            </Paper>

            {/* Footer Note */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SettingsIcon sx={{ fontSize: '1rem' }} />
                    Account settings are automatically saved. Changes may take a few minutes to reflect across all services.
                </Typography>
            </Box>
        </Container>
    );
}

export default function Page() {
    return (
        <ThemeCustomization>
            <DashboardLayout>
                <AccountSettings/>
            </DashboardLayout>
        </ThemeCustomization>
    )
}