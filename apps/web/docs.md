# Web App Documentation

## Overview

The web app is a Next.js React application that provides a Trello-like interface for managing boards with drag-and-drop functionality. It uses Tailwind CSS for styling and FontAwesome for icons.

## Structure

- `src/`
  - `app/`: Next.js app router pages.
    - `layout.tsx`: Root layout component.
    - `boards/`: Board-related pages.
      - `page.tsx`: Boards listing page.
      - `[id]/page.tsx`: Individual board editor page.
    - `globals.css`: Global styles.
  - `components/`: Reusable React components.
    - `BoardCreation/`: Component for creating new boards.
    - `BoardPreview/`: Component for displaying board previews.
    - `Card/`: Card component with drag functionality.
    - `CardContainer/`: Container for cards with drop zones.
    - `CardEditModal/`: Modal for editing cards.
    - `Modal/`: Generic modal component.
    - `MouseFollower/`: Component for following mouse during drag.
  - `utils/`: Utility functions.
    - `apiHandler.ts`: API endpoint utilities.
    - `gradients.ts`: Gradient utilities.
    - `types.ts`: Type definitions.

## Key Components

- **Board Editor**: Interactive page for editing boards with drag-and-drop cards between containers.
- **Board Listing**: Page displaying all boards with creation option.
- **Drag and Drop**: Implemented using React state management with reducer pattern.
- **API Integration**: Fetches and updates board data via REST API.