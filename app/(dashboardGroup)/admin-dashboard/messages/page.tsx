import { ContactMessagesTable } from "../../_components/admin/ContactMessagesTable"

const AdminMessagesPage = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Messages
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Contact form submissions
        </p>
      </div>

      <ContactMessagesTable />
    </div>
  )
}

export default AdminMessagesPage
