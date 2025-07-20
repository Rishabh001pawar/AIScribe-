import { useState } from "react";
import { WandIcon, LoaderIcon, LightbulbIcon } from "lucide-react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import AISetupInfo from "./AISetupInfo";

const AINotesHelper = ({ onNoteGenerated, currentNote = null }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("structured");
  const [improvementType, setImprovementType] = useState("general");
  const [activeTab, setActiveTab] = useState("generate");
  const [showSetupInfo, setShowSetupInfo] = useState(false);

  const handleAIError = (error) => {
    if (error.response?.status === 503) {
      setShowSetupInfo(true);
      toast.error("AI features need to be configured");
    } else {
      toast.error("AI service temporarily unavailable");
    }
  };

  const generateIdeas = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post("/chat/generate-ideas", {
        topic,
        style
      });

      onNoteGenerated({
        title: response.data.title,
        content: response.data.content
      });

      toast.success("Note ideas generated!");
      setTopic("");
    } catch (error) {
      console.error("Error generating ideas:", error);
      handleAIError(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const improveCurrentNote = async () => {
    if (!currentNote || !currentNote.title || !currentNote.content) {
      toast.error("Please provide a note to improve");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post("/chat/improve-note", {
        title: currentNote.title,
        content: currentNote.content,
        improvementType
      });

      onNoteGenerated({
        title: currentNote.title,
        content: response.data.improvedNote
      });

      toast.success("Note improved!");
    } catch (error) {
      console.error("Error improving note:", error);
      handleAIError(error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (showSetupInfo) {
    return (
      <div className="space-y-4">
        <AISetupInfo />
        <button 
          onClick={() => setShowSetupInfo(false)}
          className="btn btn-ghost btn-sm w-full"
        >
          Try AI Features Anyway
        </button>
      </div>
    );
  }

  return (
    <div className="card bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
      <div className="card-body p-4">
        <div className="flex items-center gap-2 mb-4">
          <WandIcon className="size-5 text-primary" />
          <h3 className="text-lg font-semibold">AI Writing Assistant</h3>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-bordered mb-4">
          <button
            className={`tab ${activeTab === "generate" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("generate")}
          >
            <LightbulbIcon className="size-4 mr-1" />
            Generate Ideas
          </button>
          {currentNote && (
            <button
              className={`tab ${activeTab === "improve" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("improve")}
            >
              <WandIcon className="size-4 mr-1" />
              Improve Note
            </button>
          )}
        </div>

        {/* Generate Ideas Tab */}
        {activeTab === "generate" && (
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">What would you like to write about?</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Project planning, Daily reflection, Learning notes..."
                className="input input-bordered"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Writing Style</span>
              </label>
              <select
                className="select select-bordered"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                <option value="structured">Structured</option>
                <option value="bullet">Bullet Points</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>

            <button
              onClick={generateIdeas}
              disabled={isGenerating || !topic.trim()}
              className="btn btn-primary w-full"
            >
              {isGenerating ? (
                <>
                  <LoaderIcon className="size-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <LightbulbIcon className="size-4 mr-2" />
                  Generate Ideas
                </>
              )}
            </button>
          </div>
        )}

        {/* Improve Note Tab */}
        {activeTab === "improve" && currentNote && (
          <div className="space-y-4">
            <div className="bg-base-200 p-3 rounded-lg">
              <div className="text-sm text-base-content/70 mb-1">Current Note:</div>
              <div className="font-medium text-sm">{currentNote.title}</div>
              <div className="text-xs text-base-content/60 mt-1 line-clamp-2">
                {currentNote.content}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Improvement Type</span>
              </label>
              <select
                className="select select-bordered"
                value={improvementType}
                onChange={(e) => setImprovementType(e.target.value)}
              >
                <option value="general">General Improvement</option>
                <option value="grammar">Fix Grammar & Spelling</option>
                <option value="clarity">Improve Clarity</option>
                <option value="expand">Expand with Details</option>
                <option value="summarize">Create Summary</option>
              </select>
            </div>

            <button
              onClick={improveCurrentNote}
              disabled={isGenerating}
              className="btn btn-primary w-full"
            >
              {isGenerating ? (
                <>
                  <LoaderIcon className="size-4 animate-spin mr-2" />
                  Improving...
                </>
              ) : (
                <>
                  <WandIcon className="size-4 mr-2" />
                  Improve Note
                </>
              )}
            </button>
          </div>
        )}

        <div className="text-xs text-base-content/60 mt-4 text-center">
          ✨ Powered by AI • Generated content may need review
        </div>
      </div>
    </div>
  );
};

export default AINotesHelper;
