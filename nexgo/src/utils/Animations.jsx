import { useEffect, useRef, useState } from "react";

// Hook to detect when an element is visible on screen
export const useElementOnScreen = (options, triggerOnce = true) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (triggerOnce && containerRef.current) {
          observer.unobserve(containerRef.current);
        }
      } else if (!triggerOnce) {
        setIsVisible(false);
      }
    }, options);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [options, triggerOnce]);

  return { containerRef, isVisible };
};

// Hook to handle staggered animation sequences
export const useAnimationSequence = (items, delay = 100, startDelay = 0) => {
  const [visibleItems, setVisibleItems] = useState(Array(items.length).fill(false));

  useEffect(() => {
    const timeouts = [];

    // Reset visibility state when items change
    setVisibleItems(Array(items.length).fill(false));

    items.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisibleItems((prev) => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, startDelay + index * delay);

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [items, delay, startDelay]);

  return visibleItems;
};
