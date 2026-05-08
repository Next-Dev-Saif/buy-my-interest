# n8n Bidirectional Sync Bridge

A production-ready tool to synchronize a specific n8n workflow between local JSON files and a running n8n instance.

## Features

- **Bidirectional Sync**: Local-to-n8n and n8n-to-local.
- **Deep Comparison**: Uses `lodash.isEqual` to prevent infinite loops by only syncing actual content changes.
- **File Watching**: Uses `chokidar` for near real-time updates from filesystem to n8n.
- **Polling**: Detects changes made in the n8n editor and pulls them back to disk.
- **Backups**: Automatically creates snapshots before overwriting data.
- **Environment Driven**: Configurable via `.env` file.
- **TypeScript**: Fully typed and modern codebase.

## Setup

1. **Install Dependencies**:
   ```bash
   cd n8n
   npm install
   ```

2. **Configure Environment**:
   Copy `.env.example` to `.env` and fill in your details:
   - `N8N_BASE_URL`: Your n8n instance URL (default: http://localhost:5678).
   - `WORKFLOW_ID`: The ID of the workflow you want to sync.
   - `N8N_API_KEY`: Your n8n API key (optional if running locally without auth, but recommended).

3. **Run the Bridge**:
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

## Workflow Storage

- Workflows are stored in `./n8n/workflows/`.
- Backups are stored in `./n8n/backups/`.

## Architecture

- `src/config.ts`: Configuration loader.
- `src/api.ts`: Wrapper for n8n REST/Public API.
- `src/sync.ts`: Core synchronization logic with caching and conflict prevention.
- `src/index.ts`: Entry point.

## Conflict Prevention

The bridge maintains an in-memory cache of the last known state. It uses flags (`isUpdatingLocal`, `isUpdatingRemote`) and deep comparison to ensure that a change from one side doesn't trigger a recursive update from the other side.
