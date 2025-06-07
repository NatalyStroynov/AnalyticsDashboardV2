# Analytics Dashboard

A modern, responsive analytics dashboard built with Angular 17 and Chart.js, featuring dynamic chart management, multiple dashboard support, and a dark theme UI.

## Features

- **Multiple Dashboard Support**: Switch between different dashboard types (Simulation Field Model, Lead Contacts, Fiber Tracts)
- **Dynamic Chart Management**: Create, edit, duplicate, and delete charts with real-time updates
- **Interactive Chart Types**: Support for bar charts, line charts, pie charts, and doughnut charts
- **Dark Theme UI**: Modern dark interface with golden accent colors (#d4a421)
- **Responsive Design**: Optimized for desktop and tablet viewing
- **Real-time Notifications**: User feedback for all dashboard operations
- **Chart.js Integration**: Powerful charting capabilities with customizable styling

## Technology Stack

- **Frontend**: Angular 17 (Standalone Components)
- **Charts**: Chart.js
- **UI Components**: Angular Material
- **Styling**: SCSS with custom dark theme
- **Typography**: Inter font family
- **Icons**: Material Icons

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Angular CLI (version 17 or higher)

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd analytics-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Install Angular CLI globally (if not already installed):
```bash
npm install -g @angular/cli
```

## Development

To start the development server:

```bash
ng serve
```

The application will be available at `http://localhost:4200`

## Build

To build the project for production:

```bash
ng build --prod
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard-layout/           # Main dashboard container
│   │   ├── simple-chart-widget/        # Individual chart components
│   │   └── create-dashboard-modal/     # Dashboard creation modal
│   ├── services/
│   │   └── notification.service.ts     # User notification service
│   ├── app.component.ts                # Root component
│   └── app.config.ts                   # Application configuration
├── styles.scss                         # Global styles and Material theme
└── main.ts                            # Application bootstrap
```

## Dashboard Types

### 1. Simulation Field Model Dashboard
- Patient Accrual tracking (line chart)
- Treatment Outcomes analysis (bar chart)
- Resource Utilization breakdown (pie chart)

### 2. Lead Contacts Dashboard
- Lead Generation trends (line chart)
- Conversion Rate analysis (doughnut chart)

### 3. Fiber Tracts Dashboard
- Network Performance metrics (bar chart)

## Chart Features

### Chart Types
- **Bar Charts**: For categorical data comparison
- **Line Charts**: For trend analysis over time
- **Pie Charts**: For part-to-whole relationships
- **Doughnut Charts**: For hierarchical data visualization

### Chart Operations
- **Edit**: Modify chart title and type
- **Duplicate**: Create copies of existing charts
- **Delete**: Remove charts from dashboard
- **Drag & Drop**: Reorder charts (planned feature)

## Customization

### Theme Colors
The dashboard uses a custom dark theme with the following key colors:
- Primary: `#d4a421` (Golden)
- Background: `#2d2d2d` (Dark Gray)
- Surface: `#3a3a3a` (Medium Gray)
- Text: `#ffffff` (White)

### Adding New Dashboard Types
1. Update the `dashboards` array in `dashboard-layout.component.ts`
2. Add the new dashboard option to the selector dropdown
3. Define the chart configurations for the new dashboard

### Adding New Chart Types
1. Extend the `ChartData` interface type property
2. Update the chart rendering logic in `simple-chart-widget.component.ts`
3. Add the new type to chart creation modals

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions and support, please open an issue in the GitHub repository.