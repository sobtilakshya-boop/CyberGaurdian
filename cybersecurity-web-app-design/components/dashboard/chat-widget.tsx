"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, User, ShieldCheck, Sparkles } from 'lucide-react'
import { createPortal } from 'react-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatWidgetProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Greetings, Operator. I am your CyberGuardian AI. I am specialized in Cyber Hygiene, Endpoint Security, and Digital Forensics. How can I assist your operations today?"
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const handleInputChange = (e: any) => setInput(e.target.value)

  const handleSubmit = async (e?: any) => {
    if (e) e.preventDefault()
    if (!input?.trim() || isLoading) return

    const userMessage = { id: Date.now().toString(), role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`)
      }

      if (!response.body) throw new Error("No response body")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''
      const assistantMessageId = (Date.now() + 1).toString()

      // Add empty assistant message to start updating
      setMessages(msgs => [...msgs, { id: assistantMessageId, role: 'assistant', content: '' }])
      setIsLoading(false)

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        
        // Vercel AI SDK streams text in the format: 0:"text"
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('0:')) {
            try {
              const text = JSON.parse(line.substring(2))
              assistantContent += text
              setMessages(msgs => 
                msgs.map(m => m.id === assistantMessageId ? { ...m, content: assistantContent } : m)
              )
            } catch (e) {
              // Ignore parse errors on malformed chunks
            }
          } else if (line && !line.startsWith('d:') && !line.startsWith('e:')) {
            // Fallback for raw text if the server doesn't use the '0:' format
             assistantContent += line
             setMessages(msgs => 
                msgs.map(m => m.id === assistantMessageId ? { ...m, content: assistantContent } : m)
             )
          }
        }
      }
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [messages])

  if (!mounted) return null

  // Using a portal allows the chat to escape the AstronautScene container entirely
  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
          {/* Dark blurred backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md cursor-pointer"
          />
          
          {/* Massive Center Chat Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-4xl bg-slate-950/80 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden relative"
            style={{ height: '85vh' }}
          >
            {/* Immersive Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="p-6 border-b border-cyan-500/30 flex justify-between items-center bg-slate-950/50 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-tr from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center gap-2">
                    CyberGuardian Unit 01 <Sparkles className="w-5 h-5 text-purple-400" />
                  </h2>
                  <p className="text-cyan-400/70 text-sm flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Secure Neural Link Active
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500 hover:bg-cyan-950/50 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
              {messages.map((m, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index} 
                  className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    m.role === 'user' 
                      ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-[0_0_10px_rgba(147,51,234,0.3)]' 
                      : 'bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  }`}>
                    {m.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-[15px] leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/30 text-white rounded-tr-sm' 
                      : 'bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-slate-200 rounded-tl-sm'
                  }`}>
                    {m.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    ) : (
                      <div className="prose prose-invert prose-cyan max-w-none prose-p:leading-relaxed prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-5 max-w-[85%]">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-cyan-600/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="rounded-2xl px-6 py-5 bg-cyan-950/60 border border-cyan-500/40 rounded-tl-sm flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              {error && (
                <div className="flex gap-5 max-w-[85%] mx-auto w-full justify-center">
                  <div className="rounded-2xl px-6 py-4 bg-red-950/80 border border-red-500/50 text-red-200 text-sm text-center shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <strong className="block text-red-400 mb-1">SYSTEM ERROR</strong>
                    {error.message || "Connection to CyberGuardian failed. Your API key might be invalid."}
                  </div>
                </div>
              )}
            </div>

            {/* Giant Input Area */}
            <div className="p-6 border-t border-cyan-500/30 bg-slate-950/80 backdrop-blur-md shrink-0 relative z-10">
              <form 
                onSubmit={handleSubmit} 
                className="relative flex items-center"
              >
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Initiate communication..."
                  className="w-full bg-slate-900/80 border-2 border-cyan-500/30 focus:border-purple-500/50 text-white rounded-xl py-4 pl-6 pr-16 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all text-lg placeholder:text-slate-500"
                />
                <button 
                  type="submit" 
                  disabled={!input?.trim()}
                  className="absolute right-3 p-2.5 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg hover:from-cyan-500 hover:to-purple-500 disabled:opacity-50 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 transition-all shadow-[0_0_15px_rgba(147,51,234,0.4)] cursor-pointer z-10"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              <p className="text-center text-slate-500 text-[11px] uppercase tracking-widest mt-4">CyberGuardian AI Model • strictly focused on digital security</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return createPortal(content, document.body)
}
