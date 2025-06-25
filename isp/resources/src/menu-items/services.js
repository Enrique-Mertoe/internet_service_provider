// Services & Packages
import {AppstoreOutlined, LinkOutlined} from "@ant-design/icons";
// Services & Packages
const services = {
    id: 'group-services',
    title: 'Services',
    type: 'group',
    children: [
        {
            id: 'packages',
            title: 'Internet Packages',
            type: 'item',
            url: '/dashboard/packages',
            icon: AppstoreOutlined
        },
        {
            id: 'subscriptions',
            title: 'Subscriptions',
            type: 'collapse',
            icon: LinkOutlined,
            children: [
                {
                    id: 'subscriptions-active',
                    title: 'Active Services',
                    type: 'item',
                    url: '/dashboard/subscriptions'
                },
                {
                    id: 'subscriptions-pending',
                    title: 'Pending Activations',
                    type: 'item',
                    url: '/dashboard/subscriptions?status=pending'
                }
            ]
        }
    ]
};

export default services;