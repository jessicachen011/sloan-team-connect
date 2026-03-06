import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import AvatarChip from "@/components/AvatarChip";
import { CheckCircle, Home, MessageCircle, Users } from "lucide-react";

const TeamConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const { teams, students, getCurrentUser, setActiveConversation, conversations, currentUserId } = useApp();

  const team = teams.find(t => t.id === teamId);
  const currentUser = getCurrentUser();

  if (!team) {
    navigate("/home");
    return null;
  }

  const memberStudents = team.members
    .map(m => students.find(s => s.id === m.studentId))
    .filter(Boolean);

  const handleMessageTeam = () => {
    const firstOther = team.members.find(m => m.studentId !== currentUserId);
    if (firstOther) {
      const conv = conversations.find(c =>
        c.participantIds.includes(currentUserId) && c.participantIds.includes(firstOther.studentId)
      );
      setActiveConversation(conv?.id ?? null);
      navigate("/messages");
    } else {
      navigate("/messages");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center page-content">
        {/* Success animation */}
        <div className="header-gradient w-full px-5 pt-16 pb-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-5 animate-scale-in">
            <CheckCircle size={42} className="text-primary-foreground" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground text-center">You're in!</h1>
          <p className="text-primary-foreground/80 text-base mt-2 text-center">You've joined</p>
          <p className="text-primary-foreground font-bold text-xl text-center">{team.name}</p>
        </div>

        <div className="px-5 pt-6 w-full flex flex-col gap-5">
          {/* Status card */}
          <div className="bg-card rounded-2xl border border-border card-shadow p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-status-available-bg flex items-center justify-center">
                <CheckCircle size={20} className="text-status-available" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Team Status Updated</p>
                <p className="text-xs text-muted-foreground">Your profile is now: <span className="font-semibold text-status-committed">Committed</span></p>
              </div>
            </div>

            {/* Team member list */}
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Your Team</p>
            <div className="flex flex-col gap-3">
              {memberStudents.map(s => s && (
                <div key={s.id} className="flex items-center gap-3">
                  <AvatarChip initials={s.avatar} name={s.name} size="sm" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.program} · {team.members.find(m => m.studentId === s.id)?.role}</p>
                  </div>
                  {s.id === currentUserId && (
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">You</span>
                  )}
                </div>
              ))}
            </div>

            {/* Team stats */}
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Users size={13} />
                <span className="font-medium">{team.currentSize}/{team.maxSize} members</span>
              </div>
              <span className={`font-semibold ${team.status === "Full" ? "text-status-full" : "text-status-available"}`}>
                {team.status === "Full" ? "Team Full" : `${team.maxSize - team.currentSize} spot${team.maxSize - team.currentSize !== 1 ? "s" : ""} remaining`}
              </span>
            </div>
          </div>

          {/* What's next */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
            <p className="text-sm font-bold text-foreground mb-2">What's next?</p>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li className="flex items-start gap-2"><span className="text-primary font-bold">1.</span> Introduce yourself to your team in the chat</li>
              <li className="flex items-start gap-2"><span className="text-primary font-bold">2.</span> Set up your first team meeting</li>
              <li className="flex items-start gap-2"><span className="text-primary font-bold">3.</span> Agree on roles and responsibilities</li>
              <li className="flex items-start gap-2"><span className="text-primary font-bold">4.</span> Note your project deadline</li>
            </ul>
          </div>
        </div>

        {/* CTAs */}
        <div className="px-5 pt-4 pb-6 w-full flex flex-col gap-2">
          <button
            onClick={handleMessageTeam}
            className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            <MessageCircle size={16} /> Message Your Team
          </button>
          <button
            onClick={() => navigate("/home")}
            className="w-full bg-secondary text-secondary-foreground font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-secondary/70 border border-border transition-all active:scale-[0.98]"
          >
            <Home size={16} /> Back to Home
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default TeamConfirmation;
