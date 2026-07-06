import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, X, Send, Trash2, ArrowRight, User, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const DESIGN_PROMPTS = [
  "How to select correct sofa dimensions?",
  "What styles pair nicely with Italian Travertine?",
  "Explain the 60-30-10 room color balance rule",
  "How to design lighting with Aurelia Chandelier?"
];

export default function DesignerChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewResponse, setHasNewResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from sessionStorage
  useEffect(() => {
    const backup = sessionStorage.getItem('hossana_designer_chats');
    if (backup) {
      setMessages(JSON.parse(backup));
    } else {
      // Default welcoming message
      const defaultMsg: Message = {
        id: 'welcome',
        role: 'assistant',
        text: `Salutations. I am your concierge **AI Interior Designer** at Hossana Furniture. 

How may I assist you with composed space layout, room scale, furniture sizing, or selecting the proper material dialogue for your residence?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([defaultMsg]);
    }
  }, []);

  // Save chat history to sessionStorage
  const saveChats = (newList: Message[]) => {
    setMessages(newList);
    sessionStorage.setItem('hossana_designer_chats', JSON.stringify(newList));
  };

  // Scroll to bottom on updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...messages, userMsg];
    saveChats(updated);
    setInputVal('');
    setIsLoading(true);

    try {
      // Package conversation history (excluding introductory message to spare token bounds)
      const formattedHistory = updated
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role,
          text: m.text
        }));

      const res = await fetch('/api/designer-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: formattedHistory.slice(-10) // Limit to last 10 exchanges for balance
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Server returned error status');
      }

      const data = await res.json();

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.text || 'My apologies, I could not synthesize a recommendation at this moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      saveChats([...updated, assistantMsg]);
      if (!isOpen) {
        setHasNewResponse(true);
      }
    } catch (err: any) {
      console.error(err);
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `**Concierge Alert:** Under extreme load, our server is struggling to coordinate our design blueprints. Please double check that \`GEMINI_API_KEY\` is declared under Settings > Secrets. Let's retry!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      saveChats([...updated, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChatHistory = () => {
    if (confirm("Are you sure you want to restore the design console? Your current dialogue will be erased.")) {
      const defaultMsg: Message = {
        id: 'welcome',
        role: 'assistant',
        text: `Salutations. I am your concierge **AI Interior Designer** at Hossana Furniture. 

How may I assist you with composed space layout, room scale, furniture sizing, or selecting the proper material dialogue for your residence?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      saveChats([defaultMsg]);
    }
  };

  const handleOpenToggle = () => {
    setIsOpen(!isOpen);
    setHasNewResponse(false);
  };

  // Safe inner custom markdown renderer to keep formatting sleek and matching our styling guidelines
  const parseMarkdownHtml = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Simple lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <ul key={idx} className="list-disc pl-4 my-1 space-y-1">
            <li className="text-[11px] leading-relaxed text-gray-300 font-sans font-light">
              {parseInlineMarkdown(line.substring(2))}
            </li>
          </ul>
        );
      }
      
      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        return (
          <ol key={idx} className="list-decimal pl-4 my-1 space-y-1">
            <li className="text-[11px] leading-relaxed text-gray-300 font-sans font-light">
              {parseInlineMarkdown(line.replace(/^\d+\.\s/, ''))}
            </li>
          </ol>
        );
      }

      // Headers
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-xs font-serif font-black text-amber-400 mt-3 mb-1 uppercase tracking-widest leading-normal">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-sm font-serif font-black text-amber-400 mt-4 mb-1.5 uppercase tracking-wider leading-normal">
            {line.replace('## ', '')}
          </h3>
        );
      }

      // Empty space lines
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Normal paragraph
      return (
        <p key={idx} className="text-[11px] leading-relaxed text-gray-300 font-sans font-light mb-2">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  const parseInlineMarkdown = (text: string) => {
    const segments = [];
    let cur = '';
    let pos = 0;

    while (pos < text.length) {
      if (text.startsWith('**', pos)) {
        if (cur) {
          segments.push(<span key={pos + '_txt'}>{cur}</span>);
          cur = '';
        }
        const nextBold = text.indexOf('**', pos + 2);
        if (nextBold !== -1) {
          segments.push(
            <strong key={pos + '_b'} className="font-bold text-amber-300">
              {text.substring(pos + 2, nextBold)}
            </strong>
          );
          pos = nextBold + 2;
        } else {
          cur += '**';
          pos += 2;
        }
      } else if (text.startsWith('`', pos)) {
        if (cur) {
          segments.push(<span key={pos + '_txt'}>{cur}</span>);
          cur = '';
        }
        const nextCode = text.indexOf('`', pos + 1);
        if (nextCode !== -1) {
          segments.push(
            <code key={pos + '_c'} className="bg-white/5 border border-white/10 px-1 py-0.5 rounded text-[10px] text-amber-100 font-mono">
              {text.substring(pos + 1, nextCode)}
            </code>
          );
          pos = nextCode + 1;
        } else {
          cur += '`';
          pos += 1;
        }
      } else {
        cur += text[pos];
        pos++;
      }
    }

    if (cur) {
      segments.push(<span key={pos + '_f'}>{cur}</span>);
    }

    return segments.length > 0 ? segments : text;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[95] flex flex-col items-end">
      {/* Expanded Dialog Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-[calc(100vw-2.5rem)] xs:w-[380px] h-[520px] bg-[#0c0d0e]/95 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col mb-4 relative"
            id="designer-chat-dialog"
          >
            {/* Top architectural luxury background blooms inside the chat container for visual depth */}
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-amber-500/10 rounded-full blur-[600px] pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#3e89a3]/10 rounded-full blur-[600px] pointer-events-none z-0" />

            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/30 relative z-10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-[#c71f2c] p-[1.5px] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  <div className="w-full h-full rounded-full bg-[#0a0a0b] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-[0.2em] font-black text-amber-400 font-serif">Hossana Studio</h4>
                  <p className="text-[9px] text-gray-400 tracking-wider">Atelier Atelier Concierge</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 animate-fade-in">
                {messages.length > 1 && (
                  <button
                    onClick={clearChatHistory}
                    title="Clear spatial consultation"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={handleOpenToggle}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Content Display (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 custom-scrollbar select-text">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={msg.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    {/* Bot avatar profile */}
                    {!isUser && (
                      <div className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                      </div>
                    )}
                    
                    <div className="max-w-[85%] flex flex-col">
                      <div
                        className={`p-3.5 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                          isUser
                            ? 'bg-amber-400 text-black font-semibold rounded-tr-none'
                            : 'bg-white/[0.04] border border-white/5 text-gray-200 rounded-tl-none font-light'
                        }`}
                      >
                        {isUser ? msg.text : parseMarkdownHtml(msg.text)}
                      </div>
                      <span className={`text-[8px] text-gray-500 mt-1 uppercase tracking-widest ${isUser ? 'text-right mr-1' : 'ml-1'}`}>
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* User profile bullet */}
                    {isUser && (
                      <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <User className="w-3 h-3 text-gray-400" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Suggestions helper block if it's start of interaction */}
              {messages.length === 1 && (
                <div className="pt-3 space-y-2 select-none">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[9px] uppercase tracking-widest font-black">Curated Topics</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {DESIGN_PROMPTS.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-left w-full p-2.5 bg-white/[0.02] hover:bg-amber-400/10 hover:text-amber-300 border border-white/5 hover:border-amber-400/30 rounded-xl text-[10px] text-gray-300 transition-all font-light flex items-center justify-between group cursor-pointer"
                      >
                        <span>{prompt}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 text-amber-400 transform translate-x-[-4px] group-hover:translate-x-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bot Loading Bubble */}
              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0 animate-pulse">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </div>
                  <div className="bg-white/[0.04] border border-white/5 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest ml-1 animate-pulse">Consulting Curator</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputVal);
              }}
              className="p-3 bg-black/40 border-t border-white/5 flex gap-2 relative z-10 shrink-0 select-none"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about dimensions, pairing stone with oak..."
                disabled={isLoading}
                className="flex-1 bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-xl px-3.5 py-2 text-[11px] text-white focus:outline-none focus:border-amber-400 transition-colors placeholder:text-gray-600 disabled:opacity-50"
              />
              <Button
                type="submit"
                disabled={!inputVal.trim() || isLoading}
                className="bg-amber-400 hover:bg-amber-500 text-black w-8 h-8 rounded-xl flex items-center justify-center p-0 flex-shrink-0 border-none select-none"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Sphere Trigger */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpenToggle}
        className={`relative w-14 h-14 rounded-full bg-gradient-to-tr from-stone-900 via-neutral-900 to-amber-950 flex items-center justify-center text-amber-400 cursor-pointer shadow-[0_10px_35px_rgba(0,0,0,0.5)] border-2 transition-all group select-none ${
          isOpen ? 'border-[#c71f2c] rotate-90' : 'border-amber-400/50 hover:border-amber-400'
        }`}
        title="Consult AI Interior Designer"
        id="designer-chat-launcher"
      >
        {/* Subtle Halo Pulsing Ring when there is unread text or simply as elegant luxury design aura */}
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full border border-amber-400/20 animate-ping duration-[3000ms] pointer-events-none" />
        )}

        {hasNewResponse && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-black rounded-full animate-pulse" />
        )}

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5.5 h-5.5 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <MessageSquare className="w-5.5 h-5.5 group-hover:scale-105 transition-transform" />
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-300 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
