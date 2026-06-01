import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light') // default to light mode to match image exactly

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-serif relative">
      {/* Subtle theme toggle absolute positioned top-right so it doesn't break the clean header design */}
      <button 
        onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 transition-colors z-50 font-sans"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>

      {/* Main Outlet */}
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  )
}
