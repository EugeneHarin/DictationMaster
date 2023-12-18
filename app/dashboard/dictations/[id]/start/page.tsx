import Breadcrumbs from "@/app/ui/components/dashboard/Breadcrumbs";
import { fetchDictationWithTeacher } from "@/app/lib/dictation-functions/fetch";
import { notFound } from "next/navigation";
import { retrieveAudioFileUrl } from "@/app/lib/google-cloud-actions";
import { ValidateDictationForm } from "@/app/ui/components/dashboard/dictations/start/ValidateDictationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Start Dictation',
};

export default async function Page({ params }: { params: { id: string } }) {

  const id = params.id;
  const dictationWithTeacher = await fetchDictationWithTeacher(id);
  if (!dictationWithTeacher) notFound();
  const audioFileUrl = await retrieveAudioFileUrl(dictationWithTeacher);
  if (!audioFileUrl) notFound();

  return(
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dictations', href: '/dashboard/dictations' },
          {
            label: 'Start Dictation',
            href: `/dashboard/dictations/${id}/start`,
            active: true,
          },
        ]}
      />
      <ValidateDictationForm dictationWithTeacher={dictationWithTeacher} audioFileUrl={audioFileUrl} />
    </main>
  );
};
