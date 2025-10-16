import React, {useState} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Fade
} from '@mui/material';
import {AttachMoney, Bolt, KeyboardArrowDown, PeopleAlt} from '@mui/icons-material';
import {BarChart, barClasses, barElementClasses, barLabelClasses} from '@mui/x-charts/BarChart';

const RevenueGraph = () => {
    const [selectedPlatform, setSelectedPlatform] = useState('PPPOE');
    const [selectedMikrotik, setSelectedMikrotik] = useState(0);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const mikrotikData = {
        'MT-Core-01': {
            mainValue: '$18,552.54',
            secondValue: '373',
            secondLabel: '97/276',
            thirdValue: '16%',
            thirdLabel: '51/318',
            chartData: [15200, 18500, 22100, 19800, 25400, 28900, 31200, 29600, 33100, 28800, 26500, 30200]
        },
        'MT-Branch-02': {
            mainValue: '$12,340.20',
            secondValue: '245',
            secondLabel: '65/180',
            thirdValue: '24%',
            thirdLabel: '43/179',
            chartData: [8400, 11200, 14800, 12600, 16800, 19200, 21400, 18900, 22100, 19800, 17600, 20300]
        },
        'MT-Remote-03': {
            mainValue: '$8,750.15',
            secondValue: '156',
            secondLabel: '42/114',
            thirdValue: '31%',
            thirdLabel: '28/90',
            chartData: [5600, 7200, 9800, 8400, 11200, 12800, 14200, 12600, 15400, 13200, 11800, 13600]
        },
        'MT-Office-04': {
            mainValue: '$15,890.80',
            secondValue: '298',
            secondLabel: '78/220',
            thirdValue: '19%',
            thirdLabel: '38/200',
            chartData: [12800, 15600, 18900, 16700, 21400, 24200, 26800, 24100, 27600, 24800, 22400, 25900]
        },
        'MT-Backup-05': {
            mainValue: '$6,420.95',
            secondValue: '128',
            secondLabel: '35/93',
            thirdValue: '28%',
            thirdLabel: '22/78',
            chartData: [3800, 4900, 6200, 5400, 7100, 8200, 9100, 8000, 9800, 8400, 7600, 8700]
        }
    };

    const mikrotikNames = Object.keys(mikrotikData);
    const currentData = mikrotikData[mikrotikNames[selectedMikrotik]];

    const handleMikrotikChange = (event, newValue) => {
        setSelectedMikrotik(newValue);
    };

    return (
        <div className="p-0">
            <div className="bg-white/50 rounded-2xl p-4 pb-0 ps-0 max-w-2xl mx-auto shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between px-2 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <Box sx={{minWidth: 120}}>
                            <FormControl size="small" sx={{minWidth: 120}}>
                                <InputLabel
                                    id="platform-select-label"
                                    sx={{
                                        fontSize: '12px',
                                        color: '#6B7280',
                                        '&.Mui-focused': {
                                            color: '#6B7280'
                                        }
                                    }}
                                >
                                    Platform value
                                </InputLabel>
                                <Select
                                    labelId="platform-select-label"
                                    value={selectedPlatform}
                                    label="Platform value"
                                    onChange={(event) => setSelectedPlatform(event.target.value)}
                                    IconComponent={KeyboardArrowDown}
                                    sx={{
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: '#111827',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                            '& fieldset': {
                                                borderColor: 'transparent',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#E5E7EB',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#E5E7EB',
                                                borderWidth: '1px',
                                            },
                                        },
                                        '& .MuiSelect-icon': {
                                            color: '#9CA3AF',
                                            fontSize: '1rem',
                                            transition: 'transform 0.2s ease-in-out',
                                        },
                                        '& .MuiSelect-iconOpen': {
                                            transform: 'rotate(180deg)',
                                        }
                                    }}
                                >
                                    {['PPPOE', 'Hotspot', 'Dataplan'].map((platform) => (
                                        <MenuItem
                                            key={platform}
                                            value={platform}
                                            sx={{
                                                fontSize: '14px',
                                                py: 1,
                                                transition: 'background-color 0.2s ease-in-out',
                                                '&:hover': {
                                                    backgroundColor: '#F3F4F6',
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: '#EBF8FF',
                                                    '&:hover': {
                                                        backgroundColor: '#DBEAFE',
                                                    }
                                                }
                                            }}
                                        >
                                            {platform}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </div>

                    <Box sx={{maxWidth: 300, bgcolor: 'transparent'}}>
                        <Tabs
                            className={"items-center gap-2"}
                            value={selectedMikrotik}
                            onChange={handleMikrotikChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="mikrotik tabs"
                            sx={{
                                '& .MuiTab-root': {
                                    minWidth: '120px',
                                    minHeight: '28px',
                                    height: '28px',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    color: '#6B7280',
                                    borderRadius: '20px',
                                    py: '4px',
                                    px: '16px',
                                    margin: '0 2px',
                                    '&.Mui-selected': {
                                        color: 'white',
                                        backgroundColor: '#111827',
                                    }
                                },
                                '& .MuiTabs-indicator': {
                                    display: 'none'
                                }
                            }}
                        >
                            {mikrotikNames.map((name, index) => (
                                <Tab
                                    key={name} label={name}/>
                            ))}
                        </Tabs>
                    </Box>
                </div>

                {/* Main Content */}
                <div className="flex gap-1">
                    {/* Left Sidebar with Metrics */}
                    <div
                        className="relative bg-gradient-to-br from-green-900 via-gray-800 to-black text-white rounded-tr-2xl rounded-bl-2xl p-4 min-w-[160px] overflow-hidden isolate">

                        {/* Background glow effect */}
                        <div className="absolute w-full h-24 blur-2xl -z-10 -top-10 bg-gray-400 opacity-20"></div>

                        {/* Vertical label */}
                        <div
                            className="absolute -left-8 top-1/2 bg-gray-d50 transform -translate-y-1/2 -rotate-90 origin-center">
                            <span className="text-green-200 text-xs whitespace-nowrap">Average monthly</span>
                        </div>

                        {/* Main Content */}
                        <div className="space-y-4 ms-2">
                            <div className="flex items-center space-x-2">
                                <AttachMoney fontSize="small" className="text-green-200"/>
                                <div>
                                    <div className="text-green-200 text-[11px]">Revenue</div>
                                    <div className="text-base font-semibold">{currentData.mainValue}</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <PeopleAlt fontSize="small" className="text-green-200"/>
                                <div>
                                    <div className="text-green-200 text-[11px]">Users</div>
                                    <div className="text-sm font-semibold">
                                        {currentData.secondValue}
                                        <span
                                            className="text-green-200 text-[10px] ml-1">{currentData.secondLabel}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Bolt fontSize="small" className="text-green-200"/>
                                <div>
                                    <div className="text-green-200 text-[11px]">Efficiency</div>
                                    <div className="text-sm font-semibold">
                                        {currentData.thirdValue}
                                        <span className="text-green-200 text-[10px] ml-1">{currentData.thirdLabel}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Chart Area */}
                    <div className="flex-1">
                        <BarChart

                            borderRadius={10}
                            xAxis={[{
                                scaleType: 'band',
                                data: months,
                                tickLabelStyle: {
                                    fontSize: 12,
                                    fill: '#6B7280'
                                },
                                tickPlacement: "middle",
                                tickLabelPlacement: "middle",
                            }]}
                            yAxis={[{
                                tickLabelStyle: {
                                    fontSize: 12,
                                    fill: '#6B7280'
                                }
                            }]}
                            series={[{
                                data: currentData.chartData,
                                color: 'url(#greenGradient)'
                            }]}
                            width={400}
                            height={200}
                            margin={{
                                // left: 50,
                                right: 20,
                                top: 20,
                            }}
                            sx={{
                                '& .MuiChartsAxis-tick': {
                                    stroke: '#E5E7EB',
                                },
                                '& .MuiChartsAxis-line': {
                                    stroke: '#E5E7EB',
                                },
                                '& .MuiChartsGrid-line': {
                                    stroke: '#F3F4F6',
                                    strokeDasharray: '3 3',
                                },
                                '& .MuiChartsTooltip-root': {
                                    backgroundColor: '#1F2937',
                                    color: 'white',
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                },
                                [`& .${barClasses.root}`]: {
                                    rx: 4,
                                },
                            }}
                        >
                            <defs>
                                <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#10B981"/>
                                    <stop offset="50%" stopColor="#059669"/>
                                    <stop offset="100%" stopColor="#047857"/>
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </div>
                </div>
            </div>
        </div>
    );
};

function Gradient(props: React.SVGProps<SVGLinearGradientElement>) {
    return (
        <linearGradient gradientTransform="rotate(90)" {...props}>
            <stop offset="5%" stopColor="gold"/>
            <stop offset="95%" stopColor="red"/>
        </linearGradient>
    );
}

export default RevenueGraph;