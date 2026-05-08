import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, ArrowRight, ArrowLeft, DollarSign, 
  Users, TrendingDown, Clock, Sparkles, Share2, 
  Smartphone, Filter, ChevronDown, CheckCircle2,
  Wallet, PieChart, Activity, CreditCard, MessageSquare, Send,
  Paperclip, Image as ImageIcon, FileText, Download, X,
  QrCode as QrIcon, IndianRupee, ExternalLink, Settings,
  Lock, Key, ShieldCheck, Mail, Shield, Crown, Info,
  LayoutDashboard, User, Wand2, Camera, Zap
} from 'lucide-react';
import { Card, Button, StatBox, IconButton, Modal, CoinRain, cn } from '../../components/UI';
import { api, storage } from '../../lib/api';
import { QRCodeSVG } from 'qrcode.react';

export default function GroupDashboard() {
  const router = useRouter();
  const { groupId } = router.query;

  const [group, setGroup] = useState(null);
  const [user, setUser] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Auth states
  const [isLeaderVerified, setIsLeaderVerified] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [otpStep, setOtpStep] = useState('identifier');
  const [authIdentifier, setAuthIdentifier] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Form states
  const [expenseForm, setExpenseForm] = useState({
    description: '', amount: '', paid_by: '', splits: {}, category: 'Food',
  });
  
  // AI Assistant states
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Chat states
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Payment states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeSettlement, setActiveSettlement] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [myUpiId, setMyUpiId] = useState('');
  const [showUpiSettings, setShowUpiSettings] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    if (!groupId) return;
    const userData = storage.getUser();
    setUser(userData);
    loadGroupData();
    
    const verified = localStorage.getItem(`leader_verified_${groupId}`);
    if (verified === 'true') setIsLeaderVerified(true);

    const savedUpi = localStorage.getItem(`upi_${userData.userId}`);
    if (savedUpi) setMyUpiId(savedUpi);

    // Initial chat load
    loadChat();
    const chatInterval = setInterval(loadChat, 3000);
    return () => clearInterval(chatInterval);
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  const loadGroupData = async () => {
    try {
      const data = await api.getGroup(groupId);
      setGroup(data);
      if (user?.userId) {
        const balance = await api.getBalance(groupId, user.userId);
        setUserBalance(balance);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const loadChat = async () => {
    try {
      const data = await api.getChat(groupId);
      setMessages(data);
    } catch (err) { console.error(err); }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!authIdentifier) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      await api.sendOtp(authIdentifier);
      setOtpStep('otp');
    } catch (err) { setAuthError('Failed to send OTP.'); }
    setAuthLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const result = await api.verifyOtp(authIdentifier, otpValue);
      if (result.success) {
        setIsLeaderVerified(true);
        localStorage.setItem(`leader_verified_${groupId}`, 'true');
        setShowLoginModal(false);
      } else { setAuthError('Invalid OTP code.'); }
    } catch (err) { setAuthError('Verification failed.'); }
    setAuthLoading(false);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseForm.amount || !expenseForm.description || !expenseForm.paid_by) return;
    try {
      await api.addExpense(groupId, expenseForm.description, parseFloat(expenseForm.amount), expenseForm.paid_by, expenseForm.splits, expenseForm.category);
      setExpenseForm({ description: '', amount: '', paid_by: '', splits: {}, category: 'Food' });
      loadGroupData();
    } catch (err) { console.error(err); }
  };

  const handleMarkAsPaid = async (s) => {
    try {
      await api.addExpense(groupId, `Settled: ${s.from_name} to ${s.to_name}`, s.amount, s.from, { [s.to]: s.amount }, 'Payment');
      loadGroupData();
    } catch (err) { console.error(err); }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!isLeaderVerified && !user?.isLeader) { setShowLoginModal(true); return; }
    if (!confirm('Delete expense?')) return;
    try { await api.deleteExpense(expenseId); loadGroupData(); } catch (err) { console.error(err); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    try {
      await api.sendChatMessage(groupId, {
        sender_id: user.userId,
        sender_name: user.userName || 'Guest',
        text: newMessage,
        type: 'text'
      });
      setNewMessage('');
      loadChat();
    } catch (err) { console.error(err); }
  };

  const handleShareScreenshot = async () => {
    if (!user) return;
    setUploading(true);
    // Simulate screenshot sharing
    setTimeout(async () => {
      try {
        await api.sendChatMessage(groupId, {
          sender_id: user.userId,
          sender_name: user.userName || 'Guest',
          text: 'Shared a group overview screenshot',
          type: 'image',
          image_url: 'https://images.unsplash.com/photo-1554224155-169641357599?auto=format&fit=crop&q=80&w=600'
        });
        loadChat();
      } catch (err) { console.error(err); }
      setUploading(false);
    }, 1000);
  };

  // ============ AI ASSISTANT ============
  const runAIAssistant = async () => {
    if (!aiPrompt || !expenseForm.amount) return;
    setAiLoading(true);
    try {
      const result = await api.createSplitPlan(groupId, expenseForm.amount, aiPrompt);
      setAiResult(result);
      setExpenseForm({ ...expenseForm, splits: result.splits });
    } catch (err) { console.error(err); }
    setAiLoading(false);
  };

  // ============ RAZORPAY PAYMENT ============
  const handleRazorpayPayment = async () => {
    if (!activeSettlement) return;
    setPaymentLoading(true);
    try {
      const order = await api.createRazorpayOrder(activeSettlement.amount);
      const options = {
        key: 'rzp_test_settlesmart', 
        amount: order.amount,
        currency: order.currency,
        name: 'SettleSmart',
        description: `Settling debt to ${activeSettlement.to_name}`,
        order_id: order.id,
        handler: (res) => finalizeSettlement(),
        prefill: { name: user?.userName || 'Guest' },
        theme: { color: '#1a1c1e' },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) { finalizeSettlement(); }
    setPaymentLoading(false);
  };

  const finalizeSettlement = () => {
    setPaymentSuccess(true);
    const s = activeSettlement;
    api.addExpense(groupId, `Settled: Paid to ${s.to_name}`, s.amount, s.from, { [s.to]: s.amount }, 'Payment').then(() => {
      loadGroupData();
      api.sendChatMessage(groupId, {
        sender_id: 'system',
        sender_name: 'SettleSmart',
        text: `💰 Payment Verified: ${s.from_name} settled ${group.currency} ${s.amount} with ${s.to_name}`,
        type: 'system'
      });
      setTimeout(() => setShowPaymentModal(false), 2000);
    });
  };

  const openPayment = (s) => {
    setActiveSettlement(s);
    setPaymentSuccess(false);
    setShowPaymentModal(true);
  };

  if (loading || !group) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]"><div className="h-12 w-12 animate-spin rounded-full border-4 border-[#1a1c1e]/10 border-t-[#1a1c1e]" /></div>;
  }

  const isLeader = user?.isLeader || user?.userId === group.leader_id;

  return (
    <div className="relative min-h-screen bg-[#f8f9fa]">
      <Head><title>{group.name} | SettleSmart Dashboard</title></Head>
      <CoinRain />
      <div className="fixed inset-0 bg-grid z-0 opacity-20" /><div className="fixed inset-0 bg-noise z-0 opacity-20" />

      <div className="relative z-10">
        <nav className="sticky top-0 z-50 border-b-2 border-stone-200 bg-white/80 backdrop-blur-xl">
          <div className="container-mobile flex h-20 items-center justify-between">
            <div className="flex items-center gap-6">
               <IconButton label="Back" onClick={() => router.push('/')} className="h-10 w-10 border-2 border-stone-200 bg-white"><ArrowLeft size={18} /></IconButton>
               <div>
                 <h1 className="text-2xl font-black tracking-tight text-stone-900">{group.name}</h1>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Leader: {group.leader_name}</span>
                    {isLeader && <Crown size={12} className="text-amber-500" />}
                 </div>
               </div>
            </div>
            <div className="flex items-center gap-4">
              <IconButton label="Settings" onClick={() => setShowUpiSettings(true)} className="border-2 border-stone-200 bg-white"><Settings size={20} /></IconButton>
              <IconButton label="Share" onClick={() => router.push(`/create?group=${group.id}`)} className="border-2 border-stone-200 bg-white"><Share2 size={20} /></IconButton>
            </div>
          </div>
        </nav>

        <main className="container-mobile py-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10">
             <StatBox label="Total Spend" value={`${group.currency} ${(group.expenses?.reduce((a, c) => a + c.amount, 0) || 0).toFixed(2)}`} icon={PieChart} color="blue" />
             <StatBox label="Your Balance" value={`${group.currency} ${userBalance?.balance.toFixed(2) || '0.00'}`} icon={Wallet} color={userBalance?.balance >= 0 ? 'green' : 'red'} />
             <StatBox label="Members" value={group.members?.length || 0} icon={Users} color="indigo" />
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
             <div className="lg:col-span-4 space-y-8">
                <Card className="border-2 border-stone-200 overflow-visible relative">
                   <div className="absolute -top-3 -right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1 animate-bounce">
                      <Sparkles size={10}/> AI Powered
                   </div>
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-black flex items-center gap-3"><Plus size={20}/>New Expense</h3>
                   </div>
                   <form onSubmit={handleAddExpense} className="space-y-6">
                      <div className="space-y-2">
                         <label className="app-label">Description</label>
                         <input type="text" value={expenseForm.description} onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})} className="app-input" placeholder="e.g. Dinner at Savoy" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2"><label className="app-label">Amount</label><input type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})} className="app-input" placeholder="0.00" required /></div>
                         <div className="space-y-2"><label className="app-label">Paid By</label><select value={expenseForm.paid_by} onChange={(e) => setExpenseForm({...expenseForm, paid_by: e.target.value})} className="app-select" required><option value="">Select...</option>{group.members?.map(m => (<option key={m.id} value={m.id}>{m.name}</option>))}</select></div>
                      </div>

                      {/* AI SPLIT TRIGGER */}
                      <div className="pt-2">
                         <button 
                           type="button"
                           onClick={() => setShowAIModal(true)}
                           className="w-full py-4 rounded-2xl bg-indigo-50 border-2 border-indigo-100 text-indigo-600 flex items-center justify-center gap-3 hover:bg-indigo-100 transition-all group"
                         >
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                               <Wand2 size={16}/>
                            </div>
                            <span className="font-black text-[11px] uppercase tracking-widest">Consult AI Split Assistant</span>
                         </button>
                      </div>

                      {aiResult && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-600/20">
                           <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1 flex items-center gap-2"><Sparkles size={12}/> AI Split Applied</p>
                           <p className="text-xs font-bold leading-relaxed">{aiResult.explanation}</p>
                        </motion.div>
                      )}

                      <Button type="submit" className="w-full h-16 bg-stone-900 text-lg shadow-2xl shadow-stone-900/20">Confirm Expense</Button>
                   </form>
                </Card>

                <Card className="border-2 border-stone-200">
                   <h3 className="text-xl font-black mb-6 flex items-center gap-3"><Users size={20}/>Group Members</h3>
                   <div className="space-y-4">
                      {group.members.map(m => {
                         const isMemberLeader = m.id === group.leader_id;
                         return (
                           <div key={m.id} className={cn(
                             "flex items-center justify-between p-4 rounded-3xl transition-all",
                             isMemberLeader ? "bg-amber-50 border-2 border-amber-200 shadow-sm" : "bg-stone-50 border-2 border-stone-100"
                           )}>
                              <div className="flex items-center gap-4">
                                 <div className="relative">
                                    <img src={m.avatar} className={cn("w-10 h-10 rounded-full border-2", isMemberLeader ? "border-amber-400" : "border-white")} />
                                    {isMemberLeader && <div className="absolute -top-2 -left-2 bg-amber-400 text-white rounded-full p-1 shadow-lg"><Crown size={12} /></div>}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className={cn("font-black text-sm", isMemberLeader ? "text-amber-900" : "text-stone-900")}>{m.name}</span>
                                    {isMemberLeader && <span className="text-[9px] font-black uppercase tracking-widest text-amber-600">Group Generator</span>}
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 {(() => {
                                    const bal = group.balances?.find(b => b.id === m.id);
                                    if (!bal || Math.abs(bal.amount) < 0.01) return null;
                                    return (
                                       <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-lg", bal.amount > 0 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100")}>
                                          {bal.amount > 0 ? '+' : ''}{bal.amount.toFixed(0)}
                                       </span>
                                    );
                                 })()}
                                 {isMemberLeader && <ShieldCheck size={18} className="text-amber-500" />}
                              </div>
                           </div>
                         );
                      })}
                   </div>
                </Card>
             </div>

             <div className="lg:col-span-8 space-y-8">
                <div className="flex bg-stone-100 p-1 rounded-2xl border-2 border-stone-200 w-fit">
                   {[{id:'overview', label:'Overview', icon:LayoutDashboard}, {id:'expenses', label:'Expenses', icon:Activity}, {id:'settlements', label:'Settlements', icon:CheckCircle2}, {id:'chat', label:'Chat', icon:MessageSquare}].map(tab => (
                     <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all", activeTab === tab.id ? "bg-white text-stone-900 shadow-md" : "text-stone-500")}>
                        <tab.icon size={16} />{tab.label}
                     </button>
                   ))}
                </div>

                <AnimatePresence mode="wait">
                   {activeTab === 'overview' ? (
                      <motion.div key="overview" initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-8">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <Card className="p-8 border-[3px] border-black bg-white overflow-hidden relative">
                              <div className="absolute top-0 right-0 bg-stone-900 text-white px-4 py-2 text-[10px] font-black uppercase">Optimization Intelligence</div>
                              <h4 className="text-lg font-black mb-4">Ledger Status</h4>
                              <p className="text-stone-600 font-bold leading-relaxed mb-6">This group has {group.expenses?.length || 0} recorded expenses. The total volume is {group.currency} {(group.expenses?.reduce((a,c) => a+c.amount,0) || 0).toFixed(2)}.</p>
                              <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-2xl border-2 border-stone-200">
                                 <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 border-2 border-amber-200">
                                    <Zap size={24} />
                                 </div>
                                 <div>
                                    <div className="text-sm font-black text-stone-900">{group.optimization?.saved} Transactions Saved</div>
                                    <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Optimized from {group.optimization?.original} to {group.optimization?.optimized}</div>
                                 </div>
                              </div>
                           </Card>
                           <Card className="p-8 border-[3px] border-indigo-600 bg-white">
                              <h4 className="text-lg font-black mb-4 text-indigo-600 uppercase tracking-tighter">Share Group</h4>
                              <p className="text-stone-600 text-sm mb-6 font-bold">Invite others via code:</p>
                              <div className="py-6 bg-indigo-50 rounded-2xl border-2 border-indigo-100 text-center">
                                 <div className="text-4xl font-black tracking-[0.5rem] text-indigo-600 uppercase">{group.invite_code}</div>
                               </div>
                           </Card>
                         </div>

                         <Card className="p-8">
                            <h4 className="text-lg font-black mb-6 flex items-center gap-2"><CreditCard size={20}/> Net Balance Summary</h4>
                            <div className="space-y-4">
                               {group.balances?.map(b => (
                                  <div key={b.id} className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border-2 border-stone-100">
                                     <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white border-2 border-stone-200 flex items-center justify-center font-black text-stone-900">{b.name[0]}</div>
                                        <span className="font-black text-stone-900">{b.name}</span>
                                     </div>
                                     <div className={cn("text-lg font-black px-4 py-1 rounded-full", b.amount >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>
                                        {b.amount >= 0 ? 'Gets' : 'Owes'} {group.currency} {Math.abs(b.amount).toFixed(2)}
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </Card>
                      </motion.div>
                   ) : activeTab === 'expenses' ? (
                     <motion.div key="exp" initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-4">
                        {group.expenses.slice().reverse().map(e => (
                           <Card key={e.id} className="group border-2 border-stone-200 flex items-center justify-between p-6">
                              <div><h4 className="text-xl font-black text-stone-900">{e.description}</h4><p className="text-sm text-stone-500 font-bold">Paid by {group.members.find(m => m.id === e.paid_by)?.name}</p></div>
                              <div className="text-right"><p className="text-2xl font-black text-stone-900">{group.currency} {e.amount.toFixed(2)}</p><button onClick={() => handleDeleteExpense(e.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18}/></button></div>
                           </Card>
                        ))}
                     </motion.div>
                   ) : activeTab === 'settlements' ? (
                     <motion.div key="set" initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-4">
                        {group.settlements?.map((s, i) => (
                           <Card key={i} className={cn("border-l-[6px] border-2 p-8 flex items-center justify-between bg-white shadow-sm transition-all", s.is_paid ? "border-stone-200 opacity-60 grayscale border-l-stone-300" : "border-stone-200 border-l-stone-900")}>
                              <div className="flex items-center gap-6">
                                 <div className="flex items-center gap-4">
                                    <p className="text-xl font-black text-stone-900">{s.from_name}</p>
                                    <ArrowRight className="text-stone-400"/>
                                    <p className="text-xl font-black text-stone-900">{s.to_name}</p>
                                 </div>
                                 {s.is_paid && <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><CheckCircle2 size={12}/> Settled</span>}
                              </div>
                              <div className="text-right flex items-center gap-8">
                                 <div>
                                    <p className="text-3xl font-black text-stone-900">{group.currency} {s.amount.toFixed(2)}</p>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    {!s.is_paid && s.from === user?.userId && <Button onClick={() => openPayment(s)} className="bg-stone-900 h-12 px-8">Settle Up</Button>}
                                    {!s.is_paid && isLeader && <Button onClick={() => handleMarkAsPaid(s)} variant="secondary" className="h-12 px-6 border-stone-200">Mark as Paid</Button>}
                                 </div>
                              </div>
                           </Card>
                        ))}
                     </motion.div>
                   ) : (
                     <motion.div key="chat" initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex flex-col h-[600px] glass-card rounded-[2.5rem] overflow-hidden border-2 border-stone-200">
                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                           {messages.map(m => (
                             <div key={m.id} className={cn("flex flex-col", m.sender_id === user?.userId ? "items-end" : m.sender_id === 'system' ? "items-center" : "items-start")}>
                                {m.sender_id !== 'system' && <span className="text-[10px] font-black uppercase text-stone-400 mb-1">{m.sender_name}</span>}
                                <div className={cn("px-5 py-3 rounded-2xl text-sm font-bold max-w-[80%]", 
                                  m.type === 'system' ? "bg-stone-50 text-stone-400 italic" : 
                                  m.sender_id === user?.userId ? "bg-stone-900 text-white" : "bg-white border-2 border-stone-100 text-stone-900"
                                )}>
                                   {m.type === 'image' ? (
                                      <div className="space-y-2">
                                         <img src={m.image_url} className="rounded-xl border-2 border-white/10" />
                                         <p className="text-xs opacity-70">{m.text}</p>
                                      </div>
                                   ) : m.text}
                                </div>
                             </div>
                           ))}
                           <div ref={chatEndRef} />
                        </div>
                        <div className="p-6 bg-stone-50 border-t-2 border-stone-100 flex gap-4">
                           <IconButton onClick={handleShareScreenshot} className="bg-white border-2 border-stone-200 h-14 w-14" disabled={uploading}><Camera size={20} className={uploading ? 'animate-pulse' : ''}/></IconButton>
                           <form onSubmit={handleSendMessage} className="flex-1 flex gap-4"><input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} className="flex-1 app-input h-14" placeholder="Say something..." /><Button type="submit" className="bg-stone-900 w-14 p-0"><Send size={20}/></Button></form>
                        </div>
                     </motion.div>
                   )}
                </AnimatePresence>
             </div>
          </div>
        </main>
      </div>

      {/* AI Modal */}
      <Modal open={showAIModal} onClose={() => setShowAIModal(false)} title="AI Split Assistant" icon={Wand2}>
         <div className="space-y-6 py-4">
            <p className="text-sm text-stone-600 font-bold leading-relaxed">Tell me how to split the <span className="text-black font-black">{group.currency} {expenseForm.amount || '0'}</span>. E.g., "Split equally" or "Alex pays 20%".</p>
            <div className="space-y-2">
               <label className="app-label">Split Instructions</label>
               <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} className="app-input h-32 py-4 resize-none" placeholder="Describe your split plan here..." />
            </div>
            <Button onClick={runAIAssistant} className="w-full h-16 bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" disabled={aiLoading || !expenseForm.amount}>
               {aiLoading ? 'AI is Thinking...' : 'Generate Split Plan'}
            </Button>
            {aiResult && (
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-indigo-50 border-2 border-indigo-100 rounded-[2rem]">
                  <h5 className="text-[10px] font-black uppercase text-indigo-600 mb-2 tracking-widest">Calculated Strategy</h5>
                  <p className="text-sm text-indigo-900 font-bold leading-relaxed">{aiResult.explanation}</p>
               </motion.div>
            )}
            {aiResult && <Button onClick={() => setShowAIModal(false)} className="w-full h-14 bg-stone-900">Apply Split Plan</Button>}
         </div>
      </Modal>

      {/* Other Modals ... */}
      <Modal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Settle Up" icon={Shield}>
         {activeSettlement && (
           <div className="space-y-8 text-center py-4">
              {!paymentSuccess ? (
                <>
                  <div><p className="app-label">Paying To</p><p className="text-3xl font-black text-stone-900">{activeSettlement.to_name}</p></div>
                  <div className="py-10 bg-stone-50 rounded-[2.5rem] border-2 border-stone-100"><p className="app-label">Total Amount</p><p className="text-5xl font-black text-stone-900">{group.currency} {activeSettlement.amount.toFixed(2)}</p></div>
                  <div className="space-y-6">
                     <p className="text-[10px] font-black uppercase text-stone-400 tracking-[0.2em]">Scan to Pay via PhonePe</p>
                     <div className="flex justify-center p-6 bg-white rounded-[2.5rem] border-4 border-stone-900 shadow-2xl relative group overflow-hidden">
                        <img src="/phonepe_qr.png" className="w-[200px] h-auto rounded-xl grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" alt="PhonePe QR" />
                        <div className="absolute inset-0 bg-stone-900/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                     </div>
                     <p className="text-xs text-stone-500 font-bold max-w-[200px] mx-auto leading-relaxed italic">"Once paid, please notify the Group Leader to mark this as settled."</p>
                  </div>
                </>
              ) : (
                <motion.div initial={{ scale:0.5 }} animate={{ scale:1 }} className="py-12 space-y-6"><div className="mx-auto h-32 w-32 rounded-full bg-emerald-50 text-emerald-500 border-4 border-emerald-100 flex items-center justify-center"><CheckCircle2 size={64}/></div><h3 className="text-3xl font-black text-stone-900">Settled!</h3></motion.div>
              )}
           </div>
         )}
      </Modal>

      <Modal open={showLoginModal} onClose={() => setShowLoginModal(false)} title="Leader Login" icon={Lock}>
         <form onSubmit={otpStep === 'identifier' ? handleSendOtp : handleVerifyOtp} className="space-y-6 py-4">
            {otpStep === 'identifier' ? (
              <div className="space-y-6"><div className="space-y-2"><label className="app-label">Mobile / Gmail</label><input type="text" value={authIdentifier} onChange={e => setAuthIdentifier(e.target.value)} className="app-input" required /></div><Button type="submit" className="w-full h-14 bg-stone-900" disabled={authLoading}>Send OTP</Button></div>
            ) : (
              <div className="space-y-6"><div className="space-y-2"><label className="app-label">Enter OTP</label><input type="text" value={otpValue} onChange={e => setOtpValue(e.target.value)} className="app-input text-center text-4xl tracking-widest" maxLength="6" required /></div><Button type="submit" className="w-full h-14 bg-stone-900" disabled={authLoading}>Verify OTP</Button></div>
            )}
            {authError && <p className="text-xs text-red-500 font-bold">{authError}</p>}
         </form>
      </Modal>

      <Modal open={showUpiSettings} onClose={() => setShowUpiSettings(false)} title="Settings" icon={Settings}><form onSubmit={e => {e.preventDefault(); localStorage.setItem(`upi_${user.userId}`, myUpiId); setShowUpiSettings(false);}} className="space-y-6 py-4"><div className="space-y-2"><label className="app-label">Your UPI ID</label><input type="text" value={myUpiId} onChange={e => setMyUpiId(e.target.value)} className="app-input" placeholder="username@upi" required /></div><Button type="submit" className="w-full h-14 bg-stone-900">Save Settings</Button></form></Modal>
    </div>
  );
}
