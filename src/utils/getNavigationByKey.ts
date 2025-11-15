import { navigation } from '@/data/navigation';

/**
 * Get a navigation item by its key (e.g., 'home.home', 'management.users')
 * @param key - The navigation key in format 'section.linkKey'
 * @param options - Optional navigation options (user, schedulersCount, etc.)
 * @returns The navigation item or null if not found
 */
export const getNavigationByKey = (key: string, options?: any) => {
  const nav = navigation(options);

  // Split the key (e.g., 'home.home' -> ['home', 'home'])
  const [section, linkKey] = key.split('.');

  // Navigate through the navigation object to find the page
  if (section && linkKey && nav[section as keyof typeof nav]) {
    const navSection = nav[section as keyof typeof nav] as any;
    const link = navSection?.links?.[linkKey];

    if (link) {
      return link;
    }
  }

  return null;
};

/**
 * Get all navigation items as a flat array
 * Useful for searching or iterating through all navigation items
 */
export const getAllNavigationItems = (options?: any) => {
  const nav = navigation(options);
  const items: any[] = [];

  Object.entries(nav).forEach(([sectionKey, section]: [string, any]) => {
    if (section.links) {
      Object.entries(section.links).forEach(([linkKey, link]: [string, any]) => {
        items.push({
          ...link,
          key: link.key || `${sectionKey}.${linkKey}`,
        });
      });
    }
  });

  return items;
};
