import { BookOpenIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function DictationmasterLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-start leading-none text-white`}
    >
      <div className="ml-1 flex flex-col justify-start items-end text-2xl md:text-3xl">
        <div className="leading-7 md:leading-9">Dictation</div>
        <div className="flex flex-row gap-1">
          <BookOpenIcon className="h-6 md:h-8 w-6 md:w-8 rotate-[15deg]" />
          <div className="leading-7 md:leading-9">Master</div>
        </div>
      </div>
    </div>
  );
}
