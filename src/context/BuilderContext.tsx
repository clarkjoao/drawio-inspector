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
  refreshTree: () => void;
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

  const [selectedCellIds, _setSelectedCellIds] = useState<{
    hash: string;
    ids: string[];
  }>({
    hash: "",
    ids: [],
  });

  const setBuilder = useCallback(
    async (xml: string) => {
      const newHash = await calculateHash(xml);
      if (builder.hash === newHash) {
        console.log("Not changed, skipping builder update");
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

  const refreshTree = () => {
    setBuilder(builder.tree.toXml());
  };

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
    }, 500);
  };

  const setSelectedCellIds = useCallback(
    async (ids: string[]) => {
      const newHash = await calculateHash(ids.toString());
      const currHash = selectedCellIds.hash;
      if (newHash !== currHash) {
        _setSelectedCellIds({
          hash: newHash,
          ids,
        });
      }
    },
    [selectedCellIds]
  );

  useEffect(() => {
    if (builder?.tree?.root?.cells?.length > 0) scheduleSendToDrawio(builder);
  }, [builder.hash]);

  useEffect(() => {
    window.postMessage(
      { type: MxEvents.REACT_SELECT_CELLS, payload: selectedCellIds.ids },
      "*"
    );
  }, [selectedCellIds.hash]);

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

        case MxEvents.DRAWIO_SELECTION_CHANGED:
          const selected = event.data.payload;
          if (Array.isArray(selected)) {
            setSelectedCellIds(selected);
          } else {
            console.warn("Invalid selection payload", selected);
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
        selectedCellIds: selectedCellIds.ids,
        setSelectedCellIds,
        refreshTree,
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
