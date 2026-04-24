# CampusGo Backend MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable FastAPI + MySQL backend MVP for CampusGo that supports user auth, activities, signups, comments, favorites, and messages.

**Architecture:** Create a small layered backend under `backend/` with SQLAlchemy models, Pydantic schemas, thin API routers, and service modules for the business flows that create side effects such as signup state changes and message generation. Use Alembic for schema management and a lightweight bearer-token flow for authentication.

**Tech Stack:** Python 3.11+, FastAPI, SQLAlchemy 2.x, Alembic, PyMySQL, Pydantic, pytest

---

### Task 1: Scaffold backend project structure and dependency manifest

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/app/__init__.py`
- Create: `backend/app/main.py`
- Create: `backend/app/core/__init__.py`
- Create: `backend/app/db/__init__.py`
- Create: `backend/app/models/__init__.py`
- Create: `backend/app/schemas/__init__.py`
- Create: `backend/app/api/__init__.py`
- Create: `backend/app/services/__init__.py`
- Create: `backend/app/utils/__init__.py`
- Create: `backend/tests/__init__.py`
- Create: `backend/.env.example`

- [ ] **Step 1: Write the failing test**

```python
from app.main import app

def test_app_imports() -> None:
    assert app is not None
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest backend/tests -q`
Expected: FAIL with `ModuleNotFoundError` because `backend/app/main.py` and the package structure do not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create the package layout and add the dependency manifest:

```text
fastapi
uvicorn[standard]
sqlalchemy
alembic
pymysql
pydantic
pydantic-settings
passlib[bcrypt]
itsdangerous
python-multipart
pytest
httpx
```

Create `backend/app/main.py` with a minimal app:

```python
from fastapi import FastAPI

app = FastAPI(title="CampusGo API")

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest backend/tests -q`
Expected: PASS for the import smoke test.

- [ ] **Step 5: Commit**

```bash
git add backend/requirements.txt backend/app backend/tests backend/.env.example
git commit -m "feat: scaffold campusgo backend"
```

### Task 2: Add settings, database session, and base model plumbing

**Files:**
- Create: `backend/app/core/config.py`
- Create: `backend/app/db/base.py`
- Create: `backend/app/db/session.py`
- Create: `backend/app/api/deps.py`
- Create: `backend/tests/test_health.py`

- [ ] **Step 1: Write the failing test**

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest backend/tests/test_health.py -q`
Expected: FAIL because dependency imports for config/database plumbing are not implemented yet after wiring them into `main.py`.

- [ ] **Step 3: Write minimal implementation**

Create settings with `pydantic-settings`:

```python
class Settings(BaseSettings):
    app_name: str = "CampusGo API"
    mysql_host: str = "127.0.0.1"
    mysql_port: int = 3306
    mysql_user: str = "root"
    mysql_password: str = "123456"
    mysql_db: str = "campus_go"
    secret_key: str = "campusgo-secret"
    access_token_expire_minutes: int = 60 * 24
    cors_origins: str = "http://127.0.0.1:3000,http://localhost:3000"
```

Add SQLAlchemy engine/session factory and a `get_db()` dependency. Update `main.py` to use settings and CORS middleware.

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest backend/tests/test_health.py -q`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/core/config.py backend/app/db backend/app/api/deps.py backend/app/main.py backend/tests/test_health.py
git commit -m "feat: add backend settings and db plumbing"
```

### Task 3: Define ORM models for the seven core tables

**Files:**
- Create: `backend/app/models/user.py`
- Create: `backend/app/models/activity_category.py`
- Create: `backend/app/models/activity.py`
- Create: `backend/app/models/activity_signup.py`
- Create: `backend/app/models/activity_comment.py`
- Create: `backend/app/models/favorite.py`
- Create: `backend/app/models/message.py`
- Modify: `backend/app/models/__init__.py`
- Modify: `backend/app/db/base.py`
- Create: `backend/tests/test_models.py`

- [ ] **Step 1: Write the failing test**

```python
from app.models.user import User
from app.models.activity import Activity

def test_models_have_tablenames() -> None:
    assert User.__tablename__ == "users"
    assert Activity.__tablename__ == "activities"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest backend/tests/test_models.py -q`
Expected: FAIL with import errors because the model files do not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create SQLAlchemy declarative models with relationships and constraints. Required details:

- `User.phone` unique index
- `Favorite` unique constraint on `user_id` + `activity_id`
- `ActivitySignup` unique constraint on `activity_id` + `user_id`
- `Activity.parent comments` via nullable `parent_id`
- cascades from `Activity` to comments/signups/favorites

Export all models in `backend/app/models/__init__.py`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest backend/tests/test_models.py -q`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/models backend/app/db/base.py backend/tests/test_models.py
git commit -m "feat: add campusgo orm models"
```

### Task 4: Add authentication helpers and auth schemas

**Files:**
- Create: `backend/app/core/security.py`
- Create: `backend/app/schemas/common.py`
- Create: `backend/app/schemas/user.py`
- Create: `backend/app/schemas/auth.py`
- Modify: `backend/app/api/deps.py`
- Create: `backend/tests/test_security.py`

- [ ] **Step 1: Write the failing test**

```python
from app.core.security import get_password_hash, verify_password

def test_password_hash_roundtrip() -> None:
    raw = "123456"
    hashed = get_password_hash(raw)
    assert hashed != raw
    assert verify_password(raw, hashed) is True
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest backend/tests/test_security.py -q`
Expected: FAIL because `security.py` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Implement:

```python
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str: ...
def verify_password(password: str, password_hash: str) -> bool: ...
def create_access_token(user_id: int) -> str: ...
def parse_access_token(token: str) -> int: ...
```

Use `itsdangerous.URLSafeTimedSerializer` with settings secret key and expiry handling.

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest backend/tests/test_security.py -q`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/core/security.py backend/app/schemas backend/app/api/deps.py backend/tests/test_security.py
git commit -m "feat: add backend auth helpers and schemas"
```

### Task 5: Add auth routes and register/login/me flow

**Files:**
- Create: `backend/app/services/auth_service.py`
- Create: `backend/app/api/routes/auth.py`
- Modify: `backend/app/main.py`
- Create: `backend/tests/test_auth_api.py`

- [ ] **Step 1: Write the failing test**

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_login_and_me() -> None:
    register_response = client.post(
        "/api/auth/register",
        json={
            "phone": "18800002222",
            "password": "123456",
            "nickname": "测试同学"
        },
    )
    assert register_response.status_code == 200

    login_response = client.post(
        "/api/auth/login",
        json={"phone": "18800002222", "password": "123456"},
    )
    assert login_response.status_code == 200
    token = login_response.json()["data"]["access_token"]

    me_response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_response.status_code == 200
    assert me_response.json()["data"]["phone"] == "18800002222"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest backend/tests/test_auth_api.py -q`
Expected: FAIL with 404 or import errors because auth routes and service are missing.

- [ ] **Step 3: Write minimal implementation**

Implement auth service methods:

```python
def register_user(db: Session, payload: RegisterRequest) -> User: ...
def login_user(db: Session, phone: str, password: str) -> tuple[str, User]: ...
```

Implement routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

All responses use the common wrapper:

```python
def success_response(data: Any, message: str = "ok") -> dict[str, Any]:
    return {"code": 0, "message": message, "data": data}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest backend/tests/test_auth_api.py -q`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/services/auth_service.py backend/app/api/routes/auth.py backend/app/main.py backend/tests/test_auth_api.py
git commit -m "feat: add auth api flow"
```

### Task 6: Add activity schemas, service, and routes

**Files:**
- Create: `backend/app/schemas/activity.py`
- Create: `backend/app/services/activity_service.py`
- Create: `backend/app/api/routes/activities.py`
- Create: `backend/tests/test_activity_api.py`

- [ ] **Step 1: Write the failing test**

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_and_list_activity() -> None:
    login = client.post("/api/auth/login", json={"phone": "18800001111", "password": "123456"})
    token = login.json()["data"]["access_token"]
    create_response = client.post(
        "/api/activities",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "category_id": 1,
            "title": "周末自习局",
            "cover": "",
            "description": "图书馆一起复习",
            "activity_time": "2026-05-01T14:00:00",
            "location": "图书馆四楼",
            "max_participants": 6,
            "audit_required": False,
            "contact_info": "微信 test"
        },
    )
    assert create_response.status_code == 200
    list_response = client.get("/api/activities")
    assert list_response.status_code == 200
    assert list_response.json()["data"]["total"] >= 1
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest backend/tests/test_activity_api.py -q`
Expected: FAIL because activity routes and schemas are not implemented.

- [ ] **Step 3: Write minimal implementation**

Implement:

- activity create/update/delete/list/detail schemas
- query filters for `keyword`, `category_id`, `status`, `page`, `page_size`
- activity service methods for listing, detail lookup, create, update, delete
- view count increment in detail route

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest backend/tests/test_activity_api.py -q`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/schemas/activity.py backend/app/services/activity_service.py backend/app/api/routes/activities.py backend/tests/test_activity_api.py
git commit -m "feat: add activity api"
```

### Task 7: Add signup flow with message side effects

**Files:**
- Create: `backend/app/schemas/signup.py`
- Create: `backend/app/services/signup_service.py`
- Create: `backend/app/api/routes/signups.py`
- Create: `backend/tests/test_signup_api.py`

- [ ] **Step 1: Write the failing test**

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_signup_pending_and_message_created() -> None:
    owner_login = client.post("/api/auth/login", json={"phone": "18800001111", "password": "123456"})
    owner_token = owner_login.json()["data"]["access_token"]

    client.post(
        "/api/auth/register",
        json={"phone": "18800003333", "password": "123456", "nickname": "报名同学"},
    )
    user_login = client.post("/api/auth/login", json={"phone": "18800003333", "password": "123456"})
    user_token = user_login.json()["data"]["access_token"]

    activity = client.post(
        "/api/activities",
        headers={"Authorization": f"Bearer {owner_token}"},
        json={
            "category_id": 1,
            "title": "需审核活动",
            "cover": "",
            "description": "需要审核的报名活动",
            "activity_time": "2026-05-02T10:00:00",
            "location": "操场",
            "max_participants": 5,
            "audit_required": True,
            "contact_info": "微信 owner"
        },
    ).json()["data"]

    signup = client.post(
        f"/api/activities/{activity['id']}/signup",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert signup.status_code == 200
    assert signup.json()["data"]["status"] == "pending"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest backend/tests/test_signup_api.py -q`
Expected: FAIL because signup routes and business logic are missing.

- [ ] **Step 3: Write minimal implementation**

Implement:

- signup create/list/approve/reject/cancel schemas
- signup service with capacity checks, creator checks, status transitions, and message creation
- approval increments `current_participants`
- cancel decrements when necessary

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest backend/tests/test_signup_api.py -q`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/schemas/signup.py backend/app/services/signup_service.py backend/app/api/routes/signups.py backend/tests/test_signup_api.py
git commit -m "feat: add signup workflow api"
```

### Task 8: Add comments, favorites, and messages routes

**Files:**
- Create: `backend/app/schemas/comment.py`
- Create: `backend/app/schemas/favorite.py`
- Create: `backend/app/schemas/message.py`
- Create: `backend/app/services/comment_service.py`
- Create: `backend/app/services/favorite_service.py`
- Create: `backend/app/services/message_service.py`
- Create: `backend/app/api/routes/comments.py`
- Create: `backend/app/api/routes/favorites.py`
- Create: `backend/app/api/routes/messages.py`
- Create: `backend/tests/test_interactions_api.py`

- [ ] **Step 1: Write the failing test**

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_comment_reply_favorite_and_read_message() -> None:
    response = client.get("/api/messages")
    assert response.status_code != 200
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest backend/tests/test_interactions_api.py -q`
Expected: FAIL because the routes do not exist yet or do not behave correctly.

- [ ] **Step 3: Write minimal implementation**

Implement:

- comment list/create/delete
- favorite create/delete
- message list/read/read-all
- reply comment creates a message for the parent comment author

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest backend/tests/test_interactions_api.py -q`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/schemas/comment.py backend/app/schemas/favorite.py backend/app/schemas/message.py backend/app/services/comment_service.py backend/app/services/favorite_service.py backend/app/services/message_service.py backend/app/api/routes/comments.py backend/app/api/routes/favorites.py backend/app/api/routes/messages.py backend/tests/test_interactions_api.py
git commit -m "feat: add interaction apis"
```

### Task 9: Add Alembic setup and seed script

**Files:**
- Create: `backend/alembic.ini`
- Create: `backend/alembic/env.py`
- Create: `backend/alembic/script.py.mako`
- Create: `backend/alembic/versions/20260424_000001_init_tables.py`
- Create: `backend/app/utils/seed.py`
- Modify: `backend/.env.example`

- [ ] **Step 1: Write the failing test**

```python
from pathlib import Path

def test_alembic_files_exist() -> None:
    assert Path("backend/alembic.ini").exists()
    assert Path("backend/alembic/versions/20260424_000001_init_tables.py").exists()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest backend/tests/test_migrations.py -q`
Expected: FAIL because Alembic files are missing.

- [ ] **Step 3: Write minimal implementation**

Add Alembic configuration wired to the SQLAlchemy metadata and create the initial migration that builds the seven tables. Add a seed script that inserts categories and the demo user:

```python
def seed_initial_data(session: Session) -> None:
    ...
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest backend/tests/test_migrations.py -q`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/alembic backend/alembic.ini backend/app/utils/seed.py backend/.env.example
git commit -m "feat: add migrations and seed script"
```

### Task 10: Final verification

**Files:**
- Modify if needed: `backend/app/main.py`
- Modify if needed: `backend/requirements.txt`

- [ ] **Step 1: Run the backend test suite**

Run: `pytest backend/tests -q`
Expected: PASS

- [ ] **Step 2: Verify imports and startup**

Run: `python -c "from app.main import app; print(app.title)"`
Workdir: `backend`
Expected: output `CampusGo API`

- [ ] **Step 3: Verify migration command wiring**

Run: `alembic upgrade head`
Workdir: `backend`
Expected: migrations apply successfully against the configured database

- [ ] **Step 4: Verify local API startup**

Run: `uvicorn app.main:app --reload`
Workdir: `backend`
Expected: app starts without import errors and exposes `/health`

- [ ] **Step 5: Commit**

```bash
git add backend
git commit -m "feat: finish campusgo backend mvp"
```
