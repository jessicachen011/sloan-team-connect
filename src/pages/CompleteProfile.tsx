import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { ArrowLeft, Check } from "lucide-react";
import AvatarChip from "@/components/AvatarChip";

const SKILL_OPTIONS = ["Strategy", "Product Management", "Python", "Data Analysis", "Machine Learning", "SQL", "Excel Modeling", "R", "Operations Research", "Financial Modeling", "Marketing Strategy", "UX Design", "Deep Learning", "A/B Testing", "Causal Inference"];
const INDUSTRY_OPTIONS = ["Technology", "Consulting", "FinTech", "Healthcare", "E-Commerce", "Logistics", "Media", "Finance", "Consumer", "Manufacturing"];
const ROLE_OPTIONS = ["PM / Coordinator", "Strategy Lead", "Analytics / Modeling", "Technical Builder", "Research", "Presentation / Storytelling"];
const STYLE_OPTIONS = ["Structured planner", "Fast mover", "Collaborative brainstormer", "Detail-oriented finisher", "Technical builder", "Strong communicator"];
const COMM_OPTIONS = ["Slack", "Email", "WhatsApp", "Weekly syncs", "Async-friendly", "Notion docs"];
const AVAIL_OPTIONS = ["5–8 hrs/week", "8–12 hrs/week", "10–15 hrs/week", "12–18 hrs/week", "15–20 hrs/week", "20+ hrs/week"];

function MultiSelect({ options, selected, onChange, label }: { options: string[]; selected: string[]; onChange: (v: string[]) => void; label: string }) {
  const toggle = (o: string) => onChange(selected.includes(o) ? selected.filter(x => x !== o) : [...selected, o]);
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button
            key={o}
            type="button"
            onClick={() => toggle(o)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selected.includes(o) ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border hover:border-primary/50"}`}
          >
            {selected.includes(o) && <Check size={10} className="inline mr-1" />}{o}
          </button>
        ))}
      </div>
    </div>
  );
}

const CompleteProfile: React.FC = () => {
  const navigate = useNavigate();
  const { getCurrentUser, updateProfile, setOnboarded } = useApp();
  const user = getCurrentUser();

  const [name, setName] = useState(user.name);
  const [email] = useState(user.email);
  const [education, setEducation] = useState(user.education);
  const [bio, setBio] = useState(user.bio);
  const [goals, setGoals] = useState(user.goals);
  const [skills, setSkills] = useState(user.skills);
  const [industries, setIndustries] = useState(user.industries);
  const [roles, setRoles] = useState(user.preferredRoles);
  const [styles, setStyles] = useState(user.workingStyle);
  const [commPrefs, setCommPrefs] = useState(user.communicationPrefs);
  const [availability, setAvailability] = useState(user.weeklyAvailability);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    updateProfile({ name, education, bio, goals, skills, industries: industries, preferredRoles: roles, workingStyle: styles, communicationPrefs: commPrefs, weeklyAvailability: availability });
    setTimeout(() => {
      setOnboarded();
      navigate("/home");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="header-gradient px-5 pt-12 pb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-primary-foreground/80 hover:text-primary-foreground text-sm mb-4 -ml-1">
          <ArrowLeft size={16} /><span>Back</span>
        </button>
        <div className="flex items-center gap-4">
          <AvatarChip initials={user.avatar} name={user.name} size="lg" />
          <div>
            <h1 className="text-xl font-bold text-primary-foreground">Complete Your Profile</h1>
            <p className="text-sm text-primary-foreground/70 mt-0.5">Help teammates find and evaluate your fit</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 py-6 flex flex-col gap-6 page-content">

        {/* Section: Basic Info */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Basic Info</h2>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">MIT Email</label>
            <input value={email} readOnly className="w-full px-4 py-3 rounded-xl border border-input bg-secondary text-sm text-muted-foreground cursor-not-allowed" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Education / Degree</label>
            <input value={education} onChange={e => setEducation(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" placeholder="e.g. B.S. Computer Science, Stanford" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Short Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none" placeholder="What's your background and what do you bring to a team?" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Goals & Development</label>
            <textarea value={goals} onChange={e => setGoals(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none" placeholder="What do you want to learn or build this semester?" />
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Section: Skills & Interests */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Skills & Interests</h2>
          <MultiSelect options={SKILL_OPTIONS} selected={skills} onChange={setSkills} label="Skills" />
          <MultiSelect options={INDUSTRY_OPTIONS} selected={industries} onChange={setIndustries} label="Industries of Interest" />
        </div>

        <div className="h-px bg-border" />

        {/* Section: Team Fit */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Team Fit</h2>
          <MultiSelect options={ROLE_OPTIONS} selected={roles} onChange={setRoles} label="Preferred Role in Team" />
          <MultiSelect options={STYLE_OPTIONS} selected={styles} onChange={setStyles} label="Working Style" />
          <MultiSelect options={COMM_OPTIONS} selected={commPrefs} onChange={setCommPrefs} label="Communication Preferences" />
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Weekly Availability</label>
            <div className="flex flex-wrap gap-2">
              {AVAIL_OPTIONS.map(o => (
                <button key={o} type="button" onClick={() => setAvailability(o)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${availability === o ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border hover:border-primary/50"}`}>{o}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border px-5 py-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          {saving ? <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : <><Check size={16} /> Save Profile</>}
        </button>
      </div>
    </div>
  );
};

export default CompleteProfile;
