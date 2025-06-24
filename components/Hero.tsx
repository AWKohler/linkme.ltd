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
    roundness: 0,
    opacityVariation: 0,
    finderRoundness: 0,
    rectScaleX: 0.85,
    rectScaleY: 1.0,
    scaleVariation: 0,
    rectRotation: 0,
    uploadedImageDataUrl: null,
    imageScale: 1,
    borderColor: "#000000",
    borderWidth: 10,
    centerGapWidth: 0,
    centerGapHeight: 0,
    backgroundCoverage: 95,
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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-violet-200/30 to-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-radial from-purple-100/20 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="flex flex-col space-y-8 text-center lg:text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-100 to-purple-100 text-purple-700 rounded-full text-sm font-medium">
                <QrCode className="h-4 w-4" />
                <span>Free QR Code Generator</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                Beautiful QR Codes
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
                  Made Simple
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
                Create stunning, customizable QR codes in seconds. Perfect for businesses, events, and personal use.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30" 
                asChild
              >
                <Link href="/qr">
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 transition-colors" 
                asChild
              >
                <Link href="#features">
                  Explore Features
                </Link>
              </Button>
            </div>
          </div>

          {/* QR Code Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-200/20 via-purple-200/20 to-pink-200/20 blur-3xl" />
            
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="space-y-6">
                {/* Live QR Code Preview */}
                <div className="flex justify-center">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-inner">
                    <div className="transform transition-transform hover:scale-105">
                      {moduleSize && qrcode && moduleCount && (
                        <CircularQRCode {...qrProps} />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Interactive URL Input */}
                <div className="space-y-3">
                  <label htmlFor="url" className="text-sm font-medium text-gray-700">
                    Try it now - Enter any URL
                  </label>
                  <Input
                    className="bg-gray-50 border-gray-200 text-gray-900 rounded-xl h-12 px-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    type="url"
                    id="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Watch your QR code update in real-time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats or Trust Indicators */}
        <div className="mt-20 pt-12 border-t border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-gray-900">10K+</p>
              <p className="text-sm text-gray-600">QR Codes Created</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">100%</p>
              <p className="text-sm text-gray-600">Free Forever</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">5★</p>
              <p className="text-sm text-gray-600">User Rating</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">∞</p>
              <p className="text-sm text-gray-600">Unlimited Use</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}