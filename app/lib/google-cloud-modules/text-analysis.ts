'use server'

import type { protos as AIPlatformProtos } from '@google-cloud/aiplatform';
import { PredictionServiceClient } from '@google-cloud/aiplatform/build/src/v1/prediction_service_client';
import { toValue } from '@google-cloud/aiplatform/build/src/helpers.js';

import { Dictation } from "../definitions";

// const {PredictionServiceClient} = EndpointServiceClient.v1;
// GCS - Google Cloud Storage
const googleApplicationCredentialsBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
if (!googleApplicationCredentialsBase64) throw new Error('Error getting Google Application Credentials from .env');
const serviceAccountKey = JSON.parse(Buffer.from(googleApplicationCredentialsBase64, 'base64').toString('ascii'));

const predictionServiceClient = new PredictionServiceClient({
  apiEndpoint: 'us-central1-aiplatform.googleapis.com',
  credentials: serviceAccountKey
});

type CreateInstanceError = { _t: 'create-instance-error', message: string };
type UnknownError = { _t: 'unknown-error'; error: unknown };
type GetAIDictationReviewSuccess = { _t: 'success'; result: string };
type PredictionResultError = { _t: 'prediction-result-error', message: string };
type UnsupportedLanguageError = { _t: 'unsupported-language-error', message: string };
type ProjectIDNotFoundError = { _t: 'project-id-not-found', message: string };
type getAIDictationReviewResult =
  | CreateInstanceError
  | UnknownError
  | GetAIDictationReviewSuccess
  | PredictionResultError
  | UnsupportedLanguageError
  | ProjectIDNotFoundError

export async function getAIDictationReview(originalText: string, userInput: string, languageCode: Dictation['language_code']): Promise<getAIDictationReviewResult> {

  try {

    if (languageCode !== 'en-US')
      return { _t: 'unsupported-language-error', message: 'Selected dictation language is not currently supported' };

    const GCProjectId = process.env.GC_PROJECT_ID;
    if (GCProjectId == undefined)
      return { _t: "project-id-not-found", message: 'GC_PROJECT_ID wan not found in the environment variables' };

    const textInput = `
    Here is the original text: "${originalText}"
    Here is a dictation result text with errors from a student: "${userInput}"
    Please analyze errors and provide a short review.
    `;
    const model = 'text-bison@002';
    const publisher = 'google';
    const location = 'us-central1';
    const endpoint = `projects/${GCProjectId}/locations/${location}/publishers/${publisher}/models/${model}`;

    const instanceValue = toValue({ prompt: textInput });
    if (!instanceValue)
      return { _t: 'create-instance-error', message: 'Error getting instance value using helper from @google-cloud/aiplatform' };

    const instances = [instanceValue];
    const parameters = toValue({
      temperature: .3,
      maxOutputTokens: 256,
      topP: .3,
      topK: 40,
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
