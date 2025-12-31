// BaseNode.js
// Abstract base component for all node types
// Provides common styling, handle management, and data handling

import { Handle, Position } from 'reactflow';
import '../styles/BaseNode.css';

export const BaseNode = ({
  id,
  data,
  title,
  children,
  handles = [],
  className = '',
}) => {
  return (
    <div className={`base-node ${className}`}>
      {/* Render all target handles first */}
      {handles
        .filter((h) => h.type === 'target')
        .map((handle) => (
          <Handle
            key={handle.id}
            type="target"
            position={handle.position || Position.Left}
            id={handle.id}
            style={handle.style || {}}
          />
        ))}

      {/* Node header */}
      <div className="node-header">
        <span className="node-title">{title}</span>
      </div>

      {/* Node content */}
      <div className="node-content">{children}</div>

      {/* Render all source handles last */}
      {handles
        .filter((h) => h.type === 'source')
        .map((handle) => (
          <Handle
            key={handle.id}
            type="source"
            position={handle.position || Position.Right}
            id={handle.id}
            style={handle.style || {}}
          />
        ))}
    </div>
  );
};
