import { useRef, useEffect, useState } from 'react';
import { Pen, Square, Circle, Eraser, Trash2, Download, Palette } from 'lucide-react';
import { fabric } from 'fabric'
const drawingTools = [
  { id: 'pen', icon: Pen, label: 'Pen' },
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'eraser', icon: Eraser, label: 'Eraser' },
];

const colors = [
  '#ffffff', '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#000000'
];

export default function DrawingCanvas({ sessionId }) {
  const canvasRef = useRef(null);

  useEffect(() => {  
   const canvasEl = canvasRef.current;
    canvasEl.width = canvasEl.parentElement.clientWidth;
    canvasEl.height = canvasEl.parentElement.clientHeight;
    const canvas = new fabric.Canvas(canvasEl)
    canvas.isDrawingMode = true
    canvas.freeDrawingBrush.width = 3;
    canvas.freeDrawingBrush.color = '#FFFFFF';
     
  }, [])




  return (
    <div className="h-full flex flex-col">


      <div className="flex-1 p-6">
        <div className="w-full h-full glass-panel rounded-xl overflow-hidden">
          <canvas 
           
            className="w-full h-full" ref={canvasRef}
          />
        </div>
      </div>
    </div>
  );
}