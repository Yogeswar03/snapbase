import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMetrics } from "@/hooks/useMetrics";
import Papa from "papaparse";

interface MetricsUploadProps {
  startupId: string;
}

interface CSVMetric {
  revenue: string;
  expenses: string;
  burn_rate: string;
  runway: string;
  period_start: string;
  period_end: string;
}

export function MetricsUpload({ startupId }: MetricsUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<CSVMetric[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { addMetric, refetchMetrics } = useMetrics(startupId);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext !== 'csv' && ext !== 'xls' && ext !== 'xlsx') {
      toast({
        title: "Invalid file",
        description: "Please select a CSV, XLS, or XLSX file",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);

    if (ext === 'csv') {
      Papa.parse(selectedFile, {
        header: true,
        preview: 5,
        complete: (results) => {
          setPreview(results.data as CSVMetric[]);
        },
        error: (error) => {
          toast({
            title: "Parse error",
            description: `Failed to parse CSV: ${error.message}`,
            variant: "destructive",
          });
        }
      });
    } else {
      // Parse XLS/XLSX for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: CSVMetric[] = XLSX.utils.sheet_to_json(worksheet, { header: 0 });
        setPreview(json.slice(0, 5));
      };
      reader.onerror = () => {
        toast({
          title: "Parse error",
          description: `Failed to parse Excel file`,
          variant: "destructive",
        });
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const validateMetric = (metric: CSVMetric): boolean => {
    const required = ['revenue', 'expenses', 'burn_rate', 'runway', 'period_start', 'period_end'];
    return required.every(field => metric[field as keyof CSVMetric] && metric[field as keyof CSVMetric].trim() !== '');
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop()?.toLowerCase();
    let metrics: CSVMetric[] = [];
    if (ext === 'csv') {
      // Parse CSV fully for upload
      await new Promise<void>((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            metrics = results.data as CSVMetric[];
            resolve();
          },
          error: (error) => {
            toast({
              title: "Upload failed",
              description: `Failed to process CSV: ${error.message}`,
              variant: "destructive",
            });
            setUploading(false);
            reject(error);
          }
        });
      });
    } else {
      // Parse XLS/XLSX for upload
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      metrics = XLSX.utils.sheet_to_json(worksheet, { header: 0 });
    }

    let successCount = 0;
    let errorCount = 0;
    for (const metric of metrics) {
      if (!validateMetric(metric)) {
        errorCount++;
        continue;
      }
      try {
        await addMetric({
          startup_id: startupId,
          revenue: parseFloat(metric.revenue),
          expenses: parseFloat(metric.expenses),
          burn_rate: parseFloat(metric.burn_rate),
          runway: parseInt(metric.runway),
          period_start: metric.period_start,
          period_end: metric.period_end,
        });
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }
    toast({
      title: "Upload complete",
      description: `${successCount} metrics uploaded successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
      variant: errorCount > 0 ? "destructive" : "default",
    });
    if (successCount > 0) {
      await refetchMetrics();
      setFile(null);
      setPreview([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
    setUploading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Metrics from CSV
        </CardTitle>
        <CardDescription>
          Upload historical financial data to improve predictions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="csv-upload">CSV or Excel File</Label>
          <Input
            id="csv-upload"
            type="file"
            accept=".csv,.xls,.xlsx"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
        </div>

        {/* CSV Format Guide */}
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            <strong>Required columns:</strong> revenue, expenses, burn_rate, runway, period_start (YYYY-MM-DD), period_end (YYYY-MM-DD)
            <br />You can upload either a CSV or Excel (.xls, .xlsx) file.
          </AlertDescription>
        </Alert>

        {/* Preview */}
        {preview.length > 0 && (
          <div className="space-y-2">
            <Label>Preview (first 5 rows)</Label>
            <div className="border rounded-md overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-2 text-left">Company</th>
                    <th className="p-2 text-left">Revenue</th>
                    <th className="p-2 text-left">Expenses</th>
                    <th className="p-2 text-left">Burn Rate</th>
                    <th className="p-2 text-left">Runway</th>
                    <th className="p-2 text-left">Period Start</th>
                    <th className="p-2 text-left">Period End</th>
                    <th className="p-2 text-left">Valid</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, index) => {
                    const isValid = validateMetric(row);
                    return (
                      <tr key={index} className="border-t">
                        <td className="p-2">{row.revenue}</td>
                        <td className="p-2">{row.expenses}</td>
                        <td className="p-2">{row.burn_rate}</td>
                        <td className="p-2">{row.runway}</td>
                        <td className="p-2">{row.period_start}</td>
                        <td className="p-2">{row.period_end}</td>
                        <td className="p-2">
                          {isValid ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? "Uploading..." : "Upload Metrics"}
        </Button>
      </CardContent>
    </Card>
  );
}