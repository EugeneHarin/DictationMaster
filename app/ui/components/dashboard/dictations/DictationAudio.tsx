'use server'

import type { Dictation } from "@/app/lib/definitions";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id: string;
  content: string;
  language_code: Dictation['language_code'];
  speed: number;
}

export default async function DictationAudio({ id, content, language_code, speed, className, ...rest }: ButtonProps) {
  const { retrieveAudioFileUrl } = await import('@/app/lib/google-cloud-modules/cloud-storage');
  const audioUrl = await retrieveAudioFileUrl(id, content, language_code, speed);

  if (audioUrl !== undefined) {
    return (
      <audio className="mt-2" controls>
        <source src={audioUrl} type="audio/mp3" />
      </audio>
    );
  } else {
    return(
      <div>Error fetching dictation audio</div>
    )
  }
}
