import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { Home, Briefcase, Wrench, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { isPathOn } from '../data/cities';

export default function BottomNav() {
  const [signedIn, setSignedIn] = useState(false);
  const { pathname } = useLocation();
  const { t } = useLanguage();
  useEffect(() => {
    api.getCurrentUser().then((u) => setSignedIn(!!u)).catch(() => setSignedIn(false));
  }, [pathname]);

  const navItems = [
    { to: '/', label: t('navHome'), icon: <Home size={24} /> },
    { to: '/services', label: t('navServices'), icon: <Briefcase size={24} /> },
    { to: '/supplies', label: t('navSupplies'), icon: <Wrench size={24} /> },
    { to: signedIn ? '/dashboard' : '/login', label: t('navProfile'), icon: <User size={24} /> },
  ].filter((item) => isPathOn(item.to)); // e.g. Supplies when the city has switched it off

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          end={item.to === '/'}
        >
          <div className="icon-wrapper">
            {item.icon}
          </div>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
