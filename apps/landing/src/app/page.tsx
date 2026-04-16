"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Code2,
  Globe,
  Lock,
  Mail,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";

const navigation = [
  { name: "Docs", href: "https://mocha-docs.embrly.ca/" },
  { name: "GitHub", href: "https://github.com/EmberlyOSS/Mocha" },
  { name: "Discord", href: "https://discord.gg/36spBmzZVB" },
];

const features = [
  {
    name: "Webhooks & Notifications",
    description:
      "Connect to third-party services using webhooks and various providers, including email integration.",
    icon: Bell,
  },
  {
    name: "Mailbox Integration",
    description:
      "Configure SMTP/IMAP mailboxes to fetch emails and automatically convert them into tickets.",
    icon: Mail,
  },
  {
    name: "OIDC Authentication",
    description:
      "Connect your existing identity provider with built-in OIDC support for single sign-on.",
    icon: Shield,
  },
  {
    name: "Self-Hosted Anywhere",
    description:
      "Deploy in any environment air-gapped, on-prem, or cloud. All features work without an internet connection.",
    icon: Globe,
  },
  {
    name: "Your Data, Your Server",
    description:
      "All data stays on your infrastructure. Nothing is ever transmitted to external servers.",
    icon: Lock,
  },
  {
    name: "Lightweight & Fast",
    description:
      "Runs on minimal resources from a Raspberry Pi to a full Kubernetes cluster.",
    icon: Zap,
  },
];

const highlights = [
  { label: "License", value: "AGPL" },
  { label: "Cloud Required", value: "None" },
  { label: "Open Source", value: "100%" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl">
        <nav className="flex items-center justify-between max-w-6xl px-6 py-4 mx-auto">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-xl">☕</span>
            <span className="text-lg font-semibold tracking-tight">Mocha</span>
          </Link>
          <div className="flex items-center gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                {item.name}
              </a>
            ))}
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main>
        <section className="relative pt-32 pb-20 overflow-hidden sm:pt-40 sm:pb-32">
          {/* Subtle grid background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute top-0 -translate-x-1/2 left-1/2 -z-10 blur-3xl" aria-hidden="true">
              <div
                className="aspect-[1155/678] w-[72rem] bg-gradient-to-tr from-amber-200 to-orange-400 opacity-[0.08] dark:opacity-[0.04]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
          </div>

          <div className="max-w-3xl px-6 mx-auto text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-4 py-1.5 text-sm text-neutral-600 dark:text-neutral-400">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-amber-400"></span>
                <span className="relative inline-flex w-2 h-2 rounded-full bg-amber-500"></span>
              </span>
              Now in early development!
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1]">
              Issue management{" "}
              <span className="text-transparent bg-gradient-to-r from-amber-600 to-orange-500 dark:from-amber-400 dark:to-orange-300 bg-clip-text">
                that just works
              </span>
            </h1>

            <p className="max-w-2xl mx-auto mt-6 text-lg leading-relaxed sm:text-xl text-neutral-600 dark:text-neutral-400">
              A modern, open-source helpdesk and issue tracker built for teams
              that value simplicity, privacy, and control. Self-hosted, forever
              free.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row">
              <a
                href="https://mocha-docs.embrly.ca/docker"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white transition-colors rounded-lg shadow-sm bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100"
                target="_blank"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/EmberlyOSS/Mocha"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border rounded-lg border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                target="_blank"
              >
                <Code2 className="w-4 h-4" />
                View on GitHub
              </a>
            </div>

            {/* Quick deploy command */}
            <div className="max-w-lg mx-auto mt-10">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="h-3.5 w-3.5 text-neutral-500" />
                <span className="text-xs text-neutral-500 dark:text-neutral-500">
                  Deploy with one command
                </span>
              </div>
              <div className="relative px-4 py-3 font-mono text-sm text-left border rounded-lg group border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
                <span className="select-none text-neutral-400 dark:text-neutral-600">
                  ${" "}
                </span>
                docker compose up -d
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard preview */}
        <section className="max-w-5xl px-6 pb-20 mx-auto sm:pb-32">
          <div className="relative p-2 border shadow-2xl rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 shadow-neutral-900/5 dark:shadow-neutral-900/50">
            <Image
              className="w-full rounded-lg"
              src="/dashboard.png"
              alt="Mocha dashboard"
              width={1280}
              height={720}
              priority
            />
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="max-w-6xl px-6 py-16 mx-auto">
            <div className="grid grid-cols-3 gap-8">
              {highlights.map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {item.value}
                  </div>
                  <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-500">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl px-6 py-20 mx-auto sm:py-32">
          <div className="max-w-2xl mx-auto mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need
            </h2>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
              Powerful features out of the box, no plugins required. Built for
              teams that value simplicity and control.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative p-6 transition-colors border group rounded-xl border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
              >
                <div className="mb-4 inline-flex rounded-lg border border-neutral-200 dark:border-neutral-800 p-2.5">
                  <feature.icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                </div>
                <h3 className="text-base font-semibold">{feature.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission / CTA */}
        <section className="border-t border-neutral-200 dark:border-neutral-800">
          <div className="max-w-6xl px-6 py-20 mx-auto sm:py-32">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Built in the open, for everyone
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                Mocha is a free, open-source helpdesk built for teams that
                refuse to pay per-seat. No vendor lock-in, no hidden costs, no
                data leaving your servers. Deploy in minutes and own your
                workflow completely.
              </p>
              <div className="flex items-center justify-center gap-4 mt-10">
                <a
                  href="https://mocha-docs.embrly.ca/docker"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white transition-colors rounded-lg shadow-sm bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100"
                  target="_blank"
                >
                  Deploy Now
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col items-center justify-between max-w-6xl gap-4 px-6 py-8 mx-auto sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-base">☕</span>
            <span className="text-sm font-medium">Mocha</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://mocha-docs.embrly.ca/"
              className="text-sm transition-colors text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              Docs
            </a>
            <a
              href="https://github.com/EmberlyOSS/Mocha"
              className="text-sm transition-colors text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              GitHub
            </a>
            <a
              href="https://discord.gg/36spBmzZVB"
              className="text-sm transition-colors text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              Discord
            </a>
          </div>
          <p className="text-xs text-neutral-400 dark:text-neutral-600">
            &copy; {new Date().getFullYear()} Emberly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
