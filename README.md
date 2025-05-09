# Megagigageili Siechä - SOLA-Resultate

A web application to view and analyze statistics from the SOLA relay race.

## Features

- View team statistics including:
  - Year-by-year performance
  - Category information
  - Race times and rankings
  - Success/disqualification status
  - Detailed run information for each year

- View participant statistics including:
  - Total distance and time
  - Participation count
  - Success and disqualification rates
  - Best and average rankings
  - Detailed race history for each participant

- Interactive features:
  - Sortable tables
  - Search functionality
  - Detailed views for teams and participants
  - Captcha protection for statistics access

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Building for Production

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist` directory.

## Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment is handled by GitHub Actions.

## Data Structure

The application expects JSON data files in the following structure:

- `public/data/YYYY.json` - Year data files containing:
  - Team information
  - Individual run data
  - Category information
  - Results and rankings

## Technologies Used

- React
- TypeScript
- Material-UI
- Vite
- React Router
- GitHub Actions for CI/CD
