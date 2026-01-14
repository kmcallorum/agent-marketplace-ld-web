import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { loginWithGithub, logout, fetchCurrentUser, setLoading } from '@/store/authSlice';
import { setStarredAgents } from '@/store/agentsSlice';
import { authService } from '@/services';
import toast from 'react-hot-toast';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  // Fetch current user on mount if we have a token
  useEffect(() => {
    const token = authService.getStoredToken();
    if (token && !isAuthenticated && !user) {
      dispatch(fetchCurrentUser());
    } else if (!token) {
      dispatch(setLoading(false));
    }
  }, [dispatch, isAuthenticated, user]);

  // Fetch starred agents when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      authService.getStarredAgents().then((starred) => {
        dispatch(setStarredAgents(starred));
      }).catch(() => {
        // Silently fail - not critical
      });
    }
  }, [dispatch, isAuthenticated]);

  const login = useCallback(
    async (githubCode: string) => {
      try {
        await dispatch(loginWithGithub(githubCode)).unwrap();
        toast.success('Logged in successfully!');
      } catch {
        toast.error('Login failed. Please try again.');
      }
    },
    [dispatch]
  );

  const logoutUser = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Logged out successfully');
    } catch {
      toast.error('Logout failed');
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout: logoutUser,
  };
}
