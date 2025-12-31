// textNode.js

import { useState, useRef, useEffect } from 'react';
import { BaseNode } from './BaseNode';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [nodeHeight, setNodeHeight] = useState(80);
  const [nodeWidth, setNodeWidth] = useState(200);
  const textRef = useRef(null);

  // Extract variables from text (e.g., {{variableName}})
  const extractVariables = (text) => {
    const regex = /\{\{(\w+)\}\}/g;
    const variables = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      variables.push(match[1]);
    }
    return variables;
  };

  const variables = extractVariables(currText);

  // Create handles for variables
  const variableHandles = variables.map((varName, index) => ({
    id: `${id}-${varName}`,
    type: 'target',
    style: { top: `${((index + 1) / (variables.length + 1)) * 100}%` },
  }));

  const handles = [
    ...variableHandles,
    {
      id: `${id}-output`,
      type: 'source',
    },
  ];

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  // Auto-resize based on content
  useEffect(() => {
    if (textRef.current) {
      // Calculate approximate width and height based on text
      const lines = currText.split('\n').length;
      const maxLineLength = Math.max(...currText.split('\n').map((line) => line.length));
      
      const estimatedWidth = Math.max(200, Math.min(500, maxLineLength * 8 + 40));
      const estimatedHeight = Math.max(80, lines * 20 + 60);
      
      setNodeWidth(estimatedWidth);
      setNodeHeight(estimatedHeight);
    }
  }, [currText]);

  return (
    <BaseNode 
      id={id} 
      data={data} 
      title="Text" 
      handles={handles}
      className="text-node"
      style={{ width: nodeWidth, height: nodeHeight }}
    >
      <textarea
        ref={textRef}
        value={currText}
        onChange={handleTextChange}
        className="text-node-input"
        placeholder="Enter text with {{variables}}"
        style={{
          width: '90%',
          height: '60px',
          padding: '5px',
          fontFamily: 'monospace',
          fontSize: '12px',
        }}
      />
      {variables.length > 0 && (
        <div className="variables-info">
          Variables: {variables.join(', ')}
        </div>
      )}
    </BaseNode>
  );
}
