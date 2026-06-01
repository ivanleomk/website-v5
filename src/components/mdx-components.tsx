import { useState } from 'react'
import { Plus, Minus, RefreshCw, Copy, Check } from 'lucide-react'

// 1. Beautiful Interactive Counter Component
export function InteractiveCounter() {
  const [count, setCount] = useState(0)

  return (
    <div className="my-6 p-6 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4 max-w-sm mx-auto shadow-sm">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interactive Widget</span>
      <div className="flex items-center gap-6">
        <button
          onClick={() => setCount(c => c - 1)}
          className="p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all shadow-sm"
          aria-label="Decrease count"
        >
          <Minus className="w-5 h-5" />
        </button>
        <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums min-w-[3ch] text-center animate-pulse">
          {count}
        </span>
        <button
          onClick={() => setCount(c => c + 1)}
          className="p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all shadow-sm"
          aria-label="Increase count"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <button 
        onClick={() => setCount(0)}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Reset Counter</span>
      </button>
    </div>
  )
}

// 2. Beautiful HSL Color Palette Visualizer Component
export function ColorPaletteVisualizer() {
  const [hue, setHue] = useState(250) // Purple/Indigo default
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const steps = [
    { name: '50', lightness: 97, saturation: 90 },
    { name: '100', lightness: 90, saturation: 85 },
    { name: '300', lightness: 70, saturation: 80 },
    { name: '500', lightness: 50, saturation: 75 }, // base accent
    { name: '700', lightness: 35, saturation: 80 },
    { name: '900', lightness: 15, saturation: 85 },
  ]

  const copyToClipboard = (hslStr: string, index: number) => {
    navigator.clipboard.writeText(hslStr)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1500)
  }

  return (
    <div className="my-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Adjust Base Hue: {hue}°</label>
          <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono">
            hsl({hue}, 75%, 50%)
          </span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="360" 
          value={hue}
          onChange={(e) => setHue(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {steps.map((step, idx) => {
          const hslVal = `hsl(${hue}, ${step.saturation}%, ${step.lightness}%)`
          
          return (
            <button
              key={step.name}
              onClick={() => copyToClipboard(hslVal, idx)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-100 dark:border-slate-850 hover:scale-105 active:scale-95 transition-all text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 group relative overflow-hidden"
              style={{ backgroundColor: 'transparent' }}
            >
              <div 
                className="w-full aspect-square rounded-lg shadow-inner flex items-center justify-center relative"
                style={{ backgroundColor: hslVal }}
              >
                {copiedIndex === idx ? (
                  <Check className="w-5 h-5 text-white filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                ) : (
                  <Copy className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] transition-opacity" />
                )}
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Color {step.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{step.lightness}% Light</span>
              </div>
            </button>
          )
        })}
      </div>
      
      <p className="text-xs text-center text-slate-400 dark:text-slate-500">
        Click any swatch to copy the calculated HSL color value to your clipboard.
      </p>
    </div>
  )
}
