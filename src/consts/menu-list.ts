import {
  AlertTriangle,
  Database,
  EyeIcon,
  LayoutGrid,
  Link2,
  type LucideIcon,
  Users
} from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(): Group[] {
  return [
    {
      groupLabel: 'Home',
      menus: [
        {
          href: '/dashboard',
          label: 'Dashboard',
          icon: EyeIcon
        },
        {
          href: '/admin',
          label: 'Admin Panel',
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: 'Management',
      menus: [
        {
          href: '/admin/urls',
          label: 'URLs',
          icon: Link2
        },
        {
          href: '/admin/urls/flagged',
          label: 'Flagged URLs',
          icon: AlertTriangle
        },
        {
          href: '/admin/users',
          label: 'Users',
          icon: Users
        },
        {
          href: '/admin/database',
          label: 'Database',
          icon: Database
        }
      ]
    }
  ];
}
