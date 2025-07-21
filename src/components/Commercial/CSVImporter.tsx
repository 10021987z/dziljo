import React, { useState, useRef } from 'react';
import { 
  Upload, Download, Check, X, AlertTriangle, FileText, 
  ChevronRight, ChevronLeft, Database, Save, RefreshCw, 
  ArrowRight, Eye, EyeOff, HelpCircle, Table
} from 'lucide-react';

interface CSVImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
  entityType?: 'prospect' | 'contact' | 'opportunity' | 'employee' | 'product';
}

interface MappingField {
  csvHeader: string;
  appField: string;
  required: boolean;
  sample?: string;
}

const CSVImporter: React.FC<CSVImporterProps> = ({ 
  isOpen, 
  onClose, 
  onImport,
  entityType = 'prospect'
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCSVData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fieldMapping, setFieldMapping] = useState<MappingField[]>([]);
  const [hasHeaders, setHasHeaders] = useState(true);
  const [delimiter, setDelimiter] = useState(',');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [importStats, setImportStats] = useState({
    total: 0,
    valid: 0,
    invalid: 0,
    duplicates: 0
  });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [encoding, setEncoding] = useState('UTF-8');
  const [skipEmptyLines, setSkipEmptyLines] = useState(true);
  const [trimValues, setTrimValues] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Define application fields based on entity type
  const getAppFields = () => {
    switch (entityType) {
      case 'prospect':
        return [
          { name: 'company', label: 'Entreprise', required: true },
          { name: 'contactName', label: 'Nom du Contact', required: true },
          { name: 'email', label: 'Email', required: true },
          { name: 'phone', label: 'Téléphone', required: false },
          { name: 'position', label: 'Poste', required: false },
          { name: 'industry', label: 'Secteur', required: false },
          { name: 'source', label: 'Source', required: false },
          { name: 'estimatedValue', label: 'Valeur Estimée', required: false },
          { name: 'notes', label: 'Notes', required: false },
          { name: 'website', label: 'Site Web', required: false },
          { name: 'address', label: 'Adresse', required: false },
          { name: 'city', label: 'Ville', required: false },
          { name: 'country', label: 'Pays', required: false }
        ];
      case 'contact':
        return [
          { name: 'firstName', label: 'Prénom', required: true },
          { name: 'lastName', label: 'Nom', required: true },
          { name: 'email', label: 'Email', required: true },
          { name: 'phone', label: 'Téléphone', required: false },
          { name: 'company', label: 'Entreprise', required: false },
          { name: 'position', label: 'Poste', required: false },
          { name: 'notes', label: 'Notes', required: false }
        ];
      case 'opportunity':
        return [
          { name: 'title', label: 'Titre', required: true },
          { name: 'company', label: 'Entreprise', required: true },
          { name: 'contactName', label: 'Nom du Contact', required: true },
          { name: 'value', label: 'Valeur', required: true },
          { name: 'stage', label: 'Étape', required: false },
          { name: 'probability', label: 'Probabilité', required: false },
          { name: 'expectedCloseDate', label: 'Date de Clôture', required: false },
          { name: 'description', label: 'Description', required: false }
        ];
      default:
        return [
          { name: 'company', label: 'Entreprise', required: true },
          { name: 'contactName', label: 'Nom du Contact', required: true },
          { name: 'email', label: 'Email', required: true },
          { name: 'phone', label: 'Téléphone', required: false }
        ];
    }
  };

  const appFields = getAppFields();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Reset state when a new file is selected
      setCSVData([]);
      setHeaders([]);
      setFieldMapping([]);
      setPreviewData([]);
      setErrors([]);
    }
  };

  const parseCSV = () => {
    if (!file) return;
    
    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        const parsedData: string[][] = [];
        
        lines.forEach(line => {
          if (line.trim() === '' && skipEmptyLines) return;
          
          // Handle quoted values with commas inside
          let inQuote = false;
          let currentValue = '';
          const row: string[] = [];
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
              inQuote = !inQuote;
            } else if (char === delimiter && !inQuote) {
              row.push(trimValues ? currentValue.trim() : currentValue);
              currentValue = '';
            } else {
              currentValue += char;
            }
          }
          
          // Add the last value
          row.push(trimValues ? currentValue.trim() : currentValue);
          
          // Remove quotes from values
          const cleanedRow = row.map(val => {
            if (val.startsWith('"') && val.endsWith('"')) {
              return val.substring(1, val.length - 1);
            }
            return val;
          });
          
          parsedData.push(cleanedRow);
        });
        
        if (parsedData.length === 0) {
          setErrors(['Le fichier CSV est vide ou mal formaté.']);
          setIsProcessing(false);
          return;
        }
        
        setCSVData(parsedData);
        
        // Set headers
        const headerRow = hasHeaders ? parsedData[0] : [];
        if (hasHeaders) {
          setHeaders(headerRow);
        } else {
          // Generate default headers (Column1, Column2, etc.)
          const generatedHeaders = Array.from({ length: parsedData[0].length }, (_, i) => `Colonne${i + 1}`);
          setHeaders(generatedHeaders);
        }
        
        // Generate initial field mapping
        const initialMapping: MappingField[] = appFields.map(field => {
          // Try to find a matching header
          const matchingHeader = hasHeaders ? 
            headerRow.find(header => 
              header.toLowerCase().includes(field.name.toLowerCase()) ||
              field.label.toLowerCase().includes(header.toLowerCase())
            ) : '';
          
          return {
            csvHeader: matchingHeader || '',
            appField: field.name,
            required: field.required,
            sample: hasHeaders && matchingHeader ? 
              parsedData[1]?.[headerRow.indexOf(matchingHeader)] : 
              ''
          };
        });
        
        setFieldMapping(initialMapping);
        
        // Generate preview data
        const dataStartIndex = hasHeaders ? 1 : 0;
        const previewRows = parsedData.slice(dataStartIndex, dataStartIndex + 5);
        
        setPreviewData(previewRows.map(row => {
          const rowData: Record<string, string> = {};
          initialMapping.forEach(mapping => {
            if (mapping.csvHeader) {
              const headerIndex = hasHeaders ? 
                headerRow.indexOf(mapping.csvHeader) : 
                parseInt(mapping.csvHeader.replace('Colonne', '')) - 1;
              
              if (headerIndex >= 0 && headerIndex < row.length) {
                rowData[mapping.appField] = row[headerIndex];
              }
            }
          });
          return rowData;
        }));
        
        // Set import stats
        setImportStats({
          total: parsedData.length - (hasHeaders ? 1 : 0),
          valid: parsedData.length - (hasHeaders ? 1 : 0),
          invalid: 0,
          duplicates: 0
        });
        
        setIsProcessing(false);
        setCurrentStep(2);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        setErrors(['Erreur lors de l\'analyse du fichier CSV. Vérifiez le format du fichier.']);
        setIsProcessing(false);
      }
    };
    
    reader.onerror = () => {
      setErrors(['Erreur lors de la lecture du fichier.']);
      setIsProcessing(false);
    };
    
    reader.readAsText(file, encoding);
  };

  const handleMappingChange = (appField: string, csvHeader: string) => {
    setFieldMapping(prev => 
      prev.map(mapping => 
        mapping.appField === appField 
          ? { 
              ...mapping, 
              csvHeader,
              sample: csvHeader ? 
                csvData[hasHeaders ? 1 : 0]?.[headers.indexOf(csvHeader)] || '' : 
                ''
            } 
          : mapping
      )
    );
    
    // Update preview data
    const dataStartIndex = hasHeaders ? 1 : 0;
    const previewRows = csvData.slice(dataStartIndex, dataStartIndex + 5);
    
    setPreviewData(previewRows.map(row => {
      const rowData: Record<string, string> = {};
      fieldMapping.forEach(mapping => {
        // Keep existing mappings
        if (mapping.appField !== appField && mapping.csvHeader) {
          const headerIndex = headers.indexOf(mapping.csvHeader);
          if (headerIndex >= 0 && headerIndex < row.length) {
            rowData[mapping.appField] = row[headerIndex];
          }
        }
        // Add the new mapping
        if (mapping.appField === appField && csvHeader) {
          const headerIndex = headers.indexOf(csvHeader);
          if (headerIndex >= 0 && headerIndex < row.length) {
            rowData[mapping.appField] = row[headerIndex];
          }
        }
      });
      return rowData;
    }));
  };

  const validateMapping = () => {
    const newErrors: string[] = [];
    
    // Check if required fields are mapped
    const requiredFields = fieldMapping.filter(mapping => mapping.required);
    const unmappedRequired = requiredFields.filter(mapping => !mapping.csvHeader);
    
    if (unmappedRequired.length > 0) {
      newErrors.push(`Champs obligatoires non mappés: ${unmappedRequired.map(f => getAppFieldLabel(f.appField)).join(', ')}`);
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const getAppFieldLabel = (fieldName: string): string => {
    const field = appFields.find(f => f.name === fieldName);
    return field ? field.label : fieldName;
  };

  const processImport = () => {
    if (!validateMapping()) return;
    
    setIsProcessing(true);
    
    try {
      // Process all data rows
      const dataStartIndex = hasHeaders ? 1 : 0;
      const dataRows = csvData.slice(dataStartIndex);
      
      const importedData = dataRows.map(row => {
        const rowData: Record<string, any> = {};
        
        fieldMapping.forEach(mapping => {
          if (mapping.csvHeader) {
            const headerIndex = headers.indexOf(mapping.csvHeader);
            if (headerIndex >= 0 && headerIndex < row.length) {
              rowData[mapping.appField] = row[headerIndex];
            }
          }
        });
        
        return rowData;
      });
      
      // Filter out invalid rows (missing required fields)
      const validData = importedData.filter(row => {
        return fieldMapping
          .filter(mapping => mapping.required)
          .every(mapping => row[mapping.appField] && row[mapping.appField].trim() !== '');
      });
      
      // Update stats
      setImportStats({
        total: importedData.length,
        valid: validData.length,
        invalid: importedData.length - validData.length,
        duplicates: 0 // In a real app, you would check for duplicates
      });
      
      setPreviewData(validData.slice(0, 5));
      setIsProcessing(false);
      setCurrentStep(3);
    } catch (error) {
      console.error('Error processing import:', error);
      setErrors(['Erreur lors du traitement des données. Veuillez vérifier le format du fichier.']);
      setIsProcessing(false);
    }
  };

  const finalizeImport = () => {
    if (importStats.valid === 0) {
      setErrors(['Aucune donnée valide à importer.']);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Process all data rows
      const dataStartIndex = hasHeaders ? 1 : 0;
      const dataRows = csvData.slice(dataStartIndex);
      
      const importedData = dataRows.map(row => {
        const rowData: Record<string, any> = {};
        
        fieldMapping.forEach(mapping => {
          if (mapping.csvHeader) {
            const headerIndex = headers.indexOf(mapping.csvHeader);
            if (headerIndex >= 0 && headerIndex < row.length) {
              rowData[mapping.appField] = row[headerIndex];
            }
          }
        });
        
        return rowData;
      });
      
      // Filter out invalid rows (missing required fields)
      const validData = importedData.filter(row => {
        return fieldMapping
          .filter(mapping => mapping.required)
          .every(mapping => row[mapping.appField] && row[mapping.appField].trim() !== '');
      });
      
      // Call the onImport callback with the valid data
      onImport(validData);
      
      // Reset state
      setIsProcessing(false);
      setCurrentStep(4);
    } catch (error) {
      console.error('Error finalizing import:', error);
      setErrors(['Erreur lors de la finalisation de l\'import.']);
      setIsProcessing(false);
    }
  };

  const resetImport = () => {
    setFile(null);
    setCSVData([]);
    setHeaders([]);
    setFieldMapping([]);
    setPreviewData([]);
    setErrors([]);
    setImportStats({
      total: 0,
      valid: 0,
      invalid: 0,
      duplicates: 0
    });
    setCurrentStep(1);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadSampleCSV = () => {
    // Create sample data
    const sampleHeaders = appFields.map(field => field.label);
    const sampleData = [
      ['TechCorp Solutions', 'Jean Dupont', 'j.dupont@techcorp.com', '+33 1 23 45 67 89', 'Directeur IT', 'Technologie', 'LinkedIn', '25000', 'Intéressé par notre solution CRM', 'www.techcorp.com', '123 Rue de la Tech', 'Paris', 'France'],
      ['Digital Innovations', 'Marie Rousseau', 'm.rousseau@digital-innov.com', '+33 1 98 76 54 32', 'CEO', 'Marketing Digital', 'Site Web', '15000', 'À recontacter en février', 'www.digital-innov.com', '45 Avenue du Digital', 'Lyon', 'France']
    ];
    
    // Create CSV content
    const csvContent = [
      sampleHeaders.join(','),
      ...sampleData.map(row => row.join(','))
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `modele_import_${entityType}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-x"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Importateur CSV</h1>
                <p className="text-white/80">Importez vos {entityType === 'prospect' ? 'prospects' : 
                                             entityType === 'contact' ? 'contacts' : 
                                             entityType === 'opportunity' ? 'opportunités' : 
                                             entityType === 'employee' ? 'employés' : 'données'} depuis un fichier CSV</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-6 relative z-10">
            <div className="flex items-center justify-between">
              {[
                { step: 1, title: 'Sélection du Fichier', icon: FileText },
                { step: 2, title: 'Mappage des Champs', icon: ArrowRight },
                { step: 3, title: 'Vérification', icon: Eye },
                { step: 4, title: 'Importation Terminée', icon: Check }
              ].map((step) => (
                <div key={step.step} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      currentStep === step.step 
                        ? 'bg-white text-blue-600' 
                        : currentStep > step.step 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white/30 text-white'
                    }`}
                  >
                    {currentStep > step.step ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span className="text-sm text-white/80 text-center hidden md:block">{step.title}</span>
                </div>
              ))}
            </div>
            <div className="w-full h-1 bg-white/30 mt-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h4 className="font-medium text-red-900">Erreurs</h4>
              </div>
              <ul className="list-disc list-inside text-sm text-red-700">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Step 1: File Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-900">Conseils pour l'importation</h3>
                    <ul className="list-disc list-inside text-sm text-blue-700 mt-2 space-y-1">
                      <li>Assurez-vous que votre fichier CSV est correctement formaté</li>
                      <li>La première ligne doit contenir les en-têtes de colonnes</li>
                      <li>Les champs obligatoires sont: {appFields.filter(f => f.required).map(f => f.label).join(', ')}</li>
                      <li>Taille maximale du fichier: 10 MB</li>
                    </ul>
                    <button 
                      onClick={downloadSampleCSV}
                      className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Télécharger un modèle CSV
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-file-input"
                />
                <label htmlFor="csv-file-input" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    {file ? file.name : 'Déposez votre fichier CSV ici ou cliquez pour parcourir'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {file 
                      ? `${(file.size / 1024).toFixed(2)} KB • Dernière modification: ${new Date(file.lastModified).toLocaleDateString()}`
                      : 'Formats acceptés: .csv (max 10MB)'}
                  </p>
                </label>
              </div>

              {file && (
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="font-medium text-slate-900 mb-3">Options d'importation</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-slate-700 flex items-center">
                        <input
                          type="checkbox"
                          checked={hasHeaders}
                          onChange={(e) => setHasHeaders(e.target.checked)}
                          className="mr-2 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        La première ligne contient les en-têtes
                      </label>
                      
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-slate-700">Délimiteur:</label>
                        <select
                          value={delimiter}
                          onChange={(e) => setDelimiter(e.target.value)}
                          className="px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value=",">Virgule (,)</option>
                          <option value=";">Point-virgule (;)</option>
                          <option value="\t">Tabulation</option>
                          <option value="|">Pipe (|)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <button
                        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                      >
                        {showAdvancedOptions ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />}
                        Options avancées
                      </button>
                      
                      {showAdvancedOptions && (
                        <div className="mt-3 space-y-3 pl-4 border-l-2 border-blue-200">
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-slate-700">Encodage:</label>
                            <select
                              value={encoding}
                              onChange={(e) => setEncoding(e.target.value)}
                              className="px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="UTF-8">UTF-8</option>
                              <option value="ISO-8859-1">ISO-8859-1 (Latin-1)</option>
                              <option value="windows-1252">Windows-1252</option>
                            </select>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-slate-700 flex items-center">
                              <input
                                type="checkbox"
                                checked={skipEmptyLines}
                                onChange={(e) => setSkipEmptyLines(e.target.checked)}
                                className="mr-2 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                              Ignorer les lignes vides
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-slate-700 flex items-center">
                              <input
                                type="checkbox"
                                checked={trimValues}
                                onChange={(e) => setTrimValues(e.target.checked)}
                                className="mr-2 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                              Supprimer les espaces en début/fin de valeur
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Field Mapping */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-900">Mappage des Champs</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Associez les colonnes de votre fichier CSV aux champs de l'application.
                      Les champs marqués d'un astérisque (*) sont obligatoires.
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Champ Application</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Colonne CSV</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Exemple</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fieldMapping.map((mapping, index) => (
                      <tr key={index} className="border-b border-slate-200">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="font-medium text-slate-900">
                              {getAppFieldLabel(mapping.appField)}
                              {mapping.required && <span className="text-red-500 ml-1">*</span>}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={mapping.csvHeader}
                            onChange={(e) => handleMappingChange(mapping.appField, e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">-- Sélectionner une colonne --</option>
                            {headers.map((header, i) => (
                              <option key={i} value={header}>{header}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-sm">
                          {mapping.sample || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-yellow-900">Attention</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Assurez-vous que tous les champs obligatoires sont correctement mappés avant de continuer.
                      Les lignes avec des champs obligatoires manquants seront ignorées lors de l'importation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Verification */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Eye className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-900">Vérification des Données</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Vérifiez que les données sont correctement mappées avant de finaliser l'importation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-slate-900">{importStats.total}</div>
                  <div className="text-sm text-slate-600">Total</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{importStats.valid}</div>
                  <div className="text-sm text-green-700">Valides</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{importStats.invalid}</div>
                  <div className="text-sm text-red-700">Invalides</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{importStats.duplicates}</div>
                  <div className="text-sm text-yellow-700">Doublons</div>
                </div>
              </div>

              <h3 className="font-medium text-slate-900 mb-3">Aperçu des Données</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      {fieldMapping
                        .filter(mapping => mapping.csvHeader)
                        .map((mapping, index) => (
                          <th key={index} className="text-left py-3 px-4 font-medium text-slate-700">
                            {getAppFieldLabel(mapping.appField)}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-slate-200">
                        {fieldMapping
                          .filter(mapping => mapping.csvHeader)
                          .map((mapping, colIndex) => (
                            <td key={colIndex} className="py-3 px-4 text-slate-700">
                              {row[mapping.appField] || '-'}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {importStats.invalid > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-yellow-900">Attention</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        {importStats.invalid} entrée(s) ne seront pas importées car elles ne contiennent pas tous les champs obligatoires.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Import Complete */}
          {currentStep === 4 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Importation Réussie !</h2>
              <p className="text-slate-600 mb-6">
                {importStats.valid} {entityType === 'prospect' ? 'prospects' : 
                                    entityType === 'contact' ? 'contacts' : 
                                    entityType === 'opportunity' ? 'opportunités' : 
                                    entityType === 'employee' ? 'employés' : 'enregistrements'} ont été importés avec succès.
              </p>
              <div className="flex justify-center space-x-4">
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  {importStats.valid} importés
                </div>
                {importStats.invalid > 0 && (
                  <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg flex items-center">
                    <X className="w-4 h-4 mr-2" />
                    {importStats.invalid} ignorés
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Navigation */}
        <div className="bg-slate-50 border-t border-slate-200 p-4">
          <div className="flex justify-between">
            {currentStep === 1 ? (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Annuler
              </button>
            ) : currentStep === 4 ? (
              <button
                onClick={resetImport}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Nouvel Import
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Précédent
              </button>
            )}

            {currentStep === 1 ? (
              <button
                onClick={parseCSV}
                disabled={!file || isProcessing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ChevronRight className="w-4 h-4 mr-2" />
                )}
                {isProcessing ? 'Analyse en cours...' : 'Suivant'}
              </button>
            ) : currentStep === 2 ? (
              <button
                onClick={processImport}
                disabled={isProcessing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ChevronRight className="w-4 h-4 mr-2" />
                )}
                {isProcessing ? 'Traitement...' : 'Suivant'}
              </button>
            ) : currentStep === 3 ? (
              <button
                onClick={finalizeImport}
                disabled={isProcessing || importStats.valid === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Database className="w-4 h-4 mr-2" />
                )}
                {isProcessing ? 'Importation...' : 'Importer les Données'}
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Terminer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVImporter;