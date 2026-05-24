from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import google.generativeai as genai

from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

load_dotenv()

app = FastAPI(title="AI Code Reviewer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

DATABASE_URL = "sqlite:///./reviews.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


class ReviewHistory(Base):
    __tablename__ = "review_history"

    id = Column(Integer, primary_key=True, index=True)
    language = Column(String(50))
    code = Column(Text)
    ai_review = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


Base.metadata.create_all(bind=engine)


class CodeReviewRequest(BaseModel):
    language: str
    code: str


@app.get("/")
def home():
    return {"message": "AI Code Reviewer Backend is running"}


@app.get("/models")
def list_models():
    models = []
    for m in genai.list_models():
        if "generateContent" in m.supported_generation_methods:
            models.append(m.name)
    return {"models": models}


@app.post("/review")
def review_code(request: CodeReviewRequest):
    language = request.language.strip()
    code = request.code.strip()

    rule_based_issues = []

    if not language:
        rule_based_issues.append("Programming language is required.")

    if not code:
        rule_based_issues.append("Code cannot be empty.")

    if len(code) < 10:
        rule_based_issues.append("Code is too short for proper review.")

    if "password" in code.lower() or "api_key" in code.lower():
        rule_based_issues.append("Possible sensitive information found in code.")

    if rule_based_issues:
        return {
            "status": "failed",
            "rule_based_issues": rule_based_issues,
            "ai_review": None
        }

    prompt = f"""
You are an expert software engineer and code reviewer.

Review the following {language} code.

Code:
{code}

Give the review in this format:

1. Summary
2. Bugs or logical issues
3. Code quality improvements
4. Security issues
5. Time complexity
6. Space complexity
7. Optimized version of the code
"""

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        ai_review = response.text

        db = SessionLocal()
        history = ReviewHistory(
            language=language,
            code=code,
            ai_review=ai_review
        )
        db.add(history)
        db.commit()
        db.close()

        return {
            "status": "success",
            "language": language,
            "rule_based_issues": [],
            "ai_review": ai_review
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


@app.get("/history")
def get_history():
    db = SessionLocal()
    reviews = db.query(ReviewHistory).order_by(ReviewHistory.id.desc()).all()
    db.close()

    return {
        "history": [
            {
                "id": review.id,
                "language": review.language,
                "code": review.code,
                "ai_review": review.ai_review,
                "created_at": review.created_at
            }
            for review in reviews
        ]
    }
@app.delete("/history/{review_id}")
def delete_review(review_id: int):
    db = SessionLocal()
    review = db.query(ReviewHistory).filter(ReviewHistory.id == review_id).first()

    if not review:
        db.close()
        return {
            "status": "error",
            "message": "Review not found"
        }

    db.delete(review)
    db.commit()
    db.close()

    return {
        "status": "success",
        "message": "Review deleted successfully"
    }


@app.delete("/history")
def clear_history():
    db = SessionLocal()
    db.query(ReviewHistory).delete()
    db.commit()
    db.close()

    return {
        "status": "success",
        "message": "All history cleared successfully"
    }