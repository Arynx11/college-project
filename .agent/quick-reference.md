# ParkEase - Developer Quick Reference

## 🚀 Quick Start

### Start the Development Server

```bash
npm run dev
```

This starts both frontend (port 5174) and backend (port 5002) concurrently.

### Individual Commands

```bash
npm run server  # Start backend only
npm run client  # Start frontend only
```

---

## 🎨 Theme System

### Accessing Colors

```javascript
import { colors } from '../../theme/theme';

// Usage in sx prop
sx={{
  color: colors.primary.main,
  background: colors.primary.gradient,
}}
```

### Available Colors

- `colors.primary.main` - #6366F1 (Indigo)
- `colors.secondary.main` - #EC4899 (Pink)
- `colors.success.main` - #10B981 (Green)
- `colors.warning.main` - #F59E0B (Amber)
- `colors.error.main` - #EF4444 (Red)
- `colors.grey[50-900]` - Gray scale

### Gradients

- `colors.primary.gradient` - Purple to violet
- `colors.secondary.gradient` - Pink gradient
- `colors.background.gradient` - Background gradient

---

## 💅 Styling Guidelines

### Use Theme Components

```javascript
import { Button, Card, TextField } from "@mui/material";

// All components use the custom theme automatically
<Button variant="contained">Click Me</Button>;
```

### Custom Styling

```javascript
// Use sx prop for custom styling
<Box sx={{
  p: 3,                    // padding: 24px
  borderRadius: 3,         // borderRadius: 12px
  background: colors.primary.gradient,
  '&:hover': {
    transform: 'translateY(-4px)',
  }
}}>
```

### Utility Classes (from index.css)

```html
<div className="fade-in">Animated content</div>
<div className="glass-card">Glassmorphism card</div>
<div className="hover-lift">Lifts on hover</div>
<span className="gradient-text">Gradient text</span>
```

---

## 📐 Spacing System

Use Material-UI's spacing scale (8px base):

- `p: 1` = 8px padding
- `p: 2` = 16px padding
- `p: 3` = 24px padding
- `p: 4` = 32px padding

### Common Spacing Patterns

```javascript
sx={{
  py: 8,        // padding-top & bottom: 64px
  px: 2,        // padding-left & right: 16px
  mt: 4,        // margin-top: 32px
  mb: 2,        // margin-bottom: 16px
}}
```

---

## 🎬 Animations

### CSS Animations (from index.css)

```html
<!-- Fade in on render -->
<div className="fade-in">Content</div>

<!-- Slide in from left -->
<div className="slide-in-left">Content</div>

<!-- Slide in from right -->
<div className="slide-in-right">Content</div>

<!-- Continuous pulse -->
<div className="pulse">Content</div>

<!-- Floating animation -->
<div className="float">Content</div>
```

### MUI Transitions

```javascript
import { alpha } from '@mui/material';

sx={{
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: 4,
  }
}}
```

---

## 🖼️ Component Patterns

### Loading States

```javascript
{loading ? (
  <Grid container spacing={3}>
    {[1, 2, 3].map((i) => (
      <Grid item xs={12} md={4} key={i}>
        <Card>
          <Skeleton variant="rectangular" height={200} />
          <Skeleton variant="text" />
        </Card>
      </Grid>
    ))}
  </Grid>
) : (
  // Actual content
)}
```

### Empty States

```javascript
{
  items.length === 0 && (
    <Paper sx={{ p: 6, textAlign: "center" }}>
      <Typography variant="h6" color="text.secondary">
        No items found
      </Typography>
    </Paper>
  );
}
```

### Card with Hover Effect

```javascript
<Card
  sx={{
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: 6,
    },
  }}
>
  <CardContent>{/* Content */}</CardContent>
</Card>
```

---

## 🌐 API Integration

### Base URL

```javascript
import { API_BASE_URL } from "../../config/config";

const response = await fetch(`${API_BASE_URL}/parking`, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
```

### Error Handling

```javascript
try {
  const response = await fetch(url);
  const data = await response.json();

  if (response.ok && data.status === "success") {
    return data.data;
  } else {
    console.error("API Error:", data);
    return [];
  }
} catch (error) {
  console.error("Network Error:", error);
  return [];
}
```

---

## 📱 Responsive Design

### Breakpoints

- xs: 0px (mobile)
- sm: 600px (tablet)
- md: 900px (desktop)
- lg: 1200px (large desktop)
- xl: 1536px (extra large)

### Usage

```javascript
sx={{
  fontSize: { xs: '1rem', md: '1.5rem' },
  display: { xs: 'none', md: 'flex' },
  p: { xs: 2, md: 4 },
}}
```

### Grid System

```javascript
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={4}>
    {/* Full width on mobile, half on tablet, third on desktop */}
  </Grid>
</Grid>
```

---

## 🔐 Authentication

### Using Auth Context

```javascript
import { useAuth } from "../../components/layout/Navbar";

function MyComponent() {
  const { isAuthenticated, userRole, userName, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <div>Welcome, {userName}!</div>;
}
```

---

## 🛠️ Common Tasks

### Adding a New Page

1. Create component in `client/src/views/`
2. Add route in `App.jsx`:

```javascript
<Route path="/new-page" element={<NewPage />} />
```

### Creating a New Component

1. Create file in `client/src/components/`
2. Use theme system:

```javascript
import { Box, Typography } from "@mui/material";
import { colors } from "../../theme/theme";

function MyComponent() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Title</Typography>
    </Box>
  );
}
```

### Modifying Theme

Edit `client/src/theme/theme.js`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: "#NEW_COLOR",
    },
  },
});
```

---

## 🎨 Design Tokens

### Font Weights

- 300: Light
- 400: Regular
- 500: Medium
- 600: Semibold
- 700: Bold
- 800: Extrabold

### Border Radius

- Small: 8px
- Medium: 12px (default)
- Large: 16px
- XL: 20px

### Shadows

```javascript
sx={{ boxShadow: 1 }}  // Subtle
sx={{ boxShadow: 3 }}  // Medium
sx={{ boxShadow: 6 }}  // Strong
```

---

## 📝 Best Practices

1. **Always use theme colors** - Never hardcode colors
2. **Use spacing scale** - Consistent spacing with theme units
3. **Implement loading states** - Better UX
4. **Handle errors gracefully** - User-friendly error messages
5. **Mobile-first responsive** - Start with mobile, scale up
6. **Semantic HTML** - Use proper HTML5 tags
7. **Accessible** - Include ARIA labels and focus states
8. **Comment your code** - Explain complex logic
9. **Keep components small** - Single responsibility
10. **Test responsiveness** - Check all breakpoints

---

## 🐛 Debugging

### Server Logs

Check terminal for colored emoji logs:

- 🚀 Server status
- 📍 Environment info
- 🔗 API endpoints
- ✅ Success messages
- ❌ Error messages

### Client Errors

Check browser console (F12)

### Port Issues

If port 5002 is in use:

```bash
npx kill-port 5002
```

---

## 📚 Resources

- [Material-UI Docs](https://mui.com/)
- [React Docs](https://react.dev/)
- [Leaflet Maps](https://leafletjs.com/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://docs.mongodb.com/)

---

## 🎯 Tips

1. **Use VS Code snippets** for faster development
2. **Install React DevTools** for debugging
3. **Use Prettier** for code formatting
4. **Git commit often** with clear messages
5. **Test on real devices** for mobile UX

---

_Keep this guide handy for quick reference!_
