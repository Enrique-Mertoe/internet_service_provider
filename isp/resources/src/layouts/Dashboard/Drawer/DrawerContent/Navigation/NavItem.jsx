import PropTypes from 'prop-types';
import {Link, useLocation, matchPath} from 'react-router-dom';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import IconButton from '@/components/@extended/IconButton';

import {handlerDrawerOpen, useGetMenuMaster} from '@/api/menu';
import {useRoute} from "@/hooks/useRoute.js";

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

export default function NavItem({item, level, isParents = false, setSelectedID}) {
    const {menuMaster} = useGetMenuMaster();
    const drawerOpen = menuMaster.isDashboardDrawerOpened;
    const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

    let itemTarget = '_self';
    if (item.target) {
        itemTarget = '_blank';
    }

    const itemHandler = () => {
        if (downLG) handlerDrawerOpen(false);

        if (isParents && setSelectedID) {
            setSelectedID(item.id);
        }
    };

    const Icon = item.icon;
    const itemIcon = item.icon ? (
        <Icon
            style={{
                fontSize: drawerOpen ? '1rem' : '1.25rem',
                ...(isParents && {fontSize: 20, stroke: '1.5'})
            }}
        />
    ) : false;

    const {pathname} = useLocation();
    // const pathname  = "dashboard/dashboard-2";
    // const isSelected = !!matchPath({ path: item?.link ? item.link : item.url, end: false }, pathname);
    const isSelected = item?.url == pathname;

    const textColor = 'text.primary';
    const iconSelectedColor = 'success.main'; // Changed from 'primary.main' to green

    return (
        <>
            <Box sx={{position: 'relative'}}>
                <ListItemButton
                    to={item.url}
                    target={itemTarget}
                    disabled={item.disabled}
                    selected={isSelected}
                    sx={(theme) => ({
                        zIndex: 1201,
                        pl: drawerOpen ? `${level * 28}px` : 1.5,
                        py: !drawerOpen && level === 1 ? 1.25 : 1,
                        ...(drawerOpen && {
                            '&:hover': {bgcolor: 'success.lighter', ...theme.applyStyles('dark', {bgcolor: 'divider'})}, // Changed to green
                            '&.Mui-selected': {
                                bgcolor: 'success.lighter', // Changed to green
                                ...theme.applyStyles('dark', {bgcolor: 'divider'}),
                                borderRight: '2px solid',
                                borderColor: 'success.main', // Changed to green
                                color: iconSelectedColor,
                                '&:hover': {
                                    color: iconSelectedColor,
                                    bgcolor: 'success.lighter', ...theme.applyStyles('dark', {bgcolor: 'divider'}) // Changed to green
                                }
                            }
                        }),
                        ...(!drawerOpen && {
                            '&:hover': {bgcolor: 'transparent'},
                            '&.Mui-selected': {'&:hover': {bgcolor: 'transparent'}, bgcolor: 'transparent'}
                        })
                    })}
                    onClick={() => itemHandler()}
                >
                    {itemIcon && (
                        <ListItemIcon
                            sx={(theme) => ({
                                minWidth: 28,
                                color: isSelected ? iconSelectedColor : textColor,
                                ...(!drawerOpen && {
                                    borderRadius: 1.5,
                                    width: 36,
                                    height: 36,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': {bgcolor: 'secondary.lighter', ...theme.applyStyles('dark', {bgcolor: 'secondary.light'})}
                                }),
                                ...(!drawerOpen &&
                                    isSelected && {
                                        bgcolor: 'success.lighter', // Changed to green
                                        ...theme.applyStyles('dark', {bgcolor: 'success.900'}), // Changed to green
                                        '&:hover': {bgcolor: 'success.lighter', ...theme.applyStyles('dark', {bgcolor: 'success.darker'})} // Changed to green
                                    })
                            })}
                        >
                            {itemIcon}
                        </ListItemIcon>
                    )}
                    {(drawerOpen || (!drawerOpen && level !== 1)) && (
                        <ListItemText
                            primary={
                                <Typography variant="h6" sx={{color: isSelected ? iconSelectedColor : textColor}}>
                                    {item.title}
                                </Typography>
                            }
                        />
                    )}
                    {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
                        <Chip
                            color={item.chip.color}
                            variant={item.chip.variant}
                            size={item.chip.size}
                            label={item.chip.label}
                            avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                        />
                    )}
                </ListItemButton>
                {(drawerOpen || (!drawerOpen && level !== 1)) &&
                    item?.actions &&
                    item?.actions.map((action, index) => {
                        const ActionIcon = action.icon;
                        const callAction = action?.function;
                        return (
                            <IconButton
                                key={index}
                                {...(action.type === 'function' && {
                                    onClick: (event) => {
                                        event.stopPropagation();
                                        callAction();
                                    }
                                })}
                                {...(action.type === 'link' && {
                                    component: Link,
                                    to: action.url,
                                    target: action.target ? '_blank' : '_self'
                                })}
                                color="secondary"
                                variant="outlined"
                                sx={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 20,
                                    zIndex: 1202,
                                    width: 20,
                                    height: 20,
                                    mr: -1,
                                    ml: 1,
                                    color: 'secondary.dark',
                                    borderColor: isSelected ? 'success.light' : 'secondary.light', // Changed to green
                                    '&:hover': {borderColor: isSelected ? 'success.main' : 'secondary.main'} // Changed to green
                                }}
                            >
                                <ActionIcon style={{fontSize: '0.625rem'}}/>
                            </IconButton>
                        );
                    })}
            </Box>
        </>
    );
}

NavItem.propTypes = {
    item: PropTypes.any,
    level: PropTypes.number,
    isParents: PropTypes.bool,
    setSelectedID: PropTypes.oneOfType([PropTypes.any, PropTypes.func])
};