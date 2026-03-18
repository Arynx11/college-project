import { useState, useEffect, createContext, useContext } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { colors } from "../../theme/theme";

// Create auth context
export const AuthContext = createContext();

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(() => localStorage.getItem("userRole") || null);
  const [userName, setUserName] = useState(() => localStorage.getItem("userName") || "");
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("userRole");
    const storedUserName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");

    setIsAuthenticated(!!token);

    if (token) {
      setUserRole(storedRole || null);
      setUserName(storedUserName || "");
      setUserId(storedUserId || null);
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userName", user.name || "");
    localStorage.setItem("userId", user._id || "");

    setIsAuthenticated(true);
    setUserRole(user.role);
    setUserName(user.name || "");
    setUserId(user._id || "");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");

    setIsAuthenticated(false);
    setUserRole(null);
    setUserName("");
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        userName,
        userId,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userRole, userName, logout } = useAuth();

  // Detect scroll to adjust navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate("/");
  };

  const getNavigationItems = () => {
    if (!isAuthenticated) {
      return [
        { label: "Home", path: "/" },
        { label: "Find Parking", path: "/search" },
      ];
    }

    switch (userRole) {
      case "operator":
        return [
          { label: "Dashboard", path: "/operator" },
          { label: "My Spaces", path: "/operator/spaces" },
          { label: "Bookings", path: "/operator/bookings" },
        ];
      case "residential":
        return [
          { label: "Dashboard", path: "/residential" },
          { label: "My Spaces", path: "/residential/spaces" },
          { label: "Bookings", path: "/residential/bookings" },
        ];
      default: // regular user
        return [
          { label: "Dashboard", path: "/dashboard" },
          { label: "Find Parking", path: "/search" },
        ];
    }
  };

  const navItems = getNavigationItems();

  const getCurrentRoleLabel = () => {
    switch (userRole) {
      case "operator":
        return "Parking Operator";
      case "residential":
        return "Residential Owner";
      default:
        return "User";
    }
  };

  // Check if a nav item is the active route
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: 1100,
        background: scrolled
          ? "rgba(79, 70, 229, 0.92)"
          : "rgba(99, 102, 241, 0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        transition: "all 0.3s ease",
        boxShadow: scrolled
          ? "0 4px 30px rgba(0, 0, 0, 0.15)"
          : "none",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 64 } }}>
          {/* Desktop Logo */}
          <DirectionsCarFilledIcon
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 1,
              fontSize: 30,
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 4,
              display: { xs: "none", md: "flex" },
              fontWeight: 800,
              fontSize: "1.4rem",
              color: "inherit",
              textDecoration: "none",
              letterSpacing: "-0.02em",
            }}
          >
            ParkEase
          </Typography>

          {/* Mobile Hamburger Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  mt: 1,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                },
              }}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to={item.path}
                  selected={isActive(item.path)}
                  sx={{
                    py: 1.2,
                    px: 3,
                    fontWeight: isActive(item.path) ? 700 : 500,
                    color: isActive(item.path)
                      ? colors.primary.main
                      : "text.primary",
                    "&.Mui-selected": {
                      backgroundColor: `rgba(99, 102, 241, 0.08)`,
                    },
                  }}
                >
                  <Typography>{item.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <DirectionsCarFilledIcon
            sx={{ display: { xs: "flex", md: "none" }, mr: 1, fontSize: 26 }}
          />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 800,
              color: "inherit",
              textDecoration: "none",
              letterSpacing: "-0.02em",
            }}
          >
            ParkEase
          </Typography>

          {/* Desktop Nav Links */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              gap: 0.5,
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={RouterLink}
                to={item.path}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 1,
                  px: 2,
                  py: 0.8,
                  color: "white",
                  fontWeight: isActive(item.path) ? 700 : 500,
                  fontSize: "0.9rem",
                  borderRadius: 2,
                  position: "relative",
                  backgroundColor: isActive(item.path)
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",

                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Right Side: Role Badge + User Actions */}
          <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center", gap: 1.5 }}>
            {isAuthenticated && (
              <Typography
                variant="caption"
                sx={{
                  display: { xs: "none", md: "flex" },
                  bgcolor: "rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.9)",
                  px: 1.5,
                  py: 0.4,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  letterSpacing: "0.03em",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {getCurrentRoleLabel()}
              </Typography>
            )}

            {isAuthenticated ? (
              <>
                <Tooltip title="Account">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={userName}
                      sx={{
                        width: 38,
                        height: 38,
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        background: "linear-gradient(135deg, #667eea 0%, #EC4899 100%)",
                        border: "2px solid rgba(255,255,255,0.3)",
                        cursor: "pointer",
                      }}
                    >
                      {getInitials(userName)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "50px" }}
                  id="user-menu"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  keepMounted
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{
                    sx: {
                      borderRadius: 3,
                      minWidth: 220,
                      boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                      border: "1px solid rgba(0,0,0,0.06)",
                      overflow: "visible",
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: -6,
                        right: 18,
                        width: 12,
                        height: 12,
                        bgcolor: "background.paper",
                        transform: "rotate(45deg)",
                        borderLeft: "1px solid rgba(0,0,0,0.06)",
                        borderTop: "1px solid rgba(0,0,0,0.06)",
                      },
                    },
                  }}
                >
                  {/* User Info Header */}
                  <Box sx={{ px: 2.5, py: 2 }}>
                    <Typography
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: colors.grey[900],
                      }}
                    >
                      {userName}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.78rem",
                        color: colors.grey[500],
                        fontWeight: 500,
                        mt: 0.3,
                      }}
                    >
                      {getCurrentRoleLabel()}
                    </Typography>
                  </Box>
                  <Divider />

                  <MenuItem
                    component={RouterLink}
                    to="/profile"
                    onClick={handleCloseUserMenu}
                    sx={{
                      py: 1.3,
                      px: 2.5,
                      "&:hover": {
                        backgroundColor: `rgba(99, 102, 241, 0.06)`,
                      },
                    }}
                  >
                    <ListItemIcon>
                      <PersonOutlineIcon
                        fontSize="small"
                        sx={{ color: colors.primary.main }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="My Profile"
                      primaryTypographyProps={{
                        fontSize: "0.88rem",
                        fontWeight: 500,
                      }}
                    />
                  </MenuItem>

                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      py: 1.3,
                      px: 2.5,
                      "&:hover": {
                        backgroundColor: "rgba(239, 68, 68, 0.06)",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <LogoutIcon
                        fontSize="small"
                        sx={{ color: colors.error.main }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Logout"
                      primaryTypographyProps={{
                        fontSize: "0.88rem",
                        fontWeight: 500,
                        color: colors.error.main,
                      }}
                    />
                  </MenuItem>

                  <Divider />

                  <MenuItem
                    component={RouterLink}
                    to="/login"
                    onClick={handleCloseUserMenu}
                    sx={{
                      py: 1.3,
                      px: 2.5,
                      "&:hover": {
                        backgroundColor: `rgba(99, 102, 241, 0.06)`,
                      },
                    }}
                  >
                    <ListItemIcon>
                      <SwapHorizIcon
                        fontSize="small"
                        sx={{ color: colors.grey[500] }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Switch Account"
                      primaryTypographyProps={{
                        fontSize: "0.88rem",
                        fontWeight: 500,
                        color: colors.grey[600],
                      }}
                    />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    px: 2.5,
                    borderRadius: 2,
                    border: "1.5px solid rgba(255,255,255,0.3)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderColor: "rgba(255,255,255,0.5)",
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  sx={{
                    color: colors.primary.dark,
                    fontWeight: 700,
                    px: 2.5,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.95)",
                    "&:hover": {
                      background: "#fff",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
