import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession,signOut } from 'next-auth/react';
import { isTokenValid } from '@/api/token';

export function useAuth(redirectTo = '/login') {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'authenticated') {
      // console.log('use Auth authenticated session: ', session);
      isTokenValid(session.user.accessToken).then((isValid) => {
        if (!isValid) {
          // console.log('use Auth signOut: ');
          signOut();
          // router.push('/login');
        }
      });
    }else{
      // console.log('use Auth ready to redirect: ', redirectTo);
      router.push(redirectTo);
    }
  }, [session, status, router, redirectTo]);

  return { session, status };
}
