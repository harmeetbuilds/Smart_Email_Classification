import joblib
from pathlib import Path

from .preprocessing import preprocess_text


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"


tfidf = joblib.load(MODEL_DIR / "intent_tfidf.joblib")
svm_model = joblib.load(MODEL_DIR / "intent_svm.joblib")


def classify_intent(email_text):
    """
    Classify an email into one of the supported intent categories.
    """

    cleaned_text = preprocess_text(email_text)

    vector = tfidf.transform([cleaned_text])

    prediction = svm_model.predict(vector)[0]

    scores = svm_model.decision_function(vector)[0]

    classes = svm_model.classes_

    score_map = dict(zip(classes, scores))

    return {
        "intent": prediction,
        "scores": score_map
    }