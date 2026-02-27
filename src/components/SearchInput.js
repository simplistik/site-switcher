import { useRef, useEffect } from '@wordpress/element';

const isMac =
  typeof navigator !== 'undefined' &&
  /Mac|iPhone|iPad|iPod/.test( navigator.userAgent );

const shortcutLabel = isMac ? '\u21E7\u2318K' : 'Ctrl+Shift+K';

const SearchInput = ( { searchTerm, setSearchTerm, onKeyDown } ) => {
  const inputRef = useRef( null );

  useEffect( () => {
    // Auto-focus on mount
    if ( inputRef.current ) {
      inputRef.current.focus();
    }
  }, [] );

  return (
    <div className="tprt-ss-search">
      <svg
        className="tprt-ss-search__icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        ref={inputRef}
        className="tprt-ss-search__input"
        type="text"
        placeholder="Search sites..."
        value={searchTerm}
        onChange={( e ) => setSearchTerm( e.target.value )}
        onKeyDown={onKeyDown}
        aria-label="Search sites"
      />

      {searchTerm && (
        <button
          className="tprt-ss-search__clear"
          onClick={() => setSearchTerm( '' )}
          aria-label="Clear search"
          type="button"
        >
          &times;
        </button>
      )}

      <kbd className="tprt-ss-search__shortcut">{shortcutLabel}</kbd>
    </div>
  );
};

export default SearchInput;
