# Analytics Dashboard

A modern, responsive dashboard for data visualization and analytics with dark theme and interactive charts.

## Project Structure

This is a standalone web application built with:
- **HTML5** with modern ES6+ JavaScript
- **Chart.js** for interactive data visualizations
- **CSS3** with dark theme styling (#2d2d2d background, #d4a421 golden accents)
- **Express.js** backend for serving the application

## Features

- **Dashboard Management**: Switch between multiple dashboard types
- **Interactive Charts**: Bar, line, pie, and doughnut charts with Chart.js
- **Dynamic Chart Creation**: Add new charts with custom titles and types
- **Modern Modal System**: Styled modal dialogs for all user interactions
- **Filtering System**: Apply filters to dashboard data
- **Data Source Integration**: Connect to various data sources
- **Dark Theme**: Professional dark UI with golden accent colors
- **Responsive Design**: Works on desktop and mobile devices
- **Chart Export**: Export charts as PNG images

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   node server.js
   ```

3. **Open browser:**
   Navigate to `http://localhost:5000`

## Available Scripts

- `node server.js` - Start the development server
- `node run-angular.js` - Alternative server startup

## Dashboard Types

The application includes three pre-configured dashboards:

### 1. Simulation Field Model Dashboard
- Patient Accrual (Line Chart)
- Treatment Outcomes (Bar Chart)  
- Resource Utilization (Pie Chart)

### 2. Lead Contacts Dashboard
- Lead Generation (Line Chart)
- Conversion Rate (Doughnut Chart)

### 3. Fiber Tracts Dashboard
- Network Performance (Bar Chart)

## Creating New Dashboards

1. Click the dashboard selector dropdown
2. Select "+ Create New Dashboard"
3. Enter dashboard name and description
4. Click "Create Dashboard"

## Adding Charts

1. Click "Add New Chart" button
2. Select chart type (Bar, Line, Pie, Doughnut)
3. Enter chart title
4. Click "Create Chart"

## Chart Management

Each chart widget includes:
- **Edit**: Modify chart title and properties
- **Duplicate**: Create a copy of the chart
- **Delete**: Remove chart from dashboard
- **Export**: Download chart as PNG image

## Data Sources

Available data source connections:
- Patient Records
- Treatment Data
- Resource Utilization
- Lead Management
- Contact Information
- Network Performance

## Filtering

Apply filters to refine dashboard data:
- Date Range filters
- Category filters
- Status filters
- Region filters

## File Structure

```
analytics-dashboard/
├── src/
│   ├── index.html          # Main application file
│   ├── styles.scss         # Global styles
│   ├── main.ts            # Bootstrap file
│   └── app/
│       ├── app.component.*
│       └── app.config.ts
├── server.js              # Express server
├── run-angular.js         # Alternative server
├── angular.json           # Angular configuration
├── package.json           # Dependencies
└── README.md             # This file
```

## Styling

The application uses a consistent dark theme:
- **Background**: #2d2d2d (Dark gray)
- **Widget Background**: #3a3a3a (Medium gray)
- **Accent Color**: #d4a421 (Golden yellow)
- **Text**: #ffffff (White)
- **Borders**: #4a4a4a (Light gray)

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Charts**: Chart.js 4.4.0
- **Backend**: Express.js
- **Icons**: Material Icons
- **Fonts**: Inter (Google Fonts)

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

To extend the dashboard:

1. **Add new chart types**: Extend the chart creation logic in index.html
2. **Add data sources**: Modify the showDataSources() function
3. **Customize styling**: Update CSS variables and classes
4. **Add new dashboard types**: Extend the dashboards object

## Deployment

For production deployment:

1. **Build optimization**: Minify CSS and JavaScript
2. **Server configuration**: Configure Express for production
3. **Environment variables**: Set up production environment
4. **Security**: Add HTTPS and security headers

## License

MIT License - feel free to use this project for your dashboard needs.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For questions or issues, please create an issue in the GitHub repository.