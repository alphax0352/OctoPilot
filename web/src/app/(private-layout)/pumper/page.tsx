import { PumperForm } from '@/components/pumper/pumper-form'
import { PumperList } from '@/components/pumper/pumper-list'

export default function PumperPage() {
  return (
    <div className="container space-y-8">
      <header className="space-y-2">
        <p className="text-muted-foreground">Auto apply to Jobs with Ease</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="sticky top-8">
            <div className="rounded-lg border bg-card text-card-foreground shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Build Your Pilot</h2>
                <PumperForm />
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xl font-semibold">Your Pilots</h2>
          <PumperList />
        </div>
      </div>
    </div>
  )
}
