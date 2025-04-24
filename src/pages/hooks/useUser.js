import { useEffect, useState } from "react";

export default function useUser(setAuth) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuth && setAuth(false);
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('http://localhost:8081/api/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            setAuth && setAuth(false);
          }
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    // Only run once on mount, unless setAuth changes
  }, [setAuth]);

  return { user, loading, error };
}