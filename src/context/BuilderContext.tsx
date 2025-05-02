import { MxEvents } from "@/enums/MxEvents";
import { MxBuilder } from "@/lib/MxGraph/MxBuilder";
import { MxGraphModel } from "@/lib/MxGraph/MxGraphModel";
import { calculateHash } from "@/utils/xml";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface Builder {
  xml: string;
  hash: string;
  tree: MxBuilder;
}

interface BuilderContextProps {
  builder: Builder | null;
  setBuilder: (xml: string) => void;
  selectedCellIds: string[];
  setSelectedCellIds: (cellIds: string[]) => void;
}

const BuilderContext = createContext<BuilderContextProps | undefined>(
  undefined
);

export const BuilderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const sendTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastXmlHash = useRef<string | null>(null);

  const [builder, setBuilderState] = useState<Builder>({
    xml: "",
    hash: "",
    tree: new MxBuilder(),
  });

  const [selectedCellIds, setSelectedCellIds] = useState<string[]>([]);

  const setBuilder = useCallback(
    async (xml: string) => {
      const newHash = await calculateHash(xml);
      if (builder.hash === newHash) {
        console.log("Not changed");
        return;
      }
      const newTree = MxBuilder.fromXml(xml);
      setBuilderState({
        xml,
        hash: newHash,
        tree: newTree,
      });
    },
    [builder]
  );

  const scheduleSendToDrawio = (currentBuilder: Builder) => {
    if (sendTimeout.current) {
      clearTimeout(sendTimeout.current);
    }

    sendTimeout.current = setTimeout(async () => {
      const xmlString = currentBuilder?.tree?.toXml();
      if (!xmlString) return;

      if (lastXmlHash.current === currentBuilder.hash) {
        console.log("XML unchanged (hash matched), not sending to Draw.io");
        return;
      }

      lastXmlHash.current = currentBuilder.hash;

      window.postMessage(
        { type: MxEvents.REACT_XML_UPDATE, payload: xmlString },
        "*"
      );
      console.log("XML sent to Draw.io (hash updated)");
    }, 200);
  };

  useEffect(() => {
    if (builder?.tree?.root?.cells?.length > 0) scheduleSendToDrawio(builder);
  }, [builder]);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (!event.data?.type) return;

      switch (event.data.type) {
        case MxEvents.DRAWIO_XML_UPDATE:
          try {
            setBuilder(event.data.payload);
          } catch (err) {
            console.error("Error processing XML from Draw.io:", err);
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <BuilderContext.Provider
      value={{
        builder,
        setBuilder,
        selectedCellIds,
        setSelectedCellIds,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context)
    throw new Error("useBuilder must be used within BuilderProvider");
  return context;
};
