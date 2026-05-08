import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Button, Card, Modal, CoinRain, cn } from '../components/UI';
import { 
  ArrowRight, Bot, Calculator, CheckCircle2, QrCode, 
  Share2, Sparkles, Users, WalletCards, Zap, Shield, 
  Globe, Smartphone, CreditCard, LayoutDashboard
} from 'lucide-react';

const featureDetails = {
  ai: {
    icon: Bot,
    title: 'AI-assisted custom splits',
    body: 'Describe the split in plain language, like "Alex paid rent, Sarah skips internet, split pizza between everyone." SettleSmart turns that into clear shares before you save the expense.',
    actionLabel: 'Try it in a new group',
    href: '/create',
  },
  onboarding: {
    icon: Users,
    title: 'Zero onboarding',
    body: 'Invitees can open a group link and start adding expenses without creating an account. It keeps quick trips, roommate bills, and one-off plans lightweight.',
    actionLabel: 'Create invite link',
    href: '/create',
  },
  sharing: {
    icon: Share2,
    title: 'Instant sharing',
    body: 'Share by link, invite code, or QR flow so people can join from any device. The home shortcut can also open the native share sheet when your browser supports it.',
    actionLabel: 'Open join page',
    href: '/join',
  },
  settlement: {
    icon: Calculator,
    title: 'Smart settlement',
    body: 'Balances are reduced into the fewest practical payments, so a messy group ledger becomes a short list of who pays whom.',
    actionLabel: 'Start calculating',
    href: '/create',
  },
  qr: {
    icon: QrCode,
    title: 'QR and invite codes',
    body: 'Every group can be shared in the format that fits the moment: scan nearby, send a link remotely, or type a short code when sharing apps are awkward.',
    actionLabel: 'Join with a code',
    href: '/join',
  },
  payments: {
    icon: WalletCards,
    title: 'Clear final payments',
    body: 'The settlement view keeps final payments separate from raw expenses, making it easier to finish the trip, move-out, or dinner tab cleanly.',
    actionLabel: 'Create a group',
    href: '/create',
  },
};

const howItWorks = [
  ['Create a Group', 'Name it, set currency, and get a shareable invite link.', Users],
  ['Invite Friends', 'Share link, QR code, or invite code. No account needed.', QrCode],
  ['Add Expenses', 'Ask AI to split equally, custom by name, or only between selected people.', Bot],
  ['See Settlements', 'Algorithm finds minimum payments needed to settle all debts.', CheckCircle2],
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Home() {
  const router = useRouter();
  const [activePopup, setActivePopup] = useState(null);
  const popup = activePopup ? featureDetails[activePopup] : null;

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] selection:bg-[#1a1c1e]/10 selection:text-[#1a1c1e]">
      <Head>
        <title>SettleSmart | Minimalist Group Expense Splitter</title>
        <meta name="description" content="Minimum payments, zero friction. The professional way to manage group expenses." />
      </Head>

      <CoinRain />
      <div className="fixed inset-0 bg-grid z-0 opacity-20" />
      <div className="fixed inset-0 bg-noise z-0 opacity-20" />
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1a1c1e]/5 blur-[120px] rounded-full z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#6c757d]/5 blur-[120px] rounded-full z-0" />

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 border-b border-[#1a1c1e]/5 bg-[#f8f9fa]/60 backdrop-blur-xl">
          <div className="container-mobile flex h-20 items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a1c1e] shadow-lg shadow-[#1a1c1e]/20">
                <CreditCard className="text-[#f8f9fa]" size={20} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-[#1a1c1e]">
                Settle<span className="text-[#6c757d]">Smart</span>
              </span>
            </motion.div>
            
            <div className="hidden items-center gap-8 md:flex">
              {['Features', 'How it works', 'Dashboard'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className="text-sm font-black text-stone-700 transition hover:text-black">
                  {item}
                </a>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <Button variant="outline" className="hidden px-6 py-2.5 text-sm md:flex border-stone-200 text-stone-600 hover:bg-stone-50" onClick={() => router.push('/join')}>
                Log In
              </Button>
              <Button className="px-6 py-2.5 text-sm bg-[#1a1c1e] shadow-[#1a1c1e]/20" onClick={() => router.push('/create')}>
                Get Started
              </Button>
            </motion.div>
          </div>
        </nav>

        <main>
          {/* Hero Section */}
          <section className="container-mobile py-24 md:py-32 lg:py-40 text-center lg:text-left">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border-stone-200 bg-stone-100 px-4 py-1.5 text-sm font-bold text-stone-600">
                  <Sparkles size={14} className="animate-pulse" />
                  AI-Powered Split Intelligence
                </div>
                <h1 className="mb-6 text-6xl font-black leading-[1.1] tracking-tighter text-[#1a1c1e] md:text-8xl">
                  Split <span className="text-[#6c757d]">Expenses</span>.<br />
                  Settle <span className="text-gradient">Smart</span>.
                </h1>
                <p className="mb-10 max-w-xl text-xl leading-relaxed text-stone-700 mx-auto lg:mx-0 font-bold">
                  Minimum transactions, zero friction. The neutral standard for group bills, shared rent, and trip expenses. 
                  Experience minimalist fintech.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row justify-center lg:justify-start">
                  <Button className="h-16 px-10 text-lg bg-[#1a1c1e]" onClick={() => router.push('/create')}>
                    Create New Group
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                  <Button variant="secondary" className="h-16 px-10 text-lg" onClick={() => router.push('/join')}>
                    Join Existing
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="relative"
                id="dashboard"
              >
                <div className="glass-card relative z-10 aspect-[4/3] rounded-[2.5rem] p-4 shadow-2xl overflow-hidden group border-stone-200">
                  {/* Mockup Dashboard UI */}
                  <div className="h-full w-full bg-white rounded-3xl overflow-hidden border border-stone-100 flex flex-col shadow-inner">
                    <div className="h-14 border-b border-stone-100 bg-stone-50 flex items-center px-6 gap-4">
                      <div className="w-3 h-3 rounded-full bg-stone-200" />
                      <div className="w-3 h-3 rounded-full bg-stone-200" />
                      <div className="w-3 h-3 rounded-full bg-stone-200" />
                      <div className="h-6 w-32 rounded-full bg-stone-100 mx-auto" />
                    </div>
                    <div className="flex-1 p-6 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 rounded-2xl bg-stone-50 border border-stone-100 p-4">
                           <div className="w-12 h-2 rounded bg-stone-200 mb-2"/>
                           <div className="w-20 h-6 rounded bg-stone-300"/>
                        </div>
                        <div className="h-24 rounded-2xl bg-stone-50 border border-stone-100 p-4">
                           <div className="w-12 h-2 rounded bg-stone-100 mb-2"/>
                           <div className="w-20 h-6 rounded bg-stone-200"/>
                        </div>
                      </div>
                      <div className="space-y-3">
                         {[1, 2, 3].map(i => (
                           <div key={i} className="h-16 rounded-xl bg-stone-50 border border-stone-100 flex items-center px-4 justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-lg bg-stone-100"/>
                                 <div className="w-24 h-4 rounded bg-stone-100"/>
                              </div>
                              <div className="w-16 h-4 rounded bg-stone-200"/>
                           </div>
                         ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Visual Glow */}
                <div className="absolute inset-0 bg-[#1a1c1e]/5 blur-[100px] rounded-full -z-10" />
              </motion.div>
            </div>
          </section>

          {/* Features Grid */}
          <section id="features" className="container-mobile py-24 border-t border-stone-200">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="mb-20 text-center"
            >
              <motion.h2 variants={itemVariants} className="mb-4 text-4xl font-bold tracking-tight text-[#1a1c1e] md:text-5xl">Built for Professionals.</motion.h2>
              <motion.p variants={itemVariants} className="mx-auto max-w-2xl text-lg text-stone-500">
                Forget complicated spreadsheets and manual math. SettleSmart is built with a focus on speed, precision, and neutrality.
              </motion.p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {[
                { icon: Zap, title: 'Zero Onboarding', text: 'No sign-up, no downloads. Just share a link and start splitting instantly.' },
                { icon: Bot, title: 'AI Splitting', text: 'Describe your expense in natural language and let AI calculate the complex shares.' },
                { icon: Calculator, title: 'Minimum Payments', text: 'Our algorithm minimizes the number of transactions needed to settle all debts.' },
                { icon: Share2, title: 'Instant Sharing', text: 'QR codes, invite links, and native share sheets work across all platforms.' },
                { icon: LayoutDashboard, title: 'Real-time Updates', text: 'Balances and expenses update instantly for everyone in the group.' },
                { icon: Smartphone, title: 'PWA Ready', text: 'Install SettleSmart on your home screen for a native app-like experience.' },
              ].map((f, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Card className="h-full hover:scale-[1.02] cursor-default group transition-all duration-300 border-stone-100 shadow-sm hover:shadow-xl hover:border-stone-200">
                    <div className={cn(
                      "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-50 text-stone-600 transition-colors group-hover:bg-[#1a1c1e] group-hover:text-white"
                    )}>
                      <f.icon size={28} />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-[#1a1c1e]">{f.title}</h3>
                    <p className="text-stone-500 leading-relaxed">{f.text}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="py-24 bg-stone-50 border-y border-stone-200 overflow-hidden">
            <div className="container-mobile">
              <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={containerVariants}
                >
                   <motion.h2 variants={itemVariants} className="mb-8 text-4xl font-bold tracking-tight text-[#1a1c1e] md:text-5xl">Settling up should be the easiest part of the trip.</motion.h2>
                   <div className="space-y-10">
                      {howItWorks.map(([title, text, Icon], index) => (
                        <motion.div key={title} variants={itemVariants} className="flex gap-6 group">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1a1c1e] text-white shadow-xl shadow-[#1a1c1e]/20 font-black text-xl">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="mb-2 text-xl font-bold text-[#1a1c1e] group-hover:text-[#6c757d] transition-colors">{title}</h4>
                            <p className="text-stone-500 leading-relaxed">{text}</p>
                          </div>
                        </motion.div>
                      ))}
                   </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                   <div className="glass-card p-1 rounded-[2.5rem] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl border-stone-200">
                      <div className="bg-white rounded-[2.25rem] p-8 space-y-8">
                         <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-400 opacity-50 uppercase text-xs tracking-widest">Live Settlement</span>
                            <div className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-[10px] font-black tracking-widest uppercase">Active</div>
                         </div>
                         <div className="space-y-6">
                            {[
                               { from: 'Sarah', to: 'Alex', amount: 450 },
                               { from: 'Mike', to: 'Alex', amount: 230 }
                            ].map((s, i) => (
                               <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-stone-50 border border-stone-100">
                                  <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-full bg-stone-200"/>
                                     <span className="font-bold text-[#1a1c1e]">{s.from}</span>
                                  </div>
                                  <ArrowRight size={20} className="text-[#6c757d]"/>
                                  <div className="flex items-center gap-4">
                                     <span className="font-bold text-[#1a1c1e]">{s.to}</span>
                                     <div className="w-10 h-10 rounded-full bg-[#1a1c1e]/10 border border-[#1a1c1e]/20"/>
                                  </div>
                                  <div className="text-xl font-black text-[#1a1c1e] ml-4">${s.amount}</div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container-mobile py-32 text-center">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="glass-card relative overflow-hidden rounded-[3rem] p-16 md:p-24 shadow-2xl border-stone-200"
             >
                <div className="absolute inset-0 bg-gradient-to-br from-stone-500/5 to-transparent -z-10"/>
                <h2 className="mb-8 text-5xl font-black tracking-tight text-[#1a1c1e] md:text-7xl">
                   Ready to settle?
                </h2>
                <p className="mx-auto mb-12 max-w-2xl text-xl text-stone-500">
                   Join thousands of users splitting expenses with SettleSmart. No strings attached, just perfect math.
                </p>
                <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                   <Button className="h-16 px-12 text-lg bg-[#1a1c1e] shadow-2xl shadow-[#1a1c1e]/20" onClick={() => router.push('/create')}>
                      Create Group Now
                   </Button>
                   <Button variant="secondary" className="h-16 px-12 text-lg" onClick={() => router.push('/join')}>
                      Join Group
                   </Button>
                </div>
             </motion.div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-stone-200 bg-white py-20">
          <div className="container-mobile">
             <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                <div className="md:col-span-2">
                   <div className="flex items-center gap-2 mb-6">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1c1e]">
                         <CreditCard className="text-[#f8f9fa]" size={16} />
                      </div>
                      <span className="text-xl font-black tracking-tighter text-[#1a1c1e]">
                         Settle<span className="text-[#6c757d]">Smart</span>
                      </span>
                   </div>
                   <p className="max-w-xs text-stone-400 leading-relaxed font-medium">
                      SettleSmart is a zero-onboarding fintech utility designed for friends, roommates, and travelers.
                   </p>
                </div>
                <div>
                   <h4 className="mb-6 font-bold text-[#1a1c1e] uppercase text-xs tracking-widest">Product</h4>
                   <ul className="space-y-4 text-sm text-stone-400 font-bold">
                      <li><a href="#" className="hover:text-[#1a1c1e] transition-colors">Features</a></li>
                      <li><a href="#" className="hover:text-[#1a1c1e] transition-colors">How it works</a></li>
                      <li><a href="#" className="hover:text-[#1a1c1e] transition-colors">Join Group</a></li>
                      <li><a href="#" className="hover:text-[#1a1c1e] transition-colors">Create Group</a></li>
                   </ul>
                </div>
                <div>
                   <h4 className="mb-6 font-bold text-[#1a1c1e] uppercase text-xs tracking-widest">Company</h4>
                   <ul className="space-y-4 text-sm text-stone-400 font-bold">
                      <li><a href="#" className="hover:text-[#1a1c1e] transition-colors">Privacy Policy</a></li>
                      <li><a href="#" className="hover:text-[#1a1c1e] transition-colors">Terms of Service</a></li>
                      <li><a href="#" className="hover:text-[#1a1c1e] transition-colors">Contact</a></li>
                   </ul>
                </div>
             </div>
             <div className="mt-20 pt-8 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-sm font-bold text-stone-300">© 2026 SettleSmart. All rights reserved.</p>
                <div className="flex gap-6">
                   <a href="#" className="text-stone-300 hover:text-[#1a1c1e] transition-colors"><Smartphone size={20}/></a>
                   <a href="#" className="text-stone-300 hover:text-[#1a1c1e] transition-colors"><Globe size={20}/></a>
                </div>
             </div>
          </div>
        </footer>
      </div>

      <Modal
        open={Boolean(popup)}
        onClose={() => setActivePopup(null)}
        icon={popup?.icon}
        title={popup?.title}
        action={popup && (
          <Button className="w-full bg-[#1a1c1e]" onClick={() => router.push(popup.href)}>
            {popup.actionLabel}
          </Button>
        )}
      >
        {popup?.body}
      </Modal>
    </div>
  );
}
