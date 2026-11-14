import { FolderUp, Trash2, Upload, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { ManifestAuditSummary } from '../types/portfolio';

interface AssetDrawerModalProps {
  isOpen: boolean;
  audit: ManifestAuditSummary;
  onClose: () => void;
  onFilesSelected: (files: FileList) => Promise<number>;
  onClearLocalAssets: () => Promise<void>;
}

export const AssetDrawerModal: React.FC<AssetDrawerModalProps> = ({
  isOpen,
  audit,
  onClose,
  onFilesSelected,
  onClearLocalAssets,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const matchedCount = await onFilesSelected(files);
    setStatusMessage(
      `Matched ${matchedCount} portfolio file${matchedCount === 1 ? '' : 's'} by filename and saved them locally in your browser.`,
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Load local portfolio assets"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#080A16]/80 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-[#101327] p-6 text-[#F1EDE8] shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-white/12 pb-5">
          <div>
            <p className="font-editorial-mono text-xs text-[#FF713F]">
              Local Portfolio Hydration
            </p>
            <h2 className="mt-1.5 font-editorial-sans text-2xl font-bold text-[#F1EDE8]">
              Load Your Original Design Files
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close asset loader"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white hover:bg-[#FF713F] hover:border-[#FF713F]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[#F1EDE8]/75">
          Select your local <code className="font-editorial-mono text-[#F0C885]">/assets/portfolio/</code> folder or drag and drop your PNG, JPG, MP4, and PDF files below. Files are matched automatically by filename (including Vietnamese diacritics) and persisted in browser IndexedDB without altering original artwork, ratios, or colors.
        </p>

        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            void handleFiles(e.dataTransfer.files);
          }}
          className={`mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center transition-colors ${
            isDragging
              ? 'border-[#FF713F] bg-[#FF713F]/10'
              : 'border-white/20 bg-[#161936]'
          }`}
        >
          <Upload className="h-8 w-8 text-[#F0C885]" />
          <p className="mt-3 text-sm font-semibold text-[#F1EDE8]">
            Drop portfolio files here
          </p>
          <p className="mt-1 text-xs text-[#F1EDE8]/60">
            Supports all {audit.totalCataloged} PNG, JPG, WEBP, PDF, and MP4 assets
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => folderInputRef.current?.click()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#FF713F] px-4 py-2 text-xs font-semibold text-white hover:bg-[#e85f2f] whitespace-nowrap shrink-0"
            >
              <FolderUp className="h-4 w-4" />
              <span>Select Folder</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-[#F1EDE8] hover:border-[#F0C885] whitespace-nowrap shrink-0"
            >
              <Upload className="h-4 w-4" />
              <span>Select Multiple Files</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/mp4,application/pdf"
            className="hidden"
            onChange={(e) => void handleFiles(e.target.files)}
          />
          <input
            ref={folderInputRef}
            type="file"
            multiple
            // @ts-expect-error webkitdirectory is supported in Chromium/WebKit/Firefox
            webkitdirectory=""
            className="hidden"
            onChange={(e) => void handleFiles(e.target.files)}
          />
        </div>

        {statusMessage && (
          <p className="mt-4 rounded-lg border border-[#F0C885]/30 bg-[#F0C885]/10 px-4 py-2.5 text-xs text-[#F0C885]">
            {statusMessage}
          </p>
        )}

        {/* Current Audit Breakdown */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/12 pt-5 text-xs">
          <div className="font-editorial-mono text-[#F1EDE8]/75">
            Loaded: <strong className="text-[#F0C885]">{audit.availableCount}</strong> /{' '}
            {audit.totalCataloged} assets ({audit.missingCount} missing on disk)
          </div>

          <button
            type="button"
            onClick={async () => {
              await onClearLocalAssets();
              setStatusMessage('Cleared locally cached files from browser storage.');
            }}
            className="inline-flex cursor-pointer items-center gap-1.5 text-[#F1EDE8]/65 hover:text-[#FF713F] whitespace-nowrap shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Cached Files</span>
          </button>
        </div>
      </div>
    </div>
  );
};
