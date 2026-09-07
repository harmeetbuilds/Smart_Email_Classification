import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiConnected, setApiConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editingResponse, setEditingResponse] = useState(false);

  // Check whether FastAPI is running
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${API_URL}/`);
        setApiConnected(response.ok);
      } catch {
        setApiConnected(false);
      }
    };

    checkBackend();
  }, []);

  // Analyze email
  const analyzeEmail = async () => {
    if (!email.trim()) {
      setError("Please enter an email before analyzing.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setCopied(false);
    setEditingResponse(false);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend returned an error.");
      }

      const data = await response.json();

      setResult(data);
      setApiConnected(true);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the backend. Make sure FastAPI is running on port 8000."
      );

      setApiConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Copy AI generated response
  const copyResponse = async () => {
    if (!result?.response) return;

    try {
      await navigator.clipboard.writeText(result.response);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Unable to copy the response.");
    }
  };

  // Regenerate AI response
  const regenerateResponse = async () => {
    if (!email.trim()) return;

    setLoading(true);
    setError("");
    setCopied(false);
    setEditingResponse(false);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to regenerate response.");
      }

      const data = await response.json();

      setResult(data);
      setApiConnected(true);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to regenerate the response. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Save edited response
  const saveEditedResponse = () => {
    setEditingResponse(false);
    setCopied(false);
  };

  // Clear everything
  const clearAll = () => {
    setEmail("");
    setResult(null);
    setError("");
    setCopied(false);
    setEditingResponse(false);
  };

  const isSpam = result?.status === "spam";

  const intentScore = result?.intent?.decision_score;

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, Arial, Helvetica, sans-serif;
          background: #f5f7fb;
          color: #172033;
        }

        button,
        textarea {
          font-family: inherit;
        }

        .app {
          min-height: 100vh;
        }

        /* NAVBAR */

        .navbar {
          height: 72px;
          background: #ffffff;
          border-bottom: 1px solid #e6eaf0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 7%;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon {
          width: 44px;
          height: 44px;
          border-radius: 13px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 22px;
          box-shadow: 0 6px 18px rgba(37, 99, 235, 0.25);
        }

        .brand-name {
          font-size: 19px;
          font-weight: 750;
        }

        .brand-subtitle {
          color: #7b8496;
          font-size: 11px;
          margin-top: 3px;
        }

        .api-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 650;
        }

        .api-connected {
          color: #15803d;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }

        .api-disconnected {
          color: #b45309;
          background: #fffbeb;
          border: 1px solid #fde68a;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
        }

        /* MAIN */

        .main {
          width: min(1100px, 92%);
          margin: auto;
          padding: 55px 0 70px;
        }

        .hero {
          text-align: center;
          margin-bottom: 38px;
        }

        .hero-badge {
          display: inline-block;
          padding: 7px 14px;
          border-radius: 20px;
          background: #eef2ff;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 750;
          margin-bottom: 15px;
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(34px, 5vw, 52px);
          line-height: 1.1;
          letter-spacing: -1.8px;
          color: #111827;
        }

        .hero h1 span {
          color: #4f46e5;
        }

        .hero p {
          max-width: 680px;
          margin: 16px auto 0;
          color: #667085;
          font-size: 16px;
          line-height: 1.7;
        }

        /* ANALYZER */

        .analyzer {
          background: #ffffff;
          border: 1px solid #e2e7ef;
          border-radius: 22px;
          padding: 26px;
          box-shadow: 0 15px 45px rgba(31, 41, 55, 0.08);
        }

        .input-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .input-title {
          font-size: 15px;
          font-weight: 750;
        }

        .input-hint {
          color: #98a2b3;
          font-size: 12px;
        }

        textarea {
          width: 100%;
          min-height: 230px;
          resize: vertical;
          border: 1.5px solid #d9dee8;
          border-radius: 14px;
          padding: 17px;
          outline: none;
          font-size: 15px;
          line-height: 1.6;
          color: #344054;
          transition: 0.2s;
        }

        textarea:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        textarea::placeholder {
          color: #a6afbd;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 15px;
        }

        .clear-btn,
        .analyze-btn {
          border-radius: 11px;
          padding: 12px 22px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }

        .clear-btn {
          background: white;
          border: 1px solid #d9dee8;
          color: #475467;
        }

        .clear-btn:hover {
          background: #f8fafc;
        }

        .clear-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .analyze-btn {
          border: none;
          color: white;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          box-shadow: 0 7px 18px rgba(79, 70, 229, 0.25);
        }

        .analyze-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 23px rgba(79, 70, 229, 0.3);
        }

        .analyze-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .error {
          margin-top: 15px;
          padding: 13px 15px;
          border-radius: 10px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          font-size: 13px;
        }

        /* RESULTS */

        .results {
          margin-top: 32px;
        }

        .results-heading {
          font-size: 21px;
          font-weight: 750;
          margin-bottom: 15px;
        }

        .result-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .result-card {
          background: white;
          border: 1px solid #e2e7ef;
          border-radius: 17px;
          padding: 21px;
          box-shadow: 0 7px 25px rgba(31, 41, 55, 0.05);
        }

        .full-card {
          grid-column: 1 / -1;
        }

        .card-label {
          color: #667085;
          font-size: 11px;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          margin-bottom: 12px;
        }

        .status-box {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .status-icon {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
        }

        .legitimate-icon {
          background: #f0fdf4;
        }

        .spam-icon {
          background: #fef2f2;
        }

        .card-value {
          font-size: 25px;
          font-weight: 800;
        }

        .legitimate {
          color: #15803d;
        }

        .spam {
          color: #dc2626;
        }

        .intent {
          color: #4f46e5;
        }

        .score {
          margin-top: 5px;
          color: #667085;
          font-size: 13px;
        }

        /* EXPLAINABLE AI */

        .intent-explanation {
          margin-top: 14px;
          padding: 12px 14px;
          background: #f5f7ff;
          border: 1px solid #e0e7ff;
          border-radius: 11px;
        }

        .intent-explanation-title {
          font-size: 11px;
          font-weight: 750;
          color: #667085;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 6px;
        }

        .intent-explanation-text {
          font-size: 13px;
          line-height: 1.5;
          color: #475467;
        }

        .evidence {
          margin-top: 9px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .evidence-label {
          font-size: 11px;
          color: #667085;
          font-weight: 700;
          margin-right: 2px;
        }

        .evidence-tag {
          padding: 4px 8px;
          border-radius: 7px;
          background: #eef2ff;
          color: #4f46e5;
          font-size: 11px;
          font-weight: 650;
        }

        /* PRIORITY */

        .priority-high {
          color: #dc2626;
        }

        .priority-medium {
          color: #d97706;
        }

        .priority-low {
          color: #15803d;
        }

        .priority-box {
          margin-top: 12px;
          padding: 12px 14px;
          border-radius: 11px;
          background: #f8fafc;
          border: 1px solid #edf0f5;
        }

        .priority-reason {
          color: #667085;
          font-size: 12px;
          line-height: 1.5;
        }

        .priority-evidence {
          margin-top: 9px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .priority-tag {
          padding: 4px 8px;
          border-radius: 7px;
          background: #fff7ed;
          color: #c2410c;
          font-size: 11px;
          font-weight: 650;
        }

        /* EMAIL */

        .email-preview {
          background: #f8fafc;
          border: 1px solid #edf0f5;
          border-radius: 11px;
          padding: 15px;
          color: #475467;
          font-size: 14px;
          line-height: 1.65;
          white-space: pre-wrap;
          word-break: break-word;
        }

        /* AI RESPONSE */

        .response-preview {
          background: #f5f7ff;
          border: 1px solid #e0e7ff;
          color: #344054;
        }

        .response-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 12px;
          flex-wrap: wrap;
        }

        .response-editor {
          width: 100%;
          min-height: 220px;
          resize: vertical;
          background: #f5f7ff;
          border: 1px solid #e0e7ff;
          border-radius: 11px;
          padding: 15px;
          color: #344054;
          font-size: 14px;
          line-height: 1.65;
          outline: none;
        }

        .response-editor:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        /* INTENT SCORES */

        .scores {
          margin-top: 20px;
        }

        .scores-title {
          color: #667085;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .score-row {
          display: grid;
          grid-template-columns: 150px 1fr 65px;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .score-name {
          font-size: 12px;
          color: #475467;
          text-transform: capitalize;
        }

        .score-bar {
          height: 7px;
          background: #edf0f5;
          border-radius: 20px;
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          background: linear-gradient(90deg, #2563eb, #6366f1);
          border-radius: 20px;
        }

        .score-number {
          text-align: right;
          font-size: 11px;
          color: #667085;
        }

        .footer {
          text-align: center;
          color: #98a2b3;
          font-size: 12px;
          margin-top: 45px;
        }

        @media (max-width: 700px) {
          .navbar {
            padding: 0 5%;
          }

          .api-status {
            display: none;
          }

          .main {
            width: 92%;
            padding-top: 35px;
          }

          .analyzer {
            padding: 17px;
          }

          .result-grid {
            grid-template-columns: 1fr;
          }

          .full-card {
            grid-column: auto;
          }

          .actions {
            flex-direction: column;
          }

          .clear-btn,
          .analyze-btn {
            width: 100%;
          }

          .response-actions {
            justify-content: stretch;
          }

          .response-actions button {
            flex: 1;
          }

          .score-row {
            grid-template-columns: 100px 1fr 55px;
          }
        }
      `}</style>

      <div className="app">

        {/* NAVBAR */}

        <nav className="navbar">
          <div className="brand">
            <div className="brand-icon">✉</div>

            <div>
              <div className="brand-name">
                Smart Email Classifier
              </div>

              <div className="brand-subtitle">
                AI-powered email analysis
              </div>
            </div>
          </div>

          <div
            className={`api-status ${
              apiConnected
                ? "api-connected"
                : "api-disconnected"
            }`}
          >
            <span className="status-dot"></span>

            {apiConnected
              ? "API Connected"
              : "API Offline"}
          </div>
        </nav>

        {/* MAIN */}

        <main className="main">

          {/* HERO */}

          <section className="hero">
            <div className="hero-badge">
              AI • NLP • MACHINE LEARNING
            </div>

            <h1>
              Analyze your emails{" "}
              <span>intelligently.</span>
            </h1>

            <p>
              Detect spam, identify email intent, and
              generate professional AI-powered responses
              using machine learning and Gemini AI.
            </p>
          </section>

          {/* EMAIL INPUT */}

          <section className="analyzer">

            <div className="input-header">
              <div className="input-title">
                Email Content
              </div>

              <div className="input-hint">
                Paste or type an email
              </div>
            </div>

            <textarea
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Example: Hi, I would like to schedule a meeting tomorrow at 11 AM to discuss the project..."
            />

            <div className="actions">

              <button
                className="clear-btn"
                onClick={clearAll}
              >
                Clear
              </button>

              <button
                className="analyze-btn"
                onClick={analyzeEmail}
                disabled={loading}
              >
                {loading
                  ? "Analyzing..."
                  : "Analyze Email →"}
              </button>

            </div>

            {error && (
              <div className="error">
                {error}
              </div>
            )}

          </section>

          {/* RESULTS */}

          {result && (
            <section className="results">

              <div className="results-heading">
                Analysis Result
              </div>

              <div className="result-grid">

                {/* SPAM */}

                <div className="result-card">

                  <div className="card-label">
                    Spam Detection
                  </div>

                  <div className="status-box">

                    <div
                      className={`status-icon ${
                        isSpam
                          ? "spam-icon"
                          : "legitimate-icon"
                      }`}
                    >
                      {isSpam ? "⚠️" : "✓"}
                    </div>

                    <div>

                      <div
                        className={`card-value ${
                          isSpam
                            ? "spam"
                            : "legitimate"
                        }`}
                      >
                        {isSpam
                          ? "Spam"
                          : "Legitimate"}
                      </div>

                      <div className="score">
                        Model prediction:{" "}
                        {result.spam?.prediction}
                      </div>

                      <div className="score">
                        Decision score:{" "}
                        {Number(
                          result.spam?.decision_score
                        ).toFixed(4)}
                      </div>

                    </div>

                  </div>

                </div>

                {/* INTENT */}

                <div className="result-card">

                  <div className="card-label">
                    Email Intent
                  </div>

                  {result.intent ? (
                    <>
                      <div className="card-value intent">
                        {result.intent.label}
                      </div>

                      <div className="score">
                        Decision score:{" "}
                        {Number(
                          intentScore
                        ).toFixed(4)}
                      </div>

                      {/* EXPLAINABLE AI */}

                      {result.intent.explanation && (
                        <div className="intent-explanation">

                          <div className="intent-explanation-title">
                            Why this intent?
                          </div>

                          <div className="intent-explanation-text">
                            {result.intent.explanation.summary}
                          </div>

                          {result.intent.explanation.evidence?.length > 0 && (
                            <div className="evidence">

                              <span className="evidence-label">
                                Evidence:
                              </span>

                              {result.intent.explanation.evidence.map(
                                (keyword) => (
                                  <span
                                    className="evidence-tag"
                                    key={keyword}
                                  >
                                    {keyword}
                                  </span>
                                )
                              )}

                            </div>
                          )}

                        </div>
                      )}

                    </>
                  ) : (
                    <div className="card-value spam">
                      Not Classified
                    </div>
                  )}

                </div>

                {/* PRIORITY */}

                {result.status === "legitimate" && (
                  <div className="result-card">

                    <div className="card-label">
                      Priority Detection
                    </div>

                    {result.priority ? (
                      <>
                        <div
                          className={`card-value ${
                            result.priority.level === "high"
                              ? "priority-high"
                              : result.priority.level === "medium"
                              ? "priority-medium"
                              : "priority-low"
                          }`}
                        >
                          {result.priority.level.toUpperCase()}
                        </div>

                        <div className="score">
                          Priority score:{" "}
                          {result.priority.score}
                        </div>

                        <div className="priority-box">

                          <div className="priority-reason">
                            {result.priority.reason}
                          </div>

                          {result.priority.evidence?.length > 0 && (
                            <div className="priority-evidence">

                              <span className="evidence-label">
                                Evidence:
                              </span>

                              {result.priority.evidence.map(
                                (keyword) => (
                                  <span
                                    className="priority-tag"
                                    key={keyword}
                                  >
                                    {keyword}
                                  </span>
                                )
                              )}

                            </div>
                          )}

                        </div>
                      </>
                    ) : (
                      <div className="card-value">
                        Not Available
                      </div>
                    )}

                  </div>
                )}

                {/* EMAIL */}

                <div className="result-card full-card">

                  <div className="card-label">
                    Analyzed Email
                  </div>

                  <div className="email-preview">
                    {result.email}
                  </div>

                </div>

                {/* AI GENERATED RESPONSE */}

                {result.status === "legitimate" &&
                  result.response && (
                    <div className="result-card full-card">

                      <div className="card-label">
                        AI Generated Response
                      </div>

                      {editingResponse ? (
                        <>
                          <textarea
                            className="response-editor"
                            value={result.response}
                            onChange={(e) =>
                              setResult((previous) => ({
                                ...previous,
                                response: e.target.value,
                              }))
                            }
                          />

                          <div className="response-actions">

                            <button
                              className="clear-btn"
                              onClick={() =>
                                setEditingResponse(false)
                              }
                            >
                              Cancel
                            </button>

                            <button
                              className="analyze-btn"
                              onClick={saveEditedResponse}
                            >
                              Save Response
                            </button>

                          </div>
                        </>
                      ) : (
                        <>
                          <div className="email-preview response-preview">
                            {result.response}
                          </div>

                          <div className="response-actions">

                            <button
                              className="clear-btn"
                              onClick={() =>
                                setEditingResponse(true)
                              }
                            >
                              Edit Response
                            </button>

                            <button
                              className="clear-btn"
                              onClick={regenerateResponse}
                              disabled={loading}
                            >
                              {loading
                                ? "Regenerating..."
                                : "Regenerate"}
                            </button>

                            <button
                              className="clear-btn"
                              onClick={copyResponse}
                              disabled={loading}
                            >
                              {copied
                                ? "Copied ✓"
                                : "Copy Response"}
                            </button>

                          </div>
                        </>
                      )}

                    </div>
                  )}

                {/* INTENT SCORES */}

                {result.intent?.scores && (
                  <div className="result-card full-card">

                    <div className="card-label">
                      Intent Model Scores
                    </div>

                    <div className="scores">

                      {Object.entries(
                        result.intent.scores
                      )
                        .sort((a, b) => b[1] - a[1])
                        .map(([name, score]) => {

                          const maxScore =
                            Math.max(
                              ...Object.values(
                                result.intent.scores
                              )
                            );

                          const percentage =
                            maxScore > 0
                              ? (score / maxScore) * 100
                              : 0;

                          return (
                            <div
                              className="score-row"
                              key={name}
                            >

                              <div className="score-name">
                                {name.replace(
                                  /_/g,
                                  " "
                                )}
                              </div>

                              <div className="score-bar">

                                <div
                                  className="score-fill"
                                  style={{
                                    width: `${Math.max(
                                      0,
                                      percentage
                                    )}%`,
                                  }}
                                ></div>

                              </div>

                              <div className="score-number">
                                {Number(score).toFixed(3)}
                              </div>

                            </div>
                          );
                        })}

                    </div>

                  </div>
                )}

              </div>

            </section>
          )}

          <div className="footer">
            Smart Email Classification • Spam Detection + Intent Classification + AI Response
          </div>

        </main>

      </div>
    </>
  );
}

export default App;