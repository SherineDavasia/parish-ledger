import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useRecords } from '@/contexts/RecordsContext';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { churchSettings, updateChurchSettings } = useRecords();
  const { toast } = useToast();
  const [formData, setFormData] = React.useState(churchSettings);

  const handleSave = () => {
    updateChurchSettings(formData);
    toast({ title: 'Settings saved', description: 'Church settings have been updated.' });
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div><h1 className="text-3xl font-serif font-bold flex items-center gap-3"><SettingsIcon className="h-8 w-8" /> Settings</h1><p className="text-muted-foreground mt-1">Configure church details for certificates</p></div>
        <Card className="max-w-2xl">
          <CardHeader><CardTitle>Church Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Church Name</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
            <div><Label>Address</Label><Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
            <div><Label>Phone</Label><Input value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
            <div><Label>Email</Label><Input value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
            <Button onClick={handleSave}>Save Settings</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
