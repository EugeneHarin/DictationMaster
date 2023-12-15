import convertTextToSpeech from "@/app/lib/google-text-to-speech";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text } = req.body;
    try {
      const audioContent = await convertTextToSpeech(text);
      const audioContentBase64 = audioContent.toString('base64');
      res.status(200).json({ audio: audioContentBase64 });
    } catch (error) {
      res.status(500).json({ error: 'Error converting text to speech' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
