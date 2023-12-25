'use client';

import { UsersTable, DictationForm } from '@/app/lib/definitions';
import {
  CheckIcon,
  DocumentTextIcon,
  PencilIcon,
  PencilSquareIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/components/dashboard/Button';
import { updateDictation } from '@/app/lib/dictation-functions/crud';
import { useFormState } from 'react-dom';
import { useMemo } from "react";

export default function EditDictationForm({
  dictation,
  teachers,
}: {
  dictation: DictationForm;
  teachers: Pick<UsersTable, 'id' | 'name'>[];
}) {
  const initialState = { errors: {}, message: null };
  const updateDictationWithId = updateDictation.bind(null, dictation.id);
  const [state, dispatch] = useFormState(updateDictationWithId, initialState);
  const errorsCount = state.errors ? Object.keys(state.errors).length : 0;

  // Show actual error in the console
  useMemo(()=>{
    if (errorsCount && state?.errors) console.error(Object.values(state.errors).filter(errorMessage => errorMessage.length)[0] || 'Unknown Error');
  }, [state, errorsCount]);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Teacher Name */}
        <div className="mb-4">
          <label htmlFor="teacher" className="mb-2 block text-sm font-medium">
            Choose teacher
          </label>
          <div className="relative">
            <select
              id="teacher"
              name="teacherId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={dictation.teacher_id}
              aria-describedby="teacher-error"
            >
              <option value="" disabled>
                Select a teacher
              </option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="teacher-error" aria-live="polite" aria-atomic="true">
            {state.errors?.teacherId &&
              state.errors.teacherId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Dictation Title */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Write a title
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={dictation.title}
                placeholder="Enter dictation title"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="title-error"
              />
              <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="title-error" aria-live="polite" aria-atomic="true">
            {state.errors?.title &&
              state.errors.title.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Dictation Content */}
        <div className="mb-4">
          <label htmlFor="content" className="mb-2 block text-sm font-medium">
            Write a content
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="content"
                name="content"
                rows={5}
                defaultValue={dictation.content}
                placeholder="Enter dictation content"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="content-error"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="content-error" aria-live="polite" aria-atomic="true">
            {state.errors?.content &&
              state.errors.content.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Dictation Status */}
        <fieldset aria-describedby="status-error">
          <legend className="mb-2 block text-sm font-medium">
            Set the dictation status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="draft"
                  name="status"
                  type="radio"
                  value="draft"
                  defaultChecked={dictation.status === 'draft'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="draft"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Draft <PencilSquareIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="published"
                  name="status"
                  type="radio"
                  value="published"
                  defaultChecked={dictation.status === 'published'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="published"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Published <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>
      </div>
      <div id="form-errors" aria-live="polite" aria-atomic="true">
        {errorsCount > 0 && (
          <p className="mt-2 text-sm text-red-500">
            {state?.message}
          </p>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/dictations"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Dictation</Button>
      </div>
    </form>
  );
}
