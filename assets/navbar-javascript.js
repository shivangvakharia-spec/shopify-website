/**
 * Navbar Component Interactions
 */

function initNavbar() {
  document.querySelectorAll('.navbar').forEach((navbar) => {
    const hamburger = navbar.querySelector('.navbar__hamburger');
    const drawer = navbar.querySelector('.navbar__drawer');
    const drawerClose = navbar.querySelector('.navbar__drawer-close');
    const drawerBackdrop = navbar.querySelector('.navbar__drawer-backdrop');

    if (hamburger && drawer) {
      const openDrawer = () => {
        drawer.classList.add('is-open');
        drawer.setAttribute('aria-hidden', 'false');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      };

      const closeDrawer = () => {
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      };

      hamburger.addEventListener('click', openDrawer);

      if (drawerClose) {
        drawerClose.addEventListener('click', closeDrawer);
      }

      if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', closeDrawer);
      }

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
          closeDrawer();
        }
      });
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavbar);
} else {
  initNavbar();
}

document.addEventListener('shopify:section:load', initNavbar);
