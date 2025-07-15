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
                            <h4>Type: {rewrite.type}</h4>
                            <div className="rewrite-block">
                                <div className="rewrite-section">
                                    <h4>Original:</h4>
                                    <div className="rephraser-box">
                                        <textarea
                                        value={rewrite.original_text}
                                        readOnly
                                        rows={10}
                                        />
                                    </div>
                                </div>
                                <div className="rewrite-section">
                                    <h4>Improved:</h4>
                                    <div className="rephraser-box">
                                        <textarea
                                        value={rewrite.improved_text}
                                        readOnly
                                        rows={10}
                                        />
                                    </div>
                                </div>
                            </div>
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
