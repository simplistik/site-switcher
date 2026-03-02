import { useState, useCallback } from '@wordpress/element';

const MAX_RECENT = 5;
const COOKIE_DAYS = 365;

const getCookieName = () =>
  `tprt-ss-recent-${window.tprtSiteSwitcher?.userId || 0}`;

const getCookieDomain = () => window.tprtSiteSwitcher?.cookieDomain || '';

const readRecent = () => {
  try {
    const name = getCookieName();
    const match = document.cookie.match( new RegExp( `(?:^|;\\s*)${name}=([^;]+)` ) );
    return match ? JSON.parse( decodeURIComponent( match[ 1 ] ) ) : [];
  } catch {
    return [];
  }
};

const writeRecent = ( ids ) => {
  try {
    const expires = new Date();
    expires.setDate( expires.getDate() + COOKIE_DAYS );
    const domain = getCookieDomain();
    const domainAttr = domain ? `;domain=${domain}` : '';
    document.cookie = `${getCookieName()}=${encodeURIComponent( JSON.stringify( ids ) )};expires=${expires.toUTCString()};path=/${domainAttr};SameSite=Lax`;
  } catch {
    // silently ignore
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
