from app.grading import grade_image, route_for, CONFIDENCE_THRESHOLD


def test_route_for_threshold():
    assert route_for(0.80) == "READY"
    assert route_for(0.74) == "REVIEW"
    assert route_for(CONFIDENCE_THRESHOLD) == "READY"


def test_grade_image_is_deterministic_and_bounded():
    r1 = grade_image(b"x" * 50)
    r2 = grade_image(b"x" * 50)
    assert r1 == r2
    assert 0.0 <= r1.confidence <= 1.0
    assert r1.route in ("READY", "REVIEW")
