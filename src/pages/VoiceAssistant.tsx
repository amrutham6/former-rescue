import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Volume2, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStreamChat } from "@/hooks/useStreamChat";
import { useToast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

export default function VoiceAssistant() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const { user } = useAuth();
  const { language } = useLanguage();
  const { streamChat, isLoading } = useStreamChat();
  const { toast } = useToast();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load chat history
  useEffect(() => {
    if (!user) return;
    supabase
      .from("chat_messages")
      .select("role, content")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(50)
      .then(({ data }) => {
        if (data) setMessages(data as Msg[]);
      });
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || !user) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Save user message
    supabase.from("chat_messages").insert({ user_id: user.id, role: "user", content: text.trim(), language });

    let assistantContent = "";

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        language,
        onDelta: updateAssistant,
        onDone: () => {
          // Save assistant message
          supabase.from("chat_messages").insert({ user_id: user.id, role: "assistant", content: assistantContent, language });
        },
      });
    } catch (e: any) {
      toast({ variant: "destructive", title: "AI Error", description: e.message });
    }
  };

  const speak = (text: string) => {
    // Cancel any ongoing speech first
    speechSynthesis.cancel();
    
    const langMap: Record<string, string> = { en: "en-US", te: "te-IN", hi: "hi-IN", mr: "mr-IN", kn: "kn-IN" };
    const targetLang = langMap[language] || "en-US";

    const doSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLang;
      // Try to find a matching voice
      const voices = speechSynthesis.getVoices();
      const match = voices.find(v => v.lang === targetLang) || voices.find(v => v.lang.startsWith(targetLang.split("-")[0]));
      if (match) utterance.voice = match;
      utterance.rate = 0.9;
      utterance.onerror = (e) => console.error("TTS error:", e);
      speechSynthesis.speak(utterance);
    };

    // Voices may not be loaded yet
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = () => {
        doSpeak();
        speechSynthesis.onvoiceschanged = null;
      };
      // Fallback if event never fires
      setTimeout(doSpeak, 500);
    } else {
      doSpeak();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Mic className="w-7 h-7 text-secondary" /> Rescuer Voice AI
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Your AI farming assistant — ask anything in your language.</p>
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden flex flex-col" style={{ height: "calc(100vh - 240px)" }}>
        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Mic className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">Ask me anything about farming!</p>
              <p className="text-xs mt-1">Try: "What should I do with damaged paddy?"</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "gradient-hero text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                {msg.role === "assistant" && (
                  <button onClick={() => speak(msg.content)} className="flex items-center gap-1 mt-2 text-xs opacity-60 hover:opacity-100 transition-opacity">
                    <Volume2 className="w-3 h-3" /> Listen
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-3">
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
            <Input
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-muted flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="gradient-hero text-primary-foreground">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
