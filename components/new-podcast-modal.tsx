'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface NewPodcastModalProps {
  onClose: () => void;
  onSubmit: (podcast: any) => void;
}

export function NewPodcastModal({ onClose, onSubmit }: NewPodcastModalProps) {
  const [name, setName] = useState('');
  const [topics, setTopics] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !topics.trim()) return;

    setIsSubmitting(true);

    // Generate a random user for the poster
    const userSeeds = ['alice', 'bob', 'charlie', 'diana', 'evan', 'fiona'];
    const randomSeed = userSeeds[Math.floor(Math.random() * userSeeds.length)];
    const userName = name.split(' ')[0] || 'User'; // Use first word of podcast name or 'User'

    const newPodcast = {
      id: Date.now().toString(),
      title: name,
      description: topics,
      host: 'AI Assistant',
      category: 'General',
      participants: 0,
      likes: 0,
      comments: 0,
      image: '/api/placeholder/300/200',
      poster: {
        name: userName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`
      }
    };

    onSubmit(newPodcast);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-medium text-foreground">Create New Podcast</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Podcast Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter podcast name..."
              className="w-full px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="topics" className="block text-sm font-medium text-foreground mb-2">
              Topics
            </label>
            <textarea
              id="topics"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="Describe the topics and knowledge base for this podcast..."
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">
              This will serve as the knowledge/topic base for the AI conversation.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Knowledge Base (Optional)
            </label>
            <button
              type="button"
              disabled
              className="w-full px-3 py-2 border border-border rounded-md bg-muted text-muted-foreground cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload PDF
            </button>
            <p className="mt-1 text-xs text-muted-foreground">
              Upload documents to enhance the AI's knowledge (coming soon).
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!name.trim() || !topics.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creating...' : 'Create Podcast'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
