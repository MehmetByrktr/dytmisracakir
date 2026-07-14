'use client';

import { useEffect, useRef } from 'react';
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Italic, Link as LinkIcon,
  List, ListOrdered, Redo2, Strikethrough, Underline, Undo2,
} from 'lucide-react';

const buttonClass = 'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink/10 bg-white text-ink-soft transition hover:border-clay/40 hover:bg-cream hover:text-clay-deep';

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== value) editor.innerHTML = value;
  }, [value]);

  function execute(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  function addLink() {
    const url = window.prompt('Bağlantı adresini yazın (https://...)');
    if (url) execute('createLink', url);
  }

  function addTableOfContents() {
    const editor = editorRef.current;
    if (!editor) return;
    const headings = Array.from(editor.querySelectorAll('h2, h3')) as HTMLElement[];
    if (!headings.length) {
      window.alert('Önce yazı içinde H2 veya H3 başlıkları oluşturun.');
      return;
    }
    editor.querySelector('[data-blog-toc="true"]')?.remove();
    const used = new Set<string>();
    const items = headings.map((heading, index) => {
      let id = heading.id || heading.textContent?.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `bolum-${index + 1}`;
      while (used.has(id)) id = `${id}-${index + 1}`;
      used.add(id); heading.id = id;
      return `<li class="${heading.tagName === 'H3' ? 'toc-subitem' : ''}"><a href="#${id}">${heading.textContent || `Bölüm ${index + 1}`}</a></li>`;
    });
    const nav = document.createElement('nav');
    nav.setAttribute('data-blog-toc', 'true');
    nav.className = 'blog-toc';
    nav.innerHTML = `<strong>İçindekiler</strong><ol>${items.join('')}</ol>`;
    editor.prepend(nav);
    onChange(editor.innerHTML);
  }

  return <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
    <div className="flex flex-wrap gap-1.5 border-b border-ink/[0.07] bg-cream-deep/55 p-2.5">
      <button type="button" className={buttonClass} title="Geri al" onMouseDown={(e) => e.preventDefault()} onClick={() => execute('undo')}><Undo2 className="h-4 w-4" /></button>
      <button type="button" className={buttonClass} title="Yinele" onMouseDown={(e) => e.preventDefault()} onClick={() => execute('redo')}><Redo2 className="h-4 w-4" /></button>
      <select aria-label="Metin biçimi" className="h-9 rounded-lg border border-ink/10 bg-white px-2 text-xs text-ink" defaultValue="p" onChange={(e) => execute('formatBlock', e.target.value)}><option value="p">Paragraf</option><option value="h2">Başlık H2</option><option value="h3">Başlık H3</option><option value="blockquote">Alıntı</option></select>
      <select aria-label="Yazı tipi" className="h-9 rounded-lg border border-ink/10 bg-white px-2 text-xs text-ink" defaultValue="Arial" onChange={(e) => execute('fontName', e.target.value)}><option value="Arial">Arial</option><option value="Georgia">Georgia</option><option value="Verdana">Verdana</option><option value="Times New Roman">Times New Roman</option><option value="Courier New">Courier New</option><option value="Trebuchet MS">Trebuchet MS</option></select>
      <select aria-label="Yazı büyüklüğü" className="h-9 rounded-lg border border-ink/10 bg-white px-2 text-xs text-ink" defaultValue="3" onChange={(e) => execute('fontSize', e.target.value)}><option value="2">Küçük</option><option value="3">Normal</option><option value="4">Büyük</option><option value="5">Çok Büyük</option><option value="6">Başlık</option></select>
      <span className="mx-0.5 h-9 w-px bg-ink/10" />
      <button type="button" className={buttonClass} title="Kalın" onMouseDown={(e) => e.preventDefault()} onClick={() => execute('bold')}><Bold className="h-4 w-4" /></button>
      <button type="button" className={buttonClass} title="İtalik" onMouseDown={(e) => e.preventDefault()} onClick={() => execute('italic')}><Italic className="h-4 w-4" /></button>
      <button type="button" className={buttonClass} title="Altı çizili" onMouseDown={(e) => e.preventDefault()} onClick={() => execute('underline')}><Underline className="h-4 w-4" /></button>
      <button type="button" className={buttonClass} title="Üstü çizili" onMouseDown={(e) => e.preventDefault()} onClick={() => execute('strikeThrough')}><Strikethrough className="h-4 w-4" /></button>
      <button type="button" className={buttonClass} title="Bağlantı ekle" onMouseDown={(e) => e.preventDefault()} onClick={addLink}><LinkIcon className="h-4 w-4" /></button>
      <button type="button" className={buttonClass} title="Madde işaretli liste" onMouseDown={(e) => e.preventDefault()} onClick={() => execute('insertUnorderedList')}><List className="h-4 w-4" /></button>
      <button type="button" className={buttonClass} title="Numaralı liste" onMouseDown={(e) => e.preventDefault()} onClick={() => execute('insertOrderedList')}><ListOrdered className="h-4 w-4" /></button>
      <span className="mx-0.5 h-9 w-px bg-ink/10" />
      <button type="button" className={buttonClass} title="Sola hizala" onMouseDown={(e) => e.preventDefault()} onClick={() => execute('justifyLeft')}><AlignLeft className="h-4 w-4" /></button>
      <button type="button" className={buttonClass} title="Ortala" onMouseDown={(e) => e.preventDefault()} onClick={() => execute('justifyCenter')}><AlignCenter className="h-4 w-4" /></button>
      <button type="button" className={buttonClass} title="Sağa hizala" onMouseDown={(e) => e.preventDefault()} onClick={() => execute('justifyRight')}><AlignRight className="h-4 w-4" /></button>
      <button type="button" className={buttonClass} title="İki yana yasla" onMouseDown={(e) => e.preventDefault()} onClick={() => execute('justifyFull')}><AlignJustify className="h-4 w-4" /></button>
      <button type="button" className="ml-auto h-9 rounded-lg border border-clay/25 bg-clay/10 px-3 text-xs font-semibold text-clay-deep transition hover:bg-clay hover:text-cream" onClick={addTableOfContents}>İçindekiler Ekle</button>
    </div>
    <div ref={editorRef} contentEditable suppressContentEditableWarning onInput={(e) => onChange(e.currentTarget.innerHTML)} className="admin-rich-editor min-h-[420px] px-6 py-5 text-base leading-relaxed text-ink outline-none" data-placeholder="Blog yazınızı buraya yazın..." />
  </div>;
}
