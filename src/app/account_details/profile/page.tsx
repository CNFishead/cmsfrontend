import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import Profile from '@/views/profile/Profile.view';
import { Suspense } from 'react';

export const metadata = {
  title: 'ShepherdCMS | Profile',
  description: 'Edit your profile details and preferences.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function Page() {
  return (
    <PageLayout pages={[navigation().account_details.links.profile]} largeSideBar>
      <Suspense fallback={<div>Loading profile...</div>}>
        <Profile />
      </Suspense>
    </PageLayout>
  );
}
