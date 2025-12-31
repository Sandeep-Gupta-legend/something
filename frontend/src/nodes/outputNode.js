// outputNode.js

import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data.outputType || 'Text');

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
  };

  const handles = [
    {
      id: `${id}-value`,
      type: 'target',
    },
  ];

  return (
    <BaseNode id={id} data={data} title="Output" handles={handles}>
      <label className="node-label">
        Name:
        <input 
          type="text" 
          value={currName} 
          onChange={handleNameChange}
          className="node-input"
        />
      </label>
      <label className="node-label">
        Type:
        <select value={outputType} onChange={handleTypeChange} className="node-select">
          <option value="Text">Text</option>
          <option value="File">Image</option>
        </select>
      </label>
    </BaseNode>
  );
}
