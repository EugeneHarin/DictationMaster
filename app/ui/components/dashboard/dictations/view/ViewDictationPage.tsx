import { fetchDictationWithTeacher } from "@/app/lib/dictation-functions/fetch";
import { notFound } from "next/navigation";
import { retrieveAudioFileUrl } from "@/app/lib/google-cloud-actions";
import ViewDictationForm from "@/app/ui/components/dashboard/dictations/view/ViewDictationForm";

export default async function ViewDictationPage({ id }: { id: string }) {
  const dictationWithTeacher = await fetchDictationWithTeacher(id);
  if (!dictationWithTeacher) notFound();
  const audioFileUrl = await retrieveAudioFileUrl(dictationWithTeacher);
  if (!audioFileUrl) notFound();

  return(<ViewDictationForm dictationWithTeacher={dictationWithTeacher} audioFileUrl={audioFileUrl} />);
}
