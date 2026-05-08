import { useState, useEffect } from 'react';
import '../globals.css';
import { AnimatePresence, motion } from 'framer-motion';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <div className="min-h-screen bg-[#f8f9fa] font-sans antialiased text-stone-900">
        <AnimatePresence mode="wait">
          {!isOnline && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed left-0 right-0 top-0 z-[100] border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-center text-sm font-bold text-amber-500 backdrop-blur-xl"
            >
              You're offline. Changes will sync when connection is restored.
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Component {...pageProps} />
        </motion.div>
      </div>
    </>
  );
}

export default MyApp;
