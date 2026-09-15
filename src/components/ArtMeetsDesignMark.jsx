import {
  ART_SYMBOL, WORD_FILL, SYMBOL_FILL, SYMBOL_FILTER,
  SEQUENCE, leftSlot, rightSlot, cellsFor,
} from "./heroMark";

// ART meets design — the mark on its own.
//
// The same drawing the hero animates and the Bespoke circle holds, with
// nothing around it: no circle, no pictures behind it, no flip-board. It
// stands still and reads ART meets design. Used to close the city pages in
// place of the words typed out.
export default function ArtMeetsDesignMark({ width = "min(268px, 50vw)" }) {
  const opening = SEQUENCE[0];
  const lSlot = leftSlot(opening);
  const rSlot = rightSlot(opening);

  return (
    <svg
      viewBox="18 150 1098 880"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ART meets design"
      role="img"
      style={{ width, height: "auto", overflow: "visible" }}
    >
      <path d={ART_SYMBOL} style={{ fill: SYMBOL_FILL, filter: SYMBOL_FILTER }} />
      <g style={{ fill: WORD_FILL }}>
        {cellsFor(lSlot, opening[0]).map((c, i) => (
          <g key={i} transform={`translate(${c.x} ${lSlot.baseline})`}>
            <path d={c.d} />
          </g>
        ))}
      </g>
      <g style={{ fill: WORD_FILL }}>
        {cellsFor(rSlot, opening[1]).map((c, i) => (
          <g key={i} transform={`translate(${c.x} ${rSlot.baseline})`}>
            <path d={c.d} />
          </g>
        ))}
      </g>
    </svg>
  );
}
