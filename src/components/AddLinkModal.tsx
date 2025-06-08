import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (link: { url: string; title: string; description: string }) => void;
}

export default function AddLinkModal({ isOpen, onClose, onAdd }: AddLinkModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim()) return;

    onAdd({
      url: url.trim(),
      title: title.trim(),
      description: description.trim(),
    });
    
    setUrl('');
    setTitle('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="metallic-border bg-black w-full max-w-md rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-900">
          <h2 className="experimental-text text-xl">add link</h2>
          <button
            onClick={onClose}
            className="metallic-icon-button text-black p-2 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="url"
            className="metallic-input w-full px-4 py-3 bg-black rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all"
            required
          />

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title"
            className="metallic-input w-full px-4 py-3 bg-black rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all"
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="description (optional)"
            rows={3}
            maxLength={500}
            className="metallic-input w-full px-4 py-3 bg-black rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all resize-none"
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="metallic-button flex-1 py-3 text-black font-bold rounded-xl"
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={!url.trim() || !title.trim()}
              className="metallic-button flex-1 py-3 text-black font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}