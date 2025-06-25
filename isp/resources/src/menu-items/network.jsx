import {GlobalOutlined, HddOutlined, MonitorOutlined, NodeIndexOutlined} from '@ant-design/icons';
// Network Management
const network = {
    id: 'group-network',
    title: 'Network',
    type: 'group',
    children: [
        {
            id: 'network-overview',
            title: 'Network Overview',
            type: 'item',
            url: '/dashboard/network',
            icon: GlobalOutlined
        },
        {
            id: 'network-devices',
            title: 'Equipment Status',
            type: 'item',
            url: '/dashboard/network/devices',
            icon: HddOutlined
        },
        {
            id: 'network-monitoring',
            title: 'Live Monitoring',
            type: 'item',
            url: '/dashboard/network/monitoring',
            icon: MonitorOutlined
        },
        {
            id: 'network-ip',
            title: 'IP Management',
            type: 'item',
            url: '/dashboard/network/ip-management',
            icon: NodeIndexOutlined
        }
    ]
};

export default network;