import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, IconButton, cn } from '../components/UI';
import { api, storage } from '../lib/api';
import { 
  ArrowLeft, Plus, Users, Sparkles, CreditCard, Shield, 
  Smartphone, Mail, Zap, CheckCircle2, Copy, Share2, ArrowRight, User
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function Create() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [leaderContact, setLeaderContact] = useState('');
  const [authMethod, setAuthMethod] = useState('phone'); // phone or email
  const [loading, setLoading] = useState(false);
  
  // Success state
  const [createdGroup, setCreatedGroup] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !leaderContact.trim() || !leaderName.trim()) return;

    setLoading(true);
    try {
      const result = await api.createGroup(name, currency, [], leaderContact);
      if (result.error) {
         alert(`Error: ${result.error}`);
         setLoading(false);
         return;
      }
      const joinResult = await api.joinGroup(result.invite_code, leaderName);
      storage.setUser(joinResult.user_id, joinResult.guest_token, joinResult.group_id, leaderName, joinResult.is_leader);
      localStorage.setItem(`is_leader_${joinResult.group_id}`, 'true');
      localStorage.setItem(`leader_verified_${joinResult.group_id}`, 'true');
      setCreatedGroup({ ...result, leaderName });
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    }
    setLoading(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(createdGroup.invite_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyLink = () => {
    const link = `${window.location.origin}/join?code=${createdGroup.invite_code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const inviteLink = createdGroup ? `${typeof window !== 'undefined' ? window.location.origin : ''}/join?code=${createdGroup.invite_code}` : '';

  return (
    <div className="relative min-h-screen bg-[#f8f9fa]">
      <Head>
        <title>Create Group | SettleSmart</title>
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
            {!createdGroup && (
               <IconButton label="Back" onClick={() => router.push('/')} className="border-2 border-stone-200 text-[#1a1c1e] bg-white">
                  <ArrowLeft size={20} />
               </IconButton>
            )}
          </div>
        </nav>

        <main className="container-mobile flex items-center justify-center py-20">
          <AnimatePresence mode="wait">
            {!createdGroup ? (
              <motion.div key="create-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-xl">
                <div className="mb-12 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-stone-900 text-white shadow-xl shadow-stone-900/20"><Plus size={40} /></div>
                  <h1 className="mb-4 text-4xl font-black tracking-tight text-[#1a1c1e] md:text-5xl">Launch a Group.</h1>
                  <p className="text-lg text-stone-600 font-bold">Set your parameters and invite your squad.</p>
                </div>
                <Card className="p-10 border-2 border-stone-200 shadow-2xl">
                  <form onSubmit={handleCreate} className="space-y-8">
                    <div className="space-y-3">
                      <label className="app-label">Group Naming</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Goa Trip 2026" className="app-input h-16 text-lg" required />
                    </div>
                    <div className="space-y-3">
                      <label className="app-label">Your Identity (Leader Name)</label>
                      <div className="relative">
                         <div className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-900 flex items-center justify-center pointer-events-none"><User size={22} /></div>
                         <input type="text" value={leaderName} onChange={(e) => setLeaderName(e.target.value)} placeholder="e.g., Sachin" className="app-input h-16 !pl-16 text-lg" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3"><label className="app-label">Currency</label><select value={currency} onChange={(e) => setCurrency(e.target.value)} className="app-select h-16"><option value="INR">INR (₹)</option><option value="USD">USD ($)</option></select></div>
                      <div className="space-y-3"><label className="app-label">Auth Type</label><div className="flex bg-stone-100 p-1 rounded-2xl border-2 border-stone-200"><button type="button" onClick={() => setAuthMethod('phone')} className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all", authMethod === 'phone' ? "bg-white shadow-md text-[#1a1c1e]" : "text-stone-500")}><Smartphone size={16} /><span className="text-[11px] font-black uppercase tracking-widest">Mobile</span></button><button type="button" onClick={() => setAuthMethod('email')} className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all", authMethod === 'email' ? "bg-white shadow-md text-[#1a1c1e]" : "text-stone-500")}><Mail size={16} /><span className="text-[11px] font-black uppercase tracking-widest">Gmail</span></button></div></div>
                    </div>
                    <div className="space-y-3">
                      <label className="app-label">{authMethod === 'phone' ? 'Mobile Number' : 'Gmail Address'} (Leader Contact)</label>
                      <div className="relative">
                         <div className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-900 flex items-center justify-center pointer-events-none">{authMethod === 'phone' ? <Smartphone size={22} /> : <Mail size={22} />}</div>
                         <input type={authMethod === 'phone' ? 'tel' : 'email'} value={leaderContact} onChange={(e) => setLeaderContact(e.target.value)} placeholder={authMethod === 'phone' ? '+91 98765 43210' : 'leader@gmail.com'} className="app-input h-16 !pl-16 text-lg" required />
                      </div>
                    </div>
                    <div className="pt-4"><Button type="submit" className="w-full h-16 text-xl shadow-none bg-[#1a1c1e]" disabled={loading}>{loading ? 'Initializing Ledger...' : 'Create Group'}<Zap className="ml-2" size={24} /></Button></div>
                  </form>
                </Card>
              </motion.div>
            ) : (
              <motion.div key="success-screen" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
                <div className="mb-12 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 border-4 border-emerald-100 shadow-xl shadow-emerald-500/10"><CheckCircle2 size={48} className="animate-bounce" /></motion.div>
                  <h1 className="mb-4 text-4xl font-black tracking-tight text-[#1a1c1e] md:text-5xl">Group Created!</h1>
                  <p className="text-xl text-stone-600 font-bold">Leader <span className="text-[#1a1c1e] font-black">"{createdGroup.leaderName}"</span>, your ledger for <span className="text-[#1a1c1e]">"{createdGroup.name}"</span> is live.</p>
                </div>
                <Card className="p-0 overflow-hidden border-2 border-stone-200 shadow-2xl">
                   <div className="p-10 space-y-10">
                      <div className="text-center space-y-4">
                         <p className="text-[11px] font-black uppercase tracking-widest text-stone-600">Share this Invite Code</p>
                         <div className="flex items-center justify-center gap-4">
                            <div className="bg-stone-50 border-2 border-stone-200 rounded-3xl px-8 py-6 shadow-inner min-w-[300px] flex items-center justify-center">
                               <span className="text-6xl font-black tracking-[0.5rem] text-[#1a1c1e]">
                                  {createdGroup.invite_code}
                               </span>
                            </div>
                            <button onClick={copyCode} className="h-20 w-20 flex items-center justify-center rounded-3xl bg-white border-2 border-stone-200 hover:border-stone-900 transition-colors shadow-sm">
                               {copiedCode ? <CheckCircle2 className="text-emerald-500" /> : <Copy className="text-stone-900" />}
                            </button>
                         </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center border-t-2 border-stone-100 pt-10">
                         <div className="flex flex-col items-center gap-4"><div className="p-4 bg-white rounded-3xl border-2 border-stone-100 shadow-sm"><QRCodeSVG value={inviteLink} size={180} /></div><p className="app-label">Scan to Join</p></div>
                         <div className="space-y-6">
                            <div className="space-y-2"><h4 className="text-lg font-black text-[#1a1c1e]">How to invite:</h4><ul className="text-md text-stone-700 font-bold space-y-3"><li className="flex gap-2"><span>1.</span> Share the 6-digit code above.</li><li className="flex gap-2"><span>2.</span> Or send the direct join link.</li><li className="flex gap-2"><span>3.</span> Or let them scan this QR code.</li></ul></div>
                            <Button variant="secondary" onClick={copyLink} className="w-full h-14 text-sm font-black uppercase tracking-widest border-2">
                               <Share2 className="mr-2" size={18} />
                               {copiedLink ? 'Link Copied!' : 'Copy Invite Link'}
                            </Button>
                         </div>
                      </div>
                   </div>
                   <div className="bg-stone-50 p-8 border-t-2 border-stone-100 text-center"><Button onClick={() => router.push(`/group/${createdGroup.id}`)} className="w-full h-16 text-xl bg-[#1a1c1e]">Enter Dashboard<ArrowRight className="ml-2" size={24} /></Button></div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
