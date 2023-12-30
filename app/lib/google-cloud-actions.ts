'use server'

// Initialize Google Cloud Storage Bucket
import type { protos as AIPlatformProtos } from '@google-cloud/aiplatform';
import { PredictionServiceClient, helpers } from '@google-cloud/aiplatform';
import { Storage } from '@google-cloud/storage';
import type { protos } from '@google-cloud/text-to-speech';
import { TextToSpeechLongAudioSynthesizeClient } from '@google-cloud/text-to-speech';
import { getCachedAudioUrl, setCachedAudioUrl } from "./cache";
import { Dictation } from "./definitions";
import { convertAndRepeatSentences } from "./utils";

// const {PredictionServiceClient} = EndpointServiceClient.v1;
// GCS - Google Cloud Storage
const googleApplicationCredentialsBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
const bucketName = process.env.GCS_BUCKET_NAME;
const GCProjectNumber = process.env.GC_PROJECT_NUMBER;
const GCProjectId = process.env.GC_PROJECT_ID;
if (!GCProjectNumber) throw new Error('Error getting Google Project Number from .env');
if (!googleApplicationCredentialsBase64) throw new Error('Error getting Google Application Credentials from .env');
if (!bucketName) throw new Error('Error getting Google Storage bucket Name from .env');

const serviceAccountKey = JSON.parse(Buffer.from(googleApplicationCredentialsBase64, 'base64').toString('ascii'));
const storage = new Storage({ credentials: serviceAccountKey });
const TTSLongAudioClient = new TextToSpeechLongAudioSynthesizeClient({ credentials: serviceAccountKey });
const predictionServiceClient = new PredictionServiceClient({
  apiEndpoint: 'us-central1-aiplatform.googleapis.com',
  credentials: serviceAccountKey
});

const bucket = storage.bucket(bucketName);

const serverAudioFilesFolder = 'audio-files';

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

async function convertAndUploadTextToSpeech(id: string, text: string, languageCode: string, speed: number = 0.7) {
  try {
    // Prepare text using Speech Synthesis Markup Language
    const SSMLText = convertAndRepeatSentences(text, 3);
    const voice: protos.google.cloud.texttospeech.v1.IVoiceSelectionParams = languageCode == 'uk-UA' ? {
      languageCode: 'uk-UA',
      ssmlGender: 'FEMALE',
      name: 'uk-UA-Standard-A'
    } : {
      languageCode: 'en-US',
      ssmlGender: 'FEMALE',
      name: 'en-US-Neural2-H'
    };
    const request: protos.google.cloud.texttospeech.v1.ISynthesizeLongAudioRequest = {
      input: {
        ssml: SSMLText
      },
      voice: voice,
      audioConfig: {
        audioEncoding: 'LINEAR16',
        speakingRate: speed,
      },
      outputGcsUri: `gs://${bucketName}/${serverAudioFilesFolder}/${id}.mp3`,
      parent: `projects/${GCProjectNumber}/locations/global`
    };

    const [operation] = await TTSLongAudioClient.synthesizeLongAudio(request);
    const [response] = (await operation.promise()) as protos.google.cloud.texttospeech.v1.ISynthesizeLongAudioResponse[];

  } catch(error) {
    throw new Error('Error converting text to speech', {cause: error});
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

/**
 *
 * @param id id of the dictation (needed to find the file in the cloud storage)
 * @param text text of the dictation (will be used to generate the new audiofile if file for specified id doesn't exist in cloud storage)
 * @returns audiofile url
 * @returns undefined
 */
export async function retrieveAudioFileUrl(id: string, text: string | undefined, languageCode: Dictation['language_code'] = 'en-US', speed: number = 0.7) {

  const existingFileUrl = await getCachedSignedUrl(id);

  if (existingFileUrl !== undefined) return existingFileUrl;

  if (!text) return undefined;

  // If file doesn't exist in cache or GCS then we generate and upload a new one
  await convertAndUploadTextToSpeech(id, text, languageCode, speed);

  const newFileUrl = await getCachedSignedUrl(id);
  return newFileUrl;
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

type CreateInstanceError = { _t: 'create-instance-error', message: string };
type UnknownError = { _t: 'unknown-error'; error: unknown };
type GetAIDictationReviewSuccess = { _t: 'success'; result: string };
type PredictionResultError = { _t: 'prediction-result-error', message: string };
type UnsupportedLanguageError = { _t: 'unsupported-language-error', message: string };
type getAIDictationReviewResult =
  | CreateInstanceError
  | UnknownError
  | GetAIDictationReviewSuccess
  | PredictionResultError
  | UnsupportedLanguageError

export async function getAIDictationReview(originalText: string, userInput: string, languageCode: Dictation['language_code']): Promise<getAIDictationReviewResult> {

  try {

    if (languageCode !== 'en-US') return { _t: 'unsupported-language-error', message: 'Selected dictation language is not currently supported' };

    const textInput = `
    Here is the original text: "${originalText}"
    Here is a dictation result text with errors from a student: "${userInput}"
    Please analyze all existing errors, one by one, including punctuation errors, and provide a corresponding rules.
    Your analysis:
    `;
    const model = 'text-bison@002';
    const publisher = 'google';
    const location = 'us-central1';
    const endpoint = `projects/${GCProjectId}/locations/${location}/publishers/${publisher}/models/${model}`;

    const instanceValue = helpers.toValue({ prompt: textInput });
    if (!instanceValue)
      return { _t: 'create-instance-error', message: 'Error getting instance value using helper from @google-cloud/aiplatform' };

    const instances = [instanceValue];
    const parameters = helpers.toValue({
      temperature: .3,
      maxOutputTokens: 512,
      topP: .3,
      topK: 20,
    });

    const request: AIPlatformProtos.google.cloud.aiplatform.v1.IPredictRequest = {
      endpoint,
      instances,
      parameters,
    };

    const [response] = await predictionServiceClient.predict(request);
    const predictions = response.predictions;
    const predictionResult = predictions?.[0]?.structValue?.fields?.content?.stringValue;
    if (!predictionResult)
      return { _t: 'prediction-result-error', message: 'No prediction text content returned from predictionServiceClient at @google-cloud/aiplatform' };

    return { _t: 'success', result: predictionResult };

  } catch (error) {
    return { _t: 'unknown-error', error: error };
  }
}
