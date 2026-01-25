
import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Register';
import MyAccount from '@/pages/MyAccount';
import AdminLayout from '@/components/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import UploadMovie from '@/pages/admin/UploadMovie';
import MovieManagement from '@/pages/admin/MovieManagement';
import UserManagement from '@/pages/admin/UserManagement';
import MovieDetail from '@/pages/MovieDetail';
import MyListPage from '@/pages/MyListPage';
import SearchPage from '@/pages/SearchPage';
import './App.css';

export const routes = {
  default: '/',
  home: '/home',
  login: '/login',
  register: '/register',
  myAccount: (username) => `/account/${username}`,
  admin: {
    dashboard: '/admin/dashboard',
    upload: '/admin/upload',
    movies: '/admin/movies',
    users: '/admin/users',
  },
  movieDetail: (id) => `/film/${id}`,
  myList: '/my-list',
  search: '/search',
};

function App() {
  return (
    <Routes>
      <Route path={routes.default} element={<Home />} />
      <Route path={routes.home} element={<Home />} />
      <Route path={routes.login} element={<Login />} />
      <Route path={routes.register} element={<Signup />} />
      <Route path="/film/:id" element={<MovieDetail />} />
      <Route path={routes.myList} element={<MyListPage />} />
      <Route path={routes.search} element={<SearchPage />} />
      <Route
        path={routes.myAccount(':username')}
        element={<MyAccount />}
      />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="upload" element={<UploadMovie />} />
        <Route path="movies" element={<MovieManagement />} />
        <Route path="users" element={<UserManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
