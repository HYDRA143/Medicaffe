# MediCaffe 💊☕

**AI-Powered Medication Interaction Checker & Personal Medication Manager**

MediCaffe is a React Native mobile application that helps users manage their medications safely by leveraging AI to check for potential drug interactions, provide detailed medication information, and answer medication-related questions.

![MediCaffe Banner](https://via.placeholder.com/800x400/4A90A4/FFFFFF?text=MediCaffe+-+AI+Medication+Assistant)

## 📱 App Concept & Features

### Core Idea
MediCaffe addresses a critical healthcare need: helping patients understand how their medications interact with each other. Many people take multiple medications, and understanding potential interactions is crucial for their safety. Our AI-powered solution provides:

- **Drug Interaction Checking**: Analyze multiple medications for potential interactions with severity ratings
- **AI-Powered Information**: Get detailed information about medications, side effects, and usage guidelines
- **Personal Medication Manager**: Keep track of all your medications in one place
- **Interactive AI Assistant**: Ask questions about your medications and get personalized answers

### Key Features

#### 🏠 Home Dashboard
- Overview of all your medications
- Quick access to main features
- Recent interaction alerts
- Activity statistics

#### 💊 Medication Management
- Add medications with detailed information (name, dosage, form, frequency)
- AI-powered suggestions when adding medications
- Mark medications as active/inactive
- View detailed AI-generated information about each medication

#### 🛡️ Interaction Checker
- Select multiple medications to check for interactions
- AI analyzes potential drug interactions
- Clear severity ratings (None, Mild, Moderate, Severe)
- Detailed explanations and recommendations
- History of past interaction checks

#### 🤖 AI Assistant
- Chat interface for medication questions
- Personalized responses based on your medication list
- Suggested questions for quick access
- Chat history preservation

#### 👤 Profile & Settings
- User profile management
- Health conditions tracking
- App settings and preferences
- Data management options

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React Native** | Cross-platform mobile development |
| **Expo** | Development platform and build tools |
| **React Navigation** | Navigation (Stack & Tab navigators) |
| **AsyncStorage** | Local data persistence |
| **Google Gemini AI** | AI-powered responses and analysis |
| **StyleSheet** | Styling (no external UI libraries) |
| **Context API** | State management |

### AI API Used
- **Google Gemini 1.5 Flash** - For drug interaction analysis, medication information, and Q&A
- The app includes comprehensive mock responses for demo/testing without an API key

## 📁 Project Structure

```
medicaffe/
├── App.js                    # Main entry point
├── app.json                  # Expo configuration
├── package.json              # Dependencies
├── babel.config.js           # Babel configuration
└── src/
    ├── components/           # Reusable UI components
    │   ├── Button.js         # Customizable button
    │   ├── Card.js           # Card container
    │   ├── Header.js         # Screen header
    │   ├── Input.js          # Text input with validation
    │   ├── LoadingSpinner.js # Loading indicator
    │   ├── MedicationCard.js # Medication display card
    │   ├── InteractionAlert.js # Interaction warning display
    │   ├── EmptyState.js     # Empty state placeholder
    │   └── index.js          # Component exports
    │
    ├── screens/              # App screens
    │   ├── OnboardingScreen.js    # Welcome & profile setup
    │   ├── HomeScreen.js          # Main dashboard
    │   ├── AddMedicationScreen.js # Add/edit medications
    │   ├── MedicationDetailScreen.js # Medication details
    │   ├── InteractionCheckerScreen.js # Drug interaction checker
    │   ├── AIAssistantScreen.js   # AI chat interface
    │   ├── ProfileScreen.js       # User profile & settings
    │   └── index.js               # Screen exports
    │
    ├── navigation/           # Navigation configuration
    │   └── AppNavigator.js   # Stack & Tab navigators
    │
    ├── context/              # State management
    │   └── AppContext.js     # Global app state
    │
    ├── hooks/                # Custom React hooks
    │   ├── useAI.js          # AI interaction hook
    │   └── index.js          # Hook exports
    │
    ├── utils/                # Utility functions
    │   ├── storage.js        # AsyncStorage operations
    │   ├── aiService.js      # AI API integration
    │   └── constants.js      # App constants
    │
    └── styles/               # Styling
        └── theme.js          # Colors, typography, spacing
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator, or Expo Go app on your phone

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HYDRA143/Medicaffe.git
   cd Medicaffe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure AI API (Optional)**
   
   The app works with mock responses by default. To use real AI responses:
   
   - Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Open `src/utils/aiService.js`
   - Replace `'YOUR_GEMINI_API_KEY'` with your actual API key
   - Set `USE_MOCK_RESPONSES = false`

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device/emulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app for physical device

### Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
```

## 📱 App Screens & User Flows

### Onboarding Flow
1. Welcome slides explaining app features
2. Profile setup (name, age, health conditions)
3. Redirect to main app

### Main User Flows

**Adding a Medication:**
1. Tap "Add Medication" on home screen
2. Enter medication details (name, dosage, form)
3. Select frequency and timing
4. Optionally get AI suggestions
5. Save medication

**Checking Interactions:**
1. Navigate to "Check" tab
2. Select 2+ medications
3. Tap "Check for Interactions"
4. View results with severity ratings
5. Expand for detailed recommendations

**Using AI Assistant:**
1. Navigate to "AI Help" tab
2. Type a question or tap a suggestion
3. View AI response
4. Continue conversation as needed

## ⚠️ Limitations & Known Issues

### Current Limitations
1. **Mock AI by Default**: Real AI requires API key configuration
2. **No Cloud Sync**: Data is stored locally only
3. **No Notifications**: Medication reminders are UI only (not functional)
4. **Limited Drug Database**: AI knowledge is based on general information

### Known Issues
- On some Android devices, keyboard may overlap input on AI chat
- Initial app load may take a few seconds on older devices

### Future Improvements
- Cloud backup & sync
- Functional medication reminders with notifications
- Barcode scanning for quick medication entry
- Family/caregiver sharing features
- Integration with pharmacy systems

## 🔒 Privacy & Security

- **Local Storage Only**: All data is stored on your device using AsyncStorage
- **No Data Collection**: We do not collect or transmit personal health information
- **API Calls**: Only medication names are sent to AI API for analysis (no personal data)

## 📋 Disclaimer

> **Important**: MediCaffe provides general medication information powered by AI. This information is for educational purposes only and should not be considered medical advice. Always consult with a qualified healthcare provider before making any decisions about your medications. Never disregard professional medical advice or delay seeking it because of information provided by this app.

## 🎥 Video Walkthrough

[Link to Loom Video Walkthrough] - A 3-5 minute demonstration showing:
- App concept explanation
- Onboarding flow
- Adding medications
- Checking drug interactions
- Using the AI assistant
- Profile management

## 📄 License

This project is created for educational/assessment purposes.

## 👤 Author

**HYDRA143**
- GitHub: [@HYDRA143](https://github.com/HYDRA143)

---

Built with ❤️ using React Native & Expo
