import { useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileUpload = ({ file, onFileSelect, onFileRemove }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e, active) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(active);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      onFileSelect(droppedFile);
    }
  };

  const handleBrowse = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  if (file) {
    return (
      <div className="card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy/10 text-navy">
            <FileText size={20} />
          </span>
          <div>
            <p className="text-sm font-medium text-ink">{file.name}</p>
            <p className="text-xs text-muted">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <button
          onClick={onFileRemove}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-danger"
          aria-label="Remove file"
        >
          <X size={18} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
        dragActive ? 'border-navy bg-navy/5' : 'border-line bg-white'
      }`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/10 text-navy">
        <UploadCloud size={24} />
      </span>
      <div>
        <p className="text-sm font-medium text-ink">
          Drag and drop your resume here
        </p>
        <p className="text-xs text-muted">PDF only, up to 5MB</p>
      </div>
      <button onClick={() => inputRef.current?.click()} className="btn-outline">
        Browse File
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleBrowse}
      />
    </div>
  );
};

export default FileUpload;
