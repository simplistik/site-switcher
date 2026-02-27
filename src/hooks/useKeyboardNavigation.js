import { useState, useCallback, useEffect, useRef } from '@wordpress/element';

const useKeyboardNavigation = ( items, { onSelect, onClose } ) => {
  const [ activeIndex, setActiveIndex ] = useState( 0 );
  const listRef = useRef( null );

  // Reset active index when items change
  useEffect( () => {
    setActiveIndex( 0 );
  }, [ items ] );

  // Scroll active item into view
  useEffect( () => {
    if ( !listRef.current ) return;

    const activeEl = listRef.current.querySelector(
      `[data-index="${activeIndex}"]`,
    );

    if ( activeEl ) {
      activeEl.scrollIntoView( { block: 'nearest' } );
    }
  }, [ activeIndex ] );

  const handleKeyDown = useCallback(
    ( e ) => {
      if ( !items.length ) return;

      switch ( e.key ) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex( ( prev ) =>
            prev < items.length - 1 ? prev + 1 : 0,
          );
          break;

        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex( ( prev ) =>
            prev > 0 ? prev - 1 : items.length - 1,
          );
          break;

        case 'Enter':
          e.preventDefault();
          if ( items[ activeIndex ] ) {
            onSelect( items[ activeIndex ] );
          }
          break;

        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [ items, activeIndex, onSelect, onClose ],
  );

  return { activeIndex, setActiveIndex, handleKeyDown, listRef };
};

export default useKeyboardNavigation;
