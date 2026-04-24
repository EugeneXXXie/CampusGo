# CampusGo Backend MVP Design

## Summary

This document defines the backend MVP for CampusGo as a runnable FastAPI + MySQL service that supports the existing frontend MVP and the user-side workflows described in the technical document. The backend is intentionally scoped for a course-project delivery: it prioritizes a believable business flow, clear database structure, and working REST APIs over production-grade hardening or long-term platform concerns.

## Scope

The backend MVP includes:

- FastAPI application scaffold under `backend/`
- SQLAlchemy 2.x models backed by MySQL
- Alembic migration support
- User-side API groups:
  - `auth`
  - `activities`
  - `signups`
  - `comments`
  - `favorites`
  - `messages`
- Seed data for categories and one demo user
- Minimal token-based authentication suitable for course demonstration
- Business rules for publishing, browsing, signing up, commenting, favoriting, and reading messages

The backend MVP does not include:

- Admin APIs
- Image upload or file storage
- SMS verification or captcha login
- WebSocket push
- Role-based admin dashboard
- Redis
- Complex permission systems beyond current-user checks

## Product Goal

The first backend delivery should create a complete user-side data loop that the frontend can consume with real persistence. A student should be able to register or log in, browse activities, publish an activity, sign up for another activity, favorite an activity, comment on it, and see related messages stored in MySQL.

## Architecture

The backend will follow a small but clear layered structure:

```text
backend/
├── app/
│   ├── main.py
│   ├── core/
│   ├── db/
│   ├── models/
│   ├── schemas/
│   ├── api/
│   ├── services/
│   └── utils/
├── alembic/
├── tests/
├── requirements.txt
└── .env.example
```

### Layer Responsibilities

#### `app/main.py`

Creates the FastAPI application, registers routers, configures CORS for local frontend development, and exposes a health endpoint.

#### `app/core`

Holds runtime settings and authentication primitives:

- environment settings
- token settings
- password hashing helpers

#### `app/db`

Contains SQLAlchemy engine/session setup and declarative base registration.

#### `app/models`

Defines MySQL-backed ORM tables for:

- `User`
- `ActivityCategory`
- `Activity`
- `ActivitySignup`
- `ActivityComment`
- `Favorite`
- `Message`

#### `app/schemas`

Defines request and response DTOs with Pydantic. Schemas should be split by domain rather than as one large file.

#### `app/api`

Contains route modules grouped by business capability:

- `auth.py`
- `activities.py`
- `signups.py`
- `comments.py`
- `favorites.py`
- `messages.py`

#### `app/services`

Contains business logic that is shared across route handlers, especially:

- activity query composition
- signup status transitions
- message creation side effects
- permission checks

#### `app/utils`

Contains small helpers that do not belong to models or services, such as pagination helpers and datetime formatting if needed.

## Data Model

The backend should use the seven tables already described in the technical document, with a small set of pragmatic clarifications.

### `users`

Fields:

- `id`
- `phone`
- `password_hash`
- `nickname`
- `avatar`
- `gender`
- `college`
- `grade`
- `bio`
- `role`
- `status`
- `created_at`
- `updated_at`

Notes:

- `phone` must be unique
- `role` defaults to `user`
- `status` defaults to `1`

### `activity_categories`

Fields:

- `id`
- `name`
- `sort`
- `created_at`

Notes:

- seed initial rows matching frontend categories

### `activities`

Fields:

- `id`
- `user_id`
- `category_id`
- `title`
- `cover`
- `description`
- `activity_time`
- `location`
- `max_participants`
- `current_participants`
- `audit_required`
- `status`
- `contact_info`
- `view_count`
- `created_at`
- `updated_at`

Notes:

- `status` values: `open`, `full`, `ended`
- `current_participants` starts at `1` for the creator only if the business wants creator counted; for simpler course-project semantics, this MVP will start at `0`

### `activity_signups`

Fields:

- `id`
- `activity_id`
- `user_id`
- `status`
- `remark`
- `created_at`
- `updated_at`

Notes:

- `status` values: `pending`, `approved`, `rejected`, `cancelled`
- unique constraint on `(activity_id, user_id)` to prevent duplicate signup rows

### `activity_comments`

Fields:

- `id`
- `activity_id`
- `user_id`
- `parent_id`
- `content`
- `status`
- `created_at`
- `updated_at`

Notes:

- `parent_id` nullable for top-level comments
- `status` defaults to `1`

### `favorites`

Fields:

- `id`
- `user_id`
- `activity_id`
- `created_at`

Notes:

- unique constraint on `(user_id, activity_id)`

### `messages`

Fields:

- `id`
- `user_id`
- `type`
- `title`
- `content`
- `is_read`
- `related_id`
- `created_at`

Notes:

- `type` values: `signup`, `review`, `comment`, `system`
- `related_id` points to the most relevant business record for the message

## Authentication Design

This MVP should use simple bearer tokens with FastAPI's `HTTPBearer` dependency and a lightweight signed token implementation. JWT is optional, but not required. The goal is course-project simplicity:

- user registers with phone and password
- password is hashed before persistence
- login returns:
  - `access_token`
  - `token_type`
  - `user`
- authenticated endpoints resolve current user from bearer token

Because this is not a production system, refresh tokens, rotation, and advanced revocation are out of scope.

## API Design

### Auth

#### `POST /api/auth/register`

Behavior:

- validates unique phone
- hashes password
- creates user
- returns created user profile

#### `POST /api/auth/login`

Behavior:

- validates phone/password
- returns bearer token plus user summary

#### `GET /api/auth/me`

Behavior:

- returns current authenticated user profile

### Activities

#### `GET /api/activities`

Behavior:

- supports optional query params:
  - `keyword`
  - `category_id`
  - `status`
  - `page`
  - `page_size`
- returns paginated activity list with organizer, category, favorite flag, and current signup status for the current user when authenticated

#### `GET /api/activities/{id}`

Behavior:

- returns full activity detail
- increments `view_count`
- includes organizer info, comments, favorite flag, and current user's signup status when authenticated

#### `POST /api/activities`

Behavior:

- authenticated only
- validates category exists and time is in acceptable format
- creates activity with `status = open`

#### `PUT /api/activities/{id}`

Behavior:

- authenticated creator only
- updates editable fields
- recomputes `status` if capacity changes

#### `DELETE /api/activities/{id}`

Behavior:

- authenticated creator only
- soft complexity is unnecessary here, so this MVP may hard-delete the row and related favorites/comments/signups through cascade behavior

### Signups

#### `POST /api/activities/{id}/signup`

Behavior:

- authenticated only
- rejects creator signing up for own activity
- rejects ended or full activities
- creates signup row if absent
- if `audit_required = false`, set signup `approved` and increment `current_participants`
- if `audit_required = true`, set signup `pending`
- creates message for activity owner

#### `GET /api/activities/{id}/signups`

Behavior:

- authenticated creator only
- returns signup rows for the activity

#### `POST /api/signups/{id}/approve`

Behavior:

- authenticated creator of the related activity only
- changes signup from `pending` to `approved`
- increments `current_participants`
- updates activity status to `full` when needed
- creates review message for signup user

#### `POST /api/signups/{id}/reject`

Behavior:

- authenticated creator only
- changes signup from `pending` to `rejected`
- creates review message for signup user

#### `POST /api/signups/{id}/cancel`

Behavior:

- authenticated signup owner only
- marks signup `cancelled`
- decrements `current_participants` if previously approved
- reopens activity status to `open` when appropriate

### Comments

#### `GET /api/activities/{id}/comments`

Behavior:

- returns ordered comments for the activity

#### `POST /api/activities/{id}/comments`

Behavior:

- authenticated only
- creates top-level comment or reply
- if replying to another user's comment, creates a message for that user

#### `DELETE /api/comments/{id}`

Behavior:

- authenticated comment author only
- hard-delete is acceptable for this MVP

### Favorites

#### `POST /api/activities/{id}/favorite`

Behavior:

- authenticated only
- creates favorite row if absent

#### `DELETE /api/activities/{id}/favorite`

Behavior:

- authenticated only
- removes favorite row if present

### Messages

#### `GET /api/messages`

Behavior:

- authenticated only
- returns current user's messages ordered newest first

#### `POST /api/messages/read/{id}`

Behavior:

- authenticated only
- marks a single message as read

#### `POST /api/messages/read-all`

Behavior:

- authenticated only
- marks all of current user's messages as read

## Business Rules

### Activity Status

Rules:

- `open` when activity accepts more participants
- `full` when approved participants reach capacity
- `ended` only when the creator edits it to ended in a later iteration; this MVP does not need a separate end-activity endpoint yet

### Signup Rules

Rules:

- one user can have at most one signup row per activity
- pending signups do not count toward `current_participants`
- approved signups count toward `current_participants`
- cancelled approved signups reduce `current_participants`

### Message Rules

Messages are created for:

- someone signs up for your activity
- your signup is approved or rejected
- someone replies to your comment

System announcements are optional seed data, not generated dynamically in this MVP.

## Response Shape

Responses should stay consistent and frontend-friendly. For a course project, a thin wrapper is enough:

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

Paginated list endpoints may return:

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "items": [],
    "total": 0,
    "page": 1,
    "page_size": 10
  }
}
```

## Environment and Configuration

The backend should use environment variables for:

- MySQL host
- MySQL port
- MySQL user
- MySQL password
- MySQL database
- secret key
- token expiry minutes
- allowed CORS origins

`.env.example` should be included with practical local defaults.

## Migration and Seed Strategy

Alembic should manage schema creation from the start rather than relying on `Base.metadata.create_all()` in runtime code. The MVP should also include one simple seed script that inserts:

- activity categories
- one demo user

This keeps local setup predictable for course review and manual testing.

## Testing and Verification

This backend should be verified with focused API and service tests rather than broad framework ceremony.

Minimum verification:

- unit or integration tests for:
  - register/login
  - activity creation and listing
  - signup direct-approve flow
  - signup pending-approve flow
  - comment reply creates message
  - favorite create/remove
  - message read and read-all
- app startup works
- Alembic migration runs successfully

For local developer ergonomics, tests may use SQLite in memory or a temporary test database, even though runtime uses MySQL.

## Risks and Mitigations

### Risk: MySQL setup slows down progress

Mitigation:
Use MySQL for runtime but allow tests to run on SQLite with SQLAlchemy-compatible models.

### Risk: Overcomplicated authentication

Mitigation:
Use minimal signed bearer tokens and avoid refresh-token workflows.

### Risk: Too many side effects buried in routes

Mitigation:
Keep route handlers thin and move signup/comment/message side effects into services.

## Implementation Boundary

This spec intentionally focuses on the user-side backend needed to support the current frontend MVP and demonstrate a full course-project stack. Admin endpoints, advanced moderation, uploads, and real-time systems remain future work.
