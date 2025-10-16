import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    CardMedia
} from '@mui/material';
import {Visibility} from '@mui/icons-material';
import {useRoute} from "@/hooks/useRoute";
import {router} from "@/utils/routes";

const HeroSection = () => {
    return (
        <Box
            sx={{
                position: 'relative',
                minHeight: '60vh',
                display: 'flex',
                alignItems: 'center',

            }}
        >
            <Container maxWidth="lg">
                <div className={"grid md:grid-cols-2"}>
                    <Grid container sizes={{
                        xs: 12, md: 6, lg: 5
                    }}>
                        <Grid container spacing={2}>
                            <Grid item sizes={{xs: 12, md: 6, lg: 5, xl: 4}}>
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: {xs: '2.5rem', md: '3.5rem', lg: '4rem'},
                                        fontWeight: 700,
                                        lineHeight: 1.2,
                                        mb: 2,
                                        color: 'text.primary'
                                    }}
                                >
                                    Carefully Crafted for your{' '}
                                    <Box
                                        component="span"
                                        sx={{
                                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                        }}
                                    >
                                        Caring React{' '}
                                    </Box>
                                    Project
                                </Typography>
                            </Grid>

                            <Grid item sizes={{
                                xs: 12,
                                md: 12,
                                lg: 12,
                                xl: 12,
                                xxl: 12,
                                display: {xs: 'none', md: 'block'}
                            }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontSize: '1.25rem',
                                        fontWeight: 400,
                                        color: 'text.secondary',
                                        mb: 3,
                                        lineHeight: 1.5
                                    }}
                                >
                                    Mantis React is a blazing-fast dashboard template built using the MUI React library.
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            sx={{
                                                borderRadius: 2,
                                                px: 3,
                                                py: 1.5,
                                                fontSize: '1rem',
                                                textTransform: 'none',
                                                fontWeight: 600
                                            }}
                                            // href={router.route("ADMIN_INDEX")}
                                        >
                                            Explore Components
                                        </Button>
                                    </Grid>

                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<Visibility/>}
                                            sx={{
                                                borderRadius: 2,
                                                px: 3,
                                                py: 1.5,
                                                fontSize: '1rem',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    boxShadow: 'none'
                                                }
                                            }}
                                            href="/login"
                                            target="_blank"
                                        >
                                            Live Preview
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs="auto" md={12}>
                                <CardMedia
                                    component="img"
                                    image="/assets/img-headertech-B3j9Cw18.svg"
                                    alt="Mantis"
                                    sx={{
                                        width: 'auto',
                                        maxWidth: '100%',
                                        height: 'auto',
                                        mt: 2,
                                        zIndex: 9
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Box sx={{
                        backgroundImage: 'url(https://mantisdashboard.com/assets/bg-mockup-default-X99kt1i6.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'left center',
                        backgroundRepeat: 'no-repeat',
                    }}
                    className={"h-full w-full"}
                    >

                    </Box>
                </div>
            </Container>
        </Box>
    );
};

export default function Landing() {
    return (
        <>
            <HeroSection/>
        </>
    )
}