import re


INTENT_EXPLANATIONS = {
    "business": {
        "summary": "The email is related to a business matter, proposal, partnership, or commercial activity.",
        "keywords": [
            "business",
            "company",
            "partnership",
            "proposal",
            "client",
            "vendor",
            "contract",
            "commercial",
            "collaboration",
            "opportunity"
        ]
    },

    "customer_support": {
        "summary": "The email is asking for help with a product, service, account, or issue.",
        "keywords": [
            "help",
            "support",
            "issue",
            "problem",
            "error",
            "assistance",
            "unable",
            "can't",
            "not working",
            "complaint"
        ]
    },

    "events": {
        "summary": "The email is about an event, invitation, registration, or event details.",
        "keywords": [
            "event",
            "invitation",
            "invite",
            "conference",
            "webinar",
            "registration",
            "ceremony",
            "workshop",
            "seminar"
        ]
    },

    "finance": {
        "summary": "The email concerns money, payments, invoices, billing, or financial matters.",
        "keywords": [
            "payment",
            "pay",
            "invoice",
            "billing",
            "refund",
            "transaction",
            "bank",
            "finance",
            "amount",
            "charge"
        ]
    },

    "job_career": {
        "summary": "The email is related to a job, recruitment, application, interview, or career opportunity.",
        "keywords": [
            "job",
            "career",
            "hiring",
            "recruitment",
            "resume",
            "cv",
            "interview",
            "position",
            "vacancy",
            "application"
        ]
    },

    "meetings": {
        "summary": "The email is requesting to arrange or schedule a meeting.",
        "keywords": [
            "meeting",
            "schedule",
            "appointment",
            "call",
            "meet",
            "time slot",
            "availability",
            "calendar"
        ]
    },

    "newsletter_updates": {
        "summary": "The email provides updates, announcements, subscriptions, or newsletter-style information.",
        "keywords": [
            "newsletter",
            "update",
            "updates",
            "announcement",
            "subscribe",
            "subscription",
            "news",
            "digest"
        ]
    },

    "personal": {
        "summary": "The email is mainly personal communication or a personal request.",
        "keywords": [
            "personal",
            "family",
            "friend",
            "birthday",
            "congratulations",
            "holiday",
            "thanks"
        ]
    },

    "promotions": {
        "summary": "The email is promotional or marketing content, such as an offer, sale, discount, or advertisement.",
        "keywords": [
            "offer",
            "discount",
            "sale",
            "deal",
            "coupon",
            "promo",
            "promotion",
            "free",
            "limited time",
            "save"
        ]
    },

    "travel": {
        "summary": "The email concerns travel plans, bookings, flights, hotels, or transportation.",
        "keywords": [
            "flight",
            "hotel",
            "booking",
            "travel",
            "trip",
            "ticket",
            "airport",
            "reservation",
            "itinerary"
        ]
    }
}


def explain_intent(email_text, intent):
    """
    Generate a simple human-readable explanation
    for the detected email intent.
    """

    if not isinstance(email_text, str):
        raise TypeError("email_text must be a string.")

    if not isinstance(intent, str):
        raise TypeError("intent must be a string.")

    email_lower = email_text.lower()

    intent_info = INTENT_EXPLANATIONS.get(intent)

    if not intent_info:
        return {
            "summary": f"The model classified this email as '{intent}'.",
            "evidence": []
        }

    matched_keywords = []

    for keyword in intent_info["keywords"]:

        # Escape keyword so special characters are handled safely
        pattern = r"\b" + re.escape(keyword.lower()) + r"\b"

        if re.search(pattern, email_lower):
            matched_keywords.append(keyword)

    return {
        "summary": intent_info["summary"],
        "evidence": matched_keywords[:5]
    }