import React, { useEffect, useLayoutEffect } from "react";

import { GOLDEN_COLOR_SOLID, SILVER_COLOR_SOLID, BRONZE_COLOR_SOLID, IRON_COLOR_SOLID, TURNS, SEGMENTS, CENTER_X, CENTER_Y, RADIUS, formatToString, getDate, getCellAge } from "@/lib/utils";

import { useHover } from "@/hooks/useHover";


export const SpiralCalendar = ({cellData, selectedCell, handleCellClick, handleCellDoubleClick, handleHoveredCell}) => {
  const cells = [];

  let path = `M ${CENTER_X} ${CENTER_Y} `
  for (let i = 0; i <= TURNS * SEGMENTS; i++) {
    const angle = -(i / SEGMENTS) * Math.PI * 2 - Math.PI / 2;
    const r = (RADIUS * i) / (TURNS * SEGMENTS);
    const x = CENTER_X + r * Math.cos(angle);
    const y = CENTER_Y + r * Math.sin(angle);
    path += `L ${x} ${y} `;

    if (i >= SEGMENTS) {
      cells.push({ x, y });
    }
  }

  const cellsPath = Array.from({length: TURNS * SEGMENTS - SEGMENTS*2}, (_, i) => {
    return (
      <Cell
        key={i}
        i={i}
        cellData={cellData}
        selectedCell={selectedCell}
        handleCellClick={handleCellClick}
        handleCellDoubleClick={handleCellDoubleClick}
        cells={cells}
        handleHoveredCell={handleHoveredCell}
      />
    )
  });

  return (
    <>
      <path d={path} fill="none" stroke="#FFA500" strokeWidth="2" />
      {cellsPath}
    </>
  );
}



const Cell = ({i, cellData, selectedCell, handleCellClick, handleCellDoubleClick, cells, handleHoveredCell}) => {
  const [hoverRef, hovering] = useHover();

  useLayoutEffect(() => {
    if (hovering) handleHoveredCell(i);
  }, [hovering]);
  
  let stroke = "white";
  const age = getCellAge(i);
  let k = i % 20;
  if (age == "GU" || age == "GD") stroke = GOLDEN_COLOR_SOLID;
  if (age == "SU" || age == "SD") stroke = SILVER_COLOR_SOLID;
  if (age == "BU" || age == "BD") stroke = BRONZE_COLOR_SOLID;
  if (age == "IU" || age == "ID") stroke = IRON_COLOR_SOLID;

  const a_x = cells[i].x, a_y = cells[i].y;
  const b_x = cells[i+SEGMENTS].x, b_y = cells[i+SEGMENTS].y;
  const c_x = cells[i+1+SEGMENTS].x, c_y = cells[i+1+SEGMENTS].y;
  const d_x = cells[i+1].x, d_y = cells[i+1].y;

  
  const yr = cellData[i];
  const { date, month } = getDate(yr);

  return (
    <>
      <path
        ref={hoverRef}
        key={i}
        d={`M ${a_x} ${a_y}
        L ${b_x} ${b_y} 
        L ${c_x} ${c_y}
        L ${d_x} ${d_y}
        Z`}
        fill={`rgba(255, 255, 255, ${i === selectedCell ? 0.2 : hovering ? 0.1 : 0})`}
        stroke={stroke}
        strokeWidth="1"
        className="cursor-pointer"
        onClick={() => handleCellClick(i)}
        onDoubleClick={() => handleCellDoubleClick(i)}
      />
      <text
        key={"text_" + i}
        transform={`translate(${(a_x+b_x)/2}, ${(a_y+b_y)/2}) rotate(${Math.atan2(b_y - a_y, b_x - a_x) * 180 / Math.PI})`}
        textAnchor="middle"
        fill="white"
        fontSize={i <= 14 ? "8" : "10"}
        className="pointer-events-none"
      >
        <tspan x={0} dy="-0.3em">{formatToString(yr, 2)}</tspan>
        <tspan x={0} dy="-1em">{month}</tspan>
        <tspan x={0} dy="-1em">{formatToString(date, 2)}</tspan>
      </text>
    </>
  )
}
