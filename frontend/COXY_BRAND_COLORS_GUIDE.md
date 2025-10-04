# 🌸 Coxy Brand Colors Guide - Coxy

## 🎨 **Brand Color System Overview**

Coxy now features a beautiful coxy-inspired color palette that reflects the natural elegance and vibrancy of the coxy brand. The color system is designed to be both visually appealing and highly functional across all components.

## 🌈 **Coxy Brand Color Palette**

### **Primary Colors**

| Color | HSL Value | Usage | Description |
|-------|-----------|-------|-------------|
| **Coxy Primary** | `270 85% 65%` | Main brand color, buttons, highlights | Deep Purple - The signature brand color |
| **Coxy Secondary** | `240 100% 85%` | Accents, secondary elements | Light Blue - Complementary accent color |
| **Coxy Accent** | `300 75% 70%` | Call-to-actions, special highlights | Magenta - Vibrant accent for emphasis |
| **Coxy Light** | `270 50% 95%` | Backgrounds, subtle elements | Very Light Purple - Soft backgrounds |
| **Coxy Dark** | `270 90% 25%` | Text, contrast elements | Dark Purple - High contrast text |

### **Color Relationships**

- **Primary + Secondary**: Creates beautiful gradients and depth
- **Primary + Accent**: High contrast for important elements
- **Light + Dark**: Perfect for text hierarchy and readability
- **All Colors**: Work harmoniously together for cohesive design

## 🎯 **Usage Guidelines**

### **CSS Custom Properties**

All coxy colors are available as CSS custom properties:

```css
:root {
  --coxy-primary: 270 85% 65%;        /* Deep Purple */
  --coxy-secondary: 240 100% 85%;     /* Light Blue */
  --coxy-accent: 300 75% 70%;         /* Magenta */
  --coxy-light: 270 50% 95%;          /* Very Light Purple */
  --coxy-dark: 270 90% 25%;           /* Dark Purple */
}
```

### **Tailwind CSS Classes**

Use these Tailwind classes for consistent styling:

```tsx
// Text Colors
<span className="text-coxy-primary">Primary Text</span>
<span className="text-coxy-secondary">Secondary Text</span>
<span className="text-coxy-accent">Accent Text</span>
<span className="text-coxy-light">Light Text</span>
<span className="text-coxy-dark">Dark Text</span>

// Background Colors
<div className="bg-coxy-primary">Primary Background</div>
<div className="bg-coxy-secondary">Secondary Background</div>
<div className="bg-coxy-accent">Accent Background</div>
<div className="bg-coxy-light">Light Background</div>
<div className="bg-coxy-dark">Dark Background</div>

// Border Colors
<div className="border-coxy-primary">Primary Border</div>
<div className="border-coxy-secondary">Secondary Border</div>
<div className="border-coxy-accent">Accent Border</div>
```

### **Custom CSS Utility Classes**

Additional utility classes are available:

```css
.coxy-primary { color: hsl(var(--coxy-primary)); }
.coxy-secondary { color: hsl(var(--coxy-secondary)); }
.coxy-accent { color: hsl(var(--coxy-accent)); }
.coxy-light { color: hsl(var(--coxy-light)); }
.coxy-dark { color: hsl(var(--coxy-dark)); }

.bg-coxy-primary { background-color: hsl(var(--coxy-primary)); }
.bg-coxy-secondary { background-color: hsl(var(--coxy-secondary)); }
.bg-coxy-accent { background-color: hsl(var(--coxy-accent)); }
.bg-coxy-light { background-color: hsl(var(--coxy-light)); }
.bg-coxy-dark { background-color: hsl(var(--coxy-dark)); }

.border-coxy-primary { border-color: hsl(var(--coxy-primary)); }
.border-coxy-secondary { border-color: hsl(var(--coxy-secondary)); }
.border-coxy-accent { border-color: hsl(var(--coxy-accent)); }
```

## 🎨 **Component-Specific Usage**

### **Buttons & CTAs**

```tsx
// Primary Button
<Button className="bg-coxy-primary hover:bg-coxy-primary/80 text-white">
  Primary Action
</Button>

// Secondary Button
<Button variant="outline" className="border-coxy-primary text-coxy-primary hover:bg-coxy-primary/10">
  Secondary Action
</Button>

// Accent Button
<Button className="bg-coxy-accent hover:bg-coxy-accent/80 text-white">
  Special Action
</Button>
```

### **Cards & Containers**

```tsx
// Primary Card
<Card className="bg-card border-coxy-primary/20">
  <CardHeader>
    <CardTitle className="text-coxy-primary">Card Title</CardTitle>
  </CardHeader>
</Card>

// Accent Card
<Card className="bg-coxy-light border-coxy-accent/30">
  <CardContent>
    <p className="text-coxy-dark">Card content</p>
  </CardContent>
</Card>
```

### **Text & Typography**

```tsx
// Main Headings
<h1 className="text-coxy-primary font-bold">Main Title</h1>

// Subheadings
<h2 className="text-coxy-secondary font-semibold">Subtitle</h2>

// Accent Text
<span className="text-coxy-accent font-medium">Highlighted Text</span>

// Body Text
<p className="text-coxy-dark">Regular content text</p>
```

### **Interactive Elements**

```tsx
// Links
<a className="text-coxy-primary hover:text-coxy-accent underline">
  Interactive Link
</a>

// Form Elements
<input className="border-coxy-primary/30 focus:border-coxy-primary" />

// Progress Indicators
<div className="bg-coxy-primary/20">
  <div className="bg-coxy-primary h-full w-1/2"></div>
</div>
```

## 🌙 **Dark Mode Support**

The coxy color system automatically adapts to dark mode:

```css
.dark {
  --coxy-primary: 270 85% 65%;        /* Same vibrant purple */
  --coxy-secondary: 240 100% 85%;     /* Same light blue */
  --coxy-accent: 300 75% 70%;         /* Same magenta */
  --coxy-light: 270 20% 15%;          /* Dark purple for backgrounds */
  --coxy-dark: 270 30% 90%;           /* Light purple for text */
}
```

## 🎯 **Best Practices**

### **✅ Do:**

- Use `coxy-primary` for main brand elements and CTAs
- Use `coxy-secondary` for secondary actions and accents
- Use `coxy-accent` for special highlights and important elements
- Use `coxy-light` for subtle backgrounds and soft elements
- Use `coxy-dark` for high-contrast text and important information
- Combine colors thoughtfully for visual hierarchy
- Use opacity variations (e.g., `coxy-primary/20`) for subtle effects

### **❌ Don't:**

- Mix coxy colors with the old `#F8D12E` yellow color
- Use too many different coxy colors in one component
- Use low contrast combinations (e.g., light text on light backgrounds)
- Overuse the accent color - reserve it for special emphasis

## 🎨 **Color Combinations**

### **Recommended Pairings:**

```tsx
// Primary + White (High Contrast)
<div className="bg-coxy-primary text-white">Primary + White</div>

// Primary + Light (Soft Contrast)
<div className="bg-coxy-primary text-coxy-light">Primary + Light</div>

// Secondary + Dark (Readable)
<div className="bg-coxy-secondary text-coxy-dark">Secondary + Dark</div>

// Accent + White (Bold)
<div className="bg-coxy-accent text-white">Accent + White</div>

// Light + Dark (Subtle)
<div className="bg-coxy-light text-coxy-dark">Light + Dark</div>
```

### **Gradient Combinations:**

```tsx
// Primary to Secondary Gradient
<div className="bg-gradient-to-r from-coxy-primary to-coxy-secondary">
  Beautiful Gradient
</div>

// Primary to Accent Gradient
<div className="bg-gradient-to-br from-coxy-primary to-coxy-accent">
  Dynamic Gradient
</div>
```

## 🚀 **Implementation Examples**

### **Navigation Bar:**

```tsx
<nav className="bg-background border-b border-coxy-primary/20">
  <div className="flex items-center space-x-4">
    <img src="/coxy dora.png" alt="Logo" className="w-8 h-8" />
    <span className="text-coxy-primary font-bold">Coxy</span>
  </div>
</nav>
```

### **Hero Section:**

```tsx
<section className="bg-gradient-to-br from-coxy-light to-background">
  <h1 className="text-coxy-primary text-4xl font-bold">
    Welcome to Coxy
  </h1>
  <p className="text-coxy-dark text-lg">
    The ultimate domain hunter
  </p>
  <Button className="bg-coxy-primary hover:bg-coxy-primary/80">
    Get Started
  </Button>
</section>
```

### **Data Cards:**

```tsx
<Card className="bg-card border-coxy-primary/20 hover:border-coxy-primary/50">
  <CardHeader>
    <CardTitle className="text-coxy-primary">📊 Analytics</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-coxy-accent text-2xl font-bold">1,234</div>
    <p className="text-coxy-dark text-sm">Total Users</p>
  </CardContent>
</Card>
```

## 🎉 **Result**

The new Coxy brand color system provides:

- **🌸 Natural Beauty**: Colors inspired by the elegant coxy brand
- **🎯 Brand Consistency**: Unified color palette across all components
- **🌙 Dark Mode Ready**: Automatic adaptation for dark themes
- **♿ Accessibility**: High contrast ratios for readability
- **🎨 Visual Hierarchy**: Clear distinction between different element types
- **🚀 Modern Appeal**: Contemporary color choices that appeal to the crypto community

The coxy color system creates a distinctive, professional, and visually appealing brand identity that sets Coxy apart in the domain space! 🌸✨
