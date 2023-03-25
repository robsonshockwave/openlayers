import { MapComponent } from "./components/Map";
import { MapConfigProvider } from "./contexts/MapConfig";

function App() {
  return (
    <MapConfigProvider>
      <MapComponent />
    </MapConfigProvider>
  );
}

export default App;
