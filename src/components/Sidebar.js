import menuItems from '../utils/menudata';
import LogoHeader from './LogoHeader';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="bg-dark text-white vh-100 position-fixed" style={{ width: '250px' }}>
      <LogoHeader />
      <ul className="nav flex-column p-3">
        {menuItems.map(item => (
          <li className="nav-item" key={item.id}>
            <Link
              to={item.url}
              className={`nav-link d-flex align-items-center ${location.pathname.startsWith(item.url) ? 'active bg-secondary text-white' : 'text-white'
                }`}
            >
              <i className={`bi ${item.icon} me-2`}></i>
              {item.title}
            </Link>
          </li>
        ))}
        <li className="nav-item">
          <a href="/logout" className="nav-link text-white">
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </a>
        </li>
      </ul>
    </div>
  );
}
export default Sidebar;