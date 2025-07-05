import { generateAIInterviewReport } from '@functions';
import { Interview } from '@models';
import axios from 'axios';
import { INTERVIEW_REPORT_STATUS } from 'constants/interview';

export default async (req, res) => {
  const { type, data } = req.body;

  res.status(200).send('Webhook received');

  // Handle the webhook event based on the event type
  switch (type) {
    case 'transcription.started.success':
      await handleTranscriptionStarted(data);
      break;
    case 'transcription.success':
      await handleTranscriptionSuccess(data);
      break;
    case 'transcription.failure':
      await handleTranscriptionFailure(data);
      break;
    default:
      console.warn(`Unhandled event type: ${type}`);
      break;
  }
};

const handleTranscriptionStarted = async (data) => {
  const { room_id } = data;

  await Interview.findOneAndUpdate(
    { roomId: room_id },
    { reportStatus: INTERVIEW_REPORT_STATUS.PENDING }
  );
};

const handleTranscriptionSuccess = async (data) => {
  const { room_id, transcript_txt_presigned_url } = data;

  try {
    // Find the interview associated with the room ID
    const interview = await Interview.findOne({ roomId: room_id });

    if (!interview) {
      console.error(`Interview not found for room_id: ${room_id}`);
      return;
    }

    // Fetch the transcript content from the pre-signed URL
    const response = await axios.get(transcript_txt_presigned_url);
    const transcriptText = response.data;

    const report = await generateAIInterviewReport(interview._id, transcriptText);

    // Update interview document with transcript and report
    interview.transcriptText = transcriptText;
    interview.report = report;
    interview.reportStatus = INTERVIEW_REPORT_STATUS.GENERATED;

    // Save the interview document once with both updates
    await interview.save();
  } catch (error) {
    console.error(`Error handling transcription success for room_id: ${room_id}`, error);

    await Interview.findOneAndUpdate(
      { roomId: room_id },
      { 'report.status': INTERVIEW_REPORT_STATUS.FAILED }
    );
  }
};

const handleTranscriptionFailure = async (data) => {
  const { room_id } = data;

  // Update the interview document to indicate transcription failure
  await Interview.findOneAndUpdate(
    { roomId: room_id },
    { reportStatus: INTERVIEW_REPORT_STATUS.FAILED }
  );
};
