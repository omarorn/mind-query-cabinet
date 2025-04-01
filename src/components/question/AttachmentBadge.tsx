
import React from "react";
import { FileText, Link as LinkIcon, Image } from "lucide-react";

interface AttachmentBadgeProps {
  type: 'article' | 'source' | 'image' | 'file' | 'video' | 'link';
  url?: string;
  name?: string;
}

const AttachmentBadge: React.FC<AttachmentBadgeProps> = ({ type, url, name }) => {
  const getBadgeClass = () => {
    switch (type) {
      case 'article': return "bg-blue-100 text-blue-700";
      case 'source': return "bg-green-100 text-green-700";
      case 'image': return "bg-purple-100 text-purple-700";
      case 'file': return "bg-amber-100 text-amber-700";
      case 'video': return "bg-amber-100 text-amber-700";
      case 'link': return "bg-amber-100 text-amber-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'article': return <FileText className="w-3 h-3 mr-1" />;
      case 'source': return <LinkIcon className="w-3 h-3 mr-1" />;
      case 'image': return <Image className="w-3 h-3 mr-1" />;
      case 'file': return <FileText className="w-3 h-3 mr-1" />;
      case 'video': return <FileText className="w-3 h-3 mr-1" />;
      case 'link': return <LinkIcon className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'article': return "Article Facts";
      case 'source': return "Source";
      case 'image': return "Has Image";
      default: return name || type;
    }
  };

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getBadgeClass()}`}>
      {getIcon()}
      {type === 'source' && url ? (
        <a 
          href={url.startsWith('http') ? url : `https://${url}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {getLabel()}
        </a>
      ) : (
        getLabel()
      )}
    </div>
  );
};

export default AttachmentBadge;
