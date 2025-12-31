// filterNode.js

import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => {
  const [filterType, setFilterType] = useState(data?.filterType || 'contains');
  const [filterValue, setFilterValue] = useState(data?.filterValue || '');

  const handles = [
    {
      id: `${id}-input`,
      type: 'target',
    },
    {
      id: `${id}-output`,
      type: 'source',
    },
  ];

  return (
    <BaseNode id={id} data={data} title="Filter" handles={handles}>
      <label className="node-label">
        Type:
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="node-select"
        >
          <option value="contains">Contains</option>
          <option value="startsWith">Starts With</option>
          <option value="endsWith">Ends With</option>
          <option value="regex">Regex</option>
        </select>
      </label>
      <label className="node-label">
        Value:
        <input 
          type="text" 
          value={filterValue} 
          onChange={(e) => setFilterValue(e.target.value)}
          className="node-input"
        />
      </label>
    </BaseNode>
  );
}
