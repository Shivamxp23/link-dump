import React from 'react';
import { ExternalLink, X, Edit } from 'lucide-react';
import { Link } from '../lib/supabase';

interface LinkCardProps {
  link: Link;
  onDelete: (id: string) => void;
  onEdit: (link: Link) => void;
  canDelete: boolean;
  canEdit: boolean;
}

function extractVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1);
    }
    if (parsedUrl.hostname.includes("youtube.com")) {
      return parsedUrl.searchParams.get("v");
    }
  } catch (err) {
    return null;
  }
  return null;
}

export default function LinkCard({ link, onDelete, onEdit, canDelete, canEdit }: LinkCardProps) {
  return (
    <div className="metallic-border bg-black rounded-xl overflow-hidden group hover:scale-105 transition-transform duration-300">
      {/* YouTube thumbnail if applicable */}
      {extractVideoId(link.url) && (
        <div className="relative aspect-video flex items-center justify-center bg-neutral-900">
          <img
            src={`https://img.youtube.com/vi/${extractVideoId(link.url)}/hqdefault.jpg`}
            alt="YouTube Thumbnail"
            className="w-full h-full object-cover"
            style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-white text-sm font-bold mb-2">{link.title}</h3>
        {link.description && (
          <p className="text-gray-400 text-xs mb-4 line-clamp-3 font-medium">
            {link.description}
          </p>
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
          <div className="flex gap-2">
            {canEdit && (
              <button
                onClick={() => onEdit(link)}
                className="metallic-icon-button text-black p-2 rounded-full"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(link.id)}
                className="metallic-icon-button text-black p-2 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}