"""Bio-Link ML inference server (FastAPI).

Exposes /grade for the API gateway to proxy QC produce images to (US003).
"""
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel

from .grading import grade_image, CONFIDENCE_THRESHOLD

app = FastAPI(title="Bio-Link ML Inference", version="0.1.0")


class GradeResponse(BaseModel):
    grade: str
    confidence: float
    route: str
    threshold: float


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "ml-inference"}


@app.post("/grade", response_model=GradeResponse)
async def grade(file: UploadFile = File(...)) -> GradeResponse:
    image_bytes = await file.read()
    result = grade_image(image_bytes)
    return GradeResponse(
        grade=result.grade,
        confidence=result.confidence,
        route=result.route,
        threshold=CONFIDENCE_THRESHOLD,
    )
