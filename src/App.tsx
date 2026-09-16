import { useEffect, useState } from 'react';
import PrmptExperience from './components/PrmptExperience';
import AboutExperience from './components/AboutExperience';

export default function App() {
  const [currentHash, setCurrentHash] = useState(() => {
    return window.location.hash;
  });

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    // Also listen to a custom event if setView is called directly in index.html
    const handleViewChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ viewName: string }>;
      if (customEvent.detail && customEvent.detail.viewName) {
        setCurrentHash('#' + customEvent.detail.viewName);
      }
    };
    window.addEventListener('prmpt:viewchange', handleViewChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
      window.removeEventListener('prmpt:viewchange', handleViewChange);
    };
  }, []);

  useEffect(() => {
    const siteWrapper = document.getElementById('siteWrapper');
    if (currentHash === '#about' || currentHash === '#hola') {
      if (siteWrapper) {
        siteWrapper.style.display = 'none';
        siteWrapper.classList.add('view-hidden');
      }
    } else {
      if (siteWrapper) {
        siteWrapper.style.display = '';
        siteWrapper.classList.remove('view-hidden');
      }
    }
  }, [currentHash]);

  const handleBackToHome = () => {
    // Navigate back to home / inicio
    if (window.history.pushState) {
      window.history.pushState(null, '', '#inicio');
    } else {
      window.location.hash = '#inicio';
    }
    // Dispatch popstate and hashchange so index.html's routing catches it
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    setCurrentHash('#inicio');
  };

  // Render AboutExperience when on #about
  if (currentHash === '#about') {
    return (
      <div id="about" className="w-full min-h-screen bg-black/95 backdrop-blur-lg text-white">
        <AboutExperience onBackToHome={handleBackToHome} />
      </div>
    );
  }

  // Render PrmptExperience when on #hola
  if (currentHash === '#hola') {
    return (
      <div id="hola" className="w-full h-full p-0 m-0">
        <PrmptExperience onBackToHome={handleBackToHome} />
      </div>
    );
  }

  return null;
}

