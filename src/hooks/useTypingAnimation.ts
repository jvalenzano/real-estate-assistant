import { useState, useEffect, useCallback } from 'react';

interface UseTypingAnimationOptions {
  text: string;
  speed?: 'fast' | 'normal' | 'instant';
  delay?: number;
  onComplete?: () => void;
}

interface UseTypingAnimationReturn {
  displayText: string;
  isTyping: boolean;
  isComplete: boolean;
  showCursor: boolean;
  reset: () => void;
}

export const useTypingAnimation = ({
  text,
  speed = 'normal',
  delay = 0,
  onComplete
}: UseTypingAnimationOptions): UseTypingAnimationReturn => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Speed configurations
  const getTypingSpeed = useCallback(() => {
    switch (speed) {
      case 'fast':
        return 50; // 50ms per character
      case 'instant':
        return 0; // No delay
      case 'normal':
      default:
        return 100; // 100ms per character
    }
  }, [speed]);

  // Reset function
  const reset = useCallback(() => {
    setDisplayText('');
    setIsTyping(false);
    setIsComplete(false);
    setShowCursor(true);
  }, []);

  // Cursor blinking effect
  useEffect(() => {
    if (!isComplete) {
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(cursorInterval);
    } else {
      setShowCursor(false);
    }
  }, [isComplete]);

  // Main typing animation effect
  useEffect(() => {
    if (!text) return;

    const startTyping = () => {
      setIsTyping(true);
      
      if (speed === 'instant') {
        // Instant mode: show all text immediately
        setDisplayText(text);
        setIsTyping(false);
        setIsComplete(true);
        onComplete?.();
        return;
      }

      // Progressive typing
      const typingSpeed = getTypingSpeed();
      let index = 0;

      const typeNextCharacter = () => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
          
          // Add slight random variation to make it feel more human
          const variation = Math.random() * 50 - 25; // ±25ms variation
          const nextDelay = Math.max(typingSpeed + variation, 20);
          
          setTimeout(typeNextCharacter, nextDelay);
        } else {
          // Typing complete
          setIsTyping(false);
          setIsComplete(true);
          onComplete?.();
        }
      };

      typeNextCharacter();
    };

    // Start typing after initial delay
    const timer = setTimeout(startTyping, delay);
    return () => clearTimeout(timer);
  }, [text, speed, delay, onComplete, getTypingSpeed]);

  return {
    displayText,
    isTyping,
    isComplete,
    showCursor,
    reset
  };
}; 