import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav style={styles.navbar}>
      <ul style={styles.navbarList}>
        <li style={styles.navbarItem}>
          <Link to="/signup" style={styles.navbarLink}>Sign Up</Link>
        </li>
        <li style={styles.navbarItem}>
          <Link to="/habits" style={styles.navbarLink}>Habits</Link>
        </li>
        <li style={styles.navbarItem}>
          <Link to="/goals" style={styles.navbarLink}>Goals</Link>
        </li>
        <li style={styles.navbarItem}>
          <Link to="/inspirations" style={styles.navbarLink}>Inspirations</Link>
        </li>
        <li style={styles.navbarItem}>
          <Link to="/" style={styles.navbarLink}>Todos</Link>
        </li>
        <li style={{...styles.navbarItem, ...styles.searchItem}}>
          <input type="text" placeholder="Search" style={styles.searchInput} />
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#333',
    padding: '10px',
  },
  navbarList: {
    display: 'flex',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navbarItem: {
    margin: '0 10px',
  },
  navbarLink: {
    color: '#fff',
    textDecoration: 'none',
  },
  searchItem: {
    marginLeft: 'auto',
  },
  searchInput: {
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    color: '#333',
  },
};

export default NavBar;