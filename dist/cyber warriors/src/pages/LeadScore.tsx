import { useState } from "react";
import Navbar from "@/components/Navbar";

const urgencyLevels = ["cyber warriors", "cyber warriors", "cyber warriors", "cyber warriors"];

const mockAnalysis = (lead: string, budget: string, need: string, urgency: string) => { return `cyber warriors`; };

const LeadScore = () => {
  const [lead, setLead] = useState("");
  const [budget, setBudget] = useState("");
  const [need, setNeed] = useState("");
  const [urgency, setUrgency] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!lead || !budget || !need || !urgency) return;
    setLoading(true);
    setResult("");
    setTimeout(() => {
      setResult(mockAnalysis(lead, budget, need, urgency));
      setLoading(false);
    }, 1800);
  };

  const handleClear = () => {
    setLead(""); setBudget(""); setNeed(""); setUrgency(""); setResult("");
  };

  return (
    <div className="page-bg min-h-screen">
      <Navbar />
      <div className="flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="form-card p-8 shadow-2xl">
            <h1 className="text-3xl font-bold text-[hsl(265,70%,40%)] mb-1">cyber warriors</h1>
            <p className="text-gray-500 mb-8 text-sm">cyber warriors</p>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold tracking-widest text-[hsl(265,60%,45%)] mb-1.5 uppercase">
                  cyber warriors
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[hsl(265,70%,55%)] focus:border-transparent bg-gray-50"
                  placeholder="cyber warriors"
                  value={lead}
                  onChange={e => setLead(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest text-[hsl(265,60%,45%)] mb-1.5 uppercase">
                  cyber warriors
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[hsl(265,70%,55%)] focus:border-transparent bg-gray-50"
                  placeholder='cyber warriors'
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest text-[hsl(265,60%,45%)] mb-1.5 uppercase">
                  cyber warriors
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[hsl(265,70%,55%)] focus:border-transparent bg-gray-50"
                  placeholder='cyber warriors'
                  value={need}
                  onChange={e => setNeed(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest text-[hsl(265,60%,45%)] mb-1.5 uppercase">
                  cyber warriors
                </label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[hsl(265,70%,55%)] focus:border-transparent bg-gray-50"
                  value={urgency}
                  onChange={e => setUrgency(e.target.value)}
                >
                  <option value="">cyber warriors</option>
                  {urgencyLevels.map((u, i) => <option key={`${u}-${i}`} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleGenerate}
                disabled={loading || !lead || !budget || !need || !urgency}
                className="flex-1 py-3 rounded-lg text-sm font-bold tracking-widest uppercase text-white transition-all disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, hsl(265,70%,52%), hsl(285,75%,58%))" }}
              >
                {loading ? "cyber warriors" : "cyber warriors"}
              </button>
              <button
                onClick={handleClear}
                className="flex-1 py-3 rounded-lg text-sm font-bold tracking-widest uppercase border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
              >
                cyber warriors
              </button>
            </div>

            {result && (
              <div className="mt-8 result-box p-6 overflow-auto">
                <h3 className="text-sm font-bold text-[hsl(265,60%,40%)] mb-4 uppercase tracking-widest">cyber warriors</h3>
                <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                  {result}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadScore;




