export type TeamStatus = "Available" | "In Conversations" | "Committed";
export type TeamCardStatus = "Open" | "Partial" | "Full";
export type Program = "MBA" | "MBAn" | "LGO" | "MFin" | "MSMS" | "PhD";

export interface Student {
  id: string;
  name: string;
  program: Program;
  email: string;
  bio: string;
  education: string;
  skills: string[];
  industries: string[];
  goals: string;
  preferredRoles: string[];
  workingStyle: string[];
  communicationPrefs: string[];
  weeklyAvailability: string;
  teamStatus: TeamStatus;
  avatar: string; // initials
  avatarUrl?: string; // optional uploaded/selected avatar URL
  currentCourses: string[]; // course IDs
  linkedinUrl?: string;
}

export interface Course {
  id: string;
  name: string;
  number: string;
  description: string;
  professor: string;
  semester: string;
  teamFormationDeadline: string;
  projectCount: number;
  openTeamCount: number;
}

export interface Project {
  id: string;
  courseId: string;
  title: string;
  description: string;
  theme: string;
  teamCount: number;
  openTeamCount: number;
  status: string;
  deadline: string;
}

export interface TeamMember {
  studentId: string;
  role: string;
}

export interface Team {
  id: string;
  projectId: string;
  name: string;
  members: TeamMember[];
  currentSize: number;
  maxSize: number;
  openRoles: string[];
  workingStyleSummary: string;
  status: TeamCardStatus;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  content: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  messages: Message[];
  lastMessage: string;
  lastTimestamp: string;
  unread: number;
}
