# Bio-Link ML Inference Server

FastAPI service that grades produce images with a CNN and applies confidence
thresholding + manual-review fallback (SDD AI algorithm design).

```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload    # http://localhost:8000/health
pytest -q
```

Endpoints:
- `GET /health`
- `POST /grade` (multipart `file`) → `{ grade, confidence, route, threshold }`

`route` is `READY` when confidence ≥ 0.75, otherwise `REVIEW` (US003a). The CNN is
stubbed in `app/grading.py` — replace `grade_image()` with a real PyTorch forward
pass (BIOL-24) without changing the API contract.
