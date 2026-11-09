import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChatBuddyEngine } from '../data/chatEngine'
import { api } from '../services/api'
import { celebrate } from '../utils/celebrate'
import { TourTips } from './Tutorial'

/* The conversation logic lives in data/chatEngine.js (shared with the mobile app). */
export default function ChatBuddy() {
  const navigate = useNavigate()
  const {
    STEPS, step, messages, inputValue, setInputValue, isTyping, quickReplies,
    isOpen, setIsOpen, pulse, flowStep,
    handleOpen, handleSend, handleQuickReply, handleNavigate, triggerFlow, getPlaceholder, openItem,
  } = useChatBuddyEngine({ navigateTo: (route) => navigate(route), submitRequest: (req) => api.submitContactForm(req).then((r) => { celebrate(); return r }) })

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping, quickReplies])
  useEffect(() => { if (isOpen) inputRef.current?.focus() }, [step, isOpen, flowStep])

  // Services page opens a guided flow with: window.dispatchEvent(new CustomEvent('triggerChatFlow', { detail }))
  useEffect(() => {
    const handleTrigger = (e) => { const { flowId, initialAnswers } = e.detail || {}; triggerFlow(flowId, initialAnswers) }
    const handleItem = (e) => { const { kind, id } = e.detail || {}; if (kind && id) openItem(kind, id) }
    window.addEventListener('triggerChatFlow', handleTrigger)
    window.addEventListener('openChatItem', handleItem)
    return () => { window.removeEventListener('triggerChatFlow', handleTrigger); window.removeEventListener('openChatItem', handleItem) }
  })

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }

  /* ─── Render helpers ─── */
  const renderText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
      return part.split('\n').map((line, j) => <span key={`${i}-${j}`}>{j > 0 && <br />}{line}</span>)
    })
  }

  return (
    <>
      {/* FAB */}
      <button
        className={`chatbuddy-fab${pulse ? ' chatbuddy-fab--pulse' : ''}${isOpen ? ' chatbuddy-fab--hidden' : ''}`}
        onClick={handleOpen} aria-label="Open Chat Buddy" id="chatbuddy-fab"
      >
        <span className="chatbuddy-fab__icon">💬</span>
        <span className="chatbuddy-fab__label">Chat Buddy</span>
      </button>

      {/* Chat Window */}
      <div className={`chatbuddy${isOpen ? ' chatbuddy--open' : ''}`}>
        {/* Header */}
        <div className="chatbuddy__header">
          <div className="chatbuddy__header-info">
            <div className="chatbuddy__avatar"><span>🤝</span></div>
            <div>
              <h4 className="chatbuddy__title">i<span>N</span> Chat Buddy</h4>
              <p className="chatbuddy__status">● Online — Ready to help</p>
            </div>
          </div>
          <button className="chatbuddy__close" onClick={() => setIsOpen(false)} aria-label="Close chat">✕</button>
        </div>

        {/* Messages */}
        <div className="chatbuddy__messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chatbuddy__msg chatbuddy__msg--${msg.sender}`}>
              {msg.sender === 'bot' && <div className="chatbuddy__msg-avatar">🤝</div>}
              <div className={`chatbuddy__bubble chatbuddy__bubble--${msg.sender}`}>
                {msg.text && <p>{renderText(msg.text)}</p>}
                {msg.action && (
                  <button className="chatbuddy__action-btn" onClick={() => handleNavigate(msg.action.route)}>
                    {msg.action.label} →
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Quick-reply buttons */}
          {quickReplies.length > 0 && !isTyping && (
            <div className="chatbuddy__quick-replies">
              {quickReplies.map((opt, i) => (
                <button key={i} className={`chatbuddy__quick-btn${opt.primary ? ' chatbuddy__quick-btn--next' : ''}${opt.advise ? ' chatbuddy__quick-btn--advise' : ''}`} onClick={() => handleQuickReply(opt)}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {isTyping && (
            <div className="chatbuddy__msg chatbuddy__msg--bot">
              <div className="chatbuddy__msg-avatar">🤝</div>
              <div className="chatbuddy__bubble chatbuddy__bubble--bot chatbuddy__typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chatbuddy__input-area">
          <input
            ref={inputRef}
            type={step === STEPS.ASK_MOBILE ? 'tel' : 'text'}
            className="chatbuddy__input"
            placeholder={getPlaceholder()}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={step === STEPS.ASK_MOBILE ? 20 : 200}
          />
          <button className="chatbuddy__send" onClick={handleSend} disabled={!inputValue.trim()} aria-label="Send message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
      {/* Pointer (owner, 2 Nov 2026): buttons or typing — the first time the chat opens */}
      {isOpen && <TourTips tips={[{ id: 'web-chat-input', target: '.chatbuddy--open .chatbuddy__input-area', place: 'above' }]} />}
    </>
  )
}
