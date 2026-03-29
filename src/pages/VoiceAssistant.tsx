import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Volume2, Globe, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockConversation = [
  { role: "user", text: "What should I do with my damaged paddy?", lang: "en" },
  { role: "ai", text: "Based on current market conditions, I suggest selling to Green Foods Co. at ₹5/kg (8km away). Alternatively, you can send it to the Silage Bank for animal feed conversion. Would you like me to connect you with a buyer?" },
  { role: "user", text: "Tell me about carbon credits", lang: "en" },
  { role: "ai", text: "You currently have 156 carbon credits worth ₹7,800. You can earn more by composting, avoiding crop burning, or planting trees. Each eco-activity is verified and converted to credits that companies buy. Shall I log a new eco activity?" },
];

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Mic className="w-7 h-7 text-secondary" /> Rescuer Voice
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Speak in your language, get AI help instantly.</p>
      </div>

      {/* Chat History */}
      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {mockConversation.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "gradient-hero text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                {msg.role === "ai" && (
                  <button className="flex items-center gap-1 mt-2 text-xs text-muted-foreground hover:text-foreground">
                    <Volume2 className="w-3 h-3" /> Listen
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Voice Input */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 justify-center">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Globe className="w-4 h-4" /> English
            </Button>
            <button
              onClick={() => setListening(!listening)}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                listening
                  ? "gradient-gold shadow-glow-gold animate-pulse-glow"
                  : "gradient-hero shadow-glow-primary"
              }`}
            >
              {listening ? (
                <MicOff className="w-7 h-7 text-secondary-foreground" />
              ) : (
                <Mic className="w-7 h-7 text-primary-foreground" />
              )}
            </button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <MessageCircle className="w-4 h-4" /> Type
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-3">
            {listening ? "Listening... Speak now" : "Tap the mic to start speaking"}
          </p>
        </div>
      </div>
    </div>
  );
}
