import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import AvatarChip from "@/components/AvatarChip";
import { ArrowLeft, Send, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const {
    conversations, students, sendMessage,
    activeConversationId, setActiveConversation, currentUserId,
    messageEnteredFromList,
  } = useApp();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConversationId);

  const getOtherParticipant = (conv: typeof conversations[0]) => {
    const otherId = conv.participantIds.find(id => id !== currentUserId) ?? "";
    return students.find(s => s.id === otherId);
  };

  const isGroupConv = (conv: typeof conversations[0]) => conv.participantIds.length > 2;

  const getGroupParticipants = (conv: typeof conversations[0]) =>
    conv.participantIds.filter(id => id !== currentUserId).map(id => students.find(s => s.id === id)).filter(Boolean);

  const getConvLabel = (conv: typeof conversations[0]) => {
    if (isGroupConv(conv)) {
      return getGroupParticipants(conv).map(s => s!.name.split(" ")[0]).join(", ");
    }
    return getOtherParticipant(conv)?.name ?? "Unknown";
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages.length]);

  const handleSend = () => {
    if (!input.trim() || !activeConv) return;
    const otherId = activeConv.participantIds.find(id => id !== currentUserId)!;
    sendMessage(activeConv.id, otherId, input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Conversation List
  if (!activeConv) {
    return (
      <Layout>
        <div className="flex flex-col page-content">
          {/* Header */}
          <div className="header-gradient px-5 pt-12 pb-6">
            <h1 className="text-xl font-bold text-primary-foreground">Messages</h1>
            <p className="text-sm text-primary-foreground/70 mt-1">
              {conversations.reduce((s, c) => s + c.unread, 0)} unread
            </p>
          </div>

          <div className="px-5 pt-4 flex flex-col gap-2">
            {conversations.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-sm">No messages yet.</p>
                <button onClick={() => navigate("/search")} className="mt-3 text-primary text-sm font-semibold">
                  Find students to message →
                </button>
              </div>
            )}
            {conversations.map(conv => {
              const isGroup = isGroupConv(conv);
              const other = !isGroup ? getOtherParticipant(conv) : null;
              const label = getConvLabel(conv);
              const groupParts = isGroup ? getGroupParticipants(conv) : [];
              if (!isGroup && !other) return null;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id, true)}
                  className={cn(
                    "w-full text-left flex items-center gap-3 bg-card rounded-xl border p-4 card-shadow transition-all hover:border-primary/30 active:scale-[0.99]",
                    conv.unread > 0 ? "border-primary/30 bg-primary/5" : "border-border"
                  )}
                >
                  {isGroup ? (
                    <div className="relative w-10 h-10 flex-shrink-0">
                      {groupParts.slice(0, 2).map((p, idx) => (
                        <AvatarChip key={p!.id} initials={p!.avatar} name={p!.name} size="sm" avatarUrl={p!.avatarUrl}
                          className={cn("!w-7 !h-7 text-[10px] absolute border-2 border-card", idx === 0 ? "top-0 left-0" : "bottom-0 right-0")} />
                      ))}
                    </div>
                  ) : (
                    <AvatarChip initials={other!.avatar} name={other!.name} size="md" avatarUrl={other!.avatarUrl} />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn("text-sm font-semibold text-foreground truncate", conv.unread > 0 && "font-bold")}>{label}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[11px] text-muted-foreground">{conv.lastTimestamp}</span>
                        {conv.unread > 0 && (
                          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {isGroup ? `Group · ${conv.participantIds.length} members` : other!.program}
                    </p>
                    {conv.lastMessage && <p className={cn("text-xs mt-1 line-clamp-1", conv.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>{conv.lastMessage}</p>}
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </Layout>
    );
  }

  // Active Conversation
  const isGroup = isGroupConv(activeConv);
  const other = !isGroup ? getOtherParticipant(activeConv) : null;
  const groupParts = isGroup ? getGroupParticipants(activeConv) : [];
  const convLabel = getConvLabel(activeConv);

  return (
    <Layout showNav={false}>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="header-gradient px-5 pt-12 pb-4 flex-shrink-0">
          <button
            onClick={() => {
              setActiveConversation(null);
              if (!messageEnteredFromList) navigate(-1);
            }}
            className="flex items-center gap-1.5 text-primary-foreground/80 hover:text-primary-foreground text-sm mb-3 -ml-1"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          {/* 1:1 DM header */}
          {!isGroup && other && (
            <div className="flex items-center gap-3">
              <AvatarChip initials={other.avatar} name={other.name} size="sm" avatarUrl={other.avatarUrl} className="!w-9 !h-9 text-xs" />
              <div>
                <p className="font-bold text-primary-foreground text-sm">{other.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-available inline-block" />
                  <span className="text-xs text-primary-foreground/70">Online</span>
                </div>
              </div>
              <button
                onClick={() => { navigate(`/students/${other.id}`); }}
                className="ml-auto text-xs text-primary-foreground/70 hover:text-primary-foreground underline underline-offset-2"
              >
                View Profile
              </button>
            </div>
          )}
          {/* Group chat header */}
          {isGroup && (
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                {groupParts.slice(0, 2).map((p, idx) => (
                  <AvatarChip key={p!.id} initials={p!.avatar} name={p!.name} size="sm" avatarUrl={p!.avatarUrl}
                    className={cn("!w-7 !h-7 text-[10px] absolute border-2 border-primary", idx === 0 ? "top-0 left-0" : "bottom-0 right-0")} />
                ))}
              </div>
              <div>
                <p className="font-bold text-primary-foreground text-sm">{convLabel}</p>
                <p className="text-xs text-primary-foreground/70 mt-0.5">
                  Team Chat · {activeConv.participantIds.length} members
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {activeConv.messages.map(msg => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card text-foreground border border-border rounded-bl-sm"
                  )}
                >
                  <p>{msg.content}</p>
                  <p className={cn("text-[10px] mt-1 font-medium", isMe ? "text-primary-foreground/60" : "text-muted-foreground")}>{msg.timestamp}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-border bg-card flex items-end gap-2 flex-shrink-0">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Type a message..."
            className="flex-1 resize-none bg-background border border-input rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all max-h-32"
            style={{ minHeight: "44px" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-40 flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
