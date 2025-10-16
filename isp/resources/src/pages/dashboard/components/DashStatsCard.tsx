import {url} from "@/lib/utils";
import dashImage from "@/public/images/dash-entry.png";
import {
    Add,
    Person,
    Inventory,
    Router,
    Group,
    Subject,
    AssignmentInd,
    Star,
    Check,
    Wifi,
    NetworkCheck,
    Settings,
    Visibility,
    TrendingUp,
    Speed,
    SignalWifi4Bar,
    AccountBalance,
    WifiOff,
    Circle
} from "@mui/icons-material";
import {
    Box,
    Button,
    Typography,
    Paper,
    IconButton,
    styled,
    Badge,
    badgeClasses,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Fade
} from "@mui/material";
import {PieChart} from '@mui/x-charts/PieChart';

import React, {useState} from "react";
import RevenueDashboard from "@/pages/dashboard/components/RevenueDashBoard";
import {ChevronDown} from "lucide-react";
import {Modal} from "@/utils/shortcuts";
import energy_image from "@/public/images/energy.png";
import Mtk from "@/components/@extended/Mtk";

const CartBadge = styled(Badge)`
    & .${badgeClasses.badge} {
        top: -15px;
        right: -1px;
        background-color: #e7000b;
    }
`;
export default function DashStatsCard() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (action: string) => {
        if (action === "create-client")
            Modal.addClient();
        if (action == "create-package")
            Modal.addPackage();
        if (action == "add-device")
            Modal.addMikrotik();
        handleClose();
    };

    return (
        <>
            <div
                className="!rounded-lg relative bg-[#fcfbfc] shadow-sm text-white mt-[2rem] mb-5 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 items-center justify-between">
                    <div
                        className={"shadow-sm relative px-3 rounded-t-lg -mt-[1.6rem] bg-[#fcfbfc] rounded-tr-[1.5rem] " +
                            "before:content-[''] before:h-2 before:inset-x-0 before:absolute before:-bottom-2 before:bg-[#fcfbfc] before:z-1 " +
                            "after:content-[''] after:w-2 after:inset-y-0 after:absolute after:-right-2 after:bg-[#fcfbfc] after:z-1"}>
                        <ISPOverview/>
                    </div>
                    <div
                        className="bg-[#f5f6fa] px-3 relative h-24 -mxs-[1px] z-2 md:-mt-[4rem] mt-0 rounded-[2em] hidden md:flex">
                        <div className="flex w-full pb-2 justify-center items-end">
                            {/* Device Status Grid */}
                            <div className="flex justify-center gap-6 items-end w-full">
                                {/* Connected Devices */}
                                <div className="flex flex-row">
                                    <div
                                        className="flex items-center space-x-1 bg-green-50 rounded-sm px-2 border border-green-200">
                                        <div className="flex items-center gap-1">
                                            <SignalWifi4Bar className="text-green-600" sx={{fontSize: '12px'}}/>
                                            <Circle className="text-green-500" sx={{fontSize: '4px'}}/>
                                        </div>
                                        <span className="text-green-700 text-xs font-semibold">24</span>
                                        <span className="text-green-600 text-[9px] font-medium">Online</span>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="relative">
                                        <Mtk width={48}/>
                                        <div
                                            className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                                    </div>
                                    {/* Total Status Bar */}
                                    <div className="flex items-center gap-2 -mt-1">
                                        <div className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                            <span
                                                className="text-slate-600 text-[10px] font-medium">Total: 27</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Disconnected Devices */}
                                <div
                                    className="flex items-center space-x-1 bg-red-50 rounded-sm px-2 border border-red-200">
                                    <div className="flex items-center gap-1">
                                        <WifiOff className="text-red-600" sx={{fontSize: '12px'}}/>
                                        <Circle className="text-red-500" sx={{fontSize: '4px'}}/>
                                    </div>
                                    <span className="text-red-700 text-xs font-semibold">3</span>
                                    <span className="text-red-600 text-[9px] font-medium">Offline</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className={"flex justify-center md:justify-end shadow-sm relative px-3  !rounded-tl-[1.5rem] rounded-t-lg md:-mt-[1.6rem] bg-[#fcfbfc] " +
                            " before:content-[''] before:h-2 before:inset-x-0 before:absolute md:before:block before:hidden before:-bottom-2 before:bg-[#fcfbfc] before:z-1 " +
                            " after:content-[''] after:w-2 after:inset-y-0 after:absolute after:-left-2 after:bg-[#fcfbfc] after:z-1"}>
                        <div className="flex py-2 gap-2 md:gap-4">
                            <IconButton
                                className={"!rounded-full"}
                                size={"large"}
                                onClick={handleClick}
                                sx={{
                                    transition: 'transform 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    }
                                }}
                            >
                                <Add
                                    className={" rounded-full text-green-500 border border-green-200 p-2"}
                                    color={"inherit"}
                                    sx={{
                                        fontSize: {xs: "2.5rem", md: "3rem"},
                                        transition: 'transform 0.2s ease-in-out',
                                        transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
                                    }}/>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                TransitionComponent={Fade}
                                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                                sx={{
                                    '& .MuiPaper-root': {
                                        borderRadius: '12px',
                                        minWidth: 200,
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                        border: '1px solid rgba(0,0,0,0.1)',
                                        mt: 1
                                    }
                                }}
                            >
                                <MenuItem
                                    onClick={() => handleMenuItemClick('create-client')}
                                    sx={{
                                        py: 1.5,
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                            transform: 'translateX(4px)'
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{minWidth: 40}}>
                                        <Person color={"success"} fontSize="small"/>
                                    </ListItemIcon>
                                    <ListItemText primary="Create Client"/>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => handleMenuItemClick('create-package')}
                                    sx={{
                                        py: 1.5,
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                            transform: 'translateX(4px)'
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{minWidth: 40}}>
                                        <Inventory color={"warning"} fontSize="small"/>
                                    </ListItemIcon>
                                    <ListItemText primary="Create Package"/>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => handleMenuItemClick('add-device')}
                                    sx={{
                                        py: 1.5,
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                            transform: 'translateX(4px)'
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{minWidth: 40}}>
                                        <Router color={"info"} fontSize="small"/>
                                    </ListItemIcon>
                                    <ListItemText primary="Add Device"/>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => handleMenuItemClick('add-user')}
                                    sx={{
                                        py: 1.5,
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                            transform: 'translateX(4px)'
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{minWidth: 40}}>
                                        <Group className={"text-orange-500"} color={"inherit"} fontSize="small"/>
                                    </ListItemIcon>
                                    <ListItemText primary="Add User"/>
                                </MenuItem>
                            </Menu>
                            <div className="hidden md:flex gap-2 md:gap-4">
                                <IconButton
                                    className={"!rounded-full"}
                                    size={"large"}
                                >
                                    <AssignmentInd
                                        className={" rounded-full border border-gray-200 p-2"}
                                        sx={{
                                            fontSize: {xs: "2.5rem", md: "3rem"}
                                        }}/>
                                    <CartBadge badgeContent={2} color="primary" overlap="circular"/>
                                </IconButton>
                                <IconButton
                                    className={"!rounded-full"}
                                    size={"large"}
                                >
                                    <Add
                                        className={" rounded-full border border-gray-200 p-2"}
                                        sx={{
                                            fontSize: {xs: "2.5rem", md: "3rem"}
                                        }}/>
                                    <CartBadge badgeContent={2} color="primary" overlap="circular"/>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className={"lg:col-span-5 p-2 order-2 lg:order-1"}>
                        <div className="flex flex-col md:flex-row h-full gap-2 md:gap-0">
                            <div
                                className="w-full md:w-1/2 h-64 md:h-full">
                                <ListCard1/>
                            </div>
                            <div className="hidden md:block">
                                <Energy/>
                            </div>
                            <div
                                className="flex-1 rounded-2xl bg-[#f0f0f0] h-64 md:h-full p-3">
                                <UserSubscriptions/>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-7 order-1 lg:order-2">
                        <RevenueDashboard/>
                    </div>
                </div>
            </div>
        </>
    )
}


const ListCard1 = () => {
    const mikrotiks = [
        {
            id: 1,
            name: "MikroTik-01",
            model: "hAP ac²",
            ip: "192.168.1.1",
            status: "online",
            clients: 24,
            uptime: "15d 4h"
        },
        {
            id: 2,
            name: "MikroTik-02",
            model: "RB4011",
            ip: "192.168.1.2",
            status: "online",
            clients: 18,
            uptime: "8d 12h"
        },
        {
            id: 3,
            name: "MikroTik-03",
            model: "CCR1009",
            ip: "192.168.1.3",
            status: "warning",
            clients: 32,
            uptime: "2d 6h"
        },
    ];

    const handleMonitor = (device: any) => {
        console.log('Monitoring device:', device.name);
        // Add monitoring logic here
    };

    const handleConfigure = (device: any) => {
        console.log('Configuring device:', device.name);
        // Add configuration logic here
    };

    return (
        <div className="bg-[#f0f0f0] p-3 rounded-xl shadow h-full w-full">
            <div className="flex justify-between items-center mb-3">
                <div className="flex text-gray-600 items-center gap-1">
                    <Router color="primary" sx={{fontSize: "1.5rem"}}/>
                    <span className="text-sm font-medium">MikroTiks</span>
                </div>
                <div className="flex gap-1">
                    <IconButton
                        size="small"
                        className="!bg-blue-100 !text-blue-600 hover:!bg-blue-200"
                        onClick={() => console.log('Monitor all devices')}
                    >
                        <Visibility sx={{fontSize: "1rem"}}/>
                    </IconButton>
                    <IconButton
                        size="small"
                        className="!bg-gray-100 !text-gray-600 hover:!bg-gray-200"
                        onClick={() => Modal.addMikrotik()}
                    >
                        <Settings sx={{fontSize: "1rem"}}/>
                    </IconButton>
                </div>
            </div>

            <div className="space-y-1.5 max-h-[200px] overflow-y-hidden">
                {mikrotiks.map((device) => (
                    <div key={device.id} className="bg-white px-2 py-1.5 rounded-md shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                    device.status === 'online' ? 'bg-green-400' :
                                        device.status === 'warning' ? 'bg-orange-400' : 'bg-red-400'
                                }`}></div>
                                <span className="text-xs font-medium text-gray-800 truncate">{device.name}</span>
                            </div>
                            <div className="flex gap-1">
                                <IconButton
                                    size="small"
                                    className="!p-1"
                                    onClick={() => handleMonitor(device)}
                                >
                                    <NetworkCheck sx={{fontSize: "0.8rem"}} className="text-blue-600"/>
                                </IconButton>
                                <IconButton
                                    size="small"
                                    className="!p-1"
                                    onClick={() => handleConfigure(device)}
                                >
                                    <Settings sx={{fontSize: "0.8rem"}} className="text-gray-600"/>
                                </IconButton>
                            </div>
                        </div>

                        <div className="text-[10px] text-gray-500 mb-1">
                            {device.model} • {device.ip}
                        </div>

                        <div className="flex justify-between text-[9px] text-gray-400">
                            <span>{device.clients} clients</span>
                            <span>Up: {device.uptime}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


const Energy = () => {
    return (
        <div className="relative h-full w-16">
            <div className="flex h-full  flex-col">
                <div className="grid grid-cols-2 h-1/2">
                    <div className="flex items-end h-full">
                        <div
                            className={"rounded-br-[2rem] flex align-self-end border-b-5 border-r-5  border-green-500 h-1/2 w-full"}></div>
                    </div>
                    <div
                        className={"rounded-tl-[2rem] mt-8 -ms-[5px] border-t-5 border-l-5 border-green-500 h-1/3 w-full"}></div>

                </div>
                <div className="grid grid-cols-2 h-1/2">
                    <div
                        className={"rounded-tr-[2rem] border-t-5 border-r-5  border-green-500 h-1/2 w-full"}></div>
                    <div className="flex items-end h-full">
                        <div
                            className={"rounded-bl-[2rem] mb-8 -ms-[5px] border-b-5 border-l-5 border-green-500 h-1/3 w-full"}></div>
                    </div>

                </div>
            </div>
            <div className="absolute
            top-1/2 -translate-y-1/2
            -left-4
            rounded-full h-8 w-8 border-[#fcfbfc] border-2 bg-gray-200
animate-[heartbeat_1s_ease-in-out_infinite]
             before:content-['']
            before:inset-0
            before:absolute
            before:bg-orange-200
            before:rounded-full
            before:h-5
            before:w-5
            before:top-1/2
            before:left-1/2
            before:-translate-1/2
            before:animate-ping

            flex items-center justify-center
            before:-z-2
            ">
                <Wifi sx={{
                    fontSize: "1rem"
                }} color={"inherit"} className={"text-orange-500 anismate-ping"}/>

            </div>
            <div className="absolute
            bottom-0 -translate-y-0
            -right-4
            mb-4
            rounded-full h-8 w-8 border-[#fcfbfc] border-2 bg-gray-200

             before:content-['']
            before:inset-0
            before:absolute
            before:bg-orange-500
            before:rounded-full
            before:h-4
            before:w-4
            before:top-1/2
            before:left-1/2
            flex items-center justify-center
            before:-z-2
            before:-translate-1/2
            ">
                <Check sx={{
                    fontSize: "1rem"
                }} color={"inherit"} className={"text-gray-50"}/>

            </div>
            <div className="absolute
            top-8 -translate-y-8
            mt-4
            -right-4
            rounded-full h-8 w-8 border-[#fcfbfc] border-2 bg-gray-200
flex items-center justify-center
             before:content-['']
            before:inset-0
            before:absolute
            before:bg-amber-100
            before:rounded-full
            before:h-5
            before:w-5
            before:top-1/2
            before:left-1/2
            before:-translate-1/2
            before:-z-3
            ">
                <Star sx={{
                    fontSize: "1rem"
                }} color={"inherit"} className={"text-amber-500"}/>
            </div>
        </div>)
}

const UserSubscriptions = () => {
    const subscriptions = [
        {
            id: 1,
            name: "Sarah C.",
            avatar: "SC",
            package: "Premium",
            remaining: "12d",
            status: "active",
            color: "bg-blue-500"
        },
        {
            id: 2,
            name: "Mike J.",
            avatar: "MJ",
            package: "Basic",
            remaining: "3d",
            status: "expiring",
            color: "bg-orange-500"
        },
        {
            id: 3,
            name: "Alex R.",
            avatar: "AR",
            package: "Business",
            remaining: "25d",
            status: "active",
            color: "bg-green-500"
        }
    ];

    return (
        <div className="h-full flex flex-col text-xs">
            <div className="flex items-center gap-1 mb-2">
                <Person className="text-gray-600" sx={{fontSize: '12px'}}/>
                <span className="text-gray-600 text-xs font-medium">Subscriptions</span>
            </div>

            <div className="space-y-1 flex-1">
                {subscriptions.map((sub) => (
                    <div key={sub.id} className="bg-white rounded-md p-1.5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-1.5">
                            <div
                                className={`w-4 h-4 ${sub.color} rounded-full flex items-center justify-center text-white text-[8px] font-medium`}>
                                {sub.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[10px] font-medium text-gray-800 truncate">{sub.name}</div>
                                <div className="text-[9px] text-gray-500">{sub.package}</div>
                            </div>
                            <div className="text-right">
                                <div className={`text-[9px] px-1 py-0.5 rounded-full font-medium ${
                                    sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                    {sub.remaining}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-2">
                <PieChart
                    series={[{
                        data: [
                            {id: 0, value: 45, color: '#22c55e'},
                            {id: 1, value: 30, color: '#f59e0b'},
                            {id: 2, value: 25, color: '#e5e7eb'},
                        ],
                        innerRadius: 15,
                        outerRadius: 25,
                    }]}
                    width={80}
                    height={50}
                    slotProps={{legend: {hidden: true}}}
                />
            </div>
        </div>
    );
};

const ISPOverview = () => {
    return (
        <div className="grid grid-cols-2 gap-2 py-2">
            {/* Network Status */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    <SignalWifi4Bar className="text-green-500" sx={{fontSize: '1rem'}}/>
                    <span className="text-xs font-medium text-gray-700">Network</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-green-600 font-medium">99.8% up</span>
                </div>
            </div>

            {/* Bandwidth */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    <Speed className="text-blue-500" sx={{fontSize: '1rem'}}/>
                    <span className="text-xs font-medium text-gray-700">Speed</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span className="text-[10px] text-blue-600 font-medium">1.2 Gbps</span>
                </div>
            </div>

            {/* Revenue */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    <TrendingUp className="text-orange-500" sx={{fontSize: '1rem'}}/>
                    <span className="text-xs font-medium text-gray-700">Revenue</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                    <span className="text-[10px] text-orange-600 font-medium">+12.5%</span>
                </div>
            </div>

            {/* Active Clients */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    <Person className="text-purple-500" sx={{fontSize: '1rem'}}/>
                    <span className="text-xs font-medium text-gray-700">Active</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    <span className="text-[10px] text-purple-600 font-medium">1,247</span>
                </div>
            </div>
        </div>
    );
};