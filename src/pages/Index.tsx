import FloatingButton from "@/components/FloatingButton";
import XMLEditor from "@/components/XMLEditor";
import { useBuilder } from "@/context/BuilderContext";

function App() {
  const { builder, setBuilder } = useBuilder();

  const isPlugin = import.meta.env.AS_PLUGIN;

  const handleExport = () => {
    return builder?.tree.toXml() || "";
  };

  const handleParseXml = (xml: string) => {
    setBuilder(xml);
  };

  return (
    <>
      <div className="min-h-screen min-w-screen bg-gray-50 flex flex-col">
        <h1 className="text-3xl font-semibold mb-6 text-gray-900">
          Draw.io XML Editor
        </h1>
        {!isPlugin && (
          <div className="col-span-2 bg-white dark:bg-[#222] border border-gray-200/60 shadow-lg rounded-lg p-4">
            <XMLEditor onExport={handleExport} onParseXml={handleParseXml} />
          </div>
        )}
      </div>

      <FloatingButton />
    </>
  );
}

export default App;
