import { useRef, useEffect, useState } from 'react';
import { Pen, Square, Circle, Eraser, Trash2, Download, Palette, Pointer } from 'lucide-react';
import { fabric } from 'fabric'
import { useParams } from 'react-router-dom';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';


export default function DrawingCanvas() {
  const canvasRef = useRef(null);
  const { sessionId } = useParams()
  const [Tool, setTool] = useState('pen')
  const [color, setcolor] = useState('#ffffff')
  const toolRef= useRef(Tool)
   useEffect(()=>{
    toolRef.current=Tool
   },[Tool])

  useEffect(() => {

    const ydoc = new Y.Doc()
    const provider = new WebsocketProvider('ws://localhost:5000/yjs', sessionId, ydoc)
    const path = ydoc.getArray('paths')

    const canvasEl = canvasRef.current;
    canvasEl.width = canvasEl.parentElement.clientWidth;
    canvasEl.height = canvasEl.parentElement.clientHeight;
    const canvas = new fabric.Canvas(canvasEl)
    if (toolRef.current === 'pen') {
          canvas.isDrawingMode = true

      canvas.freeDrawingBrush.width = 3;
    canvas.freeDrawingBrush.color = '#FFFFFF';

    }
    

    canvas.on('path:created', (e) => {
      const pathdata = e.path.toObject()
      path.push([pathdata])
    })


    const path_array = path.toArray()
    fabric.util.enlivenObjects(path_array, (obj) => {
      obj.forEach(element => {
        canvas.add(element)
      });
      canvas.renderAll()
    })

    path.observe((event) => {
      event.changes.added.forEach((item) => {
        const data = item.content.getContent()[0]
        fabric.util.enlivenObjects([data], ([obj]) => {
          canvas.add(obj)
          canvas.renderAll()

        })

      })

    })
    let isdown = false
    let x = 0
    let y = 0
    let rect = null

    canvas.on('mouse:down', (e) => {
      if (toolRef.current !=='square') return
      isdown = true
      const pointer = canvas.getPointer(e.e)
      x = pointer.x
      y = pointer.y
      rect = new fabric.Rect({
        left: x,
        top: y,
        width:0,
        height: 0,
        stroke: color,
        strokeWidth: 3,
        fill: 'transparent'
      })
      canvas.add(rect)
      path.push([rect])
    })
    canvas.on('mouse:move', (e) => {
      if (toolRef.current !=='square') return
      if (!isdown) return
      const pointer = canvas.getPointer(e.e)
     
     rect.set({
      left:Math.min(x,pointer.x),
      top:Math.min(y,pointer.y),
      width:Math.abs(pointer.x - x),
      height:Math.abs(pointer.y-y)
     })
      canvas.renderAll();

    })
    canvas.on('mouse:up',()=>{
      isdown = false
    })

  }, [])


  return (
    <div className="w-full focus:outline-none h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 mb-2 bg-gray-800 p-1 rounded items-center justify-center mt-4">
        <button className="p-1 rounded transition bg-gray-600 text-white hover:bg-gray-700">
          <Pointer onClick={() => { setTool("pointer") }} className="w-4 h-4" />
        </button>
        <button className="p-1 rounded transition bg-gray-600 text-white hover:bg-gray-700">
          <Pen onClick={() => { setTool('pen') }} className="w-4 h-4" />
        </button>
        <button className="p-1 rounded transition bg-gray-600 text-white hover:bg-gray-700">
          <Square onClick={() => { setTool("square") }} className="w-4 h-4" />
        </button>
        <button className="p-1 rounded transition bg-gray-600 text-white hover:bg-gray-700">
          <Eraser onClick={() => { setTool('eraser')}} className="w-4 h-4" />
        </button>
      </div>

      {/* Canvas Area */}
      <div className="bg-gray-900 p-3 rounded text-white min-h-[200px] max-h-[480px] overflow-auto flex-1">
        <div className="w-full h-full rounded overflow-hidden">
          <canvas className="w-full h-full" ref={canvasRef} />
        </div>
      </div>
    </div>

  );
}