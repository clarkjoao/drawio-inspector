import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useBuilder } from "@/context/BuilderContext";
import { MxCell } from "@/lib/MxGraph/MxCell";
import { MxGeometry } from "@/lib/MxGraph/MxGeometry";
import { MxStyle } from "@/lib/MxGraph/MxStyle";
import { ObjectWrapper } from "@/lib/MxGraph/ObjectWrapper";
import { XmlUtils } from "@/lib/MxGraph/xml.utils";
import { generateDrawioId } from "@/utils/drawio";

export function MenubarComponents() {
  const { builder, refreshTree } = useBuilder();

  function addLayer(name: string): MxCell {
    const id = generateDrawioId("layer-");
    const root = builder?.tree.root;

    const layer = new MxCell({
      id,
      value: name,
      parent: root?.defaultLayer.id || "0",
      style: new MxStyle({
        locked: "1",
      }),
    });

    // this.model.addCell(layer);
    root?.addBeforeOrAfter(layer, root.defaultLayer.id || "0", "after");
    return layer;
  }

  function addLayersMenu() {
    if (!builder) return;

    const rootEl = builder.tree.root;

    const allLayers = builder.tree.listLayers();

    const menuLayer = addLayer("layers-menu-custom");

    const buttonHeight = 45;
    const totalHeight = allLayers.length * buttonHeight || buttonHeight;

    const menuBackground = new MxCell({
      id: generateDrawioId("menu-background"),
      style: new MxStyle({
        shape: "rect",
        strokeColor: "#eeeeee",
        fillColor: "#ffffff",
        fontColor: "#000000",
        fontStyle: "0",
        childLayout: "stackLayout",
        horizontal: "1",
        startSize: "0",
        horizontalStack: "0",
        resizeParent: "1",
        resizeParentMax: "0",
        resizeLast: "0",
        collapsible: "0",
        marginBottom: "0",
        whiteSpace: "wrap",
        html: "1",
        shadow: "1",
      }),
      vertex: "1",
      parent: menuLayer.id ?? "1",
      children: new MxGeometry({
        x: "360",
        y: "250",
        width: "100",
        height: totalHeight.toString(),
        as: "geometry",
      }),
    });

    // model.addCellAfter(menuBackground, builder.rootLayerId);
    rootEl.add(menuBackground);

    const allLayerIds = allLayers.map((layer) => layer.id!);

    allLayers.forEach((layer, index) => {
      const layerId = layer.id!;
      const otherLayerIds = allLayerIds.filter(
        (id) => id !== layerId || id !== menuLayer.id
      );

      const menuItemId = generateDrawioId(`menu-item-layer-${index}`);

      const linkJson = {
        title: `Show Only ${layer.value || layerId}`,
        actions: [
          { hide: { cells: otherLayerIds } },
          { style: { cells: otherLayerIds, key: "locked", value: "1" } },
          { show: { cells: [layerId] } },
          { style: { cells: [layerId], key: "locked", value: "0" } },
          {
            style: {
              tags: ["menu-items-layer"],
              key: "fillColor",
              value: "#ffffff",
            },
          },
          {
            style: { cells: [menuItemId], key: "fillColor", value: "#d3d3d3" },
          },
        ],
      };

      const linkEscaped = `data:action/json,${XmlUtils.escapeString(
        JSON.stringify(linkJson)
      )}`;

      const menuItemUserObject = new ObjectWrapper({
        id: menuItemId,
        label: layer.getLabel || layer.value || "Background", // default name is background, beucase is the same name that drawio choose when layer doesnt have value
        tags: ["menu-items-layer"],
        link: linkEscaped,
      });

      const menuItemCell = new MxCell({
        id: undefined, // undefined because exists wrapper
        style: new MxStyle({
          shape: "text",
          strokeColor: "none",
          align: "left",
          verticalAlign: "middle",
          spacingLeft: "10",
          spacingRight: "10",
          overflow: "hidden",
          portConstraint: "eastwest",
          rotatable: "0",
          whiteSpace: "wrap",
          html: "1",
          rSize: "5",
          fillColor: "none",
          fontColor: "inherit",
          fontSize: "14",
        }),
        vertex: "1",
        parent: menuBackground.id,
        children: new MxGeometry({
          y: `${index * buttonHeight}`,
          width: "100",
          height: `${buttonHeight}`,
          as: "geometry",
        }),
        wrapper: menuItemUserObject,
      });

      // model.addCell(menuItemCell);
      rootEl.add(menuItemCell);
    });

    refreshTree();
  }

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>New Item</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Layer</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Custom Components</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={addLayersMenu}>Layer Menus</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
