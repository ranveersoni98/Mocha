"use client";

import { useMemo, useState } from "react";
import { PiMagnifyingGlassDuotone, PiPlusDuotone } from "react-icons/pi";
import {
  GoIssueOpened,
  GoIssueClosed,
  GoDotFill,
} from "react-icons/go";
import { LuZap, LuBug, LuWrench, LuKey, LuMessageSquare, LuServer } from "react-icons/lu";
import { FiAlertTriangle } from "react-icons/fi";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAllTickets } from "@/hooks/use-tickets";
import type { Ticket } from "@/lib/types";

function priorityStyle(ticket: Ticket) {
  const p = ticket.priority?.toLowerCase();
  if (p === "high" || p === "urgent")
    return { cls: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-red-500" };
  if (p === "medium" || p === "normal")
    return { cls: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-500" };
  return { cls: "bg-zinc-800/80 text-zinc-500 border-white/5", dot: "bg-zinc-600" };
}

function typeIcon(type?: string) {
  switch (type?.toLowerCase()) {
    case "incident": return <FiAlertTriangle className="h-3.5 w-3.5 text-red-400" />;
    case "service": return <LuServer className="h-3.5 w-3.5 text-blue-400" />;
    case "feature": return <LuZap className="h-3.5 w-3.5 text-violet-400" />;
    case "bug": return <LuBug className="h-3.5 w-3.5 text-orange-400" />;
    case "maintenance": return <LuWrench className="h-3.5 w-3.5 text-zinc-400" />;
    case "access": return <LuKey className="h-3.5 w-3.5 text-emerald-400" />;
    case "feedback": return <LuMessageSquare className="h-3.5 w-3.5 text-pink-400" />;
    default: return <GoDotFill className="h-3.5 w-3.5 text-zinc-600" />;
  }
}

export default function IssuesPage() {
  const { data, isLoading } = useAllTickets();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");

  const tickets = useMemo(() => {
    const source = data?.tickets ?? [];
    return source.filter((ticket) => {
      const matchesQuery =
        !query ||
        ticket.title.toLowerCase().includes(query.toLowerCase()) ||
        ticket.id.toLowerCase().includes(query.toLowerCase()) ||
        ticket.assignedTo?.name?.toLowerCase().includes(query.toLowerCase());
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "closed"
            ? Boolean(ticket.isComplete)
            : !ticket.isComplete;
      return matchesQuery && matchesFilter;
    });
  }, [data?.tickets, filter, query]);

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-5 pb-10 max-w-6xl w-full">
        {/* ── Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Issues
            </h1>
            <p className="text-sm text-zinc-500">
              {isLoading ? "Loading…" : `${tickets.length} issue${tickets.length === 1 ? "" : "s"}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter pills */}
            {(["all", "open", "closed"] as const).map((v) => (
              <Tooltip key={v}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setFilter(v)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all ${
                      filter === v
                        ? "bg-white text-black"
                        : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {v === "open" && <GoIssueOpened className="h-3.5 w-3.5" />}
                    {v === "closed" && <GoIssueClosed className="h-3.5 w-3.5" />}
                    {v === "all" && <GoDotFill className="h-3 w-3" />}
                    {v}
                  </button>
                </TooltipTrigger>
                <TooltipContent>Show {v} issues</TooltipContent>
              </Tooltip>
            ))}

            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/new">
                  <Button
                    size="sm"
                    className="h-8 gap-1.5 rounded-full px-4 font-semibold bg-white text-black hover:bg-zinc-200"
                  >
                    <PiPlusDuotone className="h-3.5 w-3.5" />
                    New
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Create a new issue</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="relative">
          <PiMagnifyingGlassDuotone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
          <Input
            id="issues-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, ID, or assignee…"
            className="h-11 pl-11 rounded-xl bg-white/[0.04] border-white/8 text-white placeholder-zinc-600 focus-visible:ring-1 focus-visible:ring-white/15"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-600 hover:text-white transition"
            >
              Clear
            </button>
          )}
        </div>

        {/* ── Table ── */}
        <div className="rounded-2xl border border-white/5 bg-[#09090b] overflow-hidden">
          {/* Column headers */}
          <div className="hidden lg:grid lg:grid-cols-[2rem_minmax(0,1fr)_110px_90px_130px] items-center gap-4 border-b border-white/5 px-5 py-2.5">
            {["", "Title", "Priority", "Status", "Created"].map((h) => (
              <span
                key={h}
                className="text-[10px] font-semibold uppercase tracking-widest text-zinc-700"
              >
                {h}
              </span>
            ))}
          </div>

          {isLoading ? (
            <div className="divide-y divide-white/5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <Skeleton className="h-4 w-4 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-3/4 rounded" />
                    <Skeleton className="h-2.5 w-1/3 rounded" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              ))}
            </div>
          ) : tickets.length ? (
            <ScrollArea className="max-h-[65vh]">
              <div className="divide-y divide-white/[0.04]">
                {tickets.map((ticket) => {
                  const { cls, dot } = priorityStyle(ticket);
                  return (
                    <Link
                      key={ticket.id}
                      href={`/issue/${ticket.id}`}
                      className="group grid gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.025] lg:grid-cols-[2rem_minmax(0,1fr)_110px_90px_130px] items-center"
                    >
                      {/* Type icon */}
                      <div className="hidden lg:flex items-center justify-center opacity-70 group-hover:opacity-100 transition">
                        {typeIcon(ticket.type)}
                      </div>

                      {/* Title */}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                          {ticket.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-zinc-600 flex items-center gap-1.5">
                          <span className="font-mono text-[10px] uppercase text-zinc-500 bg-white/5 px-1 py-px rounded-[3px]">
                            {ticket.id}
                          </span>
                          {ticket.assignedTo?.name ?? "Unassigned"}
                        </p>
                      </div>

                      {/* Priority */}
                      <Badge className={`hidden lg:flex w-fit items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${cls}`}>
                        <GoDotFill className={`h-2 w-2 ${dot.replace("bg-", "text-")}`} />
                        {ticket.priority ?? "Low"}
                      </Badge>

                      {/* Status */}
                      <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold">
                        {ticket.isComplete ? (
                          <>
                            <GoIssueClosed className="h-3.5 w-3.5 text-violet-400" />
                            <span className="text-violet-400">Closed</span>
                          </>
                        ) : (
                          <>
                            <GoIssueOpened className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Open</span>
                          </>
                        )}
                      </div>

                      {/* Date */}
                      <span className="hidden lg:block text-xs text-zinc-600">
                        {new Date(ticket.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center gap-4 py-24 text-center">
              <GoIssueClosed className="h-10 w-10 text-zinc-800" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-zinc-500">
                  No issues matched
                </p>
                <p className="text-xs text-zinc-700">
                  Try adjusting your search or filter.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
