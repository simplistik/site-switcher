import { useState, useCallback } from '@wordpress/element';

const COOKIE_NAME = 'tprt-ss-dark-mode';
const COOKIE_DAYS = 365;

const getCookieDomain = () => window.tprtSiteSwitcher?.cookieDomain || '';

const readPreference = () => {
  try {
    const match = document.cookie.match( new RegExp( `(?:^|;\\s*)${COOKIE_NAME}=([^;]+)` ) );
    return match ? match[ 1 ] === 'true' : false;
  } catch {
    return false;
  }
};

const writePreference = ( isDark ) => {
  try {
    const expires = new Date();
    expires.setDate( expires.getDate() + COOKIE_DAYS );
    const domain = getCookieDomain();
    const domainAttr = domain ? `;domain=${domain}` : '';
    document.cookie = `${COOKIE_NAME}=${isDark ? 'true' : 'false'};expires=${expires.toUTCString()};path=/${domainAttr};SameSite=Lax`;
  } catch {
    // silently ignore
  }
};

const useDarkMode = () => {
  const [ isDark, setIsDark ] = useState( readPreference );

  const toggleDarkMode = useCallback( () => {
    setIsDark( ( prev ) => {
      const next = !prev;
      writePreference( next );
      return next;
    } );
  }, [] );

  return { isDark, toggleDarkMode };
};

export default useDarkMode;
