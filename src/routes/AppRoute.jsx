import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../pages/Layout/MainLayout';
import HomePage from '../pages/Public/HomePage';
import AboutPage from '../pages/Public/AboutPage';
import Profile from '../pages/Private/Profile';

const AppRoute = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoute;