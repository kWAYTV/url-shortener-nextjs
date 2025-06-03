import { AlertTriangle, Database, RefreshCcw } from 'lucide-react';
import { type Metadata } from 'next';

import { ContentLayout } from '@/components/core/admin/content-layout';
import { SeedDatabaseButton } from '@/components/core/admin/database/seed-database-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Database Management | Admin | ShortLink',
  description: 'Database management tools for ShortLink application'
};

export default function DatabasePage() {
  return (
    <ContentLayout title='Database Management'>
      <div className='grid gap-6'>
        <Card className='shadow-sm'>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <div className='rounded-md bg-purple-100 p-2 text-purple-500 dark:bg-purple-900/20'>
                <Database className='size-5' />
              </div>
              <CardTitle>Seed Database</CardTitle>
            </div>
            <CardDescription>
              Populate the database with test data for development and testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20'>
                <AlertTriangle className='mt-0.5 size-5 text-amber-600 dark:text-amber-400' />
              </div>
              <div>
                <h3 className='mb-1 font-medium text-amber-800 dark:text-amber-300'>
                  Development Use Only
                </h3>
                <p className='text-sm text-amber-700 dark:text-amber-400'>
                  This tool is intended for development and testing purposes
                  only. Seeding the database will create test users, URLs, and
                  other data.
                </p>
              </div>
            </div>

            <div className='bg-muted rounded-md p-4'>
              <h3 className='mb-2 flex items-center gap-2 font-medium'>
                <RefreshCcw className='size-4' />
                Seed Database with Test Data
              </h3>
              <p className='text-muted-foreground mb-4 text-sm'>
                This will create test users including an admin user
                (admin@example.com / admin123), sample URLs, and other test data
                needed for development.
              </p>
              <SeedDatabaseButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
