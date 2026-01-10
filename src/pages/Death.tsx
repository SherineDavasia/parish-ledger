import React, { useState } from 'react';
import { Cross, Plus, Search, FileText, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useRecords } from '@/contexts/RecordsContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function Death() {
  const { deathRecords, addDeathRecord, deleteDeathRecord } = useRecords();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', fatherName: '', motherName: '', baptismName: '', dateOfBirth: '', dateOfDeath: '' });

  const filteredRecords = deathRecords.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.fatherName || !formData.motherName || !formData.dateOfDeath) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' }); return;
    }
    addDeathRecord({ ...formData, dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined, dateOfDeath: new Date(formData.dateOfDeath) });
    toast({ title: 'Success', description: 'Death record added' });
    setFormData({ name: '', fatherName: '', motherName: '', baptismName: '', dateOfBirth: '', dateOfDeath: '' });
    setIsOpen(false);
  };

  const handlePrint = (record: typeof deathRecords[0]) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<html><head><title>Death Certificate</title>
        <style>body{font-family:Georgia,serif;padding:40px;text-align:center;}.certificate{border:3px double #1e3a5f;padding:40px;max-width:700px;margin:auto;}h1{color:#1e3a5f;}.details{text-align:left;margin:30px 0;line-height:2;}</style></head>
        <body><div class="certificate"><h1>Certificate of Death</h1><h2>St. Mary's Catholic Church</h2>
        <div class="details"><p><strong>Name:</strong> ${record.name}</p><p><strong>Father:</strong> ${record.fatherName}</p><p><strong>Mother:</strong> ${record.motherName}</p>
        <p><strong>Date of Death:</strong> ${format(new Date(record.dateOfDeath), 'MMMM d, yyyy')}</p></div>
        <p>Issued on ${format(new Date(), 'MMMM d, yyyy')}</p></div></body></html>`);
      printWindow.document.close(); printWindow.print();
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div><h1 className="text-3xl font-serif font-bold flex items-center gap-3"><Cross className="h-8 w-8 text-gray-500" /> Death Records</h1><p className="text-muted-foreground mt-1">Manage death certificates</p></div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Add Record</Button></DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>Add Death Record</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Name *</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                <div><Label>Father's Name *</Label><Input value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} /></div>
                <div><Label>Mother's Name *</Label><Input value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} /></div>
                <div><Label>Baptism Name</Label><Input value={formData.baptismName} onChange={e => setFormData({...formData, baptismName: e.target.value})} /></div>
                <div><Label>Date of Birth</Label><Input type="date" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} /></div>
                <div><Label>Date of Death *</Label><Input type="date" value={formData.dateOfDeath} onChange={e => setFormData({...formData, dateOfDeath: e.target.value})} /></div>
                <Button type="submit" className="w-full">Save Record</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
        <Card><CardContent className="p-0">
          <Table><TableHeader><TableRow><TableHead>S.No</TableHead><TableHead>Name</TableHead><TableHead>Father</TableHead><TableHead>Mother</TableHead><TableHead>Date of Death</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>{filteredRecords.map(r => (<TableRow key={r.id}><TableCell>{r.sno}</TableCell><TableCell className="font-medium">{r.name}</TableCell><TableCell>{r.fatherName}</TableCell><TableCell>{r.motherName}</TableCell><TableCell>{format(new Date(r.dateOfDeath), 'MMM d, yyyy')}</TableCell>
              <TableCell><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => handlePrint(r)}><FileText className="h-4 w-4" /></Button><Button size="sm" variant="destructive" onClick={() => { deleteDeathRecord(r.id); toast({ title: 'Deleted' }); }}><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>))}</TableBody></Table>
        </CardContent></Card>
      </div>
    </DashboardLayout>
  );
}
