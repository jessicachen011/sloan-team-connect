import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import { ChevronRight, Bell } from "lucide-react";
import AvatarChip from "@/components/AvatarChip";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { courses, addedCourseIds, conversations, setSelectedCourse, getCurrentUser } = useApp();
  const user = getCurrentUser();

  const myCourses = courses.filter(c => addedCourseIds.includes(c.id));
  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  const handleCourse = (courseId: string) => {
    setSelectedCourse(courseId);
    navigate(`/courses/${courseId}/projects`);
  };

  return (
    <Layout>
      <div className="flex flex-col page-content">
        {/* Header */}
        <div className="header-gradient px-5 pt-12 pb-7">
          <div className="flex items-center justify-between mb-5">
            {/* Large SloanSync branding */}
            <h1 className="text-3xl font-extrabold text-primary-foreground tracking-tight">SloanSync</h1>
            <button
              onClick={() => navigate("/messages")}
              className="relative w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-all"
            >
              <Bell size={18} />
              {totalUnread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-status-partial text-status-partial-bg text-[9px] font-bold flex items-center justify-center">
                  {totalUnread}
                </span>
              )}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <AvatarChip initials={user.avatar} name={user.name} size="md" avatarUrl={user.avatarUrl} />
            <div>
              <p className="text-primary-foreground/70 text-xs font-medium">Good morning,</p>
              <p className="text-primary-foreground font-bold text-lg leading-tight">{user.name.split(" ")[0]} 👋</p>
            </div>
          </div>
        </div>

        {/* Section: Your Courses */}
        <div className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground">My Courses</h2>
            <span className="text-xs text-muted-foreground font-medium">Spring 2026</span>
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
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-wider">{course.number}</span>
                    <h3 className="font-semibold text-foreground text-sm leading-snug mt-0.5">{course.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-muted-foreground">{course.projectCount} projects</span>
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

          {myCourses.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No courses added yet.</p>
              <button onClick={() => navigate("/add-courses")} className="mt-3 text-primary text-sm font-semibold">
                Add a course →
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
