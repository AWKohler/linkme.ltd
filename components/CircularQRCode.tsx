import React, { useMemo } from "react";

type QROptionType = "solid" | "gradient" | "multiple";

interface CircularQRCodeProps {
    qrcode: any;
    bgOption: "solid" | "gradient";
    bgColor: string;
    bgGradientType: "linear" | "conic";
    bgGradientColors: string[];
    bgGradientAngle: number;
    qrOption: QROptionType;
    qrColor: string;
    qrGradientType: "linear" | "conic";
    qrGradientColors: string[];
    qrGradientAngle: number;
    qrPalette: string[];
    finderPatternOption: "same" | "solid";
    finderPatternColor: string;
    showText: boolean;
    roundness: number;
    opacityVariation: number;
    finderRoundness: number;
    rectScaleX: number;
    rectScaleY: number;
    scaleVariation: number;
    rectRotation: number;
    uploadedImageDataUrl: string | null;
    imageScale: number;
    moduleSize: number;
    qrCodeSize: number;
    moduleCount: number;
    borderColor: string;
    borderWidth: number;
    centerGapWidth: number;
    centerGapHeight: number;
    backgroundCoverage: number;
    svgRef: React.RefObject<SVGSVGElement | null>;
    secondBorderEnabled: boolean;
    secondBorderColor: string;
    secondBorderRange: [number, number];
    borderTextEnabled: boolean;
    textLine1: string;
    textLine2: string;
    numTextLines: 1 | 2;
    fontFamily: string;
    fontSize: number;
    textColor: string;
    fontWeight: string;
    letterSpacing: number;
    condensed: boolean;
    textPadding: number;
    canvasSize: number;
    barsEnabled: boolean;
    barsColor: string;
    barsWidth: number;
    barsGapDegrees: number;
    barsRoundEnds: boolean;
    barsRadiusOffset: number;

    /**
     * NEW: Gradient stops for background and QR code
     * (Used to dynamically generate <stop> elements in the <defs>)
     */
    bgGradientStops?: { color: string; position: number }[];
    qrGradientStops?: { color: string; position: number }[];
}

const CircularQRCode: React.FC<CircularQRCodeProps> = ({
                                                           qrcode,
                                                           bgOption,
                                                           bgColor,
                                                           bgGradientType,
                                                           bgGradientColors,
                                                           bgGradientAngle,
                                                           qrOption,
                                                           qrColor,
                                                           qrGradientType,
                                                           qrGradientColors,
                                                           qrGradientAngle,
                                                           qrPalette,
                                                           finderPatternOption,
                                                           finderPatternColor,
                                                           showText,
                                                           roundness,
                                                           opacityVariation,
                                                           finderRoundness,
                                                           rectScaleX,
                                                           rectScaleY,
                                                           scaleVariation,
                                                           rectRotation,
                                                           uploadedImageDataUrl,
                                                           imageScale,
                                                           moduleSize,
                                                           qrCodeSize,
                                                           moduleCount,
                                                           borderColor,
                                                           borderWidth,
                                                           centerGapWidth,
                                                           centerGapHeight,
                                                           backgroundCoverage,
                                                           svgRef,
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
                                                           canvasSize,
                                                           barsEnabled,
                                                           barsColor,
                                                           barsWidth,
                                                           barsGapDegrees,
                                                           barsRoundEnds,
                                                           barsRadiusOffset,

                                                           // NEW optional props for gradient stops
                                                           bgGradientStops = [],
                                                           qrGradientStops = [],
                                                       }) => {
    // -----------------------------
    // Generate unique IDs
    // -----------------------------
    const bgGradientId = `bgGradient-${Date.now()}`;
    const qrGradientId = `qrGradient-${Date.now()}`;

    // -----------------------------
    // Background fill
    // -----------------------------
    const bgFill = bgOption === "solid" ? bgColor : `url(#${bgGradientId})`;

    // -----------------------------
    // QR fill
    // -----------------------------
    const qrFill = useMemo(() => {
        if (qrOption === "solid") {
            return qrColor;
        } else if (qrOption === "gradient") {
            return `url(#${qrGradientId})`;
        }
        // "multiple" => handled in the rect loop with random picks
        return null;
    }, [qrOption, qrColor, qrGradientId]);

    // -----------------------------
    // Basic geometry / calculations
    // -----------------------------
    const qrCodeOffsetX = (canvasSize - qrCodeSize) / 2;
    const qrCodeOffsetY = (canvasSize - qrCodeSize) / 2;
    const rxRy = (roundness / 100) * (moduleSize / 2);

    // Variation parameters
    const minOpacity = 0.7;
    const maxOpacityVariation = (opacityVariation / 100) * (1 - minOpacity);

    // Finder pattern positions for a typical QR
    const finderPatternPositions = [
        { row: 0, col: 0 },
        { row: 0, col: moduleCount - 7 },
        { row: moduleCount - 7, col: 0 },
    ];

    // Center gap
    const centerGapX = (qrCodeSize - centerGapWidth) / 2;
    const centerGapY = (qrCodeSize - centerGapHeight) / 2;

    // -----------------------------
    //  Helper: Rect Intersection
    // -----------------------------
    const rectanglesIntersect = (
        r1: { x: number; y: number; width: number; height: number },
        r2: { x: number; y: number; width: number; height: number }
    ): boolean => {
        return !(
            r2.x > r1.x + r1.width ||
            r2.x + r2.width < r1.x ||
            r2.y > r1.y + r1.height ||
            r2.y + r2.height < r1.y
        );
    };

    // -----------------------------
    //  Normal QR modules
    // -----------------------------
    const qrRects = useMemo(() => {
        const rects: React.ReactNode[] = [];

        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                const isFinderPattern = finderPatternPositions.some(
                    (pos) =>
                        row >= pos.row &&
                        row < pos.row + 7 &&
                        col >= pos.col &&
                        col < pos.col + 7
                );

                // If it's not a dark module or is part of finder => skip
                if (!qrcode.isDark(row, col) || isFinderPattern) {
                    continue;
                }

                // Coordinates in the overall QR code area
                const x = col * moduleSize;
                const y = row * moduleSize;

                // Check if it intersects center gap
                const moduleRect = { x, y, width: moduleSize, height: moduleSize };
                const gapRect = {
                    x: centerGapX,
                    y: centerGapY,
                    width: centerGapWidth,
                    height: centerGapHeight,
                };
                if (rectanglesIntersect(moduleRect, gapRect)) {
                    continue;
                }

                // Variation in opacity
                const opacity = 1 - Math.random() * maxOpacityVariation;

                // If multiple-colors => pick randomly; else use qrFill
                let fillColor: string | null = qrFill || "#000000";
                if (qrOption === "multiple") {
                    const randomIndex = Math.floor(Math.random() * qrPalette.length);
                    fillColor = qrPalette[randomIndex];
                }

                // Scale Variation => random factor in [1 - scaleVariation/100, 1.0]
                const randScaleFactor = 1 - Math.random() * (scaleVariation / 100);
                const finalScaleX = rectScaleX * randScaleFactor;
                const finalScaleY = rectScaleY * randScaleFactor;

                rects.push(
                    <g
                        key={`${row}-${col}`}
                        transform={`
              translate(${x + moduleSize / 2}, ${y + moduleSize / 2})
              rotate(${rectRotation})
              scale(${finalScaleX}, ${finalScaleY})
              translate(${-moduleSize / 2}, ${-moduleSize / 2})
            `}
                    >
                        <rect
                            width={moduleSize}
                            height={moduleSize}
                            rx={rxRy}
                            ry={rxRy}
                            fill={fillColor}
                            style={{
                                shapeRendering: "crispEdges",
                                opacity: opacity,
                            }}
                        />
                    </g>
                );
            }
        }
        return rects;
    }, [
        moduleCount,
        moduleSize,
        qrcode,
        rxRy,
        maxOpacityVariation,
        qrFill,
        finderPatternPositions,
        centerGapX,
        centerGapY,
        centerGapWidth,
        centerGapHeight,
        qrOption,
        qrPalette,
        rectScaleX,
        rectScaleY,
        scaleVariation,
        rectRotation,
    ]);

    // -----------------------------
    //  Finder Patterns
    // -----------------------------
    const finderPatterns = useMemo(() => {
        const patterns: React.ReactNode[] = [];

        finderPatternPositions.forEach((pos, index) => {
            const xOuter = pos.col * moduleSize;
            const yOuter = pos.row * moduleSize;
            const sizeOuter = moduleSize * 7;
            const sizeMiddle = moduleSize * 5;
            const sizeInner = moduleSize * 3;
            const maxRadius = sizeInner / 2;

            const rxRyFinder = Math.min(
                (finderRoundness / 100) * (sizeOuter / 2),
                maxRadius
            );

            const offsetMiddle = (sizeOuter - sizeMiddle) / 2;
            const offsetInner = (sizeOuter - sizeInner) / 2;

            // Decide finder fill based on user choice
            let finderFill =
                finderPatternOption === "solid" ? finderPatternColor : qrFill;

            if (finderPatternOption === "same") {
                if (qrOption === "multiple") {
                    const randomIndex = Math.floor(Math.random() * qrPalette.length);
                    finderFill = qrPalette[randomIndex];
                } else if (qrOption === "gradient") {
                    finderFill = `url(#${qrGradientId})`;
                } else {
                    finderFill = qrColor;
                }
            }

            patterns.push(
                <g key={`finder-${index}`}>
                    {/* Outer + Middle squares */}
                    <path
                        d={`
              M ${xOuter + rxRyFinder},${yOuter}
              h ${sizeOuter - 2 * rxRyFinder}
              q ${rxRyFinder},0 ${rxRyFinder},${rxRyFinder}
              v ${sizeOuter - 2 * rxRyFinder}
              q 0,${rxRyFinder} -${rxRyFinder},${rxRyFinder}
              h -${sizeOuter - 2 * rxRyFinder}
              q -${rxRyFinder},0 -${rxRyFinder},-${rxRyFinder}
              v -${sizeOuter - 2 * rxRyFinder}
              q 0,-${rxRyFinder} ${rxRyFinder},-${rxRyFinder}
              z

              M ${xOuter + offsetMiddle + rxRyFinder},${yOuter + offsetMiddle}
              h ${sizeMiddle - 2 * rxRyFinder}
              q ${rxRyFinder},0 ${rxRyFinder},${rxRyFinder}
              v ${sizeMiddle - 2 * rxRyFinder}
              q 0,${rxRyFinder} -${rxRyFinder},${rxRyFinder}
              h -${sizeMiddle - 2 * rxRyFinder}
              q -${rxRyFinder},0 -${rxRyFinder},-${rxRyFinder}
              v -${sizeMiddle - 2 * rxRyFinder}
              q 0,-${rxRyFinder} ${rxRyFinder},-${rxRyFinder}
              z
            `}
                        fill={finderFill!}
                        fillRule="evenodd"
                    />
                    {/* Inner square */}
                    <rect
                        x={xOuter + offsetInner}
                        y={yOuter + offsetInner}
                        width={sizeInner}
                        height={sizeInner}
                        rx={rxRyFinder}
                        ry={rxRyFinder}
                        fill={finderFill!}
                    />
                </g>
            );
        });

        return patterns;
    }, [
        moduleSize,
        finderRoundness,
        finderPatternPositions,
        qrFill,
        qrOption,
        qrPalette,
        finderPatternOption,
        finderPatternColor,
        qrColor,
        qrGradientId,
    ]);

    // -----------------------------
    //  Background rects
    // -----------------------------
    const backgroundRects = useMemo(() => {
        const rects: React.ReactNode[] = [];
        const gridCount = Math.ceil(canvasSize / moduleSize);
        const radius = canvasSize / 2;

        const coverageRadius = (backgroundCoverage / 100) * radius;
        const maxDistanceAllowed =
            coverageRadius - (moduleSize * Math.SQRT2) / 2; // approximate

        for (let row = 0; row < gridCount; row++) {
            for (let col = 0; col < gridCount; col++) {
                const x = col * moduleSize;
                const y = row * moduleSize;
                const rectCenterX = x + moduleSize / 2;
                const rectCenterY = y + moduleSize / 2;
                const dx = rectCenterX - radius;
                const dy = rectCenterY - radius;
                const distanceToCenter = Math.sqrt(dx * dx + dy * dy);

                // If it is outside coverage area => skip
                if (distanceToCenter > maxDistanceAllowed) {
                    continue;
                }

                // If it's inside the QR code bounding box => skip
                if (
                    x >= qrCodeOffsetX &&
                    x < qrCodeOffsetX + qrCodeSize &&
                    y >= qrCodeOffsetY &&
                    y < qrCodeOffsetY + qrCodeSize
                ) {
                    continue;
                }

                // For background pattern, let's randomly fill ~half of them
                if (Math.random() < 0.5) {
                    const opacity = 1 - Math.random() * maxOpacityVariation;
                    let fillColor: string | null = qrFill || "#000000";

                    if (qrOption === "multiple") {
                        const randomIndex = Math.floor(Math.random() * qrPalette.length);
                        fillColor = qrPalette[randomIndex];
                    }

                    // Scale Variation => random factor in [1 - scaleVariation/100, 1.0]
                    const randScaleFactor = 1 - Math.random() * (scaleVariation / 100);
                    const finalScaleX = rectScaleX * randScaleFactor;
                    const finalScaleY = rectScaleY * randScaleFactor;

                    rects.push(
                        <g
                            key={`bg-${row}-${col}`}
                            transform={`
                translate(${x + moduleSize / 2}, ${y + moduleSize / 2})
                rotate(${rectRotation})
                scale(${finalScaleX}, ${finalScaleY})
                translate(${-moduleSize / 2}, ${-moduleSize / 2})
              `}
                        >
                            <rect
                                width={moduleSize}
                                height={moduleSize}
                                rx={rxRy}
                                ry={rxRy}
                                fill={fillColor!}
                                style={{
                                    opacity: opacity,
                                }}
                            />
                        </g>
                    );
                }
            }
        }

        return rects;
    }, [
        canvasSize,
        moduleSize,
        qrCodeOffsetX,
        qrCodeOffsetY,
        qrCodeSize,
        rxRy,
        maxOpacityVariation,
        qrFill,
        backgroundCoverage,
        qrOption,
        qrPalette,
        rectScaleX,
        rectScaleY,
        scaleVariation,
        rectRotation,
    ]);

    // -----------------------------
    //  Circular border geometry
    // -----------------------------
    const outerRadius = canvasSize / 2;
    const innerRadius = outerRadius - borderWidth;

    // Helper to create annulus path
    const generateAnnulusPath = (
        cx: number,
        cy: number,
        rOuter: number,
        rInner: number
    ): string => {
        return `
      M ${cx + rOuter}, ${cy}
      A ${rOuter},${rOuter} 0 1,0 ${cx - rOuter},${cy}
      A ${rOuter},${rOuter} 0 1,0 ${cx + rOuter},${cy}
      M ${cx + rInner}, ${cy}
      A ${rInner},${rInner} 0 1,1 ${cx - rInner},${cy}
      A ${rInner},${rInner} 0 1,1 ${cx + rInner},${cy}
      Z
    `;
    };

    let secondBorderPath = "";
    if (secondBorderEnabled) {
        const secondBorderOuterRadius =
            outerRadius - (secondBorderRange[0] / 100) * borderWidth;
        const secondBorderInnerRadius =
            outerRadius - (secondBorderRange[1] / 100) * borderWidth;

        secondBorderPath = generateAnnulusPath(
            canvasSize / 2,
            canvasSize / 2,
            secondBorderOuterRadius,
            secondBorderInnerRadius
        );
    }

    // -----------------------------
    //  Border text
    // -----------------------------
    const textPaths = useMemo(() => {
        const paths: React.ReactNode[] = [];
        if (borderTextEnabled) {
            const textRadius = outerRadius - borderWidth / 2 - textPadding;
            const textPathId1 = `textPath1-${Date.now()}`;
            const textPathId2 = `textPath2-${Date.now()}`;

            // Top semicircle
            paths.push(
                <defs key="textDefs">
                    <path
                        id={textPathId1}
                        d={`
              M ${canvasSize / 2 - textRadius}, ${canvasSize / 2}
              A ${textRadius},${textRadius} 0 0,1 ${
                            canvasSize / 2 + textRadius
                        }, ${canvasSize / 2}
            `}
                    />
                </defs>
            );

            paths.push(
                <text
                    className="borderText"
                    textAnchor="middle"
                    fontFamily={fontFamily}
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    letterSpacing={letterSpacing}
                    fill={textColor}
                    style={{
                        fontStretch: condensed ? "condensed" : "normal",
                    }}
                    key="borderText1"
                >
                    <textPath
                        xlinkHref={`#${textPathId1}`}
                        startOffset="50%"
                        dominantBaseline="middle"
                    >
                        {textLine1}
                    </textPath>
                </text>
            );

            if (numTextLines === 2) {
                // Bottom semicircle
                paths.push(
                    <defs key="textDefs2">
                        <path
                            id={textPathId2}
                            d={`
                M ${canvasSize / 2 - textRadius}, ${canvasSize / 2}
                A ${textRadius},${textRadius} 0 0,0 ${
                                canvasSize / 2 + textRadius
                            }, ${canvasSize / 2}
              `}
                        />
                    </defs>
                );

                paths.push(
                    <text
                        className="borderText"
                        textAnchor="middle"
                        fontFamily={fontFamily}
                        fontSize={fontSize}
                        fontWeight={fontWeight}
                        letterSpacing={letterSpacing}
                        fill={textColor}
                        style={{
                            fontStretch: condensed ? "condensed" : "normal",
                        }}
                        key="borderText2"
                    >
                        <textPath
                            xlinkHref={`#${textPathId2}`}
                            startOffset="50%"
                            dominantBaseline="middle"
                        >
                            {textLine2}
                        </textPath>
                    </text>
                );
            }
        }
        return paths;
    }, [
        borderTextEnabled,
        textLine1,
        textLine2,
        numTextLines,
        fontFamily,
        fontSize,
        fontWeight,
        letterSpacing,
        condensed,
        textColor,
        textPadding,
        outerRadius,
        canvasSize,
        borderWidth,
    ]);

    // -----------------------------
    //  Finder Bars
    // -----------------------------
    const finderBars = useMemo(() => {
        if (!barsEnabled) return null;
        const cx = canvasSize / 2;
        const cy = canvasSize / 2;

        // Calculate the center positions of each finder pattern
        const fps = finderPatternPositions.map((pos) => {
            const fx = pos.col + 3.5; // center of finder
            const fy = pos.row + 3.5;
            const canvasX = qrCodeOffsetX + fx * moduleSize;
            const canvasY = qrCodeOffsetY + fy * moduleSize;
            return { x: canvasX, y: canvasY };
        });

        const anglesAndDistances = fps.map((p) => {
            const dx = p.x - cx;
            const dy = p.y - cy;
            const angle = Math.atan2(dy, dx);
            const dist = Math.sqrt(dx * dx + dy * dy);
            return { angle, dist };
        });

        // Sort by angle in ascending order
        anglesAndDistances.sort((a, b) => a.angle - b.angle);

        // Determine the furthest distance
        const maxDist = Math.max(...anglesAndDistances.map((ad) => ad.dist));
        const radius = maxDist + barsRadiusOffset;

        // Convert gap in degrees to radians
        const gapRad = (barsGapDegrees * Math.PI) / 180;

        const arcs: React.ReactNode[] = [];
        for (let i = 0; i < anglesAndDistances.length; i++) {
            const start = anglesAndDistances[i].angle;
            // If we hit the last point, connect it around 2π back to the first
            const end =
                i === anglesAndDistances.length - 1
                    ? anglesAndDistances[0].angle + 2 * Math.PI
                    : anglesAndDistances[i + 1].angle;

            // Trim angles by gap
            const startAngle = start + gapRad;
            const endAngle = end - gapRad;
            if (endAngle <= startAngle) {
                continue;
            }

            const xStart = cx + radius * Math.cos(startAngle);
            const yStart = cy + radius * Math.sin(startAngle);
            const xEnd = cx + radius * Math.cos(endAngle);
            const yEnd = cy + radius * Math.sin(endAngle);

            const arcAngle = endAngle - startAngle;
            const largeArcFlag = arcAngle > Math.PI ? 1 : 0;

            arcs.push(
                <path
                    key={`bar-arc-${i}`}
                    d={`M ${xStart},${yStart} A ${radius},${radius} 0 ${largeArcFlag},1 ${xEnd},${yEnd}`}
                    fill="none"
                    stroke={barsColor}
                    strokeWidth={barsWidth}
                    strokeLinecap={barsRoundEnds ? "round" : "butt"}
                />
            );
        }

        return <g className="finderBars">{arcs}</g>;
    }, [
        barsEnabled,
        barsColor,
        barsWidth,
        barsGapDegrees,
        barsRoundEnds,
        barsRadiusOffset,
        canvasSize,
        finderPatternPositions,
        moduleSize,
        qrCodeOffsetX,
        qrCodeOffsetY,
    ]);

    // -----------------------------
    //  RENDER
    // -----------------------------
    return (
        <svg
            ref={svgRef}
            className="frame"
            viewBox={`0 0 ${canvasSize} ${canvasSize}`}
            width={canvasSize}
            height={canvasSize}
        >
            <defs>
                {/* Background Gradient */}
                {bgOption === "gradient" && (
                    <>
                        {bgGradientType === "linear" && (
                            <linearGradient
                                id={bgGradientId}
                                gradientUnits="userSpaceOnUse"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="0%"
                                gradientTransform={`rotate(${bgGradientAngle}, ${
                                    canvasSize / 2
                                }, ${canvasSize / 2})`}
                            >
                                {bgGradientStops.map((stop, index) => (
                                    <stop
                                        key={index}
                                        offset={`${stop.position}%`}
                                        stopColor={stop.color}
                                    />
                                ))}
                            </linearGradient>
                        )}
                        {bgGradientType === "conic" && (
                            <radialGradient
                                id={bgGradientId}
                                gradientUnits="userSpaceOnUse"
                                cx="50%"
                                cy="50%"
                                r="50%"
                                fx="50%"
                                fy="50%"
                            >
                                {bgGradientStops.map((stop, index) => (
                                    <stop
                                        key={index}
                                        offset={`${stop.position}%`}
                                        stopColor={stop.color}
                                    />
                                ))}
                            </radialGradient>
                        )}
                    </>
                )}

                {/* QR Code Gradient */}
                {qrOption === "gradient" && (
                    <>
                        {qrGradientType === "linear" && (
                            <linearGradient
                                id={qrGradientId}
                                gradientUnits="userSpaceOnUse"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="0%"
                                gradientTransform={`rotate(${qrGradientAngle}, ${
                                    canvasSize / 2
                                }, ${canvasSize / 2})`}
                            >
                                {qrGradientStops.map((stop, index) => (
                                    <stop
                                        key={index}
                                        offset={`${stop.position}%`}
                                        stopColor={stop.color}
                                    />
                                ))}
                            </linearGradient>
                        )}
                        {qrGradientType === "conic" && (
                            <radialGradient
                                id={qrGradientId}
                                gradientUnits="userSpaceOnUse"
                                cx="50%"
                                cy="50%"
                                r="50%"
                                fx="50%"
                                fy="50%"
                            >
                                {qrGradientStops.map((stop, index) => (
                                    <stop
                                        key={index}
                                        offset={`${stop.position}%`}
                                        stopColor={stop.color}
                                    />
                                ))}
                            </radialGradient>
                        )}
                    </>
                )}
            </defs>

            {/* Background Circle (solid or gradient) */}
            {(bgOption === "solid" || bgOption === "gradient") && (
                <circle
                    className="circle-background"
                    cx={canvasSize / 2}
                    cy={canvasSize / 2}
                    r={canvasSize / 2}
                    fill={bgFill}
                ></circle>
            )}

            {/* Optional Background Rects (if user wants them) */}
            <g className="backgroundRects" id="backgroundRects">
                {backgroundRects}
            </g>

            {/* Outer Border (circle) */}
            <circle
                cx={canvasSize / 2}
                cy={canvasSize / 2}
                r={outerRadius - borderWidth / 2}
                fill="none"
                stroke={borderColor}
                strokeWidth={borderWidth}
            />

            {/* Second Border (annulus) */}
            {secondBorderEnabled && (
                <path d={secondBorderPath} fill={secondBorderColor} />
            )}

            {/* Text on Border */}
            {borderTextEnabled && <g className="borderText">{textPaths}</g>}

            {/* Finder Bars */}
            {barsEnabled && finderBars}

            {/* QR Code: modules + finder patterns */}
            <g
                className="qrcode"
                style={{
                    transform: `translate(${qrCodeOffsetX}px, ${qrCodeOffsetY}px)`,
                }}
            >
                {/* Non-finder modules */}
                <g className="qrRects">{qrRects}</g>

                {/* Finder Patterns */}
                <g className="finderPatterns">{finderPatterns}</g>
            </g>

            {/* Optional center image */}
            {uploadedImageDataUrl && (
                <g
                    className="overlayImage"
                    style={{
                        transform: `translate(${qrCodeOffsetX}px, ${qrCodeOffsetY}px)`,
                    }}
                >
                    <image
                        href={uploadedImageDataUrl}
                        x={(qrCodeSize - qrCodeSize * 0.3 * imageScale) / 2}
                        y={(qrCodeSize - qrCodeSize * 0.3 * imageScale) / 2}
                        width={qrCodeSize * 0.3 * imageScale}
                        height={qrCodeSize * 0.3 * imageScale}
                        preserveAspectRatio="xMidYMid slice"
                        style={{ pointerEvents: "none" }}
                    />
                </g>
            )}
        </svg>
    );
};

export default CircularQRCode;
