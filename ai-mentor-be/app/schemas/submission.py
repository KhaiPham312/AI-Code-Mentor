from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class TestCaseResult(BaseModel):
    test_case_id: int
    input: str
    expected_output: str
    actual_output: str
    passed: bool
    execution_time_ms: int
    error_message: Optional[str] = None


class CodeRunRequest(BaseModel):
    exercise_id: int
    source_code: str
    language: str = "python"
    custom_input: Optional[str] = None


class CodeRunResponse(BaseModel):
    status: str  # 'idle', 'running', 'passed', 'failed', 'error'
    stdout: Optional[str] = None
    error_message: Optional[str] = None
    execution_time_ms: int
    passed_tests: int
    total_tests: int
    results: List[TestCaseResult] = []


class SubmissionCreate(BaseModel):
    exercise_id: int
    source_code: str
    language: str = "python"


class SubmissionResponse(BaseModel):
    id: int
    exercise_id: int
    user_id: int
    language: str
    status: str  # 'pending', 'running', 'passed', 'failed', 'error'
    passed_tests: int
    total_tests: int
    execution_time_ms: int
    submitted_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SubmissionDetail(SubmissionResponse):
    source_code: str
    stdout: Optional[str] = None
    error_message: Optional[str] = None
    results_detail: Optional[str] = None
