export interface CSVExportOptions {
  filename: string;
  headers: string[];
  data: any[];
  delimiter?: string;
  includeHeaders?: boolean;
}

export class CSVExporter {
  private static escapeCSVField(field: any): string {
    if (field === null || field === undefined) {
      return '';
    }
    
    const stringField = String(field);
    
    // If field contains comma, newline, or double quote, wrap in quotes and escape quotes
    if (stringField.includes(',') || stringField.includes('\n') || stringField.includes('"')) {
      return `"${stringField.replace(/"/g, '""')}"`;
    }
    
    return stringField;
  }

  private static convertToCSV(data: any[], headers: string[], delimiter: string = ','): string {
    const csvHeaders = headers.join(delimiter);
    const csvRows = data.map(row => 
      headers.map(header => this.escapeCSVField(row[header])).join(delimiter)
    );
    
    return [csvHeaders, ...csvRows].join('\n');
  }

  private static downloadCSV(content: string, filename: string): void {
    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  static exportEmployees(employees: any[]): void {
    const headers = [
      'firstName',
      'lastName', 
      'email',
      'phone',
      'position',
      'department',
      'manager',
      'startDate',
      'employeeId',
      'status'
    ];

    const csvData = employees.map(emp => ({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      position: emp.position,
      department: emp.department,
      manager: emp.manager,
      startDate: emp.startDate,
      employeeId: emp.employeeId,
      status: emp.status === 'active' ? 'Actif' : 'Inactif'
    }));

    const csvContent = this.convertToCSV(csvData, headers);
    this.downloadCSV(csvContent, `employes_${new Date().toISOString().split('T')[0]}.csv`);
  }

  static exportPayroll(payrollEntries: any[]): void {
    const headers = [
      'employeeName',
      'department',
      'position',
      'payPeriod',
      'baseSalary',
      'overtime',
      'bonuses',
      'deductions',
      'grossPay',
      'taxes',
      'socialCharges',
      'netPay',
      'workingDays',
      'absenceDays',
      'overtimeHours',
      'status'
    ];

    const csvData = payrollEntries.map(entry => ({
      employeeName: entry.employeeName,
      department: entry.department,
      position: entry.position,
      payPeriod: entry.payPeriod,
      baseSalary: entry.baseSalary.toFixed(2),
      overtime: entry.overtime.toFixed(2),
      bonuses: entry.bonuses.toFixed(2),
      deductions: entry.deductions.toFixed(2),
      grossPay: entry.grossPay.toFixed(2),
      taxes: entry.taxes.toFixed(2),
      socialCharges: entry.socialCharges.toFixed(2),
      netPay: entry.netPay.toFixed(2),
      workingDays: entry.workingDays,
      absenceDays: entry.absenceDays,
      overtimeHours: entry.overtimeHours,
      status: entry.status
    }));

    const csvContent = this.convertToCSV(csvData, headers);
    this.downloadCSV(csvContent, `paie_${new Date().toISOString().split('T')[0]}.csv`);
  }

  static exportContracts(contracts: any[]): void {
    const headers = [
      'title',
      'clientName',
      'clientEmail',
      'contractType',
      'value',
      'status',
      'createdDate',
      'startDate',
      'endDate',
      'assignedTo'
    ];

    const csvData = contracts.map(contract => ({
      title: contract.title,
      clientName: contract.clientName,
      clientEmail: contract.clientEmail,
      contractType: contract.contractType,
      value: contract.value.toFixed(2),
      status: contract.status,
      createdDate: contract.createdDate,
      startDate: contract.startDate,
      endDate: contract.endDate,
      assignedTo: contract.assignedTo
    }));

    const csvContent = this.convertToCSV(csvData, headers);
    this.downloadCSV(csvContent, `contrats_${new Date().toISOString().split('T')[0]}.csv`);
  }

  static exportProspects(prospects: any[]): void {
    const headers = [
      'company',
      'contactName',
      'email',
      'phone',
      'position',
      'industry',
      'source',
      'status',
      'temperature',
      'estimatedValue',
      'probability',
      'assignedTo',
      'createdDate',
      'lastContact'
    ];

    const csvData = prospects.map(prospect => ({
      company: prospect.company,
      contactName: prospect.contactName,
      email: prospect.email,
      phone: prospect.phone,
      position: prospect.position,
      industry: prospect.industry,
      source: prospect.source,
      status: prospect.status,
      temperature: prospect.temperature,
      estimatedValue: prospect.estimatedValue.toFixed(2),
      probability: prospect.probability,
      assignedTo: prospect.assignedTo,
      createdDate: prospect.createdDate,
      lastContact: prospect.lastContact
    }));

    const csvContent = this.convertToCSV(csvData, headers);
    this.downloadCSV(csvContent, `prospects_${new Date().toISOString().split('T')[0]}.csv`);
  }

  static exportOpportunities(opportunities: any[]): void {
    const headers = [
      'title',
      'company',
      'contactName',
      'email',
      'stage',
      'value',
      'probability',
      'expectedCloseDate',
      'source',
      'assignedTo',
      'createdDate',
      'lastActivity'
    ];

    const csvData = opportunities.map(opp => ({
      title: opp.title,
      company: opp.company,
      contactName: opp.contactName,
      email: opp.email,
      stage: opp.stage,
      value: opp.value.toFixed(2),
      probability: opp.probability,
      expectedCloseDate: opp.expectedCloseDate,
      source: opp.source,
      assignedTo: opp.assignedTo,
      createdDate: opp.createdDate,
      lastActivity: opp.lastActivity
    }));

    const csvContent = this.convertToCSV(csvData, headers);
    this.downloadCSV(csvContent, `opportunites_${new Date().toISOString().split('T')[0]}.csv`);
  }

  static exportLeaveRequests(leaveRequests: any[]): void {
    const headers = [
      'employeeName',
      'department',
      'type',
      'startDate',
      'endDate',
      'days',
      'status',
      'reason',
      'submittedDate',
      'approvedBy',
      'approvedDate'
    ];

    const csvData = leaveRequests.map(request => ({
      employeeName: request.employeeName,
      department: request.department,
      type: request.type,
      startDate: request.startDate,
      endDate: request.endDate,
      days: request.days,
      status: request.status,
      reason: request.reason,
      submittedDate: request.submittedDate,
      approvedBy: request.approvedBy || '',
      approvedDate: request.approvedDate || ''
    }));

    const csvContent = this.convertToCSV(csvData, headers);
    this.downloadCSV(csvContent, `conges_${new Date().toISOString().split('T')[0]}.csv`);
  }

  static exportTrainings(trainings: any[]): void {
    const headers = [
      'title',
      'provider',
      'category',
      'duration',
      'startDate',
      'endDate',
      'status',
      'maxParticipants',
      'currentParticipants',
      'cost',
      'location',
      'instructor'
    ];

    const csvData = trainings.map(training => ({
      title: training.title,
      provider: training.provider,
      category: training.category,
      duration: training.duration,
      startDate: training.startDate,
      endDate: training.endDate,
      status: training.status,
      maxParticipants: training.maxParticipants,
      currentParticipants: training.currentParticipants,
      cost: training.cost.toFixed(2),
      location: training.location,
      instructor: training.instructor
    }));

    const csvContent = this.convertToCSV(csvData, headers);
    this.downloadCSV(csvContent, `formations_${new Date().toISOString().split('T')[0]}.csv`);
  }

  static exportCustom(options: CSVExportOptions): void {
    const csvContent = this.convertToCSV(options.data, options.headers, options.delimiter);
    this.downloadCSV(csvContent, options.filename);
  }
}