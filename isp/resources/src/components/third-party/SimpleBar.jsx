import PropTypes from 'prop-types';

// material-ui
import {alpha, styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';

// third-party
import SimpleBar from 'simplebar-react';
import {BrowserView, MobileView} from 'react-device-detect';

// root style
const RootStyle = styled(BrowserView)({
    flexGrow: 1,
    height: '100%',
    overflow: 'hidden'
});

// scroll bar wrapper
const SimpleBarStyle = styled(SimpleBar)(({theme}) => ({
    maxHeight: '100vh',
}));

// ==============================|| SIMPLE SCROLL BAR ||============================== //

export default function SimpleBarScroll({children, sx, ...other}) {
    const theme = useTheme();

    return (
        <>
            {children}
        </>
    );
}

SimpleBarScroll.propTypes = {children: PropTypes.any, sx: PropTypes.any, other: PropTypes.any};
