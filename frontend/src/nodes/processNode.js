// processNode.js

import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const ProcessNode = ({ id, data }) => {
  const [processType, setProcessType] = useState(data?.processType || 'transform');

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
    <BaseNode id={id} data={data} title="Process" handles={handles}>
      <label className="node-label">
        Operation:
        <select 
          value={processType} 
          onChange={(e) => setProcessType(e.target.value)}
          className="node-select"
        >
          <option value="transform">Transform</option>
          <option value="validate">Validate</option>
          <option value="parse">Parse</option>
          <option value="format">Format</option>
        </select>
      </label>
    </BaseNode>
  );
}
