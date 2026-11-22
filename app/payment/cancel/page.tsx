import { XCircle, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function PaymentCancelPage() {
  return (
    <>
      <Navbar />

      <main className="container-shell grid min-h-[65vh] place-items-center py-16">
        <div className="max-w-lg rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow)]">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-50 text-amber-600">
            <XCircle size={33} />
          </span>

          <p className="section-kicker mt-5">
            Checkout cancelled
          </p>

          <h1 className="mt-2 text-3xl font-black">
            No payment was completed.
          </h1>

          <p className="mt-3 text-sm leading-7 text-muted">
            You left Stripe Checkout before completing payment. Your booking
            may remain on hold temporarily. You can return to your rentals
            and try again if the hold is still active.
          </p>

          <div className="mt-7 flex justify-center gap-3">
            <Button href="/dashboard/rentals">
              My rentals
              <ArrowRight size={15} />
            </Button>

            <Button href="/equipment" variant="outline">
              Browse gear
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}