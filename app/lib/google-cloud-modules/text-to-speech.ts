'use server'

import type { protos } from '@google-cloud/text-to-speech';
import { TextToSpeechLongAudioSynthesizeClient } from '@google-cloud/text-to-speech/build/src/v1/text_to_speech_long_audio_synthesize_client';
import { convertAndRepeatSentences } from "../utils";

const bucketName = process.env.GCS_BUCKET_NAME;
if (!bucketName) throw new Error('Error getting Google Storage bucket Name from .env');
const serverAudioFilesFolder = process.env.GC_SERVER_AUDIO_FOLDER;
const GCProjectNumber = process.env.GC_PROJECT_NUMBER;
if (!GCProjectNumber) throw new Error('Error getting Google Project Number from .env');
const googleApplicationCredentialsBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
if (!googleApplicationCredentialsBase64) throw new Error('Error getting Google Application Credentials from .env');
const serviceAccountKey = JSON.parse(Buffer.from(googleApplicationCredentialsBase64, 'base64').toString('ascii'));

export async function convertAndUploadTextToSpeech(id: string, text: string, languageCode: string, speed: number = 0.7) {
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

    const TTSLongAudioClient = new TextToSpeechLongAudioSynthesizeClient({ credentials: serviceAccountKey });
    const [operation] = await TTSLongAudioClient.synthesizeLongAudio(request);
    const [response] = (await operation.promise()) as protos.google.cloud.texttospeech.v1.ISynthesizeLongAudioResponse[];

  } catch(error) {
    throw new Error('Error converting text to speech', {cause: error});
  }
}
