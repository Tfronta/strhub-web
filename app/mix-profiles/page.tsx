// app/mix-profiles/page.tsx
'use client';
import MixProfilesDemo from '@/sections/mix-profiles/MixProfilesDemo';

export default function Page() {
  return (
    <div className="container mx-auto max-w-5xl space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Mix Profiles <span className="text-xs align-super">beta</span></h1>
      <p className="text-sm text-muted-foreground">Using demo data — you can load your own samples when available.</p>
      <MixProfilesDemo />
    </div>
  );
}
