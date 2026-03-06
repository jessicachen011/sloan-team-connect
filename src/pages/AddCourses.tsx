import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Search, Check, Plus, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import logoSrc from "@/assets/logo.png";

const AddCourses: React.FC = () => {
  const navigate = useNavigate();
  const { courses, addedCourseIds, addCourse, removeCourse } = useApp();
  const [query, setQuery] = useState("");

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.number.toLowerCase().includes(query.toLowerCase()) ||
    c.professor.toLowerCase().includes(query.toLowerCase())
  );

  const handleContinue = () => navigate("/complete-profile");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="header-gradient px-5 pt-12 pb-7">
        <img src={logoSrc} alt="SloanSync" className="h-7 w-auto mb-5 brightness-0 invert opacity-90" />
        <h1 className="text-2xl font-bold text-primary-foreground">Add your courses</h1>
        <p className="text-sm text-primary-foreground/70 mt-1">Choose the classes you want SloanSync for</p>
      </div>

      <div className="flex-1 px-5 py-5 flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, number, or professor..."
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-input bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        {/* Added courses chips */}
        {addedCourseIds.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {addedCourseIds.map(id => {
              const c = courses.find(cc => cc.id === id)!;
              return (
                <span key={id} className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                  {c?.number}
                  <button onClick={() => removeCourse(id)} className="text-primary/60 hover:text-primary ml-0.5">
                    <X size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* Course list */}
        <div className="flex flex-col gap-3 flex-1">
          {filtered.map(course => {
            const added = addedCourseIds.includes(course.id);
            return (
              <div
                key={course.id}
                className={cn(
                  "bg-card rounded-xl border p-4 flex items-center gap-4 card-shadow transition-all",
                  added ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/30"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-primary/70">{course.number}</span>
                    <span className="text-xs text-muted-foreground">· {course.semester}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground leading-snug">{course.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{course.professor}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                    <span className="font-medium">⏱ Deadline: {course.teamFormationDeadline}</span>
                    <span className="text-status-available font-semibold">{course.openTeamCount} open teams</span>
                  </div>
                </div>
                <button
                  onClick={() => added ? removeCourse(course.id) : addCourse(course.id)}
                  className={cn(
                    "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95",
                    added
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border"
                  )}
                >
                  {added ? <Check size={16} /> : <Plus size={16} />}
                </button>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm">
            No courses found. Try a different search.
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border px-5 py-4">
        <button
          onClick={handleContinue}
          disabled={addedCourseIds.length === 0}
          className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          Continue <ChevronRight size={16} />
        </button>
        {addedCourseIds.length === 0 && (
          <p className="text-center text-xs text-muted-foreground mt-2">Add at least one course to continue</p>
        )}
      </div>
    </div>
  );
};

export default AddCourses;
