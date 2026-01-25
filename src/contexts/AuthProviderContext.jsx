import { createContext, useContext, useEffect, useState } from 'react';
import { routes } from '@/App';
import { useLocation, useNavigate } from 'react-router-dom';
import useRequest from '@/hooks/useRequest';

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const [authUser, setAuthUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { get } = useRequest();

    function updateAuthUser(data) {
        setAuthUser(data);
    }

    function signOut() {
        localStorage.removeItem('token');
        setAuthUser(null);
        navigate(routes.default);
    }

    useEffect(() => {
        const fetchUserInfo = async () => {
            // Skip fetching if on public routes or user already loaded
            if (
                location.pathname === routes.login ||
                location.pathname === routes.register ||
                authUser
            ) {
                return;
            }

            // Check if token exists
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }

            const response = await get('/users/my-info');
            if (response && response.results) {
                setAuthUser(response.results);
            } else {
                // If get fails or no results (and get handles error notification),
                // we might want to clear token if it was an auth error.
                // useRequest catches errors.
                // If the error was 401, axios logic might have redirected?
                // Wait, useRequest wraps axiosClient. axiosClient interceptor handles 401/redirect.
                // So we just need to handle the success case here.
            }
        };

        fetchUserInfo();
    }, [location.pathname]);

    return (
        <AuthContext.Provider value={{ authUser, updateAuthUser, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) throw new Error('AuthContext must be use in provider');

    return context;
};
