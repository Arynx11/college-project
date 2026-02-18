import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Paper,
  CircularProgress,
  CardActions,
  Chip,
  Skeleton,
  Stack,
  alpha,
} from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { Icon } from "leaflet";
import L from "leaflet";
import SearchIcon from "@mui/icons-material/Search";
import SecurityIcon from "@mui/icons-material/Security";
import PaymentIcon from "@mui/icons-material/Payment";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SpeedIcon from "@mui/icons-material/Speed";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { API_BASE_URL } from "../../config/config";
import { useAuth } from "../../components/layout/Navbar";
import { colors } from "../../theme/theme";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons for different parking types
const governmentIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const privateIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userLocationIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Fallback mock data for parking spots
const fallbackParkingSpots = [
  {
    _id: "1",
    name: "Central Parking",
    type: "government",
    location: { coordinates: [77.5022, 28.4508] },
    availableSpots: 20,
    totalSpots: 50,
    pricePerHour: 5,
  },
  {
    _id: "2",
    name: "Downtown Parking",
    type: "private",
    location: { coordinates: [77.5222, 28.5208] },
    availableSpots: 15,
    totalSpots: 30,
    pricePerHour: 8,
  },
  {
    _id: "3",
    name: "City Center Parking",
    type: "government",
    location: { coordinates: [77.5278, 28.5298] },
    availableSpots: 25,
    totalSpots: 40,
    pricePerHour: 6,
  },
];

// Component to automatically center map on location change
const MapCenterHandler = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom());
    }
  }, [center, map]);

  return null;
};

// Function to fetch parking data from the server
const fetchParkingData = async (lat, lng, radius = 5) => {
  try {
    const response = await fetch(
      `${API_BASE_URL || "http://localhost:5002/api"}/parking?lat=${lat}&lng=${lng}&distance=${radius}`,
    );
    const data = await response.json();

    if (
      response.ok &&
      data.status === "success" &&
      data.data &&
      data.data.parkings
    ) {
      return data.data.parkings;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

// Function to fetch all parking spots
const fetchAllParkingSpots = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL || "http://localhost:5002/api"}/parking`,
    );
    const data = await response.json();

    if (
      response.ok &&
      data.status === "success" &&
      data.data &&
      data.data.parkings
    ) {
      return data.data.parkings;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

const GuestHome = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState("");
  const [parkingSpots, setParkingSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [allParkingSpots, setAllParkingSpots] = useState([]);
  const [loadingSpots, setLoadingSpots] = useState(true);

  const updateParkingSpots = async (lat, lng) => {
    try {
      const realParkingData = await fetchParkingData(lat, lng);

      if (realParkingData && realParkingData.length > 0) {
        setParkingSpots(realParkingData);
      } else {
        setParkingSpots(fallbackParkingSpots);
      }
    } catch (error) {
      setParkingSpots(fallbackParkingSpots);
    }
  };

  const handleBookNow = (parking) => {
    if (isAuthenticated) {
      navigate("/dashboard", {
        state: {
          parkingLot: parking,
        },
      });
    } else {
      navigate("/login", {
        state: {
          from: "/dashboard",
          parkingId: parking._id,
        },
      });
    }
  };

  const handleFindMyLocation = () => {
    setIsSearching(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          updateParkingSpots(location.lat, location.lng);
          setIsSearching(false);
          setLoading(false);
        },
        (error) => {
          setIsSearching(false);
          setLoading(false);
        },
      );
    } else {
      setIsSearching(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFindMyLocation();
  }, []);

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => setLoading(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  // Load all parking spots on mount
  useEffect(() => {
    async function loadAllParkingSpots() {
      setLoadingSpots(true);
      const spots = await fetchAllParkingSpots();
      setAllParkingSpots(spots);
      setLoadingSpots(false);
    }

    loadAllParkingSpots();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?location=${encodeURIComponent(searchLocation)}`);
  };

  const features = [
    {
      icon: <SearchIcon sx={{ fontSize: 48 }} />,
      title: "Easy Search",
      description:
        "Find available parking spaces near you with real-time availability updates.",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48 }} />,
      title: "Secure Booking",
      description:
        "Book your parking spot in advance with our secure payment processing system.",
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 48 }} />,
      title: "Flexible Payment",
      description: "Multiple payment options available for your convenience and ease.",
    },
  ];

  const stats = [
    { icon: <DirectionsCarIcon />, value: "1000+", label: "Parking Spots" },
    { icon: <EmojiEventsIcon />, value: "5000+", label: "Happy Users" },
    { icon: <SpeedIcon />, value: "99%", label: "Uptime" },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 40%, #9333EA 70%, #A855F7 100%)",
          color: "white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
          // Multiple radial glow effects for depth
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 15% 40%, rgba(255,255,255,0.12) 0%, transparent 50%), radial-gradient(circle at 85% 60%, rgba(236,72,153,0.15) 0%, transparent 40%)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: "-50%",
            right: "-20%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
          },
        }}
      >
        {/* Floating decorative shapes */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.08)",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "15%",
            right: "8%",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            animation: "float 8s ease-in-out infinite 1s",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "60%",
            left: "15%",
            width: 40,
            height: 40,
            borderRadius: "12px",
            border: "2px solid rgba(255,255,255,0.06)",
            transform: "rotate(45deg)",
            animation: "float 5s ease-in-out infinite 0.5s",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              {/* Eyebrow text */}
              <Typography
                variant="overline"
                sx={{
                  display: "inline-block",
                  mb: 2,
                  px: 2,
                  py: 0.5,
                  borderRadius: 5,
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                🚗 #1 Smart Parking Platform
              </Typography>

              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.5rem" },
                  mb: 2,
                  lineHeight: 1.15,
                }}
              >
                Smart Parking{" "}
                <br />
                Made{" "}
                <Box
                  component="span"
                  sx={{
                    background: "rgba(255,255,255,0.2)",
                    px: 2,
                    py: 0.3,
                    borderRadius: 3,
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  Easy
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.85,
                  fontWeight: 400,
                  lineHeight: 1.7,
                  maxWidth: 480,
                  fontSize: { xs: "1rem", md: "1.15rem" },
                }}
              >
                Find and book parking spaces in real-time. Save time,
                avoid the hassle, and park smarter.
              </Typography>

              {/* Search Form — stacked layout */}
              <Paper
                component="form"
                onSubmit={handleSearch}
                elevation={0}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.97)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Enter location to find parking..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: "flex", color: colors.grey[400] }}>
                        <SearchIcon />
                      </Box>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2.5,
                      backgroundColor: colors.grey[50],
                      fontSize: "0.95rem",
                      "& fieldset": {
                        borderColor: colors.grey[200],
                      },
                      "&:hover fieldset": {
                        borderColor: colors.primary.light,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary.main,
                        borderWidth: 2,
                      },
                    },
                  }}
                />
                <Stack direction="row" spacing={1}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SearchIcon />}
                    sx={{
                      flex: 1,
                      py: 1.2,
                      borderRadius: 2.5,
                      background: colors.primary.gradient,
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
                      "&:hover": {
                        boxShadow: "0 6px 20px rgba(99, 102, 241, 0.45)",
                      },
                    }}
                  >
                    Search
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<MyLocationIcon />}
                    onClick={handleFindMyLocation}
                    disabled={isSearching}
                    sx={{
                      py: 1.2,
                      px: 2.5,
                      borderRadius: 2.5,
                      borderColor: colors.grey[300],
                      color: colors.primary.main,
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      "&:hover": {
                        borderColor: colors.primary.main,
                        background: alpha(colors.primary.main, 0.06),
                      },
                    }}
                  >
                    {isSearching ? "Finding..." : "Locate Me"}
                  </Button>
                </Stack>
              </Paper>

              {/* Stats */}
              <Stack
                direction="row"
                spacing={{ xs: 3, md: 5 }}
                sx={{
                  mt: 5,
                  pt: 4,
                  borderTop: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                {stats.map((stat, index) => (
                  <Box key={index} sx={{ textAlign: "center" }}>
                    <Box sx={{ mb: 0.5, opacity: 0.8 }}>{stat.icon}</Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 800, mb: 0.3, fontSize: { xs: "1.5rem", md: "2rem" } }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ opacity: 0.7, fontWeight: 500, fontSize: "0.8rem" }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  minHeight: { xs: "400px", md: "500px" },
                  height: { xs: "400px", md: "500px" },
                  width: "100%",
                  position: "relative",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  "& .leaflet-container": {
                    height: "100%",
                    width: "100%",
                    borderRadius: 4,
                  },
                }}
              >
                {loading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                    sx={{
                      background: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <CircularProgress sx={{ color: "white" }} />
                  </Box>
                ) : (
                  <MapContainer
                    center={userLocation || [28.6139, 77.209]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={true}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapCenterHandler
                      center={
                        userLocation
                          ? [userLocation.lat, userLocation.lng]
                          : null
                      }
                    />
                    {userLocation && (
                      <Marker
                        position={[userLocation.lat, userLocation.lng]}
                        icon={userLocationIcon}
                      >
                        <Popup>
                          <Typography variant="subtitle2">
                            Your Location
                          </Typography>
                        </Popup>
                      </Marker>
                    )}
                    {(parkingSpots.length > 0
                      ? parkingSpots
                      : fallbackParkingSpots
                    ).map((spot) => (
                      <Marker
                        key={spot._id}
                        position={[
                          spot.location.coordinates[1],
                          spot.location.coordinates[0],
                        ]}
                        icon={
                          spot.type === "government"
                            ? governmentIcon
                            : privateIcon
                        }
                      >
                        <Popup>
                          <Typography variant="subtitle2">
                            {spot.name}
                          </Typography>
                          <Typography variant="body2">
                            Available: {spot.availableSpots}/{spot.totalSpots}
                          </Typography>
                          <Typography variant="body2">
                            ₹{spot.pricePerHour}/hour
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleBookNow(spot)}
                            sx={{ mt: 1 }}
                          >
                            Book Now
                          </Button>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, mb: 2 }}
        >
          Why Choose ParkEase?
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 600, mx: "auto" }}
        >
          Experience the future of parking with our innovative features designed
          for your convenience
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  p: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      mb: 3,
                      display: "inline-flex",
                      p: 2,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${alpha(colors.primary.main, 0.1)} 0%, ${alpha(colors.secondary.main, 0.1)} 100%)`,
                      color: colors.primary.main,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* All Available Parking Spots Section */}
      <Box sx={{ bgcolor: colors.background.default, py: 10 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 700, mb: 4 }}
          >
            Available Parking Spots
          </Typography>

          {loadingSpots ? (
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Card>
                    <CardContent>
                      <Skeleton variant="text" width="60%" height={32} />
                      <Skeleton variant="text" width="90%" />
                      <Skeleton variant="text" width="70%" />
                      <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : allParkingSpots.length > 0 ? (
            <Grid container spacing={3}>
              {allParkingSpots.map((spot) => (
                <Grid item xs={12} sm={6} md={4} key={spot._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                      overflow: "visible",
                    }}
                  >
                    <CardContent sx={{ pb: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ fontWeight: 600 }}
                        >
                          {spot.name}
                        </Typography>
                        <Chip
                          label={
                            spot.type.charAt(0).toUpperCase() +
                            spot.type.slice(1)
                          }
                          color={
                            spot.type === "government"
                              ? "primary"
                              : spot.type === "private"
                                ? "secondary"
                                : "default"
                          }
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>

                      <Stack spacing={1.5}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LocationOnIcon
                            fontSize="small"
                            sx={{ mr: 1, color: "text.secondary" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {spot.location?.address || "Location available"}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LocalParkingIcon
                            fontSize="small"
                            sx={{ mr: 1, color: "text.secondary" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            <strong>
                              {spot.availableSpots}/{spot.totalSpots}
                            </strong>{" "}
                            spots available
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LocalAtmIcon
                            fontSize="small"
                            sx={{ mr: 1, color: "text.secondary" }}
                          />
                          <Typography variant="h6" color="primary">
                            ₹{spot.pricePerHour}
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                            >
                              /hour
                            </Typography>
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={spot.availableSpots <= 0}
                        onClick={() => handleBookNow(spot)}
                        sx={{ py: 1.25 }}
                      >
                        {spot.availableSpots > 0
                          ? "Book Now"
                          : "No Spots Available"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper
              sx={{
                p: 6,
                textAlign: "center",
                background: "white",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No parking spots available at the moment
              </Typography>
            </Paper>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default GuestHome;
