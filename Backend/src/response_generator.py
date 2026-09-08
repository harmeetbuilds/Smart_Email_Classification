import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai


# Load .env from the Backend folder
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


# Get Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in Backend/.env")


# Create Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)


def generate_response(email_text, intent):
    """
    Generate a professional email response using Gemini.
    """

    if not isinstance(email_text, str):
        raise TypeError("email_text must be a string.")

    if not email_text.strip():
        raise ValueError("email_text cannot be empty.")

    prompt = f"""
You are an AI email response assistant.

Generate a professional, clear, and concise reply to the email below.

The detected email intent is:
{intent}

Rules:
- Write only the email reply.
- Be polite and professional.
- Keep the response concise.
- Do not invent information.
- Do not mention spam detection or machine learning.
- Do not add unnecessary explanations.
- Do not use placeholders unless absolutely necessary.

Email:
{email_text}
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt
    )

    return response.text.strip()