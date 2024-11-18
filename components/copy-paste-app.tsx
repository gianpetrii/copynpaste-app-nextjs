'use client'

import React, { useState, useRef, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clipboard, File, FileText, Image as ImageIcon, Link, Plus, Trash2, Copy, Check, Upload, Download, Edit, Save, X } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type CopiedItem = {
  id: string;
  type: 'file' | 'text';
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  file?: File;
}

type SortOption = 'newest' | 'oldest' | 'az' | 'za'

export function CopyPasteAppComponent() {
  const [items, setItems] = useState<CopiedItem[]>([
    { id: '1', type: 'file', content: 'documento.pdf', createdAt: new Date(2023, 5, 1), modifiedAt: new Date(2023, 5, 1) },
    { id: '2', type: 'text', content: 'Recordatorio:\ncomprar leche\ncomprar pan', createdAt: new Date(2023, 5, 2), modifiedAt: new Date(2023, 5, 2) },
    { id: '3', type: 'text', content: 'https://ejemplo.com', createdAt: new Date(2023, 5, 3), modifiedAt: new Date(2023, 5, 3) },
    { id: '4', type: 'file', content: 'imagen.jpg', createdAt: new Date(2023, 5, 4), modifiedAt: new Date(2023, 5, 4) },
    { id: '5', type: 'text', content: 'Número de teléfono:\n123-456-7890', createdAt: new Date(2023, 5, 5), modifiedAt: new Date(2023, 5, 5) },
  ])
  const [newText, setNewText] = useState<string>('')
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [uploadedFileName, setUploadedFileName] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text')

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime()
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime()
        case 'az':
          return a.content.localeCompare(b.content)
        case 'za':
          return b.content.localeCompare(a.content)
        default:
          return 0
      }
    })
  }, [items, sortOption])

  const addTextItem = () => {
    if (newText.trim()) {
      const now = new Date();
      setItems(prevItems => [
        ...prevItems,
        { 
          id: now.getTime().toString(),
          type: 'text',
          content: newText,
          createdAt: now,
          modifiedAt: now
        }
      ])
      setNewText('')
    }
  }

  const addFileItem = (file: File) => {
    const now = new Date();
    setItems(prevItems => [
      ...prevItems,
      { 
        id: now.getTime().toString(),
        type: 'file',
        content: file.name,
        createdAt: now,
        modifiedAt: now,
        file: file
      }
    ])
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadStatus('uploading')
      setUploadedFileName(file.name)
      
      setTimeout(() => {
        addFileItem(file)
        setUploadStatus('done')
        setTimeout(() => {
          setUploadStatus('idle')
          setUploadedFileName('')
        }, 3000)
      }, 1000)
    }
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const copyItem = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedItemId(id)
    setTimeout(() => setCopiedItemId(null), 2000)
  }

  const downloadItem = (item: CopiedItem) => {
    if (item.file) {
      const url = URL.createObjectURL(item.file)
      const a = document.createElement('a')
      a.href = url
      a.download = item.content
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const startEditing = (id: string, content: string) => {
    setEditingItemId(id)
    setEditingContent(content)
  }

  const saveEdit = (id: string) => {
    setItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, content: editingContent, modifiedAt: new Date() } : item
    ))
    setEditingItemId(null)
    setEditingContent('')
  }

  const getIcon = (type: 'file' | 'text', content: string) => {
    if (type === 'file') {
      if (content.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
        return <ImageIcon className="w-6 h-6 text-[#415a77]" />
      } else {
        return <File className="w-6 h-6 text-[#415a77]" />
      }
    } else {
      return content.startsWith('http') 
        ? <Link className="w-6 h-6 text-[#415a77]" />
        : <FileText className="w-6 h-6 text-[#415a77]" />
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0e1dd] to-[#778da9] animate-gradient-x">
      <div className="absolute inset-0 bg-grid-white/[0.2] bg-grid-8" />
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-2xl px-2 py-8 sm:px-6 sm:py-24 lg:max-w-3xl">
          <div className="backdrop-blur-sm bg-white/30 rounded-2xl shadow-xl ring-1 ring-black/5 p-8">
            <div className="flex items-center justify-center mb-8">
              <Clipboard className="w-12 h-12 mr-4 text-[#0d1b2a]" />
              <h1 className="text-4xl font-bold text-center text-[#0d1b2a]">Copy&Paste</h1>
            </div>

            <Tabs 
              defaultValue="text" 
              className="mb-8"
              onValueChange={(value) => setActiveTab(value as 'text' | 'file')}
            >
              <TabsList className="grid w-full grid-cols-2 bg-white/50 p-1">
                <TabsTrigger className="px-2 sm:px-4" value="text">Texto</TabsTrigger>
                <TabsTrigger className="px-2 sm:px-4" value="file">Archivo</TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="mt-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Textarea
                    placeholder="Ingresa tu texto aquí"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    className="bg-[#e0e1dd] resize-none flex-grow mb-2"
                    rows={1}
                  />
                </div>
              </TabsContent>
              <TabsContent value="file" className="mt-4">
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="w-full bg-[#415a77] hover:bg-[#1b263b] text-[#e0e1dd]"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Subir archivo
                  </Button>
                  <div className="text-center">
                    {uploadStatus === 'idle' && !uploadedFileName && (
                      <span className="text-sm text-gray-600">Ningún archivo seleccionado</span>
                    )}
                    {uploadStatus !== 'idle' && (
                      <div className={`text-sm flex items-center justify-center gap-2 ${
                        uploadStatus === 'error' ? 'text-red-500' : 
                        uploadStatus === 'done' ? 'text-green-600' : 
                        'text-blue-600'
                      }`}>
                        {uploadStatus === 'uploading' && (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-current"/>
                            <span>Subiendo {uploadedFileName}...</span>
                          </>
                        )}
                        {uploadStatus === 'done' && (
                          <>
                            <Check className="w-4 h-4" />
                            <span>¡{uploadedFileName} subido con éxito!</span>
                          </>
                        )}
                        {uploadStatus === 'error' && (
                          <>
                            <X className="w-4 h-4" />
                            <span>Error al subir el archivo</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mb-4 flex justify-end items-center gap-4 px-2">
              {activeTab === 'text' && (
                <Button onClick={addTextItem} className="bg-[#415a77] hover:bg-[#1b263b] text-[#e0e1dd] flex-grow">
                  <Plus className="w-4 h-4 mr-2" /> Agregar
                </Button>
              )}
              <Select value={sortOption} onValueChange={(value: SortOption) => setSortOption(value)}>
                <SelectTrigger className="w-[180px] bg-[#e0e1dd]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Más reciente</SelectItem>
                  <SelectItem value="oldest">Más antiguo</SelectItem>
                  <SelectItem value="az">A-Z</SelectItem>
                  <SelectItem value="za">Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="h-[400px] w-full rounded-md border border-white/20 bg-white/10 p-2 sm:p-4">
              <TooltipProvider>
                {sortedItems.map((item) => (
                  <Card 
                    key={item.id}
                    className="mb-4 hover:shadow-lg transition-shadow duration-200 bg-[#e0e1dd]/90 backdrop-blur-sm"
                  >
                    <CardContent className="p-2 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="flex items-start space-x-3 flex-grow">
                          <div className="mt-1">
                            {getIcon(item.type, item.content)}
                          </div>
                          <div className="flex-grow min-w-0">
                            {editingItemId === item.id ? (
                              <Textarea
                                value={editingContent}
                                onChange={(e) => setEditingContent(e.target.value)}
                                className="bg-[#e0e1dd] resize-none"
                                rows={1}
                              />
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <h3 className="font-medium text-lg text-gray-800 line-clamp-1" title={item.content}>
                                    {item.content}
                                  </h3>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <pre className="whitespace-pre-wrap break-words max-w-xs">{item.content}</pre>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            <div className="flex flex-wrap items-center gap-x-4 text-sm text-gray-600 mt-1">
                              <span className="whitespace-nowrap">
                                Creado: {format(item.createdAt, "dd MMM yy", { locale: es })}
                              </span>
                              {item.type === 'text' && (
                                <span className="whitespace-nowrap">
                                  Modificado: {format(item.modifiedAt, "dd MMM yy", { locale: es })}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end sm:justify-start space-x-2 mt-2 sm:mt-0">
                          {item.type === 'text' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => editingItemId === item.id ? saveEdit(item.id) : startEditing(item.id, item.content)}
                                  className="hover:bg-[#415a77]/20 transition-colors duration-200"
                                >
                                  {editingItemId === item.id ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                                  <span className="sr-only">{editingItemId === item.id ? 'Guardar' : 'Editar'}</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {editingItemId === item.id ? 'Guardar' : 'Editar'}
                              </TooltipContent>
                            </Tooltip>
                          )}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => item.type === 'file' ? downloadItem(item) : copyItem(item.id, item.content)}
                                className={`transition-colors duration-200 ${copiedItemId === item.id ? 'text-green-500' : 'hover:bg-[#415a77]/20'}`}
                              >
                                {item.type === 'file' ? 
                                  <Download className="w-4 h-4" /> : 
                                  (copiedItemId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />)
                                }
                                <span className="sr-only">
                                  {item.type === 'file' ? 'Descargar archivo' : (copiedItemId === item.id ? 'Copiado' : 'Copiar elemento')}
                                </span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {item.type === 'file' ? 'Descargar' : (copiedItemId === item.id ? 'Copiado!' : 'Copiar')}
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeItem(item.id)}
                                className="hover:bg-red-400/20 transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="sr-only">Eliminar elemento</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Eliminar
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TooltipProvider>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}