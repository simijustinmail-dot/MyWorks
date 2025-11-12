import { Dropdown } from 'react-bootstrap';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const UserDropdown = () => {
  const { user } = useContext(UserContext); // Access user from context

  return (
    <Dropdown align="end">
      <Dropdown.Toggle variant="light" id="dropdown-user">
        <img
          src="/images/user.jpg"
          alt="user"
          className="rounded-circle me-2"
          width="30"
          height="30"
        />
        Hi, <strong>{user?.name || 'Guest'}</strong>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* <Dropdown.Item href="/change-password">Change Password</Dropdown.Item> */}
        <Dropdown.Item href="/logout">Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserDropdown;
