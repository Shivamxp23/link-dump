import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import LinkCard from './LinkCard';
import AddLinkModal from './AddLinkModal';

export interface Link {
  id: string;
  url: string;
  title: string;
  description: string;
  createdAt: Date;
}

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [links, setLinks] = useState<Link[]>(() => {
    const saved = localStorage.getItem('arte-links');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const moveCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a');
      
      if (isInteractive) {
        cursor.classList.add('hover');
        const element = target.closest('button') || target.closest('a') || target;
        const rect = element.getBoundingClientRect();
        cursor.style.left = rect.left - 4 + 'px';
        cursor.style.top = rect.top - 4 + 'px';
        cursor.style.width = rect.width + 8 + 'px';
        cursor.style.height = rect.height + 8 + 'px';
      } else {
        cursor.classList.remove('hover');
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.width = '20px';
        cursor.style.height = '20px';
      }
    };

    document.addEventListener('mousemove', moveCursor);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      if (document.body.contains(cursor)) {
        document.body.removeChild(cursor);
      }
    };
  }, []);

  const saveLinks = (newLinks: Link[]) => {
    setLinks(newLinks);
    localStorage.setItem('arte-links', JSON.stringify(newLinks));
  };

  const addLink = (linkData: Omit<Link, 'id' | 'createdAt'>) => {
    const newLink: Link = {
      ...linkData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    const updatedLinks = [newLink, ...links];
    saveLinks(updatedLinks);
  };

  const deleteLink = (id: string) => {
    const updatedLinks = links.filter(link => link.id !== id);
    saveLinks(updatedLinks);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-900 p-6">
        <div className="flex items-center justify-between">
          <h1 className="experimental-text text-2xl">links</h1>
          <button
            onClick={onLogout}
            className="metallic-icon-button text-black p-3 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {links.length === 0 ? (
          <div className="text-center py-20">
            <button
              onClick={() => setIsModalOpen(true)}
              className="metallic-button w-20 h-20 text-black rounded-full flex items-center justify-center text-2xl"
            >
              <Plus className="w-10 h-10" />
            </button>
            <p className="text-gray-600 mt-6 font-medium">start your collection</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link) => (
              <LinkCard key={link.id} link={link} onDelete={deleteLink} />
            ))}
          </div>
        )}
      </div>

      {/* Add Button */}
      {links.length > 0 && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="metallic-button fixed bottom-6 right-6 w-16 h-16 text-black rounded-full flex items-center justify-center"
        >
          <Plus className="w-8 h-8" />
        </button>
      )}

      {/* Modal */}
      <AddLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addLink}
      />
    </div>
  );
}