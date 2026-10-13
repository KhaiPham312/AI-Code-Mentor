from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.exercise import Exercise, TestCase
from app.models.user import User
from app.schemas.exercise import (
    ExerciseListItem,
    ExerciseDetail,
    ExerciseCreate,
    TestCaseResponse,
)
from app.api.deps import get_current_teacher_or_admin

router = APIRouter()


@router.get("", response_model=List[ExerciseListItem])
def list_exercises(
    difficulty: Optional[str] = Query(None, description="Lọc theo độ khó: easy, medium, hard"),
    category: Optional[str] = Query(None, description="Lọc theo chủ đề"),
    language: Optional[str] = Query(None, description="Lọc theo ngôn ngữ: python, cpp, java"),
    db: Session = Depends(get_db),
):
    query = db.query(Exercise).filter(Exercise.is_published == True)
    if difficulty:
        query = query.filter(Exercise.difficulty == difficulty)
    if category:
        query = query.filter(Exercise.category == category)
    if language:
        query = query.filter(Exercise.language == language)

    exercises = query.order_by(Exercise.id.asc()).all()

    items = []
    for ex in exercises:
        sample_count = sum(1 for tc in ex.test_cases if not tc.is_hidden)
        hidden_count = sum(1 for tc in ex.test_cases if tc.is_hidden)
        items.append(
            ExerciseListItem(
                id=ex.id,
                subject_id=ex.subject_id,
                title=ex.title,
                difficulty=ex.difficulty,
                category=ex.category,
                language=ex.language,
                sample_test_cases_count=sample_count,
                hidden_test_cases_count=hidden_count,
                created_at=ex.created_at,
            )
        )
    return items


@router.get("/{exercise_id}", response_model=ExerciseDetail)
def get_exercise_detail(exercise_id: int, db: Session = Depends(get_db)):
    exercise = db.query(Exercise).filter(
        Exercise.id == exercise_id, Exercise.is_published == True
    ).first()
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy bài tập"
        )

    # CRITICAL: Only return sample (non-hidden) test cases to clients!
    sample_tests = [
        TestCaseResponse(
            id=tc.id,
            input_data=tc.input_data,
            expected_output=tc.expected_output,
            explanation=tc.explanation,
            is_hidden=tc.is_hidden,
        )
        for tc in exercise.test_cases
        if not tc.is_hidden
    ]
    hidden_count = sum(1 for tc in exercise.test_cases if tc.is_hidden)

    return ExerciseDetail(
        id=exercise.id,
        subject_id=exercise.subject_id,
        title=exercise.title,
        difficulty=exercise.difficulty,
        category=exercise.category,
        language=exercise.language,
        time_limit_ms=exercise.time_limit_ms,
        memory_limit_mb=exercise.memory_limit_mb,
        description=exercise.description,
        input_format=exercise.input_format,
        output_format=exercise.output_format,
        constraints=exercise.constraints,
        boilerplate_code=exercise.boilerplate_code,
        is_published=exercise.is_published,
        sample_test_cases=sample_tests,
        hidden_test_cases_count=hidden_count,
        status="not_started",
        created_at=exercise.created_at,
        updated_at=exercise.updated_at,
    )


@router.post("", response_model=ExerciseDetail, status_code=status.HTTP_201_CREATED)
def create_exercise(
    exercise_in: ExerciseCreate,
    db: Session = Depends(get_db),
    current_teacher: User = Depends(get_current_teacher_or_admin),
):
    db_exercise = Exercise(
        subject_id=exercise_in.subject_id,
        title=exercise_in.title,
        difficulty=exercise_in.difficulty,
        category=exercise_in.category,
        language=exercise_in.language,
        time_limit_ms=exercise_in.time_limit_ms,
        memory_limit_mb=exercise_in.memory_limit_mb,
        description=exercise_in.description,
        input_format=exercise_in.input_format,
        output_format=exercise_in.output_format,
        constraints=exercise_in.constraints,
        boilerplate_code=exercise_in.boilerplate_code,
        is_published=True,
    )
    db.add(db_exercise)
    db.commit()
    db.refresh(db_exercise)

    if exercise_in.test_cases:
        for idx, tc in enumerate(exercise_in.test_cases):
            db_tc = TestCase(
                exercise_id=db_exercise.id,
                input_data=tc.input_data,
                expected_output=tc.expected_output,
                explanation=tc.explanation,
                is_hidden=tc.is_hidden,
                order_index=tc.order_index or idx,
            )
            db.add(db_tc)
        db.commit()
        db.refresh(db_exercise)

    return get_exercise_detail(db_exercise.id, db)
