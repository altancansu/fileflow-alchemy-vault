
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { FileItem } from '../components/FileList';
import { ActionItem } from '../components/ActionPanel';

export const useFileManager = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedActionSets, setSavedActionSets] = useState<{id: string, name: string, actions: ActionItem[]}[]>([]);
  
  const SUPPORTED_FORMATS = ['docx', 'pdf', 'xls', 'xlsx', 'png', 'jpg', 'jpeg', 'gif'];

  const addFiles = useCallback((newFiles: File[]) => {
    const newFileItems = newFiles.map(file => ({
      id: uuidv4(),
      file,
      progress: 0,
      isComplete: false
    }));
    
    setFiles(prev => [...prev, ...newFileItems]);
  }, []);

  const deleteFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  }, []);

  const addAction = useCallback((actionType: string) => {
    const defaultConfigs: Record<string, Record<string, any>> = {
      convert: { method: 'all', format: 'pdf' },
      resize: { method: 'percentage', percentage: 50 },
      combine: { method: 'sameFormat', format: 'pdf' },
      reduce: { level: 'medium' },
      compress: { format: 'zip', filename: 'compressed-files' },
      rename: { pattern: 'prefix', text: '' }
    };

    setActions(prev => [
      ...prev, 
      { id: uuidv4(), type: actionType, config: defaultConfigs[actionType] || {} }
    ]);
  }, []);

  const updateAction = useCallback((id: string, config: Record<string, any>) => {
    setActions(prev => prev.map(action => 
      action.id === id ? { ...action, config } : action
    ));
  }, []);

  const deleteAction = useCallback((id: string) => {
    setActions(prev => prev.filter(action => action.id !== id));
  }, []);

  const saveActionSet = useCallback(() => {
    if (actions.length === 0) {
      toast.error('No actions to save');
      return;
    }
    
    const actionSetName = `Action Set ${savedActionSets.length + 1}`;
    const newActionSet = {
      id: uuidv4(),
      name: actionSetName,
      actions: [...actions]
    };
    
    setSavedActionSets(prev => [...prev, newActionSet]);
    toast.success(`Saved actions as "${actionSetName}"`);
  }, [actions, savedActionSets]);

  const loadActionSet = useCallback((actionSetId: string) => {
    const actionSet = savedActionSets.find(set => set.id === actionSetId);
    if (actionSet) {
      setActions(actionSet.actions.map(action => ({ ...action, id: uuidv4() })));
      toast.success(`Loaded action set "${actionSet.name}"`);
    }
  }, [savedActionSets]);

  const processFiles = useCallback(() => {
    if (files.length === 0) {
      toast.error('No files to process');
      return;
    }
    
    if (actions.length === 0) {
      toast.error('No actions specified');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing with progress updates
    const totalFiles = files.length;
    let processedFiles = 0;
    
    const updateFileProgress = (fileId: string, progress: number) => {
      setFiles(prev => prev.map(file => 
        file.id === fileId ? { ...file, progress, isComplete: progress >= 100 } : file
      ));
    };
    
    const processNextFile = () => {
      if (processedFiles >= totalFiles) {
        setIsProcessing(false);
        toast.success('All files processed successfully!');
        
        // After processing is complete, simulate download
        setTimeout(() => {
          toast.success('Your files are ready to download');
        }, 1000);
        
        return;
      }
      
      const fileToProcess = files[processedFiles];
      
      // Simulate processing time based on file size
      const totalTime = Math.min(2000, fileToProcess.file.size / 10000);
      const stepTime = totalTime / 10;
      
      let currentProgress = 0;
      
      const progressInterval = setInterval(() => {
        currentProgress += 10;
        updateFileProgress(fileToProcess.id, currentProgress);
        
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          processedFiles++;
          setTimeout(processNextFile, 300);
        }
      }, stepTime);
    };
    
    processNextFile();
  }, [files, actions]);

  return {
    files,
    actions,
    addFiles,
    deleteFile,
    addAction,
    updateAction,
    deleteAction,
    saveActionSet,
    loadActionSet,
    processFiles,
    isProcessing,
    savedActionSets,
    SUPPORTED_FORMATS
  };
};
