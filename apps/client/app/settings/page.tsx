"use client";

import {
  PiBellDuotone,
  PiMonitorDuotone,
  PiFlagDuotone,
  PiArrowRightDuotone,
} from "react-icons/pi";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const settingsSections = [
  {
    href: "/settings/notifications",
    icon: PiBellDuotone,
    title: "Notification preferences",
    description: "Control which email and in-app alerts you receive.",
    accent: "from-violet-500/15 to-indigo-500/5 border-violet-500/20",
    iconColor: "text-violet-400",
    glow: "group-hover:shadow-violet-500/20",
  },
  {
    href: "/settings/sessions",
    icon: PiMonitorDuotone,
    title: "Sessions",
    description: "Review all active devices and revoke old sessions.",
    accent: "from-blue-500/15 to-cyan-500/5 border-blue-500/20",
    iconColor: "text-blue-400",
    glow: "group-hover:shadow-blue-500/20",
  },
  {
    href: "/settings/flags",
    icon: PiFlagDuotone,
    title: "Feature flags",
    description: "Client-side toggles for experimental or legacy features.",
    accent: "from-emerald-500/15 to-teal-500/5 border-emerald-500/20",
    iconColor: "text-emerald-400",
    glow: "group-hover:shadow-emerald-500/20",
  },
];

export default function SettingsPage() {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-8 pb-10">
        {/* ── Header ── */}
        <div className="space-y-0.5">
          <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
          <p className="text-zinc-500">
            Configure and personalise your Mocha experience.
          </p>
        </div>

        <Separator className="bg-white/5" />

        {/* ── Section cards ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {settingsSections.map(
            ({ href, icon: Icon, title, description, accent, iconColor, glow }) => (
              <Tooltip key={href}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-[#09090b] p-6 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.025] hover:shadow-xl ${glow}`}
                  >
                    {/* Gradient icon bg */}
                    <div
                      className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border bg-gradient-to-br ${accent}`}
                    >
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>

                    <div className="space-y-1.5">
                      <p className="font-semibold text-white">{title}</p>
                      <p className="text-sm text-zinc-500 leading-relaxed">
                        {description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-zinc-700 group-hover:text-zinc-400 transition-colors">
                      Configure
                      <PiArrowRightDuotone className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">{title}</TooltipContent>
              </Tooltip>
            ),
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
