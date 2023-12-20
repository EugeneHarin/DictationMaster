import { retrieveAudioFileUrl } from "@/app/lib/google-cloud-actions";

export default async function DictationAudio({ id: dictationId, content: dictationContent }: { id: string, content: string }) {
  return (
    <audio className="mt-2" controls>
      <source src={await retrieveAudioFileUrl(dictationId, dictationContent)} type="audio/mp3" />
    </audio>
  )
}
