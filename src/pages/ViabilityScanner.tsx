import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ScanLine, Upload, Camera, CheckCircle, AlertTriangle, XCircle, History, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface ScanResult {
  id: string;
  crop_type: string | null;
  image_url: string | null;
  usable_percentage: number | null;
  damage_level: string | null;
  ai_suggestion: string | null;
  ai_analysis: string | null;
  created_at: string;
}

function DamageIndicator({ usable }: { usable: number }) {
  const color = usable >= 70 ? "text-success" : usable >= 40 ? "text-warning" : "text-destructive";
  const bg = usable >= 70 ? "bg-success/10" : usable >= 40 ? "bg-warning/10" : "bg-destructive/10";
  const Icon = usable >= 70 ? CheckCircle : usable >= 40 ? AlertTriangle : XCircle;
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${bg} ${color}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{usable}% Usable</span>
    </div>
  );
}

export default function ViabilityScanner() {
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [scanning, setScanning] = useState(false);
  const [cropType, setCropType] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();

  const fetchHistory = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("viability_scans")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setHistory(data);
  };

  useEffect(() => { fetchHistory(); }, [user]);

  const handleScan = async (file?: File) => {
    if (!user) return;
    setScanning(true);

    try {
      let imageBase64: string | undefined;
      let imageUrl: string | null = null;

      if (file) {
        // Upload image
        const ext = file.name.split('.').pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("crop-images").upload(path, file);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("crop-images").getPublicUrl(path);
        imageUrl = urlData.publicUrl;

        // Convert to base64 for AI
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      // Call AI analysis
      const { data, error } = await supabase.functions.invoke("analyze-crop", {
        body: { imageBase64, cropType: cropType || "unknown", language },
      });

      if (error) throw error;

      // Save to database
      const { error: insertErr } = await supabase.from("viability_scans").insert({
        user_id: user.id,
        crop_type: cropType || null,
        image_url: imageUrl,
        usable_percentage: data.usable_percentage,
        damage_level: data.damage_level,
        ai_suggestion: data.suggestion,
        ai_analysis: data.analysis,
      });

      if (insertErr) throw insertErr;
      toast({ title: "Scan Complete!", description: `${data.usable_percentage}% usable - ${data.damage_level} damage` });
      fetchHistory();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Scan Failed", description: e.message });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <ScanLine className="w-7 h-7 text-info" /> Viability Scanner
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Upload crop images for AI-powered health analysis.</p>
      </div>

      {/* Scanner */}
      <div className="bg-card rounded-2xl p-8 shadow-card border border-border text-center">
        <div className="w-20 h-20 rounded-2xl bg-info/10 flex items-center justify-center mx-auto mb-4">
          {scanning ? <Loader2 className="w-9 h-9 text-info animate-spin" /> : <Camera className="w-9 h-9 text-info" />}
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground">
          {scanning ? "Analyzing..." : "Scan Your Crop"}
        </h3>
        <p className="text-muted-foreground text-sm mt-1 max-w-md mx-auto">
          Upload an image and our AI will analyze the condition and suggest the best action.
        </p>
        <Input
          placeholder="Crop type (e.g., Paddy, Ragi, Wheat)"
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
          className="mt-4 max-w-sm mx-auto bg-muted"
        />
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleScan(e.target.files[0]); }} />
        <div className="flex gap-3 justify-center mt-4">
          <Button onClick={() => fileRef.current?.click()} disabled={scanning} className="bg-info text-info-foreground gap-2">
            <Upload className="w-4 h-4" /> Upload Image
          </Button>
          <Button onClick={() => handleScan()} disabled={scanning} variant="outline" className="gap-2">
            <ScanLine className="w-4 h-4" /> Quick Scan (No Image)
          </Button>
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-muted-foreground" /> Scan History
        </h2>
        {history.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No scans yet. Upload a crop image to get started.</p>
        ) : (
          <div className="space-y-3">
            {history.map((h, i) => (
              <motion.div key={h.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl p-4 shadow-card border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {h.image_url && <img src={h.image_url} alt="Crop" className="w-12 h-12 rounded-lg object-cover" />}
                    <div>
                      <p className="font-display font-semibold text-foreground">{h.crop_type || "Unknown crop"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{new Date(h.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {h.usable_percentage != null && <DamageIndicator usable={h.usable_percentage} />}
                </div>
                {h.ai_suggestion && (
                  <div className="mt-3 text-sm">
                    <span className="text-muted-foreground">Suggestion: </span>
                    <span className="text-foreground font-medium">{h.ai_suggestion}</span>
                  </div>
                )}
                {h.ai_analysis && <p className="mt-2 text-xs text-muted-foreground">{h.ai_analysis}</p>}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
