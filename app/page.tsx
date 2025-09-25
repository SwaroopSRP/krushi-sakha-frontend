"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  User,
  CloudRain,
  TrendingUp,
  DollarSign,
  Stethoscope,
  Mic,
  MicOff,
  ArrowLeft,
  Camera,
  MapPin,
  Thermometer,
  AlertTriangle,
  Languages,
  Upload,
  CheckCircle,
  Bell,
} from "lucide-react"
import Image from "next/image"

type UserData = {
  firstName: string
  lastName: string
  phoneNo: string
  gender: string
  farmerType: string
  farmlandArea: string
  location: string
  district: string
}

type Screen =
  | "welcome"
  | "register"
  | "home"
  | "profile"
  | "crop-doctor"
  | "weather"
  | "price-check"
  | "profitability"
  | "voice-assistant"
  | "notifications" // Added notifications screen

type Language = "en" | "ml"

const districtCoordinates = {
  thrissur: { lat: 10.5276, lon: 76.2144 },
  palakkad: { lat: 10.7867, lon: 76.6548 },
  kottayam: { lat: 9.5916, lon: 76.5222 },
  ernakulam: { lat: 9.9312, lon: 76.2673 },
  malappuram: { lat: 11.041, lon: 76.0788 },
  alappuzha: { lat: 9.4981, lon: 76.3388 },
  kollam: { lat: 8.8932, lon: 76.6141 },
  kozhikode: { lat: 11.2588, lon: 75.7804 },
  kannur: { lat: 11.8745, lon: 75.3704 },
  idukki: { lat: 9.8547, lon: 76.9366 },
}

type WeatherData = {
  weatherCode: number
  weatherDescription: string
  maxTemperature: number
  minTemperature: number
  precipitationSum: number
  sunrise: string
  sunset: string
  annualRainfall: number
}

// Added MarketPriceData and MarketPricesResponse types
type MarketPriceData = {
  district: string
  commodity: string
  arrivalDate: string
  price: number
}

type MarketPricesResponse = {
  statusCode: number
  data: MarketPriceData[]
  message: string
  success: boolean
}

const translations = {
  en: {
    // Welcome Screen
    appName: "Krushi Sakha",
    tagline: "Your Personalized Farming Digital Assistant",
    description: "Empowering farmers with AI-driven insights for better crop management",
    getStarted: "Get Started",

    // Registration Screen
    joinKrushiSakha: "Join Krushi Sakha",
    createProfile: "Create your farming profile",
    firstName: "First Name",
    lastName: "Last Name",
    phoneNumber: "Phone Number",
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    farmerType: "Farmer Type",
    landowner: "Landowner",
    tenant: "Tenant",
    farmlandArea: "Farmland Area (Hectares)",
    location: "Location",
    selectDistrict: "Select your district",
    confirmRegistration: "Confirm Registration",
    enterFirstName: "Enter first name",
    enterLastName: "Enter last name",
    enterPhoneNumber: "Enter phone number",
    enterAreaHectares: "Enter area in hectares",

    // Home Screen
    welcome: "Welcome",
    cropDoctor: "Crop Doctor",
    diseaseDetection: "Disease Detection",
    weather: "Weather",
    alertsForecast: "Alerts & Forecast",
    checkPrices: "Check Prices",
    marketRates: "Market Rates",
    profitability: "Profitability",
    revenueCheck: "Revenue Check",

    // Profile Screen
    profile: "Profile",
    phone: "Phone",
    hectares: "hectares",
    district: "District",
    signOut: "Sign Out",

    // Crop Doctor Screen
    diagnoseYourCrops: "Diagnose Your Crops",
    cropDoctorDescription: "Take a photo of your crop to detect diseases and get treatment recommendations",
    takePhoto: "Take Photo",
    uploadPhoto: "Upload Photo",
    aiPoweredDescription:
      "AI-powered disease detection will analyze your crop image and provide instant diagnosis with treatment suggestions.",
    diseaseDetected: "Disease Detected",
    riceBlastDisease: "Rice Blast Disease",
    confidenceLevel: "Confidence Level",
    treatmentRecommendations: "Treatment Recommendations",
    recommendation1: "Apply Tricyclazole fungicide (0.6g/L) spray every 10-15 days",
    recommendation2: "Ensure proper field drainage and avoid excessive nitrogen fertilization",
    recommendation3: "Use resistant rice varieties like Improved Samba Mahsuri for future planting",
    analyzeAnother: "Analyze Another Photo",

    // Weather Screen
    currentWeather: "Current Weather",
    partlyCloudy: "Partly Cloudy",
    humidity: "Humidity",
    rain: "Rain",
    wind: "Wind",
    weatherAlerts: "Weather Alerts",
    heavyRainWarning: "Heavy Rain Warning",
    expectedIn24Hours: "Expected in next 24 hours",
    optimalPlantingConditions: "Optimal Planting Conditions",
    goodConditionsRice: "Good conditions for rice planting",

    // Price Check Screen
    marketPrices: "Market Prices",
    perQuintal: "per quintal",
    bestPriceIn: "Best price in",
    fromLastWeek: "from last week",

    // Profitability Screen
    profitabilityCheck: "Profitability Check",
    revenueEstimation: "Revenue Estimation",
    basedOnYourFarm: "Based on your",
    hectaresIn: "hectares in",
    riceCultivation: "Rice Cultivation",
    coconutFarming: "Coconut Farming",
    estimatedAnnualRevenue: "Estimated annual revenue",
    recommendation: "Recommendation",
    riceRecommendation: "Rice cultivation shows higher profitability for your location and farm size.",

    // Voice Assistant Screen
    voiceAssistant: "Voice Assistant",
    askKrushiSakha: "Ask Krushi Sakha",
    speakYourQuestions: "Speak your farming questions and get instant answers",
    tapMicrophoneToStart: "Tap the microphone button below to start speaking",
    tapToStopRecording: "Tap to stop recording",
    tapToStartRecording: "Tap to start recording",
    recordingSpeak: "Recording... Speak now",
    voiceRecordedSuccess: "Voice recorded successfully! Processing your request...",
    voiceAssistantResponse:
      "Based on your farming history and current weather conditions in your area, this is an ideal time for sowing seeds. The soil moisture levels are optimal, and the upcoming weather forecast shows favorable conditions for germination. I recommend preparing your fields for rice cultivation as the monsoon pattern suggests good water availability for the next few months.",

    notifications: "Notifications",
    agricultureSchemes: "Agriculture Schemes",
    scheme1: "Sub-Mission Agricultural Mechanization Forms Out Now",
    scheme2: "Subhiksha Kerala Scheme Registrations Open",
    warningAlert: "Warning Alert",
    coffeeWarning: "Coffee plantation pest outbreak detected nearby! Check your crops",

    // Profit Calculator Screen
    cropDetails: "Crop Details",
    cropType: "Crop Type",
    selectCrop: "Select crop",
    landAreaAcres: "Land Area (acres)",
    enterArea: "Enter area",
    costBreakdown: "Cost Breakdown (₹)",
    seedCost: "Seed Cost",
    laborCost: "Labor Cost",
    fertilizerCost: "Fertilizer Cost",
    otherCosts: "Other Costs",
    expectedReturns: "Expected Returns",
    expectedYield: "Expected Yield (kg/quintal)",
    sellingPrice: "Selling Price (₹ per unit)",
    calculateProfitability: "Calculate Profitability",
    profitabilityResults: "Profitability Results",
    totalCosts: "Total Costs",
    totalRevenue: "Total Revenue",
    netProfit: "Net Profit",
    profitMargin: "Profit Margin",
    calculateAnother: "Calculate Another",
  },
  ml: {
    // Welcome Screen
    appName: "കൃഷി സഖാ",
    tagline: "നിങ്ങളുടെ വ്യക്തിഗത കൃഷി ഡിജിറ്റൽ സഹായി",
    description: "മികച്ച വിള പരിപാലനത്തിനായി AI-അധിഷ്ഠിത ഉൾക്കാഴലുകൾ നൽകി കർഷകരെ ശാക്തീകരിക്കുന്നു",
    getStarted: "ആരംഭിക്കുക",

    // Registration Screen
    joinKrushiSakha: "കൃഷി സഖായിൽ ചേരുക",
    createProfile: "നിങ്ങളുടെ കൃഷി പ്രൊഫൈൽ സൃഷ്ടിക്കുക",
    firstName: "പേരിന്റെ ആദ്യഭാഗം",
    lastName: "പേരിന്റെ അവസാനഭാഗം",
    phoneNumber: "ഫോൺ നമ്പർ",
    gender: "ലിംഗം",
    male: "പുരുഷൻ",
    female: "സ്ത്രീ",
    other: "മറ്റുള്ളവ",
    farmerType: "കർഷക തരം",
    landowner: "ഭൂവുടമ",
    tenant: "കുടിയാൻ",
    farmlandArea: "കൃഷിഭൂമിയുടെ വിസ്തീർണ്ണം (ഹെക്ടർ)",
    location: "സ്ഥലം",
    selectDistrict: "നിങ്ങളുടെ ജില്ല തിരഞ്ഞെടുക്കുക",
    confirmRegistration: "രജിസ്ട്രേഷൻ സ്ഥിരീകരിക്കുക",
    enterFirstName: "പേരിന്റെ ആദ്യഭാഗം നൽകുക",
    enterLastName: "പേരിന്റെ അവസാനഭാഗം നൽകുക",
    enterPhoneNumber: "ഫോൺ നമ്പർ നൽകുക",
    enterAreaHectares: "ഹെക്ടറിൽ വിസ്തീർണ്ണം നൽകുക",

    // Home Screen
    welcome: "സ്വാഗതം",
    cropDoctor: "വിള ഡോക്ടർ",
    diseaseDetection: "രോഗ കണ്ടെത്തൽ",
    weather: "കാലാവസ്ഥ",
    alertsForecast: "മുന്നറിയിപ്പുകളും പ്രവചനവും",
    checkPrices: "വില പരിശോധിക്കുക",
    marketRates: "വിപണി നിരക്കുകൾ",
    profitability: "ലാഭക്ഷമത",
    revenueCheck: "വരുമാന പരിശോധന",

    // Profile Screen
    profile: "പ്രൊഫൈൽ",
    phone: "ഫോൺ",
    hectares: "ഹെക്ടർ",
    district: "ജില്ല",
    signOut: "സൈൻ ഔട്ട്",

    // Crop Doctor Screen
    diagnoseYourCrops: "നിങ്ങളുടെ വിളകൾ പരിശോധിക്കുക",
    cropDoctorDescription: "രോഗങ്ങൾ കണ്ടെത്താനും ചികിത്സാ ശുപാർശകൾ ലഭിക്കാനും നിങ്ങളുടെ വിളയുടെ ഫോട്ടോ എടുക്കുക",
    takePhoto: "ഫോട്ടോ എടുക്കുക",
    uploadPhoto: "ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക",
    aiPoweredDescription:
      "AI-പവർഡ് രോഗ കണ്ടെത്തൽ നിങ്ങളുടെ വിള ചിത്രം വിശകലനം ചെയ്യുകയും ചികിത്സാ നിർദ്ദേശങ്ങളോടൊപ്പം തൽക്ഷണ രോഗനിർണയം നൽകുകയും ചെയ്യും.",
    diseaseDetected: "രോഗം കണ്ടെത്തി",
    riceBlastDisease: "നെല്ല് ബ്ലാസ്റ്റ് രോഗം",
    confidenceLevel: "വിശ്വാസ്യത നില",
    treatmentRecommendations: "ചികിത്സാ ശുപാർശകൾ",
    recommendation1: "ട്രൈസൈക്ലാസോൾ കുമിൾനാശിനി (0.6g/L) 10-15 ദിവസം കൂടുമ്പോൾ തളിക്കുക",
    recommendation2: "ശരിയായ വയൽ ഡ്രെയിനേജ് ഉറപ്പാക്കുകയും അധിക നൈട്രജൻ വളം ഒഴിവാക്കുകയും ചെയ്യുക",
    recommendation3: "ഭാവിയിലെ നടീലിനായി ഇംപ്രൂവ്ഡ് സാംബ മഹ്സൂരി പോലുള്ള പ്രതിരോധശേഷിയുള്ള നെല്ല് ഇനങ്ങൾ ഉപയോഗിക്കുക",
    analyzeAnother: "മറ്റൊരു ഫോട്ടോ വിശകലനം ചെയ്യുക",

    // Weather Screen
    currentWeather: "നിലവിലെ കാലാവസ്ഥ",
    partlyCloudy: "ഭാഗികമായി മേഘാവൃതം",
    humidity: "ആർദ്രത",
    rain: "മഴ",
    wind: "കാറ്റ്",
    weatherAlerts: "കാലാവസ്ഥാ മുന്നറിയിപ്പുകൾ",
    heavyRainWarning: "കനത്ത മഴയുടെ മുന്നറിയിപ്പ്",
    expectedIn24Hours: "അടുത്ത 24 മണിക്കൂറിനുള്ളിൽ പ്രതീക്ഷിക്കുന്നു",
    optimalPlantingConditions: "ഒപ്റ്റിമൽ നടീൽ സാഹചര്യങ്ങൾ",
    goodConditionsRice: "നെല്ല് നടാനുള്ള നല്ല സാഹചര്യങ്ങൾ",

    // Price Check Screen
    marketPrices: "വിപണി വിലകൾ",
    perQuintal: "ക്വിന്റലിന്",
    bestPriceIn: "ഏറ്റവും നല്ല വില",
    fromLastWeek: "കഴിഞ്ഞ ആഴ്ചയിൽ നിന്ന്",

    // Profitability Screen
    profitabilityCheck: "ലാഭക്ഷമത പരിശോധന",
    revenueEstimation: "വരുമാന കണക്കാക്കൽ",
    basedOnYourFarm: "നിങ്ങളുടെ",
    hectaresIn: "ഹെക്ടർ അടിസ്ഥാനമാക്കി",
    riceCultivation: "നെല്ല് കൃഷി",
    coconutFarming: "തെങ്ങ് കൃഷി",
    estimatedAnnualRevenue: "കണക്കാക്കിയ വാർഷിക വരുമാനം",
    recommendation: "ശുപാർശ",
    riceRecommendation: "നിങ്ങളുടെ സ്ഥലത്തിനും കൃഷിഭൂമിയുടെ വലുപ്പത്തിനും നെല്ല് കൃഷി കൂടുതൽ ലാഭകരമാണ്.",

    // Voice Assistant Screen
    voiceAssistant: "വോയ്സ് അസിസ്റ്റന്റ്",
    askKrushiSakha: "കൃഷി സഖായോട് ചോദിക്കുക",
    speakYourQuestions: "നിങ്ങളുടെ കൃഷി ചോദ്യങ്ങൾ പറയുക, തൽക്ഷണ ഉത്തരങ്ങൾ ലഭിക്കുക",
    tapMicrophoneToStart: "സംസാരിക്കാൻ ആരംഭിക്കുന്നതിന് താഴെയുള്ള മൈക്രോഫോൺ ബട്ടൺ ടാപ്പ് ചെയ്യുക",
    tapToStopRecording: "റെക്കോർഡിംഗ് നിർത്താൻ ടാപ്പ് ചെയ്യുക",
    tapToStartRecording: "റെക്കോർഡിംഗ് ആരംഭിക്കാൻ ടാപ്പ് ചെയ്യുക",
    recordingSpeak: "റെക്കോർഡിംഗ്... ഇപ്പോൾ സംസാരിക്കുക",
    voiceRecordedSuccess: "വോയ്സ് വിജയകരമായി റെക്കോർഡ് ചെയ്തു! നിങ്ങളുടെ അഭ്യർത്ഥന പ്രോസസ്സ് ചെയ്യുന്നു...",
    voiceAssistantResponse:
      "നിങ്ങളുടെ കൃഷി ചരിത്രവും നിലവിലെ കാലാവസ്ഥാ സാഹചര്യങ്ങളും അടിസ്ഥാനമാക്കി, ഇത് വിത്ത് വിതയ്ക്കാനുള്ള അനുയോജ്യമായ സമയമാണ്. മണ്ണിലെ ഈർപ്പം അനുയോജ്യമാണ്, വരാനിരിക്കുന്ന കാലാവസ്ഥാ പ്രവചനം മുളയ്ക്കാൻ അനുകൂല സാഹചര്യങ്ങൾ കാണിക്കുന്നു. മൺസൂൺ പാറ്റേൺ അടുത്ത കുറച്ച് മാസങ്ങളിൽ നല്ല ജലലഭ്യത സൂചിപ്പിക്കുന്നതിനാൽ നെല്ല് കൃഷിക്കായി നിങ്ങളുടെ വയലുകൾ തയ്യാറാക്കാൻ ഞാൻ ശുപാർശ ചെയ്യുന്നു.",

    notifications: "അറിയിപ്പുകൾ",
    agricultureSchemes: "കൃഷി പദ്ധതികൾ",
    scheme1: "സബ്-മിഷൻ കാർഷിക യന്ത്രവൽക്കരണ ഫോമുകൾ ഇപ്പോൾ പുറത്തിറങ്ങി",
    scheme2: "സുഭിക്ഷ കേരള പദ്ധതി രജിസ്ട്രേഷൻ തുറന്നു",
    warningAlert: "മുന്നറിയിപ്പ് അലേർട്ട്",
    coffeeWarning: "സമീപത്ത് കാപ്പി തോട്ടത്തിൽ കീട പൊട്ടിത്തെറി കണ്ടെത്തി! നിങ്ങളുടെ വിളകൾ പരിശോധിക്കുക",

    // Profit Calculator Screen
    cropDetails: "വിള വിവരങ്ങൾ",
    cropType: "വിള തരം",
    selectCrop: "വിള തിരഞ്ഞെടുക്കുക",
    landAreaAcres: "ഭൂമിയുടെ വിസ്തീർണ്ണം (ഏക്കർ)",
    enterArea: "വിസ്തീർണ്ണം നൽകുക",
    costBreakdown: "ചെലവ് വിവരണം (₹)",
    seedCost: "വിത്ത് ചെലവ്",
    laborCost: "തൊഴിൽ ചെലവ്",
    fertilizerCost: "വള ചെലവ്",
    otherCosts: "മറ്റ് ചെലവുകൾ",
    expectedReturns: "പ്രതീക്ഷിക്കുന്ന വരുമാനം",
    expectedYield: "പ്രതീക്ഷിക്കുന്ന വിളവ് (കിലോ/ക്വിന്റൽ)",
    sellingPrice: "വിൽപ്പന വില (₹ ഒരു യൂണിറ്റിന്)",
    calculateProfitability: "ലാഭക്ഷമത കണക്കാക്കുക",
    profitabilityResults: "ലാഭക്ഷമത ഫലങ്ങൾ",
    totalCosts: "മൊത്തം ചെലവുകൾ",
    totalRevenue: "മൊത്തം വരുമാനം",
    netProfit: "അറ്റ ​​ലാഭം",
    profitMargin: "ലാഭ മാർജിൻ",
    calculateAnother: "മറ്റൊന്ന് കണക്കാക്കുക",
  },
}

export default function KrushiSakha() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome")
  const [language, setLanguage] = useState<Language>("en")
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    phoneNo: "",
    gender: "",
    farmerType: "",
    farmlandArea: "",
    location: "",
    district: "",
  })
  const [isRecording, setIsRecording] = useState(false)
  const [voiceText, setVoiceText] = useState("")
  const [diseaseDetected, setDiseaseDetected] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showVoiceResponse, setShowVoiceResponse] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const [profitCalculator, setProfitCalculator] = useState({
    cropType: "",
    seedCost: "",
    laborCost: "",
    fertilizerCost: "",
    otherCosts: "",
    expectedYield: "",
    sellingPrice: "",
    showResults: false,
  })

  const cropPrices = {
    rice: 2500,
    rubber: 180,
    coconut: 25,
  }

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState<string | null>(null)

  // Added market prices state and loading/error states
  const [marketPrices, setMarketPrices] = useState<{ [key: string]: MarketPriceData[] }>({})
  const [marketLoading, setMarketLoading] = useState(false)
  const [marketError, setMarketError] = useState<string | null>(null)
  const [selectedCommodity, setSelectedCommodity] = useState<string>("rice")

  const t = (key: keyof typeof translations.en) => translations[language][key]

  useEffect(() => {
    const savedData = localStorage.getItem("userData")
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
    if (savedData) {
      setUserData(JSON.parse(savedData))
      setCurrentScreen("home")
    }
  }, [])

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ml" : "en"
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const handleRegistration = () => {
    localStorage.setItem("userData", JSON.stringify(userData))
    setCurrentScreen("home")
  }

  const handleLocationChange = (location: string) => {
    setUserData((prev) => ({
      ...prev,
      location,
      district: location.toLowerCase(),
    }))
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      setVoiceText(t("recordingSpeak"))
      setTimeout(() => {
        setVoiceText(t("voiceRecordedSuccess"))
        setIsRecording(false)
        setIsProcessing(true)
        setTimeout(() => {
          setIsProcessing(false)
          setShowVoiceResponse(true)
          setVoiceText(t("voiceAssistantResponse"))
        }, 2000)
      }, 3000)
    }
  }

  const handlePhotoUpload = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setDiseaseDetected(true)
    }, 3000)
  }

  const resetCropDoctor = () => {
    setDiseaseDetected(false)
    setIsAnalyzing(false)
  }

  const resetVoiceAssistant = () => {
    setShowVoiceResponse(false)
    setIsProcessing(false)
    setVoiceText("")
  }

  const handleSignOut = () => {
    localStorage.removeItem("userData")
    localStorage.removeItem("language")
    setUserData({
      firstName: "",
      lastName: "",
      phoneNo: "",
      gender: "",
      farmerType: "",
      farmlandArea: "",
      location: "",
      district: "",
    })
    setCurrentScreen("register")
  }

  const calculateProfitability = () => {
    const totalCosts =
      Number(profitCalculator.seedCost) +
      Number(profitCalculator.laborCost) +
      Number(profitCalculator.fertilizerCost) +
      Number(profitCalculator.otherCosts)

    const totalRevenue = Number(profitCalculator.expectedYield) * Number(profitCalculator.sellingPrice)
    const profit = totalRevenue - totalCosts
    const profitMargin = ((profit / totalRevenue) * 100).toFixed(1)

    setProfitCalculator((prev) => ({ ...prev, showResults: true }))
  }

  const handleCropTypeChange = (cropType: string) => {
    const price = cropPrices[cropType as keyof typeof cropPrices] || 0
    setProfitCalculator((prev) => ({
      ...prev,
      cropType,
      sellingPrice: price.toString(),
    }))
  }

  const resetCalculator = () => {
    setProfitCalculator({
      cropType: "",
      seedCost: "",
      laborCost: "",
      fertilizerCost: "",
      otherCosts: "",
      expectedYield: "",
      sellingPrice: "",
      showResults: false,
    })
  }

  const fetchWeatherData = async (district: string) => {
    const coordinates = districtCoordinates[district.toLowerCase() as keyof typeof districtCoordinates]
    if (!coordinates) {
      setWeatherError("District coordinates not found")
      return
    }

    setWeatherLoading(true)
    setWeatherError(null)

    try {
      const response = await fetch(
        `http://172.18.65.5:5001/api/v1/ext-data/weather-data?lat=${coordinates.lat}&lon=${coordinates.lon}`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success && result.data) {
        setWeatherData(result.data)
      } else {
        throw new Error(result.message || "Failed to fetch weather data")
      }
    } catch (error) {
      console.error("Weather API error:", error)
      setWeatherError("Failed to fetch weather data")
    } finally {
      setWeatherLoading(false)
    }
  }

  // Added fetchMarketPrices and fetchAllMarketPrices functions
  const fetchMarketPrices = async (district: string, commodity: string) => {
    setMarketLoading(true)
    setMarketError(null)

    try {
      const response = await fetch(
        `http://172.18.65.5:5001/api/v1/ext-data/market-price?district=${encodeURIComponent(district)}&commodity=${encodeURIComponent(commodity)}`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: MarketPricesResponse = await response.json()

      if (result.success && result.data) {
        setMarketPrices((prev) => ({
          ...prev,
          [commodity.toLowerCase()]: result.data,
        }))
      } else {
        throw new Error(result.message || "Failed to fetch market prices")
      }
    } catch (error) {
      console.error("Market prices API error:", error)
      setMarketError("Failed to fetch market prices")
    } finally {
      setMarketLoading(false)
    }
  }

  const fetchAllMarketPrices = async (district: string) => {
    const commodities = ["rice", "coconut", "rubber"]

    for (const commodity of commodities) {
      await fetchMarketPrices(district, commodity)
    }
  }

  useEffect(() => {
    if (userData.district && currentScreen === "weather") {
      fetchWeatherData(userData.district)
    }
  }, [userData.district, currentScreen])

  // Added useEffect for fetching market prices
  useEffect(() => {
    if (userData.district && currentScreen === "price-check") {
      fetchAllMarketPrices(userData.district)
    }
  }, [userData.district, currentScreen])

  // Added formatDate and calculatePriceChange functions
  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split("/")
    return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day)).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
      },
    )
  }

  const calculatePriceChange = (prices: MarketPriceData[]) => {
    if (prices.length < 2) return { change: 0, percentage: 0 }

    const latest = prices[0].price
    const previous = prices[1].price
    const change = latest - previous
    const percentage = (change / previous) * 100

    return { change, percentage }
  }

  if (currentScreen === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex flex-col items-center justify-center p-6">
        <div className="absolute top-6 right-6">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2 bg-transparent"
          >
            <Languages className="w-4 h-4" />
            {language === "en" ? "മലയാളം" : "English"}
          </Button>
        </div>

        <div className="text-center space-y-8 max-w-md">
          <div className="relative">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 bg-white shadow-lg">
              <Image
                src="/logo.jpeg"
                alt="Krushi Sakha Logo"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-accent-foreground">AI</span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-primary text-balance">{t("appName")}</h1>
            <p className="text-lg text-muted-foreground text-pretty">{t("tagline")}</p>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>

          <Button
            onClick={() => setCurrentScreen("register")}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4"
          >
            {t("getStarted")}
          </Button>
        </div>
      </div>
    )
  }

  if (currentScreen === "register") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="absolute top-6 right-6">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2 bg-transparent"
          >
            <Languages className="w-4 h-4" />
            {language === "en" ? "മലയാളം" : "English"}
          </Button>
        </div>

        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-4 bg-white shadow-md">
              <Image
                src="/logo.jpeg"
                alt="Krushi Sakha Logo"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-foreground">{t("joinKrushiSakha")}</h2>
            <p className="text-muted-foreground">{t("createProfile")}</p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("firstName")}</Label>
                  <Input
                    id="firstName"
                    value={userData.firstName}
                    onChange={(e) => setUserData((prev) => ({ ...prev, firstName: e.target.value }))}
                    placeholder={t("enterFirstName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("lastName")}</Label>
                  <Input
                    id="lastName"
                    value={userData.lastName}
                    onChange={(e) => setUserData((prev) => ({ ...prev, lastName: e.target.value }))}
                    placeholder={t("enterLastName")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNo">{t("phoneNumber")}</Label>
                <Input
                  id="phoneNo"
                  value={userData.phoneNo}
                  onChange={(e) => setUserData((prev) => ({ ...prev, phoneNo: e.target.value }))}
                  placeholder={t("enterPhoneNumber")}
                />
              </div>

              <div className="space-y-3">
                <Label>{t("gender")}</Label>
                <RadioGroup
                  value={userData.gender}
                  onValueChange={(value) => setUserData((prev) => ({ ...prev, gender: value }))}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">{t("male")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">{t("female")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">{t("other")}</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>{t("farmerType")}</Label>
                <RadioGroup
                  value={userData.farmerType}
                  onValueChange={(value) => setUserData((prev) => ({ ...prev, farmerType: value }))}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="landowner" id="landowner" />
                    <Label htmlFor="landowner">{t("landowner")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tenant" id="tenant" />
                    <Label htmlFor="tenant">{t("tenant")}</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmlandArea">{t("farmlandArea")}</Label>
                <Input
                  id="farmlandArea"
                  value={userData.farmlandArea}
                  onChange={(e) => setUserData((prev) => ({ ...prev, farmlandArea: e.target.value }))}
                  placeholder={t("enterAreaHectares")}
                  type="number"
                />
              </div>

              <div className="space-y-2">
                <Label>{t("location")}</Label>
                <Select value={userData.location} onValueChange={handleLocationChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectDistrict")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Thrissur">Thrissur</SelectItem>
                    <SelectItem value="Palakkad">Palakkad</SelectItem>
                    <SelectItem value="Kottayam">Kottayam</SelectItem>
                    <SelectItem value="Ernakulam">Ernakulam</SelectItem>
                    <SelectItem value="Malappuram">Malappuram</SelectItem>
                    <SelectItem value="Alappuzha">Alappuzha</SelectItem>
                    <SelectItem value="Kollam">Kollam</SelectItem>
                    <SelectItem value="Kozhikode">Kozhikode</SelectItem>
                    <SelectItem value="Kannur">Kannur</SelectItem>
                    <SelectItem value="Idukki">Idukki</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleRegistration}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={
                  !userData.firstName ||
                  !userData.lastName ||
                  !userData.phoneNo ||
                  !userData.gender ||
                  !userData.farmerType ||
                  !userData.farmlandArea ||
                  !userData.location
                }
              >
                {t("confirmRegistration")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentScreen === "profile") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => setCurrentScreen("home")} className="mr-4">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold">{t("profile")}</h2>
            <div className="ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center gap-2 bg-transparent"
              >
                <Languages className="w-4 h-4" />
                {language === "en" ? "മലയാളം" : "English"}
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-center mb-6">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {userData.firstName[0]}
                    {userData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">
                  {userData.firstName} {userData.lastName}
                </h3>
                <p className="text-muted-foreground capitalize">{userData.farmerType}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("phone")}:</span>
                  <span>{userData.phoneNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("gender")}:</span>
                  <span className="capitalize">{userData.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("farmerType")}:</span>
                  <span className="capitalize">{userData.farmerType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("farmlandArea")}:</span>
                  <span>
                    {userData.farmlandArea} {t("hectares")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("location")}:</span>
                  <span>{userData.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("district")}:</span>
                  <span className="capitalize">{userData.district}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button onClick={handleSignOut} variant="destructive" className="w-full">
                  {t("signOut")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentScreen === "crop-doctor") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => setCurrentScreen("home")} className="mr-4">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold">{t("cropDoctor")}</h2>
          </div>

          {!diseaseDetected && !isAnalyzing && (
            <Card>
              <CardContent className="p-6 text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                  <Camera className="w-12 h-12 text-accent" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{t("diagnoseYourCrops")}</h3>
                  <p className="text-muted-foreground text-sm">{t("cropDoctorDescription")}</p>
                </div>

                <div className="space-y-4">
                  <Button className="w-full bg-accent hover:bg-accent/90" onClick={handlePhotoUpload}>
                    <Upload className="w-4 h-4 mr-2" />
                    {t("uploadPhoto")}
                  </Button>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">{t("aiPoweredDescription")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isAnalyzing && (
            <Card>
              <CardContent className="p-6 text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-accent/10 rounded-full flex items-center justify-center animate-pulse">
                  <Camera className="w-12 h-12 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Analyzing Image...</h3>
                  <p className="text-muted-foreground text-sm">AI is detecting diseases in your crop photo</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full animate-pulse" style={{ width: "70%" }}></div>
                </div>
              </CardContent>
            </Card>
          )}

          {diseaseDetected && (
            <div className="space-y-4">
              <Card className="border-destructive/20">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-destructive mr-2" />
                    <h3 className="text-lg font-semibold text-destructive">{t("diseaseDetected")}</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-destructive/5 rounded-lg">
                      <h4 className="font-semibold text-destructive mb-2">{t("riceBlastDisease")}</h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t("confidenceLevel")}</span>
                        <span className="font-medium">87%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-6 h-6 text-accent mr-2" />
                    <h3 className="text-lg font-semibold">{t("treatmentRecommendations")}</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-accent">1</span>
                      </div>
                      <p className="text-sm">{t("recommendation1")}</p>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-accent">2</span>
                      </div>
                      <p className="text-sm">{t("recommendation2")}</p>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-accent">3</span>
                      </div>
                      <p className="text-sm">{t("recommendation3")}</p>
                    </div>
                  </div>

                  <Button className="w-full mt-6 bg-primary hover:bg-primary/90" onClick={resetCropDoctor}>
                    <Camera className="w-4 h-4 mr-2" />
                    {t("analyzeAnother")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (currentScreen === "weather") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => setCurrentScreen("home")} className="mr-4">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold">{t("weather")}</h2>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{userData.location}</h3>
                    <p className="text-muted-foreground">{t("currentWeather")}</p>
                  </div>
                  <div className="text-right">
                    {weatherLoading ? (
                      <div className="animate-pulse">
                        <div className="text-3xl font-bold">--°C</div>
                        <div className="text-sm text-muted-foreground">Loading...</div>
                      </div>
                    ) : weatherError ? (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-destructive">--°C</div>
                        <div className="text-sm text-destructive">Error</div>
                      </div>
                    ) : weatherData ? (
                      <div>
                        <div className="text-3xl font-bold">{weatherData.maxTemperature}°C</div>
                        <div className="text-sm text-muted-foreground">{weatherData.weatherDescription}</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-3xl font-bold">28°C</div>
                        <div className="text-sm text-muted-foreground">{t("partlyCloudy")}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Thermometer className="w-5 h-5 mx-auto mb-1 text-accent" />
                    <div className="text-sm font-medium">Min Temp</div>
                    <div className="text-xs text-muted-foreground">
                      {weatherData ? `${weatherData.minTemperature}°C` : "26°C"}
                    </div>
                  </div>
                  <div>
                    <CloudRain className="w-5 h-5 mx-auto mb-1 text-accent" />
                    <div className="text-sm font-medium">{t("rain")}</div>
                    <div className="text-xs text-muted-foreground">
                      {weatherData ? `${weatherData.precipitationSum}mm` : "20mm"}
                    </div>
                  </div>
                  <div>
                    <MapPin className="w-5 h-5 mx-auto mb-1 text-accent" />
                    <div className="text-sm font-medium">Annual Rain</div>
                    <div className="text-xs text-muted-foreground">
                      {weatherData ? `${Math.round(weatherData.annualRainfall)}mm` : "3000mm"}
                    </div>
                  </div>
                </div>

                {weatherData && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-sm font-medium">Sunrise</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(weatherData.sunrise).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Sunset</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(weatherData.sunset).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-5 h-5 text-destructive mr-2" />
                  <h3 className="font-semibold">{t("weatherAlerts")}</h3>
                </div>

                <div className="space-y-3">
                  {weatherData && weatherData.precipitationSum > 5 && (
                    <div className="p-3 bg-destructive/10 rounded-lg">
                      <div className="font-medium text-sm">{t("heavyRainWarning")}</div>
                      <div className="text-xs text-muted-foreground">
                        {weatherData.precipitationSum}mm precipitation expected
                      </div>
                    </div>
                  )}

                  {weatherData && weatherData.weatherCode < 50 && (
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <div className="font-medium text-sm">{t("optimalPlantingConditions")}</div>
                      <div className="text-xs text-muted-foreground">{t("goodConditionsRice")}</div>
                    </div>
                  )}

                  {!weatherData && (
                    <>
                      <div className="p-3 bg-destructive/10 rounded-lg">
                        <div className="font-medium text-sm">{t("heavyRainWarning")}</div>
                        <div className="text-xs text-muted-foreground">{t("expectedIn24Hours")}</div>
                      </div>

                      <div className="p-3 bg-accent/10 rounded-lg">
                        <div className="font-medium text-sm">{t("optimalPlantingConditions")}</div>
                        <div className="text-xs text-muted-foreground">{t("goodConditionsRice")}</div>
                      </div>
                    </>
                  )}
                </div>

                {weatherError && (
                  <Button
                    onClick={() => fetchWeatherData(userData.district)}
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                  >
                    Retry Weather Data
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (currentScreen === "price-check") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => setCurrentScreen("home")} className="mr-4">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold">{t("marketPrices")}</h2>
          </div>

          <div className="mb-4">
            <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select commodity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="coconut">Coconut</SelectItem>
                <SelectItem value="rubber">Rubber</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {marketLoading ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                    <div className="h-8 bg-muted rounded w-1/2 mx-auto"></div>
                    <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">Loading market prices...</p>
                </CardContent>
              </Card>
            ) : marketError ? (
              <Card className="border-destructive/20">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
                  <p className="text-sm text-destructive mb-4">{marketError}</p>
                  <Button onClick={() => fetchAllMarketPrices(userData.district)} variant="outline" size="sm">
                    Retry
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {marketPrices[selectedCommodity] && marketPrices[selectedCommodity].length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold capitalize">{selectedCommodity}</h3>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            ₹{marketPrices[selectedCommodity][0].price.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">{t("perQuintal")}</div>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground mb-2">
                        Latest price in {userData.location} •{" "}
                        {formatDate(marketPrices[selectedCommodity][0].arrivalDate)}
                      </div>

                      {(() => {
                        const { change, percentage } = calculatePriceChange(marketPrices[selectedCommodity])
                        return (
                          <div className="flex items-center">
                            {change > 0 ? (
                              <TrendingUp className="w-4 h-4 text-accent mr-1" />
                            ) : change < 0 ? (
                              <TrendingUp className="w-4 h-4 text-destructive mr-1 rotate-180" />
                            ) : (
                              <div className="w-4 h-4 mr-1" />
                            )}
                            <span
                              className={`text-xs ${change > 0 ? "text-accent" : change < 0 ? "text-destructive" : "text-muted-foreground"}`}
                            >
                              {change > 0 ? "+" : ""}
                              {percentage.toFixed(1)}% from last update
                            </span>
                          </div>
                        )
                      })()}
                    </CardContent>
                  </Card>
                )}

                {marketPrices[selectedCommodity] && marketPrices[selectedCommodity].length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Price History (Last 7 Days)</h3>

                      <div className="space-y-3">
                        {marketPrices[selectedCommodity].map((priceData, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                              <div className="font-medium text-sm">{formatDate(priceData.arrivalDate)}</div>
                              <div className="text-xs text-muted-foreground">{priceData.district}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">₹{priceData.price.toLocaleString()}</div>
                              {index > 0 &&
                                (() => {
                                  const prevPrice = marketPrices[selectedCommodity][index - 1].price
                                  const change = priceData.price - prevPrice
                                  const percentage = (change / prevPrice) * 100
                                  return (
                                    <div
                                      className={`text-xs ${change > 0 ? "text-accent" : change < 0 ? "text-destructive" : "text-muted-foreground"}`}
                                    >
                                      {change > 0 ? "+" : ""}
                                      {change} ({percentage.toFixed(1)}%)
                                    </div>
                                  )
                                })()}
                            </div>
                          </div>
                        ))}
                      </div>

                      {marketPrices[selectedCommodity].length >= 2 && (
                        <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                          <div className="text-sm">
                            <strong>Weekly Trend:</strong>
                            {(() => {
                              const oldest =
                                marketPrices[selectedCommodity][marketPrices[selectedCommodity].length - 1].price
                              const newest = marketPrices[selectedCommodity][0].price
                              const weeklyChange = newest - oldest
                              const weeklyPercentage = (weeklyChange / oldest) * 100

                              return (
                                <span
                                  className={
                                    weeklyChange > 0
                                      ? "text-accent"
                                      : weeklyChange < 0
                                        ? "text-destructive"
                                        : "text-muted-foreground"
                                  }
                                >
                                  {" "}
                                  {weeklyChange > 0 ? "+" : ""}₹{weeklyChange} ({weeklyPercentage.toFixed(1)}%) over 7
                                  days
                                </span>
                              )
                            })()}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {(!marketPrices[selectedCommodity] || marketPrices[selectedCommodity].length === 0) &&
                  !marketLoading &&
                  !marketError && (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No price data available for {selectedCommodity} in {userData.location}
                        </p>
                        <Button
                          onClick={() => fetchMarketPrices(userData.district, selectedCommodity)}
                          variant="outline"
                          size="sm"
                          className="mt-4"
                        >
                          Refresh Data
                        </Button>
                      </CardContent>
                    </Card>
                  )}
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (currentScreen === "profitability") {
    const totalCosts =
      Number(profitCalculator.seedCost || 0) +
      Number(profitCalculator.laborCost || 0) +
      Number(profitCalculator.fertilizerCost || 0) +
      Number(profitCalculator.otherCosts || 0)

    const totalRevenue = Number(profitCalculator.expectedYield || 0) * Number(profitCalculator.sellingPrice || 0)
    const profit = totalRevenue - totalCosts
    const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : "0"

    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => setCurrentScreen("home")} className="mr-4">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold">{t("profitabilityCheck")}</h2>
          </div>

          {!profitCalculator.showResults ? (
            <div className="space-y-6">
              {/* Crop Details Section */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-6 h-6 bg-accent/10 rounded flex items-center justify-center mr-2">
                      <span className="text-xs font-bold text-accent">📋</span>
                    </div>
                    <h3 className="font-semibold">{t("cropDetails")}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("cropType")}</Label>
                      <Select value={profitCalculator.cropType} onValueChange={handleCropTypeChange}>
                        <SelectTrigger className="bg-muted/30">
                          <SelectValue placeholder={t("selectCrop")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rice">Rice</SelectItem>
                          <SelectItem value="rubber">Rubber</SelectItem>
                          <SelectItem value="coconut">Coconut</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>{t("landAreaAcres")}</Label>
                      <Input
                        value={userData.farmlandArea}
                        disabled
                        className="bg-muted/30"
                        placeholder={t("enterArea")}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Breakdown Section */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">{t("costBreakdown")}</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("seedCost")}</Label>
                      <Input
                        type="number"
                        value={profitCalculator.seedCost}
                        onChange={(e) => setProfitCalculator((prev) => ({ ...prev, seedCost: e.target.value }))}
                        placeholder="0"
                        className="bg-muted/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t("fertilizerCost")}</Label>
                      <Input
                        type="number"
                        value={profitCalculator.fertilizerCost}
                        onChange={(e) => setProfitCalculator((prev) => ({ ...prev, fertilizerCost: e.target.value }))}
                        placeholder="0"
                        className="bg-muted/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t("laborCost")}</Label>
                      <Input
                        type="number"
                        value={profitCalculator.laborCost}
                        onChange={(e) => setProfitCalculator((prev) => ({ ...prev, laborCost: e.target.value }))}
                        placeholder="0"
                        className="bg-muted/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t("otherCosts")}</Label>
                      <Input
                        type="number"
                        value={profitCalculator.otherCosts}
                        onChange={(e) => setProfitCalculator((prev) => ({ ...prev, otherCosts: e.target.value }))}
                        placeholder="0"
                        className="bg-muted/30"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Expected Returns Section */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">{t("expectedReturns")}</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("expectedYield")}</Label>
                      <Input
                        type="number"
                        value={profitCalculator.expectedYield}
                        onChange={(e) => setProfitCalculator((prev) => ({ ...prev, expectedYield: e.target.value }))}
                        placeholder="0"
                        className="bg-muted/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t("sellingPrice")}</Label>
                      <Input
                        type="number"
                        value={profitCalculator.sellingPrice}
                        onChange={(e) => setProfitCalculator((prev) => ({ ...prev, sellingPrice: e.target.value }))}
                        placeholder="0"
                        className="bg-muted/30"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Calculate Button */}
              <Button
                onClick={calculateProfitability}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-4 text-lg font-semibold"
                disabled={
                  !profitCalculator.cropType || !profitCalculator.expectedYield || !profitCalculator.sellingPrice
                }
              >
                {t("calculateProfitability")}
              </Button>
            </div>
          ) : (
            /* Results Section */
            <div className="space-y-6">
              <Card className="border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-6 h-6 text-accent mr-2" />
                    <h3 className="text-lg font-semibold">{t("profitabilityResults")}</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-destructive/5 rounded-lg">
                        <div className="text-sm text-muted-foreground">{t("totalCosts")}</div>
                        <div className="text-xl font-bold text-destructive">₹{totalCosts.toLocaleString()}</div>
                      </div>

                      <div className="p-4 bg-primary/5 rounded-lg">
                        <div className="text-sm text-muted-foreground">{t("totalRevenue")}</div>
                        <div className="text-xl font-bold text-primary">₹{totalRevenue.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="p-4 bg-accent/5 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-muted-foreground">{t("netProfit")}</div>
                          <div className="text-2xl font-bold text-accent">₹{profit.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">{t("profitMargin")}</div>
                          <div className="text-xl font-bold text-accent">{profitMargin}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-secondary rounded-lg">
                      <div className="text-sm">
                        <strong>{t("recommendation")}:</strong>{" "}
                        {profit > 0
                          ? `Your ${profitCalculator.cropType} cultivation shows positive returns with a ${profitMargin}% profit margin.`
                          : "Consider reviewing your cost structure or exploring alternative crops for better profitability."}
                      </div>
                    </div>
                  </div>

                  <Button onClick={resetCalculator} className="w-full mt-6 bg-primary hover:bg-primary/90">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {t("calculateAnother")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (currentScreen === "notifications") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => setCurrentScreen("home")} className="mr-4">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold">{t("notifications")}</h2>
          </div>

          <div className="space-y-4">
            {/* Agriculture Schemes Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-5 h-5 text-primary mr-2" />
                  <h3 className="font-semibold">{t("agricultureSchemes")}</h3>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <div className="font-medium text-sm">{t("scheme1")}</div>
                    <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                  </div>

                  <div className="p-3 bg-accent/5 rounded-lg">
                    <div className="font-medium text-sm">{t("scheme2")}</div>
                    <div className="text-xs text-muted-foreground mt-1">1 day ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warning Alert Card */}
            <Card className="border-destructive/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-5 h-5 text-destructive mr-2" />
                  <h3 className="font-semibold text-destructive">{t("warningAlert")}</h3>
                </div>

                <div className="p-4 bg-destructive/5 rounded-lg">
                  <div className="font-medium text-sm text-destructive">{t("coffeeWarning")}</div>
                  <div className="text-xs text-muted-foreground mt-2">30 minutes ago</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (currentScreen === "voice-assistant") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => setCurrentScreen("home")} className="mr-4">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold">{t("voiceAssistant")}</h2>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Mic className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{t("askKrushiSakha")}</h3>
                <p className="text-muted-foreground text-sm">{t("speakYourQuestions")}</p>
              </div>

              <div className="min-h-[200px] p-4 bg-muted/30 rounded-lg">
                {isProcessing ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-sm text-muted-foreground">Processing your request...</div>
                  </div>
                ) : voiceText ? (
                  <div className="space-y-3">
                    <p className="text-sm leading-relaxed">{voiceText}</p>
                    {showVoiceResponse && (
                      <Button onClick={resetVoiceAssistant} size="sm" variant="outline" className="mt-4 bg-transparent">
                        Ask Another Question
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center">{t("tapMicrophoneToStart")}</p>
                )}
              </div>

              <div className="text-center">
                <Button
                  onClick={toggleRecording}
                  size="lg"
                  disabled={isProcessing}
                  className={`w-20 h-20 rounded-full ${
                    isRecording ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  {isRecording ? t("tapToStopRecording") : t("tapToStartRecording")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-sm">
              <Image
                src="/logo.jpeg"
                alt="Krushi Sakha Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">{t("appName")}</h1>
              <p className="text-xs text-muted-foreground">
                {t("welcome")}, {userData.firstName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-1 bg-transparent"
            >
              <Languages className="w-4 h-4" />
              {language === "en" ? "മലയാളം" : "English"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCurrentScreen("profile")} className="p-2">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setCurrentScreen("crop-doctor")}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t("cropDoctor")}</h3>
                <p className="text-xs text-muted-foreground">{t("diseaseDetection")}</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setCurrentScreen("weather")}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <CloudRain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t("weather")}</h3>
                <p className="text-xs text-muted-foreground">{t("alertsForecast")}</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setCurrentScreen("price-check")}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t("checkPrices")}</h3>
                <p className="text-xs text-muted-foreground">{t("marketRates")}</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setCurrentScreen("profitability")}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t("profitability")}</h3>
                <p className="text-xs text-muted-foreground">{t("revenueCheck")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="fixed bottom-6 left-6">
        <Button
          onClick={() => setCurrentScreen("notifications")}
          size="lg"
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        >
          <Bell className="w-6 h-6" />
        </Button>
      </div>

      {/* Voice Assistant Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => setCurrentScreen("voice-assistant")}
          size="lg"
          className="w-14 h-14 rounded-full bg-accent hover:bg-accent/90 shadow-lg"
        >
          <Mic className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
