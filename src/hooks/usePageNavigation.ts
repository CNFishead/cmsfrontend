'use client';
import { usePathname } from 'next/navigation';
import { navigation } from '@/data/navigation';
import { useMemo } from 'react';

interface NavigationPage {
  title: string;
  link?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

/**
 * Hook to automatically determine the current page navigation based on the route
 * This eliminates the need to manually pass navigation props to PageLayout
 */
export const usePageNavigation = (): NavigationPage[] => {
  const pathname = usePathname();

  const currentPages = useMemo(() => {
    const nav = navigation();

    // Map pathname patterns to navigation items
    const routeMap: Record<string, NavigationPage> = {
      // Home routes
      '/': nav.home.links.home,
      '/home': nav.home.links.home,
      '/notifications': nav.home.links.notifications,

      // Management routes
      // '/management/users': nav.management.links.users,
      // '/management/ministries': nav.management.links.ministries,

      // // Admin routes
      // '/admin/profiles': nav.admin.links.admin_profiles,
      // '/admin/profiles/admin': nav.admin.links.admin_profiles,
      // '/account_details/legal': nav.admin.links.legal,
      // '/admin/plans': nav.admin.links.plans,
      // '/account_details/support_admin': nav.admin.links.support_admin,
      // '/admin/schedulers': nav.admin.links.schedulers,

      // Account details routes
      '/account_details/support': nav.account_details.links.support,
      '/account_details': nav.account_details.links.account_details,

      // Error boundaries
      '/404': nav.error_boundary.links.not_found,
      '/error': nav.error_boundary.links.error,
    };

    // Direct match
    if (routeMap[pathname]) {
      return [routeMap[pathname]];
    }

    // Pattern matching for dynamic routes
    // Check if pathname starts with any of our known routes
    for (const [route, page] of Object.entries(routeMap)) {
      if (pathname.startsWith(route) && route !== '/') {
        return [page];
      }
    }

    // Check for user detail routes
    // if (pathname.startsWith('/users/') || pathname.match(/\/management\/users\/[^/]+/)) {
    //   return [nav.management.links.users];
    // }

    // Check for ministry detail routes
    // if (pathname.startsWith('/ministries/') || pathname.match(/\/management\/ministries\/[^/]+/)) {
    //   return [nav.management.links.ministries];
    // }

    // Check for members routes
    // if (pathname.startsWith('/members/')) {
    //   return [nav.management.links.users];
    // }

    // Default fallback to home
    return [nav.home.links.home];
  }, [pathname]);

  return currentPages;
};
