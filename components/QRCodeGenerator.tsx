import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode-generator';

// UI components (adjust import paths as needed)
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { GradientPicker } from '@/components/GradientPicker'

// Lucide icons
import {
    Palette,
    Image as ImageIcon,
    Square,
    CircleDot,
    Download,
    Grid,
    Save,
} from 'lucide-react';

// Import your custom CircularQRCode component
import CircularQRCode from './CircularQRCode';

// -----------------------------
//  TYPE DEFINITIONS
// -----------------------------
type QROptionType = 'solid' | 'gradient' | 'multiple';

interface QRCodeGeneratorProps {
  initialData?: Record<string, unknown>;
  onSave?: (designData: Record<string, unknown>) => void;
  saving?: boolean;
  isEditing?: boolean;
}

// -----------------------------
//  QR CODE GENERATOR COMPONENT
// -----------------------------
const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  initialData, 
  onSave, 
  saving = false, 
  isEditing = false 
}) => {
    // -----------------------------
    //  STATE VARIABLES
    // -----------------------------
    const [text, setText] = useState('https://example.com/');

    // Background customization
    const [bgOption, setBgOption] = useState<'solid' | 'gradient'>('solid');
    const [bgColor, setBgColor] = useState('#FFFFFF');
    const [bgGradientType, setBgGradientType] = useState<'linear' | 'conic'>('linear');
    const [bgGradientColors, setBgGradientColors] = useState<string[]>(['#FFFFFF', '#FFFFFF']);
    const [bgGradientAngle, setBgGradientAngle] = useState(0);

    // **New**: Full gradient stops for background
    const [bgGradientStops, setBgGradientStops] = useState([
        // { color: '#FFFFFF', position: 0 },
        // { color: '#FFFFFF', position: 100 },
        { color: '#000000', position: 0 },
        { color: '#000000', position: 100 },
    ]);

    // QR code customization
    const [qrOption, setQrOption] = useState<QROptionType>('solid');
    const [qrColor, setQrColor] = useState('#000000');
    const [qrGradientType, setQrGradientType] = useState<'linear' | 'conic'>('linear');
    const [qrGradientColors, setQrGradientColors] = useState<string[]>(['#000000', '#000000']);
    const [qrGradientAngle, setQrGradientAngle] = useState(0);

    // **New**: Full gradient stops for QR code
    const [qrGradientStops, setQrGradientStops] = useState([
        { color: '#000000', position: 0 },
        { color: '#000000', position: 100 },
    ]);

    // Multiple-colors palette
    const [qrPalette, setQrPalette] = useState<string[]>(['#000000']);

    // Finder pattern color logic
    const [finderPatternOption, setFinderPatternOption] = useState<'same' | 'solid'>('same');
    const [finderPatternColor, setFinderPatternColor] = useState('#000000');

    // Outer border customization
    const [borderColor, setBorderColor] = useState('#000000');
    const [borderWidth, setBorderWidth] = useState(10);
    const [canvasSize, setCanvasSize] = useState<number>(1000);

    // Additional customization
    const [showText, setShowText] = useState(true);
    const [roundness, setRoundness] = useState(0);
    const [finderRoundness, setFinderRoundness] = useState(0);
    const [opacityVariation, setOpacityVariation] = useState(0);

    // Rect scaling
    const [rectScaleX, setRectScaleX] = useState(1.0);
    const [rectScaleY, setRectScaleY] = useState(1.0);

    // Scale variation
    const [scaleVariation, setScaleVariation] = useState(0);

    // Rect rotation
    const [rectRotation, setRectRotation] = useState(0);

    // Center gap
    const [centerGapWidth, setCenterGapWidth] = useState(0);
    const [centerGapHeight, setCenterGapHeight] = useState(0);

    // Image upload
    const [uploadedImageDataUrl, setUploadedImageDataUrl] = useState<string | null>(null);
    const [imageScale, setImageScale] = useState(1);

    // QR code info
    const [moduleSize, setModuleSize] = useState<number | null>(null);
    const [qrCodeSize, setQrCodeSize] = useState<number>(470);//700


    const [qrTrimCircle, setQrTrimCircle] = useState(false);
    const [qrTrimCircleRadius, setQrTrimCircleRadius] = useState<number>(300);



    const [moduleCount, setModuleCount] = useState<number | null>(null);
    const [qrcode, setQrcode] = useState<any>(null);

    // Export options
    const [exportResolution, setExportResolution] = useState(1024);
    const [exportFormat, setExportFormat] = useState<'png' | 'webp' | 'svg'>('png');
    const [exportComponent, setExportComponent] = useState<'full' | 'foreground' | 'background'>(
        'full'
    );

    // Background coverage
    const [backgroundCoverage, setBackgroundCoverage] = useState(100);

    // Second border
    const [secondBorderEnabled, setSecondBorderEnabled] = useState(false);
    const [secondBorderColor, setSecondBorderColor] = useState('#FF0000');
    const [secondBorderRange, setSecondBorderRange] = useState<[number, number]>([0, 100]);

    // Text on Border
    const [borderTextEnabled, setBorderTextEnabled] = useState(false);
    const [textLine1, setTextLine1] = useState('');
    const [textLine2, setTextLine2] = useState('');
    const [numTextLines, setNumTextLines] = useState<1 | 2>(1);
    const [fontFamily, setFontFamily] = useState('Arial');
    const [fontSize, setFontSize] = useState(20);
    const [textColor, setTextColor] = useState('#000000');
    const [fontWeight, setFontWeight] = useState('normal');
    const [letterSpacing, setLetterSpacing] = useState(0);
    const [condensed, setCondensed] = useState(false);
    const [textPadding, setTextPadding] = useState(10);

    // Bars
    const [barsEnabled, setBarsEnabled] = useState(false);
    const [barsColor, setBarsColor] = useState('#FF0000');
    const [barsWidth, setBarsWidth] = useState(10);
    const [barsGapDegrees, setBarsGapDegrees] = useState(5);
    const [barsRoundEnds, setBarsRoundEnds] = useState(false);
    const [barsRadiusOffset, setBarsRadiusOffset] = useState(20);

    const svgRef = useRef<SVGSVGElement>(null);

    // -----------------------------
    //  EFFECTS
    // -----------------------------
    useEffect(() => {
        const errorCorrectionLevel = 'H';
        const qrcodeLocal = QRCode(0, errorCorrectionLevel);
        qrcodeLocal.addData(text);
        qrcodeLocal.make();

        setQrcode(qrcodeLocal);

        const moduleCountLocal = qrcodeLocal.getModuleCount();
        setModuleCount(moduleCountLocal);

        const moduleSizeLocal = qrCodeSize / moduleCountLocal;
        setModuleSize(moduleSizeLocal);
    }, [text, qrCodeSize]);

    // Update the background gradient colors whenever stops change
    useEffect(() => {
        setBgGradientColors(bgGradientStops.map((stop) => stop.color));
    }, [bgGradientStops]);

    // Update the QR gradient colors whenever stops change
    useEffect(() => {
        setQrGradientColors(qrGradientStops.map((stop) => stop.color));
    }, [qrGradientStops]);

    // Initialize state from initialData prop
    useEffect(() => {
        if (initialData) {
            if (initialData.text !== undefined) setText(initialData.text as string);
            if (initialData.bgOption !== undefined) setBgOption(initialData.bgOption as 'solid' | 'gradient');
            if (initialData.bgColor !== undefined) setBgColor(initialData.bgColor as string);
            if (initialData.bgGradientType !== undefined) setBgGradientType(initialData.bgGradientType as 'linear' | 'conic');
            if (initialData.bgGradientColors !== undefined) setBgGradientColors(initialData.bgGradientColors as string[]);
            if (initialData.bgGradientAngle !== undefined) setBgGradientAngle(initialData.bgGradientAngle as number);
            if (initialData.bgGradientStops !== undefined) setBgGradientStops(initialData.bgGradientStops as Array<{color: string; position: number}>);
            if (initialData.qrOption !== undefined) setQrOption(initialData.qrOption as QROptionType);
            if (initialData.qrColor !== undefined) setQrColor(initialData.qrColor as string);
            if (initialData.qrGradientType !== undefined) setQrGradientType(initialData.qrGradientType as 'linear' | 'conic');
            if (initialData.qrGradientColors !== undefined) setQrGradientColors(initialData.qrGradientColors as string[]);
            if (initialData.qrGradientAngle !== undefined) setQrGradientAngle(initialData.qrGradientAngle as number);
            if (initialData.qrGradientStops !== undefined) setQrGradientStops(initialData.qrGradientStops as Array<{color: string; position: number}>);
            if (initialData.qrPalette !== undefined) setQrPalette(initialData.qrPalette as string[]);
            if (initialData.finderPatternOption !== undefined) setFinderPatternOption(initialData.finderPatternOption as 'same' | 'solid');
            if (initialData.finderPatternColor !== undefined) setFinderPatternColor(initialData.finderPatternColor as string);
            if (initialData.borderColor !== undefined) setBorderColor(initialData.borderColor as string);
            if (initialData.borderWidth !== undefined) setBorderWidth(initialData.borderWidth as number);
            if (initialData.canvasSize !== undefined) setCanvasSize(initialData.canvasSize as number);
            if (initialData.showText !== undefined) setShowText(initialData.showText as boolean);
            if (initialData.roundness !== undefined) setRoundness(initialData.roundness as number);
            if (initialData.finderRoundness !== undefined) setFinderRoundness(initialData.finderRoundness as number);
            if (initialData.opacityVariation !== undefined) setOpacityVariation(initialData.opacityVariation as number);
            if (initialData.rectScaleX !== undefined) setRectScaleX(initialData.rectScaleX as number);
            if (initialData.rectScaleY !== undefined) setRectScaleY(initialData.rectScaleY as number);
            if (initialData.scaleVariation !== undefined) setScaleVariation(initialData.scaleVariation as number);
            if (initialData.rectRotation !== undefined) setRectRotation(initialData.rectRotation as number);
            if (initialData.centerGapWidth !== undefined) setCenterGapWidth(initialData.centerGapWidth as number);
            if (initialData.centerGapHeight !== undefined) setCenterGapHeight(initialData.centerGapHeight as number);
            if (initialData.uploadedImageDataUrl !== undefined) setUploadedImageDataUrl(initialData.uploadedImageDataUrl as string | null);
            if (initialData.imageScale !== undefined) setImageScale(initialData.imageScale as number);
            if (initialData.qrCodeSize !== undefined) setQrCodeSize(initialData.qrCodeSize as number);
            if (initialData.qrTrimCircle !== undefined) setQrTrimCircle(initialData.qrTrimCircle as boolean);
            if (initialData.qrTrimCircleRadius !== undefined) setQrTrimCircleRadius(initialData.qrTrimCircleRadius as number);
            if (initialData.backgroundCoverage !== undefined) setBackgroundCoverage(initialData.backgroundCoverage as number);
            if (initialData.secondBorderEnabled !== undefined) setSecondBorderEnabled(initialData.secondBorderEnabled as boolean);
            if (initialData.secondBorderColor !== undefined) setSecondBorderColor(initialData.secondBorderColor as string);
            if (initialData.secondBorderRange !== undefined) setSecondBorderRange(initialData.secondBorderRange as [number, number]);
            if (initialData.borderTextEnabled !== undefined) setBorderTextEnabled(initialData.borderTextEnabled as boolean);
            if (initialData.textLine1 !== undefined) setTextLine1(initialData.textLine1 as string);
            if (initialData.textLine2 !== undefined) setTextLine2(initialData.textLine2 as string);
            if (initialData.numTextLines !== undefined) setNumTextLines(initialData.numTextLines as 1 | 2);
            if (initialData.fontFamily !== undefined) setFontFamily(initialData.fontFamily as string);
            if (initialData.fontSize !== undefined) setFontSize(initialData.fontSize as number);
            if (initialData.textColor !== undefined) setTextColor(initialData.textColor as string);
            if (initialData.fontWeight !== undefined) setFontWeight(initialData.fontWeight as string);
            if (initialData.letterSpacing !== undefined) setLetterSpacing(initialData.letterSpacing as number);
            if (initialData.condensed !== undefined) setCondensed(initialData.condensed as boolean);
            if (initialData.textPadding !== undefined) setTextPadding(initialData.textPadding as number);
            if (initialData.barsEnabled !== undefined) setBarsEnabled(initialData.barsEnabled as boolean);
            if (initialData.barsColor !== undefined) setBarsColor(initialData.barsColor as string);
            if (initialData.barsWidth !== undefined) setBarsWidth(initialData.barsWidth as number);
            if (initialData.barsGapDegrees !== undefined) setBarsGapDegrees(initialData.barsGapDegrees as number);
            if (initialData.barsRoundEnds !== undefined) setBarsRoundEnds(initialData.barsRoundEnds as boolean);
            if (initialData.barsRadiusOffset !== undefined) setBarsRadiusOffset(initialData.barsRadiusOffset as number);
        }
    }, [initialData]);

    // Update QR code text when enableTracking or relevant fields change
    useEffect(() => {
        if (initialData) {
            const newText = initialData.enableTracking && initialData.slug 
                ? `https://linkme.ltd/${initialData.slug}` 
                : (initialData.targetUrl as string) || text;
            if (newText !== text) {
                setText(newText);
            }
        }
    }, [initialData?.enableTracking, initialData?.slug, initialData?.targetUrl, initialData, text]);

    // -----------------------------
    //  HANDLERS
    // -----------------------------
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please upload a valid image file.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImageDataUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddQRColor = () => {
        if (qrPalette.length < 6) {
            setQrPalette([...qrPalette, '#000000']); // default color
        }
    };

    const handleSave = () => {
        if (!onSave) return;
        
        const designData = {
            text,
            bgOption,
            bgColor,
            bgGradientType,
            bgGradientColors,
            bgGradientAngle,
            bgGradientStops,
            qrOption,
            qrColor,
            qrGradientType,
            qrGradientColors,
            qrGradientAngle,
            qrGradientStops,
            qrPalette,
            finderPatternOption,
            finderPatternColor,
            borderColor,
            borderWidth,
            canvasSize,
            showText,
            roundness,
            finderRoundness,
            opacityVariation,
            rectScaleX,
            rectScaleY,
            scaleVariation,
            rectRotation,
            centerGapWidth,
            centerGapHeight,
            uploadedImageDataUrl,
            imageScale,
            qrCodeSize,
            qrTrimCircle,
            qrTrimCircleRadius,
            backgroundCoverage,
            secondBorderEnabled,
            secondBorderColor,
            secondBorderRange,
            borderTextEnabled,
            textLine1,
            textLine2,
            numTextLines,
            fontFamily,
            fontSize,
            textColor,
            fontWeight,
            letterSpacing,
            condensed,
            textPadding,
            barsEnabled,
            barsColor,
            barsWidth,
            barsGapDegrees,
            barsRoundEnds,
            barsRadiusOffset,
        };
        
        onSave(designData);
    };

    const handleExport = () => {
        if (!svgRef.current) return;

        const svgElement = svgRef.current.cloneNode(true) as SVGSVGElement;

        // If exporting to SVG, remove any <image> tags to avoid embedding
        if (exportFormat === 'svg') {
            const images = svgElement.getElementsByTagName('image');
            while (images.length > 0) {
                images[0].parentNode?.removeChild(images[0]);
            }
        }

        // Depending on exportComponent, remove undesired elements
        if (exportComponent !== 'full') {
            if (exportComponent === 'foreground') {
                const backgroundElements = svgElement.querySelectorAll(
                    '.backgroundRects, .circle-background, .borderText'
                );
                backgroundElements.forEach((el) => el.parentNode?.removeChild(el));
                const overlayImage = svgElement.querySelector('.overlayImage');
                if (overlayImage) {
                    overlayImage.parentNode?.removeChild(overlayImage);
                }
            } else if (exportComponent === 'background') {
                const qrElements = svgElement.querySelectorAll(
                    '.qrcode, .finderPatterns, .qrRects, .overlayImage, .finderBars'
                );
                qrElements.forEach((el) => el.parentNode?.removeChild(el));
            }
        }

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);

        if (exportFormat === 'svg') {
            const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            downloadURI(url, 'qrcode.svg');
            URL.revokeObjectURL(url);
        } else {
            const img = new Image();
            const canvas = document.createElement('canvas');
            canvas.width = exportResolution;
            canvas.height = exportResolution;
            const ctx = canvas.getContext('2d');

            img.onload = function () {
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = 'rgba(0,0,0,0)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const dataURL = canvas.toDataURL(
                        `image/${exportFormat}`,
                        exportFormat === 'png' ? undefined : 0.92
                    );
                    downloadURI(dataURL, `qrcode.${exportFormat}`);
                }
            };
            img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
        }
    };

    const downloadURI = (uri: string, name: string) => {
        const link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // -----------------------------
    //  RENDER
    // -----------------------------
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* QR Code Preview Section */}
                <div className="lg:w-1/2">
                    <Card className="p-6 bg-white shadow-lg aspect-square">
                        {/*<div className="flex justify-center drop-shadow-lg">*/}
                        <div className="flex justify-center drop-shadow">
                            {moduleSize && qrCodeSize && moduleCount && qrcode ? (
                                <CircularQRCode
                                    qrcode={qrcode}
                                    bgOption={bgOption}
                                    bgColor={bgColor}
                                    bgGradientType={bgGradientType}
                                    bgGradientColors={bgGradientColors}
                                    bgGradientAngle={bgGradientAngle}
                                    qrOption={qrOption}
                                    qrColor={qrColor}
                                    qrGradientType={qrGradientType}
                                    qrGradientColors={qrGradientColors}
                                    qrGradientAngle={qrGradientAngle}
                                    qrPalette={qrPalette}
                                    finderPatternOption={finderPatternOption}
                                    finderPatternColor={finderPatternColor}
                                    showText={showText}
                                    roundness={roundness}
                                    opacityVariation={opacityVariation}
                                    finderRoundness={finderRoundness}
                                    rectScaleX={rectScaleX}
                                    rectScaleY={rectScaleY}
                                    scaleVariation={scaleVariation}
                                    rectRotation={rectRotation}
                                    uploadedImageDataUrl={uploadedImageDataUrl}
                                    imageScale={imageScale}
                                    moduleSize={moduleSize}
                                    qrCodeSize={qrCodeSize}

                                    qrTrimCircle={qrTrimCircle}
                                    qrTrimCircleRadius={qrTrimCircleRadius}

                                    moduleCount={moduleCount}
                                    borderColor={borderColor}
                                    borderWidth={borderWidth}
                                    centerGapWidth={centerGapWidth}
                                    centerGapHeight={centerGapHeight}
                                    backgroundCoverage={backgroundCoverage}
                                    svgRef={svgRef}
                                    secondBorderEnabled={secondBorderEnabled}
                                    secondBorderColor={secondBorderColor}
                                    secondBorderRange={secondBorderRange}
                                    borderTextEnabled={borderTextEnabled}
                                    textLine1={textLine1}
                                    textLine2={textLine2}
                                    numTextLines={numTextLines}
                                    fontFamily={fontFamily}
                                    fontSize={fontSize}
                                    textColor={textColor}
                                    fontWeight={fontWeight}
                                    letterSpacing={letterSpacing}
                                    condensed={condensed}
                                    textPadding={textPadding}
                                    // canvasSize={canvasSize}
                                    canvasSize={700}
                                    barsEnabled={barsEnabled}
                                    barsColor={barsColor}
                                    barsWidth={barsWidth}
                                    barsGapDegrees={barsGapDegrees}
                                    barsRoundEnds={barsRoundEnds}
                                    barsRadiusOffset={barsRadiusOffset}

                                    bgGradientStops={bgGradientStops}
                                    qrGradientStops={qrGradientStops}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Tabs / Controls Section */}
                <div className="lg:w-1/2">
                    <Card className="bg-white shadow-lg">
                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-1">
                                <TabsTrigger value="basic" className="flex items-center gap-2">
                                    <Grid className="h-4 w-4" />
                                    <span className="hidden lg:inline">Basic</span>
                                </TabsTrigger>
                                <TabsTrigger value="style" className="flex items-center gap-2">
                                    <Palette className="h-4 w-4" />
                                    <span className="hidden lg:inline">Style</span>
                                </TabsTrigger>
                                <TabsTrigger value="pattern" className="flex items-center gap-2">
                                    <Square className="h-4 w-4" />
                                    <span className="hidden lg:inline">Pattern</span>
                                </TabsTrigger>
                                <TabsTrigger value="border" className="flex items-center gap-2">
                                    <CircleDot className="h-4 w-4" />
                                    <span className="hidden lg:inline">Border</span>
                                </TabsTrigger>
                                <TabsTrigger value="image" className="flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4" />
                                    <span className="hidden lg:inline">Image</span>
                                </TabsTrigger>
                                <TabsTrigger value="export" className="flex items-center gap-2">
                                    <Download className="h-4 w-4" />
                                    <span className="hidden lg:inline">Export</span>
                                </TabsTrigger>
                            </TabsList>

                            {/* -----------------------------
                  TAB CONTENT: BASIC
              ----------------------------- */}
                            <CardContent className="pt-6">
                                <TabsContent value="basic">
                                    <div className="space-y-4">
                                        {/* Text to encode */}
                                        <div className="space-y-2">
                                            <Label className="font-semibold">Text to encode</Label>
                                            <Input
                                                type="text"
                                                value={text}
                                                onChange={(e) => setText(e.target.value)}
                                                placeholder="Enter text or URL"
                                                className="w-full"
                                            />
                                        </div>

                                        {/* QR Code Size */}
                                        <div className="space-y-2">
                                            <Label className="font-semibold">QR Code Size</Label>
                                            <div className="flex items-center gap-4">
                                                <Slider
                                                    min={200}
                                                    max={canvasSize}
                                                    step={10}
                                                    value={[qrCodeSize]}
                                                    onValueChange={(value) => setQrCodeSize(value[0])}
                                                    className="flex-1"
                                                />
                                                <span className="w-16 text-right">{qrCodeSize}px</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-4">
                                            <Switch checked={qrTrimCircle} onCheckedChange={setQrTrimCircle} />
                                            <Label className="font-semibold cursor-pointer">
                                                QR code trim circle
                                            </Label>
                                        </div>


                                        {qrTrimCircle && (
                                            <div className="space-y-2">
                                                <Label className="font-semibold">QR code trim circle radius</Label>
                                                <div className="flex items-center gap-4">
                                                    <Slider
                                                        min={50}
                                                        max={600}
                                                        step={10}
                                                        value={[qrTrimCircleRadius]}
                                                        onValueChange={(value) => setQrTrimCircleRadius(value[0])}
                                                        className="flex-1"
                                                    />
                                                    <span className="w-16 text-right">{qrTrimCircleRadius}px</span>
                                                </div>
                                            </div>
                                        )}


                                    </div>
                                </TabsContent>

                                {/* -----------------------------
                  TAB CONTENT: STYLE
                ----------------------------- */}
                                <TabsContent value="style">
                                    <div className="space-y-6">
                                        {/* BACKGROUND OPTIONS */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-lg">Background</h3>

                                            {/* Option: Solid or Gradient */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        id="bgSolid"
                                                        name="bgOption"
                                                        value="solid"
                                                        checked={bgOption === 'solid'}
                                                        onChange={() => setBgOption('solid')}
                                                    />
                                                    <Label htmlFor="bgSolid" className="cursor-pointer">
                                                        Solid
                                                    </Label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        id="bgGradient"
                                                        name="bgOption"
                                                        value="gradient"
                                                        checked={bgOption === 'gradient'}
                                                        onChange={() => setBgOption('gradient')}
                                                    />
                                                    <Label htmlFor="bgGradient" className="cursor-pointer">
                                                        Gradient
                                                    </Label>
                                                </div>
                                            </div>

                                            {/* Solid */}
                                            {bgOption === 'solid' && (
                                                <div className="flex flex-col gap-2">
                                                    <Label>Background Color</Label>
                                                    <Input
                                                        type="color"
                                                        value={bgColor}
                                                        onChange={(e) => setBgColor(e.target.value)}
                                                        className="w-16 p-1"
                                                    />
                                                </div>
                                            )}

                                            {/* Gradient */}
                                            {bgOption === 'gradient' && (
                                                <div className="mt-2 space-y-4">
                                                    <div className="flex items-center mb-2">
                                                        <Label className="mr-2">Type:</Label>
                                                        <select
                                                            value={bgGradientType}
                                                            onChange={(e) =>
                                                                setBgGradientType(e.target.value as 'linear' | 'conic')
                                                            }
                                                            className="p-2 border rounded"
                                                        >
                                                            <option value="linear">Linear</option>
                                                            <option value="conic">Conic</option>
                                                        </select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Gradient Colors</Label>
                                                        <GradientPicker
                                                            stops={bgGradientStops}
                                                            onChange={setBgGradientStops}
                                                            className="w-full"
                                                        />
                                                    </div>

                                                    <div className="flex items-center mb-2 space-x-2">
                                                        <Label className="mr-2">Rotation Angle:</Label>
                                                        <Slider
                                                            min={0}
                                                            max={360}
                                                            step={1}
                                                            value={[bgGradientAngle]}
                                                            onValueChange={(value) => setBgGradientAngle(value[0])}
                                                            className="flex-1"
                                                        />
                                                        <span>{bgGradientAngle}°</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* QR CODE STYLE OPTIONS */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-lg">QR Code Style</h3>

                                            {/* Option: Solid, Gradient, or Multiple */}
                                            <div className="flex flex-wrap items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        id="qrSolid"
                                                        name="qrOption"
                                                        value="solid"
                                                        checked={qrOption === 'solid'}
                                                        onChange={() => setQrOption('solid')}
                                                    />
                                                    <Label htmlFor="qrSolid" className="cursor-pointer">
                                                        Solid
                                                    </Label>
                                                </div>
                                                {/*<div className="flex items-center gap-2">*/}
                                                {/*    <input*/}
                                                {/*        type="radio"*/}
                                                {/*        id="qrGradient"*/}
                                                {/*        name="qrOption"*/}
                                                {/*        value="gradient"*/}
                                                {/*        checked={qrOption === 'gradient'}*/}
                                                {/*        onChange={() => setQrOption('gradient')}*/}
                                                {/*    />*/}
                                                {/*    <Label htmlFor="qrGradient" className="cursor-pointer">*/}
                                                {/*        Gradient*/}
                                                {/*    </Label>*/}
                                                {/*</div>*/}
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        id="qrMultiple"
                                                        name="qrOption"
                                                        value="multiple"
                                                        checked={qrOption === 'multiple'}
                                                        onChange={() => setQrOption('multiple')}
                                                    />
                                                    <Label htmlFor="qrMultiple" className="cursor-pointer">
                                                        Multiple
                                                    </Label>
                                                </div>
                                            </div>

                                            {/* Solid */}
                                            {qrOption === 'solid' && (
                                                <div className="flex flex-col gap-2">
                                                    <Label>QR Color</Label>
                                                    <Input
                                                        type="color"
                                                        value={qrColor}
                                                        onChange={(e) => setQrColor(e.target.value)}
                                                        className="w-16 p-1"
                                                    />
                                                </div>
                                            )}

                                            {/* Gradient */}
                                            {/*{qrOption === 'gradient' && (*/}
                                            {/*    <div className="mt-2 space-y-4">*/}
                                            {/*        <div className="flex items-center mb-2">*/}
                                            {/*            <Label className="mr-2">Type:</Label>*/}
                                            {/*            <select*/}
                                            {/*                value={qrGradientType}*/}
                                            {/*                onChange={(e) =>*/}
                                            {/*                    setQrGradientType(e.target.value as 'linear' | 'conic')*/}
                                            {/*                }*/}
                                            {/*                className="p-2 border rounded"*/}
                                            {/*            >*/}
                                            {/*                <option value="linear">Linear</option>*/}
                                            {/*                <option value="conic">Conic</option>*/}
                                            {/*            </select>*/}
                                            {/*        </div>*/}

                                            {/*        <div className="space-y-2">*/}
                                            {/*            <Label>Gradient Colors</Label>*/}
                                            {/*            <GradientPicker*/}
                                            {/*                stops={qrGradientStops}*/}
                                            {/*                onChange={setQrGradientStops}*/}
                                            {/*                className="w-full"*/}
                                            {/*            />*/}
                                            {/*        </div>*/}
                                            {/*        */}
                                            {/*        <div className="flex items-center mb-2 space-x-2">*/}
                                            {/*            <Label className="mr-2">Rotation Angle:</Label>*/}
                                            {/*            <Slider*/}
                                            {/*                min={0}*/}
                                            {/*                max={360}*/}
                                            {/*                step={1}*/}
                                            {/*                value={[qrGradientAngle]}*/}
                                            {/*                onValueChange={(value) => setQrGradientAngle(value[0])}*/}
                                            {/*                className="flex-1"*/}
                                            {/*            />*/}
                                            {/*            <span>{qrGradientAngle}°</span>*/}
                                            {/*        </div>*/}
                                            {/*    </div>*/}
                                            {/*)}*/}

                                            {/* Multiple */}
                                            {qrOption === 'multiple' && (
                                                <div className="space-y-2">
                                                    {qrPalette.map((color, index) => (
                                                        <div className="flex items-center gap-2" key={index}>
                                                            <Label className="min-w-[70px]">Color {index + 1}:</Label>
                                                            <Input
                                                                type="color"
                                                                value={color}
                                                                onChange={(e) => {
                                                                    const newPalette = [...qrPalette];
                                                                    newPalette[index] = e.target.value;
                                                                    setQrPalette(newPalette);
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                    {qrPalette.length < 6 && (
                                                        <Button variant="outline" onClick={handleAddQRColor}>
                                                            Add Color
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* -----------------------------
                  TAB CONTENT: PATTERN
                ----------------------------- */}
                                <TabsContent value="pattern">
                                    <div className="space-y-6">
                                        {/* FINDER PATTERN COLOR */}
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-lg">Finder Pattern</h3>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        id="finderSame"
                                                        name="finderPattern"
                                                        value="same"
                                                        checked={finderPatternOption === 'same'}
                                                        onChange={() => setFinderPatternOption('same')}
                                                    />
                                                    <Label htmlFor="finderSame" className="cursor-pointer">
                                                        Same as QR
                                                    </Label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        id="finderSolid"
                                                        name="finderPattern"
                                                        value="solid"
                                                        checked={finderPatternOption === 'solid'}
                                                        onChange={() => setFinderPatternOption('solid')}
                                                    />
                                                    <Label htmlFor="finderSolid" className="cursor-pointer">
                                                        Solid Color
                                                    </Label>
                                                </div>
                                            </div>
                                            {finderPatternOption === 'solid' && (
                                                <div className="flex flex-col gap-2">
                                                    <Label>Finder Color</Label>
                                                    <Input
                                                        type="color"
                                                        value={finderPatternColor}
                                                        onChange={(e) => setFinderPatternColor(e.target.value)}
                                                        className="w-16 p-1"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* RECT SCALE */}
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-lg">Rect Scaling</h3>
                                            <div className="space-y-2">
                                                <Label>Scale X</Label>
                                                <div className="flex items-center gap-4">
                                                    <Slider
                                                        min={0.5}
                                                        max={1.0}
                                                        step={0.05}
                                                        value={[rectScaleX]}
                                                        onValueChange={(value) => setRectScaleX(value[0])}
                                                        className="flex-1"
                                                    />
                                                    <span className="w-16 text-right">{rectScaleX.toFixed(2)}x</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Scale Y</Label>
                                                <div className="flex items-center gap-4">
                                                    <Slider
                                                        min={0.5}
                                                        max={1.0}
                                                        step={0.05}
                                                        value={[rectScaleY]}
                                                        onValueChange={(value) => setRectScaleY(value[0])}
                                                        className="flex-1"
                                                    />
                                                    <span className="w-16 text-right">{rectScaleY.toFixed(2)}x</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SCALE VARIATION */}
                                        <div className="space-y-2">
                                            <Label className="font-semibold">Scale Variation</Label>
                                            <div className="flex items-center gap-4">
                                                <Slider
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    value={[scaleVariation]}
                                                    onValueChange={(value) => setScaleVariation(value[0])}
                                                    className="flex-1"
                                                />
                                                <span className="w-16 text-right">{scaleVariation}%</span>
                                            </div>
                                        </div>

                                        {/* RECT ROTATION */}
                                        <div className="space-y-2">
                                            <Label className="font-semibold">Rect Rotation (°)</Label>
                                            <div className="flex items-center gap-4">
                                                <Slider
                                                    min={0}
                                                    max={360}
                                                    step={5}
                                                    value={[rectRotation]}
                                                    onValueChange={(value) => setRectRotation(value[0])}
                                                    className="flex-1"
                                                />
                                                <span className="w-16 text-right">{rectRotation}°</span>
                                            </div>
                                        </div>

                                        {/* ROUNDNESS */}
                                        <div className="space-y-2">
                                            <Label className="font-semibold">Roundness</Label>
                                            <Slider
                                                min={0}
                                                max={100}
                                                step={1}
                                                value={[roundness]}
                                                onValueChange={(value) => setRoundness(value[0])}
                                            />
                                        </div>

                                        {/* FINDER PATTERN ROUNDNESS */}
                                        <div className="space-y-2">
                                            <Label className="font-semibold">Finder Pattern Roundness</Label>
                                            <Slider
                                                min={0}
                                                max={100}
                                                step={1}
                                                value={[finderRoundness]}
                                                onValueChange={(value) => setFinderRoundness(value[0])}
                                            />
                                        </div>

                                        {/* OPACITY VARIATION */}
                                        <div className="space-y-2">
                                            <Label className="font-semibold">Opacity Variation</Label>
                                            <Slider
                                                min={0}
                                                max={100}
                                                step={1}
                                                value={[opacityVariation]}
                                                onValueChange={(value) => setOpacityVariation(value[0])}
                                            />
                                        </div>

                                        {/* SHOW TEXT TOGGLE */}
                                        <div className="flex items-center gap-2 mt-4">
                                            <Switch checked={showText} onCheckedChange={setShowText} />
                                            <Label className="font-semibold cursor-pointer">
                                                Show Text Around QR Code
                                            </Label>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* -----------------------------
                  TAB CONTENT: BORDER
                ----------------------------- */}
                                <TabsContent value="border">
                                    <div className="space-y-6">
                                        {/* CANVAS SIZE */}
                                        {/*<div className="space-y-2">*/}
                                        {/*    <Label className="font-semibold">Canvas Size</Label>*/}
                                        {/*    <div className="flex items-center gap-4">*/}
                                        {/*        <Slider*/}
                                        {/*            min={500}*/}
                                        {/*            max={2000}*/}
                                        {/*            step={100}*/}
                                        {/*            value={[canvasSize]}*/}
                                        {/*            onValueChange={(value) => setCanvasSize(value[0])}*/}
                                        {/*            className="flex-1"*/}
                                        {/*        />*/}
                                        {/*        <span className="w-16 text-right">{canvasSize}px</span>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}

                                        {/* OUTER BORDER */}
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-lg">Outer Border</h3>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-4">
                                                    <Label>Color</Label>
                                                    <Input
                                                        type="color"
                                                        value={borderColor}
                                                        onChange={(e) => setBorderColor(e.target.value)}
                                                        className="w-16 p-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Width</Label>
                                                    <div className="flex items-center gap-4">
                                                        <Slider
                                                            min={0}
                                                            max={250}
                                                            step={1}
                                                            value={[borderWidth]}
                                                            onValueChange={(value) => setBorderWidth(value[0])}
                                                            className="flex-1"
                                                        />
                                                        <span className="w-16 text-right">{borderWidth}px</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECOND BORDER */}
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-lg">Second Border</h3>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={secondBorderEnabled}
                                                    onCheckedChange={setSecondBorderEnabled}
                                                />
                                                <Label className="font-semibold cursor-pointer">Enable Second Border</Label>
                                            </div>
                                            {secondBorderEnabled && (
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-4">
                                                        <Label>Color</Label>
                                                        <Input
                                                            type="color"
                                                            value={secondBorderColor}
                                                            onChange={(e) => setSecondBorderColor(e.target.value)}
                                                            className="w-16 p-1"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Coverage</Label>
                                                        <div className="flex items-center gap-4">
                                                            <Slider
                                                                min={0}
                                                                max={100}
                                                                step={1}
                                                                value={secondBorderRange}
                                                                onValueChange={(value) => {
                                                                    const sortedValue = [...value].sort((a, b) => a - b);
                                                                    setSecondBorderRange([sortedValue[0], sortedValue[1]]);
                                                                }}
                                                                className="flex-1"
                                                            />
                                                            <span className="w-32 text-right">
                                {secondBorderRange[0]}% - {secondBorderRange[1]}%
                              </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* TEXT ON BORDER */}
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-lg">Text on Border</h3>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={borderTextEnabled}
                                                    onCheckedChange={setBorderTextEnabled}
                                                />
                                                <Label className="font-semibold cursor-pointer">Enable Border Text</Label>
                                            </div>
                                            {borderTextEnabled && (
                                                <div className="space-y-4 mt-2">
                                                    {/* Number of Lines */}
                                                    <div>
                                                        <Label>Number of Lines</Label>
                                                        <select
                                                            value={numTextLines}
                                                            onChange={(e) => setNumTextLines(Number(e.target.value) as 1 | 2)}
                                                            className="p-2 border rounded"
                                                        >
                                                            <option value={1}>One Line</option>
                                                            <option value={2}>Two Lines</option>
                                                        </select>
                                                    </div>

                                                    {/* Text Lines */}
                                                    <div>
                                                        <Label>Text Line 1</Label>
                                                        <Input
                                                            type="text"
                                                            value={textLine1}
                                                            onChange={(e) => setTextLine1(e.target.value)}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    {numTextLines === 2 && (
                                                        <div>
                                                            <Label>Text Line 2</Label>
                                                            <Input
                                                                type="text"
                                                                value={textLine2}
                                                                onChange={(e) => setTextLine2(e.target.value)}
                                                                className="w-full"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Font Family */}
                                                    <div>
                                                        <Label>Font Family</Label>
                                                        <Input
                                                            type="text"
                                                            value={fontFamily}
                                                            onChange={(e) => setFontFamily(e.target.value)}
                                                        />
                                                    </div>

                                                    {/* Font Size */}
                                                    <div>
                                                        <Label>Font Size</Label>
                                                        <div className="flex items-center gap-4">
                                                            <Slider
                                                                min={10}
                                                                max={100}
                                                                step={1}
                                                                value={[fontSize]}
                                                                onValueChange={(value) => setFontSize(value[0])}
                                                                className="flex-1"
                                                            />
                                                            <span className="w-16 text-right">{fontSize}px</span>
                                                        </div>
                                                    </div>

                                                    {/* Font Weight */}
                                                    <div>
                                                        <Label>Font Weight</Label>
                                                        <select
                                                            value={fontWeight}
                                                            onChange={(e) => setFontWeight(e.target.value)}
                                                            className="p-2 border rounded"
                                                        >
                                                            <option value="normal">Normal</option>
                                                            <option value="bold">Bold</option>
                                                        </select>
                                                    </div>

                                                    {/* Letter Spacing */}
                                                    <div>
                                                        <Label>Letter Spacing</Label>
                                                        <div className="flex items-center gap-4">
                                                            <Slider
                                                                min={0}
                                                                max={20}
                                                                step={1}
                                                                value={[letterSpacing]}
                                                                onValueChange={(value) => setLetterSpacing(value[0])}
                                                                className="flex-1"
                                                            />
                                                            <span className="w-16 text-right">{letterSpacing}px</span>
                                                        </div>
                                                    </div>

                                                    {/* Condensed */}
                                                    <div className="flex items-center gap-2">
                                                        <Label>Condensed</Label>
                                                        <Switch
                                                            checked={condensed}
                                                            onCheckedChange={setCondensed}
                                                        />
                                                    </div>

                                                    {/* Text Padding */}
                                                    <div>
                                                        <Label>Text Padding</Label>
                                                        <div className="flex items-center gap-4">
                                                            <Slider
                                                                min={0}
                                                                max={50}
                                                                step={1}
                                                                value={[textPadding]}
                                                                onValueChange={(value) => setTextPadding(value[0])}
                                                                className="flex-1"
                                                            />
                                                            <span className="w-16 text-right">{textPadding}px</span>
                                                        </div>
                                                    </div>

                                                    {/* Text Color */}
                                                    <div>
                                                        <Label>Text Color</Label>
                                                        <Input
                                                            type="color"
                                                            value={textColor}
                                                            onChange={(e) => setTextColor(e.target.value)}
                                                            className="w-16 p-1"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* -----------------------------
                  TAB CONTENT: IMAGE
                ----------------------------- */}
                                <TabsContent value="image">
                                    <div className="space-y-6">
                                        {/* CENTER GAP */}
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-lg">Center Gap</h3>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Label className="min-w-[60px]">Width</Label>
                                                    <Input
                                                        type="number"
                                                        value={centerGapWidth}
                                                        onChange={(e) =>
                                                            setCenterGapWidth(
                                                                Math.max(0, Math.min(qrCodeSize || 1000, Number(e.target.value)))
                                                            )
                                                        }
                                                        min={0}
                                                        max={qrCodeSize || 1000}
                                                        className="w-24"
                                                    />
                                                    <span>px</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Label className="min-w-[60px]">Height</Label>
                                                    <Input
                                                        type="number"
                                                        value={centerGapHeight}
                                                        onChange={(e) =>
                                                            setCenterGapHeight(
                                                                Math.max(0, Math.min(qrCodeSize || 1000, Number(e.target.value)))
                                                            )
                                                        }
                                                        min={0}
                                                        max={qrCodeSize || 1000}
                                                        className="w-24"
                                                    />
                                                    <span>px</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* BACKGROUND COVERAGE */}
                                        <div className="space-y-2">
                                            <Label className="font-semibold">Background Coverage</Label>
                                            <div className="flex items-center gap-4">
                                                <Slider
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    value={[backgroundCoverage]}
                                                    onValueChange={(value) => setBackgroundCoverage(value[0])}
                                                    className="flex-1"
                                                />
                                                <span className="w-16 text-right">{backgroundCoverage}%</span>
                                            </div>
                                        </div>

                                        {/* IMAGE UPLOAD */}
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-lg">Center Image</h3>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                            {uploadedImageDataUrl && (
                                                <div className="mt-2">
                                                    <Label className="font-semibold">Image Scale</Label>
                                                    <div className="flex items-center gap-4">
                                                        <Slider
                                                            min={0.1}
                                                            max={2}
                                                            step={0.1}
                                                            value={[imageScale]}
                                                            onValueChange={(value) => setImageScale(value[0])}
                                                            className="flex-1"
                                                        />
                                                        <span className="w-16 text-right">
                              {(imageScale * 100).toFixed(0)}%
                            </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* CIRCULAR BARS */}
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-lg">Circular Bars</h3>
                                            <div className="flex items-center gap-2">
                                                <Switch checked={barsEnabled} onCheckedChange={setBarsEnabled} />
                                                <Label className="font-semibold cursor-pointer">Enable Bars</Label>
                                            </div>
                                            {barsEnabled && (
                                                <div className="space-y-4 mt-2">
                                                    <div className="flex items-center gap-4">
                                                        <Label>Color</Label>
                                                        <Input
                                                            type="color"
                                                            value={barsColor}
                                                            onChange={(e) => setBarsColor(e.target.value)}
                                                            className="w-16 p-1"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Width</Label>
                                                        <div className="flex items-center gap-4">
                                                            <Slider
                                                                min={1}
                                                                max={50}
                                                                step={1}
                                                                value={[barsWidth]}
                                                                onValueChange={(value) => setBarsWidth(value[0])}
                                                                className="flex-1"
                                                            />
                                                            <span className="w-16 text-right">{barsWidth}px</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label>Gap (Degrees)</Label>
                                                        <div className="flex items-center gap-4">
                                                            <Slider
                                                                min={0}
                                                                max={30}
                                                                step={1}
                                                                value={[barsGapDegrees]}
                                                                onValueChange={(value) => setBarsGapDegrees(value[0])}
                                                                className="flex-1"
                                                            />
                                                            <span className="w-16 text-right">{barsGapDegrees}°</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Label>Round Ends</Label>
                                                        <Switch
                                                            checked={barsRoundEnds}
                                                            onCheckedChange={setBarsRoundEnds}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Radius Offset</Label>
                                                        <div className="flex items-center gap-4">
                                                            <Slider
                                                                min={0}
                                                                max={100}
                                                                step={5}
                                                                value={[barsRadiusOffset]}
                                                                onValueChange={(value) => setBarsRadiusOffset(value[0])}
                                                                className="flex-1"
                                                            />
                                                            <span className="w-16 text-right">{barsRadiusOffset}px</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* -----------------------------
                  TAB CONTENT: EXPORT
                ----------------------------- */}
                                <TabsContent value="export">
                                    <div className="space-y-6">
                                        {/* EXPORT OPTIONS */}
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Format */}
                                                <div className="space-y-2">
                                                    <Label className="font-semibold">Format</Label>
                                                    <select
                                                        value={exportFormat}
                                                        onChange={(e) =>
                                                            setExportFormat(e.target.value as 'png' | 'webp' | 'svg')
                                                        }
                                                        className="w-full p-2 border rounded"
                                                    >
                                                        <option value="png">PNG</option>
                                                        <option value="webp">WEBP</option>
                                                        <option value="svg">SVG</option>
                                                    </select>
                                                </div>

                                                {/* Resolution */}
                                                <div className="space-y-2">
                                                    <Label className="font-semibold">Resolution (px)</Label>
                                                    <Input
                                                        type="number"
                                                        value={exportResolution}
                                                        onChange={(e) =>
                                                            setExportResolution(
                                                                Math.min(2560, Math.max(256, parseInt(e.target.value) || 1024))
                                                            )
                                                        }
                                                        min={256}
                                                        max={2560}
                                                        className="w-full"
                                                    />
                                                </div>
                                            </div>

                                            {/* Component (only for PNG/WEBP) */}
                                            {(exportFormat === 'png' || exportFormat === 'webp') && (
                                                <div className="space-y-2">
                                                    <Label className="font-semibold">Component</Label>
                                                    <select
                                                        value={exportComponent}
                                                        onChange={(e) =>
                                                            setExportComponent(e.target.value as 'full' | 'foreground' | 'background')
                                                        }
                                                        className="w-full p-2 border rounded"
                                                    >
                                                        <option value="full">Full</option>
                                                        <option value="foreground">Foreground Only</option>
                                                        <option value="background">Background Only</option>
                                                    </select>
                                                </div>
                                            )}

                                            {onSave && (
                                                <Button
                                                    onClick={handleSave}
                                                    disabled={saving}
                                                    className="w-full bg-green-500 hover:bg-green-600 text-white mt-2"
                                                >
                                                    <Save className="w-4 h-4 mr-2" />
                                                    {saving ? 'Saving...' : (isEditing ? 'Update QR Code' : 'Save QR Code')}
                                                </Button>
                                            )}

                                            <Button
                                                onClick={handleExport}
                                                className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-2"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Export QR Code
                                            </Button>
                                        </div>
                                    </div>
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default QRCodeGenerator;

// import React, { useEffect, useRef, useState } from 'react';
// import QRCode from 'qrcode-generator';

// // UI components (adjust import paths as needed)
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Slider } from '@/components/ui/slider';
// import { Switch } from '@/components/ui/switch';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { GradientPicker } from '@/components/GradientPicker'

// // Lucide icons
// import {
//     Palette,
//     Image as ImageIcon,
//     Square,
//     CircleDot,
//     Download,
//     Grid,
//     Save,
//     Sparkles,
//     Settings,
//     Type,
//     Upload,
// } from 'lucide-react';

// // Import your custom CircularQRCode component
// import CircularQRCode from './CircularQRCode';

// // -----------------------------
// //  TYPE DEFINITIONS
// // -----------------------------
// type QROptionType = 'solid' | 'gradient' | 'multiple';

// interface QRCodeGeneratorProps {
//   initialData?: Record<string, unknown>;
//   onSave?: (designData: Record<string, unknown>) => void;
//   saving?: boolean;
//   isEditing?: boolean;
// }

// // -----------------------------
// //  QR CODE GENERATOR COMPONENT
// // -----------------------------
// const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
//   initialData, 
//   onSave, 
//   saving = false, 
//   isEditing = false 
// }) => {
//     // -----------------------------
//     //  STATE VARIABLES
//     // -----------------------------
//     const [text, setText] = useState('https://example.com/');

//     // Background customization
//     const [bgOption, setBgOption] = useState<'solid' | 'gradient'>('solid');
//     const [bgColor, setBgColor] = useState('#FFFFFF');
//     const [bgGradientType, setBgGradientType] = useState<'linear' | 'conic'>('linear');
//     const [bgGradientColors, setBgGradientColors] = useState<string[]>(['#FFFFFF', '#FFFFFF']);
//     const [bgGradientAngle, setBgGradientAngle] = useState(0);

//     // **New**: Full gradient stops for background
//     const [bgGradientStops, setBgGradientStops] = useState([
//         { color: '#000000', position: 0 },
//         { color: '#000000', position: 100 },
//     ]);

//     // QR code customization
//     const [qrOption, setQrOption] = useState<QROptionType>('solid');
//     const [qrColor, setQrColor] = useState('#000000');
//     const [qrGradientType, setQrGradientType] = useState<'linear' | 'conic'>('linear');
//     const [qrGradientColors, setQrGradientColors] = useState<string[]>(['#000000', '#000000']);
//     const [qrGradientAngle, setQrGradientAngle] = useState(0);

//     // **New**: Full gradient stops for QR code
//     const [qrGradientStops, setQrGradientStops] = useState([
//         { color: '#000000', position: 0 },
//         { color: '#000000', position: 100 },
//     ]);

//     // Multiple-colors palette
//     const [qrPalette, setQrPalette] = useState<string[]>(['#000000']);

//     // Finder pattern color logic
//     const [finderPatternOption, setFinderPatternOption] = useState<'same' | 'solid'>('same');
//     const [finderPatternColor, setFinderPatternColor] = useState('#000000');

//     // Outer border customization
//     const [borderColor, setBorderColor] = useState('#000000');
//     const [borderWidth, setBorderWidth] = useState(10);
//     const [canvasSize, setCanvasSize] = useState<number>(1000);

//     // Additional customization
//     const [showText, setShowText] = useState(true);
//     const [roundness, setRoundness] = useState(0);
//     const [finderRoundness, setFinderRoundness] = useState(0);
//     const [opacityVariation, setOpacityVariation] = useState(0);

//     // Rect scaling
//     const [rectScaleX, setRectScaleX] = useState(1.0);
//     const [rectScaleY, setRectScaleY] = useState(1.0);

//     // Scale variation
//     const [scaleVariation, setScaleVariation] = useState(0);

//     // Rect rotation
//     const [rectRotation, setRectRotation] = useState(0);

//     // Center gap
//     const [centerGapWidth, setCenterGapWidth] = useState(0);
//     const [centerGapHeight, setCenterGapHeight] = useState(0);

//     // Image upload
//     const [uploadedImageDataUrl, setUploadedImageDataUrl] = useState<string | null>(null);
//     const [imageScale, setImageScale] = useState(1);

//     // QR code info
//     const [moduleSize, setModuleSize] = useState<number | null>(null);
//     const [qrCodeSize, setQrCodeSize] = useState<number>(470);
//     const [qrTrimCircle, setQrTrimCircle] = useState(false);
//     const [qrTrimCircleRadius, setQrTrimCircleRadius] = useState<number>(300);
//     const [moduleCount, setModuleCount] = useState<number | null>(null);
//     const [qrcode, setQrcode] = useState<any>(null);

//     // Export options
//     const [exportResolution, setExportResolution] = useState(1024);
//     const [exportFormat, setExportFormat] = useState<'png' | 'webp' | 'svg'>('png');
//     const [exportComponent, setExportComponent] = useState<'full' | 'foreground' | 'background'>(
//         'full'
//     );

//     // Background coverage
//     const [backgroundCoverage, setBackgroundCoverage] = useState(100);

//     // Second border
//     const [secondBorderEnabled, setSecondBorderEnabled] = useState(false);
//     const [secondBorderColor, setSecondBorderColor] = useState('#FF0000');
//     const [secondBorderRange, setSecondBorderRange] = useState<[number, number]>([0, 100]);

//     // Text on Border
//     const [borderTextEnabled, setBorderTextEnabled] = useState(false);
//     const [textLine1, setTextLine1] = useState('');
//     const [textLine2, setTextLine2] = useState('');
//     const [numTextLines, setNumTextLines] = useState<1 | 2>(1);
//     const [fontFamily, setFontFamily] = useState('Arial');
//     const [fontSize, setFontSize] = useState(20);
//     const [textColor, setTextColor] = useState('#000000');
//     const [fontWeight, setFontWeight] = useState('normal');
//     const [letterSpacing, setLetterSpacing] = useState(0);
//     const [condensed, setCondensed] = useState(false);
//     const [textPadding, setTextPadding] = useState(10);

//     // Bars
//     const [barsEnabled, setBarsEnabled] = useState(false);
//     const [barsColor, setBarsColor] = useState('#FF0000');
//     const [barsWidth, setBarsWidth] = useState(10);
//     const [barsGapDegrees, setBarsGapDegrees] = useState(5);
//     const [barsRoundEnds, setBarsRoundEnds] = useState(false);
//     const [barsRadiusOffset, setBarsRadiusOffset] = useState(20);

//     const svgRef = useRef<SVGSVGElement>(null);

//     // -----------------------------
//     //  EFFECTS
//     // -----------------------------
//     useEffect(() => {
//         const errorCorrectionLevel = 'H';
//         const qrcodeLocal = QRCode(0, errorCorrectionLevel);
//         qrcodeLocal.addData(text);
//         qrcodeLocal.make();

//         setQrcode(qrcodeLocal);

//         const moduleCountLocal = qrcodeLocal.getModuleCount();
//         setModuleCount(moduleCountLocal);

//         const moduleSizeLocal = qrCodeSize / moduleCountLocal;
//         setModuleSize(moduleSizeLocal);
//     }, [text, qrCodeSize]);

//     // Update the background gradient colors whenever stops change
//     useEffect(() => {
//         setBgGradientColors(bgGradientStops.map((stop) => stop.color));
//     }, [bgGradientStops]);

//     // Update the QR gradient colors whenever stops change
//     useEffect(() => {
//         setQrGradientColors(qrGradientStops.map((stop) => stop.color));
//     }, [qrGradientStops]);

//     // Initialize state from initialData prop
//     useEffect(() => {
//         if (initialData) {
//             if (initialData.text !== undefined) setText(initialData.text as string);
//             if (initialData.bgOption !== undefined) setBgOption(initialData.bgOption as 'solid' | 'gradient');
//             if (initialData.bgColor !== undefined) setBgColor(initialData.bgColor as string);
//             if (initialData.bgGradientType !== undefined) setBgGradientType(initialData.bgGradientType as 'linear' | 'conic');
//             if (initialData.bgGradientColors !== undefined) setBgGradientColors(initialData.bgGradientColors as string[]);
//             if (initialData.bgGradientAngle !== undefined) setBgGradientAngle(initialData.bgGradientAngle as number);
//             if (initialData.bgGradientStops !== undefined) setBgGradientStops(initialData.bgGradientStops as Array<{color: string; position: number}>);
//             if (initialData.qrOption !== undefined) setQrOption(initialData.qrOption as QROptionType);
//             if (initialData.qrColor !== undefined) setQrColor(initialData.qrColor as string);
//             if (initialData.qrGradientType !== undefined) setQrGradientType(initialData.qrGradientType as 'linear' | 'conic');
//             if (initialData.qrGradientColors !== undefined) setQrGradientColors(initialData.qrGradientColors as string[]);
//             if (initialData.qrGradientAngle !== undefined) setQrGradientAngle(initialData.qrGradientAngle as number);
//             if (initialData.qrGradientStops !== undefined) setQrGradientStops(initialData.qrGradientStops as Array<{color: string; position: number}>);
//             if (initialData.qrPalette !== undefined) setQrPalette(initialData.qrPalette as string[]);
//             if (initialData.finderPatternOption !== undefined) setFinderPatternOption(initialData.finderPatternOption as 'same' | 'solid');
//             if (initialData.finderPatternColor !== undefined) setFinderPatternColor(initialData.finderPatternColor as string);
//             if (initialData.borderColor !== undefined) setBorderColor(initialData.borderColor as string);
//             if (initialData.borderWidth !== undefined) setBorderWidth(initialData.borderWidth as number);
//             if (initialData.canvasSize !== undefined) setCanvasSize(initialData.canvasSize as number);
//             if (initialData.showText !== undefined) setShowText(initialData.showText as boolean);
//             if (initialData.roundness !== undefined) setRoundness(initialData.roundness as number);
//             if (initialData.finderRoundness !== undefined) setFinderRoundness(initialData.finderRoundness as number);
//             if (initialData.opacityVariation !== undefined) setOpacityVariation(initialData.opacityVariation as number);
//             if (initialData.rectScaleX !== undefined) setRectScaleX(initialData.rectScaleX as number);
//             if (initialData.rectScaleY !== undefined) setRectScaleY(initialData.rectScaleY as number);
//             if (initialData.scaleVariation !== undefined) setScaleVariation(initialData.scaleVariation as number);
//             if (initialData.rectRotation !== undefined) setRectRotation(initialData.rectRotation as number);
//             if (initialData.centerGapWidth !== undefined) setCenterGapWidth(initialData.centerGapWidth as number);
//             if (initialData.centerGapHeight !== undefined) setCenterGapHeight(initialData.centerGapHeight as number);
//             if (initialData.uploadedImageDataUrl !== undefined) setUploadedImageDataUrl(initialData.uploadedImageDataUrl as string | null);
//             if (initialData.imageScale !== undefined) setImageScale(initialData.imageScale as number);
//             if (initialData.qrCodeSize !== undefined) setQrCodeSize(initialData.qrCodeSize as number);
//             if (initialData.qrTrimCircle !== undefined) setQrTrimCircle(initialData.qrTrimCircle as boolean);
//             if (initialData.qrTrimCircleRadius !== undefined) setQrTrimCircleRadius(initialData.qrTrimCircleRadius as number);
//             if (initialData.backgroundCoverage !== undefined) setBackgroundCoverage(initialData.backgroundCoverage as number);
//             if (initialData.secondBorderEnabled !== undefined) setSecondBorderEnabled(initialData.secondBorderEnabled as boolean);
//             if (initialData.secondBorderColor !== undefined) setSecondBorderColor(initialData.secondBorderColor as string);
//             if (initialData.secondBorderRange !== undefined) setSecondBorderRange(initialData.secondBorderRange as [number, number]);
//             if (initialData.borderTextEnabled !== undefined) setBorderTextEnabled(initialData.borderTextEnabled as boolean);
//             if (initialData.textLine1 !== undefined) setTextLine1(initialData.textLine1 as string);
//             if (initialData.textLine2 !== undefined) setTextLine2(initialData.textLine2 as string);
//             if (initialData.numTextLines !== undefined) setNumTextLines(initialData.numTextLines as 1 | 2);
//             if (initialData.fontFamily !== undefined) setFontFamily(initialData.fontFamily as string);
//             if (initialData.fontSize !== undefined) setFontSize(initialData.fontSize as number);
//             if (initialData.textColor !== undefined) setTextColor(initialData.textColor as string);
//             if (initialData.fontWeight !== undefined) setFontWeight(initialData.fontWeight as string);
//             if (initialData.letterSpacing !== undefined) setLetterSpacing(initialData.letterSpacing as number);
//             if (initialData.condensed !== undefined) setCondensed(initialData.condensed as boolean);
//             if (initialData.textPadding !== undefined) setTextPadding(initialData.textPadding as number);
//             if (initialData.barsEnabled !== undefined) setBarsEnabled(initialData.barsEnabled as boolean);
//             if (initialData.barsColor !== undefined) setBarsColor(initialData.barsColor as string);
//             if (initialData.barsWidth !== undefined) setBarsWidth(initialData.barsWidth as number);
//             if (initialData.barsGapDegrees !== undefined) setBarsGapDegrees(initialData.barsGapDegrees as number);
//             if (initialData.barsRoundEnds !== undefined) setBarsRoundEnds(initialData.barsRoundEnds as boolean);
//             if (initialData.barsRadiusOffset !== undefined) setBarsRadiusOffset(initialData.barsRadiusOffset as number);
//         }
//     }, [initialData]);

//     // Update QR code text when enableTracking or relevant fields change
//     useEffect(() => {
//         if (initialData) {
//             const newText = initialData.enableTracking && initialData.slug 
//                 ? `https://linkme.ltd/${initialData.slug}` 
//                 : (initialData.targetUrl as string) || text;
//             if (newText !== text) {
//                 setText(newText);
//             }
//         }
//     }, [initialData?.enableTracking, initialData?.slug, initialData?.targetUrl, initialData, text]);

//     // -----------------------------
//     //  HANDLERS
//     // -----------------------------
//     const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (file) {
//             if (!file.type.startsWith('image/')) {
//                 alert('Please upload a valid image file.');
//                 return;
//             }
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 setUploadedImageDataUrl(e.target?.result as string);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleAddQRColor = () => {
//         if (qrPalette.length < 6) {
//             setQrPalette([...qrPalette, '#000000']); // default color
//         }
//     };

//     const handleSave = () => {
//         if (!onSave) return;
        
//         const designData = {
//             text,
//             bgOption,
//             bgColor,
//             bgGradientType,
//             bgGradientColors,
//             bgGradientAngle,
//             bgGradientStops,
//             qrOption,
//             qrColor,
//             qrGradientType,
//             qrGradientColors,
//             qrGradientAngle,
//             qrGradientStops,
//             qrPalette,
//             finderPatternOption,
//             finderPatternColor,
//             borderColor,
//             borderWidth,
//             canvasSize,
//             showText,
//             roundness,
//             finderRoundness,
//             opacityVariation,
//             rectScaleX,
//             rectScaleY,
//             scaleVariation,
//             rectRotation,
//             centerGapWidth,
//             centerGapHeight,
//             uploadedImageDataUrl,
//             imageScale,
//             qrCodeSize,
//             qrTrimCircle,
//             qrTrimCircleRadius,
//             backgroundCoverage,
//             secondBorderEnabled,
//             secondBorderColor,
//             secondBorderRange,
//             borderTextEnabled,
//             textLine1,
//             textLine2,
//             numTextLines,
//             fontFamily,
//             fontSize,
//             textColor,
//             fontWeight,
//             letterSpacing,
//             condensed,
//             textPadding,
//             barsEnabled,
//             barsColor,
//             barsWidth,
//             barsGapDegrees,
//             barsRoundEnds,
//             barsRadiusOffset,
//         };
        
//         onSave(designData);
//     };

//     const handleExport = () => {
//         if (!svgRef.current) return;

//         const svgElement = svgRef.current.cloneNode(true) as SVGSVGElement;

//         // If exporting to SVG, remove any <image> tags to avoid embedding
//         if (exportFormat === 'svg') {
//             const images = svgElement.getElementsByTagName('image');
//             while (images.length > 0) {
//                 images[0].parentNode?.removeChild(images[0]);
//             }
//         }

//         // Depending on exportComponent, remove undesired elements
//         if (exportComponent !== 'full') {
//             if (exportComponent === 'foreground') {
//                 const backgroundElements = svgElement.querySelectorAll(
//                     '.backgroundRects, .circle-background, .borderText'
//                 );
//                 backgroundElements.forEach((el) => el.parentNode?.removeChild(el));
//                 const overlayImage = svgElement.querySelector('.overlayImage');
//                 if (overlayImage) {
//                     overlayImage.parentNode?.removeChild(overlayImage);
//                 }
//             } else if (exportComponent === 'background') {
//                 const qrElements = svgElement.querySelectorAll(
//                     '.qrcode, .finderPatterns, .qrRects, .overlayImage, .finderBars'
//                 );
//                 qrElements.forEach((el) => el.parentNode?.removeChild(el));
//             }
//         }

//         const serializer = new XMLSerializer();
//         const svgString = serializer.serializeToString(svgElement);

//         if (exportFormat === 'svg') {
//             const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
//             const url = URL.createObjectURL(blob);
//             downloadURI(url, 'qrcode.svg');
//             URL.revokeObjectURL(url);
//         } else {
//             const img = new Image();
//             const canvas = document.createElement('canvas');
//             canvas.width = exportResolution;
//             canvas.height = exportResolution;
//             const ctx = canvas.getContext('2d');

//             img.onload = function () {
//                 if (ctx) {
//                     ctx.clearRect(0, 0, canvas.width, canvas.height);
//                     ctx.fillStyle = 'rgba(0,0,0,0)';
//                     ctx.fillRect(0, 0, canvas.width, canvas.height);
//                     ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//                     const dataURL = canvas.toDataURL(
//                         `image/${exportFormat}`,
//                         exportFormat === 'png' ? undefined : 0.92
//                     );
//                     downloadURI(dataURL, `qrcode.${exportFormat}`);
//                 }
//             };
//             img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
//         }
//     };

//     const downloadURI = (uri: string, name: string) => {
//         const link = document.createElement('a');
//         link.download = name;
//         link.href = uri;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     // Custom styled components
//     const SectionCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
//         <div className={`bg-gray-50/50 dark:bg-gray-900/20 rounded-xl p-5 space-y-4 ${className}`}>
//             {children}
//         </div>
//     );

//     const ColorInput = ({ value, onChange, label }: { value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, label?: string }) => (
//         <div className="flex items-center gap-3">
//             {label && <Label className="text-sm font-medium">{label}</Label>}
//             <div className="relative">
//                 <Input
//                     type="color"
//                     value={value}
//                     onChange={onChange}
//                     className="w-12 h-12 p-1 cursor-pointer rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
//                 />
//                 <div 
//                     className="absolute inset-1 rounded-md pointer-events-none"
//                     style={{ backgroundColor: value }}
//                 />
//             </div>
//             <span className="text-sm text-gray-500 font-mono">{value}</span>
//         </div>
//     );

//     // -----------------------------
//     //  RENDER
//     // -----------------------------
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
//             {/* Header */}
//             <div className="container mx-auto pt-8 pb-4 px-4">
//                 <div className="text-center mb-8">
//                     <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent mb-2">
//                         QR Code Designer
//                     </h1>
//                     <p className="text-gray-600 dark:text-gray-400 text-lg">
//                         Create beautiful, customizable QR codes for your brand
//                     </p>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="container mx-auto pb-8 px-4">
//                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//                     {/* QR Code Preview Section */}
//                     <div>
//                         <Card className="overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50 shadow-2xl">
//                             <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-950 p-8">
//                                 <div className="relative">
//                                     <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl" />
//                                     <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl">
//                                         <div className="flex justify-center">
//                                             {moduleSize && qrCodeSize && moduleCount && qrcode ? (
//                                                 <div className="transition-all duration-500 hover:scale-105">
//                                                     <CircularQRCode
//                                                         qrcode={qrcode}
//                                                         bgOption={bgOption}
//                                                         bgColor={bgColor}
//                                                         bgGradientType={bgGradientType}
//                                                         bgGradientColors={bgGradientColors}
//                                                         bgGradientAngle={bgGradientAngle}
//                                                         qrOption={qrOption}
//                                                         qrColor={qrColor}
//                                                         qrGradientType={qrGradientType}
//                                                         qrGradientColors={qrGradientColors}
//                                                         qrGradientAngle={qrGradientAngle}
//                                                         qrPalette={qrPalette}
//                                                         finderPatternOption={finderPatternOption}
//                                                         finderPatternColor={finderPatternColor}
//                                                         showText={showText}
//                                                         roundness={roundness}
//                                                         opacityVariation={opacityVariation}
//                                                         finderRoundness={finderRoundness}
//                                                         rectScaleX={rectScaleX}
//                                                         rectScaleY={rectScaleY}
//                                                         scaleVariation={scaleVariation}
//                                                         rectRotation={rectRotation}
//                                                         uploadedImageDataUrl={uploadedImageDataUrl}
//                                                         imageScale={imageScale}
//                                                         moduleSize={moduleSize}
//                                                         qrCodeSize={qrCodeSize}
//                                                         qrTrimCircle={qrTrimCircle}
//                                                         qrTrimCircleRadius={qrTrimCircleRadius}
//                                                         moduleCount={moduleCount}
//                                                         borderColor={borderColor}
//                                                         borderWidth={borderWidth}
//                                                         centerGapWidth={centerGapWidth}
//                                                         centerGapHeight={centerGapHeight}
//                                                         backgroundCoverage={backgroundCoverage}
//                                                         svgRef={svgRef}
//                                                         secondBorderEnabled={secondBorderEnabled}
//                                                         secondBorderColor={secondBorderColor}
//                                                         secondBorderRange={secondBorderRange}
//                                                         borderTextEnabled={borderTextEnabled}
//                                                         textLine1={textLine1}
//                                                         textLine2={textLine2}
//                                                         numTextLines={numTextLines}
//                                                         fontFamily={fontFamily}
//                                                         fontSize={fontSize}
//                                                         textColor={textColor}
//                                                         fontWeight={fontWeight}
//                                                         letterSpacing={letterSpacing}
//                                                         condensed={condensed}
//                                                         textPadding={textPadding}
//                                                         canvasSize={700}
//                                                         barsEnabled={barsEnabled}
//                                                         barsColor={barsColor}
//                                                         barsWidth={barsWidth}
//                                                         barsGapDegrees={barsGapDegrees}
//                                                         barsRoundEnds={barsRoundEnds}
//                                                         barsRadiusOffset={barsRadiusOffset}
//                                                         bgGradientStops={bgGradientStops}
//                                                         qrGradientStops={qrGradientStops}
//                                                     />
//                                                 </div>
//                                             ) : (
//                                                 <div className="flex items-center justify-center h-64">
//                                                     <div className="relative">
//                                                         <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500"></div>
//                                                         <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-blue-500 animate-pulse" />
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </Card>
//                     </div>

//                     {/* Controls Section */}
//                     <div>
//                         <Card className="overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50 shadow-2xl">
//                             <Tabs defaultValue="basic" className="w-full">
//                                 <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
//                                     <TabsList className="w-full h-auto p-1 bg-transparent grid grid-cols-3 lg:grid-cols-6 gap-1">
//                                         <TabsTrigger 
//                                             value="basic" 
//                                             className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-lg px-3 py-2.5 transition-all"
//                                         >
//                                             <Grid className="h-4 w-4 mr-2" />
//                                             <span className="hidden sm:inline">Basic</span>
//                                         </TabsTrigger>
//                                         <TabsTrigger 
//                                             value="style"
//                                             className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-lg px-3 py-2.5 transition-all"
//                                         >
//                                             <Palette className="h-4 w-4 mr-2" />
//                                             <span className="hidden sm:inline">Style</span>
//                                         </TabsTrigger>
//                                         <TabsTrigger 
//                                             value="pattern"
//                                             className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-lg px-3 py-2.5 transition-all"
//                                         >
//                                             <Square className="h-4 w-4 mr-2" />
//                                             <span className="hidden sm:inline">Pattern</span>
//                                         </TabsTrigger>
//                                         <TabsTrigger 
//                                             value="border"
//                                             className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-lg px-3 py-2.5 transition-all"
//                                         >
//                                             <CircleDot className="h-4 w-4 mr-2" />
//                                             <span className="hidden sm:inline">Border</span>
//                                         </TabsTrigger>
//                                         <TabsTrigger 
//                                             value="image"
//                                             className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-lg px-3 py-2.5 transition-all"
//                                         >
//                                             <ImageIcon className="h-4 w-4 mr-2" />
//                                             <span className="hidden sm:inline">Image</span>
//                                         </TabsTrigger>
//                                         <TabsTrigger 
//                                             value="export"
//                                             className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-lg px-3 py-2.5 transition-all"
//                                         >
//                                             <Download className="h-4 w-4 mr-2" />
//                                             <span className="hidden sm:inline">Export</span>
//                                         </TabsTrigger>
//                                     </TabsList>
//                                 </div>

//                                 <CardContent className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
//                                     {/* BASIC TAB */}
//                                     <TabsContent value="basic" className="mt-0 space-y-6">
//                                         <div>
//                                             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                                                 <Settings className="h-5 w-5 text-gray-500" />
//                                                 Basic Settings
//                                             </h3>
                                            
//                                             <SectionCard>
//                                                 {/* Text to encode */}
//                                                 <div className="space-y-3">
//                                                     <Label className="text-base font-medium">QR Code Content</Label>
//                                                     <Input
//                                                         type="text"
//                                                         value={text}
//                                                         onChange={(e) => setText(e.target.value)}
//                                                         placeholder="Enter text or URL"
//                                                         className="w-full h-12 text-base"
//                                                     />
//                                                     <p className="text-sm text-gray-500">
//                                                         Enter the URL or text you want to encode in your QR code
//                                                     </p>
//                                                 </div>

//                                                 {/* QR Code Size */}
//                                                 <div className="space-y-3 pt-4">
//                                                     <div className="flex justify-between items-center">
//                                                         <Label className="text-base font-medium">QR Code Size</Label>
//                                                         <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
//                                                             {qrCodeSize}px
//                                                         </span>
//                                                     </div>
//                                                     <Slider
//                                                         min={200}
//                                                         max={canvasSize}
//                                                         step={10}
//                                                         value={[qrCodeSize]}
//                                                         onValueChange={(value) => setQrCodeSize(value[0])}
//                                                         className="py-3"
//                                                     />
//                                                 </div>

//                                                 {/* Trim Circle Option */}
//                                                 <div className="pt-4 space-y-4">
//                                                     <div className="flex items-center justify-between">
//                                                         <div>
//                                                             <Label className="text-base font-medium cursor-pointer">
//                                                                 Circular QR Code
//                                                             </Label>
//                                                             <p className="text-sm text-gray-500 mt-1">
//                                                                 Trim QR code to a perfect circle
//                                                             </p>
//                                                         </div>
//                                                         <Switch 
//                                                             checked={qrTrimCircle} 
//                                                             onCheckedChange={setQrTrimCircle}
//                                                             className="data-[state=checked]:bg-blue-500"
//                                                         />
//                                                     </div>

//                                                     {qrTrimCircle && (
//                                                         <div className="space-y-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
//                                                             <div className="flex justify-between items-center">
//                                                                 <Label className="text-sm">Circle Radius</Label>
//                                                                 <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                                                     {qrTrimCircleRadius}px
//                                                                 </span>
//                                                             </div>
//                                                             <Slider
//                                                                 min={50}
//                                                                 max={600}
//                                                                 step={10}
//                                                                 value={[qrTrimCircleRadius]}
//                                                                 onValueChange={(value) => setQrTrimCircleRadius(value[0])}
//                                                             />
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </SectionCard>
//                                         </div>
//                                     </TabsContent>

//                                     {/* STYLE TAB */}
//                                     <TabsContent value="style" className="mt-0 space-y-6">
//                                         <div>
//                                             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                                                 <Palette className="h-5 w-5 text-gray-500" />
//                                                 Style Options
//                                             </h3>

//                                             {/* Background Section */}
//                                             <SectionCard className="mb-6">
//                                                 <h4 className="font-medium text-base mb-4">Background Style</h4>
                                                
//                                                 <div className="grid grid-cols-2 gap-3 mb-4">
//                                                     <label className="relative cursor-pointer">
//                                                         <input
//                                                             type="radio"
//                                                             name="bgOption"
//                                                             value="solid"
//                                                             checked={bgOption === 'solid'}
//                                                             onChange={() => setBgOption('solid')}
//                                                             className="sr-only"
//                                                         />
//                                                         <div className={`
//                                                             p-4 rounded-lg border-2 transition-all text-center
//                                                             ${bgOption === 'solid' 
//                                                                 ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' 
//                                                                 : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
//                                                             }
//                                                         `}>
//                                                             <div className="w-8 h-8 rounded bg-gray-400 mx-auto mb-2" />
//                                                             <span className="text-sm font-medium">Solid Color</span>
//                                                         </div>
//                                                     </label>
//                                                     <label className="relative cursor-pointer">
//                                                         <input
//                                                             type="radio"
//                                                             name="bgOption"
//                                                             value="gradient"
//                                                             checked={bgOption === 'gradient'}
//                                                             onChange={() => setBgOption('gradient')}
//                                                             className="sr-only"
//                                                         />
//                                                         <div className={`
//                                                             p-4 rounded-lg border-2 transition-all text-center
//                                                             ${bgOption === 'gradient' 
//                                                                 ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' 
//                                                                 : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
//                                                             }
//                                                         `}>
//                                                             <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-400 to-purple-400 mx-auto mb-2" />
//                                                             <span className="text-sm font-medium">Gradient</span>
//                                                         </div>
//                                                     </label>
//                                                 </div>

//                                                 {bgOption === 'solid' && (
//                                                     <ColorInput
//                                                         value={bgColor}
//                                                         onChange={(e) => setBgColor(e.target.value)}
//                                                         label="Background Color"
//                                                     />
//                                                 )}

//                                                 {bgOption === 'gradient' && (
//                                                     <div className="space-y-4">
//                                                         <div className="flex items-center gap-4">
//                                                             <Label className="text-sm">Type:</Label>
//                                                             <select
//                                                                 value={bgGradientType}
//                                                                 onChange={(e) => setBgGradientType(e.target.value as 'linear' | 'conic')}
//                                                                 className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
//                                                             >
//                                                                 <option value="linear">Linear</option>
//                                                                 <option value="conic">Conic</option>
//                                                             </select>
//                                                         </div>

//                                                         <div>
//                                                             <Label className="text-sm mb-2 block">Gradient Colors</Label>
//                                                             <GradientPicker
//                                                                 stops={bgGradientStops}
//                                                                 onChange={setBgGradientStops}
//                                                                 className="w-full"
//                                                             />
//                                                         </div>

//                                                         <div className="space-y-2">
//                                                             <div className="flex justify-between items-center">
//                                                                 <Label className="text-sm">Rotation Angle</Label>
//                                                                 <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                                                     {bgGradientAngle}°
//                                                                 </span>
//                                                             </div>
//                                                             <Slider
//                                                                 min={0}
//                                                                 max={360}
//                                                                 step={1}
//                                                                 value={[bgGradientAngle]}
//                                                                 onValueChange={(value) => setBgGradientAngle(value[0])}
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </SectionCard>

//                                             {/* QR Code Style Section */}
//                                             <SectionCard>
//                                                 <h4 className="font-medium text-base mb-4">QR Code Style</h4>
                                                
//                                                 <div className="grid grid-cols-2 gap-3 mb-4">
//                                                     <label className="relative cursor-pointer">
//                                                         <input
//                                                             type="radio"
//                                                             name="qrOption"
//                                                             value="solid"
//                                                             checked={qrOption === 'solid'}
//                                                             onChange={() => setQrOption('solid')}
//                                                             className="sr-only"
//                                                         />
//                                                         <div className={`
//                                                             p-4 rounded-lg border-2 transition-all text-center
//                                                             ${qrOption === 'solid' 
//                                                                 ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' 
//                                                                 : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
//                                                             }
//                                                         `}>
//                                                             <div className="w-8 h-8 rounded bg-gray-800 mx-auto mb-2" />
//                                                             <span className="text-sm font-medium">Solid Color</span>
//                                                         </div>
//                                                     </label>
//                                                     <label className="relative cursor-pointer">
//                                                         <input
//                                                             type="radio"
//                                                             name="qrOption"
//                                                             value="multiple"
//                                                             checked={qrOption === 'multiple'}
//                                                             onChange={() => setQrOption('multiple')}
//                                                             className="sr-only"
//                                                         />
//                                                         <div className={`
//                                                             p-4 rounded-lg border-2 transition-all text-center
//                                                             ${qrOption === 'multiple' 
//                                                                 ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' 
//                                                                 : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
//                                                             }
//                                                         `}>
//                                                             <div className="flex gap-1 justify-center mb-2">
//                                                                 <div className="w-3 h-3 rounded bg-red-400" />
//                                                                 <div className="w-3 h-3 rounded bg-blue-400" />
//                                                                 <div className="w-3 h-3 rounded bg-green-400" />
//                                                             </div>
//                                                             <span className="text-sm font-medium">Multiple</span>
//                                                         </div>
//                                                     </label>
//                                                 </div>

//                                                 {qrOption === 'solid' && (
//                                                     <ColorInput
//                                                         value={qrColor}
//                                                         onChange={(e) => setQrColor(e.target.value)}
//                                                         label="QR Color"
//                                                     />
//                                                 )}

//                                                 {qrOption === 'multiple' && (
//                                                     <div className="space-y-3">
//                                                         {qrPalette.map((color, index) => (
//                                                             <ColorInput
//                                                                 key={index}
//                                                                 value={color}
//                                                                 onChange={(e) => {
//                                                                     const newPalette = [...qrPalette];
//                                                                     newPalette[index] = e.target.value;
//                                                                     setQrPalette(newPalette);
//                                                                 }}
//                                                                 label={`Color ${index + 1}`}
//                                                             />
//                                                         ))}
//                                                         {qrPalette.length < 6 && (
//                                                             <Button 
//                                                                 variant="outline" 
//                                                                 onClick={handleAddQRColor}
//                                                                 className="w-full"
//                                                             >
//                                                                 <Sparkles className="w-4 h-4 mr-2" />
//                                                                 Add Color
//                                                             </Button>
//                                                         )}
//                                                     </div>
//                                                 )}
//                                             </SectionCard>
//                                         </div>
//                                     </TabsContent>

//                                     {/* PATTERN TAB */}
//                                     <TabsContent value="pattern" className="mt-0 space-y-6">
//                                         <div>
//                                             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                                                 <Square className="h-5 w-5 text-gray-500" />
//                                                 Pattern Settings
//                                             </h3>

//                                             {/* Finder Pattern */}
//                                             <SectionCard className="mb-6">
//                                                 <h4 className="font-medium text-base mb-4">Finder Pattern</h4>
//                                                 <div className="grid grid-cols-2 gap-3 mb-4">
//                                                     <label className="relative cursor-pointer">
//                                                         <input
//                                                             type="radio"
//                                                             name="finderPattern"
//                                                             value="same"
//                                                             checked={finderPatternOption === 'same'}
//                                                             onChange={() => setFinderPatternOption('same')}
//                                                             className="sr-only"
//                                                         />
//                                                         <div className={`
//                                                             p-4 rounded-lg border-2 transition-all text-center
//                                                             ${finderPatternOption === 'same' 
//                                                                 ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' 
//                                                                 : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
//                                                             }
//                                                         `}>
//                                                             <span className="text-sm font-medium">Same as QR</span>
//                                                         </div>
//                                                     </label>
//                                                     <label className="relative cursor-pointer">
//                                                         <input
//                                                             type="radio"
//                                                             name="finderPattern"
//                                                             value="solid"
//                                                             checked={finderPatternOption === 'solid'}
//                                                             onChange={() => setFinderPatternOption('solid')}
//                                                             className="sr-only"
//                                                         />
//                                                         <div className={`
//                                                             p-4 rounded-lg border-2 transition-all text-center
//                                                             ${finderPatternOption === 'solid' 
//                                                                 ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' 
//                                                                 : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
//                                                             }
//                                                         `}>
//                                                             <span className="text-sm font-medium">Custom Color</span>
//                                                         </div>
//                                                     </label>
//                                                 </div>
//                                                 {finderPatternOption === 'solid' && (
//                                                     <ColorInput
//                                                         value={finderPatternColor}
//                                                         onChange={(e) => setFinderPatternColor(e.target.value)}
//                                                         label="Finder Color"
//                                                     />
//                                                 )}
//                                             </SectionCard>

//                                             {/* Shape Settings */}
//                                             <SectionCard className="space-y-6">
//                                                 <h4 className="font-medium text-base">Shape Settings</h4>
                                                
//                                                 {/* Rect Scaling */}
//                                                 <div className="grid grid-cols-2 gap-4">
//                                                     <div className="space-y-2">
//                                                         <div className="flex justify-between items-center">
//                                                             <Label className="text-sm">Scale X</Label>
//                                                             <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                                                 {rectScaleX.toFixed(2)}x
//                                                             </span>
//                                                         </div>
//                                                         <Slider
//                                                             min={0.5}
//                                                             max={1.0}
//                                                             step={0.05}
//                                                             value={[rectScaleX]}
//                                                             onValueChange={(value) => setRectScaleX(value[0])}
//                                                         />
//                                                     </div>
//                                                     <div className="space-y-2">
//                                                         <div className="flex justify-between items-center">
//                                                             <Label className="text-sm">Scale Y</Label>
//                                                             <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                                                 {rectScaleY.toFixed(2)}x
//                                                             </span>
//                                                         </div>
//                                                         <Slider
//                                                             min={0.5}
//                                                             max={1.0}
//                                                             step={0.05}
//                                                             value={[rectScaleY]}
//                                                             onValueChange={(value) => setRectScaleY(value[0])}
//                                                         />
//                                                     </div>
//                                                 </div>

//                                                 {/* Other sliders */}
//                                                 <div className="space-y-4">
//                                                     <div className="space-y-2">
//                                                         <div className="flex justify-between items-center">
//                                                             <Label className="text-sm">Scale Variation</Label>
//                                                             <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                                                 {scaleVariation}%
//                                                             </span>
//                                                         </div>
//                                                         <Slider
//                                                             min={0}
//                                                             max={100}
//                                                             step={1}
//                                                             value={[scaleVariation]}
//                                                             onValueChange={(value) => setScaleVariation(value[0])}
//                                                         />
//                                                     </div>

//                                                     <div className="space-y-2">
//                                                         <div className="flex justify-between items-center">
//                                                             <Label className="text-sm">Rotation</Label>
//                                                             <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                                                 {rectRotation}°
//                                                             </span>
//                                                         </div>
//                                                         <Slider
//                                                             min={0}
//                                                             max={360}
//                                                             step={5}
//                                                             value={[rectRotation]}
//                                                             onValueChange={(value) => setRectRotation(value[0])}
//                                                         />
//                                                     </div>

//                                                     <div className="space-y-2">
//                                                         <div className="flex justify-between items-center">
//                                                             <Label className="text-sm">Module Roundness</Label>
//                                                             <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                                                 {roundness}%
//                                                             </span>
//                                                         </div>
//                                                         <Slider
//                                                             min={0}
//                                                             max={100}
//                                                             step={1}
//                                                             value={[roundness]}
//                                                             onValueChange={(value) => setRoundness(value[0])}
//                                                         />
//                                                     </div>

//                                                     <div className="space-y-2">
//                                                         <div className="flex justify-between items-center">
//                                                             <Label className="text-sm">Finder Roundness</Label>
//                                                             <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                                                 {finderRoundness}%
//                                                             </span>
//                                                         </div>
//                                                         <Slider
//                                                             min={0}
//                                                             max={100}
//                                                             step={1}
//                                                             value={[finderRoundness]}
//                                                             onValueChange={(value) => setFinderRoundness(value[0])}
//                                                         />
//                                                     </div>

//                                                     <div className="space-y-2">
//                                                         <div className="flex justify-between items-center">
//                                                             <Label className="text-sm">Opacity Variation</Label>
//                                                             <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                                                 {opacityVariation}%
//                                                             </span>
//                                                         </div>
//                                                         <Slider
//                                                             min={0}
//                                                             max={100}
//                                                             step={1}
//                                                             value={[opacityVariation]}
//                                                             onValueChange={(value) => setOpacityVariation(value[0])}
//                                                         />
//                                                     </div>
//                                                 </div>

//                                                 {/* Show Text Toggle */}
//                                                 <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
//                                                     <div>
//                                                         <Label className="text-base font-medium cursor-pointer">
//                                                             Decorative Text
//                                                         </Label>
//                                                         <p className="text-sm text-gray-500 mt-1">
//                                                             Show artistic text around QR code
//                                                         </p>
//                                                     </div>
//                                                     <Switch 
//                                                         checked={showText} 
//                                                         onCheckedChange={setShowText}
//                                                         className="data-[state=checked]:bg-blue-500"
//                                                     />
//                                                 </div>
//                                             </SectionCard>
//                                         </div>
//                                     </TabsContent>

//                                     {/* BORDER TAB */}
//                                     <TabsContent value="border" className="mt-0 space-y-6">
//                                         <div>
//                                             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                                                 <CircleDot className="h-5 w-5 text-gray-500" />
//                                                 Border Settings
//                                             </h3>

//                                             {/* Main Border */}
//                                             <SectionCard className="mb-6">
//                                                 <h4 className="font-medium text-base mb-4">Main Border</h4>
//                                                 <div className="space-y-4">
//                                                     <ColorInput
//                                                         value={borderColor}
//                                                         onChange={(e) => setBorderColor(e.target.value)}
//                                                         label="Border Color"
//                                                     />
//                                                     <div className="space-y-2">
//                                                         <div className="flex justify-between items-center">
//                                                             <Label className="text-sm">Border Width</Label>
//                                                             <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                                                 {borderWidth}px
//                                                             </span>
//                                                         </div>
//                                                         <Slider
//                                                             min={0}
//                                                             max={250}
//                                                             step={1}
//                                                             value={[borderWidth]}
//                                                             onValueChange={(value) => setBorderWidth(value[0])}
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </SectionCard>

//                                             {/* Second Border */}
//                                             <SectionCard className="mb-6">
//                                                 <div className="flex items-center justify-between mb-4">
//                                                     <h4 className="font-medium text-base">Second Border</h4>
//                                                     <Switch
//                                                         checked={secondBorderEnabled}
//                                                         onCheckedChange={setSecondBorderEnabled}
//                                                         className="data-[state=checked]:bg-blue-500"
//                                                     />
//                                                 </div>
//                                                 {secondBorderEnabled && (
//                                                     <div className="space-y-4">
//                                                         <ColorInput
//                                                             value={secondBorderColor}
//                                                             onChange={(e) => setSecondBorderColor(e.target.value)}
//                                                             label="Color"
//                                                         />
//                                                         <div className="space-y-2">
//                                                             <div className="flex justify-between items-center">
//                                                                 <Label className="text-sm">Coverage Range</Label>
//                                                                 <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                                                     {secondBorderRange[0]}% - {secondBorderRange[1]}%
//                                                                 </span>
//                                                             </div>
//                                                             <Slider
//                                                                 min={0}
//                                                                 max={100}
//                                                                 step={1}
//                                                                 value={secondBorderRange}
//                                                                 onValueChange={(value) => {
//                                                                     const sortedValue = [...value].sort((a, b) => a - b);
//                                                                     setSecondBorderRange([sortedValue[0], sortedValue[1]]);
//                                                                 }}
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </SectionCard>

//                                             {/* Border Text */}
//                                             <SectionCard>
//                                                 <div className="flex items-center justify-between mb-4">
//                                                     <div>
//                                                         <h4 className="font-medium text-base">Border Text</h4>
//                                                         <p className="text-sm text-gray-500 mt-1">Add text around the border</p>
//                                                     </div>
//                                                     <Switch
//                                                         checked={borderTextEnabled}
//                                                         onCheckedChange={setBorderTextEnabled}
//                                                         className="data-[state=checked]:bg-blue-500"
//                                                     />
//                                                 </div>
//                                                 {borderTextEnabled && (
//                                                     <div className="space-y-4">
//                                                         <div>
//                                                             <Label className="text-sm mb-2">Number of Lines</Label>
//                                                             <select
//                                                                 value={numTextLines}
//                                                                 onChange={(e) => setNumTextLines(Number(e.target.value) as 1 | 2)}
//                                                                 className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
//                                                             >
//                                                                 <option value={1}>One Line</option>
//                                                                 <option value={2}>Two Lines</option>
//                                                             </select>
//                                                         </div>

//                                                         <div>
//                                                             <Label className="text-sm mb-2">Text Line 1</Label>
//                                                             <Input
//                                                                 type="text"
//                                                                 value={textLine1}
//                                                                 onChange={(e) => setTextLine1(e.target.value)}
//                                                                 placeholder="Enter first line"
//                                                             />
//                                                         </div>

//                                                         {numTextLines === 2 && (
//                                                             <div>
//                                                                 <Label className="text-sm mb-2">Text Line 2</Label>
//                                                                 <Input
//                                                                     type="text"
//                                                                     value={textLine2}
//                                                                     onChange={(e) => setTextLine2(e.target.value)}
//                                                                     placeholder="Enter second line"
//                                                                 />
//                                                             </div>
//                                                         )}

//                                                         <div className="grid grid-cols-2 gap-4">
//                                                             <div>
//                                                                 <Label className="text-sm mb-2">Font Family</Label>
//                                                                 <Input
//                                                                     type="text"
//                                                                     value={fontFamily}
//                                                                     onChange={(e) => setFontFamily(e.target.value)}
//                                                                 />
//                                                             </div>
//                                                             <div>
//                                                                 <Label className="text-sm mb-2">Font Weight</Label>
//                                                                 <select
//                                                                     value={fontWeight}
//                                                                     onChange={(e) => setFontWeight(e.target.value)}
//                                                                     className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
//                                                                 >
//                                                                     <option value="normal">Normal</option>
//                                                                     <option value="bold">Bold</option>
//                                                                 </select>
//                                                             </div>
//                                                         </div>

//                                                         <div className="space-y-4">
//                                                             <div className="space-y-2">
//                                                                 <div className="flex justify-between items-center">
//                                                                     <Label className="text-sm">Font Size</Label>
//                                                                     <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                                                         {fontSize}px
//                                                                     </span>
//                                                                 </div>
//                                                                 <Slider
//                                                                     min={10}
//                                                                     max={100}
//                                                                     step={1}
//                                                                     value={[fontSize]}
//                                                                     onValueChange={(value) => setFontSize(value[0])}
//                                                                 />
//                                                             </div>

//                                                             <div className="space-y-2">
//                                                                 <div className="flex justify-between items-center">
//                                                                     <Label className="text-sm">Letter Spacing</Label>
//                                                                     <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                                                         {letterSpacing}px
//                                                                     </span>
//                                                                 </div>
//                                                                 <Slider
//                                                                     min={0}
//                                                                     max={20}
//                                                                     step={1}
//                                                                     value={[letterSpacing]}
//                                                                     onValueChange={(value) => setLetterSpacing(value[0])}
//                                                                 />
//                                                             </div>

//                                                             <div className="space-y-2">
//                                                                 <div className="flex justify-between items-center">
//                                                                     <Label className="text-sm">Text Padding</Label>
//                                                                     <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                                                         {textPadding}px
//                                                                     </span>
//                                                                 </div>
//                                                                 <Slider
//                                                                     min={0}
//                                                                     max={50}
//                                                                     step={1}
//                                                                     value={[textPadding]}
//                                                                     onValueChange={(value) => setTextPadding(value[0])}
//                                                                 />
//                                                             </div>
//                                                         </div>

//                                                         <div className="flex items-center justify-between">
//                                                             <ColorInput
//                                                                 value={textColor}
//                                                                 onChange={(e) => setTextColor(e.target.value)}
//                                                                 label="Text Color"
//                                                             />
//                                                             <div className="flex items-center gap-2">
//                                                                 <Label className="text-sm">Condensed</Label>
//                                                                 <Switch
//                                                                     checked={condensed}
//                                                                     onCheckedChange={setCondensed}
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </SectionCard>
//                                         </div>
//                                     </TabsContent>

//                                     {/* IMAGE TAB */}
//                                     <TabsContent value="image" className="mt-0 space-y-6">
//                                         <div>
//                                             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                                                 <ImageIcon className="h-5 w-5 text-gray-500" />
//                                                 Image & Decorations
//                                             </h3>

//                                             {/* Center Gap */}
//                                             <SectionCard className="mb-6">
//                                                 <h4 className="font-medium text-base mb-4">Center Gap</h4>
//                                                 <div className="grid grid-cols-2 gap-4">
//                                                     <div>
//                                                         <Label className="text-sm mb-2">Width</Label>
//                                                         <div className="flex items-center gap-2">
//                                                             <Input
//                                                                 type="number"
//                                                                 value={centerGapWidth}
//                                                                 onChange={(e) =>
//                                                                     setCenterGapWidth(
//                                                                         Math.max(0, Math.min(qrCodeSize || 1000, Number(e.target.value)))
//                                                                     )
//                                                                 }
//                                                                 min={0}
//                                                                 max={qrCodeSize || 1000}
//                                                                 className="flex-1"
//                                                             />
//                                                             <span className="text-sm text-gray-500">px</span>
//                                                         </div>
//                                                     </div>
//                                                     <div>
//                                                         <Label className="text-sm mb-2">Height</Label>
//                                                         <div className="flex items-center gap-2">
//                                                             <Input
//                                                                 type="number"
//                                                                 value={centerGapHeight}
//                                                                 onChange={(e) =>
//                                                                     setCenterGapHeight(
//                                                                         Math.max(0, Math.min(qrCodeSize || 1000, Number(e.target.value)))
//                                                                     )
//                                                                 }
//                                                                 min={0}
//                                                                 max={qrCodeSize || 1000}
//                                                                 className="flex-1"
//                                                             />
//                                                             <span className="text-sm text-gray-500">px</span>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 <div className="space-y-2 mt-4">
//                                                     <div className="flex justify-between items-center">
//                                                         <Label className="text-sm">Background Coverage</Label>
//                                                         <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                                             {backgroundCoverage}%
//                                                         </span>
//                                                     </div>
//                                                     <Slider
//                                                         min={0}
//                                                         max={100}
//                                                         step={1}
//                                                         value={[backgroundCoverage]}
//                                                         onValueChange={(value) => setBackgroundCoverage(value[0])}
//                                                     />
//                                                 </div>
//                                             </SectionCard>

//                                             {/* Center Image */}
//                                             <SectionCard className="mb-6">
//                                                 <h4 className="font-medium text-base mb-4">Center Image</h4>
//                                                 <div className="space-y-4">
//                                                     <div>
//                                                         <Label className="text-sm mb-2">Upload Image</Label>
//                                                         <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
//                                                             <input
//                                                                 type="file"
//                                                                 accept="image/*"
//                                                                 onChange={handleImageUpload}
//                                                                 className="sr-only"
//                                                             />
//                                                             <div className="text-center">
//                                                                 <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
//                                                                 <p className="text-sm text-gray-500">
//                                                                     Click to upload image
//                                                                 </p>
//                                                             </div>
//                                                         </label>
//                                                     </div>

//                                                     {uploadedImageDataUrl && (
//                                                         <div className="space-y-2">
//                                                             <div className="flex justify-between items-center">
//                                                                 <Label className="text-sm">Image Scale</Label>
//                                                                 <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                                                     {(imageScale * 100).toFixed(0)}%
//                                                                 </span>
//                                                             </div>
//                                                             <Slider
//                                                                 min={0.1}
//                                                                 max={2}
//                                                                 step={0.1}
//                                                                 value={[imageScale]}
//                                                                 onValueChange={(value) => setImageScale(value[0])}
//                                                             />
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </SectionCard>

//                                             {/* Circular Bars */}
//                                             <SectionCard>
//                                                 <div className="flex items-center justify-between mb-4">
//                                                     <div>
//                                                         <h4 className="font-medium text-base">Circular Bars</h4>
//                                                         <p className="text-sm text-gray-500 mt-1">Decorative bars around the QR code</p>
//                                                     </div>
//                                                     <Switch 
//                                                         checked={barsEnabled} 
//                                                         onCheckedChange={setBarsEnabled}
//                                                         className="data-[state=checked]:bg-blue-500"
//                                                     />
//                                                 </div>
//                                                 {barsEnabled && (
//                                                     <div className="space-y-4">
//                                                         <ColorInput
//                                                             value={barsColor}
//                                                             onChange={(e) => setBarsColor(e.target.value)}
//                                                             label="Bar Color"
//                                                         />

//                                                         <div className="space-y-2">
//                                                             <div className="flex justify-between items-center">
//                                                                 <Label className="text-sm">Bar Width</Label>
//                                                                 <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                                                     {barsWidth}px
//                                                                 </span>
//                                                             </div>
//                                                             <Slider
//                                                                 min={1}
//                                                                 max={50}
//                                                                 step={1}
//                                                                 value={[barsWidth]}
//                                                                 onValueChange={(value) => setBarsWidth(value[0])}
//                                                             />
//                                                         </div>

//                                                         <div className="space-y-2">
//                                                             <div className="flex justify-between items-center">
//                                                                 <Label className="text-sm">Gap Between Bars</Label>
//                                                                 <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                                                     {barsGapDegrees}°
//                                                                 </span>
//                                                             </div>
//                                                             <Slider
//                                                                 min={0}
//                                                                 max={30}
//                                                                 step={1}
//                                                                 value={[barsGapDegrees]}
//                                                                 onValueChange={(value) => setBarsGapDegrees(value[0])}
//                                                             />
//                                                         </div>

//                                                         <div className="space-y-2">
//                                                             <div className="flex justify-between items-center">
//                                                                 <Label className="text-sm">Radius Offset</Label>
//                                                                 <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                                                     {barsRadiusOffset}px
//                                                                 </span>
//                                                             </div>
//                                                             <Slider
//                                                                 min={0}
//                                                                 max={100}
//                                                                 step={5}
//                                                                 value={[barsRadiusOffset]}
//                                                                 onValueChange={(value) => setBarsRadiusOffset(value[0])}
//                                                                 />
//                                                     </div>

//                                                     <div className="flex items-center justify-between pt-2">
//                                                         <Label className="text-sm">Round Bar Ends</Label>
//                                                         <Switch
//                                                             checked={barsRoundEnds}
//                                                             onCheckedChange={setBarsRoundEnds}
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </SectionCard>
//                                     </div>
//                                 </TabsContent>

//                                 {/* EXPORT TAB */}
//                                 <TabsContent value="export" className="mt-0 space-y-6">
//                                     <div>
//                                         <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                                             <Download className="h-5 w-5 text-gray-500" />
//                                             Export Options
//                                         </h3>

//                                         <SectionCard>
//                                             <div className="space-y-6">
//                                                 {/* Export Format and Resolution */}
//                                                 <div className="grid grid-cols-2 gap-4">
//                                                     <div>
//                                                         <Label className="text-sm mb-2">Export Format</Label>
//                                                         <select
//                                                             value={exportFormat}
//                                                             onChange={(e) =>
//                                                                 setExportFormat(e.target.value as 'png' | 'webp' | 'svg')
//                                                             }
//                                                             className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
//                                                         >
//                                                             <option value="png">PNG</option>
//                                                             <option value="webp">WEBP</option>
//                                                             <option value="svg">SVG</option>
//                                                         </select>
//                                                     </div>

//                                                     <div>
//                                                         <Label className="text-sm mb-2">Resolution (px)</Label>
//                                                         <Input
//                                                             type="number"
//                                                             value={exportResolution}
//                                                             onChange={(e) =>
//                                                                 setExportResolution(
//                                                                     Math.min(2560, Math.max(256, parseInt(e.target.value) || 1024))
//                                                                 )
//                                                             }
//                                                             min={256}
//                                                             max={2560}
//                                                             placeholder="1024"
//                                                         />
//                                                     </div>
//                                                 </div>

//                                                 {/* Export Component */}
//                                                 {(exportFormat === 'png' || exportFormat === 'webp') && (
//                                                     <div>
//                                                         <Label className="text-sm mb-2">Export Component</Label>
//                                                         <select
//                                                             value={exportComponent}
//                                                             onChange={(e) =>
//                                                                 setExportComponent(e.target.value as 'full' | 'foreground' | 'background')
//                                                             }
//                                                             className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
//                                                         >
//                                                             <option value="full">Full Design</option>
//                                                             <option value="foreground">QR Code Only</option>
//                                                             <option value="background">Background Only</option>
//                                                         </select>
//                                                     </div>
//                                                 )}

//                                                 {/* Export Info */}
//                                                 <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//                                                     <div className="flex items-start gap-3">
//                                                         <Sparkles className="h-5 w-5 text-blue-500 mt-0.5" />
//                                                         <div className="text-sm text-blue-700 dark:text-blue-300">
//                                                             <p className="font-medium mb-1">Export Tips:</p>
//                                                             <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
//                                                                 <li>PNG format supports transparency</li>
//                                                                 <li>SVG format is scalable without quality loss</li>
//                                                                 <li>WEBP offers better compression than PNG</li>
//                                                             </ul>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 {/* Action Buttons */}
//                                                 <div className="space-y-3 pt-4">
//                                                     {onSave && (
//                                                         <Button
//                                                             onClick={handleSave}
//                                                             disabled={saving}
//                                                             className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
//                                                         >
//                                                             <Save className="w-5 h-5 mr-2" />
//                                                             {saving ? 'Saving...' : (isEditing ? 'Update QR Code' : 'Save QR Code')}
//                                                         </Button>
//                                                     )}

//                                                     <Button
//                                                         onClick={handleExport}
//                                                         className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
//                                                     >
//                                                         <Download className="w-5 h-5 mr-2" />
//                                                         Export QR Code
//                                                     </Button>
//                                                 </div>
//                                             </div>
//                                         </SectionCard>
//                                     </div>
//                                 </TabsContent>
//                             </CardContent>
//                         </Tabs>
//                     </Card>
//                 </div>
//             </div>
//         </div>

//         {/* Floating gradient effects */}
//         <div className="fixed inset-0 pointer-events-none overflow-hidden">
//             <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
//             <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
//         </div>
//     </div>
//     );};
// export default QRCodeGenerator;