import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Loader2, MessageSquare, Shield, Heart, Zap } from 'lucide-react';
import { ChatMessage } from '../types';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      text: "Hi! I'm your Yulife AI. How can I help you with your insurance or wellbeing today? 💙",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    { text: "Explain my life policy", icon: Heart },
    { text: "How do I make a claim?", icon: Shield },
    { text: "How to earn more points?", icon: Zap }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/.netlify/functions/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.text || "I'm sorry, I couldn't process that. Let's try again! 💙",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yu-lime flex flex-col pb-32">
      <header className="p-6 pt-12 bg-white border-b border-gray-100 flex items-center gap-4 shadow-sm">
        <div className="bg-yu-pink p-3 rounded-2xl shadow-lg shadow-yu-pink/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">AI Assistant</h1>
          <p className="text-xs text-teal-500 font-black uppercase tracking-widest">Always active</p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            key={msg.id}
            className={cn(
              "flex flex-col max-w-[90%]",
              msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >
            <div
              className={cn(
                "p-5 rounded-[32px] text-sm leading-relaxed shadow-sm font-bold",
                msg.role === 'user' 
                  ? "bg-yu-pink text-white rounded-tr-none" 
                  : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
              )}
            >
              <Markdown>{msg.text}</Markdown>
            </div>
            <span className="text-[10px] font-black text-gray-400 mt-2 px-2 uppercase tracking-widest">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3 text-yu-pink bg-white p-5 rounded-[32px] w-fit shadow-sm border border-gray-100">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-black uppercase tracking-widest">Thinking...</span>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {suggestedPrompts.map((prompt, i) => {
            const Icon = prompt.icon;
            return (
              <button
                key={i}
                onClick={() => handleSend(prompt.text)}
                className="flex-shrink-0 flex items-center gap-2 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 hover:bg-yu-pink/5 hover:border-yu-pink/20 transition-all"
              >
                <Icon className="w-4 h-4 text-yu-pink" />
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{prompt.text}</span>
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            className="flex-1 bg-gray-50 border border-gray-100 rounded-[32px] px-6 py-5 text-sm focus:outline-none focus:ring-4 focus:ring-yu-pink/10 transition-all font-bold"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading}
            className="bg-yu-pink text-white p-5 rounded-[32px] disabled:opacity-50 hover:bg-yu-pink/90 transition-colors shadow-xl shadow-yu-pink/20"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
