/**
 * BASE CYCLE
 * Golden Age: 5184 yrs   72°
 * Silver Age: 3888 yrs   54°
 * Bronze Age: 2592 yrs   36°
 * Iron Age  : 1296 yrs   18°
 * 
 * Total     : 12960 yrs  180°
 * Maha Yuga : 25920 yrs  360°
 * 
 * Base/1000 is of significant importance.
 */

import React, { useState, useEffect, useCallback } from "react";

import { YUGA_NAME_MAP, JOURNEY_MAP, JOURNEY_TAG, GOLDEN_COLOR_SOLID, SILVER_COLOR_SOLID, BRONZE_COLOR_SOLID, IRON_COLOR_SOLID, KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN, INC, ANCHOR, ANCHOR_CELL, TURNS, SEGMENTS, CENTER_X, CENTER_Y, RADIUS, JOURNEY, getTag, formatToString, getDate, getCellAge } from "@/lib/utils";

import { YugaLinesSvg, SegmentBgSvg } from "./calendarSvg";
import { SpiralCalendar } from "./spiralCalendar";



export const Calaendar = () => {
  const [selectedCell, setSelectedCell] = useState(null);

  const [masterData, setMasterData] = useState([]);

  // const [selectedSegment, setSelectedSegment] = useState("b_1");
  const [factor, setFactor] = useState(1);
  const [anchor, setAnchor] = useState(ANCHOR);
  const [anchorCell, setAnchorCell] = useState(ANCHOR_CELL);

  const [journey, setJourney] = useState(JOURNEY);

  useEffect(() => {
    let md = [];
    for (let i = 0; i <= TURNS * SEGMENTS - SEGMENTS*2; i++) {
      if (i >= anchorCell) {
        md.push(anchor + (i - anchorCell) * (INC / factor));
      } else if (i < anchorCell) {
        md.push(anchor - (anchorCell - i) * (INC / factor));
      }
    }
    console.log("Master Data Changed: ", md.length, TURNS * SEGMENTS - SEGMENTS*2)
    setMasterData(md);
  }, [factor, anchor, anchorCell]);

  const handleCellNext = useCallback(() => {
    setSelectedCell((index) => {
      if (index === 59) {
        setAnchor(masterData[index]);
        index -= 20;
        setAnchorCell(index);
      }
      index += 1;
      setJourney((prevJ) => {
        prevJ[getTag(factor)] = { age: getCellAge(index), yr: masterData[index], cell: index };
        console.log({ age: getCellAge(index), yr: masterData[index], cell: index });
        return prevJ;
      });
      return index;
    });
  }, [masterData, factor]);

  const handleCellPrev = useCallback(() => {
    setSelectedCell((index) => {
      if (index === 0) {
        setAnchor(masterData[index]);
        index += 20;
        setAnchorCell(index);
      }
      index -= 1;
      setJourney((prevJ) => {
        prevJ[getTag(factor)] = { age: getCellAge(index), yr: masterData[index], cell: index };
        console.log({ age: getCellAge(index), yr: masterData[index], cell: index });
        return prevJ;
      });
      return index;
    });
  }, [masterData, factor]);

  const handleCellUp = useCallback(() => {
    setSelectedCell((prev) => {
      let index = prev - 20;
      if (index < 0) {
        setAnchor(masterData[prev]);
        prev += 20;
        index += 20;
        setAnchorCell(prev);
      }
      setJourney((prevJ) => {
        prevJ[getTag(factor)] = { age: getCellAge(index), yr: masterData[index], cell: index };
        console.log({ age: getCellAge(index), yr: masterData[index], cell: index });
        return prevJ;
      });
      return index;
    });
  }, [masterData, factor]);

  const handleCellDown = useCallback(() => {
    setSelectedCell((prev) => {
      let index = prev + 20;
      if (index > 59) {
        setAnchor(masterData[prev]);
        prev -= 20;
        index -= 20;
        setAnchorCell(prev);
      }
      setJourney((prevJ) => {
        prevJ[getTag(factor)] = { age: getCellAge(index), yr: masterData[index], cell: index };
        console.log({ age: getCellAge(index), yr: masterData[index], cell: index });
        return prevJ;
      });
      return index;
    });
  }, [masterData, factor]);

  const handleYugaIn = useCallback(() => {
    setFactor((prevFactor) => {
      let nextFactor = prevFactor * 10
      if (nextFactor > 100000) {
        nextFactor = prevFactor;
      } else {
        setAnchor(masterData[selectedCell]);
        const index = selectedCell % 2 ? 25 : 35;
        setSelectedCell(index);
        setAnchorCell(index);
        setJourney((prevJ) => {
          prevJ[getTag(nextFactor)] = { age: getCellAge(index), yr: masterData[selectedCell], cell: index };
          console.log({ age: getCellAge(index), yr: masterData[selectedCell], cell: index });
          return prevJ;
        });
      }
      return nextFactor;
    });
  }, [masterData, selectedCell]);

  const handleYugaOut = useCallback(() => {
    setFactor((prevFactor) => {
      let nextFactor = prevFactor / 10
      if (nextFactor < 1) {
        nextFactor = prevFactor;
      } else {
        setJourney((prevJ) => {
          let lastJ = prevJ[getTag(nextFactor)];
          setAnchor(lastJ.yr);
          setSelectedCell(lastJ.cell);
          setAnchorCell(lastJ.cell);
          console.log("OUT: ", { age: lastJ.age, yr: lastJ.yr, cell: lastJ.cell });
          prevJ[getTag(prevFactor)] = { age: "", yr: "", cell: 0 };
          return prevJ;
        });
      }
      return nextFactor;
    });
  }, []);

  const handleCellClick = useCallback((index) => {
    setSelectedCell(index);
    setJourney((prev) => {
      prev[getTag(factor)] = { age: getCellAge(index), yr: masterData[index], cell: index };
      console.log({ age: getCellAge(index), yr: masterData[index], cell: index });
      return prev;
    });
  }, [masterData, factor]);

  useEffect(() => {
    const down = (event) => {
      if (event.keyCode === KEY_LEFT) { // && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        handleCellPrev();
      }
      if (event.keyCode === KEY_RIGHT) { // && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        handleCellNext();
      }
      if (event.keyCode === KEY_UP) { // && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        handleCellUp();
      }
      if (event.keyCode === KEY_DOWN) { // && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        handleCellDown();
      }
      if (event.key === "i" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        handleYugaIn();
      }
      if (event.key === "o" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        handleYugaOut();
      }
    }
    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, [handleCellPrev, handleCellNext, handleCellUp, handleCellDown, handleYugaIn, handleYugaOut]);


  const getJourneyInfo = useCallback(() => {
    return (
      <div className="flex flex-row gap-2 justify-between">
        {Array.from(JOURNEY_TAG, (tag) => (
          <div className="flex flex-col h-wrap w-full items-center justify-center p-2 bg-black rounded-md">
            <span>{JOURNEY_MAP[journey[tag].age]}</span>
            <span>{formatToString(journey[tag].yr, 2)}</span>
          </div>
        ))}
      </div>
    )
  }, [journey]);

  const getCellInfo = useCallback((index) => {
    const yr = masterData[index];
    const {month, date} = getDate(yr);
    
    return (
      <div className="flex flex-row gap-6">
        <p>{formatToString(yr)} {yr < 0 ? "BCE" : "CE"}</p>
        
        <p>{`${month} \t ${formatToString(date)}`}</p>
        <p>Age: {YUGA_NAME_MAP[getCellAge(selectedCell)]}</p>
        <p>Cell: {index}</p>
      </div>
    );
  },[masterData, selectedCell]);

  const getSysInfo = () => {
    return (
      <div className="flex flex-row gap-6">
        <p>Factor: {factor}</p>
        <p>Anchor: {anchor}</p>
        <p>AnchorCell: {anchorCell}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white select-none">
      <svg width="100%" height="100%" viewBox="0 0 600 600" className="max-w-screen relative">

        <SegmentBgSvg age="golden-age" />
        <SegmentBgSvg age="silver-age" />
        <SegmentBgSvg age="bronze-age" />
        <SegmentBgSvg age="iron-age" />

        
        <SpiralCalendar masterData={masterData} selectedCell={selectedCell} handleCellClick={handleCellClick} />
        <YugaLinesSvg />

        {/* Central text */}
        {/* <text x={CENTER_X} y={CENTER_Y} textAnchor="middle" fill="white" fontSize="10">
          <tspan x={CENTER_X} dy="-1em">GOLDEN AGE</tspan>
        </text> */}

        {/* Highlight selected segment */}
        {/* {selectedSegment !== null && (
          <path
            d={`M ${CENTER_X} ${CENTER_Y} L ${CENTER_X + RADIUS * Math.cos(-selectedSegment * 2 * Math.PI / SEGMENTS)} ${CENTER_Y + RADIUS * Math.sin(-selectedSegment * 2 * Math.PI / SEGMENTS)} A ${RADIUS} ${RADIUS} 0 0 0 ${CENTER_X + RADIUS * Math.cos(-(selectedSegment + 1) * 2 * Math.PI / SEGMENTS)} ${CENTER_Y + RADIUS * Math.sin(-(selectedSegment + 1) * 2 * Math.PI / SEGMENTS)} Z`}
            fill="rgba(255, 255, 255, 0.2)"
            stroke="white"
            strokeWidth="1"
          />
        )} */}
      </svg>

      <div className="mt-4 p-2 bg-gray-800 rounded-lg shadow-lg w-full flex flex-col items-center justify-between gap-2">
        <div className="flex flex-col gap-2">
          {getJourneyInfo()}
          {/* <h2 className="text-xl font-semibold mb-2">Selected Cell</h2> */}
          {selectedCell !== null ? (
            getCellInfo(selectedCell)
          ) : (
            <p>No cell selected</p>
          )}
          {getSysInfo()}
        </div>
        <div className="flex flex-row gap-4">
          <div
            className="flex flex-row gap-2"
          >
            <button
              type="button"
              className="h-wrap w-wrap bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              // disabled={selectedCell === null}
              onClick={() => handleCellUp()}
            >up</button>
            <button
              type="button"
              className="h-wrap w-wrap bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              // disabled={selectedCell === null}
              onClick={() => handleCellDown()}
            >down</button>
          </div>
          <div
            className="flex flex-row gap-2"
          >
            <button
              type="button"
              className="h-wrap w-wrap bg-red-500 disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
              disabled={selectedCell === null}
              onClick={() => handleYugaIn()}
            >IN</button>
            <button
              type="button"
              className="h-wrap w-wrap bg-red-500 disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
              disabled={selectedCell === null}
              onClick={() => handleYugaOut()}
            >OUT</button>
          </div>
        </div>
      </div>
    </div>
  )
};

