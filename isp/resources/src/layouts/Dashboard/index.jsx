import {useEffect} from 'react';
import {Outlet, useLocation} from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';
import Loader from '@/components/Loader';
import Breadcrumbs from '@/components/@extended/Breadcrumbs';

import {handlerDrawerOpen, useGetMenuMaster} from '@/api/menu';

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout({children}) {
    const {pathname} = useLocation();
    const {menuMasterLoading} = useGetMenuMaster();
    const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));

    // set media wise responsive drawer
    useEffect(() => {
        handlerDrawerOpen(!downXL);
    }, [downXL]);

    if (menuMasterLoading) return <Loader/>;

    return (
        <Box sx={{display: 'flex', width: '100%'}}
        className={"bg-dgradient-to-b bg-[#f5f6fa] from-[#dbdbdb]to-[#c5ccda]"}
        >
            <Header window={() => window}/>
            <Drawer/>

            <Box component="main" sx={{ flexGrow: 1}}>
                <Toolbar sx={{mt: 'inherit'}}/>
                <Box
                    sx={{
                        position: 'relative',
                        minHeight: 'calc(100vh - 110px)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {/*{pathname !== '/apps/profiles/account/my-account' && <Breadcrumbs/>}*/}
                    <Breadcrumbs/>
                    {children}
                    <Footer/>
                </Box>
            </Box>
        </Box>
    );
}
