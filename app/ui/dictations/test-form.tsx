'use client'

import { DictationForm } from "@/app/lib/definitions";
import dynamic from "next/dynamic";

// Dynamically import the Speech component with SSR disabled
const Speech: any = dynamic(() => import('react-speech'), { ssr: false });

export default function TestDictationForm({ dictation }: { dictation: DictationForm } ) {
  return (
    <div>
      <div>
        <Speech
          text="I have altered my voice"
          voice="Google UK English Female" />
      </div>
    </div>
  );
};
