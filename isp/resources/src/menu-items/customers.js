// Customer Management
import UserOutlined from "@ant-design/icons/UserOutlined";

const customers = {
    id: 'group-customers',
    title: 'Customer Management',
    type: 'group',
    children: [
        {
            id: 'customers',
            title: 'Customers',
            type: 'collapse',
            icon: UserOutlined,
            children: [
                {
                    id: 'customers-list',
                    title: 'All Customers',
                    type: 'item',
                    url: '/dashboard/customers'
                },
                {
                    id: 'customers-create',
                    title: 'Add Customer',
                    type: 'item',
                    url: '/dashboard/customers/create'
                },
                {
                    id: 'customers-import',
                    title: 'Import Customers',
                    type: 'item',
                    url: '/dashboard/customers/import'
                }
            ]
        }
    ]
};

export default customers;