"""Produce-grading inference logic (SDD AI algorithm design).

The real implementation loads a PyTorch CNN and runs it on the crate image.
For the scaffold we provide a deterministic stub plus the confidence-thresholding
and fallback-routing rules so the pipeline and the API contract are testable now.
"""
from __future__ import annotations

from dataclasses import dataclass

CONFIDENCE_THRESHOLD = 0.75
GRADES = ["A", "B", "C", "REJECT"]


@dataclass
class GradingResult:
    grade: str
    confidence: float
    route: str  # "READY" (auto) or "REVIEW" (manual, US003a)


def route_for(confidence: float, threshold: float = CONFIDENCE_THRESHOLD) -> str:
    """Low-confidence predictions go to the manual review queue (US003a)."""
    return "READY" if confidence >= threshold else "REVIEW"


def grade_image(image_bytes: bytes) -> GradingResult:
    """Stub inference. Replace the body with a real CNN forward pass.

    TODO(BIOL-24): load model, preprocess image, run forward pass, softmax.
    """
    # Deterministic stub derived from input size so tests are stable.
    seed = (len(image_bytes) % 100) / 100.0
    confidence = round(0.60 + seed * 0.39, 3)  # 0.60..0.99
    grade = GRADES[len(image_bytes) % len(GRADES)]
    return GradingResult(grade=grade, confidence=confidence, route=route_for(confidence))
