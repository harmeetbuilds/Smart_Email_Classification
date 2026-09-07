import re


HIGH_PRIORITY_KEYWORDS = [
    "urgent",
    "urgently",
    "asap",
    "immediately",
    "emergency",
    "critical",
    "important",
    "action required",
    "action needed",
    "deadline",
    "today",
    "right away",
    "as soon as possible",
    "immediate attention",
    "time sensitive",
    "time-sensitive"
]


MEDIUM_PRIORITY_KEYWORDS = [
    "please respond",
    "please reply",
    "please review",
    "follow up",
    "follow-up",
    "reminder",
    "request",
    "when possible",
    "at your earliest convenience",
    "need your response"
]


LOW_PRIORITY_KEYWORDS = [
    "newsletter",
    "weekly update",
    "monthly update",
    "promotion",
    "discount",
    "offer",
    "unsubscribe",
    "just wanted to share",
    "for your information"
]


def find_matches(email_text, keywords):
    """
    Find priority-related keywords present in the email.
    """

    email_lower = email_text.lower()
    matches = []

    for keyword in keywords:
        pattern = r"\b" + re.escape(keyword.lower()) + r"\b"

        if re.search(pattern, email_lower):
            matches.append(keyword)

    return matches


def detect_priority(email_text, intent=None):
    """
    Detect whether an email has high, medium, or low priority.
    """

    if not isinstance(email_text, str):
        raise TypeError("email_text must be a string.")

    if not email_text.strip():
        raise ValueError("email_text cannot be empty.")

    high_matches = find_matches(
        email_text,
        HIGH_PRIORITY_KEYWORDS
    )

    medium_matches = find_matches(
        email_text,
        MEDIUM_PRIORITY_KEYWORDS
    )

    low_matches = find_matches(
        email_text,
        LOW_PRIORITY_KEYWORDS
    )

    # High priority takes precedence
    if high_matches:
        return {
            "level": "high",
            "score": 3,
            "reason": "The email contains language indicating urgency or immediate attention.",
            "evidence": high_matches[:5]
        }

    # Certain intents are naturally more likely to require attention
    if intent == "customer_support" and medium_matches:
        return {
            "level": "medium",
            "score": 2,
            "reason": "The email appears to require a response or assistance.",
            "evidence": medium_matches[:5]
        }

    if medium_matches:
        return {
            "level": "medium",
            "score": 2,
            "reason": "The email contains language suggesting that a response or action is needed.",
            "evidence": medium_matches[:5]
        }

    if low_matches:
        return {
            "level": "low",
            "score": 1,
            "reason": "The email appears informational or promotional and does not indicate urgency.",
            "evidence": low_matches[:5]
        }

    # Default priority
    return {
        "level": "medium",
        "score": 2,
        "reason": "No strong urgency indicators were detected, so the email is assigned a normal priority.",
        "evidence": []
    }