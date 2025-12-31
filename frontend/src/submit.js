// submit.js

import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { useState } from 'react';

export const SubmitButton = () => {
    const { nodes, edges } = useStore((state) => ({
        nodes: state.nodes,
        edges: state.edges,
    }), shallow);
    
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nodes: nodes,
                    edges: edges,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Display the alert with results
            setAlert({
                type: 'success',
                title: 'Pipeline Analysis Complete',
                message: `Nodes: ${data.num_nodes} | Edges: ${data.num_edges} | Valid DAG: ${data.is_dag ? 'Yes' : 'No'}`,
                details: data,
            });

            // Auto-dismiss after 5 seconds
            setTimeout(() => setAlert(null), 5000);
        } catch (error) {
            console.error('Error submitting pipeline:', error);
            setAlert({
                type: 'error',
                title: 'Error',
                message: 'Failed to submit pipeline. Make sure the backend is running on http://localhost:8000',
            });
            setTimeout(() => setAlert(null), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="submit-container">
                <button 
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={loading || nodes.length === 0}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </div>
            {alert && (
                <div className={`alert ${alert.type}`}>
                    <strong>{alert.title}</strong>
                    <p>{alert.message}</p>
                </div>
            )}
        </>
    );
}
