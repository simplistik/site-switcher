import { useState, useMemo, useCallback } from '@wordpress/element';
import useRecentSites from './useRecentSites';

const useSiteSwitcher = () => {
  const [ isOpen, setIsOpen ] = useState( false );
  const [ searchTerm, setSearchTerm ] = useState( '' );
  const { recentSiteIds, addRecentSite } = useRecentSites();

  const rawSites = window.tprtSiteSwitcher?.sites;
  const sites = useMemo( () => rawSites || [], [ rawSites ] );
  const currentSiteId = window.tprtSiteSwitcher?.currentSite;

  // Current site object
  const currentSite = useMemo(
    () => sites.find( ( s ) => s.blogId === currentSiteId ),
    [ sites, currentSiteId ],
  );

  // Filter sites by search term
  const filteredSites = useMemo( () => {
    const term = searchTerm.trim().toLowerCase();
    if ( !term ) return sites;

    return sites.filter(
      ( site ) =>
        site.name.toLowerCase().includes( term ) ||
        site.siteUrl.toLowerCase().includes( term ),
    );
  }, [ searchTerm, sites ] );

  // Split into sections: recent and other (only when not searching)
  const { recentSites, otherSites } = useMemo( () => {
    if ( searchTerm.trim() ) {
      return { recentSites: [], otherSites: filteredSites };
    }

    const recentIdSet = new Set( recentSiteIds );

    const recent = recentSiteIds
      .map( ( id ) => sites.find( ( s ) => s.blogId === id ) )
      .filter( Boolean )
      .filter( ( s ) => s.blogId !== currentSiteId );

    const others = sites.filter(
      ( s ) => s.blogId !== currentSiteId && !recentIdSet.has( s.blogId ),
    );

    return { recentSites: recent, otherSites: others };
  }, [ filteredSites, recentSiteIds, searchTerm, currentSiteId, sites ] );

  // Flat list of all visible items for keyboard navigation indexing
  const allVisibleItems = useMemo( () => {
    if ( searchTerm.trim() ) return filteredSites;

    return [
      ...( currentSite ? [ currentSite ] : [] ),
      ...recentSites,
      ...otherSites,
    ];
  }, [ searchTerm, filteredSites, currentSite, recentSites, otherSites ] );

  const open = useCallback( () => {
    setIsOpen( true );
    setSearchTerm( '' );
  }, [] );

  const close = useCallback( () => {
    setIsOpen( false );
    setSearchTerm( '' );
  }, [] );

  const toggle = useCallback( () => {
    if ( isOpen ) {
      close();
    } else {
      open();
    }
  }, [ isOpen, open, close ] );

  const isNetworkAdmin = !! window.tprtSiteSwitcher?.isNetworkAdmin;
  const networkAdminUrl = window.tprtSiteSwitcher?.networkAdminUrl || '';

  return {
    isOpen,
    open,
    close,
    toggle,
    searchTerm,
    setSearchTerm,
    currentSite,
    recentSites,
    otherSites,
    filteredSites,
    allVisibleItems,
    totalSiteCount: sites.length,
    currentSiteId,
    addRecentSite,
    isNetworkAdmin,
    networkAdminUrl,
  };
};

export default useSiteSwitcher;
