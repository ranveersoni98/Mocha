import Link from "next/link";
import { useEffect, useState } from "react";

import useTranslation from "next-translate/useTranslation";

import { useRouter } from "next/router";

import { getCookie } from "cookies-next";
import moment from "moment";
import { useUser } from "../store/session";

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation("mocha");

  const { user } = useUser();
  const token = getCookie("session");

  const [hour, setHour] = useState<number>();
  const [openTickets, setOpenTickets] = useState(0);
  const [completedTickets, setCompletedTickets] = useState(0);
  const [unassigned, setUnassigned] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any>();

  let file: any;

  async function time() {
    const date = new Date();
    const hour = date.getHours();
    setHour(hour);
  }

  async function getOpenTickets() {
    await fetch(`/api/v1/data/tickets/open`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setOpenTickets(res.count);
      });
  }

  async function getCompletedTickets() {
    await fetch(`/api/v1/data/tickets/completed`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setCompletedTickets(res.count);
      });
  }

  async function getUnassginedTickets() {
    await fetch(`/api/v1/data/tickets/unassigned`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setUnassigned(res.count);
      });
  }

  async function fetchTickets() {
    await fetch(`/api/v1/tickets/open`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setTickets(res.tickets);
      });
  }

  const stats = [
    { name: "Open Issues", stat: openTickets, href: "/issues" },
    {
      name: "Completed Issues",
      stat: completedTickets,
      href: "/issues?filter=closed",
    },
    {
      name: "Unassigned Issues",
      stat: unassigned,
      href: "/issues?filter=unassigned",
    },
  ];

  async function datafetch() {
    Promise.all([
      fetchTickets(),
      getOpenTickets(),
      getCompletedTickets(),
      getUnassginedTickets(),
    ]);
    await setLoading(false);
  }

  useEffect(() => {
    time();
    datafetch();
  }, []);

  return (
    <div className="flex flex-col xl:flex-row p-8 justify-center w-full">
      <div className="w-full xl:w-[70%] max-w-5xl">
        <div className="block sm:hidden mb-4">
          {user.isAdmin && (
            <Link href="https://github.com/EmberlyOSS/Mocha/releases">
              <span className="inline-flex items-center rounded-md bg-muted px-3 py-2 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border">
                Version {process.env.NEXT_PUBLIC_CLIENT_VERSION}
              </span>
            </Link>
          )}
        </div>
        {!loading && (
          <>
            <div>
              <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {stats.map((item) => (
                  <Link href={item.href}>
                    <div
                      key={item.name}
                      className="px-4 py-5 bg-card border border-border shadow-sm rounded-lg overflow-hidden sm:p-6 hover:bg-accent transition-colors"
                    >
                      <dt className="text-sm font-medium text-muted-foreground truncate">
                        {item.name}
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-foreground">
                        {item.stat}
                      </dd>
                    </div>
                  </Link>
                ))}
              </dl>
            </div>

            <div className="flex w-full flex-col mt-4 px-1 mb-4">
              {tickets !== undefined && tickets.length === 0 ? (
                <>
                  <button
                    type="button"
                    className="relative block w-full rounded-lg border-2 border-dashed border-border p-12 text-center hover:border-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <svg
                      className="mx-auto h-12 w-12 text-muted-foreground"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                      />
                    </svg>
                    <span className="mt-2 block text-sm font-semibold text-foreground">
                      Create your first Issue
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <span className="font-bold text-2xl">Recent Issues</span>
                  <div className="-mx-4 sm:-mx-0 w-full">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-0"
                          >
                            {t("title")}
                          </th>
                          <th
                            scope="col"
                            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-foreground lg:table-cell"
                          >
                            {t("priority")}
                          </th>
                          <th
                            scope="col"
                            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-foreground sm:table-cell"
                          >
                            {t("status")}
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-foreground"
                          >
                            {t("created")}
                          </th>

                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-foreground"
                          >
                            {t("assigned_to")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {tickets !== undefined &&
                          tickets.slice(0, 10).map((item: any) => (
                            <tr
                              key={item.id}
                              className="hover:bg-accent hover:cursor-pointer transition-colors"
                              onClick={() => router.push(`/issue/${item.id}`)}
                            >
                              <td className="sm:max-w-[280px] 2xl:max-w-[720px] truncate py-1 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-0">
                                {item.title}
                                <dl className="font-normal lg:hidden">
                                  <dt className="sr-only sm:hidden">Email</dt>
                                  <dd className="mt-1 truncate text-muted-foreground sm:hidden">
                                    {item.email}
                                  </dd>
                                </dl>
                              </td>
                              <td className="hidden px-3 py-1 text-sm text-muted-foreground lg:table-cell w-[64px]">
                                {item.priority === "Low" && (
                                  <span className="inline-flex w-full justify-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700  ring-1 ring-inset ring-blue-600/20">
                                    {item.priority}
                                  </span>
                                )}
                                {item.priority === "Normal" && (
                                  <span className="inline-flex items-center w-full justify-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    {item.priority}
                                  </span>
                                )}
                                {item.priority === "High" && (
                                  <span className="inline-flex items-center w-full justify-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                    {item.priority}
                                  </span>
                                )}
                              </td>
                              <td className="hidden px-3 py-1 text-sm text-muted-foreground sm:table-cell w-[64px]">
                                {item.isComplete === true ? (
                                  <div>
                                    <span className="inline-flex items-center gap-x-1.5 rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                                      <svg
                                        className="h-1.5 w-1.5 fill-red-500"
                                        viewBox="0 0 6 6"
                                        aria-hidden="true"
                                      >
                                        <circle cx={3} cy={3} r={3} />
                                      </svg>
                                      {t("closed")}
                                    </span>
                                  </div>
                                ) : (
                                  <>
                                    <span className="inline-flex items-center gap-x-1.5 rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                      <svg
                                        className="h-1.5 w-1.5 fill-green-500"
                                        viewBox="0 0 6 6"
                                        aria-hidden="true"
                                      >
                                        <circle cx={3} cy={3} r={3} />
                                      </svg>
                                      {t("open")}
                                    </span>
                                  </>
                                )}
                              </td>
                              <td className="px-3 py-1 text-sm text-muted-foreground w-[110px]">
                                {moment(item.createdAt).format("DD/MM/YYYY")}
                              </td>
                              <td className="px-3 py-1 text-sm text-muted-foreground w-[130px] truncate whitespace-nowrap">
                                {item.assignedTo ? item.assignedTo.name : "-"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
