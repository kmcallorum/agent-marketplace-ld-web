import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { LoadingPage } from '@/components/common';
import { useAuth } from '@/hooks';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const loginAttempted = useRef(false);

  const code = searchParams.get('code');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    if (code && !loginAttempted.current) {
      loginAttempted.current = true;
      login(code).then(() => {
        navigate('/dashboard');
      });
    }
  }, [code, login, navigate, isAuthenticated]);

  return (
    <Layout>
      <LoadingPage message="Logging in..." />
    </Layout>
  );
}
