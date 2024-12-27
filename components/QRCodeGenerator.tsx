import React, {useEffect, useRef, useState} from "react";
import QRCode from "qrcode-generator";
import {Input} from "@/components/ui/input";
import {Slider} from "@/components/ui/slider";
import {Switch} from "@/components/ui/switch";
import CircularQRCode from "./CircularQRCode"; // <-- Import from the file above

// Expand the type to include "multiple"
type QROptionType = "solid" | "gradient" | "multiple";

interface QRCodeGeneratorProps {}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = () => {
    const [text, setText] = useState("https://example.com/");

    // State variables for background customization
    const [bgOption, setBgOption] = useState<"solid" | "gradient">("solid");
    const [bgColor, setBgColor] = useState("#FFFFFF");
    const [bgGradientType, setBgGradientType] = useState<"linear" | "conic">(
        "linear"
    );
    const [bgGradientColors, setBgGradientColors] = useState<string[]>([
        "#FFFFFF",
        "#FFFFFF",
    ]);
    const [bgGradientAngle, setBgGradientAngle] = useState(0);

    // State variables for QR code customization
    const [qrOption, setQrOption] = useState<QROptionType>("solid");
    const [qrColor, setQrColor] = useState("#000000");
    const [qrGradientType, setQrGradientType] = useState<"linear" | "conic">(
        "linear"
    );
    const [qrGradientColors, setQrGradientColors] = useState<string[]>([
        "#000000",
        "#000000",
    ]);
    const [qrGradientAngle, setQrGradientAngle] = useState(0);

    // Multiple-colors palette
    const [qrPalette, setQrPalette] = useState<string[]>(["#000000"]);

    // Finder pattern color logic
    const [finderPatternOption, setFinderPatternOption] =
        useState<"same" | "solid">("same");
    const [finderPatternColor, setFinderPatternColor] = useState("#000000");

    // Outer border customization
    const [borderColor, setBorderColor] = useState("#000000");
    const [borderWidth, setBorderWidth] = useState(10);
    const [canvasSize, setCanvasSize] = useState<number>(1000);

    // Additional customization options
    const [showText, setShowText] = useState(true);
    const [roundness, setRoundness] = useState(0);
    const [finderRoundness, setFinderRoundness] = useState(0);
    const [opacityVariation, setOpacityVariation] = useState(0);

    // NEW: Rect scaling states (X/Y)
    const [rectScaleX, setRectScaleX] = useState(1.0);
    const [rectScaleY, setRectScaleY] = useState(1.0);

    // NEW: Scale variation for random scaling
    const [scaleVariation, setScaleVariation] = useState(0);

    // NEW: Rect rotation slider
    const [rectRotation, setRectRotation] = useState(0);

    // Center Gap Options
    const [centerGapWidth, setCenterGapWidth] = useState(0);
    const [centerGapHeight, setCenterGapHeight] = useState(0);

    // Image upload
    const [uploadedImageDataUrl, setUploadedImageDataUrl] = useState<
        string | null
    >(null);
    const [imageScale, setImageScale] = useState(1);

    // moduleSize, qrCodeSize, moduleCount
    const [moduleSize, setModuleSize] = useState<number | null>(null);
    const [qrCodeSize, setQrCodeSize] = useState<number>(700);
    const [moduleCount, setModuleCount] = useState<number | null>(null);
    const [qrcode, setQrcode] = useState<any>(null);

    // Export options
    const [exportResolution, setExportResolution] = useState(1024);
    const [exportFormat, setExportFormat] = useState<"png" | "webp" | "svg">(
        "png"
    );
    const [exportComponent, setExportComponent] =
        useState<"full" | "foreground" | "background">("full");

    // New State Variable for Background Coverage
    const [backgroundCoverage, setBackgroundCoverage] = useState(100);

    // Second Border Options
    const [secondBorderEnabled, setSecondBorderEnabled] = useState(false);
    const [secondBorderColor, setSecondBorderColor] = useState("#FF0000");
    const [secondBorderRange, setSecondBorderRange] = useState<[number, number]>([
        0, 100,
    ]);

    // Text on Border
    const [borderTextEnabled, setBorderTextEnabled] = useState(false);
    const [textLine1, setTextLine1] = useState("");
    const [textLine2, setTextLine2] = useState("");
    const [numTextLines, setNumTextLines] = useState<1 | 2>(1);
    const [fontFamily, setFontFamily] = useState("Arial");
    const [fontSize, setFontSize] = useState(20);
    const [textColor, setTextColor] = useState("#000000");
    const [fontWeight, setFontWeight] = useState("normal");
    const [letterSpacing, setLetterSpacing] = useState(0);
    const [condensed, setCondensed] = useState(false);
    const [textPadding, setTextPadding] = useState(10);

    // Bars Options
    const [barsEnabled, setBarsEnabled] = useState(false);
    const [barsColor, setBarsColor] = useState("#FF0000");
    const [barsWidth, setBarsWidth] = useState(10);
    const [barsGapDegrees, setBarsGapDegrees] = useState(5);
    const [barsRoundEnds, setBarsRoundEnds] = useState(false);
    const [barsRadiusOffset, setBarsRadiusOffset] = useState(20);

    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const errorCorrectionLevel = "H";
        const qrcodeLocal = QRCode(0, errorCorrectionLevel);
        qrcodeLocal.addData(text);
        qrcodeLocal.make();

        setQrcode(qrcodeLocal);

        const moduleCountLocal = qrcodeLocal.getModuleCount();
        setModuleCount(moduleCountLocal);

        const moduleSizeLocal = qrCodeSize / moduleCountLocal;
        setModuleSize(moduleSizeLocal);
    }, [text, qrCodeSize]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Please upload a valid image file.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImageDataUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handler to add a new color to the QR palette
    const handleAddQRColor = () => {
        if (qrPalette.length < 6) {
            setQrPalette([...qrPalette, "#000000"]); // default color
        }
    };

    const handleExport = () => {
        if (!svgRef.current) return;

        const svgElement = svgRef.current.cloneNode(true) as SVGSVGElement;

        // If exporting to SVG, remove any <image> tags to avoid embedding
        if (exportFormat === "svg") {
            const images = svgElement.getElementsByTagName("image");
            while (images.length > 0) {
                images[0].parentNode?.removeChild(images[0]);
            }
        }

        // Depending on exportComponent, remove undesired elements
        if (exportComponent !== "full") {
            if (exportComponent === "foreground") {
                const backgroundElements = svgElement.querySelectorAll(
                    ".backgroundRects, .circle-background, .borderText"
                );
                backgroundElements.forEach((el) => el.parentNode?.removeChild(el));
                const overlayImage = svgElement.querySelector(".overlayImage");
                if (overlayImage) {
                    overlayImage.parentNode?.removeChild(overlayImage);
                }
            } else if (exportComponent === "background") {
                const qrElements = svgElement.querySelectorAll(
                    ".qrcode, .finderPatterns, .qrRects, .overlayImage, .finderBars"
                );
                qrElements.forEach((el) => el.parentNode?.removeChild(el));
            }
        }

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);

        if (exportFormat === "svg") {
            const blob = new Blob([svgString], {
                type: "image/svg+xml;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);
            downloadURI(url, "qrcode.svg");
            URL.revokeObjectURL(url);
        } else {
            const img = new Image();
            const canvas = document.createElement("canvas");
            canvas.width = exportResolution;
            canvas.height = exportResolution;
            const ctx = canvas.getContext("2d");

            img.onload = function () {
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = "rgba(0,0,0,0)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const dataURL = canvas.toDataURL(
                        `image/${exportFormat}`,
                        exportFormat === "png" ? undefined : 0.92
                    );
                    downloadURI(dataURL, `qrcode.${exportFormat}`);
                }
            };
            img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
        }
    };

    const downloadURI = (uri: string, name: string) => {
        const link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // @ts-ignore
    return (
        <div className="flex flex-row items-start">
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
                    canvasSize={canvasSize}
                    barsEnabled={barsEnabled}
                    barsColor={barsColor}
                    barsWidth={barsWidth}
                    barsGapDegrees={barsGapDegrees}
                    barsRoundEnds={barsRoundEnds}
                    barsRadiusOffset={barsRadiusOffset}
                />
            ) : (
                <div>Loading...</div>
            )}
            <div className="ml-8">
                {/* Text Input */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Text to encode:</label>
                    <Input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text or URL"
                        className="w-full"
                    />
                </div>

                {/* Background Options */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Background:</label>
                    <div className="flex items-center mb-2">
                        <input
                            type="radio"
                            id="bgSolid"
                            name="bgOption"
                            value="solid"
                            checked={bgOption === "solid"}
                            onChange={() => setBgOption("solid")}
                        />
                        <label htmlFor="bgSolid" className="ml-2">
                            Solid Color
                        </label>
                        <input
                            type="radio"
                            id="bgGradient"
                            name="bgOption"
                            value="gradient"
                            checked={bgOption === "gradient"}
                            onChange={() => setBgOption("gradient")}
                            className="ml-4"
                        />
                        <label htmlFor="bgGradient" className="ml-2">
                            Gradient
                        </label>
                    </div>
                    {bgOption === "solid" && (
                        <Input
                            type="color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                        />
                    )}
                    {bgOption === "gradient" && (
                        <div className="mt-2">
                            <div className="flex items-center mb-2">
                                <label className="mr-2">Type:</label>
                                <select
                                    value={bgGradientType}
                                    onChange={(e) =>
                                        setBgGradientType(e.target.value as "linear" | "conic")
                                    }
                                >
                                    <option value="linear">Linear</option>
                                    <option value="conic">Conic</option>
                                </select>
                            </div>
                            <div className="flex items-center mb-2">
                                <label className="mr-2">Color 1:</label>
                                <Input
                                    type="color"
                                    value={bgGradientColors[0]}
                                    onChange={(e) =>
                                        setBgGradientColors([e.target.value, bgGradientColors[1]])
                                    }
                                />
                                <label className="ml-4 mr-2">Color 2:</label>
                                <Input
                                    type="color"
                                    value={bgGradientColors[1]}
                                    onChange={(e) =>
                                        setBgGradientColors([bgGradientColors[0], e.target.value])
                                    }
                                />
                            </div>
                            <div className="flex items-center mb-2">
                                <label className="mr-2">Rotation Angle:</label>
                                <Input
                                    type="number"
                                    value={bgGradientAngle}
                                    onChange={(e) => setBgGradientAngle(Number(e.target.value))}
                                    min={0}
                                    max={360}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* QR Code Options */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">QR Code:</label>
                    <div className="flex items-center mb-2">
                        <input
                            type="radio"
                            id="qrSolid"
                            name="qrOption"
                            value="solid"
                            checked={qrOption === "solid"}
                            onChange={() => setQrOption("solid")}
                        />
                        <label htmlFor="qrSolid" className="ml-2">
                            Solid Color
                        </label>

                        <input
                            type="radio"
                            id="qrGradient"
                            name="qrOption"
                            value="gradient"
                            checked={qrOption === "gradient"}
                            onChange={() => setQrOption("gradient")}
                            className="ml-4"
                        />
                        <label htmlFor="qrGradient" className="ml-2">
                            Gradient
                        </label>

                        <input
                            type="radio"
                            id="qrMultiple"
                            name="qrOption"
                            value="multiple"
                            checked={qrOption === "multiple"}
                            onChange={() => setQrOption("multiple")}
                            className="ml-4"
                        />
                        <label htmlFor="qrMultiple" className="ml-2">
                            Multiple Colors
                        </label>
                    </div>

                    {qrOption === "solid" && (
                        <Input
                            type="color"
                            value={qrColor}
                            onChange={(e) => setQrColor(e.target.value)}
                        />
                    )}
                    {qrOption === "gradient" && (
                        <div className="mt-2">
                            <div className="flex items-center mb-2">
                                <label className="mr-2">Type:</label>
                                <select
                                    value={qrGradientType}
                                    onChange={(e) =>
                                        setQrGradientType(e.target.value as "linear" | "conic")
                                    }
                                >
                                    <option value="linear">Linear</option>
                                    <option value="conic">Conic</option>
                                </select>
                            </div>
                            <div className="flex items-center mb-2">
                                <label className="mr-2">Color 1:</label>
                                <Input
                                    type="color"
                                    value={qrGradientColors[0]}
                                    onChange={(e) =>
                                        setQrGradientColors([
                                            e.target.value,
                                            qrGradientColors[1],
                                        ])
                                    }
                                />
                                <label className="ml-4 mr-2">Color 2:</label>
                                <Input
                                    type="color"
                                    value={qrGradientColors[1]}
                                    onChange={(e) =>
                                        setQrGradientColors([
                                            qrGradientColors[0],
                                            e.target.value,
                                        ])
                                    }
                                />
                            </div>
                            <div className="flex items-center mb-2">
                                <label className="mr-2">Rotation Angle:</label>
                                <Input
                                    type="number"
                                    value={qrGradientAngle}
                                    onChange={(e) => setQrGradientAngle(Number(e.target.value))}
                                    min={0}
                                    max={360}
                                />
                            </div>
                        </div>
                    )}
                    {qrOption === "multiple" && (
                        <div className="mt-2">
                            {qrPalette.map((color, index) => (
                                <div className="flex items-center mb-2" key={index}>
                                    <label className="mr-2">Color {index + 1}:</label>
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
                                <button
                                    className="mt-1 px-2 py-1 bg-gray-200"
                                    onClick={handleAddQRColor}
                                >
                                    Add Color
                                </button>
                            )}
                        </div>
                    )}

                    <div className="flex items-center mt-4">
                        <label className="mr-2">QR Code Size:</label>
                        <Slider
                            min={200}
                            max={canvasSize}
                            step={10}
                            value={[qrCodeSize]}
                            onValueChange={(value) => setQrCodeSize(value[0])}
                        />
                        <span className="ml-2">{qrCodeSize}px</span>
                    </div>
                </div>

                {/* Finder Pattern Options */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">
                        Finder Pattern Color:
                    </label>
                    <div className="flex items-center mb-2">
                        <input
                            type="radio"
                            id="finderSame"
                            name="finderOption"
                            value="same"
                            checked={finderPatternOption === "same"}
                            onChange={() => setFinderPatternOption("same")}
                        />
                        <label htmlFor="finderSame" className="ml-2">
                            Same as QR Modules
                        </label>
                        <input
                            type="radio"
                            id="finderSolid"
                            name="finderOption"
                            value="solid"
                            checked={finderPatternOption === "solid"}
                            onChange={() => setFinderPatternOption("solid")}
                            className="ml-4"
                        />
                        <label htmlFor="finderSolid" className="ml-2">
                            Solid Color
                        </label>
                    </div>
                    {finderPatternOption === "solid" && (
                        <div className="mt-2">
                            <Input
                                type="color"
                                value={finderPatternColor}
                                onChange={(e) => setFinderPatternColor(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {/* Rect Scaling Sliders */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Rect Scale (X/Y):</label>
                    <div className="flex items-center mb-2">
                        <label className="mr-2">Scale X:</label>
                        <Slider
                            min={0.5}
                            max={1.0}
                            step={0.05}
                            value={[rectScaleX]}
                            onValueChange={(value) => setRectScaleX(value[0])}
                        />
                        <span className="ml-2">{rectScaleX.toFixed(2)}x</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <label className="mr-2">Scale Y:</label>
                        <Slider
                            min={0.5}
                            max={1.0}
                            step={0.05}
                            value={[rectScaleY]}
                            onValueChange={(value) => setRectScaleY(value[0])}
                        />
                        <span className="ml-2">{rectScaleY.toFixed(2)}x</span>
                    </div>
                </div>

                {/* Scale Variation Slider */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Scale Variation:</label>
                    <div className="flex items-center">
                        <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[scaleVariation]}
                            onValueChange={(value) => setScaleVariation(value[0])}
                        />
                        <span className="ml-2">{scaleVariation}%</span>
                    </div>
                </div>

                {/* Rect Rotation Slider */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">
                        Rect Rotation (degrees):
                    </label>
                    <div className="flex items-center">
                        <Slider
                            min={0}
                            max={360}
                            step={5}
                            value={[rectRotation]}
                            onValueChange={(value) => setRectRotation(value[0])}
                        />
                        <span className="ml-2">{rectRotation}°</span>
                    </div>
                </div>

                {/* Canvas Size Options */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Canvas Size:</label>
                    <div className="flex items-center">
                        <Slider
                            min={500}
                            max={2000}
                            step={100}
                            value={[canvasSize]}
                            onValueChange={(value) => setCanvasSize(value[0])}
                        />
                        <span className="ml-2">{canvasSize}px</span>
                    </div>
                </div>

                {/* Outer Border */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Outer Border:</label>
                    <div className="flex items-center mb-2">
                        <label className="mr-2">Color:</label>
                        <Input
                            type="color"
                            value={borderColor}
                            onChange={(e) => setBorderColor(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center mb-2">
                        <label className="mr-2">Width:</label>
                        <Slider
                            min={0}
                            max={250}
                            step={1}
                            value={[borderWidth]}
                            onValueChange={(value) => setBorderWidth(value[0])}
                        />
                        <span className="ml-2">{borderWidth}px</span>
                    </div>

                    {/* Second Border */}
                    <div className="mt-4">
                        <label className="block mb-1 font-semibold">Second Border:</label>
                        <div className="flex items-center mb-2">
                            <Switch
                                checked={secondBorderEnabled}
                                onCheckedChange={setSecondBorderEnabled}
                                className="mr-2"
                            />
                            <label className="font-semibold">Enable Second Border</label>
                        </div>
                        {secondBorderEnabled && (
                            <>
                                <div className="flex items-center mb-2">
                                    <label className="mr-2">Color:</label>
                                    <Input
                                        type="color"
                                        value={secondBorderColor}
                                        onChange={(e) => setSecondBorderColor(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center mb-2">
                                    <label className="mr-2">Coverage:</label>
                                    <Slider
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={secondBorderRange}
                                        onValueChange={(value) => {
                                            const sortedValue = [...value].sort((a, b) => a - b);
                                            setSecondBorderRange([sortedValue[0], sortedValue[1]]);
                                        }}
                                    />
                                    <span className="ml-2">
                    {secondBorderRange[0]}% - {secondBorderRange[1]}%
                  </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Text on Border */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Text on Border:</label>
                    <div className="flex items-center mb-2">
                        <Switch
                            checked={borderTextEnabled}
                            onCheckedChange={setBorderTextEnabled}
                            className="mr-2"
                        />
                        <label className="font-semibold">Enable Border Text</label>
                    </div>
                    {borderTextEnabled && (
                        <>
                            <div className="mb-2">
                                <label className="mr-2">Number of Lines:</label>
                                <select
                                    value={numTextLines}
                                    onChange={(e) =>
                                        setNumTextLines(Number(e.target.value) as 1 | 2)
                                    }
                                >
                                    <option value={1}>One Line</option>
                                    <option value={2}>Two Lines</option>
                                </select>
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1">Text Line 1:</label>
                                <Input
                                    type="text"
                                    value={textLine1}
                                    onChange={(e) => setTextLine1(e.target.value)}
                                />
                            </div>
                            {numTextLines === 2 && (
                                <div className="mb-2">
                                    <label className="block mb-1">Text Line 2:</label>
                                    <Input
                                        type="text"
                                        value={textLine2}
                                        onChange={(e) => setTextLine2(e.target.value)}
                                    />
                                </div>
                            )}
                            <div className="mb-2">
                                <label className="mr-2">Font Family:</label>
                                <Input
                                    type="text"
                                    value={fontFamily}
                                    onChange={(e) => setFontFamily(e.target.value)}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="mr-2">Font Size:</label>
                                <Slider
                                    min={10}
                                    max={100}
                                    step={1}
                                    value={[fontSize]}
                                    onValueChange={(value) => setFontSize(value[0])}
                                />
                                <span className="ml-2">{fontSize}px</span>
                            </div>
                            <div className="mb-2">
                                <label className="mr-2">Font Weight:</label>
                                <select
                                    value={fontWeight}
                                    onChange={(e) => setFontWeight(e.target.value)}
                                >
                                    <option value="normal">Normal</option>
                                    <option value="bold">Bold</option>
                                </select>
                            </div>
                            <div className="mb-2">
                                <label className="mr-2">Letter Spacing:</label>
                                <Slider
                                    min={0}
                                    max={20}
                                    step={1}
                                    value={[letterSpacing]}
                                    onValueChange={(value) => setLetterSpacing(value[0])}
                                />
                                <span className="ml-2">{letterSpacing}px</span>
                            </div>
                            <div className="mb-2">
                                <label className="mr-2">Condensed:</label>
                                <Switch
                                    checked={condensed}
                                    onCheckedChange={setCondensed}
                                    className="mr-2"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="mr-2">Text Padding:</label>
                                <Slider
                                    min={0}
                                    max={50}
                                    step={1}
                                    value={[textPadding]}
                                    onValueChange={(value) => setTextPadding(value[0])}
                                />
                                <span className="ml-2">{textPadding}px</span>
                            </div>
                            <div className="mb-2">
                                <label className="mr-2">Text Color:</label>
                                <Input
                                    type="color"
                                    value={textColor}
                                    onChange={(e) => setTextColor(e.target.value)}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Show Text Toggle */}
                <div className="mb-4 flex items-center">
                    <Switch
                        checked={showText}
                        onCheckedChange={setShowText}
                        className="mr-2"
                    />
                    <label className="font-semibold">Show Text Around QR Code</label>
                </div>

                {/* Roundness Slider */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Roundness:</label>
                    <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[roundness]}
                        onValueChange={(value) => setRoundness(value[0])}
                    />
                </div>

                {/* Finder Pattern Roundness Slider */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">
                        Finder Pattern Roundness:
                    </label>
                    <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[finderRoundness]}
                        onValueChange={(value) => setFinderRoundness(value[0])}
                    />
                </div>

                {/* Opacity Variation Slider */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Opacity Variation:</label>
                    <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[opacityVariation]}
                        onValueChange={(value) => setOpacityVariation(value[0])}
                    />
                </div>

                {/* Center Gap Options */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Center Gap:</label>
                    <div className="flex items-center mb-2">
                        <label className="mr-2">Width:</label>
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
                        />{" "}
                        px
                    </div>
                    <div className="flex items-center">
                        <label className="mr-2">Height:</label>
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
                        />{" "}
                        px
                    </div>
                </div>

                {/* Background Coverage */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">
                        Background Coverage:
                    </label>
                    <div className="flex items-center">
                        <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[backgroundCoverage]}
                            onValueChange={(value) => setBackgroundCoverage(value[0])}
                        />
                        <span className="ml-2">{backgroundCoverage}%</span>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">
                        Upload Center Image:
                    </label>
                    <Input type="file" accept="image/*" onChange={handleImageUpload} />
                    {uploadedImageDataUrl && (
                        <div className="mt-2">
                            <label className="block mb-1 font-semibold">Image Scale:</label>
                            <Slider
                                min={0.1}
                                max={2}
                                step={0.1}
                                value={[imageScale]}
                                onValueChange={(value) => setImageScale(value[0])}
                            />
                            <span className="ml-2">{(imageScale * 100).toFixed(0)}%</span>
                        </div>
                    )}
                </div>

                {/* Bars Options */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Circular Bars:</label>
                    <div className="flex items-center mb-2">
                        <Switch
                            checked={barsEnabled}
                            onCheckedChange={setBarsEnabled}
                            className="mr-2"
                        />
                        <label className="font-semibold">Enable Bars</label>
                    </div>
                    {barsEnabled && (
                        <>
                            <div className="flex items-center mb-2">
                                <label className="mr-2">Color:</label>
                                <Input
                                    type="color"
                                    value={barsColor}
                                    onChange={(e) => setBarsColor(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center mb-2">
                                <label className="mr-2">Width:</label>
                                <Slider
                                    min={1}
                                    max={50}
                                    step={1}
                                    value={[barsWidth]}
                                    onValueChange={(value) => setBarsWidth(value[0])}
                                />
                                <span className="ml-2">{barsWidth}px</span>
                            </div>
                            <div className="flex items-center mb-2">
                                <label className="mr-2">Gap (Degrees):</label>
                                <Slider
                                    min={0}
                                    max={30}
                                    step={1}
                                    value={[barsGapDegrees]}
                                    onValueChange={(value) => setBarsGapDegrees(value[0])}
                                />
                                <span className="ml-2">{barsGapDegrees}°</span>
                            </div>
                            <div className="flex items-center mb-2">
                                <label className="mr-2">Round Ends:</label>
                                <Switch
                                    checked={barsRoundEnds}
                                    onCheckedChange={setBarsRoundEnds}
                                    className="mr-2"
                                />
                            </div>
                            <div className="flex items-center mb-2">
                                <label className="mr-2">Radius Offset:</label>
                                <Slider
                                    min={0}
                                    max={100}
                                    step={5}
                                    value={[barsRadiusOffset]}
                                    onValueChange={(value) => setBarsRadiusOffset(value[0])}
                                />
                                <span className="ml-2">{barsRadiusOffset}px</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Export Options */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Export Options:</label>
                    <div className="mb-2">
                        <label className="mr-2">Format:</label>
                        <select
                            value={exportFormat}
                            onChange={(e) =>
                                setExportFormat(e.target.value as "png" | "webp" | "svg")
                            }
                        >
                            <option value="png">PNG</option>
                            <option value="webp">WEBP</option>
                            <option value="svg">SVG</option>
                        </select>
                    </div>
                    {(exportFormat === "png" || exportFormat === "webp") && (
                        <div className="mb-2">
                            <label className="mr-2">Component:</label>
                            <select
                                value={exportComponent}
                                onChange={(e) =>
                                    setExportComponent(
                                        e.target.value as "full" | "foreground" | "background"
                                    )
                                }
                            >
                                <option value="full">Full</option>
                                <option value="foreground">Foreground Only</option>
                                <option value="background">Background Only</option>
                            </select>
                        </div>
                    )}
                    <div className="mb-2">
                        <label className="mr-2">Resolution:</label>
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
                        />{" "}
                        px
                    </div>
                    <button
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={handleExport}
                    >
                        Export
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRCodeGenerator;
