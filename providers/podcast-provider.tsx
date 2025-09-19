'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

// Podcast type definition
interface Podcast {
  id: string;
  title: string;
  description: string;
  host: string;
  category: string;
  participants: number;
  likes: number;
  comments: number;
  image: string;
  poster: {
    name: string;
    avatar: string;
  };
}

// Context type definition
interface PodcastContextType {
  podcasts: Podcast[];
  addPodcast: (podcast: Podcast) => Promise<void>;
  updatePodcast: (id: string, updates: Partial<Podcast>) => Promise<void>;
  deletePodcast: (id: string) => Promise<void>;
  likePodcast: (id: string) => Promise<void>;
  unlikePodcast: (id: string) => Promise<void>;
  addComment: (id: string) => Promise<void>;
  searchPodcasts: (query: string) => Podcast[];
}

// Default podcast data
const defaultPodcasts: Podcast[] = [
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
    image: '/api/placeholder/300/200',
    poster: {
      name: 'Casey Morgan',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=casey'
    }
  }
];

// Create the context
const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

// Custom hook to use the podcast context
export function usePodcasts() {
  const context = useContext(PodcastContext);
  if (!context) {
    throw new Error('usePodcasts must be used within a PodcastProvider');
  }
  return context;
}

// Provider component
interface PodcastProviderProps {
  children: ReactNode;
}

export function PodcastProvider({ children }: PodcastProviderProps) {
  // Use Convex to get podcasts
  const convexPodcasts = useQuery(api.podcasts.getPodcasts) || [];
  
  // Convex mutations
  const createPodcastMutation = useMutation(api.podcasts.createPodcast);
  const updatePodcastMutation = useMutation(api.podcasts.updatePodcast);
  const deletePodcastMutation = useMutation(api.podcasts.deletePodcast);
  const likePodcastMutation = useMutation(api.podcasts.likePodcast);
  const addCommentMutation = useMutation(api.podcasts.addComment);
  const seedPodcastsMutation = useMutation(api.podcasts.seedPodcasts);

  // Local state for search results
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  // Update local state when Convex data changes
  useEffect(() => {
    if (convexPodcasts.length > 0) {
      // Map Convex documents to our Podcast interface (remove _id and _creationTime)
      const mappedPodcasts = convexPodcasts.map(doc => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        host: doc.host,
        category: doc.category,
        participants: doc.participants,
        likes: doc.likes,
        comments: doc.comments,
        image: doc.image,
        poster: doc.poster,
      }));
      setPodcasts(mappedPodcasts);
    } else {
      // If no podcasts in Convex, seed the database
      seedPodcastsMutation({});
    }
  }, [convexPodcasts, seedPodcastsMutation]);

  // Add a new podcast
  const addPodcast = async (podcast: Podcast) => {
    try {
      await createPodcastMutation(podcast);
      // Convex will automatically update the query, no need to manually update state
    } catch (error) {
      console.error('Failed to create podcast:', error);
    }
  };

  // Update an existing podcast
  const updatePodcast = async (id: string, updates: Partial<Podcast>) => {
    try {
      await updatePodcastMutation({ id, updates });
    } catch (error) {
      console.error('Failed to update podcast:', error);
    }
  };

  // Delete a podcast
  const deletePodcast = async (id: string) => {
    try {
      await deletePodcastMutation({ id });
    } catch (error) {
      console.error('Failed to delete podcast:', error);
    }
  };

  // Like a podcast
  const likePodcast = async (id: string) => {
    try {
      await likePodcastMutation({ id });
    } catch (error) {
      console.error('Failed to like podcast:', error);
    }
  };

  // Unlike a podcast (decrease likes) - we'll use updatePodcast for this
  const unlikePodcast = async (id: string) => {
    const podcast = podcasts.find(p => p.id === id);
    if (podcast && podcast.likes > 0) {
      try {
        await updatePodcastMutation({ 
          id, 
          updates: { likes: Math.max(0, podcast.likes - 1) } 
        });
      } catch (error) {
        console.error('Failed to unlike podcast:', error);
      }
    }
  };

  // Add a comment to a podcast
  const addComment = async (id: string) => {
    try {
      await addCommentMutation({ id });
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  // Search podcasts
  const searchPodcasts = (query: string): Podcast[] => {
    if (!query.trim()) return podcasts;
    
    const lowerQuery = query.toLowerCase();
    return podcasts.filter(podcast =>
      podcast.title.toLowerCase().includes(lowerQuery) ||
      podcast.description.toLowerCase().includes(lowerQuery) ||
      podcast.host.toLowerCase().includes(lowerQuery) ||
      podcast.category.toLowerCase().includes(lowerQuery)
    );
  };

  const value: PodcastContextType = {
    podcasts,
    addPodcast,
    updatePodcast,
    deletePodcast,
    likePodcast,
    unlikePodcast,
    addComment,
    searchPodcasts
  };

  return (
    <PodcastContext.Provider value={value}>
      {children}
    </PodcastContext.Provider>
  );
}

// Export the Podcast type for use in other components
export type { Podcast };
