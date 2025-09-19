'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Room, RoomEvent } from 'livekit-client';
import { motion } from 'motion/react';
import { RoomAudioRenderer, RoomContext, StartAudio } from '@livekit/components-react';
import { toastAlert } from '@/components/alert-toast';
import { SessionView } from '@/components/session-view';
import { Toaster } from '@/components/ui/sonner';
import useConnectionDetails from '@/hooks/useConnectionDetails';
import { usePodcasts, type Podcast } from '@/providers/podcast-provider';
import { Button } from '@/components/ui/button';
import type { AppConfig } from '@/lib/types';

const MotionSessionView = motion.create(SessionView);

interface SessionPageClientProps {
  appConfig: AppConfig;
}

export function SessionPageClient({ appConfig }: SessionPageClientProps) {
  const searchParams = useSearchParams();
  const podcastId = searchParams.get('podcast');
  const { podcasts } = usePodcasts();
  const [sessionStarted, setSessionStarted] = useState(false);
  
  // LiveKit room setup
  const room = useMemo(() => new Room(), []);
  const { refreshConnectionDetails, existingOrRefreshConnectionDetails } =
    useConnectionDetails(appConfig);

  // Find the podcast by ID
  const podcast = podcasts.find(p => p.id === podcastId);

  // LiveKit connection effects
  useEffect(() => {
    const onDisconnected = () => {
      setSessionStarted(false);
      refreshConnectionDetails();
    };
    const onMediaDevicesError = (error: Error) => {
      toastAlert({
        title: 'Encountered an error with your media devices',
        description: `${error.name}: ${error.message}`,
      });
    };
    room.on(RoomEvent.MediaDevicesError, onMediaDevicesError);
    room.on(RoomEvent.Disconnected, onDisconnected);
    return () => {
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.MediaDevicesError, onMediaDevicesError);
    };
  }, [room, refreshConnectionDetails]);

  useEffect(() => {
    let aborted = false;
    if (sessionStarted && room.state === 'disconnected') {
      Promise.all([
        room.localParticipant.setMicrophoneEnabled(true, undefined, {
          preConnectBuffer: appConfig.isPreConnectBufferEnabled,
        }),
        existingOrRefreshConnectionDetails().then((connectionDetails) =>
          room.connect(connectionDetails.serverUrl, connectionDetails.participantToken)
        ),
      ]).catch((error) => {
        if (aborted) {
          return;
        }

        toastAlert({
          title: 'There was an error connecting to the agent',
          description: `${error.name}: ${error.message}`,
        });
      });
    }
    return () => {
      aborted = true;
      room.disconnect();
    };
  }, [room, sessionStarted, appConfig.isPreConnectBufferEnabled, existingOrRefreshConnectionDetails]);

  if (!podcast) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {/* <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Podcast not found</h1>
          <p className="text-muted-foreground mb-6">The requested podcast could not be found.</p>
          <Button onClick={() => window.location.href = '/'} variant="primary">
            Return to Feed
          </Button>
        </div> */}
      </div>
    );
  }

  const formatParticipants = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const { startButtonText } = appConfig;

  return (
    <main>
      {/* Podcast Info Section - Hidden when session is active */}
      {!sessionStarted && (
      <motion.div
        key="podcast-info"
        initial={{ opacity: 1 }}
        animate={{ opacity: sessionStarted ? 0 : 1 }}
        transition={{ duration: 0.5, ease: 'linear', delay: sessionStarted ? 0 : 0.5 }}
        style={{ 
          pointerEvents: sessionStarted ? 'none' : 'auto',
          position: sessionStarted ? 'absolute' : 'relative',
          zIndex: sessionStarted ? 10 : 20
        }}
        className="min-h-screen bg-background"
      >
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="mx-auto max-w-4xl px-4 py-6">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2"
                disabled={sessionStarted}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Feed
              </Button>
              <div className="text-sm text-muted-foreground">
                {sessionStarted ? 'Session Active' : 'Ready to join'}
              </div>
            </div>
          </div>
        </header>

      {/* Podcast Info */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image/Thumbnail */}
            <div className="relative aspect-video md:aspect-square md:w-80 bg-muted flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <svg className="w-16 h-16 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <div className="absolute top-4 right-4 bg-background/90 text-sm font-medium px-3 py-1.5 rounded-full border border-border">
                {podcast.category}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 md:p-8">
              {/* Title and Host */}
              <div className="mb-6">
                <h1 className="font-bold text-foreground text-2xl md:text-3xl leading-tight mb-3">
                  {podcast.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  Hosted by {podcast.host}
                </p>
              </div>

              {/* Poster and Stats */}
              <div className="flex items-center justify-between mb-8">
                {/* Poster */}
                <div className="flex items-center gap-3">
                  <img
                    src={podcast.poster.avatar}
                    alt={podcast.poster.name}
                    className="w-10 h-10 rounded-full border-2 border-border"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {podcast.poster.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Podcast Creator
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {formatParticipants(podcast.participants)} participants
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {formatParticipants(podcast.likes)}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {formatParticipants(podcast.comments)}
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => setSessionStarted(true)}
                  disabled={sessionStarted}
                  className="flex-1 sm:flex-none sm:min-w-48 text-lg py-3"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {startButtonText}
                </Button>
                <div className="text-sm text-muted-foreground self-center">
                  Join the AI-powered conversation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </motion.div>
      )}

      {/* LiveKit Session View - Shows when session is active */}
      {sessionStarted && (
      <RoomContext.Provider value={room}>
        <RoomAudioRenderer />
        <StartAudio label="Start Audio" />
        <MotionSessionView
          key="session-view"
          appConfig={appConfig}
          disabled={!sessionStarted}
          sessionStarted={sessionStarted}
          initial={{ opacity: 0 }}
          animate={{ opacity: sessionStarted ? 1 : 0 }}
          transition={{
            duration: 0.5,
            ease: 'linear',
            delay: sessionStarted ? 0.5 : 0,
          }}
        />
      </RoomContext.Provider>
      )}

      <Toaster />
    </main>
  );
}
