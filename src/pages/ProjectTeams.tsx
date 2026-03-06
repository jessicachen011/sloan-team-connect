import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";
import AvatarChip from "@/components/AvatarChip";
import { ArrowLeft, Search, Users, MessageCircle, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const ProjectTeams: React.FC = () => {
  const navigate = useNavigate();
  const { courseId, projectId } = useParams<{ courseId: string; projectId: string }>();
  const { projects, teams, students, courses, joinTeam, setSelectedStudent, committedTeamId, setActiveConversation, conversations, CURRENT_USER_ID } = useApp();
  const [joiningTeamId, setJoiningTeamId] = useState<string | null>(null);

  const course = courses.find(c => c.id === courseId);
  const project = projects.find(p => p.id === projectId);
  const projectTeams = teams.filter(t => t.projectId === projectId);

  const handleJoin = (teamId: string) => {
    setJoiningTeamId(teamId);
    setTimeout(() => {
      joinTeam(teamId);
      navigate(`/team-confirmation/${teamId}`);
    }, 600);
  };

  const handleMessage = (studentId: string) => {
    const conv = conversations.find(c => c.participantIds.includes(CURRENT_USER_ID) && c.participantIds.includes(studentId));
    setActiveConversation(conv?.id ?? null);
    navigate("/messages");
  };

  if (!project) return null;

  return (
    <Layout>
      <div className="flex flex-col page-content">
        {/* Header */}
        <div className="header-gradient px-5 pt-12 pb-7">
          <button
            onClick={() => navigate(`/courses/${courseId}/projects`)}
            className="flex items-center gap-1.5 text-primary-foreground/80 hover:text-primary-foreground text-sm mb-4 -ml-1"
          >
            <ArrowLeft size={16} /> Back to Projects
          </button>
          <span className="text-xs font-bold text-primary-foreground/60 uppercase tracking-widest">{course?.number} · {project.theme}</span>
          <h1 className="text-xl font-bold text-primary-foreground mt-0.5 leading-tight">{project.title}</h1>
          <p className="text-sm text-primary-foreground/70 mt-1 leading-snug">{project.description}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-primary-foreground/80">
            <span>{projectTeams.length} teams</span>
            <span className="font-semibold text-primary-foreground">{project.openTeamCount} open spots</span>
          </div>
        </div>

        {/* Search students shortcut */}
        <div className="px-5 mt-5 mb-2">
          <button
            onClick={() => navigate("/search")}
            className="w-full flex items-center gap-3 bg-card rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all card-shadow"
          >
            <Search size={15} className="text-muted-foreground" />
            <span>Search all students for teammates...</span>
          </button>
        </div>

        {/* Team cards */}
        <div className="px-5 flex flex-col gap-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{projectTeams.length} Teams</p>

          {projectTeams.map((team, i) => {
            const memberStudents = team.members.map(m => students.find(s => s.id === m.studentId)).filter(Boolean);
            const isFull = team.status === "Full";
            const isJoining = joiningTeamId === team.id;
            const alreadyJoined = committedTeamId === team.id;

            return (
              <div
                key={team.id}
                className={cn(
                  "bg-card rounded-2xl border card-shadow transition-all animate-fade-in",
                  isFull ? "border-border opacity-80" : "border-border hover:border-primary/30 hover:card-shadow-hover"
                )}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Team header */}
                <div className="p-4 pb-3 border-b border-border">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-foreground text-sm">{team.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 italic">"{team.workingStyleSummary}"</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <StatusBadge status={team.status} />
                      <span className="text-xs text-muted-foreground font-medium">{team.currentSize}/{team.maxSize} members</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", isFull ? "bg-status-full" : team.status === "Partial" ? "bg-status-partial" : "bg-status-available")}
                      style={{ width: `${(team.currentSize / team.maxSize) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Members */}
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Members</p>
                  <div className="flex flex-col gap-2">
                    {memberStudents.map(s => s && (
                      <button
                        key={s.id}
                        onClick={() => { setSelectedStudent(s.id); navigate(`/students/${s.id}`); }}
                        className="flex items-center gap-2.5 hover:bg-secondary/50 rounded-lg px-1 py-1 -mx-1 transition-all"
                      >
                        <AvatarChip initials={s.avatar} name={s.name} size="sm" />
                        <div className="text-left flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground leading-tight">{s.name}</p>
                          <p className="text-[10px] text-muted-foreground">{s.program} · {team.members.find(m => m.studentId === s.id)?.role}</p>
                        </div>
                        <StatusBadge status={s.teamStatus} size="sm" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Open roles */}
                {team.openRoles.length > 0 && (
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Open Roles</p>
                    <div className="flex flex-wrap gap-1.5">
                      {team.openRoles.map(role => (
                        <span key={role} className="text-[11px] bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full">{role}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="px-4 py-3 flex items-center gap-2">
                  {!isFull && !alreadyJoined && (
                    <button
                      onClick={() => handleJoin(team.id)}
                      disabled={isJoining}
                      className="flex-1 bg-primary text-primary-foreground font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70"
                    >
                      {isJoining ? (
                        <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <><UserPlus size={14} /> Join Team</>
                      )}
                    </button>
                  )}
                  {alreadyJoined && (
                    <div className="flex-1 text-center text-sm font-semibold text-status-available py-2.5">
                      ✓ You're on this team
                    </div>
                  )}
                  {!isFull && memberStudents[0] && (
                    <button
                      onClick={() => handleMessage(memberStudents[0]!.id)}
                      className="w-11 h-11 border border-border rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
                    >
                      <MessageCircle size={18} />
                    </button>
                  )}
                  {isFull && (
                    <div className="flex-1 text-center text-xs text-muted-foreground py-2 font-medium">Team is full</div>
                  )}
                </div>
              </div>
            );
          })}

          {projectTeams.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Users size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No teams yet for this project.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectTeams;
