"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Send, Search } from "lucide-react";
import { toast } from "sonner";

import { PageTitle } from "@/components/dashboard/page-title";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

import { apiGet, apiPost } from "@/lib/api";
import { formatDate, initials } from "@/lib/utils";

type Conversation = {
  _id: string;
  equipmentName: string;
  customerId: string;
  customerName: string;
  ownerId: string;
  ownerName: string;
  lastMessage: string;
  updatedAt: string;
};

type Message = {
  _id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
};

export default function MessagesPage() {
  const [active, setActive] = useState("");
  const [text, setText] = useState("");

  const qc = useQueryClient();

  // Read conversation ID from URL
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get(
      "conversation"
    );

    if (id) {
      setActive(id);
    }
  }, []);

  // Fetch conversations
  const {
    data: conversations,
    isLoading,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      apiGet<Conversation[]>("/api/conversations", true),
  });

  // Select first conversation automatically
  useEffect(() => {
    if (!active && conversations?.length) {
      setActive(conversations[0]._id);
    }
  }, [active, conversations]);

  // Fetch messages
  const { data: messages } = useQuery({
    queryKey: ["messages", active],
    queryFn: () =>
      apiGet<Message[]>(
        `/api/conversations/${active}/messages`,
        true
      ),
    enabled: Boolean(active),
    refetchInterval: 12000,
  });

  // Send message
  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!text.trim() || !active) return;

    try {
      await apiPost(
        `/api/conversations/${active}/messages`,
        {
          text: text.trim(),
        },
        true
      );

      setText("");

      qc.invalidateQueries({
        queryKey: ["messages", active],
      });

      qc.invalidateQueries({
        queryKey: ["conversations"],
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Message could not be sent"
      );
    }
  }

  return (
    <>
      {/* Page Header */}
      <PageTitle
        eyebrow="COMMUNICATION"
        title="Messages"
        description="Talk directly with equipment owners and customers about rental details."
      />

      {/* Messages Container */}
      <Card className="grid min-h-[620px] overflow-hidden md:grid-cols-[300px_1fr]">
        {/* Conversation Sidebar */}
        <aside className="border-b border-[var(--border)] md:border-b-0 md:border-r">
          {/* Search Input */}
          <div className="border-b border-[var(--border)] p-4">
            <div className="relative">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />

              <Input
                placeholder="Search conversations"
                style={{ paddingLeft: 40 }}
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="max-h-[580px] overflow-y-auto">
            {isLoading ? (
              <p className="p-5 text-xs text-muted">
                Loading conversations…
              </p>
            ) : conversations?.length ? (
              conversations.map((c) => (
                <button
                  key={c._id}
                  onClick={() => setActive(c._id)}
                  className={`flex w-full gap-3 border-b border-[var(--border)] p-4 text-left transition ${
                    active === c._id
                      ? "bg-[var(--orange-soft)]"
                      : "hover:bg-[var(--surface-muted)]"
                  }`}
                >
                  {/* Equipment Avatar */}
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--surface-muted)] text-xs font-black">
                    {initials(c.equipmentName)}
                  </span>

                  {/* Conversation Details */}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-bold">
                      {c.equipmentName}
                    </span>

                    <span className="mt-1 block truncate text-[10px] text-muted">
                      {c.lastMessage || "Start your conversation"}
                    </span>

                    <span className="mt-1 block text-[9px] text-muted">
                      {formatDate(c.updatedAt)}
                    </span>
                  </span>
                </button>
              ))
            ) : (
              <p className="p-5 text-xs leading-6 text-muted">
                No conversations yet. Start a conversation from an
                equipment detail page.
              </p>
            )}
          </div>
        </aside>

        {/* Chat Section */}
        <section className="flex min-h-[560px] flex-col">
          {/* Chat Header */}
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h2 className="font-extrabold">
              {conversations?.find((c) => c._id === active)
                ?.equipmentName || "Choose a conversation"}
            </h2>

            <p className="mt-1 text-[10px] text-muted">
              GearHub direct messaging
            </p>
          </div>

          {active ? (
            <>
              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto bg-[var(--surface-muted)]/50 p-5">
                {messages?.length ? (
                  messages.map((m) => (
                    <div
                      key={m._id}
                      className={`flex ${
                        m.senderId ===
                        conversations?.find(
                          (c) => c._id === active
                        )?.customerId
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      {/* Message Bubble */}
                      <div className="max-w-[78%] rounded-2xl bg-[var(--surface)] px-4 py-3 shadow-sm">
                        <p className="text-[10px] font-bold text-[var(--orange)]">
                          {m.senderName}
                        </p>

                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6">
                          {m.text}
                        </p>

                        <p className="mt-2 text-right text-[9px] text-muted">
                          {formatDate(m.createdAt, {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="grid h-full place-items-center text-center text-sm text-muted">
                    No messages yet. Say hello to get started.
                  </div>
                )}
              </div>

              {/* Message Input */}
              <form
                onSubmit={send}
                className="flex gap-2 border-t border-[var(--border)] p-4"
              >
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write a message…"
                />

                <Button type="submit" disabled={!text.trim()}>
                  <Send size={16} />
                </Button>
              </form>
            </>
          ) : (
            /* Empty Chat State */
            <div className="grid flex-1 place-items-center text-center text-muted">
              <div>
                <MessageCircle
                  size={35}
                  className="mx-auto"
                />

                <p className="mt-3 text-sm font-semibold">
                  Your conversations will appear here.
                </p>
              </div>
            </div>
          )}
        </section>
      </Card>
    </>
  );
}