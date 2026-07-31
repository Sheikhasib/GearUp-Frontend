import { UsersTable } from "../../_components/admin/UsersTable"

const AdminUsersPage = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Users
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage platform accounts
        </p>
      </div>

      <UsersTable />
    </div>
  )
}

export default AdminUsersPage
