import joblib
from pathlib import Path

from .preprocessing import preprocess_text


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"


tfidf = joblib.load(
    MODEL_DIR / "spam_tfidf.joblib"
)

svm_model = joblib.load(
    MODEL_DIR / "spam_svm.joblib"
)


def classify_spam(email_text):
    """
    Classify an email as spam or legitimate.
    """

    cleaned_text = preprocess_text(email_text)

    vector = tfidf.transform([cleaned_text])

    prediction = svm_model.predict(vector)[0]

    decision_score = svm_model.decision_function(vector)[0]

    if prediction == 1:
        label = "spam"
    else:
        label = "legitimate"

    return {
        "label": label,
        "prediction": int(prediction),
        "decision_score": float(decision_score)
    }