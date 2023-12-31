'use server'

import { Storage } from '@google-cloud/storage';
import { getCachedAudioUrl, setCachedAudioUrl } from "./cache";
import type { Dictation } from "../definitions";

const googleApplicationCredentialsBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
const bucketName = process.env.GCS_BUCKET_NAME;
if (!googleApplicationCredentialsBase64) throw new Error('Error getting Google Application Credentials from .env');
if (!bucketName) throw new Error('Error getting Google Storage bucket Name from .env');

const serviceAccountKey = JSON.parse(Buffer.from(googleApplicationCredentialsBase64, 'base64').toString('ascii'));
const storage = new Storage({ credentials: serviceAccountKey });

const bucket = storage.bucket(bucketName);
const serverAudioFilesFolder = process.env.GC_SERVER_AUDIO_FOLDER;

async function checkIfAudioFileExistsAtGCS(id: string) {
  try {
    const source = `${serverAudioFilesFolder}/${id}.mp3`;
    const file = bucket.file(source);
    const [fileExists] = await file.exists();
    return fileExists;
  } catch (error) {
    throw new Error('Error checking if audio file exists at GCS', {cause: error});
  }
}

async function getSignedUrlFromGCS(id: string) {
  try {
    const source = `${serverAudioFilesFolder}/${id}.mp3`;
    const urlExpiration = 60 * 60 * 1; // URL expiration time in seconds (e.g., 1 hour)

    const file = bucket.file(source);
    const [fileExists] = await file.exists();

    if (fileExists) {
      // console.log(`File found in GCS for id: ${id}, generating new signed URL...`);
      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + urlExpiration * 1000, // Expiration time in milliseconds
      });

      return url;
    }

    // console.log(`File not found in GCS for id: ${id}`);

    return undefined;
  } catch (error: any) {
    throw new Error('Error generating signed URL', {cause: error});
  }
}


async function getCachedSignedUrl(id: string) {
  const audioCacheEntry = await getCachedAudioUrl(id);

  // Check if we have a cached URL for this id and it's less than 1 hour old
  if (audioCacheEntry?.audio_file_url && audioCacheEntry.audio_file_exp_date && ( Date.now() < Date.parse(audioCacheEntry.audio_file_exp_date) )) {
    // console.log(`Cached URL found in DB for id: ${id}`);
    return audioCacheEntry.audio_file_url;
  }

  // Generate a new signed URL
  // console.log(`Cached URL not found for id: ${id}, generating a new one...`);
  const newUrl = await getSignedUrlFromGCS(id);

  const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
  const currentTime = new Date();
  const oneHourFromNow = new Date(currentTime.getTime() + oneHour);

  if (newUrl !== undefined) setCachedAudioUrl(id, newUrl, oneHourFromNow); // Update the cache
  return newUrl;
}

async function uploadAudioToGCS(audioContent: Buffer, id: string) {
  try {
    const destination = `${serverAudioFilesFolder}/${id}.mp3`;
    const file = bucket.file(destination);

    await new Promise((resolve, reject) => {
      const stream = file.createWriteStream({
        metadata: {
          contentType: 'audio/mpeg',
        },
      });

      stream.on('error', (error) => {
        reject(error);
      });

      stream.on('finish', () => {
        // console.log(`File with id: ${id} uploaded to ${destination} in bucket ${bucketName}`);
        resolve(true);
      });

      stream.end(audioContent);
    });

    return await getSignedUrlFromGCS(id);
  } catch (error: any) {
    console.error('Error uploading file to GCS:', error);
  }
}

/**
 *
 * @param id id of the dictation (needed to find the file in the cloud storage)
 * @param text text of the dictation (will be used to generate the new audiofile if file for specified id doesn't exist in cloud storage)
 * @returns audiofile url
 * @returns undefined
 */
export async function retrieveAudioFileUrl(id: string, text: string | undefined, languageCode: Dictation['language_code'] = 'en-US', speed: number = 0.7) {

  const { convertAndUploadTextToSpeech } = await import("@/app/lib/google-cloud-modules/text-to-speech");

  const existingFileUrl = await getCachedSignedUrl(id);

  if (existingFileUrl !== undefined) return existingFileUrl;

  if (!text) return undefined;

  // If file doesn't exist in cache or GCS then we generate and upload a new one
  await convertAndUploadTextToSpeech(id, text, languageCode, speed);

  const newFileUrl = await getCachedSignedUrl(id);
  return newFileUrl;
}


export async function deleteAllAudioFilesFromGCS() {
  try {
    // Lists files in the folder
    const [files] = await bucket.getFiles({ prefix: serverAudioFilesFolder });

    // Promise array to hold all delete operations
    const deletePromises = files.map(file => file.delete());

    // Execute all delete operations
    await Promise.all(deletePromises);

    // console.log(`All files in folder ${serverAudioFilesFolder} were successfully deleted`);
  } catch (error: any) {
    console.error(`Error deleting all GCS files from folder ${serverAudioFilesFolder}: ${error}`);
  }
}


export async function deleteAudioFromGCS(id: string) {
  try {
    const audioFileExists = await checkIfAudioFileExistsAtGCS(id);

    if (!audioFileExists) return false;

    const destination = `${serverAudioFilesFolder}/${id}.mp3`;
    const file = bucket.file(destination);

    await file.delete();
    // console.log(`File with id: ${id} was successfully deleted`);
  } catch (error: any) {
    throw new Error(`Error deleting file with id: ${id} from GCS`, {cause: error});
  }
}
