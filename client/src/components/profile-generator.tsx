import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ImageType, UserStatus } from "@/lib/types";

export default function ProfileGenerator() {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [serverName, setServerName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatus>("free");
  const [imageType, setImageType] = useState<ImageType>("profile");
  const [extraGlow, setExtraGlow] = useState(false);
  const [scanEffect, setScanEffect] = useState(false);
  const [matrixRain, setMatrixRain] = useState(false);
  const [circuitBg, setCircuitBg] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const isOwner = userStatus === "owner";
  const isPremium = userStatus === "premium" || isOwner;

  const avatarPreview = useMemo(() => {
    if (!avatar) return null;
    return URL.createObjectURL(avatar);
  }, [avatar]);

  const generateMutation = useMutation({
    mutationFn: async () => {
      if (!username) {
        throw new Error("Username is required");
      }
      
      if (!avatar) {
        throw new Error("Avatar image is required");
      }

      const formData = new FormData();
      formData.append("username", username);
      formData.append("avatar", avatar);
      formData.append("isPremium", isPremium.toString());
      formData.append("isOwner", isOwner.toString());
      formData.append("serverName", serverName || "CyberServer");
      formData.append("imageType", imageType);
      formData.append("extraGlow", extraGlow.toString());
      formData.append("scanEffect", scanEffect.toString());
      formData.append("matrixRain", matrixRain.toString());
      formData.append("circuitBg", circuitBg.toString());

      const response = await fetch(`/api/generate/${imageType}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to generate image");
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    },
    onSuccess: (data) => {
      setGeneratedImage(data);
      toast({
        title: "Image Generated",
        description: "Your cyber image has been successfully created!",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateMutation.mutate();
  };

  return (
    <div className="mt-10 mb-16">
      <Card className="w-full bg-cyber-darker/80 border border-cyber-blue/30 rounded-lg overflow-hidden relative">
        <div className="scan-line"></div>
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        
        <h2 className="text-2xl font-orbitron text-cyber-blue p-6 relative z-10">CANVAS GENERATOR</h2>
        
        <CardContent className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-orbitron text-cyber-blue/80">USERNAME</Label>
                  <Input 
                    type="text" 
                    className="bg-cyber-black/70 border border-cyber-blue/40 text-cyber-blue font-rajdhani focus:border-cyber-blue focus:outline-none"
                    placeholder="ENTER USERNAME"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-orbitron text-cyber-blue/80">SERVER NAME</Label>
                  <Input 
                    type="text"
                    className="bg-cyber-black/70 border border-cyber-blue/40 text-cyber-blue font-rajdhani focus:border-cyber-blue focus:outline-none"
                    placeholder="ENTER SERVER NAME"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-orbitron text-cyber-blue/80">AVATAR</Label>
                  <div className="flex items-center gap-4">
                    <Label 
                      htmlFor="avatar-upload" 
                      className="flex-1 bg-cyber-black/70 border border-cyber-blue/40 text-cyber-blue p-2 rounded font-rajdhani cursor-pointer hover:bg-cyber-blue/10 transition-colors text-center"
                    >
                      <span className="block truncate">
                        {avatar ? avatar.name : "SELECT FILE"}
                      </span>
                      <Input 
                        id="avatar-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                      />
                    </Label>
                    
                    {avatarPreview && (
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-cyber-blue">
                        <img 
                          src={avatarPreview} 
                          alt="Avatar preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-orbitron text-cyber-blue/80">USER STATUS</Label>
                  <RadioGroup 
                    value={userStatus} 
                    onValueChange={(value) => setUserStatus(value as UserStatus)}
                    className="grid grid-cols-3 gap-2"
                  >
                    <Label 
                      className={`flex items-center justify-center bg-cyber-black/70 border border-cyber-blue/40 text-cyber-blue p-2 rounded font-rajdhani cursor-pointer hover:bg-cyber-blue/10 transition-colors ${userStatus === 'free' ? 'bg-cyber-blue/20' : ''}`}
                    >
                      <RadioGroupItem value="free" className="sr-only" />
                      <span>FREE</span>
                    </Label>
                    <Label 
                      className={`flex items-center justify-center bg-cyber-black/70 border border-cyber-gold/40 text-cyber-gold p-2 rounded font-rajdhani cursor-pointer hover:bg-cyber-gold/10 transition-colors ${userStatus === 'premium' ? 'bg-cyber-gold/20' : ''}`}
                    >
                      <RadioGroupItem value="premium" className="sr-only" />
                      <span>PREMIUM</span>
                    </Label>
                    <Label 
                      className={`flex items-center justify-center bg-cyber-black/70 border border-cyber-gold/40 text-cyber-gold p-2 rounded font-rajdhani cursor-pointer hover:bg-cyber-gold/10 transition-colors ${userStatus === 'owner' ? 'bg-cyber-gold/20' : ''}`}
                    >
                      <RadioGroupItem value="owner" className="sr-only" />
                      <span>OWNER</span>
                    </Label>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-orbitron text-cyber-blue/80">GENERATOR TYPE</Label>
                  <RadioGroup 
                    value={imageType} 
                    onValueChange={(value) => setImageType(value as ImageType)}
                    className="grid grid-cols-3 gap-2"
                  >
                    <Label 
                      className={`flex items-center justify-center bg-cyber-black/70 border border-cyber-blue/40 text-cyber-blue p-2 rounded font-rajdhani cursor-pointer hover:bg-cyber-blue/10 transition-colors ${imageType === 'profile' ? 'bg-cyber-blue/20' : ''}`}
                    >
                      <RadioGroupItem value="profile" className="sr-only" />
                      <span>PROFILE</span>
                    </Label>
                    <Label 
                      className={`flex items-center justify-center bg-cyber-black/70 border border-cyber-green/40 text-cyber-green p-2 rounded font-rajdhani cursor-pointer hover:bg-cyber-green/10 transition-colors ${imageType === 'welcome' ? 'bg-cyber-green/20' : ''}`}
                    >
                      <RadioGroupItem value="welcome" className="sr-only" />
                      <span>WELCOME</span>
                    </Label>
                    <Label 
                      className={`flex items-center justify-center bg-cyber-black/70 border border-cyber-pink/40 text-cyber-pink p-2 rounded font-rajdhani cursor-pointer hover:bg-cyber-pink/10 transition-colors ${imageType === 'goodbye' ? 'bg-cyber-pink/20' : ''}`}
                    >
                      <RadioGroupItem value="goodbye" className="sr-only" />
                      <span>GOODBYE</span>
                    </Label>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-orbitron text-cyber-blue/80">CUSTOM EFFECTS</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Label className="flex items-center bg-cyber-black/70 border border-cyber-blue/40 text-cyber-blue p-2 rounded font-rajdhani cursor-pointer hover:bg-cyber-blue/10 transition-colors">
                      <Checkbox 
                        checked={extraGlow} 
                        onCheckedChange={(checked) => setExtraGlow(checked === true)}
                        className="mr-2"
                      />
                      <span>EXTRA GLOW</span>
                    </Label>
                    <Label className="flex items-center bg-cyber-black/70 border border-cyber-blue/40 text-cyber-blue p-2 rounded font-rajdhani cursor-pointer hover:bg-cyber-blue/10 transition-colors">
                      <Checkbox 
                        checked={scanEffect} 
                        onCheckedChange={(checked) => setScanEffect(checked === true)}
                        className="mr-2"
                      />
                      <span>SCAN EFFECT</span>
                    </Label>
                    <Label className="flex items-center bg-cyber-black/70 border border-cyber-blue/40 text-cyber-blue p-2 rounded font-rajdhani cursor-pointer hover:bg-cyber-blue/10 transition-colors">
                      <Checkbox 
                        checked={matrixRain} 
                        onCheckedChange={(checked) => setMatrixRain(checked === true)}
                        className="mr-2"
                      />
                      <span>MATRIX RAIN</span>
                    </Label>
                    <Label className="flex items-center bg-cyber-black/70 border border-cyber-blue/40 text-cyber-blue p-2 rounded font-rajdhani cursor-pointer hover:bg-cyber-blue/10 transition-colors">
                      <Checkbox 
                        checked={circuitBg} 
                        onCheckedChange={(checked) => setCircuitBg(checked === true)}
                        className="mr-2"
                      />
                      <span>CIRCUIT BG</span>
                    </Label>
                  </div>
                </div>
                
                <div className="pt-6">
                  <Button 
                    type="submit"
                    disabled={generateMutation.isPending || !username || !avatar}
                    className="w-full bg-gradient-to-r from-cyber-blue to-cyber-green border border-cyber-blue/50 text-black font-orbitron py-6 relative overflow-hidden hover:from-cyber-green hover:to-cyber-blue transition-all duration-300"
                  >
                    {generateMutation.isPending ? "GENERATING..." : "GENERATE IMAGE"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
          
          {generatedImage && (
            <div className="mt-8 pt-6 border-t border-cyber-blue/30">
              <h3 className="text-xl font-orbitron text-cyber-blue mb-4">GENERATED IMAGE</h3>
              <div className="flex justify-center">
                <div className="relative">
                  <img 
                    src={generatedImage}
                    alt="Generated cyber profile" 
                    className="max-w-full rounded-lg border border-cyber-blue/50"
                  />
                  <a 
                    href={generatedImage} 
                    download={`cyber-${imageType}-${username}.png`}
                    className="absolute bottom-4 right-4 bg-cyber-black/80 border border-cyber-blue text-cyber-blue px-4 py-2 rounded font-orbitron text-sm hover:bg-cyber-blue/20 transition-colors"
                  >
                    DOWNLOAD
                  </a>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
