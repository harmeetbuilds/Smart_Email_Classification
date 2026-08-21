"""
Smart Email Classification Pipeline

Pipeline:
    Email
      ↓
    Spam Detection
      ↓
    Intent Classification (only for legitimate emails)
      ↓
    Result

Response generation will be added after this pipeline is tested.
"""

from .spam_classifier import classify_spam
from .intent_classifier import classify_intent


def analyze_email(email_text):
    """
    Analyze an email using both the spam and intent classifiers.

    Parameters
    ----------
    email_text : str
        Raw email subject/body.

    Returns
    -------
    dict
        Combined spam + intent prediction.
    """

    if not isinstance(email_text, str):
        raise TypeError("email_text must be a string.")

    if not email_text.strip():
        raise ValueError("email_text cannot be empty.")

    # ---------------------------------------------------------
    # STEP 1: Spam classification
    # ---------------------------------------------------------

    spam_result = classify_spam(email_text)

    # ---------------------------------------------------------
    # STEP 2: If spam, stop here.
    # We don't need intent classification for spam emails.
    # ---------------------------------------------------------

    if spam_result["prediction"] == 1:

        return {
            "email": email_text,

            "spam": {
                "label": spam_result["label"],
                "prediction": spam_result["prediction"],
                "decision_score": spam_result["decision_score"]
            },

            "intent": None,

            "status": "spam"
        }

    # ---------------------------------------------------------
    # STEP 3: Intent classification
    # Only legitimate emails reach this stage.
    # ---------------------------------------------------------

    intent_result = classify_intent(email_text)

    # ---------------------------------------------------------
    # STEP 4: Combined result
    # ---------------------------------------------------------

    return {
        "email": email_text,

        "spam": {
            "label": spam_result["label"],
            "prediction": spam_result["prediction"],
            "decision_score": spam_result["decision_score"]
        },

        "intent": {
            "label": intent_result["intent"],
            "decision_score": intent_result["decision_score"],
            "scores": intent_result["scores"]
        },

        "status": "legitimate"
    }