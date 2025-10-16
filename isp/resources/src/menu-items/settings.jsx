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
            type: 'item',
            icon: SettingOutlined,
            url: "/dashboard/settings/general/"
        }
    ]
};

export default settings;