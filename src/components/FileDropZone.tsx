
import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

type FileDropZoneProps = {
  onFilesAdded: (files: File[]) => void;
  supportedFormats: string[];
};

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFilesAdded, supportedFormats }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    processFiles(selectedFiles);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      return supportedFormats.includes(extension);
    });

    if (validFiles.length === 0) {
      toast.error('No valid files were selected. Please select supported file formats.');
      return;
    }

    if (validFiles.length < files.length) {
      toast.warning('Some files were skipped as they are not supported.');
    }

    onFilesAdded(validFiles);
    if (validFiles.length > 0) {
      toast.success(`Successfully added ${validFiles.length} file(s)`);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const supportedFormatsText = supportedFormats.join(', ').toUpperCase();

  return (
    <div
      className={`file-drop-area ${isDragging ? 'active' : ''} cursor-pointer`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept={supportedFormats.map(format => `.${format}`).join(',')}
      />
      <Upload className="w-10 h-10 text-primary mb-4" />
      <p className="text-lg font-medium text-center">Click or drop your files here</p>
      <p className="text-sm text-muted-foreground mt-2 text-center">
        DOCX, PDF, XLS, PNG formats are supported
      </p>
    </div>
  );
};

export default FileDropZone;
