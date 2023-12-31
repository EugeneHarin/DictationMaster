'use server'

import { sql } from "@vercel/postgres";
import { AudioFileDataField } from "../definitions";

import { revalidatePath } from "next/cache";

export const clearCachesByServerAction = async (path?: string) => {
  try {
    if (path) {
      revalidatePath(path)
    } else {
      revalidatePath('/');
    }
  } catch (error) {
    throw new Error('Error clearing cache by server action', {cause: error})
  }
}

export async function getCachedAudioUrl(id: string) {
  try {
    const data = await sql<AudioFileDataField>`
      SELECT
        audio_file_url,
        audio_file_exp_date
      FROM dictations
      WHERE dictations.id = ${id};
    `;

    const audioFileData = data.rows[0];
    return audioFileData;
  } catch (error) {
    throw new Error('Failed to fetch cached audio URL', {cause: error});
  }
}

export async function setCachedAudioUrl(id: string, audioFileUrl: string, audioFileExpDate: Date) {
  try {
    const data = await sql<AudioFileDataField>`
      UPDATE dictations
      SET audio_file_url = ${audioFileUrl},
      audio_file_exp_date = ${audioFileExpDate.toISOString()}
      WHERE dictations.id = ${id};
    `;
    return true;
  } catch (error) {
    throw new Error('Failed to update cached audio URL', {cause: error});
  }
}

export async function deleteCachedAudioUrl(id: string) {
  try {
    const data = await sql<AudioFileDataField>`
      UPDATE dictations
      SET audio_file_url = null,
      audio_file_exp_date = null
      WHERE dictations.id = ${id};
    `;
    return true;
  } catch (error) {
    throw new Error('Failed to delete cached audio URL', {cause: error});
  }
}
