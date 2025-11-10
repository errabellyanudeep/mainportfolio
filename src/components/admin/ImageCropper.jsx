import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Upload, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

export default function ImageCropper({ onImageCropped, disabled = false }) {
  const [showDialog, setShowDialog] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        setImageSrc(event.target.result);
        setShowDialog(true);
        setZoom(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!canvas || !ctx || !img) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();

    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    const imgWidth = img.width;
    const imgHeight = img.height;
    const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);

    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;

    ctx.drawImage(
      img,
      -scaledWidth / 2 + position.x,
      -scaledHeight / 2 + position.y,
      scaledWidth,
      scaledHeight
    );

    ctx.restore();
  };

  React.useEffect(() => {
    if (imageSrc && canvasRef.current) {
      drawCanvas();
    }
  }, [imageSrc, zoom, rotation, position]);

  const handleMouseDown = (e) => {
    setDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleCrop = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });
      await onImageCropped(file);
      setShowDialog(false);
      setImageSrc(null);
    }, "image/jpeg", 0.95);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        className="border-white/30 text-white hover:bg-white/10"
      >
        <Upload className="w-4 h-4 mr-2" />
        {disabled ? 'Uploading...' : 'Upload & Crop'}
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="backdrop-blur-2xl bg-slate-900/95 border-white/20 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Crop & Adjust Image</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Canvas */}
            <div className="relative bg-black/50 rounded-lg overflow-hidden border-2 border-white/20">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="cursor-move w-full"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
              <div className="absolute top-2 left-2 text-xs bg-black/60 px-2 py-1 rounded">
                Drag to reposition • Scroll to zoom
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <ZoomIn className="w-4 h-4" />
                    Zoom
                  </label>
                  <span className="text-sm text-white/60">{Math.round(zoom * 100)}%</span>
                </div>
                <Slider
                  value={[zoom]}
                  onValueChange={([value]) => setZoom(value)}
                  min={0.5}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <RotateCw className="w-4 h-4" />
                    Rotation
                  </label>
                  <span className="text-sm text-white/60">{rotation}°</span>
                </div>
                <Slider
                  value={[rotation]}
                  onValueChange={([value]) => setRotation(value)}
                  min={0}
                  max={360}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDialog(false);
                  setImageSrc(null);
                }}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCrop}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Apply Crop
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}