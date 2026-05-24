import { useState } from "react";
import jsPDF from "jspdf";
import "./App.css";

function App() {
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const samples = {
    Python: `def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

print(factorial(5))`,

    Java: `public class Main {
    static int factorial(int n) {
        if (n == 0) return 1;
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(factorial(5));
    }
}`,

    JavaScript: `function factorial(n) {
    if (n === 0) return 1;
    return n * factorial(n - 1);
}

console.log(factorial(5));`,

    C: `#include <stdio.h>

int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}

int main() {
    printf("%d", factorial(5));
    return 0;
}`,

    "C++": `#include <iostream>
using namespace std;

int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}

int main() {
    cout << factorial(5);
    return 0;
}`,
  };

  const totalReviews = history.length;

  const pythonReviews = history.filter(
    (item) => item.language === "Python"
  ).length;

  const javaReviews = history.filter(
    (item) => item.language === "Java"
  ).length;

  const latestReviewDate =
    history.length > 0 ? history[0].created_at : "No reviews yet";

  const reviewCode = async () => {
    setLoading(true);
    setReview("");

    try {
      const response = await fetch("http://127.0.0.1:8000/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language, code }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setReview(data.ai_review);
        loadHistory();
      } else if (data.rule_based_issues) {
        setReview(data.rule_based_issues.join("\n"));
      } else {
        setReview(data.message || "Something went wrong.");
      }
    } catch (error) {
      setReview("Error connecting to backend. Make sure FastAPI is running.");
    }

    setLoading(false);
  };

  const loadSampleCode = () => {
    setCode(samples[language]);
    setReview("");
  };

  const clearAll = () => {
    setLanguage("Python");
    setCode("");
    setReview("");
    setFileName("");
    setHistory([]);
    setSearchTerm("");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (e) => {
      setCode(e.target.result);
      setReview("");
    };

    reader.readAsText(file);
  };

  const loadHistory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/history");
      const data = await response.json();
      setHistory(data.history);
    } catch (error) {
      setReview("Unable to load history. Make sure backend is running.");
    }
  };

  const deleteHistory = async (id) => {
    await fetch(`http://127.0.0.1:8000/history/${id}`, {
      method: "DELETE",
    });

    loadHistory();
  };

  const clearHistory = async () => {
    await fetch("http://127.0.0.1:8000/history", {
      method: "DELETE",
    });

    setHistory([]);
  };

  const copyText = async (text) => {
    await navigator.clipboard.writeText(text);
    alert("Copied successfully!");
  };

  const exportPDF = () => {
    const pdf = new jsPDF();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("CodeSage AI - Code Review Report", 10, 15);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(`Language: ${language}`, 10, 30);

    pdf.setFont("helvetica", "bold");
    pdf.text("Submitted Code:", 10, 45);

    pdf.setFont("courier", "normal");
    pdf.setFontSize(10);
    const codeLines = pdf.splitTextToSize(code || "No code provided", 180);
    pdf.text(codeLines, 10, 55);

    let yPosition = 65 + codeLines.length * 5;

    if (yPosition > 260) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("AI Review:", 10, yPosition);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    const reviewLines = pdf.splitTextToSize(
      review || "No review available",
      180
    );

    let y = yPosition + 10;

    reviewLines.forEach((line) => {
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }

      pdf.text(line, 10, y);
      y += 6;
    });

    pdf.save("Codaris-ai-review.pdf");
  };

  const filteredHistory = history.filter((item) => {
    const search = searchTerm.toLowerCase();

    return (
      item.language.toLowerCase().includes(search) ||
      item.code.toLowerCase().includes(search) ||
      item.ai_review.toLowerCase().includes(search)
    );
  });

  return (
    <div className="container">
      <h1>Codaris AI</h1>
      <p className="subtitle">Ancient Wisdom for Modern Code</p>

      <div className="dashboard">
        <div className="stat-card">
          <h3>{totalReviews}</h3>
          <p>Total Reviews</p>
        </div>

        <div className="stat-card">
          <h3>{pythonReviews}</h3>
          <p>Python Reviews</p>
        </div>

        <div className="stat-card">
          <h3>{javaReviews}</h3>
          <p>Java Reviews</p>
        </div>

        <div className="stat-card">
          <h3>{latestReviewDate}</h3>
          <p>Latest Review</p>
        </div>
      </div>

      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option>Python</option>
        <option>Java</option>
        <option>JavaScript</option>
        <option>C</option>
        <option>C++</option>
      </select>

      <label className="file-upload">
        Upload Code File
        <input
          type="file"
          accept=".py,.java,.js,.c,.cpp,.txt"
          onChange={handleFileUpload}
        />
      </label>

      {fileName && <p className="file-name">Selected file: {fileName}</p>}

      <textarea
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <div className="button-group">
        <button onClick={reviewCode} disabled={loading}>
          {loading ? "Reviewing..." : "Review Code"}
        </button>

        <button className="secondary-btn" onClick={loadSampleCode}>
          Load Sample Code
        </button>

        <button className="secondary-btn" onClick={loadHistory}>
          View History
        </button>

        <button className="danger-btn" onClick={clearAll}>
          Clear
        </button>
      </div>

      {review && (
        <div className="result">
          <div className="result-header">
            <h2>Review Result</h2>

            <div>
              <button className="copy-btn" onClick={() => copyText(review)}>
                Copy Review
              </button>

              <button className="copy-btn" onClick={exportPDF}>
                Export PDF
              </button>
            </div>
          </div>

          <pre>{review}</pre>
        </div>
      )}

      {history.length > 0 && (
        <div className="history">
          <div className="history-header">
            <h2>Review History</h2>

            <button className="clear-history-btn" onClick={clearHistory}>
              🗑 Clear All History
            </button>
          </div>

          <input
            className="search"
            placeholder="Search by language, code, or review..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {filteredHistory.map((item) => (
            <div key={item.id} className="history-card">
              <p>
                <b>Language:</b> {item.language}
              </p>

              <p>
                <b>Date:</b> {item.created_at}
              </p>

              <h3>Code</h3>
              <pre>{item.code}</pre>

              <button className="copy-btn" onClick={() => copyText(item.code)}>
                Copy Code
              </button>

              <h3>AI Review</h3>
              <pre>{item.ai_review}</pre>

              <button
                className="copy-btn"
                onClick={() => copyText(item.ai_review)}
              >
                Copy Review
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteHistory(item.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;