# Quick Start Guide

## Prerequisites
- Node.js and npm installed
- Python 3.7+ installed
- npm packages: `npm install` in frontend directory

## Setup & Running

### 1. Start the Backend
```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload --port 8000
```
Backend will be available at: `http://localhost:8000`

### 2. Start the Frontend
```bash
cd frontend
npm install
npm start
```
Frontend will open at: `http://localhost:3000`

## Features Overview

### Node Types Available (9 total)
- **Input**: Define input parameters for your pipeline
- **Output**: Capture final output of pipeline
- **Text**: Text processing with variable support ({{varName}})
- **LLM**: Large Language Model integration
- **Filter**: Filter data based on conditions
- **Merge**: Combine two inputs
- **Split**: Split one input into two paths
- **API**: Make HTTP requests to external APIs
- **Process**: Perform various data processing operations

### Core Capabilities

#### 1. Drag & Drop Interface
- Drag nodes from toolbar to canvas
- Connect nodes with edges
- Adjust node positions on canvas
- Delete nodes and edges

#### 2. Text Node Variables
- Use `{{variableName}}` syntax in text nodes
- Automatically creates input handles
- Example: `"Response: {{data}}"` creates one input handle

#### 3. Submit Pipeline
- Click Submit button to analyze your pipeline
- Receives feedback about pipeline structure
- Shows number of nodes and edges
- Indicates if pipeline is a valid DAG (no cycles)

#### 4. Modern Styling
- Color-coded nodes by type
- Responsive design for all screen sizes
- Smooth animations and transitions
- Visual feedback for interactions

## Example Workflows

### Workflow 1: Text Processing
```
Input → Text (with {{input}} variable) → Output
- Enter text data in Input
- Text node can reference the input variable
- Output captures final result
```

### Workflow 2: Conditional Processing
```
Input → Filter (contains 'keyword') → Process → Output
- Filter node processes input data
- Process node transforms filtered results
- Output node captures final result
```

### Workflow 3: Branching Pipeline
```
Input → Split → [Filter] → Merge → Output
         └─────→ [Filter]
- Split takes single input, creates two paths
- Each path has independent filtering
- Merge combines both paths into single output
```

## API Response Format

When you submit a pipeline, you'll receive:
```json
{
  "num_nodes": 5,
  "num_edges": 4,
  "is_dag": true
}
```

- **num_nodes**: Total number of nodes in pipeline
- **num_edges**: Total number of connections
- **is_dag**: True if valid DAG (no circular dependencies), False otherwise

## Tips & Tricks

1. **Create Reusable Patterns**: Use combinations of nodes to create common workflows
2. **Check for Cycles**: Always verify `is_dag: true` before deployment
3. **Variable Names**: Use descriptive variable names for clarity ({{customerName}}, {{transactionAmount}})
4. **Node Configuration**: Adjust filter types, API methods, and process operations for your use case
5. **Testing**: Start with simple pipelines and gradually add complexity

## Troubleshooting

### Backend Connection Error
- Ensure backend is running on `http://localhost:8000`
- Check Python dependencies are installed: `pip install fastapi uvicorn`
- Verify no other service is using port 8000

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Rebuild frontend: `npm run build`
- Check CSS files are in `src/styles/` directory

### Nodes Not Appearing
- Ensure new node types are registered in `src/ui.js` nodeTypes object
- Verify node component files are in `src/nodes/` directory
- Check browser console for import errors

## Project Structure
```
task/
├── backend/
│   └── main.py (FastAPI application)
├── frontend/
│   ├── src/
│   │   ├── nodes/ (all node components)
│   │   ├── styles/ (CSS styling)
│   │   ├── App.js (main app component)
│   │   ├── submit.js (backend integration)
│   │   ├── toolbar.js (node library)
│   │   ├── ui.js (canvas/flow)
│   │   └── store.js (state management)
│   └── package.json
└── IMPLEMENTATION_SUMMARY.md (detailed documentation)
```

## Next Steps

1. **Enhance Nodes**: Add more node types for specific domains
2. **Add Persistence**: Save/load pipelines to/from database
3. **Validation**: Add input validation rules for nodes
4. **Execution**: Implement actual pipeline execution engine
5. **Analytics**: Add pipeline performance monitoring
