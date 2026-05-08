import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, IconButton, cn } from '../components/UI';
import { api, storage } from '../lib/api';
import { 
  ArrowLeft, Users, Sparkles, CreditCard, 
  Camera, QrCode, Search, CheckCircle2, AlertCircle, X
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for QR scanner to avoid SSR issues
const QrScanner = dynamic(() => import('react-qr-scanner'), { ssr: false });

export default function Join() {
  const router = useRouter();
  const { code: queryCode } = router.query;

  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  useEffect(() => {
    if (queryCode) setInviteCode(queryCode);
  }, [queryCode]);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!name.trim() || !inviteCode.trim()) return;

    setLoading(true);
    setError('');
    try {
      const result = await api.joinGroup(inviteCode.toUpperCase(), name);
      if (result.error) {
        setError(result.error);
      } else {
        storage.setUser(result.user_id, result.guest_token, result.group_id, name, result.is_leader);
        router.push(`/group/${result.group_id}`);
      }
    } catch (err) {
      setError('Failed to join group. Check your code.');
    }
    setLoading(false);
  };

  const handleScan = (data) => {
    if (data) {
      try {
        const url = new URL(data.text);
        const code = url.searchParams.get('code');
        if (code) {
          setInviteCode(code.toUpperCase());
          setShowScanner(false);
        }
      } catch (e) {
        // Not a URL, try raw code
        if (data.text.length === 6) {
          setInviteCode(data.text.toUpperCase());
          setShowScanner(false);
        }
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    if (err.name === 'NotAllowedError') {
      setError('Camera permission denied. Please enable it in browser settings.');
    } else {
      setError('Scanning error. Please type the code manually.');
    }
    setShowScanner(false);
  };

  return (
    <div className="relative min-h-screen bg-[#f8f9fa]">
      <Head>
        <title>Join Group | SettleSmart</title>
      </Head>

      <div className="fixed inset-0 bg-grid z-0" />
      <div className="fixed inset-0 bg-noise z-0" />

      <div className="relative z-10">
        <nav className="sticky top-0 z-50 border-b-2 border-stone-200 bg-white/80 backdrop-blur-xl">
          <div className="container-mobile flex h-20 items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a1c1e]">
                <CreditCard className="text-white" size={20} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-[#1a1c1e]">
                Settle<span className="text-stone-500">Smart</span>
              </span>
            </div>
            <IconButton label="Back" onClick={() => router.push('/')} className="border-2 border-stone-200 text-[#1a1c1e] bg-white">
              <ArrowLeft size={20} />
            </IconButton>
          </div>
        </nav>

        <main className="container-mobile flex items-center justify-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl"
          >
            <div className="mb-12 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-stone-100 text-stone-900 border-2 border-stone-200 shadow-xl shadow-stone-900/5">
                <Users size={40} />
              </div>
              <h1 className="mb-4 text-4xl font-black tracking-tight text-[#1a1c1e] md:text-5xl">Join your squad.</h1>
              <p className="text-lg text-stone-600 font-bold">Enter your credentials or scan a QR code to begin.</p>
            </div>

            <Card className="p-10 border-2 border-stone-200 shadow-2xl">
              <form onSubmit={handleJoin} className="space-y-8">
                <div className="space-y-3">
                  <label className="app-label">Your Identity</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Alex Thompson"
                    className="app-input h-16 text-lg"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="app-label">Invite Code</label>
                    <button
                      type="button"
                      onClick={() => setShowScanner(true)}
                      className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-stone-900 hover:text-stone-600 transition-colors"
                    >
                      <Camera size={16} />
                      Scan QR Code
                    </button>
                  </div>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="A B C 1 2 3"
                    className="app-input h-16 text-center text-3xl font-black tracking-[0.5rem] uppercase placeholder:tracking-normal placeholder:text-lg"
                    maxLength="6"
                    required
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-600 text-sm font-bold"
                  >
                    <AlertCircle size={20} />
                    {error}
                  </motion.div>
                )}

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-16 text-xl shadow-none bg-[#1a1c1e]"
                    disabled={loading}
                  >
                    {loading ? 'Joining Ledger...' : 'Access Dashboard'}
                    <Sparkles className="ml-2" size={24} />
                  </Button>
                </div>
              </form>
            </Card>

            <p className="mt-10 text-center text-stone-500 font-bold">
              Don't have a code? Ask the group leader to share it with you.
            </p>
          </motion.div>
        </main>
      </div>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {showScanner && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/90 backdrop-blur-md"
              onClick={() => setShowScanner(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 overflow-hidden shadow-2xl border-4 border-stone-200"
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black text-stone-900 tracking-tight">Scan Invite</h3>
                  <p className="text-sm text-stone-500 font-bold uppercase tracking-widest mt-1">Center the QR code in the frame</p>
                </div>
                <button
                  onClick={() => setShowScanner(false)}
                  className="h-12 w-12 flex items-center justify-center rounded-2xl bg-stone-100 text-stone-900 hover:bg-stone-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border-4 border-stone-100 bg-stone-50">
                <QrScanner
                  delay={300}
                  onError={handleError}
                  onScan={handleScan}
                  style={{ width: '100%' }}
                />
                <div className="absolute inset-0 border-[40px] border-black/20" />
                <div className="absolute inset-x-12 top-1/2 h-0.5 -translate-y-1/2 bg-stone-900 animate-pulse shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
              </div>

              <Button
                variant="secondary"
                onClick={() => setShowScanner(false)}
                className="w-full h-14 mt-8 border-2"
              >
                Cancel Scanning
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
