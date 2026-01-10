import React, { useState } from 'react';
import { Droplets, Plus, Search, FileText, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useRecords } from '@/contexts/RecordsContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function Baptism() {
  const { baptismRecords, addBaptismRecord, deleteBaptismRecord } = useRecords();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '', fatherName: '', motherName: '', baptismName: '',
    dateOfBirth: '', dateOfBaptism: ''
  });

  const filteredRecords = baptismRecords.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.fatherName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.fatherName || !formData.motherName || !formData.dateOfBirth || !formData.dateOfBaptism) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    addBaptismRecord({
      ...formData,
      dateOfBirth: new Date(formData.dateOfBirth),
      dateOfBaptism: new Date(formData.dateOfBaptism),
    });
    toast({ title: 'Success', description: 'Baptism record added successfully' });
    setFormData({ name: '', fatherName: '', motherName: '', baptismName: '', dateOfBirth: '', dateOfBaptism: '' });
    setIsOpen(false);
  };

  const handlePrint = (record: typeof baptismRecords[0]) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html><head><title>Baptism Certificate</title>
        <style>body{font-family:Georgia,serif;padding:40px;text-align:center;}
        .certificate{border:3px double #1e3a5f;padding:40px;max-width:700px;margin:auto;}
        h1{color:#1e3a5f;font-size:28px;}h2{color:#d4a574;margin:20px 0;}
        .details{text-align:left;margin:30px 0;line-height:2;}
        .footer{margin-top:40px;font-style:italic;}</style></head>
        <body><div class="certificate">
        <h1>Certificate of Baptism</h1><h2>St. Mary's Catholic Church</h2>
        <div class="details">
        <p><strong>Name:</strong> ${record.name}</p>
        <p><strong>Father's Name:</strong> ${record.fatherName}</p>
        <p><strong>Mother's Name:</strong> ${record.motherName}</p>
        ${record.baptismName ? `<p><strong>Baptism Name:</strong> ${record.baptismName}</p>` : ''}
        <p><strong>Date of Birth:</strong> ${format(new Date(record.dateOfBirth), 'MMMM d, yyyy')}</p>
        <p><strong>Date of Baptism:</strong> ${format(new Date(record.dateOfBaptism), 'MMMM d, yyyy')}</p>
        </div><div class="footer"><p>Issued on ${format(new Date(), 'MMMM d, yyyy')}</p></div>
        </div></body></html>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
              <Droplets className="h-8 w-8 text-blue-500" /> Baptism Records
            </h1>
            <p className="text-muted-foreground mt-1">Manage baptism certificates</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Add Record</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>Add Baptism Record</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Name *</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                <div><Label>Father's Name *</Label><Input value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} /></div>
                <div><Label>Mother's Name *</Label><Input value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} /></div>
                <div><Label>Baptism Name</Label><Input value={formData.baptismName} onChange={e => setFormData({...formData, baptismName: e.target.value})} /></div>
                <div><Label>Date of Birth *</Label><Input type="date" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} /></div>
                <div><Label>Date of Baptism *</Label><Input type="date" value={formData.dateOfBaptism} onChange={e => setFormData({...formData, dateOfBaptism: e.target.value})} /></div>
                <Button type="submit" className="w-full">Save Record</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search records..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead><TableHead>Name</TableHead><TableHead>Father</TableHead>
                  <TableHead>Mother</TableHead><TableHead>DOB</TableHead><TableHead>Baptism Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map(record => (
                  <TableRow key={record.id}>
                    <TableCell>{record.sno}</TableCell>
                    <TableCell className="font-medium">{record.name}</TableCell>
                    <TableCell>{record.fatherName}</TableCell>
                    <TableCell>{record.motherName}</TableCell>
                    <TableCell>{format(new Date(record.dateOfBirth), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{format(new Date(record.dateOfBaptism), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handlePrint(record)}><FileText className="h-4 w-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => { deleteBaptismRecord(record.id); toast({ title: 'Deleted' }); }}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
