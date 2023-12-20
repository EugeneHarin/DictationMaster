import { fetchDictationWithTeacher } from "@/app/lib/dictation-functions/fetch";
import { notFound } from "next/navigation";
import ViewDictationForm from "@/app/ui/components/dashboard/dictations/view/ViewDictationForm";

export default async function ViewDictationPage({ id }: { id: string }) {
  const dictationWithTeacher = await fetchDictationWithTeacher(id);
  if (!dictationWithTeacher) notFound();

  return(
    <ViewDictationForm dictationWithTeacher={dictationWithTeacher} />
  );
}
