// Import necessary hooks and components
import React from 'react';
import { getAudioFileUrl } from "@/app/lib/google-cloud-actions";
import { notFound } from "next/navigation";
import { DictationForm } from "@/app/lib/definitions";

interface DictationFormProps {
  dictation: DictationForm;
}

export default async function ViewDictationForm({ dictation }: DictationFormProps) {
  if (!dictation?.id) notFound();
  const audioFileUrl = await getAudioFileUrl(dictation);

  return (
    <div>
      <div>
        {dictation.content}
      </div>
      <audio controls>
        <source src={audioFileUrl} type="audio/mp3" />
      </audio>
    </div>
  );
}
