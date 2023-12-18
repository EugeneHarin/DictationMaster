import { EyeIcon, PencilIcon, PlayCircleIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteDictation } from '@/app/lib/dictation-functions/crud'

export function CreateDictation() {
  return (
    <Link
      href="/dashboard/dictations/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Dictation</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function ViewDictation({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/dictations/${id}/test`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <EyeIcon title="View Dictation" className="w-5" />
    </Link>
  );
}

export function UpdateDictation({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/dictations/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon title="Edit Dictation" className="w-5" />
    </Link>
  );
}

export function DeleteDictation({ id }: { id: string }) {
  const deleteDictationWithId = deleteDictation.bind(null, id);
  return(
    <form action={deleteDictationWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon title="Delete Dictation" className="w-5" />
      </button>
    </form>
  );
}

export function StartDictation({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/dictations/${id}/start`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PlayCircleIcon title="Start Dictation" className="w-5" />
    </Link>
  );
}