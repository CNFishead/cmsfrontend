'use client';
import React, { useMemo, useEffect } from 'react';
import PageLayout from '@/layout/page/Page.layout';
import { useLayoutStore } from '@/state/layout';
import { getNavigationByKey, getAllNavigationItems } from '@/utils/getNavigationByKey';
import { navigation } from '@/data/navigation';
import { usePathname } from 'next/navigation';

interface PageWrapperProps {
  children: React.ReactNode;
}

/**
 * Client component wrapper that determines page navigation based on current pathname
 * Always syncs navigation state with the actual route
 */
const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const setActiveNavigationKey = useLayoutStore((state) => state.setActiveNavigationKey);

  // Always derive active navigation from pathname (single source of truth)
  const { activeNavigationKey, matchedNavItem } = useMemo(() => {
    const allNavItems = getAllNavigationItems();

    // Sort by link length descending to match most specific routes first
    const sortedItems = [...allNavItems].sort((a, b) => {
      const aLen = a.link?.length || 0;
      const bLen = b.link?.length || 0;
      return bLen - aLen;
    });

    // Find navigation item that matches current pathname
    const matchingItem = sortedItems.find((item) => {
      if (!item.link) return false;

      // Exact match
      if (item.link === pathname) {
        return true;
      }

      // Pattern match for dynamic routes (e.g., /management/users/123 matches /management/users)
      // But don't match root '/' to everything
      if (item.link !== '/' && pathname.startsWith(item.link + '/')) {
        return true;
      }

      return false;
    });

    return {
      activeNavigationKey: matchingItem?.key || 'home.home',
      matchedNavItem: matchingItem || null,
    };
  }, [pathname]);

  // Update store whenever activeNavigationKey changes (derived from pathname)
  useEffect(() => {
    setActiveNavigationKey(activeNavigationKey);
  }, [activeNavigationKey, setActiveNavigationKey]);

  // Build breadcrumb pages array
  const pages = useMemo(() => {
    const navItem = matchedNavItem || getNavigationByKey(activeNavigationKey);
    return navItem ? [navItem] : [navigation().home.links.home];
  }, [activeNavigationKey, matchedNavItem]);

  return <PageLayout pages={pages}>{children}</PageLayout>;
};

export default PageWrapper;
