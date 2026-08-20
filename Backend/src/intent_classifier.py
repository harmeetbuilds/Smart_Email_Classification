import joblib
from pathlib import Path

from .preprocessing import preprocess_text


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"

# V3 complete pipeline
MODEL_PATH = MODEL_DIR / "intent_svm_v3_pipeline.joblib"


if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"V3 intent model not found at: {MODEL_PATH}\n"
        "Run the V3 Jupyter notebook and execute the model-saving cell first."
    )


# Load the complete V3 pipeline
# TF-IDF + Linear SVM
intent_model = joblib.load(MODEL_PATH)


def classify_intent(email_text):
    """
    Classify an email into one of the V3 intent categories.
    """

    if not isinstance(email_text, str):
        raise TypeError("email_text must be a string.")

    if not email_text.strip():
        raise ValueError("email_text cannot be empty.")

    # Same preprocessing used during training
    cleaned_text = preprocess_text(email_text)

    # V3 pipeline performs TF-IDF automatically
    prediction = intent_model.predict([cleaned_text])[0]

    # LinearSVC decision scores
    scores = intent_model.decision_function([cleaned_text])[0]

    classes = intent_model.classes_

    score_map = {
        str(label): float(score)
        for label, score in zip(classes, scores)
    }

    return {
        "intent": str(prediction),
        "decision_score": float(max(scores)),
        "scores": score_map
    }