// src/components/TableItem.js
import React from 'react';

const TableItem = ({ table, onToggle }) => {
  return (
    <div className="table-item">
      <span>
        {table.name} - Capacity: {table.capacity} - Status: {table.status}
      </span>
      <button onClick={() => onToggle(table)}>Toggle</button>
    </div>
  );
};

export default TableItem;
