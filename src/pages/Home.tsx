import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";
import { Bell, ChevronRight, Calendar, Users, MessageCircle } from "lucide-react";
import logoSrc from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { courses, addedCourseIds, teams, students, conversations, setSelectedCourse, getCurrentUser } = useApp();
  const user = getCurrentUser();

  const myCourses = courses.filter(c => addedCourseIds.includes(c.id));
  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);
  const availableStudents = students.filter(s => s.id !== user.id && s.teamStatus === "Available").length;
  const openTeams = teams.filter(t => t.status === "Open" || t.status === "Partial").length;

  const handleCourse = (courseId: string) => {
    setSelectedCourse(courseId);
    navigate(`/courses/${courseId}/projects`);
  };

  const deadlineSoon = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff < 14;
  };

  return (
    <Layout>
      <div className="flex flex-col page-content">
        {/* Header */}
        <div className="header-gradient px-5 pt-12 pb-7">
          <div className="flex items-center justify-between mb-5">
            <img src={logoSrc} alt="SloanSync" className="h-7 w-auto brightness-0 invert opacity-90" />
            <button
              onClick={() => navigate("/messages")}
              className="relative w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-all"
            >
              <Bell size={18} />
              {totalUnread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-yellow-400 text-[9px] font-bold text-yellow-900 flex items-center justify-center">
                  {totalUnread}
                </span>
              )}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground font-bold text-sm">
              {user.avatar}
            </div>
            <div>
              <p className="text-primary-foreground/70 text-xs font-medium">Good morning,</p>
              <p className="text-primary-foreground font-bold text-lg leading-tight">{user.name.split(" ")[0]} 👋</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-5 -mt-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Open Teams", value: openTeams, icon: Users, color: "text-status-available" },
              { label: "Students Available", value: availableStudents, icon: Users, color: "text-primary" },
              { label: "Unread Messages", value: totalUnread, icon: MessageCircle, color: "text-status-partial" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-card rounded-xl border border-border p-3 card-shadow text-center">
                <p className={cn("text-2xl font-bold", color)}>{value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Your Courses */}
        <div className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground">My Courses</h2>
            <span className="text-xs text-muted-foreground font-medium">Spring 2025</span>
          </div>

          <div className="flex flex-col gap-3">
            {myCourses.map(course => (
              <button
                key={course.id}
                onClick={() => handleCourse(course.id)}
                className="w-full text-left bg-card rounded-2xl border border-border card-shadow hover:card-shadow-hover hover:border-primary/30 transition-all p-4 group active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary/70 uppercase tracking-wider">{course.number}</span>
                      {deadlineSoon(course.teamFormationDeadline) && (
                        <span className="text-[10px] bg-yellow-100 text-yellow-700 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Calendar size={9} /> Deadline Soon
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground text-sm leading-snug">{course.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{course.description}</p>

                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-muted-foreground">{course.projectCount} projects</span>
                      <span className="text-xs font-semibold text-status-available">{course.openTeamCount} open teams</span>
                      <span className="text-xs text-muted-foreground">⏱ {course.teamFormationDeadline}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <span className="text-xs font-semibold text-primary inline-flex items-center gap-1">
                    View Projects <ChevronRight size={12} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="px-5 mt-6">
          <h2 className="text-base font-bold text-foreground mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => navigate("/search")} className="bg-card border border-border rounded-xl p-4 card-shadow text-left hover:border-primary/30 transition-all active:scale-[0.98]">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Users size={16} className="text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">Find Teammates</p>
              <p className="text-xs text-muted-foreground mt-0.5">{availableStudents} students available</p>
            </button>
            <button onClick={() => navigate("/messages")} className="bg-card border border-border rounded-xl p-4 card-shadow text-left hover:border-primary/30 transition-all active:scale-[0.98]">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <MessageCircle size={16} className="text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">Messages</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {totalUnread > 0 ? `${totalUnread} unread` : "No new messages"}
              </p>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
