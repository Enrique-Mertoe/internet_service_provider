import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

// project import
import NavItem from './NavItem';
import { handlerDrawerOpen, useGetMenuMaster } from '@/api/menu';

// ==============================|| NAVIGATION - COLLAPSE ||============================== //

export default function NavCollapse({ item, level }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const [open, setOpen] = useState(false);
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const handleClick = () => {
    setOpen(!open);
    if (downLG) handlerDrawerOpen(false);
  };

  // const { pathname } = useLocation();
  const pathname = "";
  
  const checkOpenForParent = useCallback((child) => {
    child.forEach((item) => {
      if (item.url === pathname) {
        setOpen(true);
      }
    });
  }, [pathname]);

  // menu collapse for sub-menu
  useEffect(() => {
    setOpen(false);
    if (item.children) {
      item.children.forEach((collapse) => {
        if (collapse.type && collapse.type === 'collapse') {
          checkOpenForParent(collapse.children);
        }
        if (collapse.type && collapse.type === 'item' && matchPath({ path: collapse.url, end: false }, pathname)) {
          setOpen(true);
        }
      });
    }
  }, [pathname, item.children, checkOpenForParent]);

  const Icon = item.icon;
  const itemIcon = item.icon ? (
    <Icon
      style={{
        fontSize: drawerOpen ? '1rem' : '1.25rem'
      }}
    />
  ) : false;

  const isSelected = open || item.children?.some((child) => {
    if (child.type === 'item') {
      return !!matchPath({ path: child.url, end: false }, pathname);
    }
    return false;
  });

  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';

  return (
    <>
      <ListItemButton
        selected={isSelected}
        sx={(theme) => ({
          zIndex: 1201,
          pl: drawerOpen ? `${level * 28}px` : 1.5,
          py: !drawerOpen && level === 1 ? 1.25 : 1,
          ...(drawerOpen && {
            '&:hover': { bgcolor: 'primary.lighter', ...theme.applyStyles('dark', { bgcolor: 'divider' }) },
            '&.Mui-selected': {
              bgcolor: 'primary.lighter',
              ...theme.applyStyles('dark', { bgcolor: 'divider' }),
              borderRight: '2px solid',
              borderColor: 'primary.main',
              color: iconSelectedColor,
              '&:hover': { color: iconSelectedColor, bgcolor: 'primary.lighter', ...theme.applyStyles('dark', { bgcolor: 'divider' }) }
            }
          }),
          ...(!drawerOpen && {
            '&:hover': { bgcolor: 'transparent' },
            '&.Mui-selected': { '&:hover': { bgcolor: 'transparent' }, bgcolor: 'transparent' }
          })
        })}
        onClick={handleClick}
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
                '&:hover': { bgcolor: 'secondary.lighter', ...theme.applyStyles('dark', { bgcolor: 'secondary.light' }) }
              }),
              ...(!drawerOpen &&
                isSelected && {
                  bgcolor: 'primary.lighter',
                  ...theme.applyStyles('dark', { bgcolor: 'primary.900' }),
                  '&:hover': { bgcolor: 'primary.lighter', ...theme.applyStyles('dark', { bgcolor: 'primary.darker' }) }
                })
            })}
          >
            {itemIcon}
          </ListItemIcon>
        )}
        {(drawerOpen || (!drawerOpen && level !== 1)) && (
          <ListItemText
            primary={
              <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor }}>
                {item.title}
              </Typography>
            }
          />
        )}
        {(drawerOpen || (!drawerOpen && level !== 1)) && (
          <>
            {open ? (
              <ExpandLess sx={{ fontSize: '1rem', color: isSelected ? iconSelectedColor : textColor }} />
            ) : (
              <ExpandMore sx={{ fontSize: '1rem', color: isSelected ? iconSelectedColor : textColor }} />
            )}
          </>
        )}
      </ListItemButton>
      {(drawerOpen || (!drawerOpen && level !== 1)) && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ position: 'relative' }}>
            {/* Vertical line indicator */}
            {open && (
              <Box
                sx={{
                  position: 'absolute',
                  left: `${level * 28 + 14}px`,
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  backgroundColor: 'primary.light',
                  opacity: 0.3,
                  zIndex: 1
                }}
              />
            )}
            {item.children?.map((subItem) => {
              return (
                <Box key={subItem.id} sx={{ position: 'relative' }}>
                  {/* Dot indicator for each sub-item */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: `${level * 28 + 8}px`,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      opacity: 0.7,
                      zIndex: 2
                    }}
                  />
                  {/* Horizontal connector line */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: `${level * 28 + 14}px`,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '8px',
                      height: '1px',
                      backgroundColor: 'primary.light',
                      opacity: 0.5,
                      zIndex: 1
                    }}
                  />
                  {(() => {
                    switch (subItem.type) {
                      case 'collapse':
                        return <NavCollapse item={subItem} level={level + 1} />;
                      case 'item':
                        return <NavItem item={subItem} level={level + 1} />;
                      default:
                        return (
                          <Typography variant="h6" color="error" align="center">
                            Menu Items Error
                          </Typography>
                        );
                    }
                  })()}
                </Box>
              );
            })}
          </List>
        </Collapse>
      )}
    </>
  );
}

NavCollapse.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number
};