// This file is responsible for registering the service worker

// Check if service workers are supported in the current browser
// Import the necessary code to register the service worker
const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      window.location.hostname.includes('127.0.0.1')
  );
  
  export function register() {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      // The URL of the service worker is /service-worker.js (created automatically in production build)
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
      if (isLocalhost) {
        // In development, make sure service workers are only registered on production
        checkValidServiceWorker(swUrl);
      } else {
        // Register the service worker normally in production
        registerValidSW(swUrl);
      }
    }
  }
  
  function registerValidSW(swUrl) {
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('Service Worker registered with scope: ', registration.scope);
      })
      .catch((error) => {
        console.error('Error during service worker registration: ', error);
      });
  }
  
  function checkValidServiceWorker(swUrl) {
    // Check if the service worker file exists at the URL
    fetch(swUrl)
      .then((response) => {
        // Ensure the service worker exists and has a valid response
        if (response.status === 404) {
          // Service worker not found, so remove the existing service worker
          navigator.serviceWorker.ready.then((registration) => {
            registration.unregister();
          });
        } else {
          // Register the service worker if found
          registerValidSW(swUrl);
        }
      })
      .catch(() => {
        console.log('No internet connection found. App is running in offline mode.');
      });
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.unregister();
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  }
  