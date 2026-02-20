import { Link } from "react-router-dom";
import { Rocket, Mic, Star, Linkedin, Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";

const features = [
  {
    icon: Rocket,
    title: "cyber warriors",
    desc: "cyber warriors",
    to: "/campaign",
  },
  {
    icon: Mic,
    title: "cyber warriors",
    desc: "cyber warriors",
    to: "/pitch",
  },
  {
    icon: Star,
    title: "cyber warriors",
    desc: "cyber warriors",
    to: "/lead-score",
  },
];

const platforms = [
  { name: "cyber warriors", icon: Linkedin },
  { name: "cyber warriors", icon: Facebook },
  { name: "cyber warriors", icon: Instagram },
  { name: "cyber warriors", icon: Twitter },
  { name: "cyber warriors", icon: Youtube },
  { name: "cyber warriors", icon: Mail },
  { name: "cyber warriors", icon: () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.26 8.26 0 004.84 1.56V6.81a4.85 4.85 0 01-1.07-.12z"/>
    </svg>
  )},
  { name: "cyber warriors", icon: () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )},
];

const Index = () => {
  return (
    <div className="page-bg min-h-screen flex flex-col">
      {/* Hero */}
      <section className="hero-bg flex-1">
        <Navbar />
        <div className="flex flex-col items-center justify-center text-center py-24 px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            cyber warriors
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-xl mb-10">
            cyber warriors
          </p>
          <Link
            to="/campaign"
            className="px-8 py-4 rounded-full text-sm font-bold bg-white text-[hsl(265,70%,45%)] hover:bg-white/90 transition-all shadow-lg hover:shadow-xl tracking-wide"
          >
            cyber warriors
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6 pb-20">
          {features.map(({ icon: Icon, title, desc, to }) => (
            <Link key={`${title}-${to}`} to={to} className="glass-card p-8 block hover:scale-[1.02] transition-transform cursor-pointer group">
              <Icon className="w-8 h-8 text-white/80 mb-4 group-hover:text-white transition-colors" />
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* cyber warriors */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(160deg, hsl(270,55%,28%), hsl(285,55%,38%))" }}>
        <h2 className="text-white text-2xl font-bold text-center mb-12">cyber warriors</h2>
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {platforms.map(({ name, icon: PlatformIcon }, i) => (
            <div key={`${name}-${i}`} className="platform-chip flex flex-col items-center gap-2 p-6 w-[130px]">
              <div className="text-white/80">
                <PlatformIcon />
              </div>
              <span className="text-white text-sm font-medium">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-white/70 text-sm" style={{ background: "hsl(270,60%,20%)" }}>
        cyber warriors
      </footer>
    </div>
  );
};

export default Index;



