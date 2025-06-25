// Tools & Utilities
import {ToolOutlined} from "@ant-design/icons";

const tools = {
    id: 'group-tools',
    title: 'Tools',
    type: 'group',
    children: [
        {
            id: 'tools',
            title: 'ISP Tools',
            type: 'collapse',
            icon: ToolOutlined,
            children: [
                {
                    id: 'tools-lookup',
                    title: 'User Lookup',
                    type: 'item',
                    url: '/dashboard/tools/user-lookup'
                },
                {
                    id: 'tools-sessions',
                    title: 'Session Manager',
                    type: 'item',
                    url: '/dashboard/tools/session-manager'
                },
                {
                    id: 'tools-network',
                    title: 'Network Tools',
                    type: 'item',
                    url: '/dashboard/tools/ping'
                }
            ]
        }
    ]
};

export default tools;