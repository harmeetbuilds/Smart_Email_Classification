import joblib
from pathlib import Path

from .preprocessing import preprocess_text


# ============================================================
# MODEL PATH
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"


# ============================================================
# LOAD V2 MODEL
# ============================================================

spam_model = joblib.load(
    MODEL_DIR / "spam_svm_v2.joblib"
)

spam_tfidf = joblib.load(
    MODEL_DIR / "spam_tfidf_v2.joblib"
)


# ============================================================
# SPAM THRESHOLD
# ============================================================

SPAM_THRESHOLD = 0.8


# ============================================================
# CLASSIFY EMAIL
# ============================================================

def classify_spam(email: str):

    # Preprocess email
    clean_text = preprocess_text(email)

    # Convert text to TF-IDF
    vector = spam_tfidf.transform([clean_text])

    # Get SVM decision score
    decision_score = float(
        spam_model.decision_function(vector)[0]
    )

    # Apply custom threshold
    prediction = (
        1
        if decision_score >= SPAM_THRESHOLD
        else 0
    )

    # Convert prediction to readable label
    if prediction == 1:
        label = "spam"
    else:
        label = "legitimate"

    return {
        "label": label,
        "prediction": prediction,
        "decision_score": decision_score
    }