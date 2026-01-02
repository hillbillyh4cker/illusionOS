# 🖥️ IllusionOS

A complete desktop environment built with **Next.js** and **React**, featuring window management, multiple applications, and a modern desktop interface that runs entirely in your web browser.

![IllusionOS Screenshot](public/wallpapers/elliot.jpg)

## ✨ Features

### 🪟 Desktop Environment
- **Draggable Windows** - Move windows around the desktop
- **Window Controls** - Minimize, maximize, and close windows
- **Multi-Window Support** - Run multiple applications simultaneously
- **Desktop Icons** - Quick access to applications
- **Start Menu** - Application launcher with organized apps
- **Taskbar** - Shows running applications with focus management
- **Custom Wallpapers** - Multiple wallpaper options including custom images

### 📱 Built-in Applications

#### 🌐 **Browser**
- Tabbed browsing interface
- Built-in web pages (Home, Search, News, Weather)
- External website support via proxy
- Bookmark management
- Navigation controls (back, forward, refresh)

#### 📝 **Notepad**
- Rich text editing
- Save and export functionality
- Character and word count
- File management

#### 🧮 **Calculator**
- Full-featured calculator
- Basic arithmetic operations
- Memory functions
- Clean, intuitive interface

#### 📁 **File Manager**
- Hierarchical file system
- Folder navigation
- File type icons
- Search functionality
- Expandable folder tree

#### 🖼️ **Gallery**
- Image viewer with grid and list views
- Full-screen image viewing
- Navigation between images
- Search and filter capabilities

#### ⚡ **Terminal**
- Linux-like command interface
- File system navigation (`ls`, `cd`, `pwd`)
- File operations (`mkdir`, `touch`, `rm`, `cat`)
- Command history
- Tab completion
- Built-in help system

#### 🎮 **Games**
- Game center with classic games
- Snake, Tetris, Pong, Breakout (UI ready)
- Expandable game library

#### ⚙️ **Settings**
- Theme selection (Light/Dark/System)
- Wallpaper management
- System information
- Customization options

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/illusion-os.git
   cd illusion-os
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open in browser**
   \`\`\`
   http://localhost:3000
   \`\`\`

### Production Build

\`\`\`bash
# Build for production
npm run build

# Start production server
npm start
\`\`\`

## 🛠️ Development

### Project Structure
\`\`\`
illusion-os/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (proxy service)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── apps/             # Individual applications
│   │   ├── browser.tsx   # Web browser app
│   │   ├── calculator.tsx # Calculator app
│   │   ├── notepad.tsx   # Text editor app
│   │   ├── terminal.tsx  # Terminal emulator
│   │   └── ...           # Other apps
│   ├── ui/               # Reusable UI components
│   ├── desktop.tsx       # Main desktop component
│   ├── taskbar.tsx       # Bottom taskbar
│   ├── window.tsx        # Window management
│   └── windows-provider.tsx # Window state management
├── lib/                  # Utility functions
├── public/               # Static assets
│   └── wallpapers/       # Desktop wallpapers
└── README.md
\`\`\`

### Key Technologies
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Adding New Applications

1. Create a new component in `components/apps/`
2. Add the app to the window manager in `components/window.tsx`
3. Add desktop icon in `components/desktop.tsx`
4. Add to taskbar in `components/taskbar.tsx`

Example:
\`\`\`typescript
// components/apps/my-app.tsx
export default function MyApp() {
  return (
    <div className="h-full p-4">
      <h1>My Custom App</h1>
      {/* Your app content */}
    </div>
  )
}
\`\`\`

## 🎨 Customization

### Adding Custom Wallpapers
1. Add image files to `public/wallpapers/`
2. Update the wallpapers array in `components/apps/settings.tsx`

### Theming
The project uses Tailwind CSS for styling. Customize colors and themes in:
- `tailwind.config.ts` - Tailwind configuration
- `app/globals.css` - Global styles

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with one click

### Other Platforms
- **Netlify**: Drag and drop the `out` folder after running `npm run build`
- **GitHub Pages**: Use `next export` for static deployment
- **Docker**: Create a Dockerfile for containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

If you have any questions or run into issues:

1. Check the [Issues](https://github.com/YOUR_USERNAME/illusion-os/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide as much detail as possible

---

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Your Name] - **Control is an Illusion** 🎭
