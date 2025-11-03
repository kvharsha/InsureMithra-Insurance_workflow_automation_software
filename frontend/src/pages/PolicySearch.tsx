import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Card, CardContent, TextField, Button, Typography, InputAdornment } from '@mui/material';
import { policyAPI } from '../services/api';
import SearchIcon from '@mui/icons-material/Search';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const PolicySearch: React.FC = () => {
  const [filters, setFilters] = useState({ type: '', insurer: '', minPremium: '', maxPremium: '' });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const policyTypes = useMemo(() => ['Health', 'Life', 'Auto', 'Home', 'Travel'], []);
  const insurers = useMemo(() => ['LIC', 'HDFC ERGO', 'ICICI Lombard', 'Tata AIG', 'SBI General'], []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const query: any = {};
      if (filters.type) query.type = filters.type;
      if (filters.insurer) query.insurer = filters.insurer;
      if (filters.minPremium) query.minPremium = filters.minPremium;
      if (filters.maxPremium) query.maxPremium = filters.maxPremium;
      const qs = new URLSearchParams(query).toString();
      navigate(qs ? `/policy-search?${qs}` : '/policy-search', { replace: true });
      const data = await policyAPI.searchPolicies(query);
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Load from URL query on mount and when query changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const next = {
      type: params.get('type') || '',
      insurer: params.get('insurer') || '',
      minPremium: params.get('minPremium') || '',
      maxPremium: params.get('maxPremium') || ''
    };
    setFilters(next);
    const hasAny = next.type || next.insurer || next.minPremium || next.maxPremium;
    if (hasAny) {
      (async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await policyAPI.searchPolicies(next as any);
          setResults(data.results || []);
        } catch (err: any) {
          setError(err.response?.data?.error || 'Search failed');
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setResults([]);
    }
  }, [location.search]);

  return (
    <Box className="dashboard-container">
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 3 }}>Policy Search</Typography>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 220px', minWidth: 220 }}>
                <TextField select fullWidth label="Policy Type" name="type" value={filters.type} onChange={handleChange} SelectProps={{ native: true }}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}>
                  <option value="">All Types</option>
                  {policyTypes.map(t => (<option key={t} value={t}>{t}</option>))}
                </TextField>
              </div>
              <div style={{ flex: '1 1 220px', minWidth: 220 }}>
                <TextField select fullWidth label="Insurer" name="insurer" value={filters.insurer} onChange={handleChange} SelectProps={{ native: true }}>
                  <option value="">All Insurers</option>
                  {insurers.map(i => (<option key={i} value={i}>{i}</option>))}
                </TextField>
              </div>
              <div style={{ flex: '1 1 220px', minWidth: 220 }}>
                <TextField fullWidth type="number" label="Min Premium" name="minPremium" value={filters.minPremium} onChange={handleChange}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><MonetizationOnIcon /></InputAdornment>) }} />
              </div>
              <div style={{ flex: '1 1 220px', minWidth: 220 }}>
                <TextField fullWidth type="number" label="Max Premium" name="maxPremium" value={filters.maxPremium} onChange={handleChange}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><MonetizationOnIcon /></InputAdornment>) }} />
              </div>
              <div style={{ width: '100%' }}>
                <Button variant="contained" onClick={handleSearch} disabled={loading}>{loading ? 'Searching...' : 'Search'}</Button>
              </div>
            </div>
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          </CardContent>
        </Card>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {results.map((p, idx) => (
            <div key={p._id || idx} style={{ flex: '1 1 300px', minWidth: 280, maxWidth: 420 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>{p.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{p.type} • {p.insurer}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1976d2' }}>Premium: ₹{p.premium}</Typography>
                  {p.sumAssured ? <Typography variant="body2">Sum Assured: ₹{p.sumAssured}</Typography> : null}
                  {p.description ? <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{p.description}</Typography> : null}
                </CardContent>
              </Card>
            </div>
          ))}
          {!loading && results.length === 0 && (
            <Typography color="text.secondary">No results. Adjust filters and try again.</Typography>
          )}
        </div>
      </Container>
    </Box>
  );
};

export default PolicySearch;


