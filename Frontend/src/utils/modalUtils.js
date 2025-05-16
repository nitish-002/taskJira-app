/**
 * Utility functions for modals
 */

// Check if a click is outside an element
export const isClickOutside = (event, elementRef) => {
  return elementRef.current && !elementRef.current.contains(event.target);
};

// Function to prevent body scroll when modal is open
export const preventBodyScroll = (shouldPrevent) => {
  if (shouldPrevent) {
    // Save current scroll position
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.dataset.scrollPosition = scrollY;
  } else {
    // Restore scroll position
    const scrollY = document.body.dataset.scrollPosition || 0;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, parseInt(scrollY || '0'));
    delete document.body.dataset.scrollPosition;
  }
};

// Create a focus trap for accessibility
export const trapFocus = (modalRef) => {
  if (!modalRef.current) return;
  
  // Get all focusable elements
  const focusableElements = modalRef.current.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  // Focus the first element
  firstElement.focus();
  
  // Set up the focus trap
  modalRef.current.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab - if focused on first element, move to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab - if focused on last element, move to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  });
};

// Close modals on escape key
export const setupEscapeKey = (callback) => {
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      callback();
    }
  };
  
  window.addEventListener('keydown', handleEsc);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('keydown', handleEsc);
  };
};
