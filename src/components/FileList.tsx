
import React from 'react';
import { Trash2 } from 'lucide-react';
import FileIcon from './FileIcon';
import { Progress } from "@/components/ui/progress";

export interface FileItem {
  id: string;
  file: File;
  progress?: number;
  isComplete?: boolean;
}

type FileListProps = {
  files: FileItem[];
  onDeleteFile: (id: string) => void;
  convertOptions?: {
    [fileId: string]: string | null;
  };
  onConvertOptionChange?: (fileId: string, format: string | null) => void;
};

const FileList: React.FC<FileListProps> = ({ 
  files, 
  onDeleteFile, 
  convertOptions, 
  onConvertOptionChange 
}) => {
  if (files.length === 0) {
    return null;
  }

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toLowerCase() || '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(i ? 1 : 0)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-[auto_1fr_auto_auto] md:grid-cols-[auto_1fr_auto_auto_auto] gap-4 mb-2 text-sm text-muted-foreground px-4">
        <div className="flex justify-center text-center">Format</div>
        <div className="pl-2">File Name</div>
        {files.some(f => f.progress !== undefined) && <div className="hidden md:flex justify-center text-center">Progress</div>}
        <div className="text-right">Size</div>
        <div className="text-center">Delete</div>
      </div>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {files.map((fileItem) => {
          const extension = getFileExtension(fileItem.file.name);
          
          return (
            <div 
              key={fileItem.id} 
              className="grid grid-cols-[auto_1fr_auto_auto] md:grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center bg-secondary/60 rounded-lg p-4"
            >
              <div className="flex items-center justify-center">
                <FileIcon fileType={extension} />
              </div>
              
              <div className="truncate text-sm pl-2">
                {fileItem.file.name}
              </div>
              
              {fileItem.progress !== undefined && (
                <div className="hidden md:flex flex-col items-center min-w-[120px]">
                  <Progress value={fileItem.progress} className="h-2 w-full" />
                  <div className="w-full">
                    <span className="text-xs mt-1 block">
                      {fileItem.isComplete ? 
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg> : 
                        `${fileItem.progress}%`
                      }
                    </span>
                  </div>
                </div>
              )}
              
              <div className="text-sm text-muted-foreground text-right whitespace-nowrap">
                {formatFileSize(fileItem.file.size)}
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={() => onDeleteFile(fileItem.id)}
                  className="p-1 hover:bg-destructive/20 rounded-full transition-colors"
                  aria-label="Delete file"
                >
                  <Trash2 className="w-5 h-5 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {files.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground flex items-center justify-between">
          <span>Total {files.length} files</span>
          <span>
            Approximately {formatFileSize(files.reduce((acc, item) => acc + item.file.size, 0))}
          </span>
        </div>
      )}
    </div>
  );
};

export default FileList;
