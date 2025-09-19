'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NewPodcastModal } from '@/components/new-podcast-modal';
import { usePodcasts } from '../providers/podcast-provider';

export function HeaderWithNewButton() {
  const [showNewPodcastModal, setShowNewPodcastModal] = useState(false);
  const { addPodcast } = usePodcasts();

  const handleNewPodcast = async (newPodcast: any) => {
    try {
      await addPodcast(newPodcast);
      setShowNewPodcastModal(false);
    } catch (error) {
      console.error('Failed to create podcast:', error);
      // Keep modal open on error
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full flex-row justify-between p-6 flex bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center">
          <span className="text-foreground font-mono text-xl font-bold tracking-wider uppercase">
            Rush Hour
          </span>
        </div>
        
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowNewPodcastModal(true)}
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New
        </Button>
      </header>

      {/* Add top padding to body content to account for fixed header */}
      <div className="pt-20" />

      {/* New Podcast Modal */}
      {showNewPodcastModal && (
        <NewPodcastModal
          onClose={() => setShowNewPodcastModal(false)}
          onSubmit={handleNewPodcast}
        />
      )}
    </>
  );
}
