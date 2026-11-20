import os
from typing import Optional

EXTENSION_SCORES: dict[str, float] = {
    # Plain text: 0.10
    ".txt": 0.10, ".md": 0.10, ".csv": 0.10, ".log": 0.10,
    # Media files: 0.25
    ".jpg": 0.25, ".jpeg": 0.25, ".png": 0.25, ".gif": 0.25, ".mp3": 0.25, ".mp4": 0.25,
    # Documents: 0.45
    ".pdf": 0.45, ".doc": 0.45, ".docx": 0.45, ".xls": 0.45, ".xlsx": 0.45, ".ppt": 0.45,
    # Credentials & Archives: 0.85
    ".key": 0.85, ".pem": 0.85, ".p12": 0.85, ".pfx": 0.85, ".gpg": 0.85,
    ".env": 0.85, ".exe": 0.85, ".bin": 0.85, ".dll": 0.85, ".zip": 0.85,
    ".7z": 0.85, ".tar": 0.85
}

# Tiered keyword dictionaries for content sensitivity analysis
HIGH_SENSITIVITY_KEYWORDS = [
    "password", "secret", "confidential", "key", "classified", "urgent", "private",
    "token", "credential", "seed phrase", "passphrase", "api_key", "apikey",
    "top secret", "private key"
]

MEDIUM_SENSITIVITY_KEYWORDS = [
    "financial", "invoice", "payroll", "salary", "contract", "nda", "patent",
    "proprietary", "internal", "audit", "ssn", "vulnerability", "tax", "banking",
    "restricted", "compliance", "intellectual property"
]

LOW_SENSITIVITY_KEYWORDS = [
    "hello", "meeting", "update", "status", "schedule", "lunch", "notes",
    "agenda", "sync", "review", "draft", "coffee", "thanks", "public"
]

def get_sensitivity_score(filename: Optional[str], content: Optional[str] = None, high_security: bool = False) -> float:
    """
    Calculates the sensitivity score S in [0.0, 1.0] for the Threat Analyzer.
    Evaluates:
      1. File extension risk level
      2. Multi-tiered keyword sensitivity matching (High, Medium, Low)
      3. High security override flag
    """
    score = 0.10
    
    # 1. File extension check
    if filename:
        ext = os.path.splitext(filename)[1].lower()
        score = max(score, EXTENSION_SCORES.get(ext, 0.25))

    # 2. Content keyword check with tiered sensitivity
    if content:
        content_lower = content.lower()
        if any(keyword in content_lower for keyword in HIGH_SENSITIVITY_KEYWORDS):
            score = max(score, 0.85)
        elif any(keyword in content_lower for keyword in MEDIUM_SENSITIVITY_KEYWORDS):
            score = max(score, 0.50)
        elif any(keyword in content_lower for keyword in LOW_SENSITIVITY_KEYWORDS):
            score = max(score, 0.15)

    # 3. High security mode: user explicitly requested Critical QKD protection (S >= S_crit)
    if high_security:
        score = max(score, 0.95)

    return min(1.0, score)
