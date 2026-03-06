import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";

import SignIn from "./pages/SignIn";
import AddCourses from "./pages/AddCourses";
import CompleteProfile from "./pages/CompleteProfile";
import Home from "./pages/Home";
import CourseProjects from "./pages/CourseProjects";
import ProjectTeams from "./pages/ProjectTeams";
import SearchStudents from "./pages/SearchStudents";
import StudentProfile from "./pages/StudentProfile";
import Messages from "./pages/Messages";
import TeamConfirmation from "./pages/TeamConfirmation";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/signin" replace />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/add-courses" element={<AddCourses />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/home" element={<Home />} />
            <Route path="/courses/:courseId/projects" element={<CourseProjects />} />
            <Route path="/courses/:courseId/projects/:projectId/teams" element={<ProjectTeams />} />
            <Route path="/search" element={<SearchStudents />} />
            <Route path="/students/:studentId" element={<StudentProfile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/team-confirmation/:teamId" element={<TeamConfirmation />} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
