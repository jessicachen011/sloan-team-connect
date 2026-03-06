import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";
import AvatarChip from "@/components/AvatarChip";
import { Edit2, BookOpen, Briefcase, Zap, Clock, Camera } from "lucide-react";
import { useRef } from "react";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { getCurrentUser, courses, addedCourseIds, updateAvatar } = useApp();
  const user = getCurrentUser();
  const myCourses = courses.filter(c => addedCourseIds.includes(c.id));
  const [showAvatarPicker, setShowAvatarPicker] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarSelect = (url: string) => {
    updateAvatar(url);
    setShowAvatarPicker(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateAvatar(url);
    setShowAvatarPicker(false);
  };

  return (
    <Layout>
      <div className="flex flex-col page-content">
        {/* Header */}
        <div className="header-gradient px-5 pt-12 pb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Clickable avatar */}
              <div className="relative">
                <AvatarChip
                  initials={user.avatar}
                  name={user.name}
                  size="lg"
                  avatarUrl={user.avatarUrl}
                  onClick={() => setShowAvatarPicker(true)}
                />
                <button
                  onClick={() => setShowAvatarPicker(true)}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center shadow-md"
                >
                  <Camera size={12} className="text-primary" />
                </button>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-foreground">{user.name}</h1>
                <p className="text-sm text-primary-foreground/70 mt-0.5">{user.program} · {user.education.split(",")[0]}</p>
                {/* Online/offline — not team status */}
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-status-available inline-block" />
                  <span className="text-xs text-primary-foreground/70 font-medium">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/complete-profile")}
              className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-all"
            >
              <Edit2 size={16} />
            </button>
          </div>
        </div>

        {/* Avatar Picker Modal */}
        {showAvatarPicker && (
          <div
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShowAvatarPicker(false)}
          >
            <div
              className="bg-card rounded-t-3xl p-6 w-full max-w-md animate-slide-up"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-base font-bold text-foreground mb-1">Change Profile Picture</h2>
              <p className="text-xs text-muted-foreground mb-4">Choose a preset or upload your own</p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {AVATAR_PRESETS.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => handleAvatarSelect(url)}
                    className="aspect-square rounded-xl overflow-hidden border-2 border-border hover:border-primary transition-all"
                  >
                    <img src={url} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border border-primary/40 text-primary font-semibold py-3 rounded-xl hover:bg-primary/5 transition-all text-sm"
              >
                Upload from device
              </button>
              <button
                onClick={() => setShowAvatarPicker(false)}
                className="w-full mt-2 text-sm text-muted-foreground py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="px-5 pt-5 flex flex-col gap-4">
          {/* About */}
          <div className="bg-card rounded-2xl border border-border p-4 card-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase size={15} className="text-primary" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">About</p>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{user.bio}</p>
          </div>

          {/* Courses */}
          <div className="bg-card rounded-2xl border border-border p-4 card-shadow">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={15} className="text-primary" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">My Courses</p>
            </div>
            <div className="flex flex-col gap-2">
              {myCourses.map(c => (
                <div key={c.id} className="flex items-center justify-between bg-secondary rounded-xl px-3 py-2">
                  <div>
                    <p className="text-xs font-bold text-primary">{c.number}</p>
                    <p className="text-xs font-semibold text-foreground">{c.name}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{c.semester}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-card rounded-2xl border border-border p-4 card-shadow">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Skills</p>
            <div className="flex flex-wrap gap-2">
              {user.skills.map(sk => (
                <span key={sk} className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">{sk}</span>
              ))}
            </div>
          </div>

          {/* Team Fit */}
          <div className="bg-card rounded-2xl border border-border p-4 card-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={15} className="text-primary" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Team Fit</p>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">Preferred Roles</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.preferredRoles.map(r => (
                    <span key={r} className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full">{r}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">Working Style</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.workingStyle.map(ws => (
                    <span key={ws} className="text-xs bg-secondary text-secondary-foreground font-semibold px-2.5 py-1 rounded-full border border-border">{ws}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-card rounded-2xl border border-border p-4 card-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={15} className="text-primary" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Availability</p>
            </div>
            <p className="text-sm font-semibold text-foreground">{user.weeklyAvailability}</p>
            <p className="text-xs text-muted-foreground mt-0.5">per week this semester</p>
          </div>

          {/* Edit CTA */}
          <button
            onClick={() => navigate("/complete-profile")}
            className="w-full border border-primary/40 text-primary font-semibold py-3.5 rounded-xl hover:bg-primary/5 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-4"
          >
            <Edit2 size={15} /> Edit Profile
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
