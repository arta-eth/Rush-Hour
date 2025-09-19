'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Podcast {
  id: string;
  title: string;
  description: string;
  host: string;
  category: string;
  participants: number;
  likes: number;
  comments: number;
  tags: string[];
  image: string;
  poster: {
    name: string;
    avatar: string;
  };
}

interface PodcastCardProps {
  podcast: Podcast;
}

export function PodcastCard({ podcast }: PodcastCardProps) {
  const formatParticipants = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20">
      {/* Mobile/Tablet Layout */}
      <div className="flex flex-col sm:flex-row">
        {/* Image/Thumbnail */}
        <div className="relative aspect-video sm:aspect-square sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-muted flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary opacity-60 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
            >
              <path
                d="M15 24V40C15 40.7957 14.6839 41.5587 14.1213 42.1213C13.5587 42.6839 12.7956 43 12 43C11.2044 43 10.4413 42.6839 9.87868 42.1213C9.31607 41.5587 9 40.7957 9 40V24C9 23.2044 9.31607 22.4413 9.87868 21.8787C10.4413 21.3161 11.2044 21 12 21C12.7956 21 13.5587 21.3161 14.1213 21.8787C14.6839 22.4413 15 23.2044 15 24ZM22 5C21.2044 5 20.4413 5.31607 19.8787 5.87868C19.3161 6.44129 19 7.20435 19 8V56C19 56.7957 19.3161 57.5587 19.8787 58.1213C20.4413 58.6839 21.2044 59 22 59C22.7956 59 23.5587 58.6839 24.1213 58.1213C24.6839 57.5587 25 56.7957 25 56V8C25 7.20435 24.6839 6.44129 24.1213 5.87868C23.5587 5.31607 22.7956 5 22 5ZM32 13C31.2044 13 30.4413 13.3161 29.8787 13.8787C29.3161 14.4413 29 15.2044 29 16V48C29 48.7957 29.3161 49.5587 29.8787 50.1213C30.4413 50.6839 31.2044 51 32 51C32.7956 51 33.5587 50.6839 34.1213 50.1213C34.6839 49.5587 35 48.7957 35 48V16C35 15.2044 34.6839 14.4413 34.1213 13.8787C33.5587 13.3161 32.7956 13 32 13ZM42 21C41.2043 21 40.4413 21.3161 39.8787 21.8787C39.3161 22.4413 39 23.2044 39 24V40C39 40.7957 39.3161 41.5587 39.8787 42.1213C40.4413 42.6839 41.2043 43 42 43C42.7957 43 43.5587 42.6839 44.1213 42.1213C44.6839 41.5587 45 40.7957 45 40V24C45 23.2044 44.6839 22.4413 44.1213 21.8787C43.5587 21.3161 42.7957 21 42 21ZM52 17C51.2043 17 50.4413 17.3161 49.8787 17.8787C49.3161 18.4413 49 19.2044 49 20V44C49 44.7957 49.3161 45.5587 49.8787 46.1213C50.4413 46.6839 51.2043 47 52 47C52.7957 47 53.5587 46.6839 54.1213 46.1213C54.6839 45.5587 55 44.7957 55 44V20C55 19.2044 54.6839 18.4413 54.1213 17.8787C53.5587 17.3161 52.7957 17 52 17Z"
                fill="currentColor"
              />
            </svg>
          </div>
          
          {/* Category badge */}
          <div className="absolute top-2 right-2 bg-background/90 text-xs font-medium px-2 py-1 rounded-full border border-border">
            {podcast.category}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-3 lg:p-4">
          {/* Title and Host */}
          <div className="mb-2 sm:mb-3">
            <h3 className="font-medium text-foreground text-base sm:text-lg leading-tight mb-1 line-clamp-2">
              {podcast.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              Hosted by {podcast.host}
            </p>
          </div>

          {/* Description - Hidden on small screens */}
          <p className="hidden sm:block text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
            {podcast.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {podcast.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-bgAccentPrimary text-fgAccent px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Poster and Stats */}
          <div className="flex items-center justify-between mb-3">
            {/* Poster */}
            <div className="flex items-center gap-2">
              <img
                src={podcast.poster.avatar}
                alt={podcast.poster.name}
                className="w-6 h-6 rounded-full border border-border"
              />
              <span className="text-xs text-muted-foreground">
                {podcast.poster.name}
              </span>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {formatParticipants(podcast.likes)}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {formatParticipants(podcast.comments)}
              </span>
            </div>
          </div>

          {/* Action */}
          <div className="mt-4 sm:mt-3">
            <Button 
              variant="primary" 
              size="sm" 
              className="w-full sm:w-auto"
              onClick={() => window.location.href = `/session?podcast=${podcast.id}`}
            >
              Start Conversation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
