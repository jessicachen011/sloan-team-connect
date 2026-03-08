import React, { createContext, useContext, useState, useCallback } from "react";
import type { Student, Team, Conversation } from "@/types";
import {
  students as initialStudents,
  courses,
  projects,
  teams as initialTeams,
  conversations as initialConversations,
  CURRENT_USER_ID,
} from "@/data/dummy";

interface AppState {
  currentUserId: string;
  students: Student[];
  courses: typeof courses;
  projects: typeof projects;
  teams: Team[];
  conversations: Conversation[];
  selectedCourseId: string | null;
  selectedProjectId: string | null;
  selectedTeamId: string | null;
  selectedStudentId: string | null;
  activeConversationId: string | null;
  committedTeamId: string | null;
  pendingTeamIds: string[];
  isOnboarded: boolean;
  isLoggedIn: boolean;
  addedCourseIds: string[];
}

interface AppActions {
  login: () => void;
  setOnboarded: () => void;
  setSelectedCourse: (id: string | null) => void;
  setSelectedProject: (id: string | null) => void;
  setSelectedTeam: (id: string | null) => void;
  setSelectedStudent: (id: string | null) => void;
  setActiveConversation: (id: string | null) => void;
  joinTeam: (teamId: string) => void;
  requestToJoinTeam: (teamId: string) => void;
  sendMessage: (conversationId: string | null, receiverId: string, content: string) => void;
  openOrCreateDM: (receiverId: string) => string;
  openOrCreateGroupChat: (memberIds: string[]) => string;
  addCourse: (courseId: string) => void;
  removeCourse: (courseId: string) => void;
  updateProfile: (updates: Partial<Student>) => void;
  updateAvatar: (avatarUrl: string) => void;
  getCurrentUser: () => Student;
}

const AppContext = createContext<(AppState & AppActions) | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    currentUserId: CURRENT_USER_ID,
    students: initialStudents,
    courses,
    projects,
    teams: initialTeams,
    conversations: initialConversations,
    selectedCourseId: null,
    selectedProjectId: null,
    selectedTeamId: null,
    selectedStudentId: null,
    activeConversationId: null,
    committedTeamId: null,
    pendingTeamIds: [],
    isOnboarded: false,
    isLoggedIn: false,
    addedCourseIds: ["c1", "c3"],
  });

  const login = useCallback(() => setState(s => ({ ...s, isLoggedIn: true })), []);
  const setOnboarded = useCallback(() => setState(s => ({ ...s, isOnboarded: true })), []);
  const setSelectedCourse = useCallback((id: string | null) => setState(s => ({ ...s, selectedCourseId: id })), []);
  const setSelectedProject = useCallback((id: string | null) => setState(s => ({ ...s, selectedProjectId: id })), []);
  const setSelectedTeam = useCallback((id: string | null) => setState(s => ({ ...s, selectedTeamId: id })), []);
  const setSelectedStudent = useCallback((id: string | null) => setState(s => ({ ...s, selectedStudentId: id })), []);
  const setActiveConversation = useCallback((id: string | null) => setState(s => ({
    ...s,
    activeConversationId: id,
    conversations: id
      ? s.conversations.map(c => c.id === id ? { ...c, unread: 0, messages: c.messages.map(m => ({ ...m, read: true })) } : c)
      : s.conversations,
  })), []);
  const addCourse = useCallback((courseId: string) => setState(s => ({
    ...s, addedCourseIds: s.addedCourseIds.includes(courseId) ? s.addedCourseIds : [...s.addedCourseIds, courseId],
  })), []);
  const removeCourse = useCallback((courseId: string) => setState(s => ({
    ...s, addedCourseIds: s.addedCourseIds.filter(id => id !== courseId),
  })), []);

  const updateProfile = useCallback((updates: Partial<Student>) => {
    setState(s => ({
      ...s,
      students: s.students.map(st => st.id === s.currentUserId ? { ...st, ...updates } : st),
    }));
  }, []);

  const updateAvatar = useCallback((avatarUrl: string) => {
    setState(s => ({
      ...s,
      students: s.students.map(st => st.id === s.currentUserId ? { ...st, avatarUrl } : st),
    }));
  }, []);

  const joinTeam = useCallback((teamId: string) => {
    setState(s => {
      const newTeams = s.teams.map(t => {
        if (t.id !== teamId) return t;
        const alreadyMember = t.members.some(m => m.studentId === s.currentUserId);
        if (alreadyMember) return t;
        const updatedMembers = [...t.members, { studentId: s.currentUserId, role: "PM / Coordinator" }];
        const newSize = updatedMembers.length;
        return {
          ...t,
          members: updatedMembers,
          currentSize: newSize,
          status: newSize >= t.maxSize ? "Full" : "Open",
        } as Team;
      });
      const newStudents = s.students.map(st =>
        st.id === s.currentUserId ? { ...st, teamStatus: "Committed" as const } : st
      );
      return { ...s, teams: newTeams, students: newStudents, committedTeamId: teamId };
    });
  }, []);

  const requestToJoinTeam = useCallback((teamId: string) => {
    setState(s => ({
      ...s,
      pendingTeamIds: s.pendingTeamIds.includes(teamId) ? s.pendingTeamIds : [...s.pendingTeamIds, teamId],
    }));
  }, []);

  const sendMessage = useCallback((conversationId: string | null, receiverId: string, content: string) => {
    setState(s => {
      const newMsg = {
        id: `m_${Date.now()}`,
        senderId: s.currentUserId,
        receiverId,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        content,
        read: false,
      };
      if (conversationId) {
        const updatedConvs = s.conversations.map(c => {
          if (c.id !== conversationId) return c;
          return { ...c, messages: [...c.messages, newMsg], lastMessage: content, lastTimestamp: "Just now", unread: 0 };
        });
        return { ...s, conversations: updatedConvs };
      } else {
        const newConv: Conversation = {
          id: `conv_${Date.now()}`,
          participantIds: [s.currentUserId, receiverId],
          messages: [newMsg],
          lastMessage: content,
          lastTimestamp: "Just now",
          unread: 0,
        };
        return { ...s, conversations: [...s.conversations, newConv], activeConversationId: newConv.id };
      }
    });
  }, []);

  // Opens an existing 1:1 DM or creates one and sets it active — returns the conv id
  const openOrCreateDM = useCallback((receiverId: string): string => {
    let convId = "";
    setState(s => {
      const existing = s.conversations.find(c =>
        c.participantIds.length === 2 &&
        c.participantIds.includes(s.currentUserId) &&
        c.participantIds.includes(receiverId)
      );
      if (existing) {
        convId = existing.id;
        return { ...s, activeConversationId: existing.id };
      }
      const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        participantIds: [s.currentUserId, receiverId],
        messages: [],
        lastMessage: "",
        lastTimestamp: "Just now",
        unread: 0,
      };
      convId = newConv.id;
      return { ...s, conversations: [...s.conversations, newConv], activeConversationId: newConv.id };
    });
    return convId;
  }, []);

  // Opens an existing group chat with exactly these members, or creates one
  const openOrCreateGroupChat = useCallback((memberIds: string[]): string => {
    const allIds = Array.from(new Set([...memberIds]));
    let convId = "";
    setState(s => {
      const existing = s.conversations.find(c =>
        c.participantIds.length === allIds.length &&
        allIds.every(id => c.participantIds.includes(id))
      );
      if (existing) {
        convId = existing.id;
        return { ...s, activeConversationId: existing.id };
      }
      const newConv: Conversation = {
        id: `group_${Date.now()}`,
        participantIds: allIds,
        messages: [],
        lastMessage: "",
        lastTimestamp: "Just now",
        unread: 0,
      };
      convId = newConv.id;
      return { ...s, conversations: [...s.conversations, newConv], activeConversationId: newConv.id };
    });
    return convId;
  }, []);

  const getCurrentUser = useCallback(() => {
    return state.students.find(s => s.id === state.currentUserId)!;
  }, [state.students, state.currentUserId]);

  return (
    <AppContext.Provider value={{
      ...state,
      login, setOnboarded, setSelectedCourse, setSelectedProject, setSelectedTeam,
      setSelectedStudent, setActiveConversation, joinTeam, requestToJoinTeam, sendMessage,
      openOrCreateDM, openOrCreateGroupChat, addCourse, removeCourse, updateProfile, updateAvatar, getCurrentUser,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
