// Settings & Configuration
import SettingOutlined from "@ant-design/icons/SettingOutlined";

const settings = {
    id: 'group-settings',
    title: 'Configuration',
    type: 'group',
    children: [
        {
            id: 'settings',
            title: 'Settings',
            type: 'collapse',
            icon: SettingOutlined,
            children: [
                {
                    id: 'settings-company',
                    title: 'Company Settings',
                    type: 'item',
                    url: '/dashboard/settings/company'
                },
                {
                    id: 'settings-network',
                    title: 'Network Config',
                    type: 'item',
                    url: '/dashboard/settings/network'
                },
                {
                    id: 'settings-integrations',
                    title: 'Integrations',
                    type: 'item',
                    url: '/dashboard/settings/integrations'
                }
            ]
        }
    ]
};

export default settings;