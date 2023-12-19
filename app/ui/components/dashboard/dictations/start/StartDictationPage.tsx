import { fetchDictationWithTeacher } from "@/app/lib/dictation-functions/fetch";
import { notFound } from "next/navigation";
import { retrieveAudioFileUrl } from "@/app/lib/google-cloud-actions";
import { StartDictationForm } from "@/app/ui/components/dashboard/dictations/start/StartDictationForm";

export async function StartDictationPage({ id }: { id: string }) {
  const dictationWithTeacher = await fetchDictationWithTeacher(id);
  if (!dictationWithTeacher) notFound();
  const audioFileUrl = await retrieveAudioFileUrl(dictationWithTeacher);
  if (!audioFileUrl) notFound();

  return(<StartDictationForm dictationWithTeacher={dictationWithTeacher} audioFileUrl={audioFileUrl} />);
}
