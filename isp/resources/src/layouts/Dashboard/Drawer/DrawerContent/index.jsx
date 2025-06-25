// project imports
import NavCard from './NavCard';
import Navigation from './Navigation';
import SimpleBar from '@/components/third-party/SimpleBar';
import {useGetMenuMaster} from '@/api/menu';

// ==============================|| DRAWER CONTENT ||============================== //

export default function DrawerContent() {
    const {menuMaster} = useGetMenuMaster();
    const drawerOpen = menuMaster.isDashboardDrawerOpened;

    return (
        <>
            <SimpleBar

                // sx={{
                //     height: '100%',
                //     maxHeight: 'calc(100vh - 60px)', // Account for header height
                //     overflow: 'auto'
                // }}
            >
                <Navigation/>
                {drawerOpen && <NavCard/>}
            </SimpleBar>
        </>
    );
}
