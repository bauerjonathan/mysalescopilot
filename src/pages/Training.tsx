import { useState } from "react";
import { Difficulty, TrainingScenario, TrainingPhase, TrainingEvaluation } from "@/types/training";
import { TrainingSetup } from "@/components/training/TrainingSetup";
import { VoiceTrainingChat } from "@/components/training/VoiceTrainingChat";
import { EvaluationResults } from "@/components/training/EvaluationResults";
import { ChatMessage } from "@/types/training";

const Training = () => {
  const [phase, setPhase] = useState<TrainingPhase>("setup");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [scenario, setScenario] = useState<TrainingScenario>("cold-call");
  const [transcript, setTranscript] = useState<ChatMessage[]>([]);
  const [evaluation, setEvaluation] = useState<TrainingEvaluation | null>(null);

  const handleStart = (d: Difficulty, s: TrainingScenario) => {
    setDifficulty(d);
    setScenario(s);
    setPhase("chat");
  };

  const handleEnd = (msgs: ChatMessage[], eval_: TrainingEvaluation) => {
    setTranscript(msgs);
    setEvaluation(eval_);
    setPhase("evaluation");
  };

  const handleRestart = () => {
    setTranscript([]);
    setEvaluation(null);
    setPhase("setup");
  };

  return (
    <div className="flex-1 overflow-hidden">
      {phase === "setup" && <TrainingSetup onStart={handleStart} />}
      {phase === "chat" && (
        <VoiceTrainingChat
          difficulty={difficulty}
          scenario={scenario}
          onEnd={handleEnd}
        />
      )}
      {phase === "evaluation" && evaluation && (
        <EvaluationResults
          evaluation={evaluation}
          difficulty={difficulty}
          scenario={scenario}
          transcript={transcript}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default Training;
