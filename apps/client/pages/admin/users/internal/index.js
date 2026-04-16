import { getCookie } from "cookies-next";
import Link from "next/link";
import React from "react";
import { useQuery } from "react-query";
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useTable,
} from "react-table";
import ResetPassword from "../../../../components//ResetPassword";
import UpdateUserModal from "../../../../components/UpdateUserModal";

const fetchUsers = async (token) => {
  const res = await fetch(`/api/v1/users/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return res.json();
};

function DefaultColumnFilter({ column: { filterValue, setFilter } }) {
  return (
    // <input
    //   className="shadow-sm focus:ring-ring focus:border-ring block w-full sm:text-sm border-border rounded-md bg-background"
    //   type="text"
    //   value={filterValue || ""}
    //   autoComplete="off"
    //   onChange={(e) => {
    //     setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
    //   }}
    //   placeholder="Type to filter"
    // />
    <></>
  );
}
function Table({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      // fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) =>
        rows.filter((row) => {
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
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      initialState: {
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
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  key={headerGroup.headers.map((header) => header.id)}
                >
                  {headerGroup.headers.map((column) =>
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
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="bg-card">
                    {row.cells.map((cell) => (
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

          {data.legnth > 10 && (
            <nav
              className="bg-card px-4 py-3 flex items-center justify-between border-t border-border sm:px-6 bg-background"
              aria-label="Pagination"
            >
              <div className="hidden sm:block">
                <div className="flex flex-row flex-nowrap w-full space-x-2">
                  <p
                    htmlFor="location"
                    className="block text-sm font-medium text-foreground mt-4"
                  >
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

export default function UserAuthPanel() {
  const token = getCookie("session");
  const { data, status, refetch } = useQuery("fetchAuthUsers", () =>
    fetchUsers(token)
  );

  async function deleteUser(id) {
    try {
      await fetch(`/api/v1/auth/user/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then(() => {
          refetch();
        });
    } catch (error) {
      console.log(error);
    }
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        width: 10,
        id: "name",
      },
      {
        Header: "Email",
        accessor: "email",
        id: "email",
      },
      {
        Header: "",
        id: "actions",
        Cell: ({ row }) => {
          return (
            <div className="space-x-4 flex flex-row">
              <UpdateUserModal user={row.original} />
              <ResetPassword user={row.original} />
              {row.original.isAdmin ? null : (
                <button
                  type="button"
                  onClick={() => deleteUser(row.original.id)}
                  className="inline-flex items-center px-4 py-1.5 border font-semibold border-border shadow-sm text-xs rounded text-white bg-red-700 hover:bg-red-500 bg-background"
                >
                  Delete
                </button>
              )}
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
              Internal Users
            </h1>
          </div>
          <div className="px-4 sm:px-6 md:px-0">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto mt-4">
                <p className="mt-2 text-sm text-foreground">
                  A list of all internal users of your instance.
                </p>
              </div>
              <div className="sm:ml-16 mt-5 sm:flex-none">
                <Link
                  href="/admin/users/internal/new"
                  className="rounded bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-accent bg-background"
                >
                  New User
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
                    <Table columns={columns} data={data.users} />
                  </div>
                  <div className="sm:hidden">
                    {data.users.map((user) => (
                      <div
                        key={user.id}
                        className="flex flex-col text-center bg-card rounded-lg shadow mt-4"
                      >
                        <div className="flex-1 flex flex-col p-8">
                          <h3 className=" text-foreground text-sm font-medium">
                            {user.name}
                          </h3>
                          <dl className="mt-1 flex-grow flex flex-col justify-between">
                            <dd className="text-muted-foreground text-sm">
                              {user.email}
                            </dd>
                            <dt className="sr-only">Role</dt>
                            <dd className="mt-3">
                              <span className="px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                                {user.isAdmin ? "admin" : "user"}
                              </span>
                            </dd>
                          </dl>
                        </div>
                        <div className="space-x-4 flex flex-row justify-center -mt-8 mb-4">
                          <UpdateUserModal
                            user={user}
                            refetch={() => handleRefresh}
                          />
                          <ResetPassword user={user} />
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
