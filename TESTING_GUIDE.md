# Testing Guide

## Pre-Testing Setup

### 1. Backend Setup
```bash
cd backend

# Install dependencies
pip install fastapi uvicorn

# Start server
uvicorn main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm start
```

**Expected Output:**
```
On Your Network: http://192.168.x.x:3000
Local:           http://localhost:3000
```

Browser should open automatically to the React app.

---

## Test Suite 1: Node Abstraction & Creation

### Test 1.1: Verify All Nodes Load in Toolbar
**Steps:**
1. Open http://localhost:3000
2. Look at toolbar at top of page

**Expected Results:**
- ✅ 9 buttons visible: Input, LLM, Output, Text, Filter, Merge, Split, API, Process
- ✅ Buttons are styled with gradients
- ✅ Each button has different color

### Test 1.2: Create and Place Nodes
**Steps:**
1. Drag "Input" node to canvas
2. Drag "Text" node to canvas
3. Drag "Output" node to canvas

**Expected Results:**
- ✅ Nodes appear on canvas in correct position
- ✅ Nodes have colored headers with titles
- ✅ Handles visible on sides of nodes

### Test 1.3: Test Each New Node Type
**Steps:**
1. Drag "Filter" node → verify it appears with filter controls
2. Drag "Merge" node → verify it has 2 input handles
3. Drag "Split" node → verify it has 2 output handles
4. Drag "API" node → verify it has method and endpoint fields
5. Drag "Process" node → verify it has operation dropdown

**Expected Results:**
- ✅ Each node renders correctly
- ✅ All controls are visible and functional
- ✅ Node styling is consistent but unique

### Test 1.4: Test Node Styling
**Steps:**
1. Hover over a node
2. Click on a node to select it

**Expected Results:**
- ✅ Node shows hover effect (shadow increases)
- ✅ Node is selectable and draggable
- ✅ Text is readable with good contrast

---

## Test Suite 2: Text Node Features

### Test 2.1: Auto-Resize on Text Input
**Steps:**
1. Drag Text node to canvas
2. Click on textarea
3. Type: "Hello"
4. Type: "This is a longer text to test auto-resize"
5. Type multiple lines

**Expected Results:**
- ✅ Node height increases as you add more text
- ✅ Node width increases for longer lines
- ✅ Resizing is smooth and automatic
- ✅ Content remains visible

### Test 2.2: Variable Detection - Single Variable
**Steps:**
1. Clear text in Text node
2. Type: "Hello {{name}}"
3. Look at node

**Expected Results:**
- ✅ One new target handle appears on left side
- ✅ Handle is labeled/positioned for "name" variable
- ✅ Variables info box shows: "Variables: name"
- ✅ Output handle still visible on right

### Test 2.3: Variable Detection - Multiple Variables
**Steps:**
1. Clear text in Text node
2. Type: "{{greeting}} {{name}}, you are {{age}} years old"
3. Look at node

**Expected Results:**
- ✅ Three target handles appear, evenly spaced
- ✅ First handle ~25% from top (for greeting)
- ✅ Second handle ~50% from top (for name)
- ✅ Third handle ~75% from top (for age)
- ✅ Variables info shows: "Variables: greeting, name, age"

### Test 2.4: Variable Handle Connections
**Steps:**
1. Create Input node
2. Create Text node with "{{data}}" text
3. Connect Input's output handle to Text's {{data}} handle
4. Create Output node
5. Connect Text's output to Output's input

**Expected Results:**
- ✅ Connections are successful
- ✅ Edges are animated
- ✅ Graph shows all three nodes connected

### Test 2.5: Variable Name Validation
**Steps:**
1. Text node type: "{{valid_name}}"
2. Verify handle created

3. Type: "{{123invalid}}" (starts with number)
4. Verify no handle created

5. Type: "{{special!char}}" (invalid character)
6. Verify no handle created

**Expected Results:**
- ✅ Only valid JavaScript identifiers create handles
- ✅ Invalid names are ignored
- ✅ No errors in console

---

## Test Suite 3: Edge and Connection Management

### Test 3.1: Creating Connections
**Steps:**
1. Place Input and Output nodes
2. Drag from Input's source handle to Output's target handle

**Expected Results:**
- ✅ Edge is created
- ✅ Edge is animated (dashed line moving)
- ✅ Edge color matches primary color
- ✅ Arrow head appears at target

### Test 3.2: Deleting Connections
**Steps:**
1. Click on an edge to select it
2. Press Delete key

**Expected Results:**
- ✅ Edge is removed
- ✅ Nodes remain
- ✅ No errors

### Test 3.3: Multiple Connections
**Steps:**
1. Create a Filter node
2. Connect multiple inputs to the same Filter
3. Connect Filter to multiple outputs

**Expected Results:**
- ✅ Multiple connections work correctly
- ✅ All edges are visible and functional
- ✅ No connection conflicts

---

## Test Suite 4: Backend Integration

### Test 4.1: Simple Pipeline Submission
**Steps:**
1. Create: Input → Output
2. Click "Submit" button

**Expected Results:**
- ✅ Button shows "Submitting..." state
- ✅ Alert appears with results:
   ```
   Pipeline Analysis Complete
   Nodes: 2 | Edges: 1 | Valid DAG: Yes
   ```
- ✅ Alert disappears after 5 seconds
- ✅ Can submit again

### Test 4.2: Complex Pipeline Submission
**Steps:**
1. Create pipeline:
   ```
   Input → Filter → Split
           ├→ Merge → Output
           └→ Text → API
   ```
2. Connect edges appropriately
3. Click Submit

**Expected Results:**
- ✅ Alert shows correct node count (5-7 nodes)
- ✅ Alert shows correct edge count
- ✅ is_dag shows true (no cycles)

### Test 4.3: Pipeline with Variables
**Steps:**
1. Create: Input → Text({{data}}) → Output
2. Connect Input output to Text {{data}} handle
3. Connect Text output to Output
4. Click Submit

**Expected Results:**
- ✅ Submission succeeds
- ✅ Node count shows 3
- ✅ Edge count shows 2
- ✅ is_dag shows true

### Test 4.4: Invalid DAG (Cycle Detection)
**Steps:**
1. Create three nodes: A, B, C
2. Connect: A → B → C → A (create cycle)
3. Click Submit

**Expected Results:**
- ✅ Alert appears with results
- ✅ is_dag shows **false** (indicating cycle)
- ✅ No error in backend logs

### Test 4.5: Error Handling - No Backend
**Steps:**
1. Stop backend server
2. Create simple pipeline
3. Click Submit

**Expected Results:**
- ✅ Error alert appears
- ✅ Message: "Failed to submit pipeline..."
- ✅ Suggests checking backend is running
- ✅ No JavaScript errors in console

### Test 4.6: Empty Pipeline Submission
**Steps:**
1. Don't create any nodes
2. Try to click Submit

**Expected Results:**
- ✅ Submit button is **disabled** (grayed out)
- ✅ Tooltip or hint that nodes are needed

### Test 4.7: Response Data Verification
**Steps:**
1. Create: Input → LLM → Output
2. Look at network tab (F12 → Network)
3. Click Submit
4. Check the POST request details

**Expected Results:**
- ✅ Request sent to: `http://localhost:8000/pipelines/parse`
- ✅ Method: POST
- ✅ Content-Type: application/json
- ✅ Request body contains nodes and edges
- ✅ Response status: 200
- ✅ Response body: `{num_nodes: ..., num_edges: ..., is_dag: ...}`

---

## Test Suite 5: Styling and UI

### Test 5.1: Responsive Design
**Steps:**
1. Open app at 1920x1080 (desktop)
2. Verify layout is correct
3. Open DevTools (F12)
4. Set to mobile view (iPhone 12: 390x844)
5. Verify layout adjusts

**Expected Results:**
- ✅ Desktop: All elements fit comfortably
- ✅ Mobile: Elements stack/resize appropriately
- ✅ No horizontal scrolling on mobile
- ✅ Touch targets large enough

### Test 5.2: Color Consistency
**Steps:**
1. Look at each node type
2. Verify header colors match node type

**Expected Results:**
- ✅ Input: Green gradient
- ✅ Output: Red gradient
- ✅ Text: Cyan gradient
- ✅ LLM: Indigo gradient
- ✅ Filter: Orange/Yellow gradient
- ✅ Merge/Split: Green gradient
- ✅ API: Purple gradient
- ✅ Process: Pink/Magenta gradient

### Test 5.3: Hover Effects
**Steps:**
1. Hover over toolbar buttons
2. Hover over nodes
3. Hover over handles

**Expected Results:**
- ✅ Toolbar buttons lift up on hover
- ✅ Node shadows increase on hover
- ✅ Handle highlights on hover
- ✅ All transitions are smooth

### Test 5.4: Alert Styling
**Steps:**
1. Submit a pipeline
2. Look at alert notification

**Expected Results:**
- ✅ Alert appears in top-right
- ✅ Alert has colored left border
- ✅ Alert has appropriate background color
- ✅ Alert slides in smoothly
- ✅ Alert fades/slides out after 5 seconds

---

## Test Suite 6: Data Persistence & Store

### Test 6.1: Zustand Store Updates
**Steps:**
1. Open DevTools → Application/Storage → LocalStorage (if available)
2. Create nodes and edges
3. Verify node/edge objects in store

**Expected Results:**
- ✅ Nodes have correct id, type, position
- ✅ Edges have correct source, target, id
- ✅ Data updates in real-time

### Test 6.2: Node ID Generation
**Steps:**
1. Create 3 Input nodes
2. Check their IDs in DevTools

**Expected Results:**
- ✅ First Input: `customInput-1`
- ✅ Second Input: `customInput-2`
- ✅ Third Input: `customInput-3`
- ✅ IDs are unique

---

## Test Suite 7: Edge Cases & Error Handling

### Test 7.1: Very Large Pipelines
**Steps:**
1. Create 20+ nodes
2. Create 30+ edges
3. Submit pipeline

**Expected Results:**
- ✅ All nodes render correctly
- ✅ No performance issues
- ✅ Submission works
- ✅ Correct counts returned

### Test 7.2: Text Node with Special Characters
**Steps:**
1. Text node: Type: `"Data: {{user_id}}, {{user.name}}, {{123}}"`

**Expected Results:**
- ✅ Handle created for `user_id`
- ✅ No handle for `user.name` (contains dot - invalid)
- ✅ No handle for `123` (starts with number - invalid)
- ✅ Shows: "Variables: user_id"

### Test 7.3: Rapid Clicking
**Steps:**
1. Click Submit button rapidly 5 times
2. Wait for responses

**Expected Results:**
- ✅ Multiple requests are queued properly
- ✅ Each gets a response
- ✅ No errors or crashes
- ✅ UI remains responsive

### Test 7.4: Back-to-Back Submissions
**Steps:**
1. Create pipeline
2. Click Submit
3. Wait for alert
4. Modify pipeline
5. Click Submit again

**Expected Results:**
- ✅ First alert shows
- ✅ First alert dismissed automatically
- ✅ Second submission works
- ✅ Second alert shows correctly

---

## Performance Testing

### Test P1: Rendering Performance
**Steps:**
1. Open DevTools → Performance
2. Create 50+ nodes
3. Record performance timeline

**Expected Results:**
- ✅ No jank or stuttering
- ✅ 60 FPS maintained
- ✅ No memory leaks visible

### Test P2: Network Performance
**Steps:**
1. Open DevTools → Network
2. Throttle to "Slow 3G"
3. Submit pipeline
4. Watch request/response

**Expected Results:**
- ✅ Loading state shown to user
- ✅ Request completes without timeout
- ✅ Response displays correctly

---

## Accessibility Testing

### Test A1: Keyboard Navigation
**Steps:**
1. Press Tab to navigate through elements
2. Verify focus is visible

**Expected Results:**
- ✅ Can navigate to Submit button
- ✅ Can navigate to toolbar buttons
- ✅ Focus indicators are visible

### Test A2: Color Contrast
**Steps:**
1. Run browser accessibility tool (e.g., WAVE)
2. Check color contrasts

**Expected Results:**
- ✅ All text meets WCAG AA standards
- ✅ No low-contrast text elements

---

## Test Results Summary Template

```markdown
# Test Execution Report

Date: [DATE]
Tester: [NAME]
Environment: [Browser/OS]

## Part 1: Node Abstraction
- [ ] 1.1 Toolbar nodes load
- [ ] 1.2 Nodes create and place
- [ ] 1.3 New node types work
- [ ] 1.4 Styling is correct

## Part 2: Text Node Features
- [ ] 2.1 Auto-resize works
- [ ] 2.2 Single variable detection
- [ ] 2.3 Multiple variables detected
- [ ] 2.4 Variables connect properly
- [ ] 2.5 Variable validation works

## Part 3: Connections
- [ ] 3.1 Connections work
- [ ] 3.2 Deletion works
- [ ] 3.3 Multiple connections work

## Part 4: Backend Integration
- [ ] 4.1 Simple submission
- [ ] 4.2 Complex submission
- [ ] 4.3 Variables submission
- [ ] 4.4 Cycle detection
- [ ] 4.5 Error handling
- [ ] 4.6 Empty state
- [ ] 4.7 Response verification

## Part 5: Styling
- [ ] 5.1 Responsive design
- [ ] 5.2 Color consistency
- [ ] 5.3 Hover effects
- [ ] 5.4 Alert styling

## Overall Status
- ✅ All tests passed
- ⚠️ Some tests failed (list below)
- ❌ Critical issues found

### Issues Found
(List any failures or problems)

### Notes
(Additional observations)
```

---

## Debugging Tips

### Enable React DevTools
1. Install React Developer Tools extension
2. Inspect component props and state
3. Track re-renders

### Enable Redux DevTools (Alternative for Zustand)
```bash
npm install zustand-devtools
```

### Check Network Requests
1. Open DevTools → Network
2. Filter for XHR requests
3. Check request/response bodies

### Check Console for Errors
1. Open DevTools → Console
2. Look for red error messages
3. Inspect stack traces

### Backend Debugging
```bash
# Add debug logging to FastAPI
uvicorn main:app --reload --log-level debug
```

---

## Common Issues & Solutions

### Issue: "Cannot POST /pipelines/parse"
**Solution:** Backend not running. Start it with `uvicorn main:app --reload --port 8000`

### Issue: "Alerts not appearing"
**Solution:** Check browser console for errors. Verify fetch request succeeds.

### Issue: "Handles not appearing on Text node"
**Solution:** Check regex pattern for variable extraction. Ensure valid JavaScript identifiers.

### Issue: "Cycle detection always returns true"
**Solution:** Check DFS algorithm implementation. Verify color marking is working.

### Issue: "Nodes not dragging"
**Solution:** Ensure node has proper drag handlers. Check CSS isn't preventing interaction.

---

## Sign-Off

All tests should pass before deployment.

**Tested By:** _____________  
**Date:** _____________  
**Status:** ☐ PASSED ☐ FAILED  
**Sign-Off:** _____________
