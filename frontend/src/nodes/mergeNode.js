// mergeNode.js

import { BaseNode } from './BaseNode';

export const MergeNode = ({ id, data }) => {
  const handles = [
    {
      id: `${id}-input1`,
      type: 'target',
      style: { top: '30%' },
    },
    {
      id: `${id}-input2`,
      type: 'target',
      style: { top: '70%' },
    },
    {
      id: `${id}-output`,
      type: 'source',
    },
  ];

  return (
    <BaseNode id={id} data={data} title="Merge" handles={handles}>
      <div className="node-description">
        Merges two inputs into one output
      </div>
    </BaseNode>
  );
}
