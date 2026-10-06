function GptResult({ result }) {
  if (!result) return null;

  return (
    <div className="mx-0 mb-6 bg-gradient-to-br from-gray-900 to-black border border-red-900/30 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🤖</span>
        <h3 className="text-red-500 font-semibold text-sm">FlixGenie AI Suggests</h3>
      </div>
      <p className="text-gray-200 whitespace-pre-line leading-relaxed">{result}</p>
    </div>
  );
}

export default GptResult;