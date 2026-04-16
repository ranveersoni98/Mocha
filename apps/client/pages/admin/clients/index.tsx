import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useTable,
} from "react-table";
// import ClientNotesModal from "../../components/ClientNotesModal";
// import UpdateClientModal from "../../components/UpdateClientModal";

const fetchAllClients = async () => {
  const res = await fetch(`/api/v1/clients/all`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("session")}`,
    },
  });
  return res.json();
};

function DefaultColumnFilter({ column: { filterValue, setFilter } }: any) {
  return (
    <input
      className="shadow-sm focus:ring-ring focus:border-ring block w-full sm:text-sm border-border rounded-md bg-background"
      type="text"
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder="Type to filter"
    />
  );
}
function Table({ columns, data }: any) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      // fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows: any, id: any, filterValue: any) =>
        rows.filter((row: any) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        }),
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    //@ts-expect-error
    page,
    prepareRow,
    //@ts-expect-error
    canPreviousPage,
    //@ts-expect-error
    canNextPage,
    //@ts-expect-error
    pageCount,
    //@ts-expect-error
    gotoPage,
    //@ts-expect-error
    nextPage,
    //@ts-expect-error
    previousPage,
    //@ts-expect-error
    setPageSize,
    //@ts-expect-error
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      //@ts-expect-error
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      initialState: {
        //@ts-expect-error
        pageIndex: 0,
      },
    },
    useFilters, // useFilters!
    useGlobalFilter,
    usePagination
  );

  return (
    <div className="overflow-x-auto md:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full md:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-border md:rounded-lg bg-background">
          <table
            {...getTableProps()}
            className="min-w-full divide-y divide-border"
          >
            <thead className="bg-muted">
              {headerGroups.map((headerGroup: any) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  key={headerGroup.headers.map((header: any) => header.id)}
                >
                  {headerGroup.headers.map((column: any) =>
                    column.hideHeader === false ? null : (
                      <th
                        {...column.getHeaderProps()}
                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        {column.render("Header")}
                        {/* Render the columns filter UI */}
                        <div>
                          {column.canFilter ? column.render("Filter") : null}
                        </div>
                      </th>
                    )
                  )}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row: any, i: any) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="bg-card">
                    {row.cells.map((cell: any) => (
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground"
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {data.length > 10 && (
            <nav
              className="bg-card px-4 py-3 flex items-center justify-between border-t border-border sm:px-6 bg-background"
              aria-label="Pagination"
            >
              <div className="hidden sm:block">
                <div className="flex flex-row flex-nowrap w-full space-x-2">
                  <p className="block text-sm font-medium text-foreground mt-4">
                    Show
                  </p>
                  <select
                    id="location"
                    name="location"
                    className="block w-full pl-3 pr-10 text-base border-border focus:outline-none focus:ring-ring focus:border-ring sm:text-sm rounded-md bg-background"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                    }}
                  >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex-1 flex justify-between sm:justify-end">
                <button
                  className="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-card hover:bg-accent bg-background"
                  type="button"
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  Previous
                </button>
                <button
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-card hover:bg-accent bg-background"
                  type="button"
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                >
                  Next
                </button>
              </div>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Clients() {
  const { data, status, refetch } = useQuery(
    "fetchAllClients",
    fetchAllClients
  );

  const router = useRouter();

  async function deleteClient(id: any) {
    await fetch(`/api/v1/clients/${id}/delete-client`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getCookie("session")}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        refetch();
      });
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "Client Name",
        accessor: "name",
        width: 10,
        id: "client_name",
      },
      {
        Header: "Contact Name",
        accessor: "contactName",
        id: "contactName",
      },
      {
        Header: "",
        id: "actions",
        Cell: ({ row, value }: any) => {
          return (
            <div className="space-x-4 flex flex-row">
              {/* <UpdateClientModal client={row.original} />
            <ClientNotesModal notes={row.original.notes} id={row.original.id} /> */}
              <button
                type="button"
                className="rounded bg-card hover:bg-red-100 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:text-white shadow-sm ring-1 ring-inset ring-border bg-background"
                onClick={() => deleteClient(row.original.id)}
              >
                Delete
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <main className="flex-1">
      <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
        <div className="pt-10 pb-16 divide-y-2">
          <div className="px-4 sm:px-6 md:px-0">
            <h1 className="text-3xl font-extrabold text-foreground">
              Clients
            </h1>
          </div>
          <div className="px-4 sm:px-6 md:px-0">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto mt-4">
                <p className="mt-2 text-sm text-foreground">
                  A list of all internal users of your instance.
                </p>
              </div>
              <div className="sm:ml-16 mt-5 flex flex-row space-x-2">
                <Link
                  href={`/submit`}
                  type="button"
                  className="inline-flex items-center px-2.5 py-1.5 border font-semibold border-border shadow-sm text-xs rounded text-foreground bg-card hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring bg-background"
                >
                  Guest Ticket Url
                </Link>
                <Link
                  href={`/portal/`}
                  type="button"
                  className="inline-flex items-center px-2.5 py-1.5 border font-semibold border-border shadow-sm text-xs rounded text-foreground bg-card hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring bg-background"
                >
                  Portal Url
                </Link>
                <Link
                  href={`/auth/register`}
                  type="button"
                  className="inline-flex items-center px-2.5 py-1.5 border font-semibold border-border shadow-sm text-xs rounded text-foreground bg-card hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring bg-background"
                >
                  Portal Register
                </Link>
                <Link
                  href="/admin/clients/new"
                  className="rounded bg-card px-2.5 py-1.5 text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-accent bg-background"
                >
                  New Client
                </Link>
              </div>
            </div>
            <div className="py-4">
              {status === "loading" && (
                <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
                  <h2> Loading data ... </h2>
                </div>
              )}

              {status === "error" && (
                <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
                  <h2 className="text-2xl font-bold">
                    {" "}
                    Error fetching data ...{" "}
                  </h2>
                </div>
              )}

              {status === "success" && (
                <div>
                  <div className="hidden sm:block">
                    <Table columns={columns} data={data.clients} />
                  </div>

                  <div className="sm:hidden">
                    {data.clients.map((client: any) => (
                      <div
                        key={client.id}
                        className="flex flex-col text-center bg-card rounded-lg shadow mt-4"
                      >
                        <div className="flex-1 flex flex-col p-8">
                          <h3 className=" text-foreground text-sm font-medium">
                            {client.name}
                          </h3>
                          <dl className="mt-1 flex-grow flex flex-col justify-between">
                            <dd className="text-muted-foreground text-sm">
                              {client.number}
                            </dd>
                            <dt className="sr-only">Role</dt>
                            <dd className="mt-3">
                              <span>
                                Primary Contact - {client.contactName}
                              </span>
                            </dd>
                          </dl>
                        </div>
                        <div className="space-x-4 align-middle flex flex-row justify-center -mt-8 mb-4">
                          {/* <UpdateClientModal client={client} /> */}
                          {/* <ClientNotesModal
                            notes={client.notes}
                            id={client.id}
                          /> */}
                          {/* <button
                            type="button"
                            className=" inline-flex justify-center rounded-md border border-border shadow-sm px-4 py-2 bg-card text-base font-medium text-foreground hover:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring sm:mt-0 sm:w-auto sm:text-sm bg-background"
                            onClick={() => setOpen(true)}
                          >
                            New Ticket
                          </button> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
