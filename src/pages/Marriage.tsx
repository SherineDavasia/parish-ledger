import React, { useState } from 'react';
import { Heart, Plus, Search, FileText, Trash2 } from 'lucide-react';
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

export default function Marriage() {
  const { marriageRecords, addMarriageRecord, deleteMarriageRecord } = useRecords();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    groomName: '', groomFatherName: '', groomMotherName: '', groomBaptismName: '',
    brideName: '', brideFatherName: '', brideMotherName: '', brideBaptismName: '',
    dateOfMarriage: ''
  });

  const filteredRecords = marriageRecords.filter(r =>
    r.groomName.toLowerCase().includes(search.toLowerCase()) ||
    r.brideName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.groomName || !formData.brideName || !formData.dateOfMarriage) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    addMarriageRecord({ ...formData, dateOfMarriage: new Date(formData.dateOfMarriage) });
    toast({ title: 'Success', description: 'Marriage record added' });
    setFormData({ groomName: '', groomFatherName: '', groomMotherName: '', groomBaptismName: '', brideName: '', brideFatherName: '', brideMotherName: '', brideBaptismName: '', dateOfMarriage: '' });
    setIsOpen(false);
  };

  const handlePrint = (record: typeof marriageRecords[0]) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<html><head><title>Marriage Certificate</title>
        <style>body{font-family:Georgia,serif;padding:40px;text-align:center;}.certificate{border:3px double #1e3a5f;padding:40px;max-width:700px;margin:auto;}h1{color:#1e3a5f;}h2{color:#d4a574;}.details{text-align:left;margin:30px 0;line-height:2;}</style></head>
        <body><div class="certificate"><h1>Certificate of Marriage</h1><h2>St. Mary's Catholic Church</h2>
        <div class="details"><p><strong>Groom:</strong> ${record.groomName}</p><p><strong>Bride:</strong> ${record.brideName}</p>
        <p><strong>Date of Marriage:</strong> ${format(new Date(record.dateOfMarriage), 'MMMM d, yyyy')}</p></div>
        <p>Issued on ${format(new Date(), 'MMMM d, yyyy')}</p></div></body></html>`);
      printWindow.document.close(); printWindow.print();
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold flex items-center gap-3"><Heart className="h-8 w-8 text-pink-500" /> Marriage Records</h1>
            <p className="text-muted-foreground mt-1">Manage marriage certificates</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Add Record</Button></DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Add Marriage Record</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-blue-600">Groom Details</h3>
                    <div><Label>Name *</Label><Input value={formData.groomName} onChange={e => setFormData({...formData, groomName: e.target.value})} /></div>
                    <div><Label>Father's Name *</Label><Input value={formData.groomFatherName} onChange={e => setFormData({...formData, groomFatherName: e.target.value})} /></div>
                    <div><Label>Mother's Name *</Label><Input value={formData.groomMotherName} onChange={e => setFormData({...formData, groomMotherName: e.target.value})} /></div>
                    <div><Label>Baptism Name</Label><Input value={formData.groomBaptismName} onChange={e => setFormData({...formData, groomBaptismName: e.target.value})} /></div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-pink-600">Bride Details</h3>
                    <div><Label>Name *</Label><Input value={formData.brideName} onChange={e => setFormData({...formData, brideName: e.target.value})} /></div>
                    <div><Label>Father's Name *</Label><Input value={formData.brideFatherName} onChange={e => setFormData({...formData, brideFatherName: e.target.value})} /></div>
                    <div><Label>Mother's Name *</Label><Input value={formData.brideMotherName} onChange={e => setFormData({...formData, brideMotherName: e.target.value})} /></div>
                    <div><Label>Baptism Name</Label><Input value={formData.brideBaptismName} onChange={e => setFormData({...formData, brideBaptismName: e.target.value})} /></div>
                  </div>
                </div>
                <div><Label>Date of Marriage *</Label><Input type="date" value={formData.dateOfMarriage} onChange={e => setFormData({...formData, dateOfMarriage: e.target.value})} /></div>
                <Button type="submit" className="w-full">Save Record</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
        <Card><CardContent className="p-0">
          <Table><TableHeader><TableRow><TableHead>S.No</TableHead><TableHead>Groom</TableHead><TableHead>Bride</TableHead><TableHead>Date</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>{filteredRecords.map(r => (<TableRow key={r.id}><TableCell>{r.sno}</TableCell><TableCell className="font-medium">{r.groomName}</TableCell><TableCell>{r.brideName}</TableCell><TableCell>{format(new Date(r.dateOfMarriage), 'MMM d, yyyy')}</TableCell>
              <TableCell><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => handlePrint(r)}><FileText className="h-4 w-4" /></Button><Button size="sm" variant="destructive" onClick={() => { deleteMarriageRecord(r.id); toast({ title: 'Deleted' }); }}><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>))}</TableBody></Table>
        </CardContent></Card>
      </div>
    </DashboardLayout>
  );
}
