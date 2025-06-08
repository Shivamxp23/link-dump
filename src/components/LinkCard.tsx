import React from 'react';
import { ExternalLink, X } from 'lucide-react';
import { Link } from './Dashboard';

interface LinkCardProps {
  link: Link;
  onDelete: (id: string) => void;
}

export default function LinkCard({ link, onDelete }: LinkCardProps) {
  const isYouTubeLink = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (videoIdMatch) {
      return `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
    }
    return null;
  };

  const thumbnailUrl = isYouTubeLink(link.url) ? getYouTubeThumbnail(link.url) : null;

  return (
    <div className="metallic-border bg-black rounded-xl overflow-hidden group hover:scale-105 transition-transform duration-300">
      {thumbnailUrl && (
        <div className="relative aspect-video">
          <img
            src={thumbnailUrl}
            alt={link.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4">
            <h3 className="text-white text-sm font-bold">{link.title}</h3>
          </div>
        </div>
      )}
      
      <div className="p-4">
        {!thumbnailUrl && (
          <h3 className="text-white text-sm font-bold mb-2">{link.title}</h3>
        )}
        
        {link.description && (
          <p className="text-gray-400 text-xs mb-4 line-clamp-3 font-medium">{link.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="metallic-icon-button text-black p-2 rounded-full"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          
          <button
            onClick={() => onDelete(link.id)}
            className="metallic-icon-button text-black p-2 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}