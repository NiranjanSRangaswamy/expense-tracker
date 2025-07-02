"use client"; 

import dynamic from "next/dynamic";
import React from "react";

import * as animationData from "@/public/loading.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Loading() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center">
      <Lottie
        animationData={defaultOptions.animationData}
        loop={defaultOptions.loop}
        autoplay={defaultOptions.autoplay}
        rendererSettings={defaultOptions.rendererSettings}
        style={{ width: 200, height: 200 }} 
      />
      <p className="mt-4 text-lg text-gray-700">Loading your content...</p>
    </div>
  );
}
