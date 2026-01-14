
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ChecklistSection, ChecklistCategory, ChecklistItem, ItemStatus, AppState } from './types';
import { INITIAL_SECTIONS } from './constants';
import { 
  Download, 
  Trash2, 
  Save,
  AlertTriangle,
  X,
  Check,
  ChevronDown,
  FileText,
  User,
  ArrowUp,
  GripVertical,
  Plus,
  Copy,
  Edit2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// DND Kit Imports
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const STORAGE_KEY = 'checkmaster_pro_state_v3';

// Componente visual para o item da sidebar
const SidebarItemUI = React.forwardRef<HTMLDivElement, { 
  section: ChecklistSection; 
  isActive?: boolean; 
  isDragging?: boolean;
  isOverlay?: boolean;
  onClick?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  onDuplicate?: (e: React.MouseEvent) => void;
  listeners?: any;
  attributes?: any;
  style?: React.CSSProperties;
}>(({ section, isActive, isDragging, isOverlay, onClick, onDelete, onDuplicate, listeners, attributes, style }, ref) => {
  return (
    <div
      ref={ref}
      style={style}
      className={`group flex items-center w-full rounded-md transition-all mb-1 ${
        isActive ? 'bg-[#4e59e1] text-white shadow-sm' : 'hover:bg-slate-100 text-slate-500'
      } ${isDragging && !isOverlay ? 'opacity-20' : 'opacity-100'} ${
        isOverlay ? 'shadow-xl bg-white text-slate-800 scale-105 z-[100]' : ''
      }`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className={`p-2.5 cursor-grab active:cursor-grabbing rounded-l-md transition-colors ${
          isActive ? 'text-white/30 hover:text-white/60' : 'text-slate-300 hover:text-slate-400'
        }`}
      >
        <GripVertical className="w-3.5 h-3.5" />
      </div>

      <button
        onClick={onClick}
        className={`flex-1 text-left py-2.5 pr-2 text-[10px] font-bold uppercase truncate ${
          isActive ? 'text-white' : 'group-hover:text-slate-700'
        }`}
      >
        {section.title}
      </button>

      {!isOverlay && (
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all pr-1">
          <button
            onClick={onDuplicate}
            className={`p-1.5 rounded-md ${isActive ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-200 text-slate-400'}`}
            title="Duplicar"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className={`p-1.5 rounded-md ${isActive ? 'hover:bg-white/10 text-white' : 'hover:bg-red-50 text-slate-400 hover:text-red-500'}`}
            title="Excluir"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
});

const SortableSidebarItem: React.FC<{ 
  section: ChecklistSection; 
  isActive: boolean; 
  onClick: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (section: ChecklistSection) => void;
}> = ({ section, isActive, onClick, onDelete, onDuplicate }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Translate.toString(transform), transition };

  return (
    <SidebarItemUI
      ref={setNodeRef}
      section={section}
      isActive={isActive}
      isDragging={isDragging}
      onClick={onClick}
      onDelete={(e) => { e.stopPropagation(); onDelete(section.id); }}
      onDuplicate={(e) => { e.stopPropagation(); onDuplicate(section); }}
      listeners={listeners}
      attributes={attributes}
      style={style}
    />
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, activeSectionId: parsed.activeSectionId || INITIAL_SECTIONS[0].id };
      } catch (e) { console.error(e); }
    }
    return { sections: INITIAL_SECTIONS, activeSectionId: INITIAL_SECTIONS[0].id, projectName: 'Checklist Estrutural' };
  });

  const [lastSaved, setLastSaved] = useState<string>('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setLastSaved(new Date().toLocaleTimeString('pt-BR'));
  }, [state]);

  const activeSection = useMemo(() => {
    return state.sections.find(s => s.id === state.activeSectionId) || state.sections[0] || INITIAL_SECTIONS[0];
  }, [state.sections, state.activeSectionId]);

  const draggedSection = useMemo(() => state.sections.find(s => s.id === activeDragId), [state.sections, activeDragId]);

  const addSection = () => {
    const newId = `section-${Date.now()}`;
    const newSection: ChecklistSection = {
      id: newId,
      title: 'Novo Módulo',
      categories: [{ id: `cat-${Date.now()}`, title: 'Nova Categoria', items: [] }],
      projectCode: '', designer: '', reviewer: ''
    };
    setState(prev => ({ ...prev, sections: [...prev.sections, newSection], activeSectionId: newId }));
  };

  const duplicateSection = (section: ChecklistSection) => {
    const newId = `section-copy-${Date.now()}`;
    const copy: ChecklistSection = JSON.parse(JSON.stringify(section));
    copy.id = newId;
    copy.title = `${copy.title} (Cópia)`;
    setState(prev => ({ ...prev, sections: [...prev.sections, copy], activeSectionId: newId }));
  };

  const deleteSection = (id: string) => {
    if (state.sections.length <= 1) return;
    setState(prev => {
      const newSections = prev.sections.filter(s => s.id !== id);
      return { ...prev, sections: newSections, activeSectionId: id === prev.activeSectionId ? newSections[0].id : prev.activeSectionId };
    });
  };

  const addCategory = () => {
    const newCat: ChecklistCategory = { id: `cat-${Date.now()}`, title: 'Nova Categoria', items: [] };
    setState(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === state.activeSectionId ? { ...s, categories: [...s.categories, newCat] } : s)
    }));
  };

  const deleteCategory = (catId: string) => {
    setState(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === state.activeSectionId ? { ...s, categories: s.categories.filter(c => c.id !== catId) } : s)
    }));
  };

  const addItem = (catId: string) => {
    const newItem: ChecklistItem = { id: `item-${Date.now()}`, label: 'Novo Item', status: 'PENDING' };
    setState(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === state.activeSectionId ? {
        ...s, categories: s.categories.map(c => c.id === catId ? { ...c, items: [...c.items, newItem] } : c)
      } : s)
    }));
  };

  const deleteItem = (catId: string, itemId: string) => {
    setState(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === state.activeSectionId ? {
        ...s, categories: s.categories.map(c => c.id === catId ? { ...c, items: c.items.filter(i => i.id !== itemId) } : c)
      } : s)
    }));
  };

  const updateItemLabel = (catId: string, itemId: string, label: string) => {
    setState(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === state.activeSectionId ? {
        ...s, categories: s.categories.map(c => c.id === catId ? {
          ...c, items: c.items.map(i => i.id === itemId ? { ...i, label } : i)
        } : c)
      } : s)
    }));
  };

  const updateCategoryTitle = (catId: string, title: string) => {
    setState(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === state.activeSectionId ? {
        ...s, categories: s.categories.map(c => c.id === catId ? { ...c, title } : c)
      } : s)
    }));
  };

  const handleStatusChange = (sectionId: string, categoryId: string, itemId: string, newStatus: ItemStatus) => {
    setState(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          categories: section.categories.map(cat => {
            if (cat.id !== categoryId) return cat;
            return {
              ...cat,
              items: cat.items.map(item => {
                if (item.id !== itemId) return item;
                return { ...item, status: item.status === newStatus ? 'PENDING' : newStatus };
              })
            };
          })
        };
      })
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setState((prev) => {
        const oldIndex = prev.sections.findIndex((s) => s.id === active.id);
        const newIndex = prev.sections.findIndex((s) => s.id === over.id);
        return { ...prev, sections: arrayMove(prev.sections, oldIndex, newIndex) };
      });
    }
    setActiveDragId(null);
  };

  const confirmResetAll = () => {
    setState({
      sections: INITIAL_SECTIONS,
      activeSectionId: INITIAL_SECTIONS[0].id,
      projectName: 'Checklist Estrutural'
    });
    setIsResetModalOpen(false);
  };

  const getSectionProgress = (section: ChecklistSection) => {
    if (!section || !section.categories) return 0;
    const allItems = section.categories.flatMap(c => c.items);
    if (allItems.length === 0) return 0;
    const completed = allItems.filter(i => i.status !== 'PENDING').length;
    return Math.round((completed / allItems.length) * 100);
  };

  const exportToPDF = (type: 'active' | 'all') => {
    const doc = new jsPDF();
    const sectionsToExport = type === 'active' ? [activeSection] : state.sections;
    sectionsToExport.forEach((section, index) => {
      if (index > 0) doc.addPage();
      doc.setFontSize(20); doc.setTextColor(78, 89, 225); doc.text(state.projectName, 14, 20);
      doc.setFontSize(10); doc.setTextColor(100); doc.text(`Progresso: ${getSectionProgress(section)}%`, 160, 26);
      doc.setFontSize(14); doc.setTextColor(60); doc.text(section.title.toUpperCase(), 14, 44);
      const tableData: any[] = [];
      section.categories.forEach(cat => {
        tableData.push([{ content: cat.title, colSpan: 2, styles: { fillColor: [245, 247, 255], textColor: [78, 89, 225], fontStyle: 'bold' } }]);
        cat.items.forEach(item => {
          tableData.push([item.label, item.status === 'OK' ? 'OK' : item.status === 'NA' ? 'N/A' : 'Pendente']);
        });
      });
      autoTable(doc, { startY: 48, head: [['Item', 'Status']], body: tableData, theme: 'grid', headStyles: { fillColor: [78, 89, 225] } });
    });
    doc.save(`${state.projectName.replace(/\s+/g, '_')}.pdf`);
    setShowExportMenu(false);
  };

  // Handler para atualizar o estado de visibilidade do botão Voltar ao Topo
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setShowScrollTop(scrollContainerRef.current.scrollTop > 300);
    }
  };

  // Função para scroll suave até o topo
  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-20">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Módulos</span>
          <button onClick={addSection} className="p-1.5 text-[#4e59e1] hover:bg-indigo-50 rounded-md transition-all">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={(e) => setActiveDragId(e.active.id as string)} onDragEnd={handleDragEnd}>
            <SortableContext items={state.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {state.sections.map(section => (
                <SortableSidebarItem 
                  key={section.id} section={section} isActive={section.id === state.activeSectionId} 
                  onClick={() => setState(p => ({ ...p, activeSectionId: section.id }))} 
                  onDelete={deleteSection} onDuplicate={duplicateSection}
                />
              ))}
            </SortableContext>
            <DragOverlay zIndex={1000}>
              {activeDragId && draggedSection ? <SidebarItemUI section={draggedSection} isActive={draggedSection.id === state.activeSectionId} isOverlay /> : null}
            </DragOverlay>
          </DndContext>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white border-b border-slate-200 pt-8 pb-4 px-10 shadow-sm z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 max-w-2xl">
              <input value={state.projectName} onChange={(e) => setState(p => ({ ...p, projectName: e.target.value }))} className="text-2xl font-bold text-slate-800 border-none p-0 focus:ring-0 w-full bg-transparent" placeholder="Nome do Projeto" />
              <div className="flex items-center gap-2 mt-1">
                <Edit2 className="w-3 h-3 text-[#4e59e1] opacity-40" />
                <input value={activeSection.title} onChange={(e) => setState(p => ({ ...p, sections: p.sections.map(s => s.id === state.activeSectionId ? { ...s, title: e.target.value } : s) }))} className="text-sm font-bold text-[#4e59e1] uppercase border-none p-0 focus:ring-0 bg-transparent w-full" />
              </div>
            </div>
            <div className="flex gap-3 relative" ref={exportMenuRef}>
              <button onClick={() => setShowExportMenu(!showExportMenu)} className="flex items-center gap-2 px-5 py-2.5 bg-[#10b981] text-white rounded-lg text-sm font-bold hover:bg-[#0da070] transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Exportar <ChevronDown className={`w-4 h-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
              </button>
              {showExportMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <button onClick={() => exportToPDF('active')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left font-bold">Relatório Atual</button>
                  <button onClick={() => exportToPDF('all')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left font-bold border-t border-slate-50">Relatório Geral</button>
                </div>
              )}
              <button onClick={() => setIsResetModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-500 rounded-lg text-sm font-bold hover:bg-red-50 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" /> Resetar
              </button>
            </div>
          </div>
          <div className="space-y-2 mb-2">
            <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-wider"><span>Progresso</span><span>{getSectionProgress(activeSection)}%</span></div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden"><div className="bg-[#4e59e1] h-full rounded-full transition-all duration-700" style={{ width: `${getSectionProgress(activeSection)}%` }} /></div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-4"><Save className="w-3 h-3" /><span>Sincronizado: {lastSaved}</span></div>
        </header>

        <div 
          ref={scrollContainerRef} 
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-10 scroll-smooth relative"
        >
          <div className="max-w-6xl mx-auto space-y-8 pb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {['projectCode', 'designer', 'reviewer'].map((field) => (
                 <div key={field} className="bg-white border border-slate-200 rounded-xl flex items-center px-5 py-3 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center mr-4 shrink-0">{field === 'projectCode' ? <FileText className="w-4 h-4 text-indigo-500" /> : <User className="w-4 h-4 text-indigo-500" />}</div>
                    <div className="flex-1">
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">{field === 'projectCode' ? 'Código' : field === 'designer' ? 'Projetista' : 'Revisor'}</p>
                      <input type="text" value={(activeSection as any)[field] || ''} onChange={(e) => setState(p => ({ ...p, sections: p.sections.map(s => s.id === state.activeSectionId ? { ...s, [field]: e.target.value } : s) }))} className="w-full border-none p-0 text-sm font-bold text-slate-700 focus:ring-0 bg-transparent" placeholder="..." />
                    </div>
                 </div>
               ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-[#4e59e1] text-white px-10 py-5 flex justify-between items-center">
                <h2 className="text-xl font-bold uppercase tracking-wider">{activeSection.title}</h2>
                <button onClick={addCategory} className="opacity-0 hover:opacity-100 flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold transition-all uppercase tracking-widest"><Plus className="w-3.5 h-3.5" /> Nova Categoria</button>
              </div>

              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                {activeSection.categories.map(category => (
                  <div key={category.id} className="space-y-6 group/cat">
                    <div className="flex justify-between items-center border-b border-indigo-50 pb-3">
                      <input value={category.title} onChange={(e) => updateCategoryTitle(category.id, e.target.value)} className="text-base font-bold text-slate-800 bg-transparent border-none p-0 focus:ring-0 w-full" placeholder="Categoria" />
                      <div className="flex gap-1 opacity-0 group-hover/cat:opacity-100 transition-opacity">
                        <button onClick={() => addItem(category.id)} className="p-1 text-indigo-400 hover:bg-indigo-50 rounded"><Plus className="w-4 h-4" /></button>
                        <button onClick={() => deleteCategory(category.id)} className="p-1 text-slate-300 hover:text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {category.items.map(item => (
                        <div key={item.id} className="flex items-center gap-5 group/item py-0.5">
                          <div className="flex items-center gap-2 shrink-0">
                            <button 
                              onClick={() => handleStatusChange(activeSection.id, category.id, item.id, 'OK')} 
                              className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${item.status === 'OK' ? 'bg-[#22c55e] border-[#22c55e]' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                            >
                              {item.status === 'OK' && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                            </button>
                            <span className="text-[11px] font-bold text-slate-400 select-none tracking-tight">OK</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button 
                              onClick={() => handleStatusChange(activeSection.id, category.id, item.id, 'NA')} 
                              className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${item.status === 'NA' ? 'bg-[#f59e0b] border-[#f59e0b]' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                            >
                              {item.status === 'NA' && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                            </button>
                            <span className="text-[11px] font-bold text-slate-400 select-none tracking-tight">N/A</span>
                          </div>
                          
                          <div className="flex-1 flex items-center gap-2 overflow-hidden">
                            <textarea 
                              rows={1}
                              value={item.label} 
                              onChange={(e) => updateItemLabel(category.id, item.id, e.target.value)} 
                              className={`flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm font-medium resize-none leading-tight py-1 transition-all outline-none ${
                                item.status === 'OK' 
                                  ? 'text-slate-400 line-through decoration-slate-400/80' 
                                  : 'text-slate-700'
                              }`}
                              onInput={(e) => {
                                (e.target as any).style.height = 'auto';
                                (e.target as any).style.height = (e.target as any).scrollHeight + 'px';
                              }}
                            />
                            <button onClick={() => deleteItem(category.id, item.id)} className="opacity-0 group-hover/item:opacity-100 p-1 text-slate-200 hover:text-red-400 shrink-0"><X className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Botão flutuante Voltar ao Topo */}
          {showScrollTop && (
            <button 
              onClick={scrollToTop} 
              className="fixed bottom-10 right-10 w-12 h-12 bg-[#4e59e1] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 animate-bounce-subtle"
              title="Voltar ao topo"
            >
              <ArrowUp className="w-6 h-6" />
            </button>
          )}
        </div>
      </main>

      {/* Reset Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsResetModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8">
            <div className="flex items-center gap-4 text-red-500 mb-6"><div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center"><AlertTriangle className="w-6 h-6" /></div><h3 className="text-xl font-bold">Limpar tudo?</h3></div>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">Isso apagará todas as marcações e voltará ao padrão original.</p>
            <div className="flex gap-3"><button onClick={() => setIsResetModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 bg-slate-100 rounded-xl">Cancelar</button><button onClick={confirmResetAll} className="flex-1 py-3 text-sm font-bold text-white bg-red-500 rounded-xl shadow-sm">Sim, Limpar</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
