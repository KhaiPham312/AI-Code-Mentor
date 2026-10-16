import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.exercise import Exercise, TestCase
from app.models.submission import Submission
from app.models.user import User
from app.schemas.submission import (
    CodeRunRequest,
    CodeRunResponse,
    SubmissionCreate,
    SubmissionResponse,
    SubmissionDetail,
)
from app.services.runner import CodeRunner
from app.api.deps import get_current_active_user

router = APIRouter()


@router.post("/run", response_model=CodeRunResponse)
def run_sample_code(
    run_req: CodeRunRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    exercise = db.query(Exercise).filter(Exercise.id == run_req.exercise_id).first()
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bài tập không tồn tại"
        )

    # If user provided a custom input, create a dynamic sample test case
    if run_req.custom_input is not None and run_req.custom_input.strip() != "":
        exec_lang = run_req.language or exercise.language or "python"
        out, err, time_ms, ok = CodeRunner.execute(
            code=run_req.source_code,
            input_data=run_req.custom_input,
            language=exec_lang,
            timeout_seconds=exercise.time_limit_ms / 1000.0
        )
        return CodeRunResponse(
            status="passed" if ok else "error",
            stdout=out,
            error_message=err if not ok else None,
            execution_time_ms=time_ms,
            passed_tests=1 if ok else 0,
            total_tests=1,
            results=[{
                "test_case_id": 0,
                "input": run_req.custom_input,
                "expected_output": "[Tùy biến]",
                "actual_output": out,
                "passed": ok,
                "execution_time_ms": time_ms,
                "error_message": err if not ok else None,
            }]
        )

    # Otherwise run on all sample test cases (non-hidden)
    sample_test_cases = [tc for tc in exercise.test_cases if not tc.is_hidden]
    if not sample_test_cases:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bài tập chưa có test case mẫu để chạy thử"
        )

    run_summary = CodeRunner.run_tests(
        code=run_req.source_code,
        test_cases=sample_test_cases,
        language=run_req.language,
        timeout_ms=exercise.time_limit_ms,
        is_sample_only=True
    )

    return CodeRunResponse(
        status=run_summary["status"],
        stdout=None,
        error_message=None,
        execution_time_ms=run_summary["execution_time_ms"],
        passed_tests=run_summary["passed_tests"],
        total_tests=run_summary["total_tests"],
        results=run_summary["results"]
    )


@router.post("", response_model=SubmissionDetail, status_code=status.HTTP_201_CREATED)
def submit_code(
    sub_in: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    exercise = db.query(Exercise).filter(Exercise.id == sub_in.exercise_id).first()
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bài tập không tồn tại"
        )

    all_test_cases = exercise.test_cases
    if not all_test_cases:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bài tập chưa có test cases để chấm điểm"
        )

    # Run on ALL test cases (sample + hidden)
    run_summary = CodeRunner.run_tests(
        code=sub_in.source_code,
        test_cases=all_test_cases,
        language=sub_in.language,
        timeout_ms=exercise.time_limit_ms,
        is_sample_only=False
    )

    db_submission = Submission(
        user_id=current_user.id,
        exercise_id=exercise.id,
        source_code=sub_in.source_code,
        language=sub_in.language,
        status=run_summary["status"],
        passed_tests=run_summary["passed_tests"],
        total_tests=run_summary["total_tests"],
        execution_time_ms=run_summary["execution_time_ms"],
        results_detail=json.dumps(run_summary["results"]),
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)

    return db_submission


@router.get("/history", response_model=List[SubmissionResponse])
def get_submission_history(
    exercise_id: Optional[int] = Query(None, description="Lọc theo ID bài tập"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    query = db.query(Submission).filter(Submission.user_id == current_user.id)
    if exercise_id:
        query = query.filter(Submission.exercise_id == exercise_id)

    submissions = query.order_by(Submission.submitted_at.desc()).all()
    return submissions
