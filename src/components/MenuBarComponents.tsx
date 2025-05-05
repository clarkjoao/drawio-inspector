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

export function MenubarComponents() {
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
          <MenubarItem>Layer Menus</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
