import React from "react";

import { MONTH_MAP, YUGA_NAME_MAP, JOURNEY_MAP, YUGA_TAG, JOURNEY, GOLDEN_COLOR, SILVER_COLOR, BRONZE_COLOR, IRON_COLOR, GOLDEN_COLOR_SOLID, SILVER_COLOR_SOLID, BRONZE_COLOR_SOLID, IRON_COLOR_SOLID, KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN, INC, ANCHOR, ANCHOR_CELL, TURNS, SEGMENTS, CENTER_X, CENTER_Y, RADIUS, R1, R2, getYugaSvgData, getTag, formatToString, getDate, getCellAge } from "@/lib/utils";


const GoldenText = ({ angle }) => {
  return (
    <text
      transform={`translate(${CENTER_X + R2 * Math.cos(angle * Math.PI / 180)}, ${CENTER_Y + R2 * Math.sin(angle * Math.PI / 180)}) rotate(${angle - 90})`}
      textAnchor="middle"
      fill={GOLDEN_COLOR_SOLID}
      fontSize="7"
      className="pointer-events-none font-bold"
    >
      <tspan x="-0.6em" dy="-0.5em">{JOURNEY_MAP.GU}</tspan>
      <tspan x="0.7em" dy="0">{JOURNEY_MAP.GD}</tspan>
    </text>
  );
}

const IronText = ({ angle }) => {
  return (
    <text
      transform={`translate(${CENTER_X + R2 * Math.cos(angle * Math.PI / 180)}, ${CENTER_Y + R2 * Math.sin(angle * Math.PI / 180)}) rotate(${angle - 90})`}
      textAnchor="middle"
      fill={IRON_COLOR_SOLID}
      fontSize="7"
      className="pointer-events-none"
    >
      <tspan x="-0.4em" dy="-0.5em">{JOURNEY_MAP.ID}</tspan>
      <tspan x="0.6em" dy="0">{JOURNEY_MAP.IU}</tspan>
    </text>
  );
}

const YugaText = ({ angle }) => {
  return (
    <>
      <GoldenText angle={angle} />
      <GoldenText angle={-angle} />
      <IronText angle={angle-18} />
      <IronText angle={-angle-18} />
    </>
  )
}

export const YugaLinesSvg = () => {
  const angles = [-234, -90, -306, -162, -18];

  return (
    <>
      <circle cx={CENTER_X} cy={CENTER_Y} r={R2} stroke="white" strokeWidth="1" fill="black" />
      <circle cx={CENTER_X} cy={CENTER_Y} r={R1} stroke="white" strokeWidth="1" fill="black" />
      
      { Array.from({ length: SEGMENTS * 10 }, (_, i) => {
          const angle = -(i / SEGMENTS / 10) * Math.PI * 2;
          const x2 = CENTER_X + RADIUS * Math.cos(angle);
          const y2 = CENTER_Y + RADIUS * Math.sin(angle);
          const stroke = i % 10 
            ? `rgba(255, 255, 255, ${i % 2 ? 0.1 : 0.16})`
            : i/10 % 2 ? "#00FF00" : "#FF0000";
          const strokeWidth = i % 10 ? 0.5 : 1;
          return (
            <line
              key={i}
              x1={CENTER_X}
              y1={CENTER_Y}
              x2={x2.toFixed(12)}
              y2={y2.toFixed(12)}
              stroke={stroke}
              strokeWidth={strokeWidth}
              className="pointer-events-none"
            />
          );
        })
      }

      { Array.from({ length: 3 }, (_, i) => {
          const fac = 2.61 ** i;
          const r = fac ? R1/fac : R1;
          const rotate = i * 36;

          return (
            <path
              key={i} 
              d={`M ${CENTER_X + r * Math.cos((angles[0]+rotate) * Math.PI / 180)} ${CENTER_Y + r * Math.sin((angles[0]+rotate) * Math.PI / 180)}
                L ${CENTER_X + r * Math.cos((angles[1]+rotate) * Math.PI / 180)} ${CENTER_Y + r * Math.sin((angles[1]+rotate) * Math.PI / 180)}
                L ${CENTER_X + r * Math.cos((angles[2]+rotate) * Math.PI / 180)} ${CENTER_Y + r * Math.sin((angles[2]+rotate) * Math.PI / 180)}
                L ${CENTER_X + r * Math.cos((angles[3]+rotate) * Math.PI / 180)} ${CENTER_Y + r * Math.sin((angles[3]+rotate) * Math.PI / 180)}
                L ${CENTER_X + r * Math.cos((angles[4]+rotate) * Math.PI / 180)} ${CENTER_Y + r * Math.sin((angles[4]+rotate) * Math.PI / 180)}
                Z`}
              stroke="#FFFFFF"
              strokeWidth="1"
            />
          );
        })
      }

      { Array.from(angles, (a, i) => (
          <YugaText angle={a} key={i} />
        ))
      }

      <circle cx={CENTER_X} cy={CENTER_Y} r={RADIUS} stroke="white" strokeWidth="1" fill="none" />
      <circle cx={CENTER_X} cy={CENTER_Y} r={RADIUS + 20} stroke="white" strokeWidth="1" fill="none" />
    </>
  );
}


export const SegmentBgSvg = ({age}) => {
  const { up, down, segs, fill } = getYugaSvgData(age);

  const p1l1 = CENTER_X + RADIUS * Math.cos(-up * 2 * Math.PI / SEGMENTS);
  const p1l2 = CENTER_Y + RADIUS * Math.sin(-up * 2 * Math.PI / SEGMENTS);
  const p1a1 = CENTER_X + RADIUS * Math.cos(-(up + segs) * 2 * Math.PI / SEGMENTS);
  const p1a2 = CENTER_Y + RADIUS * Math.sin(-(up + segs) * 2 * Math.PI / SEGMENTS);

  const p2l1 = CENTER_X + RADIUS * Math.cos(-down * 2 * Math.PI / SEGMENTS);
  const p2l2 = CENTER_Y + RADIUS * Math.sin(-down * 2 * Math.PI / SEGMENTS);
  const p2a1 = CENTER_X + RADIUS * Math.cos(-(down + segs) * 2 * Math.PI / SEGMENTS);
  const p2a2 = CENTER_Y + RADIUS * Math.sin(-(down + segs) * 2 * Math.PI / SEGMENTS);
  
  return (
    <>
    <path
      d={`M ${CENTER_X} ${CENTER_Y}
        L ${p1l1.toFixed(13)} ${p1l2.toFixed(13)}
        A ${RADIUS} ${RADIUS} 0 0 0 ${p1a1.toFixed(13)} ${p1a2.toFixed(13)}
        Z`}
      fill={fill}
      strokeWidth="1"
    />
    <path
      d={`M ${CENTER_X} ${CENTER_Y}
        L ${p2l1.toFixed(13)} ${p2l2.toFixed(13)}
        A ${RADIUS} ${RADIUS} 0 0 0 ${p2a1.toFixed(13)} ${p2a2.toFixed(13)}
        Z`}
      fill={fill}
      strokeWidth="1"
    />
    </>
  )
}

export const OuterCircularTextSvg = ({radAngle, text, textFill}) => {

  return (
    <>
    <path
      d={`M ${CENTER_X} ${CENTER_Y}
      L ${CENTER_X + RADIUS * Math.cos(radAngle)} ${CENTER_X + RADIUS * Math.sin(radAngle)}`}
      stroke="blue"
      strokeWidth="1"
    />
    <path
      id="circle-text"
      d={`
      M ${CENTER_X + (RADIUS + 10) * Math.cos(radAngle + 54 * Math.PI / 180)} ${CENTER_Y + (RADIUS + 10) * Math.sin(radAngle + 54 * Math.PI / 180)}
      A ${(RADIUS + 10)} ${(RADIUS + 10)} 0 0 0 ${CENTER_X + (RADIUS + 10) * Math.cos(radAngle - 54 * Math.PI / 180)} ${CENTER_Y + (RADIUS + 10) * Math.sin(radAngle - 54 * Math.PI / 180)}`}
      className="pointer-events-none"
      fill="none"
    />
    <text
      fill={textFill}
      fontSize="10"
    >
      <textPath href="#circle-text" startOffset={"50%"} textAnchor="middle" alignmentBaseline="middle">
        {text}
      </textPath>
    </text>
    </>
  );
}
