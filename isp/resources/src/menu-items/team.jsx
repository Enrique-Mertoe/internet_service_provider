import { TeamOutlined, TrophyOutlined } from '@ant-design/icons';
// Team Management
const team = {
  id: 'group-team',
  title: 'Team',
  type: 'group',
  children: [
    {
      id: 'team-members',
      title: 'Staff Members',
      type: 'item',
      url: '/dashboard/team',
      icon: TeamOutlined
    },
    {
      id: 'team-performance',
      title: 'Performance',
      type: 'item',
      url: '/dashboard/team/performance',
      icon: TrophyOutlined
    }
  ]
};

export default team;