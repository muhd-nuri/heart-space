import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, ExternalLink } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/page-header"
import { CampaignForm } from "@/components/admin/campaign-form"
import { CampaignUpdates } from "@/components/admin/campaign-updates"
import { DeleteButton } from "@/components/admin/delete-button"
import { prisma } from "@/lib/prisma"
import { deleteCampaign } from "../../actions"

type Props = { params: Promise<{ id: string }> }

export default async function EditCampaignPage({ params }: Props) {
  const { id } = await params
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      updates: { orderBy: { postedAt: "desc" } },
    },
  })
  if (!campaign) notFound()

  return (
    <>
      <AdminPageHeader
        title={campaign.title}
        subtitle={`Last updated ${campaign.createdAt.toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}`}
        actions={
          <>
            <Link
              href={`/campaigns/${campaign.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 rounded-md border border-[var(--color-hairline)] bg-white px-3 py-1.5 text-[0.82rem] font-medium text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-teal)] hover:text-[var(--color-teal-dark)]"
            >
              <ExternalLink size={14} />
              View on site
            </Link>
            <Link
              href="/admin/campaigns"
              className="inline-flex items-center gap-1 rounded-md border border-[var(--color-hairline)] bg-white px-3 py-1.5 text-[0.82rem] font-medium text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            >
              <ChevronLeft size={14} />
              Back to list
            </Link>
          </>
        }
      />
      <div className="max-w-3xl p-6 md:p-8">
        <div className="rounded-md border border-[var(--color-hairline)] bg-white p-6 md:p-8">
          <CampaignForm
            mode={{ kind: "edit", id: campaign.id, raised: campaign.raised }}
            initial={{
              title: campaign.title,
              slug: campaign.slug,
              description: campaign.description,
              image: campaign.image,
              target: campaign.target,
              status: campaign.status as "active" | "draft" | "completed",
              category: campaign.category as "healthcare" | "disaster" | "waqf" | "zakat",
              startDate: campaign.startDate.toISOString().slice(0, 10),
              endDate: campaign.endDate ? campaign.endDate.toISOString().slice(0, 10) : "",
            }}
          />
        </div>

        <div className="mt-8">
          <CampaignUpdates
            campaignId={campaign.id}
            updates={campaign.updates.map((u) => ({
              id: u.id,
              title: u.title,
              body: u.body,
              postedAt: u.postedAt.toISOString(),
              images: Array.isArray(u.images)
                ? (u.images as Array<{ url: string; alt?: string }>).filter(
                    (x) => typeof x?.url === "string"
                  )
                : [],
            }))}
          />
        </div>

        <div className="mt-6 rounded-md border border-[var(--color-coral)]/30 bg-[var(--color-coral-pale)]/40 p-5">
          <h3 className="font-display text-[0.95rem] font-bold text-[var(--color-coral-dark)]">
            Danger zone
          </h3>
          <p className="mt-1 text-[0.86rem] text-[var(--color-ink-muted)]">
            Deleting a campaign also removes all of its contribution history records.
            This cannot be undone.
          </p>
          <div className="mt-4">
            <DeleteButton
              label="Delete campaign"
              confirmMessage={`Delete ${campaign.title}?`}
              action={async () => {
                "use server"
                await deleteCampaign(campaign.id)
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
