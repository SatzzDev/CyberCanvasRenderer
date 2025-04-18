import { FaTerminal, FaCrown } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import ProfileGenerator from "@/components/profile-generator";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cyber-dark text-white font-rajdhani pb-10">
      <div className="container mx-auto py-10 px-4 md:px-0">
        <header className="flex flex-col items-center justify-center mb-10">
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-cyber-green animate-pulse-slow">
              CYBER PROFILE GENERATOR
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/20 to-cyber-green/20 blur-xl -z-10"></div>
          </h1>
          <div className="w-40 h-1 bg-gradient-to-r from-cyber-blue to-cyber-green mt-2"></div>
        </header>
        
        {/* Profile Card Examples */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Free Profile Card */}
          <Card className="cyber-profile-card relative bg-cyber-darker/80 border border-cyber-blue/30 rounded-lg overflow-hidden">
            <div className="scan-line"></div>
            <div className="absolute inset-0 cyber-grid opacity-20"></div>
            
            <CardContent className="p-6 relative">
              <div className="absolute top-0 left-0 w-full h-full circuit-bg opacity-20"></div>
              
              <div className="flex flex-col items-center relative z-10">
                <div className="hex-border mb-6 w-32 h-32 relative">
                  <div className="hex-avatar w-32 h-32 bg-cyber-blue/20 flex items-center justify-center">
                    <FaTerminal className="text-4xl text-cyber-blue" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-cyber-blue/20 to-transparent mix-blend-overlay hex-avatar"></div>
                </div>
                
                <h2 className="text-2xl font-orbitron font-bold mb-1 text-cyber-blue animate-pulse-slow">FREE USER</h2>
                <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-cyber-blue to-transparent"></div>
              </div>
            
              <div className="flex justify-center mt-6">
                <div className="bg-gradient-to-r from-cyber-blue/20 to-cyber-blue/5 border border-cyber-blue px-6 py-2 rounded text-lg font-orbitron relative overflow-hidden">
                  <span className="relative z-10 text-cyber-blue">FREE</span>
                  <div className="absolute inset-0 bg-cyber-blue/10 cyber-grid"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Premium Profile Card */}
          <Card className="cyber-profile-card relative bg-cyber-darker/80 border border-cyber-gold/50 rounded-lg overflow-hidden">
            <div className="scan-line"></div>
            <div className="absolute inset-0 cyber-grid opacity-20"></div>
            
            <div className="absolute top-4 right-4 z-20">
              <div className="premium-glow">
                <FaTerminal className="text-cyber-gold text-2xl" />
              </div>
            </div>
            
            <CardContent className="p-6 relative">
              <div className="absolute top-0 left-0 w-full h-full circuit-bg opacity-20"></div>
              
              <div className="flex flex-col items-center relative z-10">
                <div className="hex-border mb-6 w-32 h-32 relative">
                  <div className="hex-avatar w-32 h-32 bg-cyber-gold/20 flex items-center justify-center">
                    <FaTerminal className="text-4xl text-cyber-gold" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-cyber-gold/20 to-transparent mix-blend-overlay hex-avatar"></div>
                </div>
                
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-orbitron font-bold text-cyber-gold animate-pulse-slow">PREMIUM</h2>
                  <FaTerminal className="text-cyber-gold premium-glow text-sm" />
                </div>
                <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-cyber-gold to-transparent"></div>
              </div>
              
              <div className="flex justify-center mt-6">
                <div className="bg-gradient-to-r from-cyber-gold/20 to-cyber-gold/5 border border-cyber-gold px-6 py-2 rounded text-lg font-orbitron relative overflow-hidden">
                  <span className="relative z-10 text-cyber-gold">PREMIUM</span>
                  <div className="absolute inset-0 bg-cyber-gold/10 cyber-grid"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Owner Profile Card */}
          <Card className="cyber-profile-card relative bg-cyber-darker/80 border border-cyber-gold/50 rounded-lg overflow-hidden">
            <div className="scan-line"></div>
            <div className="absolute inset-0 cyber-grid opacity-20"></div>
            
            <div className="absolute top-4 right-4 z-20">
              <div className="premium-glow">
                <FaCrown className="text-cyber-gold text-2xl" />
              </div>
            </div>
            
            <CardContent className="p-6 relative">
              <div className="absolute top-0 left-0 w-full h-full circuit-bg opacity-20"></div>
              
              <div className="flex flex-col items-center relative z-10">
                <div className="hex-border mb-6 w-32 h-32 relative">
                  <div className="hex-avatar w-32 h-32 bg-cyber-gold/20 flex items-center justify-center">
                    <FaCrown className="text-4xl text-cyber-gold" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-cyber-gold/20 to-transparent mix-blend-overlay hex-avatar"></div>
                </div>
                
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-orbitron font-bold text-cyber-gold animate-pulse-slow">OWNER</h2>
                  <FaCrown className="text-cyber-gold premium-glow text-sm" />
                </div>
                <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-cyber-gold to-transparent"></div>
              </div>
              
              <div className="flex justify-center mt-6">
                <div className="bg-gradient-to-r from-cyber-gold/20 to-cyber-gold/5 border border-cyber-gold px-6 py-2 rounded text-lg font-orbitron relative overflow-hidden">
                  <span className="relative z-10 text-cyber-gold">OWNER</span>
                  <div className="absolute inset-0 bg-cyber-gold/10 cyber-grid"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Welcome/Goodbye Card Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Welcome Card */}
          <Card className="cyber-welcome-card relative bg-cyber-darker/80 border border-cyber-green/30 rounded-lg overflow-hidden h-80">
            <div className="scan-line"></div>
            <div className="absolute inset-0 cyber-grid opacity-20"></div>
            
            <CardContent className="p-6 relative h-full">
              <div className="absolute inset-0 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-cyber-blue/5 to-cyber-green/5"></div>
                <div className="absolute top-0 left-0 w-full h-full circuit-bg opacity-20"></div>
              </div>
              
              <div className="relative z-10 h-full flex flex-col items-center justify-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full border-2 border-cyber-green overflow-hidden flex items-center justify-center bg-cyber-green/20">
                    <FaTerminal className="text-2xl text-cyber-green" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-cyber-green/50 animate-pulse-slow"></div>
                </div>
                
                <h2 className="text-3xl font-orbitron font-bold text-cyber-green mb-2 animate-pulse-slow text-center">WELCOME</h2>
                <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-cyber-green to-transparent mb-4"></div>
                <p className="text-xl text-cyber-green/80 font-rajdhani text-center">
                  WELCOME TO <span className="text-cyber-green font-semibold">CYBERSERVER</span>
                </p>
                
                <div className="mt-5 border border-cyber-green/50 bg-cyber-green/10 p-3 rounded">
                  <p className="text-cyber-green text-sm font-orbitron text-center">ACCESS GRANTED // SYSTEM ONLINE</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Goodbye Card */}
          <Card className="cyber-goodbye-card relative bg-cyber-darker/80 border border-cyber-pink/30 rounded-lg overflow-hidden h-80">
            <div className="scan-line"></div>
            <div className="absolute inset-0 cyber-grid opacity-20"></div>
            
            <CardContent className="p-6 relative h-full">
              <div className="absolute inset-0 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-cyber-pink/5 to-cyber-purple/5"></div>
                <div className="absolute top-0 left-0 w-full h-full circuit-bg opacity-20"></div>
              </div>
              
              <div className="relative z-10 h-full flex flex-col items-center justify-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full border-2 border-cyber-pink overflow-hidden flex items-center justify-center bg-cyber-pink/20">
                    <FaTerminal className="text-2xl text-cyber-pink" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-cyber-pink/50 animate-pulse-slow"></div>
                </div>
                
                <h2 className="text-3xl font-orbitron font-bold text-cyber-pink mb-2 animate-pulse-slow text-center">GOODBYE</h2>
                <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-cyber-pink to-transparent mb-4"></div>
                <p className="text-xl text-cyber-pink/80 font-rajdhani text-center">
                  GOODBYE FROM <span className="text-cyber-pink font-semibold">CYBERSERVER</span>
                </p>
                
                <div className="mt-5 border border-cyber-pink/50 bg-cyber-pink/10 p-3 rounded">
                  <p className="text-cyber-pink text-sm font-orbitron text-center">CONNECTION TERMINATED // SYSTEM OFFLINE</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Generator Component */}
        <ProfileGenerator />
        
        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="text-cyber-blue/70 font-orbitron text-sm">
            <p>CREATED BY SATZDEV // CYBER EDITION</p>
            <div className="h-0.5 w-40 bg-gradient-to-r from-transparent via-cyber-blue/30 to-transparent mx-auto mt-2"></div>
          </div>
        </footer>
      </div>
    </div>
  );
}
