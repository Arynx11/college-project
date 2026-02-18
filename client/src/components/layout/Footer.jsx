import { Box, Container, Grid, Typography, Link, Stack, IconButton, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { colors } from '../../theme/theme';

const Footer = () => {
  const linkStyles = {
    color: colors.grey[600],
    '&:hover': { color: colors.primary.main },
    transition: 'color 0.2s',
    fontWeight: 500,
    fontSize: '0.875rem',
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        background: colors.grey[900],
        color: colors.grey[300],
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Box sx={{ py: { xs: 4, md: 5 } }}>
          <Grid container spacing={{ xs: 4, md: 6 }}>
            {/* Brand Section */}
            <Grid item xs={12} md={4}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <DirectionsCarFilledIcon sx={{ fontSize: 28, color: colors.primary.light }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                  ParkEase
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: colors.grey[400], mb: 2.5, lineHeight: 1.7, maxWidth: 300 }}>
                Smart parking management system making parking easier for everyone.
                Find, book, and manage parking spaces efficiently.
              </Typography>
              <Stack direction="row" spacing={1}>
                {[
                  { icon: <GitHubIcon fontSize="small" />, label: 'GitHub' },
                  { icon: <TwitterIcon fontSize="small" />, label: 'Twitter' },
                  { icon: <LinkedInIcon fontSize="small" />, label: 'LinkedIn' },
                ].map((social) => (
                  <IconButton
                    key={social.label}
                    size="small"
                    aria-label={social.label}
                    sx={{
                      color: colors.grey[400],
                      bgcolor: 'rgba(255,255,255,0.06)',
                      '&:hover': { bgcolor: colors.primary.main, color: '#fff' },
                      transition: 'all 0.2s',
                      width: 36,
                      height: 36,
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={6} md={3}>
              <Typography variant="overline" sx={{ fontWeight: 700, color: colors.grey[400], letterSpacing: '0.1em', mb: 2, display: 'block' }}>
                Quick Links
              </Typography>
              <Stack spacing={1.2}>
                <Link component={RouterLink} to="/search" underline="none" sx={{ ...linkStyles }}>
                  Find Parking
                </Link>
                <Link component={RouterLink} to="/register" underline="none" sx={{ ...linkStyles }}>
                  Register as Operator
                </Link>
                <Link component={RouterLink} to="/about" underline="none" sx={{ ...linkStyles }}>
                  About Us
                </Link>
                <Link component={RouterLink} to="/help" underline="none" sx={{ ...linkStyles }}>
                  Help & Support
                </Link>
              </Stack>
            </Grid>

            {/* Contact Us */}
            <Grid item xs={6} md={3}>
              <Typography variant="overline" sx={{ fontWeight: 700, color: colors.grey[400], letterSpacing: '0.1em', mb: 2, display: 'block' }}>
                Contact Us
              </Typography>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon sx={{ fontSize: 18, color: colors.primary.light }} />
                  <Typography variant="body2" sx={{ color: colors.grey[400], fontSize: '0.85rem' }}>
                    support@parkease.com
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIcon sx={{ fontSize: 18, color: colors.primary.light }} />
                  <Typography variant="body2" sx={{ color: colors.grey[400], fontSize: '0.85rem' }}>
                    (555) 123-4567
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Bottom Bar */}
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
        <Box
          sx={{
            py: 2.5,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Typography variant="body2" sx={{ color: colors.grey[500], fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} ParkEase. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link
              href="#"
              underline="none"
              sx={{ color: colors.grey[500], fontSize: '0.8rem', fontWeight: 500, '&:hover': { color: colors.grey[300] } }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              underline="none"
              sx={{ color: colors.grey[500], fontSize: '0.8rem', fontWeight: 500, '&:hover': { color: colors.grey[300] } }}
            >
              Terms of Service
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;