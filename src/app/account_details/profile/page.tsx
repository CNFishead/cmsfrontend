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
  return (      <Suspense fallback={<div>Loading profile...</div>}>
        <Profile />
      </Suspense>
  );
}
