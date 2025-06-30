'use client';

import { Bot } from 'lucide-react';
import { useAriaStore } from '@/lib/stores/aria.store';
import { AriaConversationModal } from './AriaConversationModal';

const AriaFloatingButton = () => {
  const { isOpen, toggleAria } = useAriaStore();

  return (
    <>
      <button
        onClick={toggleAria}
        className="fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-2xl transition-transform duration-200 ease-in-out hover:scale-110 active:scale-100"
        aria-label="Open ARIA Assistant"
      >
        <Bot className="h-8 w-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </button>
      <AriaConversationModal />
    </>
  );
};

export default AriaFloatingButton; 