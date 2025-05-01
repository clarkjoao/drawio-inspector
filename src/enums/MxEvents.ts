export const MxEvents = {
  REACT_XML_UPDATE: "REACT_XML_UPDATE",
  DRAWIO_XML_UPDATE: "DRAWIO_XML_UPDATE",
  DRAWIO_SELECTION_CHANGED: "DRAWIO_SELECTION_CHANGED",
  REACT_SELECT_CELLS: "REACT_SELECT_CELLS",
  ADD_NODE: "addNode",
  REMOVE_NODE: "removeNode",
  MOVE_NODE: "moveNode",
  UPDATE_STYLE: "updateStyle"
} as const;

export type MxEventType = (typeof MxEvents)[keyof typeof MxEvents];

export interface MxEvent {
  type: MxEventType;
  payload: any;
}
