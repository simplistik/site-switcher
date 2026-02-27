import { useState, useCallback } from '@wordpress/element';

const MAX_RECENT = 5;

const getStorageKey = () =>
  `tprt-ss-recent-${window.tprtSiteSwitcher?.userId || 0}`;

const readRecent = () => {
  try {
    const stored = localStorage.getItem( getStorageKey() );
    return stored ? JSON.parse( stored ) : [];
  } catch {
    return [];
  }
};

const writeRecent = ( ids ) => {
  try {
    localStorage.setItem( getStorageKey(), JSON.stringify( ids ) );
  } catch {
    // localStorage full or unavailable — silently ignore
  }
};

const useRecentSites = () => {
  const [ recentSiteIds, setRecentSiteIds ] = useState( readRecent );

  const addRecentSite = useCallback( ( blogId ) => {
    setRecentSiteIds( ( prev ) => {
      const filtered = prev.filter( ( id ) => id !== blogId );
      const next = [ blogId, ...filtered ].slice( 0, MAX_RECENT );
      writeRecent( next );
      return next;
    } );
  }, [] );

  return { recentSiteIds, addRecentSite };
};

export default useRecentSites;
