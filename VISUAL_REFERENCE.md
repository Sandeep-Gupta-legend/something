# Quick Visual Reference

## Node Types & Colors

### Core Nodes
```
┌─────────────┐  Input Node (Green)
│   INPUT     │  Creates pipeline input
├─────────────┤
│ Name: ...   │
│ Type: ...   │
└─────────────┘
        ↓
     
┌─────────────┐  Text Node (Cyan)
│    TEXT     │  Processes and transforms text
├─────────────┤  Supports {{variable}} syntax
│ Text:       │  Creates handles for variables
│ [textarea]  │
└─────────────┘
        ↓

┌─────────────┐  Output Node (Red)
│   OUTPUT    │  Captures final result
├─────────────┤
│ Name: ...   │
│ Type: ...   │
└─────────────┘
```

## All 9 Available Nodes

| Node | Color | Purpose | Input/Output |
|------|-------|---------|--------------|
| Input | Green | Define inputs | 0 in, 1 out |
| Output | Red | Capture output | 1 in, 0 out |
| Text | Cyan | Text processing with variables | N in ({{var}}), 1 out |
| LLM | Indigo | Language model processing | 2 in, 1 out |
| Filter | Orange | Filter data by conditions | 1 in, 1 out |
| Merge | Green | Combine 2 inputs | 2 in, 1 out |
| Split | Green | Split 1 input to 2 outputs | 1 in, 2 out |
| API | Purple | Make HTTP requests | 1 in, 1 out |
| Process | Pink | Data processing operations | 1 in, 1 out |

## Variable Detection Example

### Text Node with Variables
```
┌──────────────────────────────┐
│         TEXT                 │
├──────────────────────────────┤
│ "Hello {{name}},            │
│  You are {{age}} years old"  │
└──────────────────────────────┘
     ↑            ↑
  handle for   handle for
  "name"       "age"
```

### Resulting Structure
```
Input1 ──→ ╔════════════════╗
           ║      TEXT      ║
Input2 ──→ ║ {{name}}       ║ ──→ Output
           ║ {{age}}        ║
           ╚════════════════╝

Info Box: "Variables: name, age"
```

## UI Layout

```
┌─────────────────────────────────────────────────────┐
│                      TOOLBAR                         │
│  [INPUT] [LLM] [OUTPUT] [TEXT] [FILTER] [MERGE]   │
│  [SPLIT] [API] [PROCESS]                           │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                     CANVAS (ReactFlow)              │
│                                                      │
│   ┌──────┐         ┌──────┐         ┌──────┐       │
│   │Input │────────→│ Text │────────→│Output│       │
│   └──────┘         └──────┘         └──────┘       │
│                                                      │
│  [Controls] [MiniMap] [Background Grid]             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  [=================== SUBMIT BUTTON ===================]
└─────────────────────────────────────────────────────┘

              Alert (on submit)
    ┌──────────────────────────────┐
    │ Pipeline Analysis Complete   │
    │ Nodes: 3 | Edges: 2          │
    │ Valid DAG: Yes               │
    └──────────────────────────────┘
```

## Data Flow Diagram

```
FRONTEND (React)
      │
      ├─→ [Toolbar] Drag/drop nodes
      │         ↓
      ├─→ [Canvas] Create connections
      │         ↓
      ├─→ [Store] Zustand state management
      │         ↓
      ├─→ [Submit] POST to backend
      │         │
      │         ↓
      │   { nodes, edges }
      │         │
      ↓         ↓
   
BACKEND (FastAPI)
      │
      ├─→ Receive JSON
      │         ↓
      ├─→ Validate with Pydantic
      │         ↓
      ├─→ Count nodes/edges
      │         ↓
      ├─→ Run DAG detection
      │         ↓
      ├─→ Build response
      │         │
      ↓         ↓
      │   { num_nodes, num_edges, is_dag }
      │         │
      ↓         ↓
   
FRONTEND (React)
      │
      ├─→ Receive JSON
      │         ↓
      ├─→ Display Alert
      │         ↓
      ├─→ Auto-dismiss (5s)
      │         ↓
      └─→ Ready for next submission
```

## Handle Positioning Reference

### Text Node with 3 Variables
```
Position from top: 25%, 50%, 75%

●──── {{name}}      (25% from top)
│
│
●──── {{age}}       (50% from top)
│
│
●──── {{city}}      (75% from top)

Formula: ((index + 1) / (total + 1)) * 100
```

## Styling Color Palette

```
PRIMARY:    #4f46e5  (Indigo)
DARK:       #4338ca  (Dark Indigo)
SECONDARY: #06b6d4  (Cyan)
SUCCESS:   #10b981  (Green)
WARNING:   #f59e0b  (Orange)
DANGER:    #ef4444  (Red)
LIGHT:     #f3f4f6  (Light Gray)
WHITE:     #ffffff  (White)
DARK:      #1f2937  (Dark Gray)
```

## Key Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Delete node/edge | Delete or Backspace |
| Pan canvas | Click + Drag (empty space) |
| Zoom in | Scroll up / CTRL + Scroll |
| Zoom out | Scroll down / CTRL + Scroll |
| Fit view | Spacebar (if implemented) |
| Select all | CTRL + A (if implemented) |

## File Organization

### Frontend Structure
```
frontend/src/
├── nodes/              ← All node components
│   ├── BaseNode.js    ← Base abstraction
│   └── *Node.js       ← Specific implementations
├── styles/            ← CSS files
│   ├── BaseNode.css   ← Node styling
│   └── App.css        ← Global styling
├── App.js             ← Main component
├── ui.js              ← Canvas component
├── toolbar.js         ← Toolbar component
├── submit.js          ← Submit button + integration
├── store.js           ← Zustand state
└── ...
```

### Backend Structure
```
backend/
├── main.py            ← FastAPI app
│   ├── Models         ← Pydantic models
│   ├── DAG checker    ← Cycle detection
│   └── Routes         ← API endpoints
└── ...
```

## Common Workflows

### Workflow 1: Data Processing Pipeline
```
Input → Filter → Transform → Output
```

### Workflow 2: AI/ML Pipeline
```
Input → LLM → Process → Output
```

### Workflow 3: Conditional Pipeline
```
       ┌→ Filter A → ┐
Input →┤             ├→ Merge → Output
       └→ Filter B →┘
```

### Workflow 4: API Integration
```
Input → API Request → Process → Output
```

## Testing Checklist

Quick checklist for basic testing:
```
□ All 9 nodes appear in toolbar
□ Can drag nodes to canvas
□ Can create connections between nodes
□ Submit button works
□ Alert shows correct node/edge count
□ DAG detection works (try creating cycle)
□ Text node variables create handles
□ Styling looks good on all screen sizes
```

## Configuration Reference

### Backend (port)
```python
# main.py - Change port here
uvicorn main:app --reload --port 8000  # Change 8000
```

### Frontend (backend URL)
```javascript
// submit.js - Change URL here
fetch('http://localhost:8000/pipelines/parse', {  // Change URL
```

### Styling (colors)
```css
/* BaseNode.css - Customize colors here */
:root {
  --primary-color: #4f46e5;    /* Change primary */
  --secondary-color: #06b6d4;  /* Change secondary */
  /* ... etc */
}
```

---

## Quick Troubleshooting Map

| Problem | Check | Solution |
|---------|-------|----------|
| Nodes not appearing | Browser console | Clear cache, refresh |
| Backend error | Network tab | Start backend on port 8000 |
| Variables not working | Text node | Check {{variableName}} format |
| Styling broken | CSS files | Verify BaseNode.css exists |
| Submit fails | Backend logs | Check pipeline structure |

---

**This visual reference should help you understand the system at a glance!**
