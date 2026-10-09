'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const PUBLIC_ROUTES = ['/', '/login'];

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { 
    currentUser, 
    activeScrapbook,
    setSession, 
    fetchUserScrapbooks, 
    subscribeRealtime, 
    isLoading 
  } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  // 1. Initialize session and listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserScrapbooks();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserScrapbooks();
      } else {
        setSession(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, fetchUserScrapbooks]);

  // 2. Real-time subscription when active scrapbook changes
  useEffect(() => {
    if (activeScrapbook?.id) {
      const unsubscribe = subscribeRealtime();
      return () => {
        unsubscribe();
      };
    }
  }, [activeScrapbook?.id, subscribeRealtime]);

  // 3. Navigation protection
  useEffect(() => {
    if (isLoading) return;

    const isPublic = PUBLIC_ROUTES.includes(pathname);

    if (pathname === '/login') {
      if (currentUser) {
        router.push('/');
      }
    } else if (!isPublic && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, pathname, router, isLoading]);

  return <>{children}</>;
}
