import {CreditCardOutlined, DollarOutlined, ExclamationCircleOutlined, FileTextOutlined} from "@ant-design/icons";
// Billing & Finance
const billing = {
    id: 'group-billing',
    title: 'Billing & Finance',
    type: 'group',
    children: [
        {
            id: 'invoices',
            title: 'Invoices',
            type: 'item',
            url: '/dashboard/billing/invoices',
            icon: FileTextOutlined
        },
        {
            id: 'payments',
            title: 'Payments',
            type: 'item',
            url: '/dashboard/billing/payments',
            icon: CreditCardOutlined
        },

    ]
};

export default billing;