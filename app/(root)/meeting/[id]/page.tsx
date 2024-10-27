"use client"

import Loader from '@/components/Loader';
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

const Meeting = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const params = useParams()
  const id = params?.id as string

  const { call, isCallLoading } = useGetCallById(id);

  useEffect(() => {
    console.log('User loaded:', isLoaded);
    console.log('User signed in:', isSignedIn);
    console.log('Call loading:', isCallLoading);
    console.log('Call:', call);
  }, [isLoaded, isSignedIn, isCallLoading, call]);

  if (!isLoaded || isCallLoading) return <Loader />

  if (!isSignedIn) {
    return <div>Please sign in to access this meeting.</div>
  }

  if (!call) {
    return <div>No call found with ID: {id}</div>
  }

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ):(
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting
