# CampusGo Frontend MVP Design

## Summary

This document defines the first frontend MVP for CampusGo using Taro 4, Vue 3, TypeScript, and NutUI. The goal is to turn the current starter template into a usable mobile-first product shell with real page structure, navigation, mock-driven state, and interaction paths that match the technical document's user-side core scenarios.

## Scope

The MVP includes:

- Five TabBar pages: `home`, `square`, `publish`, `message`, `profile`
- Two supporting pages: `auth/login`, `activity/detail`
- Shared components for activity cards, empty states, and search/filter affordances
- Local mock data and service functions that mirror the eventual backend API shape
- Basic state containers for user, activities, and messages
- Navigation and interaction flows between the above pages

The MVP does not include:

- Registration flow
- Activity edit or delete flows
- Signup review management
- Profile edit page
- My published / my favorites / my signups detail pages
- Real backend requests, upload flows, or persistent authentication

## Product Goal

The first version should feel like a coherent campus activity app rather than a page collection. A user should be able to open the app, browse recommended activities, explore the square, open a detail page, simulate favorite and signup actions, publish a new activity through a validated form, and inspect message/profile surfaces that clearly show where the rest of the product will grow.

## Information Architecture

### TabBar Pages

#### `pages/home/index`

Purpose:
Provide a welcoming landing page with recommended activities, category shortcuts, and a quick path into the square and detail pages.

Content:

- Header with product name and short contextual greeting
- Search trigger that routes into the square page
- Horizontal category chips
- Recommended activity list
- Highlight banner or stats strip showing campus activity energy

#### `pages/square/index`

Purpose:
Act as the activity discovery surface with searchable, filterable mock data.

Content:

- Search bar
- Category filter chips
- Sort/status tabs
- Activity list rendered with reusable cards
- Empty state when filters produce no results

#### `pages/publish/index`

Purpose:
Provide the first real data-entry workflow in the app.

Content:

- Activity creation form
- Fields for title, category, time, location, participant limit, audit requirement, contact info, and description
- Inline validation
- Submit button with success feedback

#### `pages/message/index`

Purpose:
Show the shape of the notification center and unread/read status handling.

Content:

- Segment control for all vs unread
- Message list with type badges
- Read status affordance
- Empty state for filtered views

#### `pages/profile/index`

Purpose:
Represent the logged-in user's personal hub and the next-step modules.

Content:

- User summary card
- Quick entry tiles for my published, my signups, my favorites, edit profile
- Stats strip
- Logout or login prompt based on store state

### Non-Tab Pages

#### `pages/auth/login`

Purpose:
Support the minimum authentication entry point for the MVP.

Content:

- Phone input
- Password input
- Demo account hint
- Submit button that updates the user store

#### `pages/activity/detail`

Purpose:
Show a believable activity detail experience and connect the core browsing flow.

Content:

- Cover, title, category, status, time, location
- Organizer summary
- Participant progress / capacity
- Description
- Comment preview list
- Favorite toggle
- Signup action with audit-required messaging

## Directory Design

The repo should move from a single-page starter into the following focused structure:

```text
src/
├── app.config.ts
├── app.scss
├── app.ts
├── components/
│   ├── ActivityCard/
│   ├── EmptyState/
│   └── SearchBar/
├── mock/
│   ├── activities.ts
│   ├── messages.ts
│   └── user.ts
├── pages/
│   ├── activity/detail/
│   ├── auth/login/
│   ├── home/
│   ├── message/
│   ├── profile/
│   ├── publish/
│   └── square/
├── services/
│   ├── activity.ts
│   ├── auth.ts
│   └── message.ts
├── stores/
│   ├── activity.ts
│   ├── message.ts
│   └── user.ts
├── types/
│   ├── activity.ts
│   ├── message.ts
│   └── user.ts
└── utils/
    ├── constants.ts
    └── format.ts
```

## Data Model

### Activity

The frontend activity model should cover the fields needed by list cards, detail pages, and publish form echoes:

- `id`
- `title`
- `category`
- `cover`
- `summary`
- `description`
- `activityTime`
- `location`
- `maxParticipants`
- `currentParticipants`
- `auditRequired`
- `status`
- `contactInfo`
- `organizer`
- `isFavorite`
- `signupStatus`
- `tags`

### User

- `id`
- `nickname`
- `avatar`
- `college`
- `grade`
- `bio`
- `phone`
- `loggedIn`

### Message

- `id`
- `type`
- `title`
- `content`
- `isRead`
- `createdAt`
- `relatedActivityId`

## Service and Store Boundaries

Services should return `Promise`-based mock results so page code already looks like a real app. The first implementation does not need a generic `request.ts` wrapper because nothing is remote yet; adding one now would create indirection without value.

### `services/activity.ts`

Responsibilities:

- Get recommended activities
- Get square activities with optional category / keyword / status filters
- Get activity detail by id
- Toggle favorite state
- Submit signup action
- Submit publish form and return the created mock activity

### `services/auth.ts`

Responsibilities:

- Login with phone/password against a demo credential
- Return current mock user

### `services/message.ts`

Responsibilities:

- Get message list
- Mark a message as read

### Stores

- `user` store: current user, login state, login/logout actions
- `activity` store: current filters, cached lists, selected detail, favorite/signup updates
- `message` store: messages, unread count, mark-read behavior

Pinia should be added now because the design document and technical document both treat state as a first-class part of the frontend. Even with mock data, this keeps navigation behavior consistent across pages.

## Interaction Flows

### Browse to Detail

1. User opens `home` or `square`
2. User taps an activity card
3. App routes to `activity/detail?id=<id>`
4. Detail page loads the activity via the activity service/store

### Favorite

1. User taps favorite on a card or detail page
2. Local service toggles `isFavorite`
3. UI updates immediately

### Signup

1. User taps signup on detail page
2. If not logged in, app routes to login
3. If logged in, local service updates signup state
4. Success toast reflects direct pass vs pending review

### Publish

1. User opens `publish`
2. User fills the form
3. Validation blocks empty or malformed fields
4. Submit creates a mock activity and shows success feedback
5. App can route back to square or home after submit

### Message Read

1. User opens `message`
2. User taps a message row
3. Store marks it as read
4. Unread badge/count updates

## Visual Direction

The UI should feel campus-social and energetic, but not noisy. Since the repo has no existing design system beyond NutUI defaults, the MVP should establish one through global variables and consistent spacing.

Guidelines:

- Use a bright, warm palette with strong contrast instead of default purple accents
- Keep layouts mobile-first and dense enough for repeated scanning
- Use one visual motif consistently, such as soft rounded panels plus bold section headers
- Avoid marketing-style hero layouts; this is an app surface, not a landing page
- Use visual hierarchy to make activity cards and call-to-action buttons immediately legible

## Testing and Verification

This MVP should be verified primarily through TypeScript build and Taro H5 build, plus manual navigation checks. Since the current repo has no test framework configured, the implementation should not invent one mid-stream. Validation for this phase is:

- Type-check / build succeeds
- Taro app boots with the new pages configured
- Each page renders without runtime crashes
- Core mock interactions work: login, navigate to detail, favorite, signup, publish, mark message as read

## Risks and Mitigations

### Risk: Overbuilding the mock layer

Mitigation:
Keep service methods thin and only model fields the current pages use.

### Risk: Publish page becomes too ambitious

Mitigation:
Limit the first form to text/date/select/switch style fields already supported by NutUI and Taro.

### Risk: Square and home duplicate too much UI

Mitigation:
Centralize activity presentation in `ActivityCard` and shared formatting helpers.

## Implementation Boundary

This spec intentionally defines one coherent frontend slice. Admin pages, approval workflows, registration, and secondary profile pages are deferred so the first delivery can become a believable, navigable product shell without fragmenting effort.
