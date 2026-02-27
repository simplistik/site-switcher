import { __ } from '@wordpress/i18n';

const LINKS = [
  { key: 'dashboard', label: __( 'Dashboard', 'tprt-site-switcher' ), path: '' },
  { key: 'sites', label: __( 'Sites', 'tprt-site-switcher' ), path: 'sites.php' },
  { key: 'users', label: __( 'Users', 'tprt-site-switcher' ), path: 'users.php' },
  { key: 'themes', label: __( 'Themes', 'tprt-site-switcher' ), path: 'themes.php' },
  { key: 'plugins', label: __( 'Plugins', 'tprt-site-switcher' ), path: 'plugins.php' },
  { key: 'settings', label: __( 'Settings', 'tprt-site-switcher' ), path: 'settings.php' },
];

const NetworkAdmin = ( { networkAdminUrl } ) => {
  if ( !networkAdminUrl ) return null;

  return (
    <div className="tprt-ss-network">
      <div className="tprt-ss-network__header">
        <span className="dashicons dashicons-admin-network tprt-ss-network__icon" aria-hidden="true" />
        <span className="tprt-ss-network__title">
          {__( 'Network Admin', 'tprt-site-switcher' )}
        </span>
      </div>
      <div className="tprt-ss-network__links">
        {LINKS.map( ( link ) => (
          <a
            key={link.key}
            className="tprt-ss-network__link"
            href={networkAdminUrl + link.path}
          >
            {link.label}
          </a>
        ) )}
      </div>
    </div>
  );
};

export default NetworkAdmin;
