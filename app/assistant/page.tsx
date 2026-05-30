"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Brain, GraduationCap, Briefcase, FileText, RefreshCw, User, ShieldAlert } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const PRESETS = [
  { icon: GraduationCap, label: "Career roadmap advice", query: "Give me a step-by-step career roadmap for entering cloud engineering as a fresher." },
  { icon: FileText, label: "Resume improvement tips", query: "What are the most critical keywords and project sections to highlight on a Software Engineer fresher resume?" },
  { icon: Briefcase, label: "Interview prep guidelines", query: "Can you provide common behavioral and coding interview preparation strategies for large IT service companies?" },
  { icon: Brain, label: "Skill recommendations", query: "What skills should I learn to become highly competitive for modern remote startup jobs?" }
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Restore client-side conversation history cache if present
  useEffect(() => {
    const cached = localStorage.getItem("careertrust_chat_history");
    if (cached) {
      try {
        setMessages(JSON.parse(cached));
      } catch {
        // Fallback
      }
    } else {
      setMessages([
        {
          role: "assistant",
          content: "Hello! I am your verified **CareerTrust AI Assistant**, powered by Llama 3.1. I can provide official career guidance, resume suggestions, interview strategies, and custom skills roadmaps. How can I help you today?"
        }
      ]);
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem("careertrust_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom on updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setError(null);
    const updatedMessages: Message[] = [...messages, { role: "user", content: textToSend }];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("You have reached the rate limit. Please wait 1 minute before checking again.");
        }
        throw new Error("Failed to get response from AI. Please try again.");
      }

      const data = (await response.json()) as { reply?: string; error?: string };
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply! }]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem("careertrust_chat_history");
    setMessages([
      {
        role: "assistant",
        content: "Hello! I am your verified **CareerTrust AI Assistant**, powered by Llama 3.1. I can provide official career guidance, resume suggestions, interview strategies, and custom skills roadmaps. How can I help you today?"
      }
    ]);
    setError(null);
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header Info */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
            Llama 3.1 Guidance
          </p>
          <h1 className="mt-2 text-4xl font-black">AI Career Assistant</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Get instant guidance on roadmaps, skills, resumes, and interview preparation.
          </p>
        </div>
        <button
          onClick={handleClear}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-white px-3.5 text-xs font-bold text-slate-700 shadow-card transition dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 self-start sm:self-center"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reset Chat Log
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Chat box container */}
        <div className="glass flex flex-col h-[650px] rounded-xl overflow-hidden shadow-glow">
          {/* Active messages board */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink text-white dark:bg-white dark:text-ink">
                    <Sparkles className="h-4 w-4" />
                  </span>
                )}
                
                <div
                  className={`rounded-xl p-4 text-sm leading-6 max-w-[82%] ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white font-semibold rounded-tr-none shadow-md"
                      : "bg-white dark:bg-slate-950/80 rounded-tl-none border border-slate-100 dark:border-slate-800/60 shadow-soft"
                  }`}
                >
                  <p className="whitespace-pre-line font-medium">{msg.content}</p>
                </div>

                {msg.role === "user" && (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200">
                    <User className="h-4 w-4" />
                  </span>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3.5 justify-start">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink text-white dark:bg-white dark:text-ink animate-spin">
                  <RefreshCw className="h-4 w-4" />
                </span>
                <div className="rounded-xl p-4 text-sm bg-white dark:bg-slate-950/80 rounded-tl-none border border-slate-100 dark:border-slate-800/60 shadow-soft">
                  <p className="font-semibold text-slate-500 animate-pulse">Llama is analyzing your request...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex gap-3.5 justify-center">
                <div className="rounded-lg bg-rose-100 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 p-3.5 text-xs font-semibold flex items-center gap-2 border border-rose-200 dark:border-rose-900/40">
                  <ShieldAlert className="h-4 w-4 text-rose-600" />
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Form input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="border-t border-slate-100 dark:border-slate-800/80 bg-white/70 backdrop-blur-xl dark:bg-slate-950/45 p-4 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about career roadmap, resumes, or interview prep..."
              className="flex-1 h-12 px-4 text-sm font-semibold rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-600 dark:focus:border-emerald-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-card transition hover:bg-emerald-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Preset prompts board */}
        <aside className="space-y-4">
          <div className="glass rounded-xl p-5">
            <h3 className="text-base font-black flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" /> Quick guidance presets
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Click any verified career prompt preset below to ask the AI assistant immediately:
            </p>
            <div className="mt-4 grid gap-3">
              {PRESETS.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(preset.query)}
                  disabled={isLoading}
                  className="w-full text-left p-4 rounded-lg bg-white dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/40 hover:border-emerald-500/45 hover:bg-emerald-500/5 transition flex items-start gap-3 shadow-soft"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    <preset.icon className="h-4 w-4 text-emerald-600" />
                  </span>
                  <div>
                    <h4 className="text-xs font-black">{preset.label}</h4>
                    <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1">{preset.query}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-emerald-700/15 border border-emerald-500/20 p-5 text-xs leading-6 text-slate-700 dark:text-slate-300">
            <h4 className="font-black text-ink dark:text-white flex items-center gap-2 mb-2">
              <GraduationCap className="h-4 w-4 text-emerald-600" /> Anti-Placement Scam Promise
            </h4>
            This assistant matches opportunities based entirely on official recruitment pages. We never recommend consultancies, direct payments for selection, or placement fee frameworks.
          </div>
        </aside>
      </div>
    </section>
  );
}
