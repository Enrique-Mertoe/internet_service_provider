import {GlobalOutlined, HddOutlined, MonitorOutlined, NodeIndexOutlined} from '@ant-design/icons';
// Network Management
const network = {
    id: 'group-network',
    title: 'Network',
    type: 'group',
    children: [
        {
            id: 'network-overview',
            title: 'Network',
            type: 'item',
            url: '/dashboard/network/',
            icon: GlobalOutlined
        },
        {
            id: 'network-devices',
            title: 'Equipments',
            type: 'item',
            url: '/dashboard/network/equipments/',
            icon: HddOutlined
        },
        {
            id: 'network-monitoring',
            title: 'Monitoring',
            type: 'item',
            url: '/dashboard/network/monitoring',
            icon: MonitorOutlined
        },
    ]
};

export default network;