import React, { useState } from 'react';
import { Property, Currency, Language, NegotiationNote, PropertyFile } from '../types';
import { formatCurrency, formatArea, getExpiryStatus } from '../utils/formatters';
import { statusColors, translations } from '../utils/translations';
import { 
  X, 
  MessageSquare, 
  Phone, 
  Mail, 
  FileText, 
  Download, 
  Plus, 
  Calendar, 
  ShieldCheck, 
  Building, 
  MapPin, 
  Printer, 
  Edit3, 
  Trash2,
  ExternalLink,
  Clock,
  Send,
  FileCheck
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  currency: Currency;
  lang: Language;
  isDiscreet: boolean;
  onEdit: (property: Property) => void;
  onDelete: (propertyId: string) => void;
  onAddNote: (propertyId: string, noteText: string) => void;
  onAddFile: (propertyId: string, file: PropertyFile) => void;
  onOpenTeaser: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  currency,
  lang,
  isDiscreet,
  onEdit,
  onDelete,
  onAddNote,
  onAddFile,
  onOpenTeaser,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'dossier' | 'notes'>('overview');
  const [newNote, setNewNote] = useState('');
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<PropertyFile['type']>('pdf');

  const t = translations[lang];
  const expiry = getExpiryStatus(property.mandateExpiryDate, lang);
  const statusCfg = statusColors[property.status];
  const hasPhoto = property.photos && property.photos.length > 0;
  const hasContact = Boolean(property.brokerContact?.name && property.brokerContact.name.trim() !== '');

  const pricePerM2Land = property.landAreaM2 > 0 ? property.priceMxn / property.landAreaM2 : 0;
  const pricePerM2Built = property.builtAreaM2 && property.builtAreaM2 > 0 
    ? property.priceMxn / property.builtAreaM2 
    : null;

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(property.id, newNote.trim());
    setNewNote('');
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const file: PropertyFile = {
      id: `f-${Date.now()}`,
      name: newFileName.trim().endsWith('.pdf') ? newFileName.trim() : `${newFileName.trim()}.pdf`,
      type: newFileType,
      size: `${(Math.random() * 8 + 0.5).toFixed(1)} MB`,
      date: new Date().toISOString().split('T')[0],
    };
    onAddFile(property.id, file);
    setNewFileName('');
    setIsAddingFile(false);
  };

  const getWhatsAppUrl = () => {
    const phoneClean = property.brokerContact.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hola, me comunico respecto al expediente de ${property.title} registrado en Phoenix Ledger.`
    );
    return `https://wa.me/${phoneClean}?text=${message}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs">
      <div 
        className="bg-[var(--surface)] border border-[var(--border)] rounded-lg w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-2)]">
          <div className="flex items-center gap-3">
            <span
              className="text-xs px-2.5 py-0.5 rounded font-medium border"
              style={{
                backgroundColor: statusCfg.bg,
                color: statusCfg.text,
                borderColor: statusCfg.border,
              }}
            >
              {property.status}
            </span>
            <span className="text-xs text-[var(--ink-dim)]">
              {property.district} · {property.type} · {property.dealType}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Export Teaser / Print Button */}
            <button
              onClick={() => onOpenTeaser(property)}
              className="px-3 py-1.5 rounded text-xs bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--ink-dim)] hover:text-[var(--ink)] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Generate Executive Teaser"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.exportDossier}</span>
            </button>

            {/* Edit Button */}
            <button
              onClick={() => onEdit(property)}
              className="p-1.5 rounded bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--ink-dim)] hover:text-[var(--accent)] transition-colors cursor-pointer"
              title="Edit Property"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => {
                if (window.confirm(lang === 'es' ? '¿Eliminar este registro de propiedad?' : 'Delete this property record?')) {
                  onDelete(property.id);
                  onClose();
                }
              }}
              className="p-1.5 rounded bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--rust)] text-[var(--ink-dim)] hover:text-[var(--rust)] transition-colors cursor-pointer"
              title="Delete Property"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-1.5 rounded bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--ink-faint)] text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-6">
          {/* Main Title & Address */}
          <div>
            <h2 className="font-serif-fraunces text-2xl lg:text-3xl font-medium text-[var(--ink)] tracking-tight">
              {property.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-[var(--ink-dim)] mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
              <span>{property.address}</span>
            </div>
          </div>

          {/* Photo Showcase */}
          {hasPhoto && (
            <div className="w-full h-64 sm:h-80 rounded overflow-hidden border border-[var(--border)] relative bg-[var(--bg)]">
              <img
                src={property.photos[0]}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-[#12151A]/85 backdrop-blur-xs border border-white/10 px-3 py-1 rounded text-xs text-[var(--ink)] font-mono-plex">
                {property.zoning}
              </div>
            </div>
          )}

          {/* Key Financial & Spec Badges Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[var(--surface-2)] p-4 rounded border border-[var(--border-soft)]">
            <div>
              <div className="text-[11px] text-[var(--ink-dim)] uppercase">Asking Price</div>
              <div className="font-serif-fraunces text-xl font-medium text-[var(--ink)] mt-0.5">
                {formatCurrency(property.priceMxn, currency, isDiscreet)}
              </div>
              {property.rentPriceMxn && (
                <div className="text-[11px] text-[var(--ink-faint)]">
                  Rent: {formatCurrency(property.rentPriceMxn, currency, isDiscreet)}/mo
                </div>
              )}
            </div>

            <div>
              <div className="text-[11px] text-[var(--ink-dim)] uppercase">{t.landSize}</div>
              <div className="font-serif-fraunces text-xl font-medium text-[var(--ink)] mt-0.5">
                {formatArea(property.landAreaM2, isDiscreet)}
              </div>
              <div className="text-[11px] text-[var(--ink-faint)]">
                {formatCurrency(pricePerM2Land, currency, isDiscreet)}/m²
              </div>
            </div>

            <div>
              <div className="text-[11px] text-[var(--ink-dim)] uppercase">{t.constructionSize}</div>
              <div className="font-serif-fraunces text-xl font-medium text-[var(--ink)] mt-0.5">
                {property.builtAreaM2 ? formatArea(property.builtAreaM2, isDiscreet) : '—'}
              </div>
              <div className="text-[11px] text-[var(--ink-faint)]">
                {pricePerM2Built ? `${formatCurrency(pricePerM2Built, currency, isDiscreet)}/m² built` : 'Unbuilt plot'}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-[var(--ink-dim)] uppercase">{t.estimatedCapRate}</div>
              <div className="font-serif-fraunces text-xl font-medium text-[var(--sage)] mt-0.5">
                {property.capRateEstimated ? `${property.capRateEstimated}%` : 'N/A'}
              </div>
              <div className="text-[11px] text-[var(--ink-faint)]">
                {property.commissionPct}% Broker Fee
              </div>
            </div>
          </div>

          {/* Mandate Expiry Warning Banner (If applicable) */}
          <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[var(--accent)]" />
              <div>
                <span className="font-medium text-[var(--ink)]">{t.legalMandate}: </span>
                <span className="text-[var(--ink-dim)]">
                  {property.mandateExpiryDate ? `Contract expires on ${property.mandateExpiryDate}` : 'No fixed expiration date'}
                </span>
              </div>
            </div>

            <span
              className={`font-mono-plex px-2.5 py-0.5 rounded font-medium ${
                expiry.isUrgent ? 'bg-[var(--rust)]/20 text-[var(--rust)] border border-[var(--rust)]/40' : 'text-[var(--ink-dim)]'
              }`}
            >
              {expiry.label}
            </span>
          </div>

          {/* Tab Navigation (Overview, Dossiers, Activity Log) */}
          <div className="border-b border-[var(--border)] flex gap-4 text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-b-2 border-[var(--accent)] text-[var(--accent)]'
                  : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'
              }`}
            >
              {lang === 'es' ? 'Descripción y Contacto' : 'Description & Contact'}
            </button>
            <button
              onClick={() => setActiveTab('dossier')}
              className={`pb-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dossier'
                  ? 'border-b-2 border-[var(--accent)] text-[var(--accent)]'
                  : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'
              }`}
            >
              <span>{t.attachedFiles}</span>
              <span className="bg-[var(--surface-2)] px-1.5 py-0.2 rounded text-[10px] text-[var(--ink-faint)]">
                {property.files.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`pb-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'border-b-2 border-[var(--accent)] text-[var(--accent)]'
                  : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'
              }`}
            >
              <span>{t.negotiationLog}</span>
              <span className="bg-[var(--surface-2)] px-1.5 py-0.2 rounded text-[10px] text-[var(--ink-faint)]">
                {property.negotiationNotes.length}
              </span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW & CONTACT */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Description */}
              <div className="md:col-span-2 flex flex-col gap-3">
                <h4 className="font-serif-fraunces text-base font-medium text-[var(--ink)]">
                  {lang === 'es' ? 'Memoria Descriptiva del Inmueble' : 'Property Technical Summary'}
                </h4>
                <p className="text-xs leading-relaxed text-[var(--ink-dim)] whitespace-pre-line">
                  {property.description}
                </p>

                <div className="mt-3 p-3 rounded bg-[var(--surface-2)] border border-[var(--border-soft)] text-xs flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ink-dim)]">{t.zoningCode}:</span>
                    <span className="font-medium text-[var(--ink)]">{property.zoning}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ink-dim)]">Date Added:</span>
                    <span className="text-[var(--ink)]">{property.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Direct Broker / Owner Contact Hub */}
              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded p-4 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-[var(--ink-dim)] uppercase font-semibold">
                      {t.contactBroker}
                    </span>
                    <span className="text-[10px] text-[var(--accent)] font-medium">
                      {property.brokerContact.isOwnerDirect ? 'Direct Owner' : 'Exclusive Agent'}
                    </span>
                  </div>

                  {hasContact ? (
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="font-serif-fraunces text-base font-medium text-[var(--ink)]">
                        {isDiscreet ? '••••••••••••' : property.brokerContact.name}
                      </div>
                      <div className="text-[11.5px] text-[var(--ink-dim)]">
                        {property.brokerContact.agency}
                      </div>
                      <div className="text-[11.5px] text-[var(--ink-faint)] mt-1 font-mono-plex">
                        {isDiscreet ? '••••••••••••' : property.brokerContact.phone}
                      </div>
                      <div className="text-[11.5px] text-[var(--ink-faint)] font-mono-plex truncate">
                        {isDiscreet ? '••••••••••••' : property.brokerContact.email}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-[var(--ink-faint)] italic py-2">
                      {t.noContactOnFile}
                    </div>
                  )}
                </div>

                {/* Direct Action Buttons */}
                {hasContact && !isDiscreet && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border)]">
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold text-xs py-2 px-3 rounded flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-black" />
                      <span>{t.openWhatsApp}</span>
                    </a>

                    <a
                      href={`tel:${property.brokerContact.phone}`}
                      className="w-full bg-[var(--surface)] hover:bg-[var(--border)] text-[var(--ink)] text-xs py-1.5 px-3 rounded flex items-center justify-center gap-2 border border-[var(--border)] transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t.callNow}</span>
                    </a>

                    <a
                      href={`mailto:${property.brokerContact.email}`}
                      className="w-full bg-[var(--surface)] hover:bg-[var(--border)] text-[var(--ink)] text-xs py-1.5 px-3 rounded flex items-center justify-center gap-2 border border-[var(--border)] transition-colors cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{t.emailContact}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CONFIDENTIAL DOSSIERS & FILES */}
          {activeTab === 'dossier' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif-fraunces text-base font-medium text-[var(--ink)]">
                    {lang === 'es' ? 'Expediente Documental y Dictámenes' : 'Documentary Dossier & Deeds'}
                  </h4>
                  <p className="text-xs text-[var(--ink-dim)]">
                    {lang === 'es' ? 'Archivos legales resguardados bajo convenio de confidencialidad.' : 'Legal files guarded under NCND confidentiality.'}
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingFile(!isAddingFile)}
                  className="bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)] text-xs px-3 py-1.5 rounded flex items-center gap-1.5 text-[var(--ink)] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>{t.addFile}</span>
                </button>
              </div>

              {/* Add file inline form */}
              {isAddingFile && (
                <form onSubmit={handleCreateFile} className="bg-[var(--surface-2)] border border-[var(--border)] p-3 rounded flex flex-wrap gap-2 items-center text-xs">
                  <input
                    type="text"
                    required
                    placeholder="Document name (e.g. Certificado_Libertad_Gravamen.pdf)"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="flex-1 bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded text-[var(--ink)] outline-none min-w-[200px]"
                  />
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value as any)}
                    className="bg-[var(--surface)] border border-[var(--border)] px-2 py-1.5 rounded text-[var(--ink)] outline-none"
                  >
                    <option value="pdf">General PDF</option>
                    <option value="contract">Legal Contract</option>
                    <option value="cadastre">Cadastral Deed</option>
                    <option value="blueprint">Architectural Blueprint</option>
                    <option value="appraisal">Appraisal</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-[var(--accent)] text-[#14171C] font-semibold px-3 py-1.5 rounded cursor-pointer"
                  >
                    Save File
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingFile(false)}
                    className="text-[var(--ink-dim)] hover:text-[var(--ink)] px-2 py-1.5 cursor-pointer"
                  >
                    Cancel
                  </button>
                </form>
              )}

              {/* Files Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {property.files.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 rounded bg-[var(--surface-2)] border border-[var(--border-soft)] hover:border-[var(--border)] flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <FileCheck className="w-5 h-5 text-[var(--accent)] shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-[var(--ink)] truncate">{file.name}</div>
                        <div className="text-[10.5px] text-[var(--ink-dim)]">
                          {file.size} · {file.date}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        // Instant simulated file download
                        const element = document.createElement("a");
                        const fileBlob = new Blob([`Phoenix Ledger Dossier: ${file.name}\nAsset: ${property.title}\nDate: ${file.date}`], {type: 'text/plain'});
                        element.href = URL.createObjectURL(fileBlob);
                        element.download = file.name;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      className="p-1.5 rounded bg-[var(--surface)] text-[var(--ink-dim)] hover:text-[var(--ink)] hover:border-[var(--accent)] border border-transparent transition-colors cursor-pointer"
                      title="Download File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: NEGOTIATION & ACTIVITY LOG */}
          {activeTab === 'notes' && (
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="font-serif-fraunces text-base font-medium text-[var(--ink)]">
                  {t.negotiationLog}
                </h4>
                <p className="text-xs text-[var(--ink-dim)]">
                  {lang === 'es' ? 'Bitácora privada de interacciones, ofertas y seguimiento.' : 'Confidential log of buyer showings, LOIs, and owner discussions.'}
                </p>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleCreateNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder={lang === 'es' ? 'Añadir nota de negociación o seguimiento...' : 'Add negotiation update or follow-up note...'}
                  className="flex-1 bg-[var(--surface-2)] border border-[var(--border)] focus:border-[var(--accent)] rounded px-3 py-2 text-xs text-[var(--ink)] outline-none"
                />
                <button
                  type="submit"
                  className="bg-[var(--accent)] hover:opacity-90 text-[#14171C] font-semibold px-4 py-2 rounded text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.addNote}</span>
                </button>
              </form>

              {/* Notes Timeline */}
              <div className="flex flex-col gap-2.5">
                {property.negotiationNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-[var(--surface-2)] border border-[var(--border-soft)] rounded text-xs flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-[var(--ink-faint)]">
                      <span className="font-semibold text-[var(--accent)]">{note.author}</span>
                      <span className="font-mono-plex">{note.date}</span>
                    </div>
                    <div className="text-[var(--ink)] leading-relaxed">
                      {note.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
