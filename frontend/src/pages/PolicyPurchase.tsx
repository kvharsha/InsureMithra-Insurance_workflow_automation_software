import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import { policyAPI, purchaseAPI } from '../services/api';

const PolicyPurchase: React.FC = () => {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // fetch policy details via search endpoint by id
    (async () => {
      try {
        setLoading(true);
        const res = await policyAPI.searchPolicies({});
        const items = res?.data ?? res?.results ?? [];
        const p = items.find((it: any) => it._id === policyId);
        setPolicy(p || null);
      } catch (err) {
        setError('Failed to load policy');
      } finally {
        setLoading(false);
      }
    })();
  }, [policyId]);

  useEffect(() => {
    let interval: any;
    if (purchaseId) {
      interval = setInterval(async () => {
        try {
          const res = await purchaseAPI.get(purchaseId);
          if (res?.success) {
            setStatus(res.data.status);
            if (res.data.status === 'success' || res.data.status === 'failed') {
              clearInterval(interval);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [purchaseId]);

  const handleSimulatePayment = async () => {
    if (!policyId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await purchaseAPI.initiate(policyId);
      if (res?.success) {
        setPurchaseId(res.data.purchaseId);
        setStatus('initiated');
      } else {
        setError(res?.message || 'Failed to initiate purchase');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to initiate purchase');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!purchaseId) return;
    try {
      const blob = await purchaseAPI.download(purchaseId);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `policy_${purchaseId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      setError('Failed to download PDF');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Container>
        <Typography variant="h4">Purchase Policy</Typography>
        {loading && <CircularProgress sx={{ mt: 2 }} />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && policy && (
          <div style={{ marginTop: 16 }}>
            <Typography variant="h6">{policy.name}</Typography>
            <Typography>{policy.type} • {policy.model} • {policy.insurer}</Typography>
            <Typography sx={{ mt: 1, fontWeight: 600 }}>Premium: ₹{policy.premium}</Typography>

            <div style={{ marginTop: 18 }}>
              <Button variant="contained" color="primary" onClick={handleSimulatePayment} disabled={!!purchaseId}>Simulate Payment</Button>
            </div>

            {purchaseId && (
              <div style={{ marginTop: 16 }}>
                <Typography>Purchase Status: {status}</Typography>
                {status === 'processing' && <CircularProgress />}
                {status === 'success' && (
                  <div style={{ marginTop: 12 }}>
                    <Typography color="primary">Payment successful! You can download your policy receipt.</Typography>
                    <Button variant="contained" sx={{ mt: 1 }} onClick={handleDownload}>Download PDF</Button>
                  </div>
                )}
                {status === 'failed' && (
                  <Typography color="error">Payment failed or timed out. Please try again.</Typography>
                )}
              </div>
            )}
          </div>
        )}

        {!policy && !loading && (
          <div style={{ marginTop: 16 }}>
            <Typography>No policy found. Go back to search.</Typography>
            <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate('/policies')}>Back to Policies</Button>
          </div>
        )}
      </Container>
    </Box>
  );
};

export default PolicyPurchase;
