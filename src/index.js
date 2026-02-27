import { createRoot } from '@wordpress/element';
import SiteSwitcherModal from '@components/SiteSwitcherModal';
import './style.scss';

document.addEventListener( 'DOMContentLoaded', () => {
  // Guard: only render on multisite with data available
  if ( !window.tprtSiteSwitcher?.isMultisite ) return;

  const mountNode = document.createElement( 'div' );
  mountNode.id = 'tprt-site-switcher-root';
  document.body.appendChild( mountNode );

  createRoot( mountNode ).render( <SiteSwitcherModal /> );
} );
