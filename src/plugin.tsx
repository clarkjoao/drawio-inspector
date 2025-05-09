//@ts-nocheck
import ReactDOM from "react-dom/client";
import App from "@/App";
import { MxEvents } from "@/enums/MxEvents";

const debounceTimers = new WeakMap<Function, number>();

let isEditingInDrawio = false;
let editingTimeout: ReturnType<typeof setTimeout> | null = null;
const EDITING_DELAY = 500;
(window as any).Draw.loadPlugin(function (ui: any) {
  const graph = ui.editor.graph;
  const model = graph.model;
  const codec = new mxCodec();

  function debounce(callback: () => void, delay = 300) {
    const existingTimer = debounceTimers.get(callback);
    if (existingTimer) clearTimeout(existingTimer);

    const newTimer = setTimeout(callback, delay);
    debounceTimers.set(callback, newTimer);
  }

  function sendXmlToReact() {
    const xmlNode = codec.encode(model);
    const xmlString = mxUtils.getXml(xmlNode);

    console.log("Sending updated XML to React");
    window.postMessage(
      { type: MxEvents.DRAWIO_XML_UPDATE, payload: xmlString },
      "*"
    );
  }

  function sendSelectionToReact() {
    const selectedCells = graph.getSelectionCells() || [];
    const selectedIds = selectedCells.map((cell: any) => cell.id);

    console.log(
      "Selection changed, sending selected IDs to React:",
      selectedIds
    );
    window.postMessage(
      { type: MxEvents.DRAWIO_SELECTION_CHANGED, payload: selectedIds },
      "*"
    );
  }

  function handleIncomingMessage(event: MessageEvent) {
    const { type, payload } = event.data || {};

    if (!type) return;

    if (isEditingInDrawio) {
      console.warn(
        `Ignored incoming React message "${type}" because Draw.io is actively editing`
      );
      return;
    }

    switch (type) {
      case MxEvents.REACT_XML_UPDATE:
        if (typeof payload === "string") {
          updateModelFromXml(payload);
        }
        break;

      case MxEvents.REACT_SELECT_CELLS:
        if (Array.isArray(payload)) {
          selectCellsByIds(payload);
        }
        break;

      default:
        break;
    }
  }

  function updateModelFromXml(xmlString: string) {
    try {
      const newDoc = mxUtils.parseXml(xmlString);
      const newCodec = new mxCodec(newDoc);
      const newModel = newCodec.decode(newDoc.documentElement);

      model.beginUpdate();
      try {
        // model.clear();
        // model.mergeChildren(newModel.root, model.root);
        model.setRoot(newModel.root);
      } finally {
        model.endUpdate();
      }

      console.log("Model updated from React");
    } catch (err) {
      console.error("Error updating model from React:", err);
    }
  }

  function selectCellsByIds(ids: string[]) {
    const cells = ids
      .map((id) => model.getCell(id))
      .filter((cell) => cell !== null && cell !== undefined);

    if (cells.length > 0) {
      graph.setSelectionCells(cells);
      console.log("Cells selected via React:", ids);
    } else {
      console.warn("No cells found to select:", ids);
    }
  }

  function createFloatingMenuContainer() {
    const rootFloat = document.getElementById("react-root-container");
    if (rootFloat) {
      rootFloat.remove();
    }

    const floatingMenu = document.createElement("div");
    floatingMenu.id = "react-root-container";

    Object.assign(floatingMenu.style, {
      position: "absolute",
      // top: "20px",
      // left: "20px",
      zIndex: "9998",
    });

    document.body.appendChild(floatingMenu);
  }

  function init() {
    createFloatingMenuContainer();

    const tryMountReact = () => {
      const container = document.getElementById("react-root-container");
      if (container) {
        const root = ReactDOM.createRoot(container);
        root.render(<App />);
        console.log("React App mounted inside floating menu");
        debounce(sendXmlToReact, 500);
      } else {
        console.warn("Waiting for react-root-container...");
        setTimeout(tryMountReact, 100);
      }
    };
    tryMountReact();

    model.addListener(mxEvent.CHANGE, () => {
      console.log("Detected CHANGE in Draw.io model → updating React");
      sendXmlToReact();

      isEditingInDrawio = true;
      if (editingTimeout) clearTimeout(editingTimeout);
      editingTimeout = setTimeout(() => {
        isEditingInDrawio = false;
      }, EDITING_DELAY);
    });

    graph.getSelectionModel().addListener(mxEvent.CHANGE, () => {
      console.log("Selection changed in Draw.io → updating React");
      sendSelectionToReact();

      isEditingInDrawio = true;
      if (editingTimeout) clearTimeout(editingTimeout);
      editingTimeout = setTimeout(() => {
        isEditingInDrawio = false;
      }, EDITING_DELAY);
    });

    window.addEventListener("message", handleIncomingMessage);
  }

  init();
});
