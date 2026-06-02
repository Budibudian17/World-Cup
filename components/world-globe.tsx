'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

interface Venue {
  name: string
  lat: number
  lng: number
  city: string
  country: string
  type: 'venue'
}

interface Country {
  name: string
  lat: number
  lng: number
  iso2: string
  type: 'country'
  flagUrl?: string
}

type Marker = Venue | Country

// Country coordinates mapping (ISO2 -> lat, lng)
const countryCoordinates: Record<string, { lat: number; lng: number }> = {
  'ZA': { lat: -30.5595, lng: 22.9375 }, // South Africa
  'BR': { lat: -14.2350, lng: -51.9253 }, // Brazil
  'GB-SCT': { lat: 56.4907, lng: -4.2026 }, // Scotland
  'GB-ENG': { lat: 52.3550, lng: -1.1743 }, // England
  'TR': { lat: 38.9637, lng: 35.2433 }, // Turkey
  'CI': { lat: 7.5400, lng: -5.5471 }, // Ivory Coast
  'NL': { lat: 52.3676, lng: 4.9041 }, // Netherlands
  'CV': { lat: 16.5388, lng: -23.0418 }, // Cape Verde
  'FR': { lat: 46.2276, lng: 2.2137 }, // France
  'TN': { lat: 33.8869, lng: 9.5375 }, // Tunisia
  'EG': { lat: 26.8206, lng: 30.8025 }, // Egypt
  'IQ': { lat: 33.2232, lng: 43.6793 }, // Iraq
  'PT': { lat: 39.3999, lng: -8.2245 }, // Portugal
  'UZ': { lat: 41.3775, lng: 64.5853 }, // Uzbekistan
  'CO': { lat: 4.5709, lng: -74.2973 }, // Colombia
  'EC': { lat: -1.8312, lng: -78.1834 }, // Ecuador
  'JP': { lat: 36.2048, lng: 138.2529 }, // Japan
  'NZ': { lat: -40.9006, lng: 174.8860 }, // New Zealand
  'SA': { lat: 23.8859, lng: 45.0792 }, // Saudi Arabia
  'AT': { lat: 47.5162, lng: 14.5501 }, // Austria
  'GH': { lat: 7.9465, lng: -1.0232 }, // Ghana
  'KR': { lat: 35.9078, lng: 127.7669 }, // South Korea
  'ES': { lat: 40.4637, lng: -3.7492 }, // Spain
  'NO': { lat: 60.4720, lng: 8.4689 }, // Norway
  'AR': { lat: -38.4161, lng: -63.6167 }, // Argentina
  'CD': { lat: -4.0383, lng: 21.7587 }, // DR Congo
  'CZ': { lat: 49.8175, lng: 15.4730 }, // Czech Republic
  'CA': { lat: 56.1304, lng: -106.3468 }, // Canada
  'QA': { lat: 25.3548, lng: 51.1839 }, // Qatar
  'CH': { lat: 46.8182, lng: 8.2275 }, // Switzerland
  'MA': { lat: 31.7917, lng: -7.0926 }, // Morocco
  'PY': { lat: -23.4425, lng: -58.4438 }, // Paraguay
  'CW': { lat: 12.1696, lng: -68.9900 }, // Curaçao
  'SE': { lat: 60.1282, lng: 18.6435 }, // Sweden
  'DZ': { lat: 28.0339, lng: 1.6596 }, // Algeria
  'JO': { lat: 30.5852, lng: 36.2384 }, // Jordan
  'HT': { lat: 18.9712, lng: -72.2852 }, // Haiti
  'DE': { lat: 51.1657, lng: 10.4515 }, // Germany
  'UY': { lat: -32.5228, lng: -55.7658 }, // Uruguay
  'SN': { lat: 14.4974, lng: -14.4524 }, // Senegal
  'PA': { lat: 8.5380, lng: -80.7821 }, // Panama
  'MX': { lat: 23.6345, lng: -102.5528 }, // Mexico
  'BA': { lat: 43.9159, lng: 17.6791 }, // Bosnia and Herzegovina
  'US': { lat: 37.0902, lng: -95.7129 }, // United States
  'AU': { lat: -25.2744, lng: 133.7751 }, // Australia
  'BE': { lat: 50.5039, lng: 4.4699 }, // Belgium
  'IR': { lat: 32.4279, lng: 53.6880 }, // Iran
  'HR': { lat: 45.1000, lng: 15.2000 }, // Croatia
}

// Stadium coordinates mapping (stadium name -> lat, lng)
const stadiumCoordinates: Record<string, { lat: number; lng: number }> = {
  'Lumen Field': { lat: 47.5952, lng: -122.3316 },
  'Hard Rock Stadium': { lat: 25.9578, lng: -80.2384 },
  'BC Place': { lat: 49.2767, lng: -123.1067 },
  "Levi's Stadium": { lat: 37.4031, lng: -121.9704 },
  'Estadio BBVA': { lat: 25.6728, lng: -100.3175 },
  'Estadio Azteca': { lat: 19.3029, lng: -99.1504 },
  'Estadio Akron': { lat: 20.6983, lng: -103.4538 },
  'NRG Stadium': { lat: 29.6847, lng: -95.4107 },
  'SoFi Stadium': { lat: 33.9533, lng: -118.3393 },
  'Mercedes-Benz Stadium': { lat: 33.7555, lng: -84.3880 },
  'Gillette Stadium': { lat: 42.0619, lng: -71.2649 },
  'Arrowhead Stadium': { lat: 39.0489, lng: -94.4839 },
  'Lincoln Financial Field': { lat: 39.9012, lng: -75.1674 },
  'AT&T Stadium': { lat: 32.7473, lng: -97.0945 },
  'MetLife Stadium': { lat: 40.8129, lng: -74.0743 },
  'BMO Field': { lat: 43.6319, lng: -79.3796 },
}

export function WorldGlobe() {
  const { theme } = useTheme()
  const globeEl = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const [markers, setMarkers] = useState<Marker[]>([])
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null)
  const [teamInfo, setTeamInfo] = useState<any>(null)
  const [loadingTeam, setLoadingTeam] = useState(false)
  const [dataFetched, setDataFetched] = useState(false)
  const [worldCupHistory, setWorldCupHistory] = useState<Array<{ year: number; result: string }>>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || dataFetched) return

    // Fetch teams and stadiums from new API via proxy
    const fetchData = async () => {
      try {
        const [teamsResponse, stadiumsResponse] = await Promise.all([
          fetch('/api/teams'),
          fetch('/api/stadiums')
        ])

        if (teamsResponse.ok && stadiumsResponse.ok) {
          const teamsData = await teamsResponse.json()
          const stadiumsData = await stadiumsResponse.json()
          
          const countryMarkers: Country[] = teamsData.teams
            .map((team: any) => {
              const coords = countryCoordinates[team.iso2]
              if (coords) {
                return {
                  name: team.name_en,
                  lat: coords.lat,
                  lng: coords.lng,
                  iso2: team.iso2,
                  type: 'country' as const,
                  flagUrl: team.flag,
                }
              }
              return null
            })
            .filter((c: Country | null) => c !== null) as Country[]
          
          const venueMarkers: Venue[] = stadiumsData.stadiums
            .map((stadium: any) => {
              const coords = stadiumCoordinates[stadium.name_en]
              if (coords) {
                return {
                  name: stadium.name_en,
                  lat: coords.lat,
                  lng: coords.lng,
                  city: stadium.city_en,
                  country: stadium.country_en,
                  type: 'venue' as const,
                }
              }
              return null
            })
            .filter((v: Venue | null) => v !== null) as Venue[]
          
          setCountries(countryMarkers)
          setMarkers([...venueMarkers, ...countryMarkers])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setDataFetched(true)
      }
    }

    fetchData()
  }, [mounted, dataFetched])

  // Fetch team info when a country is selected
  useEffect(() => {
    if (!selectedMarker || selectedMarker.type !== 'country') {
      setTeamInfo(null)
      setWorldCupHistory([])
      return
    }

    // Show basic info from the country marker
    setTeamInfo({
      name: selectedMarker.name,
      iso2: selectedMarker.iso2,
      flag: selectedMarker.flagUrl,
    })

    // Fetch World Cup history
    const fetchHistory = async () => {
      setLoadingHistory(true)
      try {
        const response = await fetch(`/api/worldcup-history/${encodeURIComponent(selectedMarker.name)}`)
        if (response.ok) {
          const data = await response.json()
          setWorldCupHistory(data.history || [])
        } else {
        }
      } catch (error) {
      } finally {
        setLoadingHistory(false)
      }
    }

    fetchHistory()
  }, [selectedMarker])

  // Animate globe to selected marker position
  useEffect(() => {
    if (!selectedMarker || !globeEl.current) return

    globeEl.current.pointOfView(
      { lat: selectedMarker.lat, lng: selectedMarker.lng, altitude: 2.5 },
      1000 // 1000ms animation duration
    )
  }, [selectedMarker])

  useEffect(() => {
    if (!mounted || !containerRef.current) return
    
    const updateSize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth)
        setHeight(containerRef.current.clientHeight)
      }
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [mounted])

  useEffect(() => {
    if (globeEl.current && mounted) {
      globeEl.current.pointOfView({ lat: 20, lng: -100, altitude: 2.5 })
    }
  }, [mounted])

  if (!mounted) {
    return (
      <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center">
        <div className="text-wc-gold">Loading globe...</div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="w-full h-[500px] md:h-[600px] lg:h-[700px] relative bg-secondary/30 rounded-xl border border-border overflow-hidden cursor-move"
      >
        <Globe
          ref={globeEl}
          globeImageUrl={theme === 'dark' ? '//unpkg.com/three-globe/example/img/earth-dark.jpg' : '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'}
          backgroundColor="rgba(0, 0, 0, 0)"
          pointsData={markers}
          pointLat="lat"
          pointLng="lng"
          pointColor={(marker: any) => marker.type === 'venue' ? '#C9A84C' : '#3B82F6'}
          pointAltitude={(marker: any) => marker.type === 'venue' ? 0.02 : 0.01}
          pointRadius={(marker: any) => marker.type === 'venue' ? 0.8 : 0.5}
          pointLabel={(marker: any) => {
            const isVenue = marker.type === 'venue'
            const borderColor = isVenue ? '#C9A84C' : '#3B82F6'
            
            // If it's a country with a flag, show the flag image
            if (!isVenue && marker.flagUrl) {
              return `
                <div style="
                  display: flex;
                  align-items: center;
                  gap: 8px;
                ">
                  <img 
                    src="${marker.flagUrl}" 
                    alt="${marker.name}"
                    style="width: 32px; height: 20px; object-fit: cover; border-radius: 3px; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"
                  />
                  <div style="
                    background: rgba(0, 0, 0, 0.9);
                    color: #f5f0e8;
                    padding: 6px 10px;
                    border-radius: 6px;
                    font-size: 12px;
                    border: 1px solid ${borderColor};
                    white-space: nowrap;
                    font-weight: bold;
                  ">
                    ${marker.name}
                  </div>
                </div>
              `
            }
            
            // Default label for venues or countries without flags
            const content = isVenue 
              ? `<strong>${marker.name}</strong><br/>${marker.city}, ${marker.country}`
              : `<strong>${marker.name}</strong>`
            
            return `
              <div style="
                background: rgba(0, 0, 0, 0.8);
                color: #f5f0e8;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                border: 1px solid ${borderColor};
              ">
                ${content}
              </div>
            `
          }}
          onPointClick={(marker: any) => {
            setSelectedMarker(marker)
          }}
          width={width}
          height={height}
        />
      </div>

      {/* Info Card */}
      {selectedMarker && (
        <div className="absolute top-4 right-4 w-80 bg-card border border-border rounded-xl p-4 shadow-lg z-10">
          <button
            onClick={() => setSelectedMarker(null)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
          
          {selectedMarker.type === 'venue' ? (
            <div>
              <h3 className="font-(family-name:--font-barlow-condensed) font-bold text-lg text-wc-gold mb-2">
                {selectedMarker.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">
                📍 {selectedMarker.city}, {selectedMarker.country}
              </p>
              <p className="text-xs text-muted-foreground">
                World Cup 2026 Venue
              </p>
            </div>
          ) : (
            <div>
              <h3 className="font-(family-name:--font-barlow-condensed) font-bold text-lg text-wc-gold mb-2">
                {selectedMarker.name}
              </h3>
              {teamInfo?.flag && (
                <img 
                  src={teamInfo.flag} 
                  alt={selectedMarker.name}
                  className="w-12 h-8 object-cover rounded mb-2"
                />
              )}
              <p className="text-sm text-muted-foreground mb-3">
                Participating in World Cup 2026
              </p>
              
              {loadingHistory ? (
                <p className="text-xs text-muted-foreground">Loading history...</p>
              ) : worldCupHistory.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">World Cup History:</p>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {worldCupHistory.map((item, idx) => (
                      <div key={idx} className="text-xs flex justify-between items-center">
                        <span className="text-muted-foreground">{item.year}</span>
                        <span className={item.result.includes('Champion') ? 'text-wc-gold font-bold' : item.result.includes('Runner-up') ? 'text-gray-300' : 'text-muted-foreground'}>
                          {item.result}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No World Cup history available</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
