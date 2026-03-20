import { useState, useEffect, useRef } from 'react';
import { Save, Globe, Info, Link2, Calendar, Bell, Palette, Image, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApi } from '@/api/admin';
import { useApi } from '@/hooks/useApi';
import type { SiteSettings, ColorScheme, HeroContent, CtaContent, FooterContent } from '@/types';

type Tab = 'branding' | 'hero' | 'theme' | 'about' | 'social' | 'satsang' | 'announcement';

export function AdminSettings() {
  const { data: settings, loading, refetch } = useApi<SiteSettings>(() => adminApi.getSettings(), []);
  const [activeTab, setActiveTab] = useState<Tab>('branding');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});
  const [uploading, setUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettings(formData);
      refetch();
    } catch (err) {
      console.error('Save settings failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminApi.uploadFile(file);
      setFormData({ ...formData, logoUrl: res.data.url });
    } catch (err) {
      console.error('Logo upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminApi.uploadFile(file);
      const current = (formData.aboutContent || {}) as Record<string, any>;
      setFormData({ ...formData, aboutContent: { ...current, image: res.data.url } });
    } catch (err) {
      console.error('About image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminApi.uploadFile(file);
      const current = (formData.heroImages || []) as string[];
      setFormData({ ...formData, heroImages: [...current, res.data.url] });
    } catch (err) {
      console.error('Hero image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeHeroImage = (url: string) => {
    const current = (formData.heroImages || []) as string[];
    setFormData({ ...formData, heroImages: current.filter((u) => u !== url) });
  };

  const tabs: { id: Tab; label: string; icon: typeof Globe }[] = [
    { id: 'branding', label: 'Branding', icon: Globe },
    { id: 'hero', label: 'Hero / Banner', icon: Image },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'about', label: 'About Page', icon: Info },
    { id: 'social', label: 'Social Links', icon: Link2 },
    { id: 'satsang', label: 'Satsang Schedule', icon: Calendar },
    { id: 'announcement', label: 'Announcement', icon: Bell },
  ];

  const social = (formData.socialLinks || {}) as Record<string, string>;
  const satsang = (formData.satsangSchedule || {}) as Record<string, string>;
  const about = (formData.aboutContent || {}) as Record<string, any>;
  const hero = (formData.heroContent || {}) as HeroContent;
  const cta = (formData.ctaContent || {}) as CtaContent;
  const footer = (formData.footerContent || {}) as FooterContent;
  const colorScheme = (formData.colorScheme || {
    accent: '#7B6CFF',
    bgLight: '#F6F7F9',
    bgDark: '#101422',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
  }) as ColorScheme;
  const heroImages = (formData.heroImages || []) as string[];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center pt-24">
        <div className="w-8 h-8 border-2 border-[#7B6CFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] pt-24 lg:pt-32 pb-20">
      <div className="px-6 lg:px-[6vw]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7B6CFF] mb-2 block">Admin Panel</span>
            <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-[#111827]">Site Settings</h1>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full">
            <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#7B6CFF] text-white'
                  : 'bg-white text-[#6B7280] hover:bg-[#F3F4F6] border border-[#E5E7EB]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[22px] card-shadow-light p-6 lg:p-8">
          {/* Branding */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <h2 className="font-heading text-lg font-semibold text-[#111827]">Branding & Identity</h2>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Site Name</label>
                <Input value={formData.siteName || ''} onChange={(e) => setFormData({ ...formData, siteName: e.target.value })} className="rounded-xl border-[#E5E7EB] max-w-md" />
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-2 block">Logo</label>
                {formData.logoUrl && (
                  <div className="flex items-center gap-3 mb-3">
                    <img src={formData.logoUrl} alt="Logo" className="h-12 w-auto rounded-lg border border-[#E5E7EB] object-contain bg-gray-50 px-2" />
                    <button
                      onClick={() => setFormData({ ...formData, logoUrl: null })}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Remove
                    </button>
                  </div>
                )}
                <div className="flex gap-3 items-center">
                  <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploading}
                    className="rounded-xl border-[#E5E7EB] text-sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Logo'}
                  </Button>
                  <span className="text-xs text-[#9CA3AF]">or paste URL:</span>
                  <Input
                    value={formData.logoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    className="rounded-xl border-[#E5E7EB] flex-1 max-w-xs"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Contact Email</label>
                <Input value={formData.contactEmail || ''} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} className="rounded-xl border-[#E5E7EB] max-w-md" />
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Footer Tagline</label>
                <Input
                  value={footer.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, footerContent: { ...footer, tagline: e.target.value } })}
                  className="rounded-xl border-[#E5E7EB] max-w-md"
                  placeholder="A space for seekers."
                />
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Footer Copyright</label>
                <Input
                  value={footer.copyright || ''}
                  onChange={(e) => setFormData({ ...formData, footerContent: { ...footer, copyright: e.target.value } })}
                  className="rounded-xl border-[#E5E7EB] max-w-md"
                  placeholder="© 2026 Guidance Zone. All rights reserved."
                />
              </div>
            </div>
          )}

          {/* Hero / Banner */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h2 className="font-heading text-lg font-semibold text-[#111827]">Hero & CTA Content</h2>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-[#374151]">Hero Section</h3>
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Headline</label>
                  <Input
                    value={hero.headline || ''}
                    onChange={(e) => setFormData({ ...formData, heroContent: { ...hero, headline: e.target.value } })}
                    className="rounded-xl border-[#E5E7EB] max-w-md"
                    placeholder="A space for seekers."
                  />
                </div>
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Subheadline</label>
                  <textarea
                    value={hero.subheadline || ''}
                    onChange={(e) => setFormData({ ...formData, heroContent: { ...hero, subheadline: e.target.value } })}
                    className="w-full max-w-md px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm resize-none"
                    rows={3}
                    placeholder="Guided courses, live satsang..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div>
                    <label className="text-sm text-[#374151] mb-1 block">Primary CTA Label</label>
                    <Input
                      value={hero.ctaPrimary || ''}
                      onChange={(e) => setFormData({ ...formData, heroContent: { ...hero, ctaPrimary: e.target.value } })}
                      className="rounded-xl border-[#E5E7EB]"
                      placeholder="Explore Courses"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#374151] mb-1 block">Secondary CTA Label</label>
                    <Input
                      value={hero.ctaSecondary || ''}
                      onChange={(e) => setFormData({ ...formData, heroContent: { ...hero, ctaSecondary: e.target.value } })}
                      className="rounded-xl border-[#E5E7EB]"
                      placeholder="Join Satsang"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-[#F3F4F6] pt-6 space-y-4">
                <h3 className="text-sm font-medium text-[#374151]">CTA Section</h3>
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Headline</label>
                  <Input
                    value={cta.headline || ''}
                    onChange={(e) => setFormData({ ...formData, ctaContent: { ...cta, headline: e.target.value } })}
                    className="rounded-xl border-[#E5E7EB] max-w-md"
                    placeholder="Be part of the orbit."
                  />
                </div>
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Subheadline</label>
                  <Input
                    value={cta.subheadline || ''}
                    onChange={(e) => setFormData({ ...formData, ctaContent: { ...cta, subheadline: e.target.value } })}
                    className="rounded-xl border-[#E5E7EB] max-w-md"
                    placeholder="Get weekly notes, new course alerts..."
                  />
                </div>
              </div>

              <div className="border-t border-[#F3F4F6] pt-6 space-y-4">
                <h3 className="text-sm font-medium text-[#374151]">Banner Images</h3>
                <p className="text-xs text-[#9CA3AF]">Images shown in the hero section. Upload up to 5.</p>
                <div className="flex flex-wrap gap-3">
                  {heroImages.map((url) => (
                    <div key={url} className="relative w-28 h-20 rounded-xl overflow-hidden border border-[#E5E7EB]">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeHeroImage(url)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                  {heroImages.length < 5 && (
                    <>
                      <input ref={heroImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} />
                      <button
                        onClick={() => heroImageInputRef.current?.click()}
                        disabled={uploading}
                        className="w-28 h-20 rounded-xl border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center gap-1 text-[#9CA3AF] hover:border-[#7B6CFF] hover:text-[#7B6CFF] transition-colors text-xs"
                      >
                        <Upload className="w-4 h-4" />
                        {uploading ? '...' : 'Add image'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Theme */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <h2 className="font-heading text-lg font-semibold text-[#111827]">Color Theme</h2>
              <p className="text-sm text-[#6B7280]">These colors are applied as CSS variables across the site. Reload the page after saving to see changes.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-xl">
                {(
                  [
                    { key: 'accent' as const, label: 'Accent Color' },
                    { key: 'bgLight' as const, label: 'Light Background' },
                    { key: 'bgDark' as const, label: 'Dark Background' },
                    { key: 'textPrimary' as const, label: 'Primary Text' },
                    { key: 'textSecondary' as const, label: 'Secondary Text' },
                  ] as { key: keyof ColorScheme; label: string }[]
                ).map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-sm text-[#374151] mb-2 block">{label}</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={colorScheme[key] || '#000000'}
                        onChange={(e) => setFormData({
                          ...formData,
                          colorScheme: { ...colorScheme, [key]: e.target.value },
                        })}
                        className="w-10 h-10 rounded-lg border border-[#E5E7EB] cursor-pointer p-0.5"
                      />
                      <Input
                        value={colorScheme[key] || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          colorScheme: { ...colorScheme, [key]: e.target.value },
                        })}
                        className="rounded-xl border-[#E5E7EB] text-sm font-mono"
                        placeholder="#7B6CFF"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <h2 className="font-heading text-lg font-semibold text-[#111827]">About Page Content</h2>
              <div>
                <label className="text-sm text-[#374151] mb-2 block">About Photo</label>
                {about.image && (
                  <div className="mb-3">
                    <img src={about.image} alt="About" className="h-24 w-auto rounded-xl border border-[#E5E7EB] object-cover" />
                  </div>
                )}
                <div className="flex gap-3 items-center flex-wrap">
                  <input ref={aboutImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleAboutImageUpload} />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => aboutImageInputRef.current?.click()}
                    disabled={uploading}
                    className="rounded-xl border-[#E5E7EB] text-sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                  </Button>
                  <span className="text-xs text-[#9CA3AF]">or paste URL:</span>
                  <Input
                    value={about.image || ''}
                    onChange={(e) => setFormData({ ...formData, aboutContent: { ...about, image: e.target.value } })}
                    className="rounded-xl border-[#E5E7EB] flex-1 max-w-xs"
                    placeholder="https://... or /uploads/photo.jpg"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Biography</label>
                <textarea
                  value={about.biography || ''}
                  onChange={(e) => setFormData({ ...formData, aboutContent: { ...about, biography: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm resize-none"
                  rows={5}
                />
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Philosophy Quote</label>
                <textarea
                  value={about.philosophy || ''}
                  onChange={(e) => setFormData({ ...formData, aboutContent: { ...about, philosophy: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm resize-none"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {['yearsTeaching', 'studentsGuided', 'coursesOffered', 'countriesReached'].map((key) => (
                  <div key={key}>
                    <label className="text-sm text-[#374151] mb-1 block capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <Input
                      type="number"
                      value={about.stats?.[key] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutContent: { ...about, stats: { ...about.stats, [key]: parseInt(e.target.value) || 0 } },
                      })}
                      className="rounded-xl border-[#E5E7EB]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h2 className="font-heading text-lg font-semibold text-[#111827]">Social Media Links</h2>
              {['youtube', 'instagram', 'spotify', 'email'].map((platform) => (
                <div key={platform}>
                  <label className="text-sm text-[#374151] mb-1 block capitalize">{platform}</label>
                  <Input
                    value={social[platform] || ''}
                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...social, [platform]: e.target.value } })}
                    className="rounded-xl border-[#E5E7EB] max-w-md"
                    placeholder={`${platform} URL`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Satsang Schedule */}
          {activeTab === 'satsang' && (
            <div className="space-y-6">
              <h2 className="font-heading text-lg font-semibold text-[#111827]">Live Satsang Schedule</h2>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Day</label>
                  <Input value={satsang.day || ''} onChange={(e) => setFormData({ ...formData, satsangSchedule: { ...satsang, day: e.target.value } })} className="rounded-xl border-[#E5E7EB]" placeholder="Sunday" />
                </div>
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Time</label>
                  <Input value={satsang.time || ''} onChange={(e) => setFormData({ ...formData, satsangSchedule: { ...satsang, time: e.target.value } })} className="rounded-xl border-[#E5E7EB]" placeholder="8:00 PM" />
                </div>
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Timezone</label>
                  <Input value={satsang.timezone || ''} onChange={(e) => setFormData({ ...formData, satsangSchedule: { ...satsang, timezone: e.target.value } })} className="rounded-xl border-[#E5E7EB]" placeholder="IST" />
                </div>
                <div>
                  <label className="text-sm text-[#374151] mb-1 block">Zoom Link</label>
                  <Input value={satsang.link || ''} onChange={(e) => setFormData({ ...formData, satsangSchedule: { ...satsang, link: e.target.value } })} className="rounded-xl border-[#E5E7EB]" placeholder="https://zoom.us/..." />
                </div>
              </div>
            </div>
          )}

          {/* Announcement */}
          {activeTab === 'announcement' && (
            <div className="space-y-6">
              <h2 className="font-heading text-lg font-semibold text-[#111827]">Announcement Banner</h2>
              <p className="text-sm text-[#6B7280]">This banner appears at the top of the site. Leave empty to hide.</p>
              <textarea
                value={formData.announcementBanner || ''}
                onChange={(e) => setFormData({ ...formData, announcementBanner: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm resize-none max-w-lg"
                rows={3}
                placeholder="e.g., New course starting March 1st! Register now."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
