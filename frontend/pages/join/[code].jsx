import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { api, storage } from '../../lib/api';
import { Button, Card } from '../../components/UI';
import { UserPlus } from 'lucide-react';

export default function JoinWithCode() {
  const router = useRouter();
  const { code } = router.query;
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');
    try {
      const result = await api.joinGroup(code, name);
      storage.setUser(result.user_id, result.guest_token, result.group_id);
      router.push(`/group/${result.group_id}`);
    } catch (err) {
      setError('Invalid invite code');
    }
    setLoading(false);
  };

  return (
    <div className="app-shell flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-lg bg-highlight/15 text-highlight">
            <UserPlus size={28} />
          </div>
          <h2 className="text-2xl font-bold text-textwhite">You're Invited</h2>
          <p className="mt-2 text-sm text-muted">Enter your name to join this group.</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-textwhite">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="app-input"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Joining...' : 'Join Group'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
