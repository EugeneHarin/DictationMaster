import Breadcrumbs from "@/app/ui/components/dashboard/Breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Results',
};

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Results', href: '/dashboard/results' },
        ]}
      />

      <div>Results Overview</div>

    </main>
  )
}
