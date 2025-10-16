import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Avatar,
    IconButton,
    Switch,
    Button,
    Chip,
    Stack,
    Divider,
    AvatarGroup
} from '@mui/material';
import {
    Close,
    SwapVert,
    Download,
    Share,
    KeyboardArrowDown, ChevronRight,
    StarBorder,
    VpnKey,
    Wifi,
    Storage
} from '@mui/icons-material';

const RevenueDashboard = () => {
    return (
        <Box sx={{margin: '0',p:1}}>

            {/* Title Section */}
            <Box sx={{display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 2, gap: { xs: 2, sm: 0 }}}>
                <Typography variant="h4" fontWeight={600} color="text.primary" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                    ISP Analytics
                </Typography>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    bgcolor: 'grey.50',
                    p: 1,
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                    <Switch size="small" defaultChecked sx={{
                        '& .MuiSwitch-thumb': {bgcolor: 'white'},
                        '& .MuiSwitch-track': {bgcolor: '#22c55e'}
                    }}/>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Live Data</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{display: 'flex', alignItems: 'center', fontSize: { xs: '0.75rem', sm: '0.875rem' }}}>
                        Dec 1 - Dec 29, 2024 <KeyboardArrowDown fontSize="small"/>
                    </Typography>
                </Box>
            </Box>

            {/* Main Content */}
            <Grid container spacing={4} sx={{mb: 2}}>
                {/* Revenue Section */}
                <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4 w-full">
                    <div className="w-full lg:flex-1">
                        <div>
                            <p className="text-xs sm:text-sm text-gray-500 mb-2">Monthly Subscription Revenue</p>

                            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2 sm:gap-4 mb-2">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-orbitron font-bold text-gray-900">KES 2,847,650</h2>

                                <div className="flex gap-1 flex-row sm:flex-col">
                                    <span className="text-xs font-semibold bg-green-100 text-green-600 px-2 py-0.5 rounded">
        +8.7%
      </span>

                                    <span
                                        className="text-xs font-semibold bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
        +247,890
      </span>
                                </div>
                            </div>

                            <p className="text-xs sm:text-sm text-gray-500 flex flex-wrap items-center gap-1 mb-4">
                                <span>vs prev. KES 2,599,760 Nov 2024</span>
                                <span className="hidden sm:inline">•</span>
                                <span>1,247 active subscribers</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 hidden sm:block" fill="none"
                                     viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M19 9l-7 7-7-7"/>
                                </svg>
                            </p>
                        </div>
                    </div>


                    <div className={"grid gap-2 grid-cols-1 sm:grid-cols-12 w-full lg:w-auto"}>
                        {/* Best Deal Card */}
                        <div className="flex sm:col-span-8
                        before:absolute
                        relative
                                before:content-['']
                                before:inset-0
                                before:bg-gray-700
                                before:scale-x-90
                                before:scale-y-110
                                before:rounded-md

                                after:absolute
                                after:content-['']
                                after:inset-0
                                after:bg-gray-200
                                after:scale-x-95
                                after:scale-y-108
                                after:rounded-md
                        ">
                            <div
                                className="bg-gray-800
                                relative

                                z-1
                                rounded-md w-full p-2 flex flex-col justify-between text-gray-300 text-xs">
                                <div className="flex items-center justify-between">
                                    <p className="uppercase text-yellow-400 text-[10px] tracking-wide">Top Client</p>
                                    <StarBorder fontSize={"small"}/>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white leading-tight">KES 89,500</p>
                                    <div className="flex items-center justify-between ">
                                        <p className="text-[11px] text-gray-400">Enterprise Corp</p>
                                        <IconButton aria-label="delete" sx={{
                                            background: '#fff',
                                            '&:hover': {background: '#fff'},
                                            '&:active': {background: '#fff'},
                                            '&:focus': {background: '#fff'},
                                            '&:disabled': {background: '#fff'},
                                            '&:disabled:hover': {background: '#fff'},
                                            '&:disabled:active': {background: '#fff'},
                                            '&:disabled:focus': {background: '#fff'},
                                            '&:disabled:disabled': {background: '#fff'},
                                            '&:disabled:disabled:hover': {background: '#fff'},
                                        }} color={"secondary"} size="small">
                                            <ChevronRight fontSize="inherit"/>
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Stats Cards */}
                        <div className="space-y-2 sm:col-span-4">
                            {/* New Connections Card */}
                            <div className="border border-green-600 rounded-md p-2 bg-white shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-xs text-gray-500">New Connects</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">34</span>
                                </div>
                            </div>

                            {/* Network Issues Card */}
                            <div className="border rounded-md p-2 bg-white shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                        <span className="text-xs text-gray-500">Support Tickets</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">12</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                    {/* Metrics Grid */}
                    <div
                        className="grid flex-1 bg-gray-300 p-1 rounded-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                        <div 
                            className="bg-gray-50 flex items-center gap-1 border rounded-full shadow-sm p-1 cursor-pointer hover:bg-gray-100 transition-colors min-w-0"
                            onClick={() => console.log('PPPOE configuration clicked')}
                        >
                            <VpnKey className="text-green-600 flex-shrink-0" sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
                            <h6 className="text-xs font-semibold text-gray-900 truncate">PPPOE</h6>
                            <span className="text-xs text-green-600 flex-shrink-0">48.5%</span>
                        </div>

                        <div 
                            className="bg-gray-50 border flex items-center gap-1 sm:gap-2 rounded-full shadow-sm p-1 cursor-pointer hover:bg-gray-100 transition-colors min-w-0"
                            onClick={() => console.log('Hotspot configuration clicked')}
                        >
                            <Wifi className="text-blue-600 flex-shrink-0" sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
                            <h6 className="text-xs font-semibold text-gray-900 truncate">Hotspot</h6>
                            <span className="text-xs text-blue-600 flex-shrink-0">29.8%</span>
                        </div>

                        <div 
                            className="bg-gray-50 border flex items-center gap-1 sm:gap-2 rounded-full shadow-sm p-1 cursor-pointer hover:bg-gray-100 transition-colors min-w-0 sm:col-span-2 lg:col-span-1"
                            onClick={() => console.log('Dataplan configuration clicked')}
                        >
                            <Storage className="text-amber-600 flex-shrink-0" sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
                            <h6 className="text-xs font-semibold text-gray-900 truncate">Dataplan</h6>
                            <span className="text-xs text-amber-600 flex-shrink-0">21.7%</span>
                        </div>
                    </div>

                    <Button
                        variant="contained"
                        size="small"
                        className={"!px-4 sm:!px-6 !py-1 !rounded-full !text-xs"}
                        sx={{
                            bgcolor: '#1f2937',
                            '&:hover': {bgcolor: '#374151'},
                            minWidth: 'auto',
                            alignSelf: { xs: 'center', sm: 'flex-start' }
                        }}
                    >
                        Details
                    </Button>
                </div>
            </Grid>
        </Box>
    );
};

export default RevenueDashboard;