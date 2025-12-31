// splitNode.js

import { BaseNode } from './BaseNode';

export const SplitNode = ({ id, data }) => {
  const handles = [
    {
      id: `${id}-input`,
      type: 'target',
    },
    {
      id: `${id}-output1`,
      type: 'source',
      style: { top: '30%' },
    },
    {
      id: `${id}-output2`,
      type: 'source',
      style: { top: '70%' },
    },
  ];

  return (
    <BaseNode id={id} data={data} title="Split" handles={handles}>
      <div className="node-description">
        Splits one input into two outputs
      </div>
    </BaseNode>
  );
}
