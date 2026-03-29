import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FileCheck, Upload, Camera, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface Claim {
  id: string;
  claim_number: string;
  crop_type: string;
  status: string;
  estimated_loss: number;
  created_at: string;
}

export default function ClaimRocket() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [dob, setDob] = useState("");
  const [cropType, setCropType] = useState("");
  const [loss, setLoss] = useState("");
  const [loading, setLoading] = useState(false);
  const [damageImage, setDamageImage] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchClaims = async () => {
    if (!user) return;
    const { data } = await supabase.from("insurance_claims").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setClaims(data);
  };

  useEffect(() => { fetchClaims(); }, [user]);

  const submitClaim = async () => {
    if (!user || !fullName || !phone || !aadhar || !dob || !cropType || !loss) {
      toast({ variant: "destructive", title: "Error", description: "Please fill all fields" });
      return;
    }
    setLoading(true);

    try {
      let imageUrl: string | null = null;
      if (damageImage) {
        const ext = damageImage.name.split('.').pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        await supabase.storage.from("claim-images").upload(path, damageImage);
        const { data } = supabase.storage.from("claim-images").getPublicUrl(path);
        imageUrl = data.publicUrl;
      }

      const claimNumber = `CR-${Date.now().toString(36).toUpperCase()}`;
      const { error } = await supabase.from("insurance_claims").insert({
        user_id: user.id,
        claim_number: claimNumber,
        full_name: fullName,
        phone,
        aadhar_number: aadhar,
        date_of_birth: dob,
        crop_type: cropType,
        estimated_loss: Number(loss),
        damage_image_url: imageUrl,
      });

      if (error) throw error;
      toast({ title: "Claim Submitted!", description: `Claim ${claimNumber} filed successfully.` });
      setFullName(""); setPhone(""); setAadhar(""); setDob(""); setCropType(""); setLoss(""); setDamageImage(null);
      fetchClaims();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <FileCheck className="w-7 h-7 text-warning" /> Claim Rocket
        </h1>
        <p className="text-muted-foreground text-sm mt-1">AI-powered insurance claim filing.</p>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h3 className="font-display font-semibold text-foreground mb-4">File New Claim</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-muted" />
          <Input placeholder="Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-muted" />
          <Input placeholder="Aadhar Number" value={aadhar} onChange={(e) => setAadhar(e.target.value)} className="bg-muted" />
          <Input placeholder="Date of Birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="bg-muted" />
          <Input placeholder="Crop Type" value={cropType} onChange={(e) => setCropType(e.target.value)} className="bg-muted" />
          <Input placeholder="Estimated Loss (₹)" type="number" value={loss} onChange={(e) => setLoss(e.target.value)} className="bg-muted" />
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setDamageImage(e.target.files[0]); }} />
        <div className="flex gap-3 mt-4">
          <Button onClick={() => fileRef.current?.click()} variant="outline" className="gap-2">
            <Camera className="w-4 h-4" /> {damageImage ? damageImage.name : "Upload Damage Photo"}
          </Button>
        </div>
        <Button onClick={submitClaim} disabled={loading} className="mt-4 gradient-hero text-primary-foreground shadow-glow-primary w-full sm:w-auto">
          {loading ? "Submitting..." : "Submit Claim"}
        </Button>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">Your Claims</h2>
        {claims.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No claims filed yet.</p>
        ) : (
          <div className="space-y-3">
            {claims.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl p-4 shadow-card border border-border flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  c.status === "approved" ? "bg-success/10" : c.status === "processing" ? "bg-warning/10" : c.status === "rejected" ? "bg-destructive/10" : "bg-info/10"
                }`}>
                  {c.status === "approved" ? <CheckCircle className="w-5 h-5 text-success" />
                    : c.status === "processing" ? <Clock className="w-5 h-5 text-warning" />
                    : <AlertCircle className="w-5 h-5 text-info" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{c.claim_number} • {c.crop_type}</p>
                  <p className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-foreground">₹{c.estimated_loss.toLocaleString()}</p>
                  <p className={`text-xs font-medium capitalize ${
                    c.status === "approved" ? "text-success" : c.status === "processing" ? "text-warning" : c.status === "rejected" ? "text-destructive" : "text-info"
                  }`}>{c.status}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
