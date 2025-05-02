import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ObjectWrapper } from "@/lib/MxGraph/ObjectWrapper";

interface ObjectWrapperEditorProps {
  wrapper: ObjectWrapper;
  onChange: (updatedWrapper: ObjectWrapper) => void;
}

const ObjectWrapperEditor = ({
  wrapper,
  onChange,
}: ObjectWrapperEditorProps) => {
  const [localWrapper, setLocalWrapper] = useState<ObjectWrapper>(wrapper);
  const [newTag, setNewTag] = useState("");
  const [newAttrKey, setNewAttrKey] = useState("");
  const [newAttrValue, setNewAttrValue] = useState("");

  useEffect(() => {
    setLocalWrapper(wrapper);
  }, [wrapper]);

  const handleChange = (key: keyof ObjectWrapper, value: any) => {
    const updatedWrapper = { ...localWrapper, [key]: value };
    // setLocalWrapper(updatedWrapper);
    // onChange(updatedWrapper);
  };

  const addTag = () => {
    if (newTag.trim() === "") return;
    const updatedTags = [...localWrapper.tags, newTag.trim()];
    handleChange("tags", updatedTags);
    setNewTag("");
  };

  const removeTag = (index: number) => {
    const updatedTags = [...localWrapper.tags];
    updatedTags.splice(index, 1);
    handleChange("tags", updatedTags);
  };

  const addCustomAttribute = () => {
    if (newAttrKey.trim() === "") return;
    const updatedAttributes = {
      ...localWrapper.customAttributes,
      [newAttrKey]: newAttrValue,
    };
    handleChange("customAttributes", updatedAttributes);
    setNewAttrKey("");
    setNewAttrValue("");
  };

  const removeCustomAttribute = (key: string) => {
    const updatedAttributes = { ...localWrapper.customAttributes };
    delete updatedAttributes[key];
    handleChange("customAttributes", updatedAttributes);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          value={localWrapper.label || ""}
          onChange={(e) => handleChange("label", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Input
          id="type"
          value={localWrapper.type || ""}
          onChange={(e) => handleChange("type", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">Link</Label>
        <Input
          id="link"
          value={localWrapper.link || ""}
          onChange={(e) => handleChange("link", e.target.value)}
          placeholder="https://"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tooltip">Tooltip</Label>
        <Input
          id="tooltip"
          value={localWrapper.tooltip || ""}
          onChange={(e) => handleChange("tooltip", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={localWrapper.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
        />
      </div>

      <Separator className="my-4" />

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {localWrapper.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-xs hover:text-red-500"
              >
                <X size={12} />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            id="newTag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button variant="outline" size="sm" onClick={addTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-2">
        <Label>Custom Attributes</Label>
        <ScrollArea className="h-[200px] rounded border p-4">
          {Object.entries(localWrapper.customAttributes).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 mb-2">
              <Input value={key} disabled className="flex-1 bg-gray-50" />
              <Input
                value={value}
                onChange={(e) => {
                  const updatedAttributes = {
                    ...localWrapper.customAttributes,
                    [key]: e.target.value,
                  };
                  handleChange("customAttributes", updatedAttributes);
                }}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCustomAttribute(key)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex items-center gap-2 mt-4">
            <Input
              placeholder="Key"
              value={newAttrKey}
              onChange={(e) => setNewAttrKey(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Value"
              value={newAttrValue}
              onChange={(e) => setNewAttrValue(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={addCustomAttribute}
              disabled={newAttrKey.trim() === ""}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ObjectWrapperEditor;
