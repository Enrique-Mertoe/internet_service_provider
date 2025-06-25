import { BarChartOutlined, LineChartOutlined, PieChartOutlined } from '@ant-design/icons';
// Usage & Analytics
const analytics = {
  id: 'group-analytics',
  title: 'Analytics',
  type: 'group',
  children: [
    {
      id: 'usage-live',
      title: 'Live Usage',
      type: 'item',
      url: '/dashboard/usage/real-time',
      icon: BarChartOutlined
    },
    {
      id: 'usage-bandwidth',
      title: 'Bandwidth Monitor',
      type: 'item',
      url: '/dashboard/usage/bandwidth',
      icon: LineChartOutlined
    },
    {
      id: 'usage-reports',
      title: 'Usage Reports',
      type: 'item',
      url: '/dashboard/usage/reports',
      icon: PieChartOutlined
    }
  ]
};

export default analytics;