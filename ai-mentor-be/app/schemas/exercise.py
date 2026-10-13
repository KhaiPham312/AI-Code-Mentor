from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class TestCaseBase(BaseModel):
    input_data: str
    expected_output: str
    explanation: Optional[str] = None
    is_hidden: bool = False
    order_index: int = 0


class TestCaseCreate(TestCaseBase):
    pass


class TestCaseResponse(BaseModel):
    id: int
    input: str = Field(alias="input_data")
    expected_output: str
    explanation: Optional[str] = None
    is_hidden: bool

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ExerciseBase(BaseModel):
    title: str
    difficulty: str = "easy"
    category: str = "Mảng & Cơ bản"
    language: str = "python"
    time_limit_ms: int = 1000
    memory_limit_mb: int = 128
    description: str
    input_format: Optional[str] = None
    output_format: Optional[str] = None
    constraints: Optional[str] = None
    boilerplate_code: Optional[str] = None


class ExerciseCreate(ExerciseBase):
    subject_id: Optional[int] = None
    test_cases: Optional[List[TestCaseCreate]] = None


class ExerciseListItem(BaseModel):
    id: int
    subject_id: Optional[int] = None
    title: str
    difficulty: str
    category: str
    language: str
    status: Optional[str] = "not_started"  # 'solved', 'in_progress', 'not_started'
    sample_test_cases_count: int = 0
    hidden_test_cases_count: int = 0
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ExerciseDetail(ExerciseBase):
    id: int
    subject_id: Optional[int] = None
    is_published: bool
    sample_test_cases: List[TestCaseResponse] = []
    hidden_test_cases_count: int = 0
    status: Optional[str] = "not_started"
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
