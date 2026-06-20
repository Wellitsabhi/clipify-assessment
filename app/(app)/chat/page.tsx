"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button, Spinner } from "@/app/components/ui";
import { SendIcon, SparkleIcon } from "@/app/components/icons";
import { api } from "@/app/lib/api";
import type { Recipe } from "@/app/lib/types";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  recipe?: Recipe | null;
}

const SUGGESTIONS = [
  "A high-protein dinner under 30 minutes",
  "Something vegan with chickpeas",
  "A cozy soup for a cold night",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api<{ messages: Message[] }>("/api/chat")
      .then((data) => setMessages(data.messages ?? []))
      .catch(() => {})
      .finally(() => setBooting(false));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setLoading(true);

    try {
      const data = await api<{ message: string; recipe: Recipe | null }>("/api/chat", {
        method: "POST",
        body: { message },
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message, recipe: data.recipe },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ ${(e as Error).message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 sm:px-6">
      <div className="flex items-center gap-3 border-b border-border py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-accent to-citrus text-white shadow-(--shadow-sm)">
          <SparkleIcon size={18} />
        </span>
        <div>
          <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
            Chef Ferraro
          </h1>
          <p className="text-sm text-muted">
            Describe what you&apos;re craving and I&apos;ll cook up a recipe for your catalog.
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto py-6">
        {booting ? (
          <div className="flex justify-center pt-10">
            <Spinner className="h-5 w-5 text-subtle" />
          </div>
        ) : messages.length === 0 ? (
          <div className="pt-10 text-center">
            <p className="text-4xl">👨‍🍳</p>
            <p className="mt-4 text-foreground">What should we cook today?</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-(--border-strong) bg-surface px-3.5 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent-hover"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => <Bubble key={msg.id ?? i} msg={msg} />)
        )}

        {loading && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-border bg-surface px-4 py-3.5 text-sm text-muted">
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-accent"
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </span>
              Chef Ferraro is cooking…
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-border py-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Chef Ferraro anything…"
            className="flex-1 rounded-full border border-(--border-strong) bg-surface px-4 py-3 text-sm text-foreground placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-(--accent-ring)/50"
          />
          <Button
            type="submit"
            size="lg"
            disabled={loading || !input.trim()}
            className="rounded-full px-5"
            aria-label="Send message"
          >
            <SendIcon size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`max-w-[85%] ${isUser ? "" : "space-y-3"}`}>
        <div
          className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "rounded-br-sm bg-accent text-white"
              : "rounded-bl-sm border border-border bg-surface text-foreground"
          }`}
        >
          {msg.content}
        </div>
        {msg.recipe && (
          <Link
            href={`/recipes/${msg.recipe.id}`}
            className="flex items-center gap-3 rounded-xl border border-border bg-accent-soft p-3 transition-colors hover:border-accent"
          >
            <img
              src={msg.recipe.imageUrl}
              alt={msg.recipe.title}
              className="h-12 w-12 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="text-xs font-medium text-accent-hover">Recipe added to your catalog</p>
              <p className="truncate text-sm font-semibold text-foreground">{msg.recipe.title}</p>
            </div>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
