function GptResult({ result }) {
  if (!result) return null;

  return (
    <div className="mx-8 mb-8 bg-gray-900 border border-gray-700 rounded-lg p-6">
      <h3 className="text-red-500 font-semibold mb-2">🎬 FlixGenie Suggests:</h3>
      <p className="text-white whitespace-pre-line">{result}</p>
    </div>
  );
}

export default GptResult;