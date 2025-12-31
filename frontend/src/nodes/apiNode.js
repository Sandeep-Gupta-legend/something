// apiNode.js

import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const APINode = ({ id, data }) => {
  const [endpoint, setEndpoint] = useState(data?.endpoint || '');
  const [method, setMethod] = useState(data?.method || 'GET');

  const handles = [
    {
      id: `${id}-request`,
      type: 'target',
    },
    {
      id: `${id}-response`,
      type: 'source',
    },
  ];

  return (
    <BaseNode id={id} data={data} title="API" handles={handles}>
      <label className="node-label">
        Method:
        <select 
          value={method} 
          onChange={(e) => setMethod(e.target.value)}
          className="node-select"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </label>
      <label className="node-label">
        Endpoint:
        <input 
          type="text" 
          value={endpoint} 
          onChange={(e) => setEndpoint(e.target.value)}
          className="node-input"
          placeholder="https://api.example.com"
        />
      </label>
    </BaseNode>
  );
}
