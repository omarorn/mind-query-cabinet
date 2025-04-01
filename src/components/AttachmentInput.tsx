
import React, { useState } from "react";
import { File, FileVideo, Link, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
import DualText from "./DualText";

type AttachmentType = 'file' | 'video' | 'link';

interface AttachmentInputProps {
  onAttachmentChange: (attachment: { type: AttachmentType; url: string; name?: string } | null) => void;
}

const AttachmentInput: React.FC<AttachmentInputProps> = ({ onAttachmentChange }) => {
  const [activeType, setActiveType] = useState<AttachmentType | null>(null);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const { t } = useLanguage();

  const handleTypeSelect = (type: AttachmentType) => {
    setActiveType(type);
    setUrl("");
    setName("");
  };

  const handleSubmit = () => {
    if (activeType && url.trim()) {
      onAttachmentChange({
        type: activeType,
        url: url.trim(),
        name: name.trim() || undefined
      });
    }
  };

  const handleClear = () => {
    setActiveType(null);
    setUrl("");
    setName("");
    onAttachmentChange(null);
  };

  return (
    <div className="space-y-4 border rounded-md p-4 bg-gray-50">
      <div>
        <p className="text-sm font-medium mb-2">
          <DualText textKey="attachmentType" />
        </p>
        <div className="flex space-x-2">
          <Button 
            type="button" 
            variant={activeType === 'file' ? "default" : "outline"} 
            size="sm"
            onClick={() => handleTypeSelect('file')}
          >
            <File className="mr-2 h-4 w-4" />
            <DualText textKey="file" />
          </Button>
          <Button 
            type="button" 
            variant={activeType === 'video' ? "default" : "outline"} 
            size="sm"
            onClick={() => handleTypeSelect('video')}
          >
            <FileVideo className="mr-2 h-4 w-4" />
            <DualText textKey="video" />
          </Button>
          <Button 
            type="button" 
            variant={activeType === 'link' ? "default" : "outline"} 
            size="sm"
            onClick={() => handleTypeSelect('link')}
          >
            <Link className="mr-2 h-4 w-4" />
            <DualText textKey="link" />
          </Button>
        </div>
      </div>

      {activeType && (
        <div className="space-y-3">
          <div>
            <label htmlFor="attachmentUrl" className="block text-sm font-medium text-gray-700 mb-1">
              {activeType === 'link' ? (
                <DualText textKey="linkUrl" />
              ) : (
                <DualText textKey="attachmentUrl" />
              )}
            </label>
            <Input
              id="attachmentUrl"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={activeType === 'link' ? "https://example.com" : "https://..."}
            />
          </div>
          
          <div>
            <label htmlFor="attachmentName" className="block text-sm font-medium text-gray-700 mb-1">
              <DualText textKey="attachmentName" />
            </label>
            <Input
              id="attachmentName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("optionalName").en}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button type="button" onClick={handleSubmit} size="sm">
              <DualText textKey="addAttachment" />
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleClear}>
              <X className="mr-2 h-4 w-4" />
              <DualText textKey="clear" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentInput;
