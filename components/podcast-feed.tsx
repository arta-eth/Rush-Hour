'use client';

import { useState } from 'react';
import { PodcastCard } from './podcast-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mock podcast data
const mockPodcasts = [
  {
    id: '1',
    title: 'Tech Talk with AI Sarah',
    description:
      "Dive deep into the latest technology trends, startups, and innovation with Sarah, an AI expert who's been following the tech scene for years.",
    host: 'AI Sarah',
    category: 'Technology',
    participants: 1247,
    likes: 324,
    comments: 89,
    tags: ['AI', 'Startups', 'Innovation'],
    image: '/api/placeholder/300/200',
    poster: {
      name: 'Alex Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'
    }
  },
  {
    id: '2',
    title: 'The Philosophy Corner',
    description:
      "Explore life's biggest questions with Marcus, an AI philosopher who loves debating ethics, consciousness, and the meaning of existence.",
    host: 'AI Marcus',
    category: 'Philosophy',
    participants: 892,
    likes: 198,
    comments: 156,
    tags: ['Ethics', 'Consciousness', 'Debate'],
    image: '/api/placeholder/300/200',
    poster: {
      name: 'Maya Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya'
    }
  },
  {
    id: '3',
    title: 'Creative Writing Workshop',
    description:
      'Join Luna for interactive storytelling sessions where you collaborate to create amazing stories, poems, and creative pieces.',
    host: 'AI Luna',
    category: 'Arts & Creativity',
    participants: 643,
    likes: 445,
    comments: 73,
    tags: ['Writing', 'Storytelling', 'Creative'],
    image: '/api/placeholder/300/200',
    poster: {
      name: 'Jordan Kim',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan'
    }
  },
  {
    id: '4',
    title: 'Business Strategy Sessions',
    description:
      'Get insights on entrepreneurship, business strategy, and market analysis from Alex, an AI with extensive business knowledge.',
    host: 'AI Alex',
    category: 'Business',
    participants: 1089,
    likes: 267,
    comments: 124,
    tags: ['Strategy', 'Entrepreneurship', 'Markets'],
    image: '/api/placeholder/300/200',
    poster: {
      name: 'Sam Taylor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sam'
    }
  },
  {
    id: '5',
    title: 'Science Discoveries',
    description:
      'Explore the latest scientific breakthroughs, space exploration, and fascinating discoveries with Dr. Nova, your AI science guide.',
    host: 'AI Dr. Nova',
    category: 'Science',
    participants: 756,
    likes: 512,
    comments: 98,
    tags: ['Research', 'Space', 'Discovery'],
    image: '/api/placeholder/300/200',
    poster: {
      name: 'Dr. Riley Park',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=riley'
    }
  },
  {
    id: '6',
    title: 'Mental Wellness Chat',
    description:
      'A supportive space to discuss mental health, mindfulness, and personal growth with Zen, a compassionate AI counselor.',
    host: 'AI Zen',
    category: 'Health & Wellness',
    participants: 934,
    likes: 389,
    comments: 167,
    tags: ['Mental Health', 'Mindfulness', 'Growth'],
    image: '/api/placeholder/300/200',
    poster: {
      name: 'Casey Morgan',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=casey'
    }
  },
];

export function PodcastFeed() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPodcasts = mockPodcasts.filter((podcast) => {
    const matchesSearch =
      podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      podcast.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      podcast.host.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="border-separator1 bg-card border-b">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="text-center">
            <h1 className="text-foreground text-4xl font-bold tracking-tight">Rush Hour</h1>
          </div>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-2xl">
            <input
              type="text"
              placeholder="Search podcasts, hosts, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-border bg-input focus:ring-primary/20 focus:border-primary w-full rounded-full border px-4 py-3 text-base focus:ring-2 focus:outline-none"
            />
          </div>
        </div>
      </div>


      {/* Podcasts Feed */}
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="space-y-4 sm:space-y-6">
          {filteredPodcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPodcasts.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-muted-foreground">
              <svg
                className="mx-auto mb-4 h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              <h3 className="mb-2 text-lg font-medium">No podcasts found</h3>
              <p>Try adjusting your search or category filter</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
