import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import AvatarChip from "@/components/AvatarChip";
import { Search, SlidersHorizontal, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Program } from "@/types";

const PROGRAMS: Program[] = ["MBA", "MBAn", "LGO", "MFin"];
const SKILLS = ["Strategy", "Python", "Machine Learning", "SQL", "Financial Modeling", "Operations Research", "Marketing Strategy", "Deep Learning"];

const SearchStudents: React.FC = () => {
  const navigate = useNavigate();
  const { students, courses, projects, teams, setSelectedStudent, currentUserId, setActiveConversation, conversations, sendMessage } = useApp();

  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterPrograms, setFilterPrograms] = useState<string[]>([]);
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [filterCourseId, setFilterCourseId] = useState<string>("");
  const [filterProjectId, setFilterProjectId] = useState<string>("");

  const toggleFilter = (val: string, list: string[], setList: (l: string[]) => void) => {
    setList(list.includes(val) ? list.filter(x => x !== val) : [...list, val]);
  };

  // Projects available for selected course
  const filteredProjects = filterCourseId
    ? projects.filter(p => p.courseId === filterCourseId)
    : [];

  // Clear project if course changes
  const handleCourseFilter = (courseId: string) => {
    setFilterCourseId(prev => {
      if (prev === courseId) { setFilterProjectId(""); return ""; }
      setFilterProjectId("");
      return courseId;
    });
  };

  // Determine if we have a project context
  const hasProjectContext = !!filterProjectId;

  // For project-context status: derive each student's team status for the selected project
  const getProjectStatus = (studentId: string): string => {
    if (!hasProjectContext) return "";
    const projectTeams = teams.filter(t => t.projectId === filterProjectId);
    for (const team of projectTeams) {
      if (team.members.some(m => m.studentId === studentId)) {
        return "Committed";
      }
    }
    const student = students.find(s => s.id === studentId);
    if (student?.teamStatus === "In Conversations") return "Chatting";
    return "Available";
  };

  const otherStudents = students.filter(s => s.id !== currentUserId);

  const filtered = otherStudents.filter(s => {
    const q = query.toLowerCase();
    const matchesQuery = !q || s.name.toLowerCase().includes(q) || s.program.toLowerCase().includes(q) || s.bio.toLowerCase().includes(q) || s.skills.some(sk => sk.toLowerCase().includes(q));
    const matchesProgram = filterPrograms.length === 0 || filterPrograms.includes(s.program);
    const matchesSkill = filterSkills.length === 0 || filterSkills.some(sk => s.skills.includes(sk));
    const matchesCourse = !filterCourseId || s.currentCourses.includes(filterCourseId);
    return matchesQuery && matchesProgram && matchesSkill && matchesCourse;
  });

  const activeFilterCount = filterPrograms.length + filterSkills.length + (filterCourseId ? 1 : 0) + (filterProjectId ? 1 : 0);

  const handleViewProfile = (id: string) => {
    setSelectedStudent(id);
    navigate(`/students/${id}`);
  };

  const handleMessage = (studentId: string) => {
    const conv = conversations.find(c =>
      c.participantIds.includes(currentUserId) && c.participantIds.includes(studentId)
    );
    setActiveConversation(conv?.id ?? null);
    navigate("/messages");
  };

  const statusBadge = (studentId: string) => {
    if (hasProjectContext) {
      const st = getProjectStatus(studentId);
      const config: Record<string, string> = {
        Available: "badge-available",
        Chatting: "badge-partial",
        Committed: "badge-committed",
      };
      return (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full font-semibold px-2.5 py-0.5 text-[11px]", config[st])}>
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 flex-shrink-0" />
          {st}
        </span>
      );
    }
    // No project context → Online / Offline (all shown as Online for demo)
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full font-semibold px-2.5 py-0.5 text-[11px] badge-available">
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 flex-shrink-0" />
        Online
      </span>
    );
  };

  return (
    <Layout>
      <div className="flex flex-col page-content">
        {/* Header */}
        <div className="header-gradient px-5 pt-12 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-primary-foreground/80 hover:text-primary-foreground text-sm mb-4 -ml-1"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <h1 className="text-xl font-bold text-primary-foreground">Find Teammates</h1>
          <p className="text-sm text-primary-foreground/70 mt-1">Search {otherStudents.length} Sloan students</p>
        </div>

        <div className="px-5 pt-5 flex flex-col gap-3">
          {/* Search + filter row */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Name, skill, or program..."
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(f => !f)}
              className={cn(
                "flex-shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center transition-all relative",
                showFilters || activeFilterCount > 0 ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"
              )}
            >
              <SlidersHorizontal size={17} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-status-partial text-status-partial-bg text-[9px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="bg-card rounded-xl border border-border p-4 flex flex-col gap-4 animate-scale-in">
              {/* Course filter */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Course</p>
                <div className="flex flex-wrap gap-2">
                  {courses.map(c => (
                    <button key={c.id} onClick={() => handleCourseFilter(c.id)}
                      className={cn("text-xs font-semibold px-3 py-1.5 rounded-full border transition-all", filterCourseId === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border hover:border-primary/40")}>
                      {c.number}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project filter — only shown when a course is selected */}
              {filterCourseId && filteredProjects.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Project <span className="normal-case font-normal text-muted-foreground">(shows team formation status)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {filteredProjects.map(p => (
                      <button key={p.id} onClick={() => setFilterProjectId(prev => prev === p.id ? "" : p.id)}
                        className={cn("text-xs font-semibold px-3 py-1.5 rounded-full border transition-all text-left", filterProjectId === p.id ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border hover:border-primary/40")}>
                        {p.title}
                      </button>
                    ))}
                  </div>
                  {filterProjectId && (
                    <p className="text-[11px] text-muted-foreground mt-2">
                      Status reflects availability for this specific project.
                    </p>
                  )}
                </div>
              )}

              {/* Program filter */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Program</p>
                <div className="flex flex-wrap gap-2">
                  {PROGRAMS.map(p => (
                    <button key={p} onClick={() => toggleFilter(p, filterPrograms, setFilterPrograms)}
                      className={cn("text-xs font-semibold px-3 py-1.5 rounded-full border transition-all", filterPrograms.includes(p) ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border hover:border-primary/40")}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills filter */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map(sk => (
                    <button key={sk} onClick={() => toggleFilter(sk, filterSkills, setFilterSkills)}
                      className={cn("text-xs font-semibold px-3 py-1.5 rounded-full border transition-all", filterSkills.includes(sk) ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border hover:border-primary/40")}>
                      {sk}
                    </button>
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button onClick={() => { setFilterPrograms([]); setFilterSkills([]); setFilterCourseId(""); setFilterProjectId(""); }} className="text-xs text-primary font-semibold flex items-center gap-1 self-start">
                  <X size={12} /> Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Context note */}
          {hasProjectContext && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl px-3 py-2">
              <p className="text-xs text-primary font-medium">
                Showing team formation status for the selected project.
              </p>
            </div>
          )}

          {/* Results count */}
          <p className="text-xs text-muted-foreground font-medium">{filtered.length} students</p>

          {/* Student cards */}
          <div className="flex flex-col gap-3 pb-6">
            {filtered.map((student, i) => (
              <div
                key={student.id}
                className="bg-card rounded-2xl border border-border card-shadow hover:card-shadow-hover hover:border-primary/30 transition-all p-4 animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <AvatarChip initials={student.avatar} name={student.name} size="md" avatarUrl={student.avatarUrl} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-foreground text-sm">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.program} · {student.education.split(",")[1]?.trim() || student.education.split(" ").slice(-2).join(" ")}</p>
                      </div>
                      {statusBadge(student.id)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{student.bio}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {student.skills.slice(0, 3).map(sk => (
                        <span key={sk} className="text-[10px] bg-secondary text-secondary-foreground font-semibold px-2 py-0.5 rounded-full border border-border">{sk}</span>
                      ))}
                      {student.skills.length > 3 && (
                        <span className="text-[10px] text-muted-foreground font-medium px-1">+{student.skills.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  <button
                    onClick={() => handleViewProfile(student.id)}
                    className="flex-1 bg-primary text-primary-foreground text-xs font-semibold py-2 rounded-lg hover:bg-primary/90 transition-all active:scale-[0.98]"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleMessage(student.id)}
                    className="flex-1 bg-secondary text-secondary-foreground text-xs font-semibold py-2 rounded-lg hover:bg-secondary/70 border border-border transition-all active:scale-[0.98]"
                  >
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Search size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No students match your search.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchStudents;
