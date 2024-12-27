"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, QrCode } from 'lucide-react'
import Link from "next/link"
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import QRCode from "qrcode-generator";
import CircularQRCode from '@/components/CircularQRCode';


export default function Hero() {
  const [url, setUrl] = useState("https://example.com/");
  const [qrcode, setQrcode] = useState<any>(null);
  // const [moduleCount, setModuleCount] = useState<number | null>(null);
  const [moduleCount, setModuleCount] = useState<number>(0);
  // const [moduleSize, setModuleSize] = useState<number | null>(null);
  const [moduleSize, setModuleSize] = useState<number>(0);

  const qrCodeSize = 300; // Fixed size for the QR code

  useEffect(() => {
    const errorCorrectionLevel = "H";
    const qrcodeLocal = QRCode(0, errorCorrectionLevel);
    qrcodeLocal.addData(url);
    qrcodeLocal.make();

    setQrcode(qrcodeLocal);

    const moduleCountLocal = qrcodeLocal.getModuleCount();
    setModuleCount(moduleCountLocal);

    const moduleSizeLocal = qrCodeSize / moduleCountLocal;
    setModuleSize(moduleSizeLocal);
  }, [url]);

  // Default styling props for the QR code
  const qrProps = {
    qrcode,
    moduleSize,
    qrCodeSize,
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
  };

  return (
      <section className="relative flex justify-center">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(60,100,255,0.9)_0%,rgba(60,100,255,0)_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(87,170,255,0.8)_0%,rgba(87,170,255,0)_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(177,227,283,0.7)_0%,rgba(177,227,283,0)_50%)]" />
        </div>


        {/*<div className="absolute inset-0 bg-gradient-to-br from-background to-muted -z-10" />*/}

        <div className="container px-4 md:px-6 flex flex-col items-center space-y-12 pb-8 pt-16 md:pt-24 lg:pt-32 min-h-[calc(100vh-4rem)]">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="rounded-2xl bg-muted p-2 text-muted-foreground">
              <QrCode className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Create Beautiful QR Codes <br className="hidden sm:inline" />
              in Seconds
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-white">
              Design custom QR codes that match your brand. Easy to create, instant to download, and ready to share.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/create">
                  Create QR Code
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/examples">
                  View Examples
                </Link>
              </Button>
            </div>
          </div>

          <div className="w-full max-w-5xl mx-auto relative">
            {/*<div className="rounded-xl border bg-background">*/}

            <div className="rounded-full border bg-background h-[450px]">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/*<div className="flex items-center justify-center px-8">*/}

                {/*<div className="flex items-center justify-center">*/}

                  <div className="items-center justify-center">
                  {/*<div className="relative aspect-square w-full max-w-[300px] animate-spin flex animate-slowSpin">*/}

                  {/* animate-slowSpin */}

                  <div className="relative w-[450px] h-full -ml-1">
                    {moduleSize && qrcode && moduleCount && (
                        <CircularQRCode {...qrProps} />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center p-8 bg-muted/50 rounded-r-full">
                  <div className="space-y-4 w-full max-w-[300px]">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Input
                          className={"rounded-full scale-125"}
                          type="url"
                          id="url"
                          placeholder="https://example.com/"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 blur-3xl" />
          </div>
        </div>
      </section>
  )
}