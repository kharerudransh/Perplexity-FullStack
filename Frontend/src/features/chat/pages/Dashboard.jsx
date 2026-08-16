import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from "react-redux"
import Loader from '@/app/components/Loader'

import { useChat } from '../hooks/useChat'
import { motion, AnimatePresence } from 'motion/react'
import {
  MessageSquare,
  Plus,
  Send,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bot,
  MoreHorizontal,
  Search,
  Paperclip,
  Mic,
  Square,
  Copy,
  Check,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react'

/* ── Typing Indicator ── */
const TypingIndicator = () => (
  <div className="flex items-end gap-3 mb-6">
    <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center flex-shrink-0">
      <Bot size={14} className="text-[#a8a8a8]" />
    </div>
    <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-[#141414] border border-white/[0.06] flex items-center gap-1.5">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#6b6b6b]"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.18, ease: 'easeInOut' }}
        />
      ))}
    </div>
  </div>
)

/* ── Markdown-lite message renderer ── */
const MessageContent = ({ content, isDark }) => {
  const [copied, setCopied] = useState(false)

  const C = isDark ? {
    text:        '#c0c0c0',
    bold:        '#e8e8e8',
    bullet:      '#6b6b6b',
    codeBg:      '#0d0d0d',
    codeBorder:  'rgba(255,255,255,0.07)',
    codeHeader:  'rgba(255,255,255,0.05)',
    codeLabel:   '#6b6b6b',
    codeText:    '#a8a8a8',
    inlineCode:  'rgba(255,255,255,0.08)',
    inlineText:  '#e8e8e8',
    copyBtn:     '#6b6b6b',
    copyBtnHover:'#c0c0c0',
  } : {
    text:        '#2a2a2a',
    bold:        '#111111',
    bullet:      '#888888',
    codeBg:      '#2a2928',
    codeBorder:  'rgba(0,0,0,0.15)',
    codeHeader:  'rgba(0,0,0,0.10)',
    codeLabel:   '#888888',
    codeText:    '#d4d2ce',
    inlineCode:  'rgba(0,0,0,0.08)',
    inlineText:  '#1a1a1a',
    copyBtn:     '#888888',
    copyBtnHover:'#333333',
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inlineCodeHtml = (text) =>
    text.replace(
      /`([^`]+)`/g,
      `<code style="padding:1px 6px;border-radius:4px;background:${C.inlineCode};color:${C.inlineText};font-family:monospace;font-size:11px">$1</code>`
    )

  const inlineBoldHtml = (text) =>
    text.replace(/\*\*(.+?)\*\*/g, `<strong style="color:${C.bold}">$1</strong>`)

  const formatInline = (text) => inlineCodeHtml(inlineBoldHtml(text))

  const parts = content.split(/(```[\s\S]*?```)/g)

  return (
    <div className="text-sm leading-relaxed space-y-3" style={{ color: C.text }}>
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const code = part.replace(/```(?:\w+)?\n?/, '').replace(/```$/, '')
          return (
            <div
              key={i}
              className="relative rounded-xl overflow-hidden"
              style={{ background: C.codeBg, border: `1px solid ${C.codeBorder}`, transition: 'all 0.3s' }}
            >
              <div
                className="flex items-center justify-between px-4 py-2"
                style={{ borderBottom: `1px solid ${C.codeHeader}` }}
              >
                <span className="text-xs font-mono" style={{ color: C.codeLabel }}>code</span>
                <button
                  onClick={() => copyCode(code)}
                  className="flex items-center gap-1.5 text-xs transition-colors"
                  style={{ color: copied ? C.copyBtnHover : C.copyBtn, cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = C.copyBtnHover}
                  onMouseLeave={e => e.currentTarget.style.color = copied ? C.copyBtnHover : C.copyBtn}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="px-4 py-3 overflow-x-auto text-xs font-mono" style={{ color: C.codeText }}>
                <code>{code.trim()}</code>
              </pre>
            </div>
          )
        }
        return (
          <div key={i}>
            {part.split('\n').map((line, j) => {
              if (line.startsWith('### '))
                return <p key={j} className="font-semibold text-base" style={{ color: C.bold }}>{line.slice(4)}</p>
              if (line.startsWith('## '))
                return <p key={j} className="font-semibold text-lg" style={{ color: C.bold }}>{line.slice(3)}</p>
              if (line.startsWith('# '))
                return <p key={j} className="font-semibold text-xl" style={{ color: C.bold }}>{line.slice(2)}</p>
              if (line.startsWith('- ') || line.startsWith('* '))
                return (
                  <div key={j} className="flex items-start gap-2">
                    <span className="mt-[7px] w-1 h-1 rounded-full flex-shrink-0" style={{ background: C.bullet }} />
                    <span dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />
                  </div>
                )
              if (line === '') return <div key={j} className="h-1" />
              return (
                <p key={j} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

const formatRelativeTime = (date) => {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

/* ── Dashboard ── */
const Dashboard = () => {
  const user = useSelector(state => state.auth.user)
  const loading = useSelector(state => state.auth.loading)
  const chatsMap = useSelector(state => state.chat.chats)
  const chat = useChat()

  const [isDark, setIsDark] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeChatId, setActiveChatId] = useState(null)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hoveredChat, setHoveredChat] = useState(null)

  const chats = Object.values(chatsMap)
  const messages = activeChatId ? (chatsMap[activeChatId]?.messages || []) : []

  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  /* ── Theme color map ── */
  const T = isDark ? {
    root:           '#0a0a0a',
    sidebar:        '#0e0e0e',
    sidebarBorder:  'rgba(255,255,255,0.05)',
    topbar:         'rgba(10,10,10,0.85)',
    topbarBorder:   'rgba(255,255,255,0.05)',
    surface:        '#111111',
    text:           '#e8e8e8',
    textMuted:      '#a8a8a8',
    textDim:        '#5a5a5a',
    textFaint:      '#2e2e2e',
    btnHover:       'rgba(255,255,255,0.04)',
    toggleBg:       '#1a1a1a',
    toggleBorder:   'rgba(255,255,255,0.10)',
    toggleIcon:     '#a8a8a8',
    brandIconBg:    'linear-gradient(135deg,#3a3a3a,#1a1a1a)',
    brandIconBorder:'rgba(255,255,255,0.10)',
    brandIconColor: '#c0c0c0',
    newChatBorder:  'rgba(255,255,255,0.08)',
    newChatBg:      'rgba(255,255,255,0.02)',
    newChatHoverBg: 'rgba(255,255,255,0.05)',
    searchBg:       'rgba(255,255,255,0.02)',
    searchBorder:   'rgba(255,255,255,0.06)',
    label:          '#2e2e2e',
    chatActive:     'rgba(255,255,255,0.06)',
    chatHover:      'rgba(255,255,255,0.03)',
    chatText:       '#e8e8e8',
    chatTextOff:    '#5a5a5a',
    chatTimestamp:  '#2e2e2e',
    accentBar:      'rgba(168,168,168,0.30)',
    deleteBtnColor: '#3a3a3a',
    footerBorder:   'rgba(255,255,255,0.04)',
    footerHover:    'rgba(255,255,255,0.03)',
    avatarBg:       'linear-gradient(135deg,#2e2e2e,#1a1a1a)',
    avatarBorder:   'rgba(255,255,255,0.08)',
    avatarText:     '#c0c0c0',
    userName:       '#a8a8a8',
    userEmail:      '#2e2e2e',
    logoutColor:    '#2e2e2e',
    msgAreaBg:      'transparent',
    emptyIconBg:    '#141414',
    emptyIconBorder:'rgba(255,255,255,0.08)',
    emptyIconColor: '#5a5a5a',
    emptyTitle:     '#e8e8e8',
    emptySubtitle:  '#3a3a3a',
    pillBg:         'rgba(255,255,255,0.015)',
    pillBorder:     'rgba(255,255,255,0.06)',
    pillText:       '#5a5a5a',
    pillHoverBg:    'rgba(255,255,255,0.04)',
    pillHoverText:  '#a8a8a8',
    pillHoverBorder:'rgba(255,255,255,0.10)',
    userBubbleBg:   '#1c1c1c',
    userBubbleBorder:'rgba(255,255,255,0.07)',
    userBubbleText: '#e8e8e8',
    aiBubbleBg:     '#1a1a1a',
    aiBubbleBorder: 'rgba(255,255,255,0.06)',
    userAvatarBg:   'linear-gradient(135deg,#2a2a2a,#181818)',
    userAvatarBorder:'rgba(255,255,255,0.09)',
    userAvatarText: '#c0c0c0',
    aiAvatarBg:     '#131313',
    aiAvatarBorder: 'rgba(255,255,255,0.06)',
    aiAvatarIcon:   '#7a7a7a',
    msgTimestamp:   '#2a2a2a',
    inputWrapBg:    '#111111',
    inputWrapBorder:'rgba(255,255,255,0.08)',
    inputWrapShadow:'0 4px 40px rgba(0,0,0,0.7)',
    inputText:      '#e8e8e8',
    inputPlaceholder:'#2e2e2e',
    iconBtn:        '#2e2e2e',
    iconBtnHover:   '#5a5a5a',
    iconBtnHoverBg: 'rgba(255,255,255,0.03)',
    sendActive:     '#e0e0e0',
    sendActiveFg:   '#0a0a0a',
    sendInactive:   'rgba(255,255,255,0.03)',
    sendInactiveFg: '#2e2e2e',
    hintText:       '#2a2a2a',
  } : {
    root:           '#f3f2ef',
    sidebar:        '#eae9e4',
    sidebarBorder:  'rgba(0,0,0,0.08)',
    topbar:         'rgba(243,242,239,0.92)',
    topbarBorder:   'rgba(0,0,0,0.07)',
    surface:        '#ffffff',
    text:           '#1c1c1c',
    textMuted:      '#444444',
    textDim:        '#888888',
    textFaint:      '#aaaaaa',
    btnHover:       'rgba(0,0,0,0.05)',
    toggleBg:       '#dddbd5',
    toggleBorder:   'rgba(0,0,0,0.12)',
    toggleIcon:     '#555555',
    brandIconBg:    'linear-gradient(135deg,#c8c6c0,#b0aea8)',
    brandIconBorder:'rgba(0,0,0,0.12)',
    brandIconColor: '#3a3a3a',
    newChatBorder:  'rgba(0,0,0,0.10)',
    newChatBg:      'rgba(0,0,0,0.03)',
    newChatHoverBg: 'rgba(0,0,0,0.06)',
    searchBg:       'rgba(0,0,0,0.04)',
    searchBorder:   'rgba(0,0,0,0.08)',
    label:          '#aaaaaa',
    chatActive:     'rgba(0,0,0,0.08)',
    chatHover:      'rgba(0,0,0,0.04)',
    chatText:       '#1c1c1c',
    chatTextOff:    '#666666',
    chatTimestamp:  '#aaaaaa',
    accentBar:      'rgba(80,80,80,0.30)',
    deleteBtnColor: '#888888',
    footerBorder:   'rgba(0,0,0,0.07)',
    footerHover:    'rgba(0,0,0,0.04)',
    avatarBg:       'linear-gradient(135deg,#c0bdb8,#a8a5a0)',
    avatarBorder:   'rgba(0,0,0,0.10)',
    avatarText:     '#3a3a3a',
    userName:       '#444444',
    userEmail:      '#999999',
    logoutColor:    '#999999',
    msgAreaBg:      'transparent',
    emptyIconBg:    '#e4e3de',
    emptyIconBorder:'rgba(0,0,0,0.09)',
    emptyIconColor: '#888888',
    emptyTitle:     '#1c1c1c',
    emptySubtitle:  '#888888',
    pillBg:         'rgba(0,0,0,0.03)',
    pillBorder:     'rgba(0,0,0,0.08)',
    pillText:       '#777777',
    pillHoverBg:    'rgba(0,0,0,0.06)',
    pillHoverText:  '#333333',
    pillHoverBorder:'rgba(0,0,0,0.14)',
    userBubbleBg:   '#e2e0db',
    userBubbleBorder:'rgba(0,0,0,0.07)',
    userBubbleText: '#1c1c1c',
    aiBubbleBg:     '#ccc9c2',
    aiBubbleBorder: 'rgba(0,0,0,0.09)',
    userAvatarBg:   'linear-gradient(135deg,#c8c5c0,#b0ada8)',
    userAvatarBorder:'rgba(0,0,0,0.09)',
    userAvatarText: '#3a3a3a',
    aiAvatarBg:     '#e0deda',
    aiAvatarBorder: 'rgba(0,0,0,0.07)',
    aiAvatarIcon:   '#777777',
    msgTimestamp:   '#aaaaaa',
    inputWrapBg:    '#e8e7e2',
    inputWrapBorder:'rgba(0,0,0,0.10)',
    inputWrapShadow:'0 4px 24px rgba(0,0,0,0.06)',
    inputText:      '#1c1c1c',
    inputPlaceholder:'#aaaaaa',
    iconBtn:        '#999999',
    iconBtnHover:   '#444444',
    iconBtnHoverBg: 'rgba(0,0,0,0.05)',
    sendActive:     '#2a2a2a',
    sendActiveFg:   '#f5f4f2',
    sendInactive:   'rgba(0,0,0,0.06)',
    sendInactiveFg: '#aaaaaa',
    hintText:       '#bbbbbb',
  }

  useEffect(() => {
    chat.initializeSocketConnection()
  }, [])

  useEffect(() => {
    chat.handleLoadChats()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px'
    }
  }, [input])

  const handleSelectChat = (id) => {
    setActiveChatId(id)
    setIsTyping(false)
    if (!chatsMap[id]?.messages?.length) {
      chat.handleLoadChat(id)
    }
  }

  const handleNewChat = () => {
    setActiveChatId(null)
    setIsTyping(false)
  }

  const handleDeleteChat = async (e, id) => {
    e.stopPropagation()
    await chat.handleDeleteChat(id)
    if (activeChatId === id) {
      setActiveChatId(null)
    }
  }

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isTyping) return

    setInput('')
    setIsTyping(true)

    try {
      const result = await chat.handleSendMessage({ message: trimmed, chatId: activeChatId })
      setActiveChatId(result.chatId)
    } catch (err) {
      console.log(err)
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const filteredChats = chats.filter(c =>
    (c.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading || !user) return <Loader message="Loading dashboard..." />

  const activeChat = chats.find(c => c._id === activeChatId)
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ fontFamily: 'Inter, Segoe UI, sans-serif', cursor: 'auto', background: T.root, transition: 'background 0.3s' }}
    >
      {/* ─────────────────── SIDEBAR ─────────────────── */}
      <motion.aside
        animate={{ width: sidebarOpen ? 272 : 0 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="flex-shrink-0 h-full overflow-hidden relative z-20"
        style={{ borderRight: sidebarOpen ? `1px solid ${T.sidebarBorder}` : 'none' }}
      >
        <div className="w-[272px] h-full flex flex-col" style={{ background: T.sidebar, transition: 'background 0.3s' }}>

          {/* Brand */}
          <div className="px-5 pt-6 pb-4 flex items-center gap-2.5 flex-shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: T.brandIconBg, border: `1px solid ${T.brandIconBorder}`, transition: 'all 0.3s' }}
            >
              <svg
                width="15" height="15" viewBox="0 0 24 24"
                fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{ color: T.brandIconColor }}
              >
                <path d="M12 2L12 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M2 12L22 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M4.93 4.93L19.07 19.07" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M19.07 4.93L4.93 19.07" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span
              className="text-sm font-semibold"
              style={{ fontFamily: 'Space Grotesk, sans-serif', color: T.text, transition: 'color 0.3s' }}
            >
              Perplexity
            </span>
          </div>

          {/* New Chat */}
          <div className="px-4 mb-4 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNewChat}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={{
                border: `1px solid ${T.newChatBorder}`,
                background: T.newChatBg,
                color: T.textDim,
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = T.newChatHoverBg; e.currentTarget.style.color = T.text }}
              onMouseLeave={e => { e.currentTarget.style.background = T.newChatBg; e.currentTarget.style.color = T.textDim }}
            >
              <Plus size={15} />
              <span>New Chat</span>
            </motion.button>
          </div>

          {/* Search */}
          <div className="px-4 mb-3 flex-shrink-0">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: T.searchBg, border: `1px solid ${T.searchBorder}`, transition: 'all 0.3s' }}
            >
              <Search size={12} className="flex-shrink-0" style={{ color: T.textFaint }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search chats…"
                className="flex-1 bg-transparent text-xs outline-none"
                style={{ color: T.textMuted, cursor: 'text' }}
              />
            </div>
          </div>

          {/* Label */}
          <div className="px-5 mb-2 flex-shrink-0">
            <span
              className="text-[10px] uppercase tracking-[2px]"
              style={{ color: T.label, transition: 'color 0.3s' }}
            >
              Recent
            </span>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
            <AnimatePresence>
              {filteredChats.map(c => (
                <motion.div
                  key={c._id}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.16 }}
                  onMouseEnter={e => {
                    setHoveredChat(c._id)
                    if (activeChatId !== c._id) e.currentTarget.style.background = T.chatHover
                  }}
                  onMouseLeave={e => {
                    setHoveredChat(null)
                    if (activeChatId !== c._id) e.currentTarget.style.background = 'transparent'
                  }}
                  onClick={() => handleSelectChat(c._id)}
                  className="group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150"
                  style={{
                    background: activeChatId === c._id ? T.chatActive : 'transparent',
                    color: activeChatId === c._id ? T.chatText : T.chatTextOff,
                    cursor: 'pointer',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  {activeChatId === c._id && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                      style={{ background: T.accentBar }}
                    />
                  )}
                  <MessageSquare size={13} className="flex-shrink-0 opacity-50" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate leading-tight">{c.title}</p>
                    <p
                      className="text-[10px] mt-0.5"
                      style={{ color: T.chatTimestamp }}
                    >
                      {formatRelativeTime(c.updatedAt || Date.now())}
                    </p>
                  </div>
                  {hoveredChat === c._id && (
                    <button
                      onClick={(e) => handleDeleteChat(e, c._id)}
                      className="flex-shrink-0 p-1 rounded-md transition-colors"
                      style={{ color: T.deleteBtnColor, cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = T.btnHover}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredChats.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-xs" style={{ color: T.textFaint }}>No chats found</p>
              </div>
            )}
          </div>

          {/* User Footer */}
          <div
            className="px-3 py-4 flex-shrink-0"
            style={{ borderTop: `1px solid ${T.footerBorder}`, transition: 'border-color 0.3s' }}
          >
            <div
              className="flex items-center gap-2.5 px-2 py-2 rounded-xl transition-colors group"
              style={{ cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = T.footerHover}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: T.avatarBg, border: `1px solid ${T.avatarBorder}`, transition: 'all 0.3s' }}
              >
                <span className="text-xs font-semibold" style={{ color: T.avatarText }}>{userInitial}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: T.userName }}>{user.name}</p>
                <p className="text-[10px] truncate" style={{ color: T.userEmail }}>{user.email}</p>
              </div>
              <LogOut size={13} style={{ color: T.logoutColor, transition: 'color 0.3s' }} />
            </div>
          </div>
        </div>
      </motion.aside>

      {/* ─────────────────── MAIN AREA ─────────────────── */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[280px] bg-white/[0.008] rounded-full blur-[140px] pointer-events-none" />

        {/* Top Bar */}
        <div
          className="flex items-center gap-3 px-5 py-3.5 flex-shrink-0 relative z-10 backdrop-blur-sm"
          style={{
            background: T.topbar,
            borderBottom: `1px solid ${T.topbarBorder}`,
            transition: 'background 0.3s, border-color 0.3s',
          }}
        >
          <button
            onClick={() => setSidebarOpen(p => !p)}
            className="p-1.5 rounded-lg transition-all"
            style={{ color: T.textDim, cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = T.btnHover}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>

          <h1
            className="flex-1 text-sm font-semibold truncate"
            style={{ fontFamily: 'Space Grotesk, sans-serif', color: T.textMuted }}
          >
            {activeChat?.title || 'New Chat'}
          </h1>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsDark(p => !p)}
            className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300"
            style={{
              background: T.toggleBg,
              border: `1px solid ${T.toggleBorder}`,
              color: T.toggleIcon,
              cursor: 'pointer',
            }}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <motion.div
              key={isDark ? 'moon' : 'sun'}
              initial={{ rotate: -30, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 30, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25 }}
            >
              {isDark ? <Moon size={14} /> : <Sun size={14} />}
            </motion.div>
          </motion.button>

          <button
            className="p-1.5 rounded-lg transition-all"
            style={{ color: T.textDim, cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = T.btnHover}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto relative">
          <div className="max-w-2xl mx-auto px-4 py-8">

            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="flex flex-col items-center justify-center min-h-[420px] text-center"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-2xl blur-xl" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }} />
                  <div
                    className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: T.emptyIconBg, border: `1px solid ${T.emptyIconBorder}`, transition: 'all 0.3s' }}
                  >
                    <Sparkles size={22} style={{ color: T.emptyIconColor }} />
                  </div>
                </div>
                <h2
                  className="text-xl font-semibold mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', color: T.emptyTitle }}
                >
                  How can I help you?
                </h2>
                <p className="text-sm max-w-sm leading-relaxed" style={{ color: T.emptySubtitle }}>
                  Ask anything — code, concepts, debugging, explanations.
                </p>

                <div className="flex flex-wrap gap-2 mt-8 justify-center">
                  {[
                    'Explain async/await',
                    'Debug my code',
                    'Optimize a query',
                    'React best practices',
                  ].map(s => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="px-3.5 py-2 rounded-xl text-xs transition-all duration-200"
                      style={{
                        background: T.pillBg,
                        border: `1px solid ${T.pillBorder}`,
                        color: T.pillText,
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = T.pillHoverBg
                        e.currentTarget.style.color = T.pillHoverText
                        e.currentTarget.style.borderColor = T.pillHoverBorder
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = T.pillBg
                        e.currentTarget.style.color = T.pillText
                        e.currentTarget.style.borderColor = T.pillBorder
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg._id || `${msg.role}-${idx}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                  className={`flex items-end gap-3 mb-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: msg.role === 'user' ? T.userAvatarBg : T.aiAvatarBg,
                      border: `1px solid ${msg.role === 'user' ? T.userAvatarBorder : T.aiAvatarBorder}`,
                      transition: 'all 0.3s',
                    }}
                  >
                    {msg.role === 'user'
                      ? <span className="text-xs font-semibold" style={{ color: T.userAvatarText }}>{userInitial}</span>
                      : <Bot size={14} style={{ color: T.aiAvatarIcon }} />
                    }
                  </div>

                  <div className={`max-w-[78%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {msg.role === 'user' ? (
                      <div
                        className="px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed"
                        style={{
                          background: T.userBubbleBg,
                          border: `1px solid ${T.userBubbleBorder}`,
                          color: T.userBubbleText,
                          transition: 'all 0.3s',
                        }}
                      >
                        {msg.content}
                      </div>
                    ) : (
                      <div
                        className="px-4 py-3.5 rounded-2xl rounded-bl-sm"
                        style={{
                          background: T.aiBubbleBg,
                          border: `1px solid ${T.aiBubbleBorder}`,
                          transition: 'all 0.3s',
                        }}
                      >
                        <MessageContent content={msg.content} isDark={isDark} />
                      </div>
                    )}
                    <span className="text-[10px] px-1" style={{ color: T.msgTimestamp }}>
                      {formatRelativeTime(msg.createdAt || Date.now())}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex-shrink-0 px-5 pb-5 pt-2 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div
              className="relative rounded-2xl transition-all duration-200"
              style={{
                background: T.inputWrapBg,
                border: `1px solid ${T.inputWrapBorder}`,
                boxShadow: T.inputWrapShadow,
                transition: 'all 0.3s',
              }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything…"
                rows={1}
                className="w-full bg-transparent text-sm resize-none outline-none px-5 pt-4 pb-2 leading-relaxed"
                style={{
                  maxHeight: 180,
                  cursor: 'text',
                  color: T.inputText,
                  transition: 'color 0.3s',
                }}
              />

              <div className="flex items-center justify-between px-3 pb-3 pt-1">
                <div className="flex items-center gap-0.5">
                  <button
                    className="p-2 rounded-xl transition-all"
                    style={{ color: T.iconBtn, cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.color = T.iconBtnHover; e.currentTarget.style.background = T.iconBtnHoverBg }}
                    onMouseLeave={e => { e.currentTarget.style.color = T.iconBtn; e.currentTarget.style.background = 'transparent' }}
                  >
                    <Paperclip size={14} />
                  </button>
                  <button
                    className="p-2 rounded-xl transition-all"
                    style={{ color: T.iconBtn, cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.color = T.iconBtnHover; e.currentTarget.style.background = T.iconBtnHoverBg }}
                    onMouseLeave={e => { e.currentTarget.style.color = T.iconBtn; e.currentTarget.style.background = 'transparent' }}
                  >
                    <Mic size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {input.length > 0 && (
                    <span className="text-[10px]" style={{ color: T.hintText }}>{input.length}</span>
                  )}
                  <motion.button
                    whileHover={{ scale: input.trim() && !isTyping ? 1.06 : 1 }}
                    whileTap={{ scale: input.trim() && !isTyping ? 0.94 : 1 }}
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200"
                    style={{
                      background: input.trim() && !isTyping ? T.sendActive : T.sendInactive,
                      color: input.trim() && !isTyping ? T.sendActiveFg : T.sendInactiveFg,
                      cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                      boxShadow: input.trim() && !isTyping && isDark ? '0 0 20px rgba(255,255,255,0.12)' : 'none',
                    }}
                  >
                    {isTyping
                      ? <Square size={12} style={{ color: T.iconBtnHover }} />
                      : <Send size={12} />
                    }
                  </motion.button>
                </div>
              </div>
            </div>

            <p className="text-center text-[10px] mt-2.5 tracking-wide" style={{ color: T.hintText }}>
              <span style={{ color: T.iconBtn }}>Enter</span> to send · <span style={{ color: T.iconBtn }}>Shift+Enter</span> for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard