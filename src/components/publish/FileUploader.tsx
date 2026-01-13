import { useCallback, useState } from 'react';
import { Upload, X, File } from 'lucide-react';
import clsx from 'clsx';
import { formatBytes } from '@/utils/format';

interface FileUploaderProps {
  label?: string;
  accept?: string;
  helperText?: string;
  onChange: (file: File) => void;
  value?: File;
  error?: string;
}

export function FileUploader({
  label,
  accept,
  helperText,
  onChange,
  value,
  error,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        onChange(file);
      }
    },
    [onChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onChange(file);
      }
    },
    [onChange]
  );

  const handleRemove = () => {
    onChange(undefined as unknown as File);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}

      {value ? (
        <div className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg bg-neutral-50">
          <File className="w-8 h-8 text-primary-600" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-neutral-900 truncate">{value.name}</p>
            <p className="text-sm text-neutral-500">{formatBytes(value.size)}</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 hover:bg-neutral-200 rounded transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={clsx(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-neutral-300 hover:border-primary-400',
            error && 'border-red-500'
          )}
        >
          <Upload className="w-10 h-10 mx-auto text-neutral-400 mb-4" />
          <p className="text-neutral-600 mb-2">
            Drag and drop your file here, or{' '}
            <label className="text-primary-600 hover:text-primary-700 cursor-pointer">
              browse
              <input
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </p>
          {helperText && <p className="text-sm text-neutral-500">{helperText}</p>}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
