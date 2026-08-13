import { DecorativeConstellation } from "@/components/constellation/decorative-constellation";

export default function DashboardPage() {
  return (
    <>
      {/* Greeting */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          Welcome back, Alex
        </h1>
        <p className="text-sm text-text-secondary">
          Here&apos;s what Constella has found for you. You have 3 new matches
          since last week.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3.5 mb-7">
        {[
          { label: "Alumni Matches", value: "47", change: "+3 this week", color: "indigo" },
          { label: "Clusters Explored", value: "5 / 7", change: "2 remaining", color: "green" },
          { label: "Highest Match", value: "94%", change: "Health Policy cluster", color: "amber" },
          { label: "Saved Paths", value: "8", change: "3 transitions saved", color: "rose" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-space-card border border-border rounded-xl p-[18px_20px]"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] text-text-secondary font-medium">
                {stat.label}
              </span>
            </div>
            <div className="text-[28px] font-bold tracking-tight tabular-nums">
              {stat.value}
            </div>
            <div className="text-xs text-text-tertiary mt-1">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Grid: constellation preview + quick actions | top matches + activity */}
      <div className="grid grid-cols-[1.6fr_1fr] gap-3.5">
        {/* Left column */}
        <div className="flex flex-col gap-3.5">
          {/* Constellation preview */}
          <div className="bg-space-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="text-sm font-semibold">Your Constellation</span>
              <button className="text-xs text-indigo-bright font-medium hover:underline">
                Open Full View
              </button>
            </div>
            <div className="h-60">
              <DecorativeConstellation />
            </div>
          </div>
          {/* Quick actions */}
          <div className="bg-space-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="text-sm font-semibold">Quick Actions</span>
            </div>
            <div className="p-5 grid grid-cols-2 gap-2.5">
              {[
                { label: "Open Explore", desc: "Browse all alumni paths" },
                { label: "Simulate a Pivot", desc: "What if you switched?" },
                { label: "Update Profile", desc: "Add courses or interests" },
                { label: "Saved Paths", desc: "Review your bookmarks" },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex items-center gap-2.5 p-3.5 rounded-[10px] border border-border text-left hover:bg-surface hover:border-border-hover transition-all"
                >
                  <div>
                    <div className="text-[13px] font-semibold">
                      {action.label}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      {action.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3.5">
          {/* Top matches */}
          <div className="bg-space-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="text-sm font-semibold">Top Matches</span>
              <button className="text-xs text-indigo-bright font-medium hover:underline">
                View All
              </button>
            </div>
            <div className="p-5 flex flex-col gap-0.5">
              {[
                { name: "Health Policy Analyst", detail: "Biochem + Public Health, Class of 2022", match: "94%" },
                { name: "UX Researcher", detail: "Psychology + HCI, Class of 2023", match: "91%" },
                { name: "Data Scientist", detail: "Stats + CS, Class of 2021", match: "88%" },
                { name: "Biotech Startup Founder", detail: "Biology + Business, Class of 2020", match: "85%" },
              ].map((path) => (
                <div
                  key={path.name}
                  className="flex items-center gap-3 py-2.5 border-b border-border last:border-none"
                >
                  <div className="w-2 h-2 rounded-full bg-indigo-bright shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold">{path.name}</div>
                    <div className="text-xs text-text-tertiary mt-0.5">
                      {path.detail}
                    </div>
                  </div>
                  <div className="text-xs font-semibold px-2 py-[3px] rounded bg-indigo/15 text-indigo-bright shrink-0">
                    {path.match}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Recent activity */}
          <div className="bg-space-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="text-sm font-semibold">Recent Activity</span>
            </div>
            <div className="p-5 flex flex-col">
              {[
                { text: "Explored Health Policy cluster", time: "2 hours ago" },
                { text: "Simulated Bio \u2192 Public Health transition", time: "Yesterday" },
                { text: "Saved path: UX Researcher (91% match)", time: "2 days ago" },
                { text: "Updated profile with 3 new courses", time: "3 days ago" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 py-3 border-b border-border last:border-none text-[13px]"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-indigo shrink-0 mt-1" />
                    {i < 3 && (
                      <div className="w-px flex-1 bg-border mt-1" />
                    )}
                  </div>
                  <div>
                    <div className="text-text-secondary">{item.text}</div>
                    <div className="text-[11px] text-text-tertiary mt-1">
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
