import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";
import AvatarChip from "@/components/AvatarChip";
import { Edit2, BookOpen, Briefcase, Zap, Clock } from "lucide-react";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { getCurrentUser, courses, addedCourseIds } = useApp();
  const user = getCurrentUser();
  const myCourses = courses.filter(c => addedCourseIds.includes(c.id));

  return (
    <Layout>
      <div className="flex flex-col page-content">
        {/* Header */}
        <div className="header-gradient px-5 pt-12 pb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <AvatarChip initials={user.avatar} name={user.name} size="lg" />
              <div>
                <h1 className="text-xl font-bold text-primary-foreground">{user.name}</h1>
                <p className="text-sm text-primary-foreground/70 mt-0.5">{user.program} · {user.education.split(",")[0]}</p>
                <div className="mt-2">
                  <StatusBadge status={user.teamStatus} size="md" />
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
            className="w-full border border-primary/40 text-primary font-semibold py-3.5 rounded-xl hover:bg-primary/5 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Edit2 size={15} /> Edit Profile
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
