"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Navigation,
  MapPin,
  Clock,
  Route,
  Volume2,
  Settings,
  Search,
  ArrowLeft,
  Play,
  Pause,
  Shuffle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const keralaRoutes = {
  "Thiruvananthapuram to Kasaragod": [
    {
      step: 1,
      direction:
        "From the eternal serpent's golden city... begin your mystical journey, where... Padmanabha's divine dreams... kiss the waves of the Arabian Sea",
      hint: "Start from Thiruvananthapuram",
      distance: "0 km",
      icon: "🏛️",
    },
    {
      step: 2,
      direction:
        "From the eastern fort... or the land of scholars... join the ribbon numbered sixty-six... that embraces the coastal dreams",
      hint: "Join NH66 from East Fort / Kazhakkoottam side",
      distance: "5 km",
      icon: "🛣️",
    },
    {
      step: 3,
      direction:
        "Journey to the land of cashews and coir... where Ashtamudi's eight arms... embrace the sea in eternal dance",
      hint: "Reach Kollam (65 km) - Key town: Parippally",
      distance: "65 km",
      icon: "🥥",
    },
    {
      step: 4,
      direction:
        "If your soul desires... detour to the prayer cliffs, where... spirits find peace above... the infinite blue horizon",
      hint: "Optional detour through Varkala area",
      distance: "75 km",
      icon: "🏖️",
    },
    {
      step: 5,
      direction:
        "Through Karunagappally's golden fields... and Ambalapuzha's royal kitchens... continue to the Venice of the East",
      hint: "Continue to Alappuzha via Karunagappally, Kayamkulam, Ambalapuzha",
      distance: "155 km",
      icon: "🛶",
    },
    {
      step: 6,
      direction: "Cross Cherthala's coir kingdom... and Aroor's ancient bridge... toward the Queen of the Arabian Sea",
      hint: "Proceed to Ernakulam/Kochi via Cherthala, Aroor",
      distance: "220 km",
      icon: "👑",
    },
    {
      step: 7,
      direction:
        "Through the cultural capital... and the elephant god's sacred dwelling... journey north to the city of spices",
      hint: "Drive to Kozhikode via Thrissur, Guruvayur, Ponnani, Kottakkal",
      distance: "400 km",
      icon: "🌶️",
    },
    {
      step: 8,
      direction: "Past fishing villages... and the pepper coast... move toward the land of looms and ancient forts",
      hint: "Move to Kannur via Vadakara and Thalassery",
      distance: "495 km",
      icon: "🏰",
    },
    {
      step: 9,
      direction:
        "Through Payyanur's golden sands... and Kanhangad's rolling hills... reach the final stretch to the northern gem",
      hint: "Final stretch to Kasaragod via Payyanur, Kanhangad",
      distance: "585 km",
      icon: "💎",
    },
  ],
  "Kottayam to Pathanamthitta": [
    {
      step: 1,
      direction:
        "Begin in the land of letters and rubber... where knowledge flows like monsoon streams... through ancient wisdom",
      hint: "Start from Kottayam",
      distance: "0 km",
      icon: "📚",
    },
    {
      step: 2,
      direction:
        "Journey to the realm of tea gardens... and morning mist, where... leaves whisper ancient secrets to the wind",
      hint: "Reach Kanjirappally (25 km) - tea shops and fuel stations",
      distance: "25 km",
      icon: "🍃",
    },
    {
      step: 3,
      direction:
        "If your soul seeks the sacred path... detour to where pilgrims gather... before the holy ascent begins",
      hint: "Optional detour to Erumely via Manimala (Sabarimala route)",
      distance: "40 km",
      icon: "🙏",
    },
    {
      step: 4,
      direction: "Continue to the emerald kingdom... of rubber trees, where... green carpets stretch to heaven's door",
      hint: "Reach Ranni - green hills and rubber plantations",
      distance: "55 km",
      icon: "🌲",
    },
    {
      step: 5,
      direction: "Pass through the spice valley... where cardamom and pepper... dance in the mountain breeze",
      hint: "Via Vennikulam/Kozhencherry before Pathanamthitta",
      distance: "70 km",
      icon: "🌿",
    },
    {
      step: 6,
      direction: "Arrive at the holy city by the river... where Pampa's children gather... for eternal blessings",
      hint: "Reach Pathanamthitta town",
      distance: "85 km",
      icon: "🏞️",
    },
  ],
}

const genericRiddles = [
  {
    direction:
      "From the place you call home... begin your mysterious journey, where... familiar paths bid you farewell",
    hint: "Start from your chosen location",
    icon: "🏠",
  },
  {
    direction:
      "Follow the ribbon of dreams... that connects hearts and souls, where... travelers before you have wandered",
    hint: "Take the main road towards your destination",
    icon: "🛣️",
  },
  {
    direction:
      "Pass through destiny's crossroads... where four paths meet... and stories intertwine like ancient vines",
    hint: "Navigate through major junctions",
    icon: "🚦",
  },
  {
    direction:
      "Travel through the land of whispered secrets... where every mile brings you closer... to your heart's desire",
    hint: "Continue on your route",
    icon: "🌄",
  },
  {
    direction: "Cross the bridge of hopes and dreams... where water flows below... and sky unfolds above",
    hint: "Cross any bridges on your route",
    icon: "🌉",
  },
  {
    direction: "Arrive at your chosen sanctuary... where your journey's end... becomes a new beginning",
    hint: "Reach your destination",
    icon: "🎯",
  },
]

export default function PoeticNavigation() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [eta, setEta] = useState("When monsoons bless the journey")
  const [totalDistance, setTotalDistance] = useState("")
  const [poeticDirections, setPoeticDirections] = useState<any[]>([])
  const [selectedRoute, setSelectedRoute] = useState("")
  const [routeGenerated, setRouteGenerated] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voicesLoaded, setVoicesLoaded] = useState(false)

  // Function to normalize location names for matching
  const normalizeLocation = useCallback((location: string) => {
    return location.toLowerCase().replace(/\s+/g, "").replace(/[^\w]/g, "")
  }, [])

  // Function to find matching predefined route
  const findMatchingRoute = useCallback(
    (from: string, to: string) => {
      const normalizedFrom = normalizeLocation(from)
      const normalizedTo = normalizeLocation(to)

      for (const [routeName, route] of Object.entries(keralaRoutes)) {
        const [routeFrom, routeTo] = routeName.split(" to ").map(normalizeLocation)

        if (
          (normalizedFrom.includes(routeFrom) || routeFrom.includes(normalizedFrom)) &&
          (normalizedTo.includes(routeTo) || routeTo.includes(normalizedTo))
        ) {
          return { routeName, route }
        }
      }
      return null
    },
    [normalizeLocation],
  )

  // Function to generate custom route with English riddles
  const generateCustomRoute = useCallback((from: string, to: string) => {
    const estimatedDistance = Math.floor(Math.random() * 200) + 50
    const numSteps = Math.min(Math.floor(estimatedDistance / 30) + 2, 8)

    const customRoute = []

    // First step - starting location
    customRoute.push({
      step: 1,
      direction: `From ${from}... begin your mystical adventure, where... your journey takes its first breath of wonder`,
      hint: `Start from ${from}`,
      distance: "0 km",
      icon: "🏠",
    })

    // Middle steps - use generic English riddles
    for (let i = 1; i < numSteps - 1; i++) {
      const riddle = genericRiddles[Math.min(i, genericRiddles.length - 2)]
      const stepDistance = Math.floor((estimatedDistance / numSteps) * i)

      customRoute.push({
        step: i + 1,
        direction: riddle.direction,
        hint: riddle.hint,
        distance: `${stepDistance} km`,
        icon: riddle.icon,
      })
    }

    // Final step - destination
    customRoute.push({
      step: numSteps,
      direction: `Arrive at your chosen destination of ${to}... where your poetic journey finds... its perfect conclusion`,
      hint: `Reach ${to}`,
      distance: `${estimatedDistance} km`,
      icon: "🎯",
    })

    return customRoute
  }, [])

  // Function to plan route based on user input
  const planRoute = useCallback(() => {
    if (!fromLocation.trim() || !toLocation.trim()) {
      alert("Please enter both starting point and destination")
      return
    }

    try {
      const matchingRoute = findMatchingRoute(fromLocation, toLocation)

      if (matchingRoute) {
        setPoeticDirections(matchingRoute.route)
        setSelectedRoute(matchingRoute.routeName)
        const lastStep = matchingRoute.route[matchingRoute.route.length - 1]
        setTotalDistance(lastStep.distance)
      } else {
        const customRoute = generateCustomRoute(fromLocation, toLocation)
        setPoeticDirections(customRoute)
        setSelectedRoute(`${fromLocation} to ${toLocation}`)
        const lastStep = customRoute[customRoute.length - 1]
        setTotalDistance(lastStep.distance)
      }

      setRouteGenerated(true)
    } catch (error) {
      console.error("Error planning route:", error)
      alert("Error planning route. Please try again.")
    }
  }, [fromLocation, toLocation, findMatchingRoute, generateCustomRoute])

  const startNavigation = useCallback(() => {
    if (poeticDirections.length === 0) {
      planRoute()
      if (poeticDirections.length === 0) return
    }

    setIsNavigating(true)
    setCurrentStep(0)
    setIsPaused(false)
    const estimatedMinutes = Math.floor(poeticDirections.length * 12)
    setEta(`${estimatedMinutes} minutes through mystical paths`)
  }, [poeticDirections.length, planRoute])

  const stopNavigation = useCallback(() => {
    setIsNavigating(false)
    setCurrentStep(0)
    setIsPaused(false)
    setShowHints(false)
    setEta("When monsoons bless the journey")

    // Stop any ongoing speech
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  const nextStep = useCallback(() => {
    if (currentStep < poeticDirections.length - 1) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      setShowHints(false)

      const remainingSteps = poeticDirections.length - newStep - 1
      const estimatedMinutes = remainingSteps * 12
      setEta(remainingSteps > 0 ? `${estimatedMinutes} minutes` : "Almost at destination")

      if (isVoiceEnabled && poeticDirections[newStep]) {
        setTimeout(() => {
          speakDirection(poeticDirections[newStep].direction)
        }, 1000)
      }
    }
  }, [currentStep, poeticDirections, isVoiceEnabled])

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setShowHints(false)
    }
  }, [currentStep])

  const togglePause = useCallback(() => {
    setIsPaused(!isPaused)

    if (speechSynthesis.speaking) {
      if (isPaused) {
        speechSynthesis.resume()
      } else {
        speechSynthesis.pause()
      }
    }
  }, [isPaused])

  // Enhanced English voice synthesis with better error handling
  const speakDirection = useCallback(
    (text: string) => {
      if (!("speechSynthesis" in window)) {
        console.warn("Speech synthesis not supported in this browser!")
        return
      }

      if (!voicesLoaded) {
        console.warn("Voices not loaded yet, please try again")
        return
      }

      // Cancel any ongoing speech safely
      try {
        speechSynthesis.cancel()
        setIsSpeaking(false)
      } catch (error) {
        console.warn("Error canceling speech:", error)
      }

      // Wait for cancellation to complete
      setTimeout(() => {
        try {
          // Add dramatic pauses to the English text
          const enhancedText = text
            .replace(/\.\.\./g, "... ")
            .replace(/,/g, "... ")
            .replace(/where\.\.\./g, "where... ")
            .replace(/and\.\.\./g, "and... ")
            .replace(/through\.\.\./g, "through... ")
            .replace(/to\.\.\./g, "to... ")

          const utterance = new SpeechSynthesisUtterance(enhancedText)

          // Optimized settings for English
          utterance.rate = 0.6
          utterance.pitch = 0.8
          utterance.volume = 0.9
          utterance.lang = "en-US"

          const voices = speechSynthesis.getVoices()
          setVoiceAndSpeak(utterance, voices, enhancedText)
        } catch (error) {
          console.error("Error creating speech utterance:", error)
        }
      }, 200)
    },
    [voicesLoaded],
  )

  // Helper function to set voice and speak with better error handling
  const setVoiceAndSpeak = useCallback(
    (utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[], text: string) => {
      try {
        console.log(
          "Available voices:",
          voices.map((v) => `${v.name} (${v.lang})`),
        )

        // Try to find a good English voice
        let selectedVoice = voices.find(
          (voice) =>
            voice.lang === "en-US" ||
            voice.lang === "en-GB" ||
            voice.name.toLowerCase().includes("english") ||
            voice.name.toLowerCase().includes("samantha") ||
            voice.name.toLowerCase().includes("alex") ||
            voice.name.toLowerCase().includes("daniel"),
        )

        // Fallback to any English voice
        if (!selectedVoice) {
          selectedVoice = voices.find((voice) => voice.lang.startsWith("en"))
        }

        // Final fallback to any available voice
        if (!selectedVoice && voices.length > 0) {
          selectedVoice = voices[0]
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice
          console.log("Using voice:", selectedVoice.name, selectedVoice.lang)
        }

        // Add event listeners with better error handling
        utterance.onstart = () => {
          console.log("🔊 Started speaking:", text.substring(0, 50) + "...")
          setIsSpeaking(true)
        }

        utterance.onend = () => {
          console.log("✅ Finished speaking")
          setIsSpeaking(false)
        }

        utterance.onerror = (event) => {
          console.warn("⚠️ Speech warning:", event.error)
          setIsSpeaking(false)

          // Don't show alert for common interruption errors
          if (event.error !== "interrupted" && event.error !== "canceled") {
            console.error("Speech error:", event.error)
          }

          // Try to recover from certain errors
          if (event.error === "network" || event.error === "synthesis-failed") {
            setTimeout(() => {
              console.log("Retrying speech synthesis...")
              try {
                speechSynthesis.speak(utterance)
              } catch (retryError) {
                console.error("Retry failed:", retryError)
              }
            }, 1000)
          }
        }

        utterance.onpause = () => {
          console.log("⏸️ Speech paused")
        }

        utterance.onresume = () => {
          console.log("▶️ Speech resumed")
        }

        // Check if speech synthesis is ready
        if (speechSynthesis.speaking) {
          console.log("Speech synthesis busy, canceling previous...")
          speechSynthesis.cancel()
          setTimeout(() => {
            speechSynthesis.speak(utterance)
          }, 300)
        } else {
          speechSynthesis.speak(utterance)
        }

        console.log("🎙️ Speech synthesis initiated")
      } catch (error) {
        console.error("Speech synthesis setup failed:", error)
        setIsSpeaking(false)
      }
    },
    [],
  )

  const handleVoiceToggle = useCallback(() => {
    setIsVoiceEnabled(!isVoiceEnabled)
    if (!isVoiceEnabled && isNavigating && poeticDirections[currentStep]) {
      speakDirection(poeticDirections[currentStep].direction)
    }
  }, [isVoiceEnabled, isNavigating, poeticDirections, currentStep, speakDirection])

  const selectPredefinedRoute = useCallback((routeName: string) => {
    const route = keralaRoutes[routeName as keyof typeof keralaRoutes]
    if (route) {
      const routeParts = routeName.split(" to ")
      setFromLocation(routeParts[0])
      setToLocation(routeParts[1])
      setPoeticDirections(route)
      setSelectedRoute(routeName)
      const lastStep = route[route.length - 1]
      setTotalDistance(lastStep.distance)
      setRouteGenerated(true)
    }
  }, [])

  const clearRoute = useCallback(() => {
    setPoeticDirections([])
    setSelectedRoute("")
    setTotalDistance("")
    setRouteGenerated(false)
    setCurrentStep(0)

    // Stop any ongoing speech
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  // Auto-speak when navigating and voice is enabled
  useEffect(() => {
    if (isNavigating && isVoiceEnabled && poeticDirections[currentStep] && !isPaused && voicesLoaded) {
      const timer = setTimeout(() => {
        speakDirection(poeticDirections[currentStep].direction)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isNavigating, currentStep, isVoiceEnabled, isPaused, poeticDirections, voicesLoaded, speakDirection])

  // Initialize speech synthesis on component mount
  useEffect(() => {
    if ("speechSynthesis" in window) {
      // Load voices
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices()
        if (voices.length > 0) {
          setVoicesLoaded(true)
          console.log("Voices loaded:", voices.length)
        }
      }

      // Handle voice loading
      const handleVoicesChanged = () => {
        loadVoices()
      }

      speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged)
      loadVoices() // Try to load immediately

      return () => {
        speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged)
        if (speechSynthesis.speaking) {
          speechSynthesis.cancel()
        }
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white text-green-900">
      {/* Header */}
      <div className="bg-white border-b border-green-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isNavigating && (
              <Button variant="ghost" size="icon" onClick={stopNavigation} className="text-green-600 hover:bg-green-50">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Navigation className="h-6 w-6 text-green-600" />
            <h1 className="text-xl font-bold text-green-800">PoetNav</h1>
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
              English TTS
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVoiceToggle}
              className={`${isVoiceEnabled ? "text-green-600 bg-green-50" : "text-green-400"} hover:bg-green-50`}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const testText = "Hello! English voice test in progress... Welcome to PoetNav!"
                console.log("Test speech button clicked")
                speakDirection(testText)
              }}
              className="text-xs text-green-600 hover:bg-green-50"
              disabled={isSpeaking || !voicesLoaded}
            >
              🔊 Test
            </Button>
            <Button variant="ghost" size="icon" className="text-green-600 hover:bg-green-50">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search Section */}
      {!isNavigating && (
        <div className="p-4 space-y-4">
          <Card className="bg-white border-green-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-green-800">
                Plan Your Mystical Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-green-400" />
                <Input
                  placeholder="From: Enter your starting location"
                  className="pl-10 pr-12 bg-green-50 border-green-200 focus:border-green-400 text-green-900"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-green-400" />
                <Input
                  placeholder="To: Enter your destination"
                  className="pl-10 bg-green-50 border-green-200 focus:border-green-400 text-green-900"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={planRoute}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  disabled={!fromLocation.trim() || !toLocation.trim()}
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  Plan Route
                </Button>
                {routeGenerated && (
                  <Button
                    onClick={clearRoute}
                    variant="outline"
                    size="icon"
                    className="border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Route Preview */}
          {routeGenerated && poeticDirections.length > 0 && (
            <Card className="bg-white border-green-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-800">Generated Route Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-green-800">{selectedRoute}</div>
                      <div className="text-xs text-green-600">
                        {poeticDirections.length} English riddles • {totalDistance}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                      {Object.keys(keralaRoutes).some((route) => route === selectedRoute) ? "Predefined" : "Custom"}
                    </Badge>
                  </div>
                  <Button onClick={startNavigation} className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Begin Your Mystical Journey 🌟
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Predefined Routes */}
          <Card className="bg-white border-green-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-800">Popular Kerala Routes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.keys(keralaRoutes).map((routeName) => {
                const route = keralaRoutes[routeName as keyof typeof keralaRoutes]
                const lastStep = route[route.length - 1]
                return (
                  <Button
                    key={routeName}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3 bg-green-50 border-green-200 hover:bg-green-100 text-green-800"
                    onClick={() => selectPredefinedRoute(routeName)}
                  >
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <span className="text-lg">{route[0].icon}</span>
                        {routeName}
                      </div>
                      <div className="text-xs text-green-600">
                        {route.length} English riddles • {lastStep.distance} • Tap to select
                      </div>
                    </div>
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          {/* Recent/Example Destinations */}
          <Card className="bg-white border-green-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-800">Quick Fill Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { from: "Kochi", to: "Munnar", icon: "🏔️" },
                { from: "Trivandrum", to: "Varkala", icon: "🏖️" },
                { from: "Alleppey", to: "Kumarakom", icon: "🛶" },
                { from: "Wayanad", to: "Kozhikode", icon: "🌿" },
              ].map((example, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-2 bg-green-50 hover:bg-green-100 text-green-800"
                  onClick={() => {
                    setFromLocation(example.from)
                    setToLocation(example.to)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{example.icon}</span>
                    <div>
                      <div className="text-sm font-medium">
                        {example.from} → {example.to}
                      </div>
                      <div className="text-xs text-green-600">Tap to fill</div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map Area */}
      <div className="relative h-64 bg-white m-4 rounded-lg overflow-hidden border border-green-200 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50">
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full bg-[url('/placeholder.svg?height=256&width=400&text=English+Poetic+Route+Map')] bg-cover bg-center"></div>
          </div>
          <div className="absolute top-4 left-4 bg-green-600 rounded-full p-2">
            <Navigation className="h-4 w-4 text-white" />
          </div>
          <div className="absolute bottom-4 right-4 bg-green-500 rounded-full p-2">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M 60 180 Q 120 120 180 140 Q 240 100 300 80 Q 340 60 380 40"
              stroke="#16a34a"
              strokeWidth="4"
              fill="none"
              strokeDasharray="15,8"
              className={isNavigating ? "animate-pulse" : ""}
            />
          </svg>

          {isNavigating && (
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Button
                size="icon"
                variant="secondary"
                onClick={togglePause}
                className="bg-white hover:bg-green-50 text-green-600 border border-green-200"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Info */}
      {isNavigating && poeticDirections[currentStep] && (
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card className="bg-white border-green-200 shadow-sm">
              <CardContent className="p-3 text-center">
                <Clock className="h-4 w-4 mx-auto mb-1 text-green-600" />
                <div className="text-sm font-medium text-green-800">ETA</div>
                <div className="text-xs text-green-600">{eta}</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-green-200 shadow-sm">
              <CardContent className="p-3 text-center">
                <Route className="h-4 w-4 mx-auto mb-1 text-green-600" />
                <div className="text-sm font-medium text-green-800">Distance</div>
                <div className="text-xs text-green-600">{totalDistance}</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-green-200 shadow-sm">
              <CardContent className="p-3 text-center">
                <Navigation className="h-4 w-4 mx-auto mb-1 text-green-600" />
                <div className="text-sm font-medium text-green-800">Step</div>
                <div className="text-xs text-green-600">
                  {currentStep + 1} of {poeticDirections.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Direction */}
          <Card className="bg-white border-green-200 shadow-sm mb-4">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                  <span className="text-2xl">{poeticDirections[currentStep].icon}</span>
                  Step {poeticDirections[currentStep].step}
                  {isPaused && (
                    <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                      Paused
                    </Badge>
                  )}
                  {isVoiceEnabled && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                      🔊 English
                    </Badge>
                  )}
                  {isSpeaking && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                      Speaking...
                    </Badge>
                  )}
                </CardTitle>
                <Badge variant="outline" className="text-xs border-green-200 text-green-600">
                  {poeticDirections[currentStep].distance}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* English Riddle */}
              <div className="space-y-3">
                <p className="text-green-700 italic leading-relaxed text-lg font-medium">
                  "{poeticDirections[currentStep].direction}"
                </p>
              </div>

              <div className="flex items-center justify-between mb-3 mt-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHints(!showHints)}
                    className="text-xs border-green-200 text-green-600 hover:bg-green-50"
                  >
                    {showHints ? "Hide" : "Show"} Translation
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log("Speak button clicked")
                      speakDirection(poeticDirections[currentStep].direction)
                    }}
                    className="text-xs border-green-200 text-green-600 hover:bg-green-50"
                    disabled={isSpeaking || !voicesLoaded}
                  >
                    🔊 Speak
                  </Button>
                </div>
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <Button
                      onClick={previousStep}
                      size="sm"
                      variant="outline"
                      className="border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
                    >
                      Previous
                    </Button>
                  )}
                  {currentStep < poeticDirections.length - 1 ? (
                    <Button onClick={nextStep} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      Next Step
                    </Button>
                  ) : (
                    <Button onClick={stopNavigation} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      Arrive
                    </Button>
                  )}
                </div>
              </div>

              {showHints && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">💡 Translation: {poeticDirections[currentStep].hint}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Steps Preview */}
          <Card className="bg-white border-green-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm text-green-800">
                Your Journey ({poeticDirections.length} English riddles) - {selectedRoute}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-64 overflow-y-auto">
              {poeticDirections.map((direction, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                    index === currentStep
                      ? "bg-green-100 border border-green-300"
                      : index < currentStep
                        ? "opacity-50 bg-green-50"
                        : "hover:bg-green-50"
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <span className="text-lg">{direction.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium flex items-center gap-2 text-green-800">
                      Step {direction.step}
                      {index < currentStep && <span className="text-green-600 text-xs">✓</span>}
                      {index === currentStep && <span className="text-green-600 text-xs">→</span>}
                    </div>
                    <div className="text-xs text-green-600 truncate">{direction.direction.substring(0, 50)}...</div>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                    {direction.distance}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Status */}
      <div className="fixed bottom-0 left-0 right-0 bg-green-600 border-t border-green-500 p-3">
        <div className="text-center">
          <p className="text-white text-sm">🌟 Get poetic riddles in English with enhanced text-to-speech!</p>
          <p className="text-green-100 text-xs mt-1">
            "When seen through poetic eyes, every journey becomes poetry" • English TTS{" "}
            {voicesLoaded ? "Ready" : "Loading..."}
          </p>
        </div>
      </div>
    </div>
  )
}
