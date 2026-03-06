import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import AvatarChip from "@/components/AvatarChip";
import { ArrowLeft, MessageCircle, Briefcase, Clock, Zap, Globe } from "lucide-react";

const StudentProfile: React.FC = () => {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();
  const { students, setActiveConversation, conversations, currentUserId } = useApp();

  const student = students.find(s => s.id === studentId);

  const handleMessage = () => {
    const conv = conversations.find(c =>
      c.participantIds.includes(currentUserId) && c.participantIds.includes(studentId!)
    );
    setActiveConversation(conv?.id ?? null);
    navigate("/messages");
  };

  if (!student) return null;

  const Section = ({ title, icon: Icon, children }: { title: string; icon?: React.ElementType; children: React.ReactNode }) => (
    <div className="bg-card rounded-2xl border border-border p-4 card-shadow">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={15} className="text-primary" />}
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
      </div>
      {children}
    </div>
  );

  return (
    <Layout>
      <div className="flex flex-col page-content">
        {/* Header */}
        <div className="header-gradient px-5 pt-12 pb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-primary-foreground/80 hover:text-primary-foreground text-sm mb-5 -ml-1"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-start gap-4">
            <AvatarChip initials={student.avatar} name={student.name} size="lg" avatarUrl={student.avatarUrl} />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-primary-foreground leading-tight">{student.name}</h1>
              <p className="text-sm text-primary-foreground/70 mt-0.5">{student.program} · {student.education.split(",")[0]}</p>
              {/* Online presence only — no team status here */}
              <div className="mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-status-available inline-block" />
                <span className="text-xs text-primary-foreground/70 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 pt-5 flex flex-col gap-4">
          {/* Bio */}
          <Section title="About" icon={Briefcase}>
            <p className="text-sm text-foreground leading-relaxed">{student.bio}</p>
            <p className="text-xs text-muted-foreground mt-2 font-medium">{student.email}</p>
          </Section>

          {/* Goals */}
          <Section title="Goals & Development" icon={Zap}>
            <p className="text-sm text-foreground leading-relaxed">{student.goals}</p>
          </Section>

          {/* Skills */}
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {student.skills.map(sk => (
                <span key={sk} className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">{sk}</span>
              ))}
            </div>
          </Section>

          {/* Industries */}
          <Section title="Industries of Interest" icon={Globe}>
            <div className="flex flex-wrap gap-2">
              {student.industries.map(i => (
                <span key={i} className="text-xs font-semibold bg-secondary text-secondary-foreground px-3 py-1 rounded-full border border-border">{i}</span>
              ))}
            </div>
          </Section>

          {/* Team Fit */}
          <Section title="Team Fit" icon={Briefcase}>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Preferred Roles</p>
                <div className="flex flex-wrap gap-1.5">
                  {student.preferredRoles.map(r => (
                    <span key={r} className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">{r}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Working Style</p>
                <div className="flex flex-wrap gap-1.5">
                  {student.workingStyle.map(ws => (
                    <span key={ws} className="text-xs font-semibold bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full border border-border">{ws}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Communication Preferences</p>
                <div className="flex flex-wrap gap-1.5">
                  {student.communicationPrefs.map(cp => (
                    <span key={cp} className="text-xs font-semibold bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full border border-border">{cp}</span>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Availability */}
          <Section title="Availability" icon={Clock}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-status-available-bg flex items-center justify-center">
                <Clock size={18} className="text-status-available" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{student.weeklyAvailability}</p>
                <p className="text-xs text-muted-foreground">per week this semester</p>
              </div>
            </div>
          </Section>
        </div>

        {/* CTA Buttons */}
        <div className="px-5 pb-6 pt-4">
          <button
            onClick={handleMessage}
            className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            <MessageCircle size={16} /> Message {student.name.split(" ")[0]}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default StudentProfile;
