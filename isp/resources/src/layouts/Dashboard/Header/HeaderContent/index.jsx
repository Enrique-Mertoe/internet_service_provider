// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

// project imports
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import {Button} from "@mui/material";
import Message from "@/layouts/Dashboard/Header/HeaderContent/Messages.jsx";
// import MobileSection from './MobileSection';

// project import

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
    const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

    return (
        <>

            {downLG && <Box sx={{width: '100%', ml: 1}}/>}
            <div className="w-full"></div>
            <div className="flex gap-2 justify-center items-center ">
                <Button variant="outlined"
                        sx={{
                            borderRadius: 10,
                        }}
                >Clients</Button>
                <Button variant="outlined"
                        sx={{
                            borderRadius: 10,
                        }}
                >Devices</Button>
                <Button variant="outlined"
                        sx={{
                            borderRadius: 10,
                        }}
                >Packages</Button>
            </div>
            {!downLG && <Search/>}
            <Notification/>
            <Message/>
            {!downLG && <Profile/>}
            {/*{downLG && <MobileSection />}*/}
        </>
    );
}
