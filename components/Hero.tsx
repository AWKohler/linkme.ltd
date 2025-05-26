"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, QrCode } from 'lucide-react'
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import QRCode from "qrcode-generator"
import CircularQRCode from '@/components/CircularQRCode'

export default function Hero() {
  const [url, setUrl] = useState("https://example.com/")
  const [qrcode, setQrcode] = useState<any>(null)
  const [moduleCount, setModuleCount] = useState<number>(0)
  const [moduleSize, setModuleSize] = useState<number>(0)

  const qrCodeSize = 300 // Fixed size for the QR code

  useEffect(() => {
    const errorCorrectionLevel = "H"
    const qrcodeLocal = QRCode(0, errorCorrectionLevel)
    qrcodeLocal.addData(url)
    qrcodeLocal.make()

    setQrcode(qrcodeLocal)

    const moduleCountLocal = qrcodeLocal.getModuleCount()
    setModuleCount(moduleCountLocal)

    const moduleSizeLocal = qrCodeSize / moduleCountLocal
    setModuleSize(moduleSizeLocal)
  }, [url])

  // Default styling props for the QR code
  const qrProps = {
    qrcode,
    moduleSize,
    qrCodeSize,
    qrTrimCircle: false,
    qrTrimCircleRadius: 300,
    moduleCount,
    bgOption: "solid" as const,
    bgColor: "#ffffff",
    bgGradientType: "linear" as const,
    bgGradientColors: ["#ffffff", "#ffffff"],
    bgGradientAngle: 0,
    qrOption: "solid" as const,
    qrColor: "#000000",
    qrGradientType: "linear" as const,
    qrGradientColors: ["#000000", "#000000"],
    qrGradientAngle: 0,
    qrPalette: ["#000000"],
    finderPatternOption: "same" as const,
    finderPatternColor: "#000000",
    showText: false,
    roundness: 30,
    opacityVariation: 0,
    finderRoundness: 30,
    rectScaleX: 0.8,
    rectScaleY: 1.0,
    scaleVariation: 0,
    rectRotation: 0,
    uploadedImageDataUrl: null,
    imageScale: 1,
    borderColor: "#000000",
    borderWidth: 10,
    centerGapWidth: 0,
    centerGapHeight: 0,
    backgroundCoverage: 100,
    secondBorderEnabled: false,
    secondBorderColor: "#000000",
    secondBorderRange: [0, 100] as [number, number],
    borderTextEnabled: false,
    textLine1: "",
    textLine2: "Linkme.ltd/privacy",
    numTextLines: 2 as const,
    fontFamily: "Arial",
    fontSize: 10,
    textColor: "#fff",
    fontWeight: "normal",
    letterSpacing: 0,
    condensed: true,
    textPadding: 0,
    canvasSize: 450,
    barsEnabled: false,
    barsColor: "#000000",
    barsWidth: 10,
    barsGapDegrees: 5,
    barsRoundEnds: false,
    barsRadiusOffset: 20,
    svgRef: React.createRef<SVGSVGElement>(),
  }

  return (
    <section className="relative overflow-hidden pt-4">
    {/* <section className="relative overflow-hidden"> */}
      {/* Enhanced Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.7)_0%,rgba(59,130,246,0)_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(37,99,235,0.6)_0%,rgba(37,99,235,0)_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(29,78,216,0.5)_0%,rgba(29,78,216,0)_50%)]" />
        <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('/noise.png')]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 lg:py-32 min-h-[calc(100vh-4rem)]">
        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <div className="inline-flex items-center justify-center p-2 bg-blue-600/20 backdrop-blur-sm rounded-full">
              <QrCode className="h-5 w-5 text-blue-200" />
              <span className="ml-2 text-xs font-medium text-blue-200">QR Code Generator</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              Create Beautiful <span className="text-blue-300">QR Codes</span> in Seconds
            </h1>
            
            <p className="text-lg text-blue-100/80 max-w-xl">
              Design custom QR codes that match your brand. Easy to create, instant to download, and ready to share.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
              <Button size="lg" className="rounded-full bg-white text-blue-900 hover:bg-blue-50 shadow-lg shadow-blue-900/20" asChild>
                <Link href="/qr">
                  Create your free QR Code today!
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full text-white border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:text-white" asChild>
                <Link href="#">
                  View Examples
                </Link>
              </Button>
            </div>
          </div>

          {/* QR Code Preview */}

          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-500/10 to-purple-500/5 blur-3xl -z-10 rounded-full"></div>
            
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl">
              <div className="flex flex-col md:flex-row items-center gap-12">
                {/* QR Code Display */}
                {/* <div className="relative h-[300px] w-[300px] flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="animate-pulse-slow">
                    {moduleSize && qrcode && moduleCount && (
                      <CircularQRCode {...qrProps} />
                    )}
                  </div>
                </div> */}

                {/* <div className="relative h-[300px] w-[300px] flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-2xl p-4"> */}
                <div className="relative h-[300px] w-[300px] flex items-center justify-center p-8">
                  <div className="animate-pulse-slow scale-75">
                    {moduleSize && qrcode && moduleCount && (
                      <CircularQRCode {...qrProps} />
                    )}
                  </div>
                </div>
                
                {/* Input Section */}
                <div className="w-full max-w-sm space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="url" className="text-sm font-medium text-blue-100">
                      Enter URL to generate QR code
                    </label>
                    <Input
                      className="bg-white/10 border-white/20 text-white rounded-lg focus-visible:ring-blue-400"
                      type="url"
                      id="url"
                      placeholder="https://example.com/"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-blue-200/70">
                    Your QR code updates automatically as you type
                  </p>
                </div>
              </div>
            </div>
          </div>

          
          

          {/* <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-500/10 to-purple-500/5 blur-3xl -z-10 rounded-full"></div>
          
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative h-[250px] w-[250px] flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-full p-3">
                <div className="scale-[0.85]">
                  {moduleSize && qrcode && moduleCount && (
                    <CircularQRCode {...qrProps} />
                  )}
                </div>
              </div>
              
              <div className="w-full max-w-sm space-y-4">
                <div className="space-y-2">
                  <label htmlFor="url" className="text-sm font-medium text-blue-100">
                    Enter URL to generate QR code
                  </label>
                  <Input
                    className="bg-white/10 border-white/20 text-white rounded-lg focus-visible:ring-blue-400"
                    type="url"
                    id="url"
                    placeholder="https://example.com/"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <p className="text-xs text-blue-200/70">
                  Your QR code updates automatically as you type
                </p>
              </div>
            </div>
          </div>
        </div> */}

          
        </div>
      </div>
    </section>
  )
}