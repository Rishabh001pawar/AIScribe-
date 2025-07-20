import { InfoIcon, ExternalLinkIcon } from "lucide-react";

const AISetupInfo = () => {
  return (
    <div className="alert alert-info">
      <InfoIcon className="size-6" />
      <div>
        <h3 className="font-bold">AI Features Available!</h3>
        <div className="text-sm">
          To enable AI-powered features like the chatbot and note assistance, you need to:
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Get an OpenAI API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="link link-primary inline-flex items-center gap-1">OpenAI Platform <ExternalLinkIcon className="size-3" /></a></li>
            <li>Add it to your backend .env file as <code className="bg-base-200 px-1 rounded">OPENAI_API_KEY=your_key_here</code></li>
            <li>Restart your backend server</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AISetupInfo;
