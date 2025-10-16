import React from 'react';
import {
    Users,
    DollarSign,
    Wifi,
    AlertCircle,
    TrendingUp,
    Activity,
    Clock,
    CheckCircle,
    XCircle,
    ArrowUpRight,
    ArrowDownRight,
    Router,
    Server,
    Signal,
    UserPlus,
    Settings,
    CreditCard,
    Globe,
    Zap,
    Shield
} from 'lucide-react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

import dashImage from "@/public/images/dash-entry.png";
import {url} from "@/lib/utils";
import {Button, Typography} from '@mui/material';
import DashStatsCard from "@/pages/dashboard/components/DashStatsCard";
import RevenueGraph from "@/pages/dashboard/components/RevenuGraph";
import NetworkUsageChart from "@/pages/dashboard/components/NetworkUsageChart";

// Sample data - in real app, this would come from props
const revenueData = [
    {month: 'Jan', revenue: 45000, customers: 1200},
    {month: 'Feb', revenue: 52000, customers: 1350},
    {month: 'Mar', revenue: 48000, customers: 1280},
    {month: 'Apr', revenue: 61000, customers: 1450},
    {month: 'May', revenue: 55000, customers: 1380},
    {month: 'Jun', revenue: 67000, customers: 1520},
];

const usageData = [
    {time: '00:00', upload: 2.1, download: 8.5},
    {time: '04:00', upload: 1.8, download: 6.2},
    {time: '08:00', upload: 4.5, download: 15.3},
    {time: '12:00', upload: 5.2, download: 18.7},
    {time: '16:00', upload: 6.1, download: 22.4},
    {time: '20:00', upload: 7.8, download: 28.9},
];

const packageDistribution = [
    {name: 'Basic (10Mbps)', value: 35, color: '#3B82F6'},
    {name: 'Standard (25Mbps)', value: 28, color: '#10B981'},
    {name: 'Premium (50Mbps)', value: 22, color: '#F59E0B'},
    {name: 'Enterprise (100Mbps)', value: 15, color: '#EF4444'},
];

const recentCustomers = [
    {id: 'CU001', name: 'John Doe', package: 'Premium 50Mbps', status: 'Active', revenue: '$85', date: '2025-06-20'},
    {
        id: 'CU002',
        name: 'Jane Smith',
        package: 'Standard 25Mbps',
        status: 'Pending',
        revenue: '$45',
        date: '2025-06-19'
    },
    {
        id: 'CU003',
        name: 'Bob Johnson',
        package: 'Enterprise 100Mbps',
        status: 'Active',
        revenue: '$150',
        date: '2025-06-18'
    },
    {
        id: 'CU004',
        name: 'Alice Brown',
        package: 'Basic 10Mbps',
        status: 'Suspended',
        revenue: '$25',
        date: '2025-06-17'
    },
    {
        id: 'CU005',
        name: 'Charlie Wilson',
        package: 'Premium 50Mbps',
        status: 'Active',
        revenue: '$85',
        date: '2025-06-16'
    },
];

const recentActivities = [
    {
        id: 'ACT001',
        type: 'customer_signup',
        title: 'New customer registered',
        description: 'Sarah Mitchell signed up for Premium 50Mbps package',
        timestamp: '2 minutes ago',
        icon: UserPlus,
        iconColor: 'text-green-600',
        iconBg: 'bg-green-100'
    },
    {
        id: 'ACT002',
        type: 'payment',
        title: 'Payment received',
        description: 'Michael Rodriguez paid $75.00 for Standard package',
        timestamp: '15 minutes ago',
        icon: CreditCard,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100'
    },
    {
        id: 'ACT003',
        type: 'network',
        title: 'Network maintenance',
        description: 'Router MT-Core-01 updated firmware successfully',
        timestamp: '1 hour ago',
        icon: Settings,
        iconColor: 'text-purple-600',
        iconBg: 'bg-purple-100'
    },
    {
        id: 'ACT004',
        type: 'connection',
        title: 'Service activated',
        description: 'Internet service activated for Alex Thompson',
        timestamp: '2 hours ago',
        icon: Globe,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-100'
    },
    {
        id: 'ACT005',
        type: 'alert',
        title: 'Speed boost applied',
        description: 'Temporary speed increase for Enterprise customers',
        timestamp: '3 hours ago',
        icon: Zap,
        iconColor: 'text-orange-600',
        iconBg: 'bg-orange-100'
    }
];

const recentTickets = [
    {
        id: 'TK001',
        customer: 'John Doe',
        issue: 'Slow internet speed',
        priority: 'High',
        status: 'In Progress',
        assignee: 'Tech Team A'
    },
    {
        id: 'TK002',
        customer: 'Jane Smith',
        issue: 'Connection drops frequently',
        priority: 'Critical',
        status: 'Open',
        assignee: 'Tech Team B'
    },
    {
        id: 'TK003',
        customer: 'Bob Johnson',
        issue: 'Billing inquiry',
        priority: 'Low',
        status: 'Resolved',
        assignee: 'Billing Team'
    },
    {
        id: 'TK004',
        customer: 'Alice Brown',
        issue: 'Service activation',
        priority: 'Medium',
        status: 'Pending',
        assignee: 'Tech Team A'
    },
];

interface DashboardProps {
    // In real app, these would be passed from Django backend
    metrics?: {
        totalCustomers: number;
        activeSubscriptions: number;
        monthlyRevenue: number;
        openTickets: number;
        networkUptime: number;
    };
}

const DashboardContent: React.FC<DashboardProps> = ({
                                                        metrics = {
                                                            totalCustomers: 1520,
                                                            activeSubscriptions: 1475,
                                                            monthlyRevenue: 67000,
                                                            openTickets: 12,
                                                            networkUptime: 99.8
                                                        }
                                                    }) => {
    const MetricCard = ({title, value, icon: Icon, trend, trendValue, color = "blue"}: any) => (
        <div
            className="bg-white rounded-md shadow-sm border border-gray-200 px-6 py-1 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 shadow-lg rounded-lg bg-black`}>
                    <Icon className={`h-6 w-6 text-white`}/>
                </div>
                <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {trend === 'up' ? <ArrowUpRight className="h-4 w-4 mr-1"/> :
                        <ArrowDownRight className="h-4 w-4 mr-1"/>}
                    {trendValue}%
                </div>
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
                <p className="text-sm text-gray-600">{title}</p>
            </div>
        </div>
    );

    const StatusBadge = ({status}: { status: string }) => {
        const colors = {
            'Active': 'bg-green-100 text-green-800',
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Suspended': 'bg-red-100 text-red-800',
            'In Progress': 'bg-blue-100 text-blue-800',
            'Open': 'bg-orange-100 text-orange-800',
            'Resolved': 'bg-green-100 text-green-800',
            'Critical': 'bg-red-100 text-red-800',
            'High': 'bg-orange-100 text-orange-800',
            'Medium': 'bg-yellow-100 text-yellow-800',
            'Low': 'bg-gray-100 text-gray-800',
        };

        return (
            <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
        );
    };

    return (
        <div className="p-2 min-h-screen">
            <div className="mb-2 ">
                <h4 className="text-2xl font-bold text-gray-800">
                    Hello, <span className="text-indigo-600">Brian Albert</span>
                </h4>
            </div>

            <div className="">
                <DashStatsCard/>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Chart */}
                <div className="grid gap-3">
                    <RevenueGraph/>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#F0F0F0] rounded-2xl p-2">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">Clients</h3>
                                <button className="text-sm text-blue-600 hover:text-blue-800">View all</button>
                            </div>
                            <div className="space-y-1">
                                {recentCustomers.slice(0, 5).map((customer) => (
                                    <div key={customer.id}
                                         className="flex items-center rounded-md px-2 justify-between py-1 bg-white">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 text-sm">{customer.name}</p>
                                            <p className="text-xs text-gray-500">{customer.package}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <StatusBadge status={customer.status}/>
                                            <span
                                                className="text-sm font-medium text-gray-900">{customer.revenue}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Activity className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                                </div>
                                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View all</button>
                            </div>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {recentActivities.map((activity) => {
                                    const IconComponent = activity.icon;
                                    return (
                                        <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                            <div className={`p-2 rounded-full ${activity.iconBg} flex-shrink-0`}>
                                                <IconComponent className={`h-4 w-4 ${activity.iconColor}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="font-medium text-gray-900 text-sm truncate">{activity.title}</p>
                                                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{activity.timestamp}</span>
                                                </div>
                                                <p className="text-xs text-gray-600 leading-relaxed">{activity.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {/* Activity Summary Footer */}
                            <div className="mt-4 pt-3 border-t border-gray-100">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        5 activities in last 24h
                                    </span>
                                    <span>Last updated: now</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Network Usage */}
                <NetworkUsageChart />
            </div>
        </div>
    );
};

export default DashboardContent;