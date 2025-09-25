import { createClient } from '@supabase/supabase-js';
import { createWorker } from 'tesseract.js';
import axios from 'axios';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { student_id, certificate_url } = req.body;

  if (!student_id || !certificate_url) {
    return res.status(400).json({ 
      message: 'student_id and certificate_url are required' 
    });
  }

  try {
    const imageResponse = await axios.get(certificate_url, { 
      responseType: 'arraybuffer' 
    });
    const imageBuffer = Buffer.from(imageResponse.data, 'binary');

    // Initialize Tesseract worker
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    // Perform OCR
    const { data: { text } } = await worker.recognize(imageBuffer);
    
    // Terminate worker after use
    await worker.terminate();
    
    // Process OCR result
    const extractedData = processOCRResult(text);
    
    const { data, error } = await supabase
      .from('certificates')
      .insert([{
        student_id,
        title: extractedData.title,
        issuer: extractedData.issuer,
        issue_date: extractedData.date,
        certificate_url,
        status: 'pending'
      }]);

    if (error) throw error;

    return res.status(200).json({ 
      message: 'Certificate processed successfully', 
      data 
    });

  } catch (error) {
    console.error('Certificate processing error:', error);
    return res.status(500).json({ 
      message: 'An error occurred during processing.',
      error: error.message 
    });
  }
}

function processOCRResult(text) {
  if (!text) {
    console.log('No text extracted from OCR');
    throw new Error('No text extracted from certificate image');
  }

  // Function to try multiple patterns
  function extractWithPatterns(text, patterns, defaultValue = 'Unknown') {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1] && match[1].trim()) {
        return match[1].trim();
      }
    }
    return defaultValue;
  }

  // Enhanced regex patterns
  const titlePatterns = [
    /Certificate of (.+?)(?:\n|$)/i,
    /Certificate in (.+?)(?:\n|$)/i,
    /(?:This is to certify|hereby certify)[\s\S]*?in (.+?)(?:\n|$)/i,
    /Certification in (.+?)(?:\n|$)/i
  ];

  const issuerPatterns = [
    /Issued by[:\s]*([^\n]+)/i,
    /Awarded by[:\s]*([^\n]+)/i,
    /From[:\s]*([^\n]+)/i,
    /By[:\s]*([A-Za-z\s&,.-]+)(?:\n|$)/i
  ];

  const datePatterns = [
    /(\d{1,2}[-\/]\d{1,2}[-\/]\d{4})/,
    /(\d{1,2}\s+\w+\s+\d{4})/,
    /(\w+\s+\d{1,2},?\s+\d{4})/,
    /Date[:\s]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{4})/i
  ];

  const title = extractWithPatterns(text, titlePatterns);
  const issuer = extractWithPatterns(text, issuerPatterns);
  const rawDate = extractWithPatterns(text, datePatterns, null);

  let issueDate = null;
  if (rawDate && rawDate !== 'Unknown') {
    try {
      const date = new Date(rawDate);
      if (!isNaN(date.getTime())) {
        issueDate = date.toISOString().split('T')[0];
      }
    } catch (error) {
      console.error('Date parsing error:', error);
    }
  }

  return {
    title,
    issuer,
    date: issueDate || new Date().toISOString(),
    extracted_text: text.substring(0, 500) // Store first 500 chars for debugging
  };
}