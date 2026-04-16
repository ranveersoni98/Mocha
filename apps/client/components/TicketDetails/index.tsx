// @ts-nocheck
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/shadcn/ui/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/shadcn/ui/context-menu";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { getCookie } from "cookies-next";
import moment from "moment";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import Frame from "react-frame-component";
import { useQuery } from "react-query";
import { useDebounce } from "use-debounce";

import { toast } from "@/shadcn/hooks/use-toast";
import { hasAccess } from "@/shadcn/lib/hasAccess";
import { cn } from "@/shadcn/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import { Button } from "@/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { Switch } from "@/shadcn/ui/switch";
import {
  CheckIcon,
  CircleCheck,
  CircleDotDashed,
  Ellipsis,
  Eye,
  EyeOff,
  LifeBuoy,
  Loader,
  LoaderCircle,
  Lock,
  PanelTopClose,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Trash2,
  Unlock,
} from "lucide-react";
import { useUser } from "../../store/session";
import { ClientCombo, IconCombo, UserCombo } from "../Combo";

const ticketStatusMap = [
  { id: 0, value: "hold", name: "Hold", icon: CircleDotDashed },
  { id: 1, value: "needs_support", name: "Needs Support", icon: LifeBuoy },
  { id: 2, value: "in_progress", name: "In Progress", icon: CircleDotDashed },
  { id: 3, value: "in_review", name: "In Review", icon: Loader },
  { id: 4, value: "done", name: "Done", icon: CircleCheck },
];

const priorityOptions = [
  {
    id: "1",
    name: "Low",
    value: "low",
    icon: SignalLow,
  },
  {
    id: "2",
    name: "Medium",
    value: "medium",
    icon: SignalMedium,
  },
  {
    id: "1",
    name: "High",
    value: "high",
    icon: SignalHigh,
  },
];

export default function Ticket() {
  const router = useRouter();
  const { t } = useTranslation("mocha");

  const token = getCookie("session");

  const { user } = useUser();

  const fetchTicketById = async () => {
    const id = router.query.id;
    const res = await fetch(`/api/v1/ticket/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    hasAccess(res);

    return res.json();
  };

  const { data, status, refetch } = useQuery("fetchTickets", fetchTicketById, {
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, [router]);

  const [initialContent, setInitialContent] = useState<
    PartialBlock[] | undefined | "loading"
  >("loading");

  const editor = useMemo(() => {
    if (initialContent === "loading") {
      return undefined;
    }
    return BlockNoteEditor.create({ initialContent });
  }, [initialContent]);

  const [edit, setEdit] = useState(false);
  const [editTime, setTimeEdit] = useState(false);
  const [assignedEdit, setAssignedEdit] = useState(false);
  const [labelEdit, setLabelEdit] = useState(false);

  const [users, setUsers] = useState<any>();
  const [clients, setClients] = useState<any>();
  const [n, setN] = useState<any>();

  const [note, setNote] = useState<any>();
  const [issue, setIssue] = useState<any>();
  const [title, setTitle] = useState<any>();
  // const [uploaded, setUploaded] = useState<any>();
  const [priority, setPriority] = useState<any>();
  const [ticketStatus, setTicketStatus] = useState<any>();
  const [comment, setComment] = useState<any>();
  const [timeSpent, setTimeSpent] = useState<any>();
  const [publicComment, setPublicComment] = useState<any>(false);
  const [timeReason, setTimeReason] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [assignedClient, setAssignedClient] = useState<any>();

  const history = useRouter();

  const { id } = history.query;

  async function update() {
    if (data && data.ticket && data.ticket.locked) return;

    const res = await fetch(`/api/v1/ticket/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id,
        detail: JSON.stringify(debouncedValue),
        note,
        title: debounceTitle,
        priority: priority?.value,
        status: ticketStatus?.value,
      }),
    }).then((res) => res.json());

    if (!res.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.message || "Failed to update ticket",
      });
      return;
    }
    setEdit(false);
  }

  async function updateStatus() {
    if (data && data.ticket && data.ticket.locked) return;

    const res = await fetch(`/api/v1/ticket/status/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: !data.ticket.isComplete,
        id,
      }),
    }).then((res) => res.json());

    if (!res.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.message || "Failed to update status",
      });
      return;
    }
    refetch();
  }

  async function hide(hidden) {
    if (data && data.ticket && data.ticket.locked) return;

    const res = await fetch(`/api/v1/ticket/status/hide`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        hidden,
        id,
      }),
    }).then((res) => res.json());

    if (!res.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.message || "Failed to update visibility",
      });
      return;
    }
    refetch();
  }

  async function lock(locked) {
    const res = await fetch(`/api/v1/ticket/status/lock`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        locked,
        id,
      }),
    }).then((res) => res.json());

    if (!res.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.message || "Failed to update lock status",
      });
      return;
    }
    refetch();
  }

  async function deleteIssue() {
    await fetch(`/api/v1/ticket/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          toast({
            variant: "default",
            title: "Issue Deleted",
            description: "The issue has been deleted",
          });
          router.push("/issues");
        }
      });
  }

  async function addComment() {
    if (data && data.ticket && data.ticket.locked) return;

    const res = await fetch(`/api/v1/ticket/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: comment,
        id,
        public: publicComment,
      }),
    }).then((res) => res.json());

    if (!res.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.message || "Failed to add comment",
      });
      return;
    }
    refetch();
  }

  async function deleteComment(id: string) {
    await fetch(`/api/v1/ticket/comment/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          refetch();
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete comment",
          });
        }
      });
  }

  async function addTime() {
    if (data && data.ticket && data.ticket.locked) return;

    await fetch(`/api/v1/time/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        time: timeSpent,
        ticket: id,
        title: timeReason,
        user: user.id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setTimeEdit(false);
          refetch();
          toast({
            variant: "default",
            title: "Time Added",
            description: "Time has been added to the ticket",
          });
        }
      });
  }

  async function fetchUsers() {
    const res = await fetch(`/api/v1/users/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());

    if (!res.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.message || "Failed to fetch users",
      });
      return;
    }

    if (res.users) {
      setUsers(res.users);
    }
  }

  async function fetchClients() {
    const res = await fetch(`/api/v1/clients/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());

    if (!res.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.message || "Failed to fetch clients",
      });
      return;
    }

    console.log(res);

    if (res.clients) {
      setClients(res.clients);
    }
  }

  async function subscribe() {
    if (data && data.ticket && data.ticket.locked) return;

    const isFollowing = data.ticket.following?.includes(user.id);
    const action = isFollowing ? "unsubscribe" : "subscribe";

    const res = await fetch(`/api/v1/ticket/${action}/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());

    if (!res.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.message || `Failed to ${action} to issue`,
      });
      return;
    }

    toast({
      title: isFollowing ? "Unsubscribed" : "Subscribed",
      description: isFollowing
        ? "You will no longer receive updates"
        : "You will now receive updates",
      duration: 3000,
    });

    refetch();
  }

  async function transferTicket() {
    if (data && data.ticket && data.ticket.locked) return;
    if (n === undefined) return;

    const res = await fetch(`/api/v1/ticket/transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user: n ? n.id : undefined,
        id,
      }),
    }).then((res) => res.json());

    if (!res.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.message || "Failed to transfer ticket",
      });
      return;
    }

    setAssignedEdit(false);
    refetch();
  }

  async function transferClient() {
    if (data && data.ticket && data.ticket.locked) return;
    if (assignedClient === undefined) return;

    const res = await fetch(`/api/v1/ticket/transfer/client`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        client: assignedClient ? assignedClient.id : undefined,
        id,
      }),
    }).then((res) => res.json());

    if (!res.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.message || "Failed to transfer client",
      });
      return;
    }

    setAssignedEdit(false);
    refetch();
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user", user.id);

      try {
        // You can write the URL of your server or any other endpoint used for file upload
        const result = await fetch(
          `/api/v1/storage/ticket/${router.query.id}/upload/single`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await result.json();

        if (data.success) {
          setFile(null);
          refetch();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    handleUpload();
  }, [file]);

  useEffect(() => {
    fetchUsers();
    fetchClients();
  }, []);

  useEffect(() => {
    transferTicket();
  }, [n]);

  useEffect(() => {
    transferClient();
  }, [assignedClient]);

  const [debouncedValue] = useDebounce(issue, 500);
  const [debounceTitle] = useDebounce(title, 500);

  useEffect(() => {
    update();
  }, [priority, ticketStatus, debounceTitle]);

  useEffect(() => {
    if (issue) {
      update();
    }
  }, [debouncedValue]);

  async function loadFromStorage() {
    const storageString = data.ticket.detail as PartialBlock[];
    // if (storageString && isJsonString(storageString)) {
    //   return JSON.parse(storageString) as PartialBlock[]
    // } else {
    //   return undefined;
    // }
    try {
      // @ts-ignore
      return JSON.parse(storageString) as PartialBlock[];
    } catch (e) {
      return undefined;
    }
  }

  async function convertHTML() {
    const blocks = (await editor.tryParseHTMLToBlocks(
      data.ticket.detail
    )) as PartialBlock[];
    editor.replaceBlocks(editor.document, blocks);
  }

  // Loads the previously stored editor contents.
  useEffect(() => {
    if (status === "success" && data && data.ticket) {
      loadFromStorage().then((content) => {
        if (typeof content === "object") {
          setInitialContent(content);
        } else {
          setInitialContent(undefined);
        }
      });
    }
  }, [status, data]);

  useEffect(() => {
    if (initialContent === undefined) {
      convertHTML();
    }
  }, [initialContent]);

  if (editor === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  const handleInputChange = (editor) => {
    if (data.ticket.locked) return;
    setIssue(editor.document);
  };

  async function updateTicketStatus(e: any, ticket: any) {
    await fetch(`/api/v1/ticket/status/update`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: ticket.id, status: !ticket.isComplete }),
    })
      .then((res) => res.json())
      .then(() => {
        toast({
          title: ticket.isComplete ? "Issue re-opened" : "Issue closed",
          description: "The status of the issue has been updated.",
          duration: 3000,
        });
        refetch();
      });
  }

  // Add these new functions
  async function updateTicketAssignee(ticketId: string, user: any) {
    try {
      const response = await fetch(`/api/v1/ticket/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: user ? user.id : undefined,
          id: ticketId,
        }),
      });

      if (!response.ok) throw new Error("Failed to update assignee");

      toast({
        title: "Assignee updated",
        description: `Transferred issue successfully`,
        duration: 3000,
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update assignee",
        variant: "destructive",
        duration: 3000,
      });
    }
  }

  async function updateTicketPriority(ticket: any, priority: string) {
    try {
      const response = await fetch(`/api/v1/ticket/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: ticket.id,
          detail: ticket.detail,
          note: ticket.note,
          title: ticket.title,
          priority: priority,
          status: ticket.status,
        }),
      }).then((res) => res.json());

      if (!response.success) throw new Error("Failed to update priority");

      toast({
        title: "Priority updated",
        description: `Ticket priority set to ${priority}`,
        duration: 3000,
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update priority",
        variant: "destructive",
        duration: 3000,
      });
    }
  }

  const priorities = ["low", "medium", "high"];

  return (
    <div>
      {status === "loading" && (
        <div className="flex flex-col items-center justify-center min-h-screen py-12 sm:px-6 lg:px-8">
          <h2> Loading data ... </h2>
          {/* <Spin /> */}
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center min-h-screen py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold"> Error fetching data ... </h2>
        </div>
      )}

      {status === "success" && (
        <ContextMenu>
          <ContextMenuTrigger>
            <main className="flex-1 min-h-[90vh] py-8">
              <div className="flex flex-col justify-center w-full px-4 mx-auto max-w-7xl lg:flex-row">
                <div className="lg:border-r lg:pr-8 lg:w-2/3">
                  <div className="md:flex md:justify-between md:space-x-4 lg:border-b lg:pb-4">
                    <div className="w-full">
                      <div className="flex flex-row space-x-1">
                        <h1 className="text-2xl mt-[5px] font-bold text-foreground">
                          #{data.ticket.Number} -
                        </h1>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          style={{ fontSize: "1.5rem" }}
                          className="border-none -mt-[1px] px-0 pl-0.5 w-3/4 truncated m block text-foreground bg-transparent font-bold focus:outline-none focus:ring-0 placeholder:text-primary sm:text-sm sm:leading-6"
                          value={title}
                          defaultValue={data.ticket.title}
                          onChange={(e) => setTitle(e.target.value)}
                          key={data.ticket.id}
                          disabled={data.ticket.locked}
                        />
                      </div>
                      <div className="flex flex-row items-center justify-between mt-2 space-x-1 text-xs">
                        <div className="flex flex-row items-center space-x-1">
                          {data.ticket.client && (
                            <div>
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-orange-600 rounded-md bg-orange-500/10 ring-1 ring-inset ring-orange-500/20">
                                {data.ticket.client.name}
                              </span>
                            </div>
                          )}
                          <div>
                            {!data.ticket.isComplete ? (
                              <div className="flex items-center space-x-2">
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-muted text-foreground ring-1 ring-inset ring-border">
                                  {t("open_issue")}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 rounded-md bg-red-500/10 ring-1 ring-inset ring-red-500/20">
                                  {t("closed_issue")}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-orange-600 rounded-md bg-orange-500/10 ring-1 ring-inset ring-orange-500/20">
                              {data.ticket.type}
                            </span>
                          </div>
                          {data.ticket.hidden && (
                            <div>
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 rounded-md bg-blue-500/10 ring-1 ring-inset ring-blue-500/20">
                                Hidden
                              </span>
                            </div>
                          )}
                          {data.ticket.locked && (
                            <div>
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 rounded-md bg-red-500/10 ring-1 ring-inset ring-red-500/20">
                                Locked
                              </span>
                            </div>
                          )}
                        </div>
                        {user.isAdmin && (
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex items-center px-2 py-1 text-xs font-medium outline-none text-foreground ring-none ">
                              <Ellipsis className="w-4 h-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="min-w-[160px]"
                            >
                              <DropdownMenuLabel>
                                <span>Issue Actions</span>
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {data.ticket.hidden ? (
                                <DropdownMenuItem
                                  className="flex flex-row items-center space-x-3"
                                  onClick={() => hide(false)}
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>Show Issue</span>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="flex flex-row items-center space-x-3"
                                  onClick={() => hide(true)}
                                >
                                  <EyeOff className="w-4 h-4" />
                                  <span>Hide Issue</span>
                                </DropdownMenuItem>
                              )}
                              {data.ticket.locked ? (
                                <DropdownMenuItem
                                  className="flex flex-row items-center space-x-3"
                                  onClick={() => lock(false)}
                                >
                                  <Unlock className="w-4 h-4" />
                                  <span>Unlock Issue</span>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="flex flex-row items-center space-x-3"
                                  onClick={() => lock(true)}
                                >
                                  <Lock className="w-4 h-4" />
                                  <span>Lock Issue</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="flex flex-row items-center space-x-3 transition-colors duration-200 focus:bg-red-500 focus:text-primary-foreground"
                                onClick={() => deleteIssue()}
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="">Delete Issue</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </div>
                  <aside className="mt-4 lg:hidden">
                    <div className="pb-1 border-b">
                      <div className="pt-1 border-t">
                        <div className="flex flex-col space-x-2 sm:flex-row">
                          <div className="ml-2">
                            {users && (
                              <UserCombo
                                value={users}
                                update={setN}
                                defaultName={
                                  data.ticket.assignedTo
                                    ? data.ticket.assignedTo.name
                                    : ""
                                }
                                disabled={data.ticket.locked}
                                placeholder="Assign User..."
                                hideInitial={false}
                                showIcon={true}
                              />
                            )}
                          </div>

                          <IconCombo
                            value={priorityOptions}
                            update={setPriority}
                            defaultName={
                              data.ticket.priority ? data.ticket.priority : ""
                            }
                            disabled={data.ticket.locked}
                            hideInitial={false}
                          />

                          <UserCombo
                            value={ticketStatusMap}
                            update={setTicketStatus}
                            defaultName={
                              data.ticket.status ? data.ticket.status : ""
                            }
                            disabled={data.ticket.locked}
                            showIcon={true}
                            placeholder="Change Client..."
                            hideInitial={false}
                          />
                        </div>
                      </div>
                    </div>
                  </aside>
                  <div className="py-3 xl:pb-0 xl:pt-2 ">
                    <div className="mt-2 prose max-w-none">
                      {!data.ticket.fromImap ? (
                        <>
                          <BlockNoteView
                            editor={editor}
                            sideMenu={false}
                            className="p-0 m-0 bg-transparent"
                            onChange={handleInputChange}
                            editable={!data.ticket.locked}
                          />
                        </>
                      ) : (
                        <div className="">
                          <div className="break-words rounded-md bg-card">
                            <Frame
                              className="min-h-[60vh] h-full max-h-[80vh] overflow-y-auto w-full"
                              initialContent={data.ticket.detail}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <section
                    aria-labelledby="activity-title "
                    className="mt-4 border-t"
                  >
                    <div className="flex flex-col p-2 space-y-1">
                      <div className="flex flex-row items-center justify-between">
                        <span
                          id="activity-title"
                          className="text-base font-medium "
                        >
                          Activity
                        </span>

                        <div className="flex flex-row items-center space-x-2">
                          <Button
                            variant={
                              data.ticket.following?.includes(user.id)
                                ? "ghost"
                                : "ghost"
                            }
                            onClick={() => subscribe()}
                            size="sm"
                            className="flex items-center gap-1 group"
                          >
                            {data.ticket.following?.includes(user.id) ? (
                              <>
                                <span className="text-xs group-hover:hidden">
                                  following
                                </span>
                                <span className="hidden text-xs group-hover:inline text-destructive">
                                  unsubscribe
                                </span>
                              </>
                            ) : (
                              <span className="text-xs">follow</span>
                            )}
                          </Button>

                          {data.ticket.following &&
                            data.ticket.following.length > 0 && (
                              <div className="flex space-x-2">
                                <Popover>
                                  <PopoverTrigger>
                                    <PanelTopClose className="w-4 h-4" />
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    <div className="flex flex-col space-y-1">
                                      <span className="text-xs">Followers</span>
                                      {data.ticket.following.map(
                                        (follower: any) => {
                                          const userMatch = users.find(
                                            (user) =>
                                              user.id === follower &&
                                              user.id !==
                                                data.ticket.assignedTo.id
                                          );
                                          console.log(userMatch);
                                          return userMatch ? (
                                            <div key={follower.id}>
                                              <span>{userMatch.name}</span>
                                            </div>
                                          ) : null;
                                        }
                                      )}

                                      {data.ticket.following.filter(
                                        (follower: any) =>
                                          follower !== data.ticket.assignedTo.id
                                      ).length === 0 && (
                                        <span className="text-xs">
                                          This issue has no followers
                                        </span>
                                      )}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            )}
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-row items-center space-x-1 text-sm">
                          {data.ticket.fromImap ? (
                            <>
                              <span className="font-bold">
                                {data.ticket.email}
                              </span>
                              <span>created via email at </span>
                              <span className="font-bold">
                                {moment(data.ticket.createdAt).format(
                                  "DD/MM/YYYY"
                                )}
                              </span>
                            </>
                          ) : (
                            <>
                              {data.ticket.createdBy ? (
                                <div className="flex flex-row space-x-1">
                                  <span>
                                    Created by
                                    <strong className="ml-1">
                                      {data.ticket.createdBy.name}
                                    </strong>{" "}
                                    at{" "}
                                  </span>
                                  <span className="">
                                    {moment(data.ticket.createdAt).format(
                                      "LLL"
                                    )}
                                  </span>
                                  {data.ticket.name && (
                                    <span>
                                      for <strong>{data.ticket.name}</strong>
                                    </span>
                                  )}
                                  {data.ticket.email && (
                                    <span>
                                      ( <strong>{data.ticket.email}</strong> )
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div className="flex flex-row space-x-1">
                                  <span>Created at </span>
                                  <span className="">
                                    <strong>
                                      {moment(data.ticket.createdAt).format(
                                        "LLL"
                                      )}
                                    </strong>
                                    {data.ticket.client && (
                                      <span>
                                        for{" "}
                                        <strong>
                                          {data.ticket.client.name}
                                        </strong>
                                      </span>
                                    )}
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="">
                        <ul role="list" className="space-y-2">
                          {data.ticket.comments.length > 0 &&
                            data.ticket.comments.map((comment: any) => (
                              <li
                                key={comment.id}
                                className="relative flex flex-col px-4 py-2 space-y-1 text-sm rounded-lg group bg-secondary/50 dark:bg-secondary/50"
                              >
                                <div className="flex flex-row items-center space-x-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage
                                      src={
                                        comment.user ? comment.user.image : ""
                                      }
                                    />
                                    <AvatarFallback>
                                      {comment.user
                                        ? comment.user.name.slice(0, 1)
                                        : comment.replyEmail.slice(0, 1)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-bold">
                                    {comment.user
                                      ? comment.user.name
                                      : comment.replyEmail}
                                  </span>
                                  <span className="text-xs lowercase">
                                    {moment(comment.createdAt).format("LLL")}
                                  </span>
                                  {(user.isAdmin ||
                                    (comment.user &&
                                      comment.userId === user.id)) && (
                                    <Trash2
                                      className="absolute w-4 h-4 transition-opacity opacity-0 cursor-pointer top-2 right-2 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                                      onClick={() => {
                                        deleteComment(comment.id);
                                      }}
                                    />
                                  )}
                                </div>
                                <span className="ml-1">{comment.text}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                      <div className="mt-6">
                        <div className="flex space-x-3">
                          <div className="flex-1 min-w-0">
                            <div>
                              <div>
                                <label htmlFor="comment" className="sr-only">
                                  {t("comment")}
                                </label>
                                <textarea
                                  id="comment"
                                  name="comment"
                                  rows={3}
                                  className="block w-full bg-secondary/50 dark:bg-secondary/50 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-background focus:ring-0 focus:ring-inset focus:ring-ring sm:text-sm sm:leading-6"
                                  placeholder={
                                    data.ticket.locked
                                      ? "This ticket is locked"
                                      : "Leave a comment"
                                  }
                                  defaultValue={""}
                                  onChange={(e) => setComment(e.target.value)}
                                  disabled={data.ticket.locked}
                                />
                              </div>
                              <div className="flex justify-end mt-4">
                                <div>
                                  <div className="flex flex-row items-center space-x-2">
                                    <Switch
                                      checked={publicComment}
                                      onCheckedChange={setPublicComment}
                                    />
                                    <span> Public Reply</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center justify-end mt-4 space-x-4">
                                {data.ticket.isComplete ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!data.ticket.locked) {
                                        updateStatus();
                                      }
                                    }}
                                    disabled={data.ticket.locked}
                                    className={`inline-flex justify-center items-center gap-x-1.5 rounded-md ${
                                      data.ticket.locked
                                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                                        : "bg-card hover:bg-accent"
                                    } px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border`}
                                  >
                                    <CheckCircleIcon
                                      className="-ml-0.5 h-5 w-5 text-red-500"
                                      aria-hidden="true"
                                    />
                                    <span className="">
                                      {t("reopen_issue")}
                                    </span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!data.ticket.locked) {
                                        updateStatus();
                                      }
                                    }}
                                    disabled={data.ticket.locked}
                                    className={`inline-flex justify-center gap-x-1.5 rounded-md ${
                                      data.ticket.locked
                                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                                        : "bg-card hover:bg-accent"
                                    } px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border`}
                                  >
                                    <CheckCircleIcon
                                      className="-ml-0.5 h-5 w-5 text-green-500"
                                      aria-hidden="true"
                                    />
                                    {t("close_issue")}
                                  </button>
                                )}
                                <button
                                  onClick={() => addComment()}
                                  type="submit"
                                  disabled={data.ticket.locked}
                                  className={`inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring transition-colors ${
                                    data.ticket.locked
                                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                                      : "bg-primary hover:bg-primary/90"
                                  }`}
                                >
                                  {t("comment")}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                <div className="order-1 hidden lg:block lg:pl-8 lg:order-2">
                  <h2 className="sr-only">{t("details")}</h2>
                  <div className="py-2 space-y-1">
                    {users && (
                      <UserCombo
                        value={users}
                        update={setN}
                        defaultName={
                          data.ticket.assignedTo
                            ? data.ticket.assignedTo.name
                            : ""
                        }
                        disabled={data.ticket.locked}
                        showIcon={true}
                        placeholder="Change User..."
                        hideInitial={false}
                      />
                    )}
                    <IconCombo
                      value={priorityOptions}
                      update={setPriority}
                      defaultName={
                        data.ticket.priority ? data.ticket.priority : ""
                      }
                      disabled={data.ticket.locked}
                      hideInitial={false}
                    />
                    <IconCombo
                      value={ticketStatusMap}
                      update={setTicketStatus}
                      defaultName={data.ticket.status ? data.ticket.status : ""}
                      disabled={data.ticket.locked}
                      hideInitial={false}
                    />
                    {clients && (
                      <ClientCombo
                        value={clients}
                        update={setAssignedClient}
                        defaultName={
                          data.ticket.client
                            ? data.ticket.client.name
                            : "No Client Assigned"
                        }
                        disabled={data.ticket.locked}
                        showIcon={true}
                        hideInitial={false}
                      />
                    )}

                    {/* <div className="border-t border-border">
                  <div className="flex flex-row items-center justify-between mt-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Time Tracking
                    </span>
                    {!editTime ? (
                      <button
                        onClick={() => setTimeEdit(true)}
                        className="text-sm font-medium text-muted-foreground hover:underline"
                      >
                        add
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setTimeEdit(false);
                          addTime();
                        }}
                        className="text-sm font-medium text-muted-foreground hover:underline"
                      >
                        save
                      </button>
                    )}
                  </div>
                  {data.ticket.TimeTracking.length > 0 ? (
                    data.ticket.TimeTracking.map((i: any) => (
                      <div key={i.id} className="text-xs">
                        <div className="flex flex-row space-x-1.5 items-center">
                          <span>{i.user.name} / </span>
                          <span>{i.time} minutes</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>
                      <span className="text-xs">
                        No Time added
                      </span>
                    </div>
                  )}
                  {editTime && (
                    <div>
                      <div className="flex flex-col mt-2 space-y-2">
                        <input
                          type="text"
                          name="text"
                          id="timespent_text"
                          className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-ring sm:text-sm sm:leading-6"
                          placeholder="What did you do?"
                          value={timeReason}
                          onChange={(e) => setTimeReason(e.target.value)}
                        />
                        <input
                          type="number"
                          name="number"
                          id="timespent"
                          className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-ring sm:text-sm sm:leading-6"
                          placeholder="Time in minutes"
                          value={timeSpent}
                          onChange={(e) => setTimeSpent(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div> */}
                    {/* <div className="border-t border-border">
                  <div className="flex flex-row items-center justify-between mt-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Attachments
                    </span>
                    <button
                      className="text-sm font-medium text-muted-foreground hover:underline"
                      onClick={handleButtonClick}
                    >
                      upload
                      <input
                        id="file"
                        type="file"
                        hidden
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                    </button>
                  </div>

                  <>
                    {data.ticket.files.length > 0 &&
                      data.ticket.files.map((file: any) => (
                        <div className="px-1 p-1/2 hover:bg-muted hover:cursor-pointer">
                          <span className="text-xs">{file.filename}</span>
                        </div>
                      ))}
                    {file && (
                      <div className="px-1 p-1/2">
                        <span className="text-xs">{file.name}</span>
                      </div>
                    )}
                  </>
                </div> */}
                  </div>
                </div>
              </div>
            </main>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-52">
            <ContextMenuItem
              onClick={(e) => updateTicketStatus(e, data.ticket)}
            >
              {data.ticket.isComplete ? "Re-open Issue" : "Close Issue"}
            </ContextMenuItem>
            <ContextMenuSeparator />

            <ContextMenuSub>
              <ContextMenuSubTrigger>Assign To</ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-64 ml-1 -mt-1/2">
                <Command>
                  <CommandList>
                    <CommandGroup heading="Assigned To">
                      <CommandItem
                        onSelect={() =>
                          updateTicketAssignee(data.ticket.id, undefined)
                        }
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            data.ticket.assignedTo === null
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <CheckIcon className={cn("h-4 w-4")} />
                        </div>
                        <span>Unassigned</span>
                      </CommandItem>
                      {users?.map((user) => (
                        <CommandItem
                          key={user.id}
                          onSelect={() =>
                            updateTicketAssignee(data.ticket.id, user)
                          }
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              data.ticket.assignedTo?.name === user.name
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <CheckIcon className={cn("h-4 w-4")} />
                          </div>
                          <span>{user.name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuSub>
              <ContextMenuSubTrigger>Change Priority</ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-64 ml-1">
                <Command>
                  <CommandList>
                    <CommandGroup heading="Priority">
                      {priorities.map((priority) => (
                        <CommandItem
                          key={priority}
                          onSelect={() =>
                            updateTicketPriority(data.ticket, priority)
                          }
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              data.ticket.priority.toLowerCase() === priority
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <CheckIcon className={cn("h-4 w-4")} />
                          </div>
                          <span className="capitalize">{priority}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuSeparator />

            <ContextMenuItem
              onClick={(e) => {
                e.preventDefault();
                toast({
                  title: "Link copied to clipboard",
                  description: "You can now share the link with others.",
                  duration: 3000,
                });
                navigator.clipboard.writeText(
                  `${window.location.origin}/issue/${data.ticket.id}`
                );
              }}
            >
              Share Link
            </ContextMenuItem>

            <ContextMenuSeparator />

            {user.isAdmin && (
              <ContextMenuItem
                className="text-red-600"
                onClick={(e) => deleteIssue()}
              >
                Delete Ticket
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        </ContextMenu>
      )}
    </div>
  );
}
