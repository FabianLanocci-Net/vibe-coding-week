# Support Ticket System

A modern, responsive support ticket handling application built with React, TypeScript, and Tailwind CSS. Features a clean, minimalist design with dark/light theme support and localStorage-based data persistence.

## Features

- **Modern UI/UX**: Clean, minimalist design with rounded borders and subtle shadows
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Responsive Design**: Fully responsive layout that works on all devices
- **Ticket Management**: Submit and view support tickets with severity levels
- **Local Storage**: Data persistence using localStorage (easily replaceable with API)
- **TypeScript**: Full type safety throughout the application
- **Production Ready**: Optimized build with Netlify deployment configuration

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd support-ticket-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Project Structure

```
src/
├── components/          # React components
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── SubmitTicket.tsx # Ticket submission form
│   ├── TicketList.tsx  # Ticket listing and filtering
│   ├── TicketCard.tsx  # Individual ticket display
│   └── ThemeToggle.tsx # Dark/light theme toggle
├── contexts/           # React contexts
│   └── ThemeContext.tsx # Theme management
├── types/              # TypeScript type definitions
│   └── ticket.ts       # Ticket-related types
├── utils/              # Utility functions
│   └── ticketStorage.ts # localStorage operations
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Features in Detail

### Ticket Submission
- Clean form with title, description, and severity fields
- Form validation and error handling
- Success/error feedback
- Automatic redirect to ticket list after submission

### Ticket Management
- View all submitted tickets
- Filter by severity (Low, Medium, High)
- Filter by status (Open, In Progress, Resolved, Closed)
- Search functionality across title, description, and ID
- Statistics dashboard showing ticket counts by status

### Theme System
- Automatic system theme detection
- Manual theme toggle
- Persistent theme preference in localStorage
- Smooth transitions between themes

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements

## Deployment

### Netlify

The project includes a `netlify.toml` configuration file for easy deployment to Netlify:

1. Connect your repository to Netlify
2. The build settings are automatically configured
3. Deploy with `npm run build`

### Other Platforms

For other platforms, build the project and deploy the `dist` directory:

```bash
npm run build
# Deploy the 'dist' directory to your hosting platform
```

## Data Structure

Tickets are stored with the following structure:

```typescript
interface Ticket {
  id: string;           // Unique identifier
  title: string;        // Ticket title
  description: string;  // Detailed description
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;      // Creation timestamp
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
}
```

## Customization

### Adding API Integration

The localStorage functions in `src/utils/ticketStorage.ts` can be easily replaced with API calls:

```typescript
// Replace localStorage functions with API calls
export async function getTickets(): Promise<Ticket[]> {
  const response = await fetch('/api/tickets');
  return response.json();
}

export async function createTicket(ticketData: CreateTicketData): Promise<Ticket> {
  const response = await fetch('/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData)
  });
  return response.json();
}
```

### Styling

The project uses Tailwind CSS with custom components defined in `src/index.css`. Colors and styling can be customized in `tailwind.config.js`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.