import { headers } from 'next/headers';
import { getAppConfig } from '@/lib/utils';
import { SessionPageClient } from '../../components/session-page-client';
import { PodcastProvider } from '../../providers/podcast-provider';
import { ConvexProvider } from '../../components/convex-provider';

export default async function SessionPage() {
  const hdrs = await headers();
  const appConfig = await getAppConfig(hdrs);

  return (
    <ConvexProvider>
      <PodcastProvider>
        <SessionPageClient appConfig={appConfig} />
      </PodcastProvider>
    </ConvexProvider>
  );
}
