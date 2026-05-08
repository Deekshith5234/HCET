import React from 'react';
import { Button } from '../components/UI';
import { useRouter } from 'next/router';
import { WifiOff } from 'lucide-react';

export default function Offline() {
  const router = useRouter();

  return (
    <div className="app-shell flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <WifiOff size={40} />
        </div>
        <h1 className="mb-3 text-4xl font-black tracking-tight text-textwhite">You're Offline</h1>
        <p className="mb-10 text-lg text-muted leading-relaxed">
          Some features require an active connection. We'll automatically reconnect once your network is stable.
        </p>
        <Button onClick={() => router.push('/')} className="w-full">
          Go Home
        </Button>
      </div>
    </div>
  );
}
