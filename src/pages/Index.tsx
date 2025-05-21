
import React from 'react';
import FileDropZone from '../components/FileDropZone';
import FileList from '../components/FileList';
import ActionPanel from '../components/ActionPanel';
import { useFileManager } from '../hooks/useFileManager';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

const Index = () => {
  const {
    files,
    actions,
    addFiles,
    deleteFile,
    addAction,
    updateAction,
    deleteAction,
    saveActionSet,
    processFiles,
    SUPPORTED_FORMATS
  } = useFileManager();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      <header className="w-full max-w-5xl py-8 px-4">
        <h1 className="text-3xl font-semibold text-center">Secure File Manager</h1>
        <p className="text-center text-muted-foreground mt-2">
          Our tool runs entirely on your device, keeping all actions local and your files private.
          <br />
          With no uploads or external servers, <span className="text-foreground font-medium">your data stays fully secure.</span>
        </p>
      </header>

      <main className="w-full max-w-5xl flex-1 px-4 pb-8 space-y-8">
        {/* Section 1: File Drop Zone */}
        <section className="mb-8">
          <FileDropZone 
            onFilesAdded={addFiles} 
            supportedFormats={SUPPORTED_FORMATS} 
          />
        </section>

        {/* Section 2: File List */}
        {files.length > 0 && (
          <section className="mb-8">
            <FileList
              files={files}
              onDeleteFile={deleteFile}
            />
          </section>
        )}

        {/* Section 3: Action Panel */}
        <section className="mb-8">
          <ActionPanel
            actions={actions}
            onAddAction={addAction}
            onDeleteAction={deleteAction}
            onUpdateAction={updateAction}
            onSaveActionSet={() => {
              if (actions.length === 0) {
                toast.error("No actions to save");
                return;
              }
              saveActionSet();
            }}
            onProcess={() => {
              if (files.length === 0) {
                toast.error("Please add files first");
                return;
              }
              if (actions.length === 0) {
                toast.error("Please add at least one action");
                return;
              }
              processFiles();
            }}
            fileCount={files.length}
          />
        </section>
      </main>
    </div>
  );
};

export default Index;
