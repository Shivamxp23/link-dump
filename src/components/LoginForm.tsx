import React, { useState, useEffect } from 'react';

interface LoginFormProps {
  onLogin: (role: 'viewer' | 'admin') => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const moveCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isButton = target.tagName === 'BUTTON' || target.closest('button');
      
      if (isButton && target.closest('button')) {
        cursor.classList.add('hover');
        const button = target.closest('button')!;
        const rect = button.getBoundingClientRect();
        
        const isRound = button.classList.contains('rounded-full') || 
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123') {
      onLogin('viewer');
      setError('');
    } else if (password === '456') {
      onLogin('admin');
      setError('');
    } else {
      setError('invalid password');
    }
  };

  return (
    <div className="min-h-screen bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="metallic-input w-full px-4 py-4 bg-black rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all text-lg"
          />
          
          {error && (
            <p className="text-red-500 text-sm text-center font-medium">{error}</p>
          )}
          
          <button
            type="submit"
            className="metallic-button w-full py-4 text-black font-bold rounded-xl text-lg"
          >
            enter
          </button>
        </form>
      </div>
    </div>
  );
}