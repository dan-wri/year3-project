import "react"
import {useState, useEffect} from "react"
import { useApi } from "../utils/api.js";

export function ProWriter() {
    const [quota, setQuota] = useState(null)
    const {makeRequest} = useApi()
    const [inputText, setInputText] = useState("")
    const [rewrittenText, setRewrittenText] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuota()
    }, [])
    
    const fetchQuota = async () => {
        try {
            const data = await makeRequest("quota")
            setQuota(data)
        } catch (err) {
            console.log(err)
        }
    }

    const getNextResetTime = () => {
        if (!quota?.last_reset_data) return null
        const resetDate = new Date(quota.last_reset_data)
        resetDate.setHours(resetDate.getHours() + 24)
        return resetDate
    }

    const handleRewrite = async () => {
        if (!inputText.trim()) return;
        setIsLoading(true);
        setError(null);
        setRewrittenText(null);

        try {
            const response = await makeRequest("improve-text", {
                method: "POST",
                body: JSON.stringify({ text: inputText }),
            });
            setRewrittenText(response.improved_text);
            fetchQuota();
        } catch (err) {
            setError(err.message || "Failed to rewrite text.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="text-rephraser-container">
        <h2>Rewrite Your Text</h2>

        <div className="quota-display">
            <p>AI requests remaining today: {quota?.quota_remaining || 0}</p>
            {quota?.quota_remaining === 0 && (
                <p>Next reset: {getNextResetTime()?.toLocaleString()}</p>
            )}
        </div>

        <textarea
            placeholder="Type your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={6}
            disabled={isLoading}
        />
        <button onClick={handleRewrite} disabled={isLoading} className="generate-button">
            {isLoading ? "Rewriting..." : "Rewrite Text"}
        </button>

        {error && <div className="error-message">{error}</div>}

        {rewrittenText && (
            <div className="rewritten-text-output">
            <h3>Rewritten Text:</h3>
            <p>{rewrittenText}</p>
            </div>
        )}
        </div>
    );

}