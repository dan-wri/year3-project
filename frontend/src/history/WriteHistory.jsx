import "react";
import { useState, useEffect } from "react";
import { useApi } from "../utils/api.js";

export function WriteHistory() {
    const { makeRequest } = useApi();
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await makeRequest("write-history");
            setHistory(data.rewrites);
        } catch (err) {
            console.error(err);
            setError("Failed to load rewrite history.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="loading">Loading rewrite history...</div>;
    }

    if (error) {
        return (
            <div className="error-message">
                <p>{error}</p>
                <button onClick={fetchHistory}>Retry</button>
            </div>
        );
    }

    return (
        <div className="history-panel">
            <h2>Rewrite History</h2>
            {history.length === 0 ? (
                <p>No rewrite history</p>
            ) : (
                <div className="history-list">
                    {history.map((rewrite) => (
                        <div key={rewrite.id} className="history-item">
                            <h4>Original:</h4>
                            <p>{rewrite.original_text}</p>
                            <h4>Improved:</h4>
                            <p>{rewrite.improved_text}</p>
                            <p className="timestamp">
                                {new Date(rewrite.date_created).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
