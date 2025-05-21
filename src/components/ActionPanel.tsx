
import React, { useState } from 'react';
import {
  FilePlus,
  FileUp,
  Save,
  Download,
  ChevronUp,
  ChevronDown,
  Plus,
  FileCode,
  ImageIcon,
  Folder,
  FolderInput,
  FileX
} from 'lucide-react';
import { toast } from 'sonner';

export interface ActionItem {
  id: string;
  type: string;
  config: Record<string, any>;
}

type ActionPanelProps = {
  actions: ActionItem[];
  onAddAction: (actionType: string) => void;
  onDeleteAction: (id: string) => void;
  onUpdateAction: (id: string, config: Record<string, any>) => void;
  onSaveActionSet: () => void;
  onProcess: () => void;
  fileCount: number;
};

const ActionPanel: React.FC<ActionPanelProps> = ({
  actions,
  onAddAction,
  onDeleteAction,
  onUpdateAction,
  onSaveActionSet,
  onProcess,
  fileCount
}) => {
  const [showMore, setShowMore] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  
  const handleActionSelect = (actionType: string) => {
    onAddAction(actionType);
    setShowActionMenu(false);
    toast.success(`Added ${getActionTitle(actionType)} action`);
  };

  const getActionTitle = (actionType: string) => {
    switch (actionType) {
      case 'convert': return 'Convert file to other format';
      case 'resize': return 'Resize images';
      case 'combine': return 'Combine files';
      case 'reduce': return 'Reduce file size';
      case 'compress': return 'Compress files';
      case 'rename': return 'File renaming';
      default: return actionType;
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'convert': return <FileCode className="w-5 h-5" />;
      case 'resize': return <ImageIcon className="w-5 h-5" />;
      case 'combine': return <Folder className="w-5 h-5" />;
      case 'reduce': return <FileX className="w-5 h-5" />;
      case 'compress': return <FolderInput className="w-5 h-5" />;
      case 'rename': return <FilePlus className="w-5 h-5" />;
      default: return <Plus className="w-5 h-5" />;
    }
  };

  const ActionConfig = ({ action }: { action: ActionItem }) => {
    const [isOpen, setIsOpen] = useState(true);

    const renderConfigFields = () => {
      switch (action.type) {
        case 'convert':
          return (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Convert method</label>
                <select 
                  className="bg-secondary border border-border rounded-lg p-2 text-sm"
                  value={action.config.method || 'all'}
                  onChange={(e) => onUpdateAction(action.id, { ...action.config, method: e.target.value })}
                >
                  <option value="all">Convert all files to same format</option>
                  <option value="separate">Convert files separately</option>
                </select>
              </div>

              {action.config.method !== 'separate' && (
                <div className="flex gap-4 items-center">
                  <select 
                    className="bg-secondary border border-border rounded-lg p-2 text-sm flex-1"
                    value={action.config.format || 'pdf'}
                    onChange={(e) => onUpdateAction(action.id, { ...action.config, format: e.target.value })}
                  >
                    <option value="pdf">PDF</option>
                    <option value="docx">DOCX</option>
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                  </select>
                </div>
              )}

              {action.config.method === 'separate' && (
                <div className="text-sm text-muted-foreground">
                  You'll be able to select formats for each file during processing
                </div>
              )}
            </div>
          );
        
        case 'combine':
          return (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Combine method</label>
                <select 
                  className="bg-secondary border border-border rounded-lg p-2 text-sm"
                  value={action.config.method || 'sameFormat'}
                  onChange={(e) => onUpdateAction(action.id, { ...action.config, method: e.target.value })}
                >
                  <option value="sameFormat">Combine same format files</option>
                  <option value="allToPdf">Create a single PDF file</option>
                  <option value="excel">Merge Excel workbooks</option>
                </select>
              </div>

              {action.config.method === 'sameFormat' && (
                <div className="flex gap-4 items-center">
                  <select 
                    className="bg-secondary border border-border rounded-lg p-2 text-sm flex-1"
                    value={action.config.format || 'pdf'}
                    onChange={(e) => onUpdateAction(action.id, { ...action.config, format: e.target.value })}
                  >
                    <option value="pdf">PDF</option>
                    <option value="docx">DOCX</option>
                    <option value="xls">XLS</option>
                    <option value="jpg">JPG</option>
                  </select>
                </div>
              )}

              {(action.config.method === 'allToPdf' || action.config.method === 'excel') && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">Output filename</label>
                  <input
                    type="text"
                    className="bg-secondary border border-border rounded-lg p-2 text-sm"
                    placeholder={action.config.method === 'allToPdf' ? 'Combined-Document' : 'Merged-Workbook'}
                    value={action.config.filename || ''}
                    onChange={(e) => onUpdateAction(action.id, { ...action.config, filename: e.target.value })}
                  />
                </div>
              )}
            </div>
          );
          
        case 'reduce':
          return (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Optimization level</label>
                <select 
                  className="bg-secondary border border-border rounded-lg p-2 text-sm"
                  value={action.config.level || 'medium'}
                  onChange={(e) => onUpdateAction(action.id, { ...action.config, level: e.target.value })}
                >
                  <option value="low">Minimal compression (best quality)</option>
                  <option value="medium">Optimize for email (under 10MB)</option>
                  <option value="high">Maximum compression (lower quality)</option>
                </select>
              </div>
            </div>
          );
          
        case 'rename':
          return (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Rename pattern</label>
                <select 
                  className="bg-secondary border border-border rounded-lg p-2 text-sm"
                  value={action.config.pattern || 'prefix'}
                  onChange={(e) => onUpdateAction(action.id, { ...action.config, pattern: e.target.value })}
                >
                  <option value="prefix">Add text before file names</option>
                  <option value="suffix">Add text after file names</option>
                  <option value="replace">Replace text in file names</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">
                  {action.config.pattern === 'prefix' ? 'Prefix text' : 
                   action.config.pattern === 'suffix' ? 'Suffix text' : 
                   'Text to add'}
                </label>
                <input
                  type="text"
                  className="bg-secondary border border-border rounded-lg p-2 text-sm"
                  placeholder={action.config.pattern === 'prefix' ? 'Project-' : 
                              action.config.pattern === 'suffix' ? '-Final' : 
                              'New Text'}
                  value={action.config.text || ''}
                  onChange={(e) => onUpdateAction(action.id, { ...action.config, text: e.target.value })}
                />
                
                {action.config.pattern === 'prefix' && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Example: {(action.config.text || 'Project-') + 'Document.docx'}
                  </div>
                )}
                
                {action.config.pattern === 'suffix' && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Example: {'Document' + (action.config.text || '-Final') + '.docx'}
                  </div>
                )}
              </div>
            </div>
          );
          
        case 'compress':
          return (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Output format</label>
                <select 
                  className="bg-secondary border border-border rounded-lg p-2 text-sm"
                  value={action.config.format || 'zip'}
                  onChange={(e) => onUpdateAction(action.id, { ...action.config, format: e.target.value })}
                >
                  <option value="zip">ZIP format</option>
                  <option value="7z">7Z format (better compression)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Archive name</label>
                <input
                  type="text"
                  className="bg-secondary border border-border rounded-lg p-2 text-sm"
                  placeholder="archive"
                  value={action.config.filename || ''}
                  onChange={(e) => onUpdateAction(action.id, { ...action.config, filename: e.target.value })}
                />
              </div>
            </div>
          );
          
        case 'resize':
          return (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Resize method</label>
                <select 
                  className="bg-secondary border border-border rounded-lg p-2 text-sm"
                  value={action.config.method || 'percentage'}
                  onChange={(e) => onUpdateAction(action.id, { ...action.config, method: e.target.value })}
                >
                  <option value="percentage">Scale by percentage</option>
                  <option value="dimensions">Set specific dimensions</option>
                  <option value="maxWidth">Set maximum width</option>
                  <option value="maxHeight">Set maximum height</option>
                </select>
              </div>

              {action.config.method === 'percentage' && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">Scale percentage</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="bg-secondary border border-border rounded-lg p-2 text-sm"
                    value={action.config.percentage || 50}
                    onChange={(e) => onUpdateAction(action.id, { 
                      ...action.config, 
                      percentage: Math.max(1, Math.min(100, parseInt(e.target.value) || 50)) 
                    })}
                  />
                </div>
              )}

              {action.config.method === 'dimensions' && (
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-muted-foreground">Width (px)</label>
                    <input
                      type="number"
                      min="1"
                      className="bg-secondary border border-border rounded-lg p-2 text-sm"
                      value={action.config.width || 800}
                      onChange={(e) => onUpdateAction(action.id, { 
                        ...action.config, 
                        width: Math.max(1, parseInt(e.target.value) || 800) 
                      })}
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-muted-foreground">Height (px)</label>
                    <input
                      type="number"
                      min="1"
                      className="bg-secondary border border-border rounded-lg p-2 text-sm"
                      value={action.config.height || 600}
                      onChange={(e) => onUpdateAction(action.id, { 
                        ...action.config, 
                        height: Math.max(1, parseInt(e.target.value) || 600) 
                      })}
                    />
                  </div>
                </div>
              )}

              {(action.config.method === 'maxWidth' || action.config.method === 'maxHeight') && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">
                    {action.config.method === 'maxWidth' ? 'Maximum width (px)' : 'Maximum height (px)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="bg-secondary border border-border rounded-lg p-2 text-sm"
                    value={action.config.method === 'maxWidth' ? 
                      (action.config.maxWidth || 1024) : 
                      (action.config.maxHeight || 768)}
                    onChange={(e) => onUpdateAction(action.id, { 
                      ...action.config, 
                      [action.config.method === 'maxWidth' ? 'maxWidth' : 'maxHeight']: 
                        Math.max(1, parseInt(e.target.value) || 
                                (action.config.method === 'maxWidth' ? 1024 : 768)) 
                    })}
                  />
                </div>
              )}
            </div>
          );
          
        default:
          return <div className="text-sm text-muted-foreground">No configuration needed</div>;
      }
    };

    return (
      <div className="bg-secondary/60 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {getActionIcon(action.type)}
            <h3 className="text-base font-medium">{getActionTitle(action.type)}</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label={isOpen ? 'Collapse' : 'Expand'}
            >
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={() => onDeleteAction(action.id)}
              className="p-1 hover:bg-destructive/20 rounded-full transition-colors"
              aria-label="Delete action"
            >
              <FileX className="w-5 h-5 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        </div>
        
        {isOpen && <div className="pt-2">{renderConfigFields()}</div>}
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      {actions.length > 0 && (
        <div className="space-y-2">
          {actions.map((action) => (
            <ActionConfig key={action.id} action={action} />
          ))}
        </div>
      )}

      <div className="relative">
        {showActionMenu && (
          <div className="absolute bottom-full left-0 mb-2 bg-secondary border border-border rounded-lg shadow-lg w-64 overflow-hidden z-10">
            <div className="p-2 space-y-1">
              <button
                className="w-full flex items-center gap-2 p-2 hover:bg-white/10 rounded-md text-left"
                onClick={() => handleActionSelect('convert')}
              >
                <FileCode className="w-4 h-4" />
                <span>Convert file to other format</span>
              </button>
              <button
                className="w-full flex items-center gap-2 p-2 hover:bg-white/10 rounded-md text-left"
                onClick={() => handleActionSelect('resize')}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Resize images</span>
              </button>
              <button
                className="w-full flex items-center gap-2 p-2 hover:bg-white/10 rounded-md text-left"
                onClick={() => handleActionSelect('combine')}
              >
                <Folder className="w-4 h-4" />
                <span>Combine files</span>
              </button>
              <button
                className="w-full flex items-center gap-2 p-2 hover:bg-white/10 rounded-md text-left"
                onClick={() => handleActionSelect('reduce')}
              >
                <FileX className="w-4 h-4" />
                <span>Reduce file size</span>
              </button>
              <button
                className="w-full flex items-center gap-2 p-2 hover:bg-white/10 rounded-md text-left"
                onClick={() => handleActionSelect('compress')}
              >
                <FolderInput className="w-4 h-4" />
                <span>Compress files</span>
              </button>
              <button
                className="w-full flex items-center gap-2 p-2 hover:bg-white/10 rounded-md text-left"
                onClick={() => handleActionSelect('rename')}
              >
                <FilePlus className="w-4 h-4" />
                <span>File renaming</span>
              </button>
            </div>
          </div>
        )}
        
        {!showMore ? (
          <div className="text-center">
            <button
              className="action-button mx-auto"
              onClick={() => setShowMore(true)}
            >
              <Plus className="w-5 h-5" />
              <span>Add an action</span>
            </button>
          </div>
        ) : (
          <>
            {fileCount > 0 && (
              <div className="flex flex-col md:flex-row gap-4 flex-wrap">
                <button
                  className="action-button"
                  onClick={() => setShowActionMenu(!showActionMenu)}
                >
                  <Plus className="w-5 h-5" />
                  <span>{showActionMenu ? 'Cancel' : 'Add an action'}</span>
                </button>
                
                <div className="flex gap-4 justify-center md:justify-start flex-wrap">
                  <button
                    className="flex items-center gap-2 bg-secondary/40 hover:bg-secondary text-foreground/70 px-4 py-2 rounded-lg transition-colors"
                    onClick={onSaveActionSet}
                    disabled={actions.length === 0}
                  >
                    <Save className="w-5 h-5" />
                    <span>Save this action set</span>
                  </button>
                  
                  <button
                    className="primary-button flex items-center gap-2"
                    onClick={onProcess}
                    disabled={actions.length === 0}
                  >
                    <Download className="w-5 h-5" />
                    <span>Process & Download</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActionPanel;
