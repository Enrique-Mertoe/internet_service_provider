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
    Signal
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
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${color}-50`}>
                    <Icon className={`h-6 w-6 text-${color}-600`}/>
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
        <div className="p-2 bg-gray-50 min-h-screen">
            {/* Header */}
            {/*<div className="mb-8">*/}
            {/*    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>*/}
            {/*    <p className="text-gray-600">Monitor your ISP operations and network performance</p>*/}
            {/*</div>*/}

            <div className="rounded relative bg-gradient-to-r mb-5 from-green-500 to-green-50 h-[200px] w-full">
                <div className="absolute right-0 h-full p-8  ">
                    <img className={"h-full"} src={(url(dashImage))} alt=""/>
                </div>
                <div className="grid md:grid-cols-2">
                    <div className="flex p-3 gap-2 flex-col">
                        <Typography variant="h4" component="h2" className="text-white">
                            Welcome to ISP Dashboard
                        </Typography>
                        <Typography variant="body1" component="p" className="text-white">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus euismod,
                            turpis eu ultrices congue, metus tortor tincidunt enim, quis efficitur
                            ligula ligula eu est.
                        </Typography>
                        <div>
                            <Button variant="contained" color="primary" className="mt-4">Quick action</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
                <MetricCard
                    title="Total Customers"
                    value={metrics.totalCustomers}
                    icon={Users}
                    trend="up"
                    trendValue="12.5"
                    color="blue"
                />
                {/*<MetricCard*/}
                {/*    title="Active Subscriptions"*/}
                {/*    value={metrics.activeSubscriptions}*/}
                {/*    icon={Wifi}*/}
                {/*    trend="up"*/}
                {/*    trendValue="8.2"*/}
                {/*    color="green"*/}
                {/*/>*/}
                <MetricCard
                    title="Monthly Revenue"
                    value={`$${metrics.monthlyRevenue}`}
                    icon={DollarSign}
                    trend="up"
                    trendValue="15.3"
                    color="purple"
                />
                <MetricCard
                    title="Open Tickets"
                    value={metrics.openTickets}
                    icon={AlertCircle}
                    trend="down"
                    trendValue="5.1"
                    color="orange"
                />
                <MetricCard
                    title="Network Uptime"
                    value={`${metrics.networkUptime}%`}
                    icon={Activity}
                    trend="up"
                    trendValue="0.2"
                    color="emerald"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Revenue & Customer Growth</h3>
                        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1">
                            <option>Last 6 months</option>
                            <option>Last year</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                            <XAxis dataKey="month" stroke="#666"/>
                            <YAxis stroke="#666"/>
                            <Tooltip
                                contentStyle={{backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px'}}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1}/>
                            <Line type="monotone" dataKey="customers" stroke="#10B981" strokeWidth={2}/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Network Usage */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Network Usage (24h)</h3>
                        <div className="flex space-x-4 text-sm">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                <span>Download</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                <span>Upload</span>
                            </div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={usageData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                            <XAxis dataKey="time" stroke="#666"/>
                            <YAxis stroke="#666"/>
                            <Tooltip
                                contentStyle={{backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px'}}
                            />
                            <Area type="monotone" dataKey="download" stackId="1" stroke="#3B82F6" fill="#3B82F6"
                                  fillOpacity={0.6}/>
                            <Area type="monotone" dataKey="upload" stackId="1" stroke="#10B981" fill="#10B981"
                                  fillOpacity={0.6}/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Package Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Package Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={packageDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                dataKey="value"
                            >
                                {packageDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color}/>
                                ))}
                            </Pie>
                            <Tooltip/>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                        {packageDistribution.map((package_) => (
                            <div key={package_.name} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{backgroundColor: package_.color}}
                                    ></div>
                                    <span className="text-sm text-gray-600">{package_.name}</span>
                                </div>
                                <span className="text-sm font-medium">{package_.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Customers */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Customers</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-800">View all</button>
                    </div>
                    <div className="space-y-4">
                        {recentCustomers.slice(0, 5).map((customer) => (
                            <div key={customer.id}
                                 className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 text-sm">{customer.name}</p>
                                    <p className="text-xs text-gray-500">{customer.package}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <StatusBadge status={customer.status}/>
                                    <span className="text-sm font-medium text-gray-900">{customer.revenue}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Tickets */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Tickets</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-800">View all</button>
                    </div>
                    <div className="space-y-4">
                        {recentTickets.map((ticket) => (
                            <div key={ticket.id} className="py-3 border-b border-gray-100 last:border-0">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-900">{ticket.id}</span>
                                    <StatusBadge status={ticket.priority}/>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">{ticket.issue}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{ticket.customer}</span>
                                    <StatusBadge status={ticket.status}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Network Status */}
            <div className="mt-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Network Infrastructure Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center">
                                <Router className="h-8 w-8 text-green-600 mr-3"/>
                                <div>
                                    <p className="font-medium text-gray-900">Core Routers</p>
                                    <p className="text-sm text-gray-600">12 Active</p>
                                </div>
                            </div>
                            <CheckCircle className="h-6 w-6 text-green-600"/>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center">
                                <Server className="h-8 w-8 text-blue-600 mr-3"/>
                                <div>
                                    <p className="font-medium text-gray-900">Servers</p>
                                    <p className="text-sm text-gray-600">8 Active</p>
                                </div>
                            </div>
                            <CheckCircle className="h-6 w-6 text-blue-600"/>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                            <div className="flex items-center">
                                <Signal className="h-8 w-8 text-yellow-600 mr-3"/>
                                <div>
                                    <p className="font-medium text-gray-900">Access Points</p>
                                    <p className="text-sm text-gray-600">2 Maintenance</p>
                                </div>
                            </div>
                            <Clock className="h-6 w-6 text-yellow-600"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;