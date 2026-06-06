'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Trash2 } from 'lucide-react';
import { SUGGESTED_PROMPTS } from '@/lib/constants';
import { getChatMessages, saveChatMessage, clearChatMessages, getEntriesLast7Days } from '@/lib/storage';
import { ChatMessage } from '@/lib/types';

export function WellnessCoach() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setMessages(getChatMessages()); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const buildMoodContext = () => {
    const recentEntries = getEntriesLast7Days();
    if (recentEntries.length === 0) return '';
    const summary = recentEntries.map((e) => `${e.date}: mood ${e.mood}/5${e.stressTriggers.length > 0 ? `, triggers: ${e.stressTriggers.join(', ')}` : ''}`).join('; ');
    return `\n\nRecent mood data (last 7 days): ${summary}`;
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    setError(null);
    const userMsg = saveChatMessage('user', content.trim());
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const moodContext = buildMoodContext();
      const response = await fetch('/api/wellness-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content.trim(), moodContext, history: messages.slice(-10).map((m) => ({ role: m.role, content: m.content })) }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to get response');
      }
      const data = await response.json();
      const assistantMsg = saveChatMessage('assistant', data.message);
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      const errorAssistant = saveChatMessage('assistant', "I'm having trouble connecting right now. Please try again in a moment. Remember, you're doing great — take a deep breath. 🤗");
      setMessages((prev) => [...prev, errorAssistant]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => { clearChatMessages(); setMessages([]); setError(null); };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)', maxHeight: '700px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} style={{ color: '#10B981' }} />
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1E293B' }}>AI Wellness Coach</span>
        </div>
        {messages.length > 0 && (
          <button onClick={handleClear} className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }} aria-label="Clear chat history">
            <Trash2 size={14} /> Clear
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem' }} role="log" aria-label="Chat messages" aria-live="polite">
        {messages.length === 0 && !isLoading && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
            <div style={{ fontSize: '3rem' }}>🤗</div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1E293B' }}>Hi! I&apos;m your wellness companion</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '400px' }}>I understand the pressure of exam prep. Share what&apos;s on your mind — I&apos;m here to listen and help.</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', maxWidth: '500px' }}>
              {SUGGESTED_PROMPTS.slice(0, 4).map((prompt, i) => (
                <button key={i} onClick={() => sendMessage(prompt)} className="tag" style={{ fontSize: '0.8rem' }}>{prompt}</button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`chat-message ${msg.role}`}>
              {msg.content}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="chat-message assistant" style={{ display: 'flex', gap: '0.375rem', padding: '1rem 1.25rem' }}>
            <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <p style={{ color: '#EF4444', fontSize: '0.8rem', padding: '0.5rem 0' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', alignItems: 'flex-end' }}>
        <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Share what's on your mind..." className="textarea" aria-label="Type your message" style={{ minHeight: '48px', maxHeight: '120px', resize: 'none', flex: 1 }} rows={1} />
        <button onClick={() => sendMessage(input)} disabled={!input.trim() || isLoading} className="btn-primary" aria-label="Send message" style={{ padding: '0.75rem', minWidth: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
