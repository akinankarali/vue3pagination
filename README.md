# Vue 3 Pagination

A small Vue 3, TypeScript, and Vite practice project focused on a realistic frontend pagination workflow. The app simulates an AI content review dashboard where an editor reviews AI-generated university program descriptions, searches through programs, navigates paginated results, and marks suggestions as approved or rejected.

Live demo: https://akinankarali.github.io/vue3pagination/

## What This Project Demonstrates

This project is intentionally scoped around frontend fundamentals that often appear in senior frontend interviews:

- server-style pagination instead of slicing all data directly in the component
- URL-driven page state with `?page=2`
- async loading and error handling
- debounced search
- optimistic UI updates for approve/reject actions
- strongly typed data contracts with TypeScript
- a deployable Vite setup for GitHub Pages

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Vite
- GitHub Actions
- GitHub Pages

## Core Idea

The app works with a mock API layer instead of a real backend. The mock API still behaves like a backend endpoint:

```ts
fetchPrograms({
  page: 2,
  pageSize: 10,
  search: 'data',
});
```

It returns a paginated response:

```ts
{
  programs: Program[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

This keeps the component close to how it would be written against a production API. The UI only receives the records needed for the current page and uses metadata from the response to render pagination controls.

## Data Model

The main domain model is defined in `src/types/index.ts`:

```ts
export interface Program {
  id: number;
  title: string;
  university: string;
  ai_description: string;
  status: 'pending' | 'approved' | 'rejected';
}
```

The status is modeled as a union type so the UI can only use valid review states.

## Pagination Approach

The current page is read from the browser URL on mount:

```text
/?page=2
```

When the user clicks a pagination button, the app:

1. Updates the local `currentPage` state.
2. Writes the new page to the URL with the History API.
3. Calls the mock API again with the new page.
4. Renders the returned page of results.

This makes pagination shareable and refresh-safe. A user can open `/?page=20` and land directly on page 20.

## Search Behavior

Search is handled as part of the API request rather than as a final UI-only filter over the current page. This better represents a real application because the backend should filter the full dataset before pagination is applied.

When the search query changes, the app resets to page 1 and waits briefly before calling the API. This debounce prevents unnecessary requests on every keystroke.

## Approve and Reject Flow

The approve/reject actions use an optimistic update:

1. The UI updates the status immediately.
2. The mock `updateStatus` function simulates an async API call.
3. If the call fails, the UI rolls back to the previous status.

This pattern keeps the interface responsive while still handling API failure safely.

## Project Structure

```text
src/
  App.vue              Main dashboard, URL state, pagination, search, review actions
  main.ts              Vue app entry point
  services/
    api.ts             Mock API with latency, pagination, search, and status updates
  types/
    index.ts           Shared TypeScript domain types
  style.css            Global styles
```

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

The project is configured for GitHub Pages using GitHub Actions.

Important detail for Vite: because the app is hosted under a repository path, `vite.config.ts` sets:

```ts
base: '/vue3pagination/'
```

Every push to `main` runs the deployment workflow and publishes the `dist` output to GitHub Pages.

## Notes

The implementation favors production-like boundaries even though the app uses mock data. The component does not know how the full dataset is generated. It asks the service for a specific page and renders the response. That separation makes the UI easier to move from mock data to a real HTTP client later.

The URL is treated as part of application state. That is important for pagination because users expect list views to survive refreshes, support browser back/forward navigation, and be shareable.

The search and pagination logic are intentionally connected: search resets pagination to page 1 because a filtered result set may not contain the page the user was previously viewing.
