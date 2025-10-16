// assets
import {AppstoreOutlined, DashboardOutlined} from '@ant-design/icons';
import UserOutlined from "@ant-design/icons/UserOutlined";

// icons
const icons = {
    DashboardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
    id: 'group-dashboard',
    title: 'Overview',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard/',
            icon: icons.DashboardOutlined,
            breadcrumbs: false
        },
        // {
        //     id: 'clients',
        //     title: 'Clients',
        //     url: '/dashboard/clients/',
        //     type: 'item',
        //     icon: UserOutlined
        // },
        // {
        //     id: 'packages',
        //     title: 'Internet Packages',
        //     type: 'item',
        //     url: '/dashboard/packages/',
        //     icon: AppstoreOutlined
        // },
    ]
};

export default dashboard;
