import React, { useEffect, useRef } from 'react';

interface ScrollbarProps {
  paddingLeft?: string;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
}

const Scrollbar: React.FC<ScrollbarProps> = ({ paddingLeft = '2', position, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!position) {
    position = 'right';
  }

  useEffect(() => {
    const container = containerRef.current;
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      if (container) {
        container.classList.add('scrollbar-visible');
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          container.classList.remove('scrollbar-visible');
        }, 1000);
      }
    };

    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`scrollbar-container scrollbar-hidden scrollbar scrollbar-${position} pl-${paddingLeft}`}>
      {children}
    </div>
  );
};

export { Scrollbar };