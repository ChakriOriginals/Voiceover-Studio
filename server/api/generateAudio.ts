import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/generate-audio', async (req, res) => {
    const { text } = req.body;
    const token = "<your_token_here>";

    const payload = {
        "voice_id": "arman",
        "text": text,
        "sample_rate": 16000
    };

    try {
        const response = await axios.post("https://waves-api.smallest.ai/api/v1/lightning/get_speech", payload, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            responseType: 'arraybuffer'  // Get audio as binary
        });

        if (response.status === 200) {
            console.log("API call successful.");

            const audioFile = `${uuidv4()}.wav`;
            const audioPath = path.join(__dirname, '../../audio_output', audioFile);

            fs.writeFileSync(audioPath, response.data);  // Save the audio

            res.json({ success: true, filePath: `/audio/${audioFile}` });
        } else {
            console.error(`API returned status ${response.status}: ${response.statusText}`);
            res.status(500).json({ success: false, message: 'Failed to generate audio' });
        }
    } catch (error) {
        console.error('Error generating audio:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: 'Error generating audio' });
    }
});

export default router;
