import { useEffect, useCallback } from '@wordpress/element';
import useSiteSwitcher from '@hooks/useSiteSwitcher';
import useKeyboardNavigation from '@hooks/useKeyboardNavigation';
import useDarkMode from '@hooks/useDarkMode';
import SearchInput from './SearchInput';
import NetworkAdmin from './NetworkAdmin';
import SiteList from './SiteList';
import KeyboardHint from './KeyboardHint';

const SiteSwitcherModal = () => {
  const {
    isOpen,
    close,
    toggle,
    searchTerm,
    setSearchTerm,
    currentSite,
    recentSites,
    otherSites,
    filteredSites,
    allVisibleItems,
    totalSiteCount,
    addRecentSite,
    isNetworkAdmin,
    networkAdminUrl,
  } = useSiteSwitcher();

  const { isDark, toggleDarkMode } = useDarkMode();

  const handleSelect = useCallback(
    ( site ) => {
      addRecentSite( site.blogId );
      window.location.href = site.adminUrl;
    },
    [ addRecentSite ],
  );

  const { activeIndex, setActiveIndex, handleKeyDown, listRef } =
    useKeyboardNavigation( allVisibleItems, {
      onSelect: handleSelect,
      onClose: close,
    } );

  const handleSiteClick = useCallback(
    ( site, action ) => {
      addRecentSite( site.blogId );

      switch ( action ) {
        case 'visit':
          window.open( site.siteUrl, '_blank' );
          close();
          break;
        case 'new-post':
          window.location.href = site.adminUrl + 'post-new.php';
          break;
        case 'dashboard':
        default:
          window.location.href = site.adminUrl;
          break;
      }
    },
    [ addRecentSite, close ],
  );

  // Intercept admin bar "My Sites" click
  useEffect( () => {
    const mySitesLink = document.querySelector(
      '#wp-admin-bar-my-sites > .ab-item',
    );

    if ( !mySitesLink ) return;

    const handleClick = ( e ) => {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    };

    mySitesLink.addEventListener( 'click', handleClick );
    return () => mySitesLink.removeEventListener( 'click', handleClick );
  }, [ toggle ] );

  // Global keyboard shortcut: Cmd+Shift+K / Ctrl+Shift+K
  useEffect( () => {
    const handleGlobalKeyDown = ( e ) => {
      if ( ( e.metaKey || e.ctrlKey ) && e.shiftKey && e.key === 'k' ) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener( 'keydown', handleGlobalKeyDown );
    return () => document.removeEventListener( 'keydown', handleGlobalKeyDown );
  }, [ toggle ] );

  // Lock body scroll when open
  useEffect( () => {
    if ( isOpen ) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [ isOpen ] );

  // Focus the admin bar item when closing
  useEffect( () => {
    if ( !isOpen ) {
      const mySitesLink = document.querySelector(
        '#wp-admin-bar-my-sites > .ab-item',
      );
      if ( mySitesLink ) mySitesLink.focus();
    }
  }, [ isOpen ] );

  if ( !isOpen ) return null;

  return (
    <div className="tprt-ss-overlay" onClick={close} role="presentation">
      <div
        className={`tprt-ss-modal${isDark ? ' tprt-ss-dark' : ''}`}
        onClick={( e ) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Site Switcher"
      >
        <div className="tprt-ss-header">
          <span className="dashicons dashicons-admin-multisite tprt-ss-header__icon" aria-hidden="true" />
          <span className="tprt-ss-header__title">My Sites</span>
          <span className="tprt-ss-header__count">{totalSiteCount}</span>
          <button
            className="tprt-ss-header__theme-toggle"
            onClick={toggleDarkMode}
            type="button"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>

        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onKeyDown={handleKeyDown}
        />

        {isNetworkAdmin && !searchTerm.trim() && (
          <NetworkAdmin networkAdminUrl={networkAdminUrl} />
        )}

        <SiteList
          currentSite={searchTerm.trim() ? null : currentSite}
          recentSites={recentSites}
          otherSites={otherSites}
          filteredSites={filteredSites}
          searchTerm={searchTerm}
          activeIndex={activeIndex}
          onSiteClick={handleSiteClick}
          onSetActiveIndex={setActiveIndex}
          listRef={listRef}
          showBlogId={isNetworkAdmin}
        />

        <KeyboardHint />
      </div>
    </div>
  );
};

export default SiteSwitcherModal;
