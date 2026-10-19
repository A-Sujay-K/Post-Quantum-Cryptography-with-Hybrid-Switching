import React from 'react';
import { X, File, Image as ImageIcon } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

/**
 * FilePreview — Liquid Glass Level 2 card for staged file attachments.
 */
const FilePreview = ({ file, onRemove }) => {
  const isImage = file.type?.startsWith('image/');

  return (
    <div className="p-2 sm:p-2.5 flex items-center gap-2.5 rounded-xl glass-l2 border border-[var(--edge-rest)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_16px_var(--shadow-color)] max-w-sm animate-enter select-none backdrop-blur-md">
      <div className="w-8 h-8 rounded-lg bg-[var(--surface-inner)] border border-[var(--edge-rest)] flex items-center justify-center shrink-0">
        {isImage ? (
          <ImageIcon size={15} className="text-[var(--col-standard)]" />
        ) : (
          <File size={15} className="text-[var(--text-secondary)]" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[var(--text-primary)] truncate">{file.name}</p>
        <p className="text-[10px] text-[var(--text-tertiary)] font-mono">{formatFileSize(file.size)}</p>
      </div>

      <button 
        type="button"
        onClick={onRemove}
        className="w-6 h-6 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer"
        aria-label="Remove attached file"
        title="Remove attachment"
      >
        <X size={13} />
      </button>
    </div>
  );
};

export default FilePreview;
