/**
 * AI Service Utility
 * 
 * Handles all AI-related API calls for medication interaction checking,
 * medication information retrieval, and Q&A functionality.
 * 
 * Uses Google Gemini API (free tier available) for AI responses.
 * Includes mock responses for demo/testing when API key is not configured.
 * 
 * IMPORTANT: In production, API keys should be stored securely using
 * environment variables or a secure key management system.
 */

import { AI_CONFIG, INTERACTION_SEVERITY } from './constants';

// Flag to use mock responses (set to true for demo without API key)
const USE_MOCK_RESPONSES = true;

/**
 * Main AI API call function
 * Sends prompts to Google Gemini API and returns the response
 * 
 * @param {string} prompt - The prompt to send to the AI
 * @returns {Promise<string>} - AI response text
 */
const callGeminiAPI = async (prompt) => {
  // If using mock responses or no API key configured, return mock data
  if (USE_MOCK_RESPONSES || AI_CONFIG.API_KEY === 'YOUR_GEMINI_API_KEY') {
    console.log('[AI Service] Using mock response (API key not configured)');
    return getMockResponse(prompt);
  }

  try {
    const response = await fetch(
      `${AI_CONFIG.API_URL}?key=${AI_CONFIG.API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: AI_CONFIG.TEMPERATURE,
            maxOutputTokens: AI_CONFIG.MAX_TOKENS,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Extract text from Gemini response structure
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      throw new Error('Invalid response structure from AI API');
    }

    return aiResponse;
  } catch (error) {
    console.error('[AI Service] API call error:', error);
    throw error;
  }
};

/**
 * Check for drug interactions between medications
 * Uses AI to analyze potential interactions
 * 
 * @param {Array} medications - Array of medication objects
 * @returns {Promise<Object>} - Interaction check results
 */
export const checkDrugInteractions = async (medications) => {
  if (medications.length < 2) {
    return {
      hasInteractions: false,
      interactions: [],
      summary: 'At least two medications are needed to check for interactions.',
    };
  }

  const medicationNames = medications.map((med) => 
    `${med.name} (${med.dosage} ${med.unit})`
  ).join(', ');

  const prompt = `You are a pharmaceutical expert. Analyze the following medications for potential drug interactions:

Medications: ${medicationNames}

Please provide:
1. A list of any potential interactions between these medications
2. The severity level of each interaction (none, mild, moderate, or severe)
3. A brief explanation of each interaction
4. Recommendations for each interaction

Format your response as JSON with this structure:
{
  "hasInteractions": boolean,
  "interactions": [
    {
      "medications": ["Med1", "Med2"],
      "severity": "none|mild|moderate|severe",
      "description": "Description of the interaction",
      "recommendation": "What the patient should do"
    }
  ],
  "summary": "Brief overall summary"
}

Important: This is for educational purposes only. Always recommend consulting a healthcare provider.`;

  try {
    const response = await callGeminiAPI(prompt);
    
    // Try to parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        ...parsed,
        checkedAt: new Date().toISOString(),
        medicationsChecked: medications.map((m) => m.name),
      };
    }
    
    // If JSON parsing fails, return a structured error response
    return {
      hasInteractions: false,
      interactions: [],
      summary: response,
      checkedAt: new Date().toISOString(),
      medicationsChecked: medications.map((m) => m.name),
    };
  } catch (error) {
    console.error('[AI Service] Interaction check error:', error);
    throw new Error('Failed to check drug interactions. Please try again.');
  }
};

/**
 * Get detailed information about a medication
 * 
 * @param {Object} medication - Medication object
 * @returns {Promise<Object>} - Detailed medication information
 */
export const getMedicationInfo = async (medication) => {
  const prompt = `You are a pharmaceutical expert. Provide detailed information about the following medication:

Medication: ${medication.name}
Dosage: ${medication.dosage} ${medication.unit}
Form: ${medication.form}

Please provide the following information in JSON format:
{
  "genericName": "Generic name if brand name was given",
  "drugClass": "Classification of the drug",
  "commonUses": ["List of common uses"],
  "howItWorks": "Brief explanation of mechanism",
  "commonSideEffects": ["List of common side effects"],
  "seriousSideEffects": ["List of serious side effects to watch for"],
  "precautions": ["Important precautions"],
  "foodInteractions": ["Foods to avoid or be aware of"],
  "storageInstructions": "How to store the medication",
  "missedDoseGuidance": "What to do if a dose is missed"
}

Important: This is for educational purposes only. Always recommend consulting a healthcare provider for medical advice.`;

  try {
    const response = await callGeminiAPI(prompt);
    
    // Try to parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Return raw response if parsing fails
    return { rawInfo: response };
  } catch (error) {
    console.error('[AI Service] Medication info error:', error);
    throw new Error('Failed to get medication information. Please try again.');
  }
};

/**
 * Ask AI a question about medications
 * General Q&A functionality
 * 
 * @param {string} question - User's question
 * @param {Array} userMedications - User's current medications for context
 * @returns {Promise<string>} - AI response
 */
export const askMedicationQuestion = async (question, userMedications = []) => {
  const medicationContext = userMedications.length > 0
    ? `\n\nThe user is currently taking: ${userMedications.map((m) => m.name).join(', ')}`
    : '';

  const prompt = `You are a helpful pharmaceutical assistant. Answer the following question about medications.${medicationContext}

User Question: ${question}

Please provide a helpful, accurate, and easy-to-understand answer. If the question requires professional medical advice, recommend consulting a healthcare provider.

Important guidelines:
- Be informative but not a replacement for professional medical advice
- If the question is about specific dosing or treatment decisions, advise consulting a doctor
- Keep the response concise but thorough
- Use simple language that's easy to understand`;

  try {
    const response = await callGeminiAPI(prompt);
    return response;
  } catch (error) {
    console.error('[AI Service] Question error:', error);
    throw new Error('Failed to get an answer. Please try again.');
  }
};

/**
 * Get AI-powered suggestions for medication timing and best practices
 * 
 * @param {Object} medication - Medication object
 * @returns {Promise<Object>} - Suggestions and tips
 */
export const getMedicationSuggestions = async (medication) => {
  const prompt = `You are a pharmaceutical expert. Provide helpful suggestions for taking the following medication:

Medication: ${medication.name}
Dosage: ${medication.dosage} ${medication.unit}
Form: ${medication.form}
Frequency: ${medication.frequency}

Please provide suggestions in JSON format:
{
  "bestTimeToTake": "Optimal time(s) to take this medication",
  "withFood": "Whether to take with or without food",
  "tips": ["Helpful tips for taking this medication"],
  "warnings": ["Important things to avoid or watch out for"],
  "reminders": ["Things to remember about this medication"]
}`;

  try {
    const response = await callGeminiAPI(prompt);
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return { rawSuggestions: response };
  } catch (error) {
    console.error('[AI Service] Suggestions error:', error);
    throw new Error('Failed to get suggestions. Please try again.');
  }
};

// ============================================
// Mock Response Functions (for demo/testing)
// ============================================

/**
 * Generate mock responses based on prompt content
 * Used when API key is not configured
 */
const getMockResponse = (prompt) => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      if (prompt.includes('drug interactions') || prompt.includes('Analyze the following medications')) {
        resolve(getMockInteractionResponse(prompt));
      } else if (prompt.includes('detailed information about')) {
        resolve(getMockMedicationInfo(prompt));
      } else if (prompt.includes('suggestions for taking')) {
        resolve(getMockSuggestions(prompt));
      } else {
        resolve(getMockQAResponse(prompt));
      }
    }, 1500); // Simulate network delay
  });
};

const getMockInteractionResponse = (prompt) => {
  // Check if common interaction pairs are in the prompt
  const hasAspirin = prompt.toLowerCase().includes('aspirin');
  const hasIbuprofen = prompt.toLowerCase().includes('ibuprofen');
  const hasWarfarin = prompt.toLowerCase().includes('warfarin');
  const hasLisinopril = prompt.toLowerCase().includes('lisinopril');
  const hasMetformin = prompt.toLowerCase().includes('metformin');

  const interactions = [];

  if (hasAspirin && hasIbuprofen) {
    interactions.push({
      medications: ['Aspirin', 'Ibuprofen'],
      severity: 'moderate',
      description: 'Both medications are NSAIDs and taking them together may increase the risk of gastrointestinal bleeding and reduce the cardioprotective effect of aspirin.',
      recommendation: 'Avoid taking both medications at the same time. If you need both, consult your doctor about proper spacing. Consider using acetaminophen as an alternative pain reliever.',
    });
  }

  if (hasWarfarin && (hasAspirin || hasIbuprofen)) {
    interactions.push({
      medications: ['Warfarin', hasAspirin ? 'Aspirin' : 'Ibuprofen'],
      severity: 'severe',
      description: 'Combining blood thinners with NSAIDs significantly increases the risk of serious bleeding, including internal bleeding.',
      recommendation: 'This combination should be avoided unless specifically prescribed by your doctor. Seek immediate medical attention if you experience unusual bleeding, bruising, or dark stools.',
    });
  }

  if (hasLisinopril && hasIbuprofen) {
    interactions.push({
      medications: ['Lisinopril', 'Ibuprofen'],
      severity: 'moderate',
      description: 'NSAIDs like ibuprofen may reduce the blood pressure-lowering effect of ACE inhibitors like lisinopril and may increase the risk of kidney problems.',
      recommendation: 'Monitor your blood pressure regularly. Consider using acetaminophen instead of ibuprofen for pain relief. Stay well hydrated.',
    });
  }

  if (hasMetformin && hasIbuprofen) {
    interactions.push({
      medications: ['Metformin', 'Ibuprofen'],
      severity: 'mild',
      description: 'Occasional use of ibuprofen with metformin is generally safe, but regular use may affect kidney function, which is important for metformin clearance.',
      recommendation: 'Occasional use is typically fine. For chronic pain management, discuss alternatives with your healthcare provider.',
    });
  }

  return JSON.stringify({
    hasInteractions: interactions.length > 0,
    interactions: interactions.length > 0 ? interactions : [{
      medications: ['All checked medications'],
      severity: 'none',
      description: 'No significant interactions were found between the medications you\'re taking.',
      recommendation: 'Continue taking your medications as prescribed. Always inform your healthcare provider about all medications you take.',
    }],
    summary: interactions.length > 0 
      ? `Found ${interactions.length} potential interaction(s) between your medications. Please review the details and consult your healthcare provider if you have concerns.`
      : 'No significant drug interactions were detected between your current medications. Continue taking them as prescribed.',
  });
};

const getMockMedicationInfo = (prompt) => {
  const isAspirin = prompt.toLowerCase().includes('aspirin');
  const isMetformin = prompt.toLowerCase().includes('metformin');
  const isLisinopril = prompt.toLowerCase().includes('lisinopril');
  const isIbuprofen = prompt.toLowerCase().includes('ibuprofen');

  if (isAspirin) {
    return JSON.stringify({
      genericName: 'Acetylsalicylic Acid',
      drugClass: 'Nonsteroidal Anti-inflammatory Drug (NSAID) / Antiplatelet',
      commonUses: ['Pain relief', 'Fever reduction', 'Heart attack prevention', 'Stroke prevention'],
      howItWorks: 'Aspirin works by blocking the production of prostaglandins, chemicals that cause inflammation, pain, and fever. It also prevents blood platelets from clumping together, reducing the risk of blood clots.',
      commonSideEffects: ['Stomach upset', 'Heartburn', 'Nausea', 'Easy bruising'],
      seriousSideEffects: ['Stomach bleeding', 'Allergic reactions', 'Ringing in ears (tinnitus)', 'Severe stomach pain'],
      precautions: ['Avoid alcohol', 'Not for children with viral infections', 'Inform doctor before surgery', 'May interact with blood thinners'],
      foodInteractions: ['Alcohol increases bleeding risk', 'Take with food to reduce stomach upset'],
      storageInstructions: 'Store at room temperature away from moisture and heat. Keep in original container.',
      missedDoseGuidance: 'If taking regularly, take the missed dose as soon as you remember. Skip if it\'s almost time for the next dose.',
    });
  }

  if (isMetformin) {
    return JSON.stringify({
      genericName: 'Metformin Hydrochloride',
      drugClass: 'Biguanide (Antidiabetic)',
      commonUses: ['Type 2 diabetes management', 'Prediabetes treatment', 'PCOS management'],
      howItWorks: 'Metformin reduces glucose production in the liver, decreases intestinal absorption of glucose, and improves insulin sensitivity in muscle cells.',
      commonSideEffects: ['Nausea', 'Diarrhea', 'Stomach upset', 'Metallic taste', 'Loss of appetite'],
      seriousSideEffects: ['Lactic acidosis (rare but serious)', 'Vitamin B12 deficiency', 'Low blood sugar when combined with other diabetes medications'],
      precautions: ['Stay hydrated', 'Avoid excessive alcohol', 'May need to stop before contrast imaging', 'Monitor kidney function'],
      foodInteractions: ['Take with meals to reduce stomach upset', 'Limit alcohol consumption'],
      storageInstructions: 'Store at room temperature away from moisture and light.',
      missedDoseGuidance: 'Take with your next meal. Do not double the dose. Contact your doctor if you miss multiple doses.',
    });
  }

  // Default generic response
  return JSON.stringify({
    genericName: 'Information not available',
    drugClass: 'Consult your pharmacist',
    commonUses: ['Consult your healthcare provider for specific information about this medication'],
    howItWorks: 'Please consult your pharmacist or healthcare provider for detailed information about how this medication works.',
    commonSideEffects: ['Side effects vary by medication', 'Consult your pharmacist for specific information'],
    seriousSideEffects: ['Seek medical attention for any severe or unusual symptoms'],
    precautions: ['Follow your doctor\'s instructions', 'Read the medication guide provided with your prescription'],
    foodInteractions: ['Consult your pharmacist about food interactions'],
    storageInstructions: 'Store as directed on the medication label.',
    missedDoseGuidance: 'Follow the guidance provided with your medication or consult your pharmacist.',
  });
};

const getMockSuggestions = (prompt) => {
  return JSON.stringify({
    bestTimeToTake: 'Take at the same time each day for best results. Morning doses with breakfast are often recommended unless your doctor specifies otherwise.',
    withFood: 'Take with food or a full glass of water to minimize stomach upset, unless your medication label indicates otherwise.',
    tips: [
      'Set a daily alarm to help remember your dose',
      'Keep your medication in a visible place as a reminder',
      'Use a pill organizer to track daily doses',
      'Keep a medication diary to track any side effects',
    ],
    warnings: [
      'Do not stop taking this medication without consulting your doctor',
      'Inform all healthcare providers about all medications you take',
      'Store away from children and pets',
      'Check expiration dates regularly',
    ],
    reminders: [
      'Refill your prescription before running out',
      'Keep a list of all your medications in your wallet',
      'Bring all medications to doctor appointments',
      'Report any unusual side effects to your healthcare provider',
    ],
  });
};

const getMockQAResponse = (prompt) => {
  const question = prompt.toLowerCase();

  if (question.includes('side effect')) {
    return 'Side effects vary depending on the specific medication. Common side effects to watch for include nausea, dizziness, headache, and stomach upset. If you experience severe side effects like difficulty breathing, severe rash, or unusual bleeding, seek medical attention immediately. Always read the medication guide that comes with your prescription and discuss any concerns with your pharmacist or doctor.';
  }

  if (question.includes('miss') || question.includes('forgot')) {
    return 'If you miss a dose, the general guideline is to take it as soon as you remember. However, if it\'s almost time for your next scheduled dose, skip the missed dose and continue with your regular schedule. Never take a double dose to make up for a missed one. For specific medications, especially those with narrow dosing windows (like some heart medications or antibiotics), consult your pharmacist or doctor for guidance.';
  }

  if (question.includes('food') || question.includes('eat')) {
    return 'Whether to take medication with food depends on the specific medication. Some medications work better on an empty stomach, while others should be taken with food to reduce stomach upset or improve absorption. Check your medication label or consult your pharmacist. As a general rule, drinking a full glass of water with your medication is usually recommended.';
  }

  if (question.includes('alcohol')) {
    return 'Alcohol can interact with many medications, potentially causing dangerous side effects or reducing medication effectiveness. It\'s generally advisable to limit or avoid alcohol while taking prescription medications. Specific interactions include increased drowsiness with sedatives, increased bleeding risk with blood thinners, and liver damage risk with certain medications. Always check with your pharmacist or doctor about alcohol interactions with your specific medications.';
  }

  return 'Thank you for your question. For the most accurate and personalized medical advice, I recommend consulting with your healthcare provider or pharmacist. They can provide guidance specific to your health conditions and medications. If you have an urgent medical concern, please contact your doctor or visit a healthcare facility.\n\nIs there anything else I can help you with regarding general medication information?';
};
