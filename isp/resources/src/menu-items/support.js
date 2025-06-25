import {CustomerServiceOutlined} from "@ant-design/icons";

const support = {
    id: 'group-support',
    title: 'Support',
    type: 'group',
    children: [
        {
            id: 'tickets',
            title: 'Support Tickets',
            type: 'collapse',
            icon: CustomerServiceOutlined,
            children: [
                {
                    id: 'tickets-open',
                    title: 'Open Tickets',
                    type: 'item',
                    url: '/dashboard/tickets',
                    badge: {
                        color: 'error',
                        variant: 'light'
                    }
                },
                {
                    id: 'tickets-create',
                    title: 'Create Ticket',
                    type: 'item',
                    url: '/dashboard/tickets/create'
                },
                {
                    id: 'tickets-sla',
                    title: 'SLA Dashboard',
                    type: 'item',
                    url: '/dashboard/tickets/sla'
                }
            ]
        }
    ]
};

export default support;