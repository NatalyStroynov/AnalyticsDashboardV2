# Deployment Guide

## Angular CLI Production Build

### Build for Production
```bash
ng build --configuration production
```

This creates optimized files in the `dist/analytics-dashboard/` directory.

### Environment Configuration

Create environment files for different deployment stages:

**src/environments/environment.ts** (Development)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  chartRefreshInterval: 30000
};
```

**src/environments/environment.prod.ts** (Production)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api',
  chartRefreshInterval: 60000
};
```

### Static File Hosting

#### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `ng build --configuration production`
3. Set publish directory: `dist/analytics-dashboard`
4. Deploy automatically on git push

#### Vercel Deployment
1. Import project from GitHub
2. Framework preset: Angular
3. Build command: `ng build --configuration production`
4. Output directory: `dist/analytics-dashboard`

#### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Docker Deployment

**Dockerfile**
```dockerfile
# Stage 1: Build the Angular app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build:prod

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist/analytics-dashboard /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### Performance Optimization

#### Bundle Analysis
```bash
ng build --configuration production --stats-json
npx webpack-bundle-analyzer dist/analytics-dashboard/stats.json
```

#### Lazy Loading
Implement route-based code splitting for better performance:

```typescript
const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard-layout/dashboard-layout.component')
      .then(m => m.DashboardLayoutComponent)
  }
];
```

### Monitoring and Analytics

#### Google Analytics Integration
```typescript
// In index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Security Headers

Configure security headers in your web server:

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;";
```

### Environment Variables

For production deployments, set these environment variables:
- `NODE_ENV=production`
- `API_URL=your-api-endpoint`
- `CHART_REFRESH_INTERVAL=60000`

### Troubleshooting

#### Common Build Issues
1. **Memory issues**: Increase Node.js memory limit
   ```bash
   node --max_old_space_size=4096 node_modules/@angular/cli/bin/ng build --prod
   ```

2. **TypeScript errors**: Ensure all types are properly defined
3. **Missing dependencies**: Run `npm install` before build

#### Runtime Issues
1. **Routing problems**: Ensure server redirects all routes to index.html
2. **API connectivity**: Check CORS configuration
3. **Chart rendering**: Verify Chart.js is properly imported