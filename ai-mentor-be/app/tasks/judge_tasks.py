import json
import logging
from app.core.celery_app import celery_app
from app.db.session import SessionLocal
from app.models.submission import Submission
from app.models.exercise import Exercise
from app.services.runner import CodeRunner

logger = logging.getLogger(__name__)


@celery_app.task(name="app.tasks.judge_tasks.grade_submission_task", bind=True)
def grade_submission_task(self, submission_id: int):
    """
    Background worker task to grade submitted student code asynchronously.
    Updates the Submission record in DB with final status, pass count, and test results.
    """
    db = SessionLocal()
    try:
        submission = db.query(Submission).filter(Submission.id == submission_id).first()
        if not submission:
            logger.error(f"[Judge Worker] Submission #{submission_id} not found in database.")
            return {"error": "Submission not found"}

        # Mark as running
        submission.status = "running"
        db.commit()

        exercise = db.query(Exercise).filter(Exercise.id == submission.exercise_id).first()
        if not exercise or not exercise.test_cases:
            submission.status = "error"
            submission.error_message = "Không tìm thấy bài tập hoặc bộ test case tương ứng."
            db.commit()
            return {"error": "Exercise or test cases not found"}

        # Execute tests via CodeRunner Sandbox
        all_test_cases = exercise.test_cases
        run_summary = CodeRunner.run_tests(
            code=submission.source_code,
            test_cases=all_test_cases,
            language=submission.language,
            timeout_ms=exercise.time_limit_ms,
            is_sample_only=False,
        )

        first_error = None
        if run_summary.get("results"):
            for r in run_summary["results"]:
                if r.get("error_message"):
                    first_error = r["error_message"]
                    break

        # Update final verdict
        submission.status = run_summary["status"]
        submission.passed_tests = run_summary["passed_tests"]
        submission.total_tests = run_summary["total_tests"]
        submission.execution_time_ms = run_summary["execution_time_ms"]
        submission.error_message = first_error
        submission.results_detail = json.dumps(run_summary["results"])
        db.commit()

        logger.info(
            f"[Judge Worker] Graded Submission #{submission_id}: "
            f"status={submission.status}, passed={submission.passed_tests}/{submission.total_tests}"
        )
        return {
            "submission_id": submission_id,
            "status": submission.status,
            "passed_tests": submission.passed_tests,
            "total_tests": submission.total_tests,
        }

    except Exception as exc:
        logger.exception(f"[Judge Worker] Exception while grading #{submission_id}: {exc}")
        try:
            if submission:
                submission.status = "error"
                submission.error_message = f"Lỗi thực thi worker: {str(exc)}"
                db.commit()
        except Exception:
            pass
        raise exc
    finally:
        db.close()
