import { sql } from "@vercel/postgres";
import { AudioFileDataField } from "./definitions";

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
    console.error('Failed to fetch cached audio URL:', error);
    throw new Error('Failed to fetch cached audio URL');
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
    console.error('Failed to update cached audio URL:', error);
    throw new Error('Failed to update cached audio URL');
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
    console.error('Failed to delete cached audio URL:', error);
    throw new Error('Failed to delete cached audio URL');
  }
}