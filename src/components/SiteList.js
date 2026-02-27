import { __ } from '@wordpress/i18n';
import SiteItem from './SiteItem';

const SiteList = ( {
  currentSite,
  recentSites,
  otherSites,
  filteredSites,
  searchTerm,
  activeIndex,
  onSiteClick,
  onSetActiveIndex,
  listRef,
  showBlogId,
} ) => {
  const isSearching = searchTerm.trim().length > 0;

  // Track running index across all sections for keyboard nav
  let runningIndex = 0;

  const renderItem = ( site ) => {
    const idx = runningIndex++;
    return (
      <SiteItem
        key={site.blogId}
        site={site}
        isActive={activeIndex === idx}
        isCurrent={site.isCurrent}
        index={idx}
        onSiteClick={onSiteClick}
        onMouseEnter={onSetActiveIndex}
        showBlogId={showBlogId}
      />
    );
  };

  if ( isSearching ) {
    return (
      <div className="tprt-ss-list" ref={listRef} role="listbox">
        {filteredSites.length === 0 ? (
          <div className="tprt-ss-list__empty">
            {__( 'No sites found', 'tprt-site-switcher' )}
          </div>
        ) : (
          filteredSites.map( renderItem )
        )}
      </div>
    );
  }

  return (
    <div className="tprt-ss-list" ref={listRef} role="listbox">
      {currentSite && (
        <div className="tprt-ss-list__section">
          <div className="tprt-ss-list__header">
            {__( 'Current Site', 'tprt-site-switcher' )}
          </div>
          {renderItem( currentSite )}
        </div>
      )}

      {recentSites.length > 0 && (
        <div className="tprt-ss-list__section">
          <div className="tprt-ss-list__header">
            {__( 'Recent', 'tprt-site-switcher' )}
          </div>
          {recentSites.map( renderItem )}
        </div>
      )}

      {otherSites.length > 0 && (
        <div className="tprt-ss-list__section">
          <div className="tprt-ss-list__header">
            {__( 'All Sites', 'tprt-site-switcher' )}
          </div>
          {otherSites.map( renderItem )}
        </div>
      )}
    </div>
  );
};

export default SiteList;
