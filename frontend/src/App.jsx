import { auth } from "./firebase/firebaseConfig";

function App() {
  console.log("Firebase Auth:", auth);
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <h1 className="text-4xl font-bold">🎬 FlixGenie</h1>
    </div>
  );
}

export default App;