import { AutonomyLadder, DesignSteps } from "./CaseDiagrams";

export default function Framework() {
  return (
    <>
      <h2>The five steps</h2>
      <p>Any "design an AI system" question can be answered in this order. Say each step out loud.</p>
      <DesignSteps />
      <ul>
        <li><b>Business:</b> who is hurting, how, and what it costs.</li>
        <li><b>Requirements:</b> what it must <i>do</i>, then how well (speed, accuracy, cost, privacy, scale).</li>
        <li><b>Architecture:</b> one diagram, one line per box.</li>
        <li><b>Deep dive:</b> how it fails, how you measure it, how you keep it safe and cheap.</li>
        <li><b>Why this shape:</b> why this much autonomy and no more.</li>
      </ul>

      <h2>The autonomy ladder</h2>
      <p>The three cases sit on different rungs. The skill is choosing the rung, not building the fanciest one.</p>
      <AutonomyLadder />
      <ul>
        <li>Design the boring path first. Add autonomy only where the path cannot be known in advance.</li>
        <li>Anything that moves money, changes records or reaches a customer gets a human or a hard limit.</li>
      </ul>

      <h2>Questions to ask in requirements</h2>
      <ul>
        <li>Who uses it, and what may it <i>do</i>: answer, draft, or act?</li>
        <li>How wrong can it be, and who notices?</li>
        <li>How fast, how many users, how much per request?</li>
        <li>What data does it touch, and who may see which part?</li>
        <li>What comes from outside and cannot be trusted?</li>
      </ul>
    </>
  );
}
