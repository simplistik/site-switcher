import { useCallback, useMemo, useState, useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Strip protocol from a URL for display.
 * "https://floridahealth.tprt/alachua/" → "floridahealth.tprt/alachua"
 */
const formatUrl = ( url ) => {
  if ( !url ) return '';
  return url.replace( /^https?:\/\//, '' ).replace( /\/$/, '' );
};

const MENU_ITEMS = [
  { key: 'new-post', label: __( 'New Post', 'tprt-site-switcher' ) },
];

const SiteItem = ( {
  site,
  isActive,
  isCurrent,
  index,
  onSiteClick,
  onMouseEnter,
  showBlogId,
} ) => {
  const [ menuOpen, setMenuOpen ] = useState( false );
  const [ menuAbove, setMenuAbove ] = useState( false );
  const menuRef = useRef( null );
  const kebabRef = useRef( null );
  const displayUrl = useMemo( () => formatUrl( site.siteUrl ), [ site.siteUrl ] );

  const handleVisit = useCallback(
    ( e ) => {
      e.preventDefault();
      e.stopPropagation();
      onSiteClick( site, 'visit' );
    },
    [ site, onSiteClick ],
  );

  const handleKebabClick = useCallback(
    ( e ) => {
      e.preventDefault();
      e.stopPropagation();
      setMenuOpen( ( prev ) => {
        if ( !prev && kebabRef.current ) {
          const btn = kebabRef.current;
          const list = btn.closest( '.tprt-ss-list' );
          if ( list ) {
            const listRect = list.getBoundingClientRect();
            const btnRect = btn.getBoundingClientRect();
            const spaceBelow = listRect.bottom - btnRect.bottom;
            setMenuAbove( spaceBelow < 60 );
          }
        }
        return !prev;
      } );
    },
    [],
  );

  const handleMenuAction = useCallback(
    ( e, actionKey ) => {
      e.preventDefault();
      e.stopPropagation();
      setMenuOpen( false );
      onSiteClick( site, actionKey );
    },
    [ site, onSiteClick ],
  );

  // Close menu on outside click
  useEffect( () => {
    if ( !menuOpen ) return;

    const handleClickOutside = ( e ) => {
      if (
        menuRef.current && !menuRef.current.contains( e.target ) &&
        kebabRef.current && !kebabRef.current.contains( e.target )
      ) {
        setMenuOpen( false );
      }
    };

    document.addEventListener( 'mousedown', handleClickOutside );
    return () => document.removeEventListener( 'mousedown', handleClickOutside );
  }, [ menuOpen ] );

  // Close menu on Escape
  useEffect( () => {
    if ( !menuOpen ) return;

    const handleEsc = ( e ) => {
      if ( e.key === 'Escape' ) {
        e.stopPropagation();
        setMenuOpen( false );
        kebabRef.current?.focus();
      }
    };

    document.addEventListener( 'keydown', handleEsc );
    return () => document.removeEventListener( 'keydown', handleEsc );
  }, [ menuOpen ] );

  const className = [
    'tprt-ss-item',
    isActive ? 'tprt-ss-item--active' : '',
    isCurrent ? 'tprt-ss-item--current' : '',
  ]
    .filter( Boolean )
    .join( ' ' );

  return (
    <div
      className={className}
      data-index={index}
      onMouseEnter={() => onMouseEnter( index )}
      onMouseLeave={() => setMenuOpen( false )}
      onClick={( e ) => {
        e.preventDefault();
        e.stopPropagation();
        onSiteClick( site, 'dashboard' );
      }}
      role="option"
      aria-selected={isActive}
    >
      <div className="tprt-ss-item__content">
        <span className="tprt-ss-item__name">
          <span className="tprt-ss-item__name-text">{site.name}</span>
          {isCurrent && (
            <span className="tprt-ss-item__current-badge">Current</span>
          )}
        </span>
        <span className="tprt-ss-item__meta">
          <span className="tprt-ss-item__url">{displayUrl}</span>
          {showBlogId && (
            <span className="tprt-ss-item__id">ID: {site.blogId}</span>
          )}
        </span>
      </div>

      <div className="tprt-ss-item__actions">
        <button
          className="tprt-ss-item__action"
          onClick={( e ) => {
            e.preventDefault();
            e.stopPropagation();
            onSiteClick( site, 'dashboard' );
          }}
          type="button"
          aria-label={__( 'Dashboard', 'tprt-site-switcher' )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span className="tprt-ss-item__tooltip">
            {__( 'Dashboard', 'tprt-site-switcher' )}
          </span>
        </button>

        <button
          className="tprt-ss-item__action"
          onClick={handleVisit}
          type="button"
          aria-label={__( 'Visit Site', 'tprt-site-switcher' )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          <span className="tprt-ss-item__tooltip">
            {__( 'Visit Site', 'tprt-site-switcher' )}
          </span>
        </button>

        <div className="tprt-ss-item__kebab-wrapper">
          <button
            ref={kebabRef}
            className={`tprt-ss-item__action tprt-ss-item__action--kebab${menuOpen ? ' tprt-ss-item__action--menu-open' : ''}`}
            onClick={handleKebabClick}
            type="button"
            aria-label={__( 'More actions', 'tprt-site-switcher' )}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {menuOpen && (
            <div
              ref={menuRef}
              className={`tprt-ss-menu${menuAbove ? ' tprt-ss-menu--above' : ''}`}
              role="menu"
            >
              {MENU_ITEMS.map( ( item ) => (
                <button
                  key={item.key}
                  className="tprt-ss-menu__item"
                  onClick={( e ) => handleMenuAction( e, item.key )}
                  type="button"
                  role="menuitem"
                >
                  {item.label}
                </button>
              ) )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteItem;
