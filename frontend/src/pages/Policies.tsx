import React, { useEffect, useState } from 'react';
import { Box, Container, TextField, Button, Card, CardContent, Typography, MenuItem, Select } from '@mui/material';
import { policyAPI } from '../services/api';

const Policies: React.FC = () => {
  const [filters, setFilters] = useState({ type: '', model: '', insurer: '', minPrice: '', maxPrice: '' });
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.type) params.type = filters.type;
      if (filters.model) params.model = filters.model;
      if (filters.insurer) params.insurer = filters.insurer;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const res = await policyAPI.searchPolicies(params as any);
      const items = res?.data ?? res?.results ?? [];
      setPolicies(items);
    } catch (e) {
      console.error('Failed to fetch policies', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Typography variant="h4" sx={{ mb: 3 }}>Search Insurance Policies</Typography>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
          <div style={{ minWidth: 140 }}>
            <Select fullWidth value={filters.type} onChange={(e) => setFilters({ ...filters, type: String(e.target.value) })} displayEmpty>
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="2W">2W</MenuItem>
              <MenuItem value="4W">4W</MenuItem>
              <MenuItem value="Health">Health</MenuItem>
              <MenuItem value="Life">Life</MenuItem>
              <MenuItem value="Travel">Travel</MenuItem>
            </Select>
          </div>
          <div style={{ minWidth: 200 }}>
            <TextField fullWidth placeholder="Model" value={filters.model} onChange={(e) => setFilters({ ...filters, model: e.target.value })} />
          </div>
          <div style={{ minWidth: 200 }}>
            <TextField fullWidth placeholder="Insurer" value={filters.insurer} onChange={(e) => setFilters({ ...filters, insurer: e.target.value })} />
          </div>
          <div style={{ minWidth: 100 }}>
            <TextField fullWidth type="number" placeholder="Min ₹" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
          </div>
          <div style={{ minWidth: 100 }}>
            <TextField fullWidth type="number" placeholder="Max ₹" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
          </div>
          <div style={{ minWidth: 120 }}>
            <Button variant="contained" onClick={fetchPolicies} disabled={loading}>{loading ? 'Searching...' : 'Search'}</Button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {policies.length ? policies.map((p) => (
            <Card key={p._id}>
              <CardContent>
                <Typography variant="h6">{p.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{p.type} — {p.model}</Typography>
                <Typography><strong>Insurer:</strong> {p.insurer}</Typography>
                <Typography><strong>Premium:</strong> ₹{p.premium}</Typography>
                <Typography><strong>Coverage:</strong> {p.coverage}</Typography>
                {p.benefits?.length ? (
                  <ul style={{ marginTop: 8 }}>
                    {p.benefits.map((b: string, i: number) => <li key={i}>{b}</li>)}
                  </ul>
                ) : null}
                <div style={{ marginTop: 12 }}>
                  <Button variant="contained" color="secondary" onClick={() => window.location.href = `/purchase/${p._id}`}>Buy Now</Button>
                </div>
              </CardContent>
            </Card>
          )) : (
            <Typography color="text.secondary">No policies found matching your criteria.</Typography>
          )}
        </div>
      </Container>
    </Box>
  );
};

export default Policies;
