import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { RequireAuth } from '@/components/RequireAuth';
import { useAuthStore } from '@/components/authStore';

export default function HomePage() {
  const user = useAuthStore(s=>s.currentUser);
  return (
    <RequireAuth>
      <Layout>
        <div className="px-6 py-12 max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-brandText">Welcome {user?.name?.split(' ')[0] || ''}</h1>
          <p className="text-brandText/70 leading-relaxed max-w-2xl mb-10 text-sm md:text-base">
            Real‑time posture, joint angles, symmetry and rep counting directly in your browser. Jump into a drill session or review cumulative metrics.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <Link href="/drill" className="group block p-6 rounded-xl bg-panel border border-accent/20 hover:border-accent/60 transition">
              <h3 className="font-semibold mb-2 group-hover:text-accent text-brandText">Start a Drill →</h3>
              <p className="text-xs md:text-sm text-brandText/60">Open the camera, pick a movement and receive live feedback.</p>
            </Link>
            <Link href="/profile" className="group block p-6 rounded-xl bg-panel border border-accent/20 hover:border-accent/60 transition">
              <h3 className="font-semibold mb-2 group-hover:text-accent text-brandText">View Profile →</h3>
              <p className="text-xs md:text-sm text-brandText/60">Track sessions, reps, symmetry and posture consistency.</p>
            </Link>
          </div>
        </div>
      </Layout>
    </RequireAuth>
  );
}