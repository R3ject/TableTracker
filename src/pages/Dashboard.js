// src/pages/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import TableList from '../components/TableList';
import LogoutButton from '../components/LogoutButton';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>TableTracker Dashboard</h1>
      <LogoutButton />
      <Link to="/manage-tables">
        <button>Manage Tables</button>
      </Link>
      <TableList />
    </div>
  );
};

export default Dashboard;
