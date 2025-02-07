'use client';

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ValidateDoctorProfile = () => {
  const [isMounted, setIsMounted] = useState(false); // state to check if component is mounted
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  // Set isMounted to true once the component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only run the router logic if the component is mounted
  const router = useRouter();

  useEffect(() => {
    if (router.isReady && router.query.token) {
      setToken(router.query.token as string);
    }
  }, [router.isReady, router.query.token]);

  useEffect(() => {
    if (token) {
      const verifyProfile = async () => {
        try {
          const response = await axios.get(
            `/api/doctor/validate-profile?token=${token}`
          );
          setIsVerified(true);
        } catch (err) {
          setError('Invalid or expired token. Please check the link again.');
        }
      };
      verifyProfile();
    }
  }, [token]);

  // Render loading screen while the component is mounting
  if (!isMounted) {
    return <div>Loading...</div>;
  }

  // Show the error if the token is invalid
  if (error) {
    return (
      <div>
        <h1>{error}</h1>
      </div>
    );
  }

  // Show verification message if profile is verified
  if (isVerified) {
    return (
      <div>
        <h1>Your profile is successfully validated!</h1>
        <p>You can now proceed to complete your doctor profile.</p>
        {/* Provide UI for the user to add more information if needed */}
        {/* You can redirect them or show the profile form */}
      </div>
    );
  }

  // Default loading message
  return <div>Loading...</div>;
};

export default ValidateDoctorProfile;

