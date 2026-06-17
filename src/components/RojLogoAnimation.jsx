import React, { useEffect, useRef, useState } from "react";

// Path data extracted from ROJ Logo A–E SVGs
// Each path represents one element of the logo build
const PATHS = [
  // 0: R top stroke (visible in A, B, C, D, E)
  "M7086.0361,1741.54H4946.8721c-858.1013,0-1553.7302,695.6287-1553.7302,1553.7305v5580.1104c0,51.1924,41.499,92.6914,92.6907,92.6914h664.7988c51.1919,0,92.6909-41.499,92.6909-92.6914V3397.7905c0-445.1804,360.8896-864.4507,806.0698-864.4507h1712.2266c230.3628,0,417.1084-186.7458,417.1084-417.1084v-282.0006C7178.7271,1783.0391,7137.228,1741.54,7086.0361,1741.54z",
  // 1: R bottom arc (visible from C onwards)
  "M7621.1328,7494.7979v3399.6387c0,371.1396-300.8682,672.0078-672.0078,672.0078H4915.3301c-371.1396,0-672.0078-300.8682-672.0078-672.0078v-308.4424c0-51.1914-41.499-92.6904-92.6909-92.6904h-664.7988c-51.1917,0-92.6907,41.499-92.6907,92.6904v323.2236c0,806.2695,653.6104,1459.8799,1459.8796,1459.8799h2158.4121c806.269,0,1459.8799-653.6104,1459.8799-1459.8799V6830c0-51.1919-41.499-92.6909-92.6914-92.6909h-0.001C7960.272,6737.3091,7621.1328,7076.4482,7621.1328,7494.7979z",
  // 2: O small inner circle (visible from B onwards)
  "M8052.4214,3115.502c-1606.6006,0-2909.0073,1302.4072-2909.0073,2909.0078c0,1368.9053,945.5371,2516.9629,2219.1309,2826.709v-840.4663C6540.4531,7725.252,5950.3188,6943.812,5950.3188,6024.5098c0-1160.9585,941.144-2102.1021,2102.1025-2102.1021s2102.1011,941.1436,2102.1011,2102.1021c0,919.3022-590.1318,1700.7422-1412.2246,1986.2427v840.4663c1273.5947-309.7461,2219.1318-1457.8037,2219.1318-2826.709C10961.4297,4417.9092,9659.0225,3115.502,8052.4214,3115.502z",
  // 3: O large outer circle (visible only in E — always last)
  "M8043.5825,2558.3904c-1914.2852,0-3466.1196,1551.8342-3466.1196,3466.1194c0,1678.0601,1192.4751,3077.5879,2776.2432,3397.4443v-198.5693c-1475.6489-316.7227-2581.8804-1628.605-2581.8804-3198.875c0-1806.9409,1464.8159-3271.7568,3271.7568-3271.7568s3271.7573,1464.8159,3271.7573,3271.7568c0,1570.27-1106.2314,2882.1523-2581.8809,3198.875v198.5693c1583.7686-319.8564,2776.2432-1719.3843,2776.2432-3397.4443C11509.7021,4110.2246,9957.8672,2558.3904,8043.5825,2558.3904z",
  // 4: Rounded rectangle frame (Logo D)
  "M1408.7272,2837.2585v8434.8584c0,1433.3672,1161.9738,2595.3408,2595.3413,2595.3408h6349.3174c1433.3672,0,2595.3418-1161.9736,2595.3418-2595.3408V2837.2585c0-1433.3674-1161.9746-2595.3413-2595.3418-2595.3413H4004.0684C2570.7009,241.9172,1408.7272,1403.8911,1408.7272,2837.2585z M10330.2129,13635.7314H4027.2412c-1318.186,0-2386.7871-1068.6016-2386.7871-2386.7871V2860.4307c0-1318.1862,1068.601-2386.7871,2386.7871-2386.7871h6302.9717c1318.1865,0,2386.7871,1068.601,2386.7871,2386.7871v8388.5137C12717,12567.1299,11648.3994,13635.7314,10330.2129,13635.7314z",
];

// Canonical A→E build order: R-top, O-small, R-bottom, frame, O-large
const BUILD_ORDER = [0, 2, 1, 4, 3];

const STEP_IN  = 950;   // ms between each path fading in
const STEP_OUT = 650;   // ms between each path fading out (rewind)
const HOLD     = 7000;  // ms to hold full logo before rewinding
const FADE_DUR = 1600;  // CSS transition duration (ms)
const PAUSE    = 1000;  // gap between rewind end and next cycle start

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function RojLogoAnimation({ visible }) {
  const [shown, setShown] = useState(new Set());
  const [holding, setHolding] = useState(false);
  const timers = useRef([]);
  const cycleCount = useRef(0);
  const running = useRef(false);

  function clearAll() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function after(ms, fn) {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
    return ms;
  }

  function runCycle() {
    if (!running.current) return;
    cycleCount.current += 1;

    // Every 3rd cycle: canonical A→E build. Otherwise: random, O-large always last.
    const isBuild = cycleCount.current % 3 === 1;
    const order = isBuild
      ? [...BUILD_ORDER]
      : [...shuffle([0, 1, 2, 4]), 3];

    let t = 0;

    // Fade in each path
    order.forEach(idx => {
      t += STEP_IN;
      after(t, () => {
        if (!running.current) return;
        setShown(prev => new Set([...prev, idx]));
      });
    });

    // Hold at full logo — activate drop shadow
    after(t, () => { if (running.current) setHolding(true); });
    t += HOLD;

    // Rewind — remove drop shadow, reverse order
    after(t, () => { if (running.current) setHolding(false); });
    [...order].reverse().forEach(idx => {
      t += STEP_OUT;
      after(t, () => {
        if (!running.current) return;
        setShown(prev => { const n = new Set(prev); n.delete(idx); return n; });
      });
    });

    // Pause then next cycle
    t += FADE_DUR + PAUSE;
    after(t, () => {
      if (!running.current) return;
      runCycle();
    });
  }

  useEffect(() => {
    if (!visible) {
      running.current = false;
      clearAll();
      setShown(new Set());
      return;
    }
    running.current = true;
    cycleCount.current = 0;
    const t = setTimeout(runCycle, 600);
    return () => {
      running.current = false;
      clearTimeout(t);
      clearAll();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <svg
      viewBox="0 0 14173.2285 14173.2285"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "100%", height: "100%", display: "block",
        filter: holding ? "drop-shadow(0 0 8px rgba(237,232,223,0.45)) drop-shadow(0 2px 18px rgba(0,0,0,0.55))" : "none",
        transition: "filter 1.2s ease",
      }}
    >
      {PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="#EDE8DF"
          style={{
            opacity: shown.has(i) ? 0.38 : 0,
            transition: `opacity ${FADE_DUR}ms ease`,
          }}
        />
      ))}
    </svg>
  );
}
