import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GearSix, Lifebuoy, Student } from "@phosphor-icons/react/dist/ssr"

const helpTopics = [
  {
    icon: GearSix,
    title: "Renting & Booking",
    description:
      "Find the right gear, place a rental order, and manage your bookings from the customer dashboard.",
  },
  {
    icon: Student,
    title: "Listing Gear",
    description:
      "Providers can publish gear, set daily rates, and track incoming orders from the provider dashboard.",
  },
  {
    icon: Lifebuoy,
    title: "Account & Support",
    description:
      "Update your profile, change your password, or get in touch with our support team for help.",
  },
]

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Everything you need to get the most out of GearUp. Choose a topic
        below, or contact our support team for assistance.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {helpTopics.map((topic) => (
          <Card key={topic.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <topic.icon className="text-primary" />
                {topic.title}
              </CardTitle>
              <CardDescription>{topic.description}</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}