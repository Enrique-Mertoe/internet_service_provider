// AuthLayout.tsx - Reusable layout for all auth pages
import React, {ReactNode} from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Paper,
    useTheme,
    useMediaQuery, Link,
} from '@mui/material';
import {
    RouterOutlined,
    TrendingUp,
    PieChart,
    BarChart,
    Assessment,
    NetworkWifi,
} from '@mui/icons-material';
import {styled, keyframes} from '@mui/material/styles';

// Option 1: Import from assets (bundled by Vite)
import brandImage from "@/public/images/auth-image.png"
import {url} from "@/lib/utils";
import AppLogoIcon from "@/components/app-logo-icon";
import LogoSection from "@/components/logo"
// Option 2: Use public directory path (served directly)
// const brandImage = "/static/images/auth-image.png"
const brandImagePublic = "/static/images/auth-image.png"

interface AuthLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
}

const float = keyframes`
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-10px);
    }
`;

const FloatingIcon = styled(Box)(({theme}) => ({
    position: 'absolute',
    width: 60,
    height: 60,
    background: 'rgba(0, 0, 0, 0.15)',
    borderRadius: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
    animation: `${float} 3s ease-in-out infinite`,
    '&:nth-of-type(1)': {
        top: 20,
        left: 20,
        animationDelay: '0s',
    },
    '&:nth-of-type(2)': {
        top: 20,
        right: 20,
        animationDelay: '1s',
    },
    '&:nth-of-type(3)': {
        bottom: 20,
        left: 20,
        animationDelay: '2s',
    },
    '&:nth-of-type(4)': {
        bottom: 20,
        right: 20,
        animationDelay: '1.5s',
    },
}));

const IllustrationBox = styled(Box)(({theme}) => ({
    position: 'relative',
    height: 400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
}));

const TechStackBox = styled(Box)(({theme}) => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(3),
    opacity: 0.6,
}));

const TechItem = styled(Box)(({theme}) => ({
    width: 40,
    height: 40,
    backgroundColor: theme.palette.grey[300],
    borderRadius: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const AuthLayout: React.FC<AuthLayoutProps> = ({
                                                   children,
                                                   title = "Hi, Welcome back",
                                                   subtitle = "Manage your ISP operations with optimized workflows for MikroTik integration, hotspot management, and PPPoE services."
                                               }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: 'grey.50',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Container className="absolute flex justify-between items-center py-2 top-0 inset-x-0 container">
                <div className="flex gap-2 items-center">
                    <LogoSection/>
                    <Typography
                        variant="h5"
                        sx={{opacity: 0.85, color: theme.palette.common.black}}
                    >
                        Mantix
                    </Typography>
                </div>
                <Link href={""} className="flex items-center justify-center">Need help?</Link>
            </Container>

            <Container sx={{
                margin: 0,
                padding: 0,
            }} maxWidth="lg">
                <div className={"grid md:grid-cols-12"}>
                    {/* Left Side - Illustration */}
                    {!isMobile && (
                        <Grid
                            container
                            className={"md:col-span-5 pt-20"}
                            size={{
                                xs: 12,
                                md: 6
                            }}
                            sx={{
                                height: '100vh',
                                display: 'flex',
                                overflow: 'hidden',
                                alignItems: 'center',
                                justifyContent: 'center',
                                px: 4,
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    maxWidth: 480,
                                    position: 'relative',
                                }}
                                className={"flex flex-col "}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{
                                        mb: 2,
                                        color: 'text.primary',
                                        fontWeight: 700,
                                    }}
                                >
                                    {title}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        mb: 4,
                                        color: 'text.secondary',
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {subtitle}
                                </Typography>

                                <IllustrationBox>
                                    {/* Floating Elements */}
                                    <FloatingIcon>
                                        <RouterOutlined sx={{color: 'black', fontSize: 32}}/>
                                    </FloatingIcon>

                                    <FloatingIcon>
                                        <TrendingUp sx={{color: 'orange', fontSize: 32}}/>
                                    </FloatingIcon>

                                    <FloatingIcon>
                                        <PieChart sx={{color: 'green', fontSize: 32}}/>
                                    </FloatingIcon>

                                    <FloatingIcon>
                                        <Assessment sx={{color: 'white', fontSize: 32}}/>
                                    </FloatingIcon>

                                    {/* Central Content */}
                                    <Box
                                        sx={{
                                            textAlign: 'center',
                                            color: 'white',
                                            zIndex: 2,
                                        }}
                                    >
                                        <NetworkWifi sx={{fontSize: 80,}}/>
                                        <img
                                            className={"w-full h-96"}
                                            src={url(brandImage)}
                                            alt={"fc2-labs"}
                                        />

                                    </Box>

                                </IllustrationBox>

                                {/* Tech Stack Icons */}
                                <TechStackBox>
                                    {[...Array(5)].map((_, index) => (
                                        <TechItem key={index}>
                                            <Box
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    backgroundColor: 'grey.500',
                                                    borderRadius: 0.5,
                                                }}
                                            />
                                        </TechItem>
                                    ))}
                                </TechStackBox>
                            </Box>
                        </Grid>
                    )}

                    {/* Right Side - Form */}
                    <Grid
                        className={"md:col-span-7"}
                        container
                        size={{
                            xs: 12, md: 6
                        }}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 4,
                        }}
                    >
                        <div className="flex justify-center w-full">
                            <Paper
                                elevation={1}
                                className={"min-w-[450px]"}
                                sx={{
                                    p: 4,
                                    borderRadius: 2,
                                }}
                            >
                                {children}
                            </Paper>
                        </div>
                    </Grid>
                </div>
            </Container>
        </Box>
    );
};

export default AuthLayout;