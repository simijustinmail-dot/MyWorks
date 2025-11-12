import UserDropdown from './UserDropdown';

const TopNavbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-primary border-bottom ms-250">
    <div className="container-fluid position-relative">
      <h3 className="text-dark fw-bold m-0 position-absolute top-50 start-50 translate-middle">
        KERALA UNIVERSITY OF HEALTH SCIENCES
      </h3>
      <div className="ms-auto">
        <UserDropdown />
      </div>
    </div>
  </nav>
);

export default TopNavbar;
