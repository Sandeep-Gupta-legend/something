// llmNode.js

import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const handles = [
    {
      id: `${id}-system`,
      type: 'target',
      style: { top: `${100 / 3}%` },
    },
    {
      id: `${id}-prompt`,
      type: 'target',
      style: { top: `${200 / 3}%` },
    },
    {
      id: `${id}-response`,
      type: 'source',
    },
  ];

  return (
    <BaseNode id={id} data={data} title="LLM" handles={handles}>
      <div className="node-description">
        This is an LLM node for processing text with language models.
      </div>
    </BaseNode>
  );
}
