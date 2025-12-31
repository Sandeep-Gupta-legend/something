# Architecture & Extension Guide

## System Architecture

### High-Level Overview
```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                           │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│ │   Toolbar    │    │   Canvas     │    │   Submit     │   │
│ │  (Nodes to   │    │  (ReactFlow) │    │  (API Call)  │   │
│ │   Drag)      │    │              │    │              │   │
│ └──────────────┘    └──────────────┘    └──────────────┘   │
│        │                    │                    │           │
│        └────────────────────┴────────────────────┘           │
│                      │                                        │
│                 Zustand Store                                │
│              (nodes, edges state)                            │
└─────────────────────────────────────────────────────────────┘
                           │
                   HTTP POST Request
                (nodes & edges JSON)
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  FastAPI Backend                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  POST /pipelines/parse                               │  │
│  │  - Validate input (Pydantic models)                  │  │
│  │  - Count nodes and edges                             │  │
│  │  - Run DAG detection algorithm                       │  │
│  │  - Return JSON response                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                           │
                  JSON Response with
              {num_nodes, num_edges, is_dag}
                           │
                           ▼
                      Alert Display
```

## Data Flow

### 1. Creating Nodes
```
User drags node from toolbar
  ↓
DraggableNode fires onDragStart with node type
  ↓
User drops on canvas
  ↓
onDrop handler in PipelineUI
  ↓
Generate unique node ID via getNodeID()
  ↓
Create node object with id, type, position, data
  ↓
Call addNode() from Zustand store
  ↓
Node renders using NodeTypes mapping
  ↓
BaseNode renders with appropriate children
```

### 2. Connecting Nodes
```
User clicks on handle and drags
  ↓
ReactFlow detects connection
  ↓
onConnect handler called
  ↓
Call addEdge() from Zustand store
  ↓
Edge renders with animated styling
```

### 3. Submitting Pipeline
```
User clicks Submit button
  ↓
handleSubmit() collects nodes and edges from store
  ↓
POST request to backend with JSON payload
  ↓
Backend validates with Pydantic models
  ↓
DAG detection algorithm runs
  ↓
Response sent back as JSON
  ↓
Frontend displays alert with results
```

## Component Hierarchy

```
App
├── PipelineToolbar
│   ├── DraggableNode (customInput)
│   ├── DraggableNode (llm)
│   ├── DraggableNode (customOutput)
│   ├── DraggableNode (text)
│   ├── DraggableNode (filter)
│   ├── DraggableNode (merge)
│   ├── DraggableNode (split)
│   ├── DraggableNode (api)
│   └── DraggableNode (process)
│
├── PipelineUI
│   └── ReactFlow (Canvas)
│       ├── BaseNode
│       │   ├── InputNode
│       │   ├── OutputNode
│       │   ├── TextNode (with variable handles)
│       │   ├── LLMNode
│       │   ├── FilterNode
│       │   ├── MergeNode
│       │   ├── SplitNode
│       │   ├── APINode
│       │   └── ProcessNode
│       ├── Background
│       ├── Controls
│       └── MiniMap
│
└── SubmitButton
    └── Alert (on response)
```

## State Management (Zustand Store)

### Store Structure
```javascript
{
  nodes: Node[],          // Array of node objects
  edges: Edge[],          // Array of edge objects
  nodeIDs: { [type]: count },  // Counter for unique IDs
  
  // Actions
  getNodeID(type),        // Generate unique ID
  addNode(node),          // Add node to store
  onNodesChange(changes), // Handle node updates
  onEdgesChange(changes), // Handle edge updates
  onConnect(connection),  // Handle new connections
  updateNodeField(id, field, value)  // Update node data
}
```

### Node Object Structure
```javascript
{
  id: "customInput-1",
  type: "customInput",
  position: { x: 100, y: 150 },
  data: {
    inputName: "input_1",
    inputType: "Text",
    nodeType: "customInput"
  }
}
```

### Edge Object Structure
```javascript
{
  id: "customInput-1-text-1",
  source: "customInput-1",
  target: "text-1",
  type: "smoothstep",
  animated: true,
  markerEnd: { type: "ArrowClosedMarker", ... }
}
```

## Extending the System

### Adding a New Node Type

#### Step 1: Create Node Component
```javascript
// src/nodes/customNode.js
import { BaseNode } from './BaseNode';

export const CustomNode = ({ id, data }) => {
  const [state, setState] = useState(data?.fieldName || 'default');
  
  const handles = [
    { id: `${id}-input`, type: 'target' },
    { id: `${id}-output`, type: 'source' }
  ];
  
  return (
    <BaseNode id={id} data={data} title="Custom" handles={handles}>
      <label className="node-label">
        Setting:
        <input 
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="node-input"
        />
      </label>
    </BaseNode>
  );
};
```

#### Step 2: Register in ui.js
```javascript
// src/ui.js - Add to imports
import { CustomNode } from './nodes/customNode';

// Add to nodeTypes
const nodeTypes = {
  // ... existing types
  custom: CustomNode,
};
```

#### Step 3: Add to Toolbar
```javascript
// src/toolbar.js - Add button
<DraggableNode type='custom' label='Custom' />
```

#### Step 4: Add Styling (Optional)
```css
/* src/styles/BaseNode.css */
.custom .node-header {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

### Creating Custom Handle Configurations

#### Single Input, Single Output
```javascript
const handles = [
  { id: `${id}-input`, type: 'target' },
  { id: `${id}-output`, type: 'source' }
];
```

#### Multiple Inputs
```javascript
const handles = [
  { id: `${id}-input1`, type: 'target', style: { top: '30%' } },
  { id: `${id}-input2`, type: 'target', style: { top: '70%' } },
  { id: `${id}-output`, type: 'source' }
];
```

#### Multiple Outputs
```javascript
const handles = [
  { id: `${id}-input`, type: 'target' },
  { id: `${id}-output1`, type: 'source', style: { top: '30%' } },
  { id: `${id}-output2`, type: 'source', style: { top: '70%' } }
];
```

#### Dynamic Handles (like Text Node)
```javascript
const dynamicHandles = items.map((item, index) => ({
  id: `${id}-${item.name}`,
  type: 'target',
  style: { top: `${((index + 1) / (items.length + 1)) * 100}%` }
}));

const handles = [...dynamicHandles, { id: `${id}-output`, type: 'source' }];
```

## Extending Backend

### Adding New Analysis Features

```python
# main.py
@app.post('/pipelines/analyze')
def analyze_pipeline(pipeline: Pipeline):
    """Extended analysis with multiple metrics"""
    
    # Existing checks
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    is_dag = is_dag(pipeline.nodes, pipeline.edges)
    
    # New checks
    node_types_count = count_node_types(pipeline.nodes)
    max_depth = calculate_depth(pipeline.nodes, pipeline.edges)
    bottlenecks = find_bottlenecks(pipeline.nodes, pipeline.edges)
    
    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_dag,
        'node_types': node_types_count,
        'max_depth': max_depth,
        'bottlenecks': bottlenecks
    }
```

### Adding Node Execution

```python
@app.post('/pipelines/execute')
def execute_pipeline(pipeline: Pipeline, inputs: Dict):
    """Execute pipeline and return results"""
    
    # Validate DAG
    if not is_dag(pipeline.nodes, pipeline.edges):
        raise ValueError("Pipeline has cycles, cannot execute")
    
    # Topological sort
    execution_order = topological_sort(pipeline.nodes, pipeline.edges)
    
    # Execute nodes in order
    results = {}
    for node_id in execution_order:
        node = find_node(pipeline.nodes, node_id)
        # Execute node logic
        results[node_id] = execute_node(node, inputs, results)
    
    return results
```

## Performance Optimizations

### Frontend Optimizations
- ✅ Use shallow selectors in Zustand to prevent unnecessary re-renders
- ✅ useCallback for event handlers
- ✅ React.memo for node components (if needed)
- ✅ Lazy load heavy components

### Backend Optimizations
- ✅ O(V+E) DAG detection using DFS
- ✅ Efficient adjacency list representation
- ✅ Connection pooling (if database added)
- ✅ Caching for repeated analyses

## Security Considerations

### Frontend
- ✅ Validate node and edge data before sending
- ✅ Sanitize user inputs in text nodes
- ✅ Rate limit API calls
- ✅ Secure CORS policy

### Backend
- ✅ Input validation with Pydantic
- ✅ Maximum pipeline size limits
- ✅ Timeout for execution
- ✅ Authentication/authorization (can be added)
- ✅ Logging and monitoring

## Future Enhancements

### Short Term
- [ ] Save/load pipelines to localStorage
- [ ] Undo/redo functionality
- [ ] Export pipeline as JSON
- [ ] Node parameter validation

### Medium Term
- [ ] Database integration for persistence
- [ ] User authentication
- [ ] Pipeline versioning
- [ ] Collaboration features
- [ ] Node marketplace

### Long Term
- [ ] Pipeline execution engine
- [ ] Real-time monitoring
- [ ] Advanced analytics
- [ ] Machine learning integrations
- [ ] Cloud deployment options
