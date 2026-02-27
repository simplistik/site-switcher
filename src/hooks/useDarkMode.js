import { useState, useCallback } from '@wordpress/element';

const STORAGE_KEY = 'tprt-ss-dark-mode';

const readPreference = () => {
  try {
    return localStorage.getItem( STORAGE_KEY ) === 'true';
  } catch {
    return false;
  }
};

const writePreference = ( isDark ) => {
  try {
    localStorage.setItem( STORAGE_KEY, isDark ? 'true' : 'false' );
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
