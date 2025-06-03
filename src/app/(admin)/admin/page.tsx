import { ArrowRight } from 'lucide-react';
import { type Metadata } from 'next';
import Link from 'next/link';

import { ContentLayout } from '@/components/core/admin/content-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getMenuList } from '@/consts/menu-list';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for managing the URL shortener'
};

export default function AdminPage() {
  const menuList = getMenuList();
  const managementMenus =
    menuList.find(group => group.groupLabel === 'Management')?.menus || [];

  const adminModules = managementMenus.map((menu, index) => {
    const colors = [
      { color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
      {
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
      },
      {
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-100 dark:bg-indigo-900/20'
      },
      {
        color: 'text-purple-500',
        bgColor: 'bg-purple-100 dark:bg-purple-900/20'
      }
    ];

    const descriptions = [
      'View, edit, and manage all shortened URLs',
      'Review and moderate flagged URLs',
      'Manage user accounts and permissions',
      'Seed and manage database data'
    ];

    return {
      title: menu.label,
      description: descriptions[index] || 'Manage system settings',
      icon: <menu.icon className='size-5' />,
      href: menu.href,
      ...colors[index % colors.length]
    };
  });

  return (
    <ContentLayout title='Admin Dashboard'>
      <div className='grid gap-6'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
          {adminModules.map(module => (
            <Card key={module.href} className='overflow-hidden'>
              <CardHeader className='pb-2'>
                <div className='flex items-center gap-2'>
                  <div
                    className={`rounded-md p-2 ${module.bgColor} ${module.color}`}
                  >
                    {module.icon}
                  </div>
                  <CardTitle className='text-xl'>{module.title}</CardTitle>
                </div>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={module.href}>
                  <Button
                    variant={'outline'}
                    className='group w-full justify-between'
                  >
                    Go to {module.title}
                    <ArrowRight className='size-4 transition-transform group-hover:translate-x-1' />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ContentLayout>
  );
}
