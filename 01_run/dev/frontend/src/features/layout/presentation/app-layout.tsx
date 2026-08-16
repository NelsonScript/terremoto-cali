import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { SiteHeader } from '@features/layout/presentation/site-header';
import { SiteFooter } from '@features/layout/presentation/site-footer';
import { QuickActions } from '@features/layout/presentation/quick-actions';

/** Shell de la app — equivalente al RootLayout de Next.js. */
export const AppLayout: FC = () => {
  return (
    <>
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
      <QuickActions />
    </>
  );
};
