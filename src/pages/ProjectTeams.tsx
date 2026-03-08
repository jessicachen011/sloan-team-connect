import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import AvatarChip from "@/components/AvatarChip";
import StatusBadge from "@/components/StatusBadge";
import { ArrowLeft, Search, Users, MessageCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const ProjectTeams: React.FC = () => {
  const navigate = useNavigate();
  const { courseId, projectId } = useParams<{ courseId: string; projectId: string }>();
  const {
    projects, teams, students, courses,
    setSelectedStudent, committedTeamId, pendingTeamIds, requestToJoinTeam,
    setActiveConversation, conversations, currentUserId, sendMessage, openOrCreateDM,
  } = useApp();


  const course = courses.find(c => c.id === courseId);
  const project = projects.find(p => p.id === projectId);
  const projectTeams = teams.filter(t => t.projectId === projectId);

  const openTeamCount = projectTeams.filter(t => t.status === "Open" || t.status === "Partial").length;

  // 1:1 DM — find existing convo or create one
  const handleDM = (studentId: string) => {
    const existing = conversations.find(c =>
      c.participantIds.length === 2 &&
      c.participantIds.includes(currentUserId) &&
      c.participantIds.includes(studentId)
    );
    if (existing) {
      setActiveConversation(existing.id);
      navigate("/messages");
    } else {
      sendMessage(null, studentId, "👋 Hey! Saw you on the team — would love to connect.");
      navigate("/messages");
    }
  };

  // Group chat — find existing convo with all members or create one
  const handleGroupChat = (memberStudentIds: string[]) => {
    const allIds = Array.from(new Set([currentUserId, ...memberStudentIds]));
    const others = allIds.filter(id => id !== currentUserId);
    if (others.length === 0) return;
    const existing = conversations.find(c =>
      allIds.every(id => c.participantIds.includes(id)) &&
      c.participantIds.length === allIds.length
    );
    if (existing) {
      setActiveConversation(existing.id);
      navigate("/messages");
    } else {
      // Create group by messaging all others; uses first as receiver for the conv stub
      sendMessage(null, others[0], "👋 Hey team! Interested in working together.");
      navigate("/messages");
    }
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
            <ArrowLeft size={16} />
            <span>Back to Projects</span>
          </button>
          <span className="text-xs font-bold text-primary-foreground/60 uppercase tracking-widest">{course?.number} · {project.theme}</span>
          <h1 className="text-xl font-bold text-primary-foreground mt-0.5 leading-tight">{project.title}</h1>
          <p className="text-sm text-primary-foreground/70 mt-1 leading-snug">{project.description}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-primary-foreground/80">
            <span>{projectTeams.length} teams total</span>
            <span className="font-semibold text-primary-foreground">{openTeamCount} teams open</span>
            <span className="flex items-center gap-1"><Clock size={11} /> {project.deadline}</span>
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
        <div className="px-5 flex flex-col gap-4 pb-6">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{projectTeams.length} Teams</p>

          {projectTeams.map((team, i) => {
            const memberStudents = team.members.map(m => students.find(s => s.id === m.studentId)).filter(Boolean);
            const isFull = team.status === "Full";
            const alreadyJoined = committedTeamId === team.id;
            const isPending = pendingTeamIds.includes(team.id);

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

                {/* Members — with per-member DM button, no status labels */}
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Members</p>
                  <div className="flex flex-col gap-2">
                    {memberStudents.map(s => s && (
                      <div key={s.id} className="flex items-center gap-2.5">
                        <button
                          onClick={() => { setSelectedStudent(s.id); navigate(`/students/${s.id}`); }}
                          className="flex items-center gap-2.5 hover:bg-secondary/50 rounded-lg px-1 py-1 -mx-1 transition-all flex-1 min-w-0"
                        >
                          <AvatarChip initials={s.avatar} name={s.name} size="sm" avatarUrl={s.avatarUrl} />
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground leading-tight">{s.name}</p>
                            <p className="text-[10px] text-muted-foreground">{s.program} · {team.members.find(m => m.studentId === s.id)?.role}</p>
                          </div>
                        </button>
                        {/* Per-member 1:1 DM button */}
                        {s.id !== currentUserId && (
                          <button
                            onClick={() => handleDM(s.id)}
                            title={`Message ${s.name.split(" ")[0]}`}
                            className="flex-shrink-0 w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
                          >
                            <MessageCircle size={13} />
                          </button>
                        )}
                      </div>
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
                <div className="px-4 py-3 flex flex-col gap-2">
                  {alreadyJoined && (
                    <div className="text-center text-sm font-semibold text-status-available py-2">
                      ✓ You're on this team
                    </div>
                  )}

                  {!isFull && !alreadyJoined && isPending && (
                    <div className="flex flex-col items-center gap-1 py-1">
                      <div className="w-full text-center text-sm font-semibold text-status-partial py-2 bg-status-partial-bg rounded-xl">
                        ⏳ Request Sent · Pending Team Approval
                      </div>
                      <p className="text-[11px] text-muted-foreground text-center">
                        Your request will be reviewed by current team members before you officially join.
                      </p>
                    </div>
                  )}

                  {!isFull && !alreadyJoined && !isPending && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => requestToJoinTeam(team.id)}
                        className="flex-1 bg-primary text-primary-foreground font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-all active:scale-[0.98]"
                      >
                        Request to Join
                      </button>
                      {/* Team-level group chat button */}
                      {memberStudents.length > 0 && (
                        <button
                          onClick={() => handleGroupChat(memberStudents.map(s => s!.id))}
                          title="Message the whole team"
                          className="w-11 h-11 border border-border rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all relative"
                        >
                          <MessageCircle size={18} />
                          {/* Small indicator that it's a group */}
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary border border-border text-[9px] font-bold flex items-center justify-center text-muted-foreground">
                            {memberStudents.length}
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                  {isFull && (
                    <div className="text-center text-xs text-muted-foreground py-2 font-medium">Team is full</div>
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
