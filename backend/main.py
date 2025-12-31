from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from collections import deque, defaultdict

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

class Edge(BaseModel):
    source: str
    target: str
    id: str

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Check if the graph formed by nodes and edges is a Directed Acyclic Graph (DAG).
    Uses topological sorting with DFS to detect cycles.
    """
    if not nodes:
        return True
    
    # Build adjacency list
    graph = defaultdict(list)
    node_ids = {node.id for node in nodes}
    
    for edge in edges:
        if edge.source in node_ids and edge.target in node_ids:
            graph[edge.source].append(edge.target)
    
    # Colors: 0 = white (unvisited), 1 = gray (visiting), 2 = black (visited)
    color = {node.id: 0 for node in nodes}
    
    def has_cycle(node_id: str) -> bool:
        color[node_id] = 1  # Mark as gray (visiting)
        
        for neighbor in graph[node_id]:
            if color[neighbor] == 1:  # Back edge (cycle detected)
                return True
            if color[neighbor] == 0 and has_cycle(neighbor):
                return True
        
        color[node_id] = 2  # Mark as black (visited)
        return False
    
    # Check all nodes for cycles
    for node in nodes:
        if color[node.id] == 0:
            if has_cycle(node.id):
                return False
    
    return True

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    """
    Analyze a pipeline and return:
    - num_nodes: Number of nodes in the pipeline
    - num_edges: Number of edges in the pipeline
    - is_dag: Whether the pipeline forms a valid DAG (no cycles)
    """
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag = is_dag(pipeline.nodes, pipeline.edges)
    
    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': dag
    }

