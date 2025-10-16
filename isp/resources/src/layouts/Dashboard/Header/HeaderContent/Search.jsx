// material-ui
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';

// assets
import {SearchOutlined} from '@mui/icons-material';
import Badge from "@mui/material/Badge";
import BellOutlined from "@ant-design/icons/BellOutlined.js";
import IconButton from "@/components/@extended/IconButton.jsx";
import {useRef, useState} from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
// ==============================|| HEADER CONTENT - SEARCH ||============================== //

export default function Search() {
    const [open, setOpen] = useState(false);
    const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const anchorRef = useRef(null);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    return (
        <Box sx={{width: '100%', ml: {xs: 0, md: 1}}}>
            <div className="flex items-center gap-2 justify-end">
                <FormControl

                    sx={{width: {xs: '100%', md: 224}}}>
                    <OutlinedInput
                        size="small"
                        id="header-search"
                        startAdornment={
                            <InputAdornment position="start" sx={{mr: -0.5}}>
                                <SearchOutlined/>
                            </InputAdornment>
                        }
                        className={"!rounded-full"}
                        aria-describedby="header-search-text"
                        slotProps={{input: {'aria-label': 'weight'}}}
                        placeholder="Ctrl + K"
                    />
                </FormControl>
                {/*<IconButton*/}
                {/*    color="secondary"*/}
                {/*    variant="light"*/}
                {/*    sx={(theme) => ({*/}
                {/*        color: 'text.primary',*/}
                {/*        bgcolor: open ? 'grey.100' : 'grey.50',*/}
                {/*        p: 3,*/}
                {/*        ...theme.applyStyles('dark', {bgcolor: open ? 'background.default' : 'transparent'})*/}
                {/*    })}*/}
                {/*    aria-label="open profile"*/}
                {/*    ref={anchorRef}*/}
                {/*    aria-controls={open ? 'profile-grow' : undefined}*/}
                {/*    aria-haspopup="true"*/}

                {/*    className={"!rounded-full"}*/}
                {/*    onClick={handleToggle}*/}
                {/*>*/}
                {/*    <SearchOutlined/>*/}
                {/*</IconButton>*/}
            </div>
        </Box>
    );
}
