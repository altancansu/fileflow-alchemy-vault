
import React from 'react';
import { 
  FileWord, 
  FileImage, 
  FilePdf, 
  FileSpreadsheet, 
  File 
} from 'lucide-react';

type FileIconProps = {
  fileType: string;
  className?: string;
};

const FileIcon: React.FC<FileIconProps> = ({ fileType, className }) => {
  const iconClass = `w-6 h-6 ${className || ''}`;
  
  if (fileType.match(/doc|docx/i)) {
    return <FileWord className={iconClass} color="#4a86e8" />;
  } else if (fileType.match(/pdf/i)) {
    return <FilePdf className={iconClass} color="#e94335" />;
  } else if (fileType.match(/xls|xlsx|csv/i)) {
    return <FileSpreadsheet className={iconClass} color="#34a853" />;
  } else if (fileType.match(/jpg|jpeg|png|gif|svg|webp/i)) {
    return <FileImage className={iconClass} color="#9c27b0" />;
  }
  
  return <File className={iconClass} color="#607d8b" />;
};

export default FileIcon;
