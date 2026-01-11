import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Plus, Search, FileText, Trash2, ArrowLeft } from 'lucide-react';
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
  const navigate = useNavigate();
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
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lora:wght@400;500&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Lora', Georgia, serif; padding: 20px; background: #f5f5f5; }
          .certificate { 
            max-width: 800px; margin: auto; background: #fff; padding: 60px; position: relative;
            border: 2px solid #1e3a5f; box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }
          .certificate::before {
            content: ''; position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px;
            border: 1px solid #d4a574; pointer-events: none;
          }
          .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #d4a574; }
          .title { font-family: 'Playfair Display', serif; font-size: 32px; color: #1e3a5f; font-weight: 700; letter-spacing: 2px; margin-bottom: 10px; }
          .subtitle { font-size: 14px; color: #666; letter-spacing: 4px; text-transform: uppercase; }
          .content { padding: 30px 0; }
          .field { display: flex; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px dotted #ccc; }
          .field-label { width: 180px; font-weight: 500; color: #1e3a5f; }
          .field-value { flex: 1; color: #333; }
          .issued { text-align: center; margin-top: 30px; font-style: italic; color: #666; font-size: 14px; }
          .footer { display: flex; justify-content: space-between; margin-top: 60px; padding-top: 40px; }
          .signature-block { text-align: center; width: 200px; }
          .signature-line { border-top: 1px solid #333; margin-bottom: 8px; height: 60px; }
          .signature-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
          .seal-block { text-align: center; width: 150px; }
          .seal-placeholder { height: 80px; margin-bottom: 8px; }
        </style></head>
        <body>
          <div class="certificate">
            <div class="header">
              <div class="title">Certificate of Baptism</div>
              <div class="subtitle">Official Church Record</div>
            </div>
            <div class="content">
              <div class="field"><span class="field-label">Full Name</span><span class="field-value">${record.name}</span></div>
              <div class="field"><span class="field-label">Father's Name</span><span class="field-value">${record.fatherName}</span></div>
              <div class="field"><span class="field-label">Mother's Name</span><span class="field-value">${record.motherName}</span></div>
              ${record.baptismName ? `<div class="field"><span class="field-label">Baptism Name</span><span class="field-value">${record.baptismName}</span></div>` : ''}
              <div class="field"><span class="field-label">Date of Birth</span><span class="field-value">${format(new Date(record.dateOfBirth), 'MMMM d, yyyy')}</span></div>
              <div class="field"><span class="field-label">Date of Baptism</span><span class="field-value">${format(new Date(record.dateOfBaptism), 'MMMM d, yyyy')}</span></div>
            </div>
            <p class="issued">Issued on ${format(new Date(), 'MMMM d, yyyy')}</p>
            <div class="footer">
              <div class="seal-block">
                <div class="seal-placeholder"></div>
                <div class="signature-label">Parish Seal</div>
              </div>
              <div class="signature-block">
                <div class="signature-line"></div>
                <div class="signature-label">Parish Priest Signature</div>
              </div>
            </div>
          </div>
        </body></html>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
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
