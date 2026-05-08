import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const CoinRain = () => {
  const [coins, setCoins] = useState([]);
  
  useEffect(() => {
    const coinCount = 25;
    const newCoins = Array.from({ length: coinCount }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 6,
      size: 15 + Math.random() * 30,
      rotation: Math.random() * 360,
      depth: Math.random() * 5,
    }));
    setCoins(newCoins);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {coins.map(coin => (
        <motion.div
          key={coin.id}
          initial={{ y: -100, opacity: 0, rotateX: 0, rotateY: 0 }}
          animate={{ 
            y: ['0vh', '110vh'], 
            opacity: [0, 1, 1, 0],
            rotateX: [0, 360 * (coin.id % 2 === 0 ? 1 : -1)],
            rotateY: [0, 360]
          }}
          transition={{
            duration: coin.duration,
            delay: coin.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute flex items-center justify-center"
          style={{ 
            left: `${coin.left}%`,
            width: coin.size,
            height: coin.size,
          }}
        >
          <div 
            className="w-full h-full rounded-full border-[2px] border-amber-600/50 shadow-[0_0_15px_rgba(251,191,36,0.5)] flex items-center justify-center bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700"
            style={{ transform: `scale(${1 - coin.depth * 0.1})` }}
          >
            <span className="text-[10px] font-black text-amber-900/50">$</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const Card = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={cn(
      'bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 relative overflow-hidden group border-[3px] border-stone-900 shadow-[0_20px_50px_rgba(0,0,0,0.1)]',
      className
    )}
  >
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'border-2 border-stone-200 bg-white text-stone-900 hover:bg-stone-50',
    danger: 'bg-red-50 text-red-500 border-2 border-red-100 hover:bg-red-100',
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'font-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-[11px]',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const IconButton = ({ label, children, className = '', ...props }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    type="button"
    aria-label={label}
    title={label}
    className={cn(
      'inline-flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-stone-200 bg-white text-stone-900 transition-all hover:bg-stone-50',
      className
    )}
    {...props}
  >
    {children}
  </motion.button>
);

const Modal = ({ open, onClose, icon: Icon, title, children, action }) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg glass-card rounded-[3rem] p-10 shadow-2xl border-2 border-stone-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-8 flex items-start justify-between gap-4">
              <div className="flex items-center gap-5">
                {Icon && (
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-900 border-2 border-stone-200">
                    <Icon size={28} />
                  </div>
                )}
                <h3 className="text-3xl font-black tracking-tighter text-stone-900">{title}</h3>
              </div>
              <button
                type="button"
                className="rounded-full p-3 text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
                onClick={onClose}
              >
                <X size={24} />
              </button>
            </div>
            <div className="text-stone-600 font-bold leading-relaxed">{children}</div>
            {action && <div className="mt-10">{action}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Header = ({ title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-12"
  >
    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-stone-900 mb-4">
      {title}
    </h1>
    {subtitle && (
      <p className="text-xl text-stone-500 font-bold">
        {subtitle}
      </p>
    )}
  </motion.div>
);

const StatBox = ({ label, value, icon: Icon, color = 'blue' }) => (
  <Card className="border-2 border-stone-200 bg-white">
    <div className="flex items-center justify-between mb-4">
      <span className="app-label">{label}</span>
      <div className={cn("p-3 rounded-2xl border-2", {
        'bg-blue-50 text-blue-600 border-blue-100': color === 'blue',
        'bg-emerald-50 text-emerald-600 border-emerald-100': color === 'green',
        'bg-indigo-50 text-indigo-600 border-indigo-100': color === 'indigo'
      })}>
        {Icon && <Icon size={22} />}
      </div>
    </div>
    <div className="text-4xl font-black text-stone-900 tracking-tight">{value}</div>
  </Card>
);

export { Card, Button, Header, StatBox, IconButton, Modal, CoinRain, cn };
