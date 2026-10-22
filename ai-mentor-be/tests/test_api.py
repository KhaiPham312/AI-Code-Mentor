import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Welcome to AI Code Mentor API" in data["message"]
    assert data["docs"] == "/docs"


def test_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "ok"


def test_auth_login_and_me():
    # 1. Invalid login
    res_fail = client.post(
        "/api/v1/auth/login",
        json={"username_or_email": "student", "password": "wrongpassword"}
    )
    assert res_fail.status_code == 401

    # 2. Valid login
    res_ok = client.post(
        "/api/v1/auth/login",
        json={"username_or_email": "student", "password": "123456"}
    )
    assert res_ok.status_code == 200
    token_data = res_ok.json()
    assert "access_token" in token_data
    token = token_data["access_token"]
    assert token_data["user"]["username"] == "student"

    # 3. Get profile
    res_me = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res_me.status_code == 200
    me = res_me.json()
    assert me["email"] == "student@hnue.edu.vn"
    assert me["student_id"] == "725105001"


def test_exercises_list_and_detail_security():
    # 1. List exercises
    res = client.get("/api/v1/exercises")
    assert res.status_code == 200
    exercises = res.json()
    assert len(exercises) >= 2

    # 2. Detail exercise 1
    res_detail = client.get("/api/v1/exercises/1")
    assert res_detail.status_code == 200
    detail = res_detail.json()
    assert detail["id"] == 1
    assert detail["title"] == "Bài 01: Tìm số nguyên tố trong mảng"
    assert len(detail["sample_test_cases"]) == 2
    assert detail["hidden_test_cases_count"] == 2

    # Check security: NO hidden test cases in sample_test_cases
    for tc in detail["sample_test_cases"]:
        assert tc["is_hidden"] is False


def test_run_and_submit_code():
    # Login student
    login_res = client.post(
        "/api/v1/auth/login",
        json={"username_or_email": "student", "password": "123456"}
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Exercise 1 correct solution
    valid_solution = """import json
import sys

def is_prime(n: int) -> bool:
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

def find_primes(arr: list[int]) -> list[int]:
    return [x for x in arr if is_prime(x)]

if __name__ == '__main__':
    data = sys.stdin.read().strip()
    if data:
        arr = json.loads(data)
        print(json.dumps(find_primes(arr)))
"""

    # 1. Run sample test cases
    run_res = client.post(
        "/api/v1/submissions/run",
        json={
            "exercise_id": 1,
            "source_code": valid_solution,
            "language": "python"
        },
        headers=headers
    )
    assert run_res.status_code == 200
    run_data = run_res.json()
    assert run_data["status"] == "passed"
    assert run_data["passed_tests"] == 2
    assert run_data["total_tests"] == 2

    # 2. Submit solution
    sub_res = client.post(
        "/api/v1/submissions",
        json={
            "exercise_id": 1,
            "source_code": valid_solution,
            "language": "python"
        },
        headers=headers
    )
    assert sub_res.status_code == 201
    sub_data = sub_res.json()
    assert sub_data["status"] == "passed"
    assert sub_data["passed_tests"] == 4  # All 4 tests (2 sample + 2 hidden)
    assert sub_data["total_tests"] == 4

    # 3. Check history
    hist_res = client.get("/api/v1/submissions/history?exercise_id=1", headers=headers)
    assert hist_res.status_code == 200
    history = hist_res.json()
    assert len(history) >= 1
    assert history[0]["status"] == "passed"


def test_ai_mentor_chat():
    login_res = client.post(
        "/api/v1/auth/login",
        json={"username_or_email": "student", "password": "123456"}
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Ask AI Mentor about error
    chat_res = client.post(
        "/api/v1/ai/chat",
        json={
            "exercise_id": 1,
            "content": "Tại sao code của tôi bị IndexError?",
            "intent": "explain_error",
            "terminal_error": "IndexError: list index out of range"
        },
        headers=headers
    )
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    assert chat_data["role"] == "assistant"
    assert len(chat_data["content"]) > 10
    assert "IndexError" in chat_data["content"] or "lỗi" in chat_data["content"].lower()
