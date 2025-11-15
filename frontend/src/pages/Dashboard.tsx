import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person,
  Assessment,
  Logout,
  TrendingUp,
  Shield,
  Description,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { purchaseAPI } from '../services/api';
import { Alert } from '@mui/material';
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [, setPurchases] = React.useState<any[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const stats = [
    {
      title: 'Active Policies',
      value: '3',
      icon: <Shield />,
      color: '#4caf50',
      bgColor: '#e8f5e8',
    },
    {
      title: 'Claims Filed',
      value: '1',
      icon: <Description />,
      color: '#ff9800',
      bgColor: '#fff3e0',
    },
    {
      title: 'Premium Paid',
      value: '₹45,000',
      icon: <TrendingUp />,
      color: '#2196f3',
      bgColor: '#e3f2fd',
    },
    {
      title: 'Renewals Due',
      value: '2',
      icon: <Assessment />,
      color: '#f44336',
      bgColor: '#ffebee',
    },
  ];

  
  const [renewalBanner, setRenewalBanner] = React.useState<{ purchaseId?: string; newExpiryDate?: string; show: boolean }>({ show: false });

  React.useEffect(() => {
    let mounted = true;
    const loadPurchases = async () => {
      try {
        const data = await purchaseAPI.getUserPurchases();
        if (!mounted) return;
        setPurchases(data.purchases || data || []);
      } catch (err) {
        // ignore
      }
    };

    loadPurchases();

    // Check for a lastRenewal flag set by the renewal page
    try {
      const raw = localStorage.getItem('lastRenewal');
      if (raw) {
        const parsed = JSON.parse(raw);
        setRenewalBanner({ purchaseId: parsed.purchaseId, newExpiryDate: parsed.newExpiryDate, show: true });
        // Clear after reading
        localStorage.removeItem('lastRenewal');
        // refresh purchases to pick up updated expiry
        loadPurchases();
      }
    } catch (e) {
      // ignore
    }

    return () => { mounted = false; };
  }, []);

  const quickActions = [
    {
      title: 'Search Policies',
      description: 'Find the perfect insurance policy for your needs',
      icon: <Shield />,
      color: '#1976d2',
    },
    {
      title: 'File a Claim',
      description: 'Submit and track your insurance claims',
      icon: <Description />,
      color: '#ff9800',
    },
    {
      title: 'Compare Plans',
      description: 'Compare different insurance plans and rates',
      icon: <Assessment />,
      color: '#4caf50',
    },
    {
      title: 'Renew Policy',
      description: 'Renew your existing insurance policies',
      icon: <TrendingUp />,
      color: '#9c27b0',
    },
  ];

  return (
    <Box className="dashboard-container">
      <Container maxWidth="lg" className="dashboard-content" sx={{ mt: 3 }}>
        {/* Top App Bar */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', color: 'text.primary' }}>
          <Toolbar>
            <DashboardIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
              InsureMithra
            </Typography>

            <IconButton color="inherit" onClick={handleMenuOpen}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleProfile}>
                <Person sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Welcome Section */}
        <Card className="welcome-card" sx={{ mt: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Typography variant="h4">
                    Welcome back, {user?.firstName}! 👋
                  </Typography>
                  {user?.role === 'admin' && (
                    <Chip label="Admin" color="secondary" size="small" icon={<Shield />} />
                  )}
                </Box>

                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Here's what's happening with your insurance today.
                </Typography>
              </Box>
              <Chip
                label={user?.isEmailVerified ? 'Verified' : 'Unverified'}
                color={user?.isEmailVerified ? 'success' : 'warning'}
                variant="outlined"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <Card className="stat-card">
                <CardContent>
                  <Box
                    className="stat-icon"
                    sx={{
                      bgcolor: stat.bgColor,
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography className="stat-value">{stat.value}</Typography>
                  <Typography className="stat-label">{stat.title}</Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3 }}>
          Quick Actions
        </Typography>

        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <div key={index} className="action-item">
              <Card
                className="stat-card"
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent>
                  <Box
                    className="stat-icon"
                    sx={{
                      bgcolor: `${action.color}20`,
                      color: action.color,
                    }}
                  >
                    {action.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Box>
              {renewalBanner.show && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setRenewalBanner({ show: false })}>
                  Renewal Successful for policy. New expiry: {renewalBanner.newExpiryDate ? new Date(renewalBanner.newExpiryDate).toLocaleDateString() : ''}
                </Alert>
              )}
              <Box display="flex" alignItems="center" py={2} borderBottom="1px solid #eee">
                <Shield sx={{ mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="body1">Policy renewed successfully</Typography>
                  <Typography variant="body2" color="text.secondary">
                    2 days ago
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" py={2} borderBottom="1px solid #eee">
                <Description sx={{ mr: 2, color: 'warning.main' }} />
                <Box>
                  <Typography variant="body1">New claim submitted</Typography>
                  <Typography variant="body2" color="text.secondary">
                    1 week ago
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" py={2}>
                <Assessment sx={{ mr: 2, color: 'info.main' }} />
                <Box>
                  <Typography variant="body1">Profile updated</Typography>
                  <Typography variant="body2" color="text.secondary">
                    2 weeks ago
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Dashboard;
