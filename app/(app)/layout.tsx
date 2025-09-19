import { headers } from 'next/headers';
import { getAppConfig } from '@/lib/utils';
import { HeaderWithNewButton } from '../../components/header-with-new-button';
import { PodcastProvider } from '../../providers/podcast-provider';
import { ConvexProvider } from '../../components/convex-provider';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const hdrs = await headers();
  const { companyName, logo, logoDark } = await getAppConfig(hdrs);

  return (
    <ConvexProvider>
      <PodcastProvider>
        <HeaderWithNewButton />
        {children}
      </PodcastProvider>
    </ConvexProvider>
  );
}
