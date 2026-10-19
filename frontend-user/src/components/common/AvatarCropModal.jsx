import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Check, Upload } from 'lucide-react';

/**
 * AvatarCropModal
 * Square crop canvas with circular mask preview, zoom slider (1x - 3x),
 * center positioning, and reset controls.
 */
export default function AvatarCropModal({
  isOpen,
  imageSrc,
  onClose,
  onApplyCrop
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setZoom(1);
        setPan({ x: 0, y: 0 });
        drawPreview(img, 1, { x: 0, y: 0 });
      };
      img.src = imageSrc;
    }
  }, [imageSrc]);

  const drawPreview = (img, currentZoom, currentPan) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    const size = 320;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // Calculate scaling to fill square
    const scale = Math.max(size / img.width, size / img.height) * currentZoom;
    const drawW = img.width * scale;
    const drawH = img.height * scale;

    const drawX = (size - drawW) / 2 + currentPan.x;
    const drawY = (size - drawH) / 2 + currentPan.y;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  };

  const handleZoomChange = (e) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
    if (imgRef.current) {
      drawPreview(imgRef.current, newZoom, pan);
    }
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    if (imgRef.current) {
      drawPreview(imgRef.current, 1, { x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !imgRef.current) return;
    const newPan = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    };
    setPan(newPan);
    drawPreview(imgRef.current, zoom, newPan);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleApply = () => {
    if (!imgRef.current) return;
    // Export 512x512 canonical WebP/PNG blob
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 512;
    exportCanvas.height = 512;
    const ctx = exportCanvas.getContext('2d');

    const scale = Math.max(512 / imgRef.current.width, 512 / imgRef.current.height) * zoom;
    const drawW = imgRef.current.width * scale;
    const drawH = imgRef.current.height * scale;
    // Scale pan accordingly
    const panFactor = 512 / 320;
    const drawX = (512 - drawW) / 2 + pan.x * panFactor;
    const drawY = (512 - drawH) / 2 + pan.y * panFactor;

    ctx.drawImage(imgRef.current, drawX, drawY, drawW, drawH);

    exportCanvas.toBlob((blob) => {
      onApplyCrop(blob);
      onClose();
    }, 'image/webp', 0.9);
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="glass-l2 w-full max-w-[420px] rounded-[24px] border border-[var(--edge-rest)] shadow-2xl overflow-hidden flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--edge-rest)]">
          <div className="flex flex-col">
            <h2 className="text-base font-medium text-[var(--text-primary)]">Crop Profile Photo</h2>
            <span className="text-xs text-[var(--text-secondary)]">Drag to center · Zoom to fit</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[var(--edge-rest)] hover:bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--text-secondary)] transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Viewport & Circular Mask Preview */}
        <div className="relative my-6 mx-auto w-[280px] h-[280px] rounded-[20px] overflow-hidden border border-[var(--edge-rest)] bg-black/20 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <canvas ref={canvasRef} className="w-full h-full object-cover" />

          {/* Circular Mask Overlay */}
          <div className="absolute inset-0 pointer-events-none rounded-[20px] border-[2px] border-dashed border-[var(--col-standard)]/50">
            <div className="w-full h-full rounded-full ring-[999px] ring-black/40" />
          </div>
        </div>

        {/* Zoom Slider & Controls */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <ZoomOut size={15} className="text-[var(--text-tertiary)] shrink-0" />
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={handleZoomChange}
              className="w-full accent-[var(--col-standard)] cursor-pointer h-1.5 bg-[var(--surface-inner)] rounded-full"
            />
            <ZoomIn size={15} className="text-[var(--text-tertiary)] shrink-0" />
            <span className="text-xs font-mono text-[var(--text-secondary)] w-9 text-right">
              {zoom.toFixed(1)}x
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[var(--edge-rest)] mt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-[10px] border border-[var(--edge-rest)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-inner)] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-[12px] border border-[var(--edge-rest)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-4 py-2 rounded-[12px] btn-primary text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Check size={14} />
                <span>Apply</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
