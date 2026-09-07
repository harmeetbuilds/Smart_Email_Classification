from .spam_classifier import classify_spam
from .intent_classifier import classify_intent
from .intent_explainer import explain_intent
from .priority_detector import detect_priority
from .response_generator import generate_response


def analyze_email(email_text):
    if not isinstance(email_text, str):
        raise TypeError("email_text must be a string.")

    if not email_text.strip():
        raise ValueError("email_text cannot be empty.")

    # STEP 1: Check for spam
    spam_result = classify_spam(email_text)

    # If spam, stop here
    if spam_result["prediction"] == 1:
        return {
            "email": email_text,

            "spam": {
                "label": spam_result["label"],
                "prediction": spam_result["prediction"],
                "decision_score": spam_result["decision_score"]
            },

            "intent": None,
            "priority": None,
            "response": None,
            "status": "spam"
        }

    # STEP 2: Classify intent
    intent_result = classify_intent(email_text)

    # STEP 3: Explain the detected intent
    intent_explanation = explain_intent(
        email_text,
        intent_result["intent"]
    )

    # STEP 4: Detect email priority
    priority_result = detect_priority(
        email_text,
        intent_result["intent"]
    )

    # STEP 5: Generate AI response
    ai_response = generate_response(
        email_text,
        intent_result["intent"]
    )

    # STEP 6: Return result
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
            "scores": intent_result["scores"],
            "explanation": intent_explanation
        },

        "priority": priority_result,

        "response": ai_response,
        "status": "legitimate"
    }