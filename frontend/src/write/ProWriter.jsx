import "react"
import {useState, useEffect} from "react"
import { useApi } from "../utils/api.js";
import { Dropdown } from "../utils/Dropdown.jsx";

export function ProWriter() {
    const [quota, setQuota] = useState(null)
    const {makeRequest} = useApi()
    const [inputText, setInputText] = useState("")
    const [rewrittenText, setRewrittenText] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null);

    const [selectedOption, setSelectedOption] = useState("Cover Letter");

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
        if (!quota?.last_reset_date) return null
        const resetDate = new Date(quota.last_reset_date)
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
                body: JSON.stringify({ text: inputText, type: selectedOption }),
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
                <p>AI prompts remaining today: {quota?.quota_remaining || 0}</p>
                {quota?.quota_remaining === 0 && (
                <p>Next reset: {getNextResetTime()?.toLocaleString()}</p>
                )}
            </div>

            <div className="dropdown-wrapper">
                <Dropdown
                    options={["Email", "Text Rewriter"]}
                    selected={selectedOption}
                    onSelect={setSelectedOption}
                />

                <p className="dropdown-description">
                    {selectedOption === "Email"
                        ? "Improve your email's clarity, tone, and professionalism."
                        : "Rephrase any text to improve flow, grammar, or style."}
                </p>
            </div>

            <div className="rephraser-flex">
                <div className="rephraser-box">
                <textarea
                    placeholder="Type your text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={10}
                    maxLength={1500}
                    disabled={isLoading}
                />
                </div>

                <button
                    onClick={handleRewrite}
                    disabled={isLoading}
                    className="rephraser-arrow"
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "2rem" }}
                >
                    ➡️
                </button>

                <div className="rephraser-box">
                    {error && <div className="error-message">{error}</div>}
                    <textarea
                        value={error ? `Error: ${error}` : rewrittenText || ""}
                        placeholder={isLoading ? "Rewriting..." : "Your rewritten text will appear here..."}
                        readOnly
                        rows={10}
                    />
                </div>
            </div>

            <button
                onClick={handleRewrite}
                disabled={isLoading}
                className="generate-button"
                style={{ marginTop: "1rem" }}
            >
                {isLoading ? "Rewriting..." : "Rewrite Text"}
            </button>
        </div>

    );

}