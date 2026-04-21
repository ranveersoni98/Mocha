"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useSession } from "@/lib/store";

const ticketTypes = [
  "Incident",
  "Service",
  "Feature",
  "Bug",
  "Maintenance",
  "Access",
  "Feedback",
];

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

interface OptionRecord {
  id: string;
  name: string;
  email?: string;
  role?: string;
}

export default function NewTicketPage() {
  const { user } = useSession();
  const [clients, setClients] = useState<OptionRecord[]>([]);
  const [engineers, setEngineers] = useState<OptionRecord[]>([]);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    detail: "",
    company: "",
    engineer: "",
    priority: "medium",
    type: "Bug",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [clientsResponse, usersResponse] = await Promise.all([
          api<{ clients?: OptionRecord[] }>("/api/v1/clients/all"),
          api<{ users?: OptionRecord[] }>("/api/v1/users/all"),
        ]);
        setClients(clientsResponse.clients ?? []);
        setEngineers(usersResponse.users ?? []);
      } catch (error) {
        setStatus(
          error instanceof Error ? error.message : "Failed to load ticket metadata.",
        );
      }
    };
    void load();
  }, []);

  const canSubmit = useMemo(
    () => Boolean(form.name && form.email && form.title && form.detail),
    [form],
  );

  const createTicket = async () => {
    if (!user) {
      setStatus("You need to be signed in to create an internal ticket.");
      return;
    }
    if (!canSubmit) {
      setStatus("Fill out the required fields first.");
      return;
    }

    const selectedEngineer = engineers.find(
      (engineer) => engineer.id === form.engineer,
    );

    setSubmitting(true);
    setStatus("");

    try {
      const response = await api<{ success?: boolean; error?: string }>(
        "/api/v1/ticket/create",
        {
          method: "POST",
          json: {
            name: form.name,
            title: form.title,
            company: form.company || undefined,
            email: form.email,
            detail: form.detail,
            priority: form.priority,
            engineer: selectedEngineer,
            type: form.type,
            createdBy: {
              id: user.id,
              name: user.name,
              role: user.isAdmin ? "admin" : "member",
              email: user.email,
            },
          },
        },
      );

      setStatus(
        response.success
          ? "Ticket created successfully."
          : (response.error ?? "Ticket creation failed."),
      );
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Ticket creation failed.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-10 max-w-4xl w-full">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Create issue
        </h1>
        <p className="text-zinc-500 text-base">
          Log a new issue and assign it to the right engineer.
        </p>
      </div>

      <Card className="rounded-2xl border-white/5 bg-[#09090b] shadow-none overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-[#0a0a0c] px-6 py-5">
          <CardTitle className="text-lg font-medium">Issue details</CardTitle>
          <CardDescription className="text-zinc-500">
            Fill in the contact info, assignment, and describe the problem.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2 p-6">
          <Field label="Contact name" required>
            <Input
              id="new-name"
              value={form.name}
              onChange={(e) =>
                setForm((c) => ({ ...c, name: e.target.value }))
              }
              placeholder="Jane Smith"
              className="h-11 rounded-xl bg-white/[0.04] border-white/10 text-white placeholder-zinc-600 focus-visible:ring-1 focus-visible:ring-violet-500/50"
            />
          </Field>

          <Field label="Contact email" required>
            <Input
              id="new-email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((c) => ({ ...c, email: e.target.value }))
              }
              placeholder="jane@company.com"
              className="h-11 rounded-xl bg-white/[0.04] border-white/10 text-white placeholder-zinc-600 focus-visible:ring-1 focus-visible:ring-violet-500/50"
            />
          </Field>

          <Field label="Client">
            <Select
              value={form.company}
              onValueChange={(v) => setForm((c) => ({ ...c, company: v }))}
            >
              <SelectTrigger
                id="new-client"
                className="h-11 rounded-xl bg-white/[0.04] border-white/10 text-zinc-300 focus:ring-1 focus:ring-violet-500/50"
              >
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Engineer">
            <Select
              value={form.engineer}
              onValueChange={(v) => setForm((c) => ({ ...c, engineer: v }))}
            >
              <SelectTrigger
                id="new-engineer"
                className="h-11 rounded-xl bg-white/[0.04] border-white/10 text-zinc-300 focus:ring-1 focus:ring-violet-500/50"
              >
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {engineers.map((engineer) => (
                  <SelectItem key={engineer.id} value={engineer.id}>
                    {engineer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Issue type">
            <Select
              value={form.type}
              onValueChange={(v) => setForm((c) => ({ ...c, type: v }))}
            >
              <SelectTrigger
                id="new-type"
                className="h-11 rounded-xl bg-white/[0.04] border-white/10 text-zinc-300 focus:ring-1 focus:ring-violet-500/50"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ticketTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Priority">
            <Select
              value={form.priority}
              onValueChange={(v) => setForm((c) => ({ ...c, priority: v }))}
            >
              <SelectTrigger
                id="new-priority"
                className="h-11 rounded-xl bg-white/[0.04] border-white/10 text-zinc-300 focus:ring-1 focus:ring-violet-500/50"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="md:col-span-2 space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="new-title"
              value={form.title}
              onChange={(e) =>
                setForm((c) => ({ ...c, title: e.target.value }))
              }
              placeholder="Brief one-line summary of the issue"
              className="h-11 rounded-xl bg-white/[0.04] border-white/10 text-white placeholder-zinc-600 focus-visible:ring-1 focus-visible:ring-violet-500/50"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Issue details <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="new-detail"
              rows={7}
              value={form.detail}
              onChange={(e) =>
                setForm((c) => ({ ...c, detail: e.target.value }))
              }
              placeholder="Describe the issue in detail — steps to reproduce, expected behaviour, etc."
              className="rounded-xl bg-white/[0.04] border-white/10 text-white placeholder-zinc-600 resize-none focus-visible:ring-1 focus-visible:ring-violet-500/50"
            />
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-4 border-t border-white/5 bg-[#0a0a0c] px-6 py-4">
          <p className="text-sm text-zinc-500">{status}</p>
          <Button
            id="new-submit"
            onClick={() => void createTicket()}
            disabled={submitting || !canSubmit}
            className="rounded-full px-8 h-10 font-semibold bg-white text-black hover:bg-zinc-200 disabled:opacity-40"
          >
            {submitting ? "Creating..." : "Create ticket"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      {children}
    </div>
  );
}
