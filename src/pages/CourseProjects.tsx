import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import { ArrowLeft, ChevronRight, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, string> = {
  Active: "bg-status-available-bg text-status-available",
  "Filling Fast": "bg-status-partial-bg text-status-partial",
  Full: "bg-status-full-bg text-status-full",
};

const CourseProjects: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, projects, setSelectedProject } = useApp();

  const course = courses.find(c => c.id === courseId);
  const courseProjects = projects.filter(p => p.courseId === courseId);

  const handleProject = (projectId: string) => {
    setSelectedProject(projectId);
    navigate(`/courses/${courseId}/projects/${projectId}/teams`);
  };

  if (!course) return null;

  return (
    <Layout>
      <div className="flex flex-col page-content">
        {/* Header */}
        <div className="header-gradient px-5 pt-12 pb-7">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-1.5 text-primary-foreground/80 hover:text-primary-foreground text-sm mb-4 -ml-1"
          >
            <ArrowLeft size={16} />
            <span>Back to Courses</span>
          </button>
          <span className="text-xs font-bold text-primary-foreground/60 uppercase tracking-widest">{course.number}</span>
          <h1 className="text-xl font-bold text-primary-foreground mt-0.5 leading-tight">{course.name}</h1>
          <p className="text-sm text-primary-foreground/70 mt-1">{course.professor} · {course.semester}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-primary-foreground/80">
            <span className="font-medium">{courseProjects.length} projects</span>
          </div>
        </div>

        <div className="px-5 mt-5">
          <div className="flex items-center gap-2 mb-4">
            <FolderOpen size={16} className="text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">
              Choose a project to view available teams
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {courseProjects.map((project, i) => (
              <button
                key={project.id}
                onClick={() => handleProject(project.id)}
                className="w-full text-left bg-card rounded-2xl border border-border card-shadow hover:card-shadow-hover hover:border-primary/30 transition-all p-4 group active:scale-[0.99] animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={cn("text-[11px] font-semibold px-2.5 py-0.5 rounded-full", statusConfig[project.status] ?? "bg-secondary text-muted-foreground")}>
                        {project.status}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">{project.theme}</span>
                    </div>
                    <h3 className="font-semibold text-foreground text-sm leading-snug">{project.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{project.description}</p>

                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-muted-foreground">{project.teamCount} teams total</span>
                      {project.openTeamCount > 0 ? (
                        <span className="text-xs font-semibold text-status-available">{project.openTeamCount} teams open</span>
                      ) : (
                        <span className="text-xs font-semibold text-status-full">All full</span>
                      )}
                      <span className="text-xs text-muted-foreground">⏱ {project.deadline}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <span className="text-xs font-semibold text-primary inline-flex items-center gap-1">
                    View Teams <ChevronRight size={12} />
                  </span>
                </div>
              </button>
            ))}
          </div>

          {courseProjects.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No projects found for this course.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CourseProjects;
