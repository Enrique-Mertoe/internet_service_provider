import { CreditCardOutlined, DollarOutlined, ExclamationCircleOutlined, FileTextOutlined } from "@ant-design/icons";
// Billing & Finance
const billing = {
  id: 'group-billing',
  title: 'Billing & Finance',
  type: 'group',
  children: [
    {
      id: 'billing-overview',
      title: 'Revenue Overview',
      type: 'item',
      url: '/dashboard/billing',
      icon: DollarOutlined
    },
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
    {
      id: 'overdue',
      title: 'Overdue Accounts',
      type: 'item',
      url: '/dashboard/billing/overdue',
      icon: ExclamationCircleOutlined,
      badge: {
        color: 'warning',
        variant: 'light'
      }
    }
  ]
};

export default billing;