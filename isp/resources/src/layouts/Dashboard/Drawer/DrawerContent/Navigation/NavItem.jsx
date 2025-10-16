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
import {Button} from "@mui/material";

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

export default function NavItem({item, level, isParents = false, setSelectedID}) {
    const {menuMaster} = useGetMenuMaster();
    const drawerOpen = !menuMaster.isDashboardDrawerOpened;
    const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

    let itemTarget = '_self';
    if (item.target) {
        itemTarget = '_blank';
    }

    const itemHandler = () => {
        // if (downLG) handlerDrawerOpen(false);

        if (isParents && setSelectedID) {
            setSelectedID(item.id);
        }
    };

    const Icon = item.icon;
    const itemIcon = item.icon ? (
        <Icon
            style={{
                fontSize: drawerOpen ? '1rem' : '1.25rem',
                // ...(isParents && {fontSize: 20, stroke: '1.5'})
            }}
        />
    ) : false;

    const {pathname} = useLocation();
    // const pathname  = "dashboard/dashboard-2";
    // const isSelected = !!matchPath({ path: item?.link ? item.link : item.url, end: false }, pathname);
    const isSelected = item?.url == pathname;

    const textColor = 'text.primary';
    const iconSelectedColor = 'success.main'; // Changed from 'primary.main' to green

    // return (
    //     <>
    //         <Box sx={{position: 'relative'}}>
    //             <ListItemButton
    //                 to={item.url}
    //                 target={itemTarget}
    //                 disabled={item.disabled}
    //                 selected={isSelected}
    //                 className={"aspect-square !bg-[#e1e3e5] hover:!bg-[#f1f3f4]"}
    //                 sx={(theme) => ({
    //                     zIndex: 1201,
    //                     // width: "3rem",
    //                     display: 'flex',
    //                     flexDirection: "column",
    //                     alignItems: "center",
    //                     justifyContent: "center",
    //                     gap: 0,
    //                     borderRadius: 1.5,
    //                     p: "3px",
    //                 })}
    //                 onClick={() => itemHandler()}
    //             >
    //                 {itemIcon && (
    //                     <ListItemIcon
    //                         sx={(theme) => ({
    //                             color: isSelected ? iconSelectedColor : textColor,
    //                             width: "100%",
    //                             height: "100%",
    //                             borderRadius: "inherit",
    //                             backgroundColor: "transparent",
    //                             alignItems: 'center',
    //                             justifyContent: 'center',
    //                             margin: 0,
    //                             p:0
    //                         })}
    //                     >
    //                         {itemIcon}
    //                     </ListItemIcon>
    //                 )}
    //                 {/*{(drawerOpen || (!drawerOpen && level !== 1)) && (*/}
    //                 <ListItemText
    //                     sx={{
    //                         margin: 0,
    //                     }}
    //                     primary={
    //                         <Typography variant="h6" sx={{color: isSelected ? iconSelectedColor : textColor}}>
    //                             {item.title}
    //                         </Typography>
    //                     }
    //                 />
    //                 {/*)}*/}
    //                 {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
    //                     <Chip
    //                         color={item.chip.color}
    //                         variant={item.chip.variant}
    //                         size={item.chip.size}
    //                         label={item.chip.label}
    //                         avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
    //                     />
    //                 )}
    //             </ListItemButton>
    //             {(drawerOpen || (!drawerOpen && level !== 1)) &&
    //                 item?.actions &&
    //                 item?.actions.map((action, index) => {
    //                     const ActionIcon = action.icon;
    //                     const callAction = action?.function;
    //                     return (
    //                         <IconButton
    //                             key={index}
    //                             {...(action.type === 'function' && {
    //                                 onClick: (event) => {
    //                                     event.stopPropagation();
    //                                     callAction();
    //                                 }
    //                             })}
    //                             {...(action.type === 'link' && {
    //                                 component: Link,
    //                                 to: action.url,
    //                                 target: action.target ? '_blank' : '_self'
    //                             })}
    //                             color="secondary"
    //                             variant="outlined"
    //                             sx={{
    //                                 position: 'absolute',
    //                                 top: 12,
    //                                 right: 20,
    //                                 zIndex: 1202,
    //                                 width: 20,
    //                                 height: 20,
    //                                 mr: -1,
    //                                 ml: 1,
    //                                 color: 'secondary.dark',
    //                                 borderColor: isSelected ? 'success.light' : 'secondary.light', // Changed to green
    //                                 '&:hover': {borderColor: isSelected ? 'success.main' : 'secondary.main'} // Changed to green
    //                             }}
    //                         >
    //                             <ActionIcon style={{fontSize: '0.625rem'}}/>
    //                         </IconButton>
    //                     );
    //                 })}
    //         </Box>
    //     </>
    // );

    return (
        <>
            <ListItemButton
                to={item.url}
                target={itemTarget}
                disabled={item.disabled}
                selected={isSelected}
                sx={{
                    borderRadius: 1.5
                }}
                className={`flex w-[5rem] text-gray-900 hover:!text-green-800 cursor-pointer py-3 px-2 justify-center gap-2 items-center !bg-[#e1e3e5]hover:!bg-[#f1f3f4] flex-col
                ${
                    isSelected && "!bg-[#e1e3e5] !text-green-800"
                }
                `}>
                {itemIcon}
                <span className={"capitalize text-xs"}>{item.title}</span>
            </ListItemButton>
        </>
    )
}

NavItem.propTypes = {
    item: PropTypes.any,
    level: PropTypes.number,
    isParents: PropTypes.bool,
    setSelectedID: PropTypes.oneOfType([PropTypes.any, PropTypes.func])
};