import React, { useState } from 'react';
import { Property, PropertyType, DealType, PropertyStatus, Language } from '../types';
import { translations } from '../utils/translations';
import { X, Save, Image as ImageIcon } from 'lucide-react';

interface AddEditPropertyModalProps {
  initialProperty?: Property | null;
  onSave: (property: Property) => void;
  onClose: () => void;
  lang: Language;
}

const PRESET_PHOTOS = [
  { label: 'Sierra Madre Modern Mansion', url: '/src/assets/images/casa_chipinque_mansion_1790647658961.jpg' },
  { label: 'Industrial Warehouse Park', url: '/src/assets/images/industrial_santa_catarina_1790647670536.jpg' },
  { label: 'Mountain Ridge Development Land', url: '/src/assets/images/terreno_montana_land_1790647680964.jpg' },
  { label: 'Valle Oriente Corporate Tower', url: '/src/assets/images/valle_oriente_tower_1790647691186.jpg' },
];

export const AddEditPropertyModal: React.FC<AddEditPropertyModalProps> = ({
  initialProperty,
  onSave,
  onClose,
  lang,
}) => {
  const t = translations[lang];
  const isEditing = Boolean(initialProperty);

  const [formData, setFormData] = useState({
    title: initialProperty?.title || '',
    district: initialProperty?.district || 'San Pedro Garza García',
    address: initialProperty?.address || '',
    type: (initialProperty?.type || 'House') as PropertyType,
    dealType: (initialProperty?.dealType || 'Sell') as DealType,
    priceMxn: initialProperty?.priceMxn || 100000000,
    rentPriceMxn: initialProperty?.rentPriceMxn || 0,
    landAreaM2: initialProperty?.landAreaM2 || 2500,
    builtAreaM2: initialProperty?.builtAreaM2 || 800,
    status: (initialProperty?.status || 'Available') as PropertyStatus,
    mandateExpiryDate: initialProperty?.mandateExpiryDate || '',
    zoning: initialProperty?.zoning || 'H-1 Residencial Unifamiliar',
    description: initialProperty?.description || '',
    brokerName: initialProperty?.brokerContact?.name || '',
    brokerPhone: initialProperty?.brokerContact?.phone || '',
    brokerEmail: initialProperty?.brokerContact?.email || '',
    brokerAgency: initialProperty?.brokerContact?.agency || '',
    isOwnerDirect: initialProperty?.brokerContact?.isOwnerDirect || false,
    selectedPhoto: initialProperty?.photos?.[0] || PRESET_PHOTOS[0].url,
    commissionPct: initialProperty?.commissionPct || 4.5,
    capRateEstimated: initialProperty?.capRateEstimated || 7.5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const property: Property = {
      id: initialProperty ? initialProperty.id : `prop-${Date.now()}`,
      title: formData.title.trim(),
      district: formData.district,
      address: formData.address.trim() || formData.title.trim(),
      type: formData.type,
      dealType: formData.dealType,
      priceMxn: Number(formData.priceMxn) || 0,
      rentPriceMxn: formData.rentPriceMxn ? Number(formData.rentPriceMxn) : undefined,
      landAreaM2: Number(formData.landAreaM2) || 0,
      builtAreaM2: formData.builtAreaM2 ? Number(formData.builtAreaM2) : undefined,
      status: formData.status,
      mandateExpiryDate: formData.mandateExpiryDate || undefined,
      zoning: formData.zoning,
      description: formData.description,
      brokerContact: {
        name: formData.brokerName.trim(),
        phone: formData.brokerPhone.trim(),
        email: formData.brokerEmail.trim(),
        agency: formData.brokerAgency.trim(),
        isOwnerDirect: formData.isOwnerDirect,
      },
      files: initialProperty ? initialProperty.files : [],
      photos: formData.selectedPhoto ? [formData.selectedPhoto] : [],
      negotiationNotes: initialProperty ? initialProperty.negotiationNotes : [
        {
          id: `n-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          author: 'System',
          note: isEditing ? 'Registro actualizado en el sistema.' : 'Propiedad dada de alta en el ledger.',
        }
      ],
      commissionPct: Number(formData.commissionPct) || 4.5,
      capRateEstimated: Number(formData.capRateEstimated) || undefined,
      coordinates: initialProperty?.coordinates || { lat: 25.6866, lng: -100.3161 },
      createdAt: initialProperty?.createdAt || new Date().toISOString().split('T')[0],
    };

    onSave(property);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs">
      <div 
        className="bg-[var(--surface)] border border-[var(--border)] rounded-lg w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-2)]">
          <h3 className="font-serif-fraunces text-lg font-medium text-[var(--ink)]">
            {isEditing ? (lang === 'es' ? 'Editar Expediente de Propiedad' : 'Edit Property Record') : (lang === 'es' ? 'Alta de Nueva Propiedad al Ledger' : 'New Property Record')}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 flex flex-col gap-4 text-xs">
          {/* Title & District */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[var(--ink-dim)] font-medium mb-1">
                Property Title / Parcel Name *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Terreno San Jerónimo Vista Panorámica"
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] focus:border-[var(--accent)] rounded p-2 text-[var(--ink)] outline-none"
              />
            </div>

            <div>
              <label className="block text-[var(--ink-dim)] font-medium mb-1">
                Municipality / District *
              </label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] focus:border-[var(--accent)] rounded p-2 text-[var(--ink)] outline-none"
              >
                <option value="San Pedro Garza García">San Pedro Garza García</option>
                <option value="Santa Catarina">Santa Catarina</option>
                <option value="Carretera Nacional">Carretera Nacional</option>
                <option value="Monterrey Centro">Monterrey Centro</option>
                <option value="Apodaca">Apodaca</option>
                <option value="Cumbres">Cumbres</option>
                <option value="Guadalupe">Guadalupe</option>
              </select>
            </div>
          </div>

          {/* Full Address */}
          <div>
            <label className="block text-[var(--ink-dim)] font-medium mb-1">
              Exact Address or Cadastral Location
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Av. Alfonso Reyes 1200, Col. San Patricio"
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] focus:border-[var(--accent)] rounded p-2 text-[var(--ink)] outline-none"
            />
          </div>

          {/* Type, Deal Type, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[var(--ink-dim)] font-medium mb-1">
                Property Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] focus:border-[var(--accent)] rounded p-2 text-[var(--ink)] outline-none"
              >
                <option value="House">House</option>
                <option value="Land">Land</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Mixed-use">Mixed-use</option>
                <option value="Office">Office</option>
              </select>
            </div>

            <div>
              <label className="block text-[var(--ink-dim)] font-medium mb-1">
                Deal Type *
              </label>
              <select
                value={formData.dealType}
                onChange={(e) => setFormData({ ...formData, dealType: e.target.value as DealType })}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] focus:border-[var(--accent)] rounded p-2 text-[var(--ink)] outline-none"
              >
                <option value="Sell">Sell</option>
                <option value="Rent">Rent</option>
                <option value="Both">Both (Sell & Rent)</option>
              </select>
            </div>

            <div>
              <label className="block text-[var(--ink-dim)] font-medium mb-1">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as PropertyStatus })}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] focus:border-[var(--accent)] rounded p-2 text-[var(--ink)] outline-none"
              >
                <option value="Available">Available</option>
                <option value="In talks">In talks</option>
                <option value="Under NCND">Under NCND</option>
                <option value="Due Diligence">Due Diligence</option>
                <option value="On Hold">On Hold</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Pricing & Footprint */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[var(--ink-dim)] font-medium mb-1">
                Asking Price (MXN) *
              </label>
              <input
                type="number"
                required
                value={formData.priceMxn}
                onChange={(e) => setFormData({ ...formData, priceMxn: Number(e.target.value) })}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] focus:border-[var(--accent)] rounded p-2 text-[var(--ink)] font-mono-plex outline-none"
              />
            </div>

            <div>
              <label className="block text-[var(--ink-dim)] font-medium mb-1">
                Rent Price/mo (MXN)
              </label>
              <input
                type="number"
                value={formData.rentPriceMxn}
                onChange={(e) => setFormData({ ...formData, rentPriceMxn: Number(e.target.value) })}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] focus:border-[var(--accent)] rounded p-2 text-[var(--ink)] font-mono-plex outline-none"
              />
            </div>

            <div>
              <label className="block text-[var(--ink-dim)] font-medium mb-1">
                Land Area (m²) *
              </label>
              <input
                type="number"
                required
                value={formData.landAreaM2}
                onChange={(e) => setFormData({ ...formData, landAreaM2: Number(e.target.value) })}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] focus:border-[var(--accent)] rounded p-2 text-[var(--ink)] font-mono-plex outline-none"
              />
            </div>

            <div>
              <label className="block text-[var(--ink-dim)] font-medium mb-1">
                Built Area (m²)
              </label>
              <input
                type="number"
                value={formData.builtAreaM2}
                onChange={(e) => setFormData({ ...formData, builtAreaM2: Number(e.target.value) })}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] focus:border-[var(--accent)] rounded p-2 text-[var(--ink)] font-mono-plex outline-none"
              />
            </div>
          </div>

          {/* Mandate Expiry & Zoning */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--ink-dim)] font-medium mb-1">
                Mandate Expiry Date (YYYY-MM-DD)
              </label>
              <input
                type="date"
                value={formData.mandateExpiryDate}
                onChange={(e) => setFormData({ ...formData, mandateExpiryDate: e.target.value })}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] focus:border-[var(--accent)] rounded p-2 text-[var(--ink)] font-mono-plex outline-none"
              />
            </div>

            <div>
              <label className="block text-[var(--ink-dim)] font-medium mb-1">
                Zoning Code / Land Use
              </label>
              <input
                type="text"
                value={formData.zoning}
                onChange={(e) => setFormData({ ...formData, zoning: e.target.value })}
                placeholder="e.g. H-2 Unifamiliar / CU-4"
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] focus:border-[var(--accent)] rounded p-2 text-[var(--ink)] outline-none"
              />
            </div>
          </div>

          {/* Photo Selection */}
          <div>
            <label className="block text-[var(--ink-dim)] font-medium mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Select Architectural Portfolio Photo</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_PHOTOS.map((photo) => (
                <div
                  key={photo.url}
                  onClick={() => setFormData({ ...formData, selectedPhoto: photo.url })}
                  className={`border rounded overflow-hidden cursor-pointer transition-all ${
                    formData.selectedPhoto === photo.url
                      ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/50 scale-[1.02]'
                      : 'border-[var(--border)] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={photo.url} alt={photo.label} className="w-full h-20 object-cover" />
                  <div className="p-1 text-[10px] truncate text-[var(--ink)] bg-[var(--surface-2)]">
                    {photo.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Broker Contact Info */}
          <div className="border-t border-[var(--border)] pt-3">
            <h4 className="font-serif-fraunces text-sm font-medium text-[var(--ink)] mb-2">
              Confidential Broker / Owner Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[var(--ink-dim)] font-medium mb-1">Contact Name</label>
                <input
                  type="text"
                  value={formData.brokerName}
                  onChange={(e) => setFormData({ ...formData, brokerName: e.target.value })}
                  placeholder="e.g. Lic. Roberto Garza"
                  className="w-full bg-[var(--surface-2)] border border-[var(--border)] focus:border-[var(--accent)] rounded p-2 text-[var(--ink)] outline-none"
                />
              </div>

              <div>
                <label className="block text-[var(--ink-dim)] font-medium mb-1">Phone / WhatsApp</label>
                <input
                  type="text"
                  value={formData.brokerPhone}
                  onChange={(e) => setFormData({ ...formData, brokerPhone: e.target.value })}
                  placeholder="+52 81 8123 4567"
                  className="w-full bg-[var(--surface-2)] border border-[var(--border)] focus:border-[var(--accent)] rounded p-2 text-[var(--ink)] font-mono-plex outline-none"
                />
              </div>

              <div>
                <label className="block text-[var(--ink-dim)] font-medium mb-1">Agency / Office</label>
                <input
                  type="text"
                  value={formData.brokerAgency}
                  onChange={(e) => setFormData({ ...formData, brokerAgency: e.target.value })}
                  placeholder="e.g. InverCapital Private Office"
                  className="w-full bg-[var(--surface-2)] border border-[var(--border)] focus:border-[var(--accent)] rounded p-2 text-[var(--ink)] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[var(--ink-dim)] font-medium mb-1">Technical Summary / Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of parcel dimensions, topography, services, and commercial viability..."
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] focus:border-[var(--accent)] rounded p-2 text-[var(--ink)] outline-none resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-xs text-[var(--ink-dim)] hover:text-[var(--ink)] cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="bg-[var(--accent)] hover:opacity-90 text-[#14171C] font-semibold px-5 py-2 rounded text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
