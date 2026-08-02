import { Suspense } from "react"
import { getMe } from "@/service/getMe"
import { ProfileForm } from "./_components/ProfileForm"

const SettingsPage = async () => {
  const result = await getMe()

  if (!result.success || !result.data) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
            🔒
          </div>
          <h2 className="mb-2 text-xl font-semibold text-slate-900">
            Sign in to manage your profile settings
          </h2>
          <p className="mb-6 text-sm text-slate-500">
            You need to be logged in to view and update your account details.
          </p>
          <a
            href="/login?redirectTo=%2Fsettings"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Log In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update your personal information and account security.
        </p>
      </div>
      <Suspense fallback={<div className="text-sm text-slate-500">Loading...</div>}>
        <ProfileForm user={result.data} />
      </Suspense>
    </div>
  )
}

export default SettingsPage
