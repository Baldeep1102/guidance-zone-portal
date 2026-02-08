import { useState, useEffect } from 'react';
import { Save, Globe, Image, Info, Link2, Calendar, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApi } from '@/api/admin';
import { useApi } from '@/hooks/useApi';
import type { SiteSettings } from '@/types';

type Tab = 'branding' | 'about' | 'social' | 'satsang' | 'announcement';

export function AdminSettings() {
  const { data: settings, loading, refetch } = useApi<SiteSettings>(() => adminApi.getSettings(), []);
  const [activeTab, setActiveTab] = useState<Tab>('branding');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});

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

  const tabs: { id: Tab; label: string; icon: typeof Globe }[] = [
    { id: 'branding', label: 'Branding', icon: Globe },
    { id: 'about', label: 'About Page', icon: Info },
    { id: 'social', label: 'Social Links', icon: Link2 },
    { id: 'satsang', label: 'Satsang Schedule', icon: Calendar },
    { id: 'announcement', label: 'Announcement', icon: Bell },
  ];

  const social = (formData.socialLinks || {}) as Record<string, string>;
  const satsang = (formData.satsangSchedule || {}) as Record<string, string>;
  const about = (formData.aboutContent || {}) as Record<string, any>;

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
                <label className="text-sm text-[#374151] mb-1 block">Logo URL</label>
                <Input value={formData.logoUrl || ''} onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })} className="rounded-xl border-[#E5E7EB] max-w-md" placeholder="https://..." />
              </div>
              <div>
                <label className="text-sm text-[#374151] mb-1 block">Contact Email</label>
                <Input value={formData.contactEmail || ''} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} className="rounded-xl border-[#E5E7EB] max-w-md" />
              </div>
            </div>
          )}

          {/* About */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <h2 className="font-heading text-lg font-semibold text-[#111827]">About Page Content</h2>
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
