'use server'

// Initialize Google Cloud Storage Bucket
import { Storage } from '@google-cloud/storage'
import { TextToSpeechClient, protos } from '@google-cloud/text-to-speech';
import { DictationForm } from "./definitions";
import { getCachedAudioUrl, setCachedAudioUrl } from "./cache";

// GCS - Google Cloud Storage
const googleApplicationCredentialsBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
const bucketName = process.env.GCS_BUCKET_NAME;
if (!googleApplicationCredentialsBase64) throw new Error('Error getting Google Application Credentials from .env');
if (!bucketName) throw new Error('Error getting Google Storage bucket Name from .env');

const serviceAccountKey = JSON.parse(Buffer.from(googleApplicationCredentialsBase64, 'base64').toString('ascii'));
const storage = new Storage({ credentials: serviceAccountKey });
const TTSClient = new TextToSpeechClient({ credentials: serviceAccountKey });
const bucket = storage.bucket(bucketName);

const serverAudioFilesFolder = 'audio-files';

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
    console.error('Error generating signed URL:', error);
    return undefined;
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

async function convertTextToSpeech(text: string) {
  try {
    const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
      input: {
        text: text
      },
      voice: {
        languageCode: 'en-US',
        ssmlGender: 'FEMALE',
        name: 'en-US-Neural2-H'
      },
      // voice: {
      //   languageCode: 'uk-UA',
      //   ssmlGender: 'FEMALE',
      //   name: 'uk-UA-Standard-A'
      // },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: .90,
      },
    };

    const [response] = await TTSClient.synthesizeSpeech(request);
    if (response.audioContent instanceof Uint8Array) {
      return Buffer.from(response.audioContent);
    } else {
      throw new Error('Error converting text to speech: response.audioContent is not an instance of Uint8Array');
    }
  } catch(error) {
    console.error('Error converting text to speech:', error);
  }
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

export async function retrieveAudioFileUrl(dictation: DictationForm) {

  const existingFileUrl = await getCachedSignedUrl(dictation.id);

  if (existingFileUrl !== undefined) return existingFileUrl;

  // If file doesn't exist in cache or GCS then we generate and upload a new one
  const audioFileContent = await convertTextToSpeech(dictation.content);

  if (undefined !== audioFileContent) await uploadAudioToGCS(audioFileContent, dictation.id);
  else return undefined;

  const newFileUrl = await getCachedSignedUrl(dictation.id);
  return newFileUrl;
}

export async function deleteAudioFromGCS(id: string) {
  try {
    const destination = `${serverAudioFilesFolder}/${id}.mp3`;
    const file = bucket.file(destination);

    await file.delete();
    // console.log(`File with id: ${id} was successfully deleted`);
  } catch (error: any) {
    console.error(`Error deleting file with id: ${id} from GCS: ${error}`);
  }
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
