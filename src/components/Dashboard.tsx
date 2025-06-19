import React, { useState, useEffect } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import LinkCard from './LinkCard';
import AddLinkModal from './AddLinkModal';
import { supabase, Link } from '../lib/supabase';

interface DashboardProps {
  onLogout: () => void;
  userRole: 'viewer' | 'admin';
}

export default function Dashboard({ onLogout, userRole }: DashboardProps) {
  const [links, setLinks] = useState<Link[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = userRole === 'admin';

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
        
        const isRound = element.classList.contains('rounded-full') || 
                       (Math.abs(rect.width - rect.height) < 5);
        
        if (isRound) {
          const size = Math.max(rect.width, rect.height) + 8;
          cursor.style.left = rect.left + rect.width/2 - size/2 + 'px';
          cursor.style.top = rect.top + rect.height/2 - size/2 + 'px';
          cursor.style.width = size + 'px';
          cursor.style.height = size + 'px';
          cursor.style.borderRadius = '50%';
        } else {
          cursor.style.left = rect.left - 4 + 'px';
          cursor.style.top = rect.top - 4 + 'px';
          cursor.style.width = rect.width + 8 + 'px';
          cursor.style.height = rect.height + 8 + 'px';
          cursor.style.borderRadius = '8px';
        }
      } else {
        cursor.classList.remove('hover');
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.borderRadius = '50%';
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

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setLinks(data || []);
    } catch (err) {
      console.error('Error loading links:', err);
      setError('Failed to load links. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addLink = async (linkData: Omit<Link, 'id' | 'created_at' | 'user_id'>) => {
    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('links')
        .insert([{ ...linkData, user_id: null }])
        .select()
        .single();

      if (error) throw error;
      
      setLinks(prev => [data, ...prev]);
    } catch (err) {
      console.error('Error adding link:', err);
      setError('Failed to add link. Please try again.');
      throw err;
    }
  };

  const deleteLink = async (id: string) => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setLinks(prev => prev.filter(link => link.id !== id));
    } catch (err) {
      console.error('Error deleting link:', err);
      setError('Failed to delete link. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
          <p className="text-gray-400">loading your links...</p>
        </div>
      </div>
    );
  }

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

      {/* Error Message */}
      {error && (
        <div className="p-6">
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {links.length === 0 ? (
          <div className="text-center py-20">
            {isAdmin && (
              <>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="metallic-button w-20 h-20 text-black rounded-full flex items-center justify-center text-2xl"
                >
                  <Plus className="w-10 h-10" />
                </button>
                <p className="text-gray-600 mt-6 font-medium">start your collection</p>
              </>
            )}
            {!isAdmin && (
              <p className="text-gray-600 font-medium">no links available</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link) => (
              <LinkCard 
                key={link.id} 
                link={link} 
                onDelete={deleteLink} 
                canDelete={isAdmin}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Button */}
      {links.length > 0 && isAdmin && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="metallic-button fixed bottom-6 right-6 w-16 h-16 text-black rounded-full flex items-center justify-center"
        >
          <Plus className="w-8 h-8" />
        </button>
      )}

      {/* Modal */}
      {isAdmin && (
        <AddLinkModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={addLink}
        />
      )}
    </div>
  );
}