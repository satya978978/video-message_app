import { useRef, useEffect, useState } from 'react';
import { Pen, Square, Circle, Eraser, Trash2, Download, Palette, Pointer } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { WebsocketProvider } from 'y-websocket';
import fabricModule from 'fabric';
import { fabric } from 'fabric';
import { nanoid } from 'nanoid'

import * as Y from 'yjs';


export default function DrawingCanvas() {
  const canvasRef = useRef(null);
  const { sessionId } = useParams()
  const [Tool, setTool] = useState('pen')
  const [color, setcolor] = useState('#ffffff')
  const toolRef = useRef(null)
  const fabricRefcanvas = useRef(null)
  const path = useRef(null)
  const deleted_paths = useRef(null)

  useEffect(() => {

    const ydoc = new Y.Doc()
    const provider = new WebsocketProvider(import.meta.env.VITE_YJS_LINK, sessionId, ydoc)
    path.current = ydoc.getArray('paths')
    deleted_paths.current = ydoc.getArray('deleted')

    const canvasEl = canvasRef.current;
    canvasEl.width = canvasEl.parentElement.clientWidth;
    canvasEl.height = canvasEl.parentElement.clientHeight;
    fabricRefcanvas.current = new fabric.Canvas(canvasEl)

    fabricRefcanvas.current.on('path:created', (e) => {
      const pathdata = e.path.toObject()
      const id = nanoid()
     pathdata.id = id
      e.path.id = id
      path.current.push([pathdata])
    })


    const path_array = path.current.toArray()
    fabric.util.enlivenObjects(path_array, (obj) => {
      obj.forEach(element => {
        fabricRefcanvas.current.add(element)
      });
      fabricRefcanvas.current.renderAll()
    })

    deleted_paths.current.observe((event) => {
      event.changes.added.forEach((object) => {
        const id = object.content.getContent()[0];
        const objOfCanvas = fabricRefcanvas.current.getObjects()
        const target = objOfCanvas.find((obj) => obj.id === id);
        if (target) {
          fabricRefcanvas.current.remove(target)
          fabricRefcanvas.current.renderAll()

        }

      })
    })

    path.current.observe((event) => {
      event.changes.added.forEach((item) => {
        const data = item.content.getContent()[0]
        fabric.util.enlivenObjects([data], ([obj]) => {
          fabricRefcanvas.current.add(obj)
          fabricRefcanvas.current.renderAll()

        })

      })

    })
  }, [])
  useEffect(() => {


    if (Tool === 'pen') {
      fabricRefcanvas.current.isDrawingMode = true
      fabricRefcanvas.current.freeDrawingBrush.width = 3;
      fabricRefcanvas.current.freeDrawingBrush.color = '#FFFFFF';
    } else if (Tool === "pointer") {
      fabricRefcanvas.current.off('selection:created')
      fabricRefcanvas.current.isDrawingMode = false
    } else if (Tool === "eraser") {
      fabricRefcanvas.current.isDrawingMode = false
      fabricRefcanvas.current.on('selection:created', (e) => {
        const selected = e.selected[0]
        deleted_paths.current.push([selected.id])
        console.log(e)

      });



    }



  }, [Tool])




  return (
    <div className="w-full focus:outline-none h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 mb-2 bg-gray-800 p-1 rounded items-center justify-center mt-4">
        <button onClick={() => { setTool("pointer") }} className="p-1 rounded transition bg-gray-600 text-white hover:bg-gray-700">
          <Pointer className="w-4 h-4" />
        </button>
        <button onClick={() => { toolRef.current = 'pen'; setTool("pen") }} className="p-1 rounded transition bg-gray-600 text-white hover:bg-gray-700">
          <Pen className="w-4 h-4" />
        </button>

        <button onClick={() => { toolRef.current = 'eraser'; setTool("eraser") }} className="p-1 rounded transition bg-gray-600 text-white hover:bg-gray-700">
          <Eraser className="w-4 h-4" />
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