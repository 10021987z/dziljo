import * as admin from 'firebase-admin';

export interface KPIData {
  revenue: {
    current: number;
    previous: number;
    growth: number;
  };
  payroll: {
    totalGross: number;
    totalNet: number;
    averageSalary: number;
    employeeCount: number;
  };
  commercial: {
    pipelineValue: number;
    dealsWon: number;
    conversionRate: number;
    averageDealSize: number;
  };
  hr: {
    headcount: number;
    turnoverRate: number;
    recruitmentCost: number;
    trainingHours: number;
  };
}

export async function calculatePayrollKPIs(entrepriseId: string): Promise<KPIData> {
  const db = admin.firestore();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Calculer les KPIs de paie
  const payrollSnapshot = await db
    .collection('entreprises')
    .doc(entrepriseId)
    .collection('payroll')
    .where('year', '==', currentYear)
    .where('month', '==', currentMonth)
    .get();
    
  let totalGross = 0;
  let totalNet = 0;
  let employeeCount = 0;
  
  payrollSnapshot.forEach(doc => {
    const data = doc.data();
    totalGross += data.grossPay || 0;
    totalNet += data.netPay || 0;
    employeeCount++;
  });
  
  // Calculer les KPIs commerciaux
  const opportunitiesSnapshot = await db
    .collection('entreprises')
    .doc(entrepriseId)
    .collection('opportunities')
    .get();
    
  let pipelineValue = 0;
  let dealsWon = 0;
  let totalDeals = 0;
  
  opportunitiesSnapshot.forEach(doc => {
    const data = doc.data();
    pipelineValue += data.value || 0;
    totalDeals++;
    if (data.status === 'won') {
      dealsWon++;
    }
  });
  
  // Calculer les KPIs RH
  const employeesSnapshot = await db
    .collection('entreprises')
    .doc(entrepriseId)
    .collection('collaborateurs')
    .where('status', '==', 'active')
    .get();
    
  const headcount = employeesSnapshot.size;
  
  // Calculer le chiffre d'affaires
  const transactionsSnapshot = await db
    .collection('entreprises')
    .doc(entrepriseId)
    .collection('transactions')
    .where('type', '==', 'revenue')
    .where('date', '>=', new Date(currentYear, currentMonth, 1))
    .where('date', '<', new Date(currentYear, currentMonth + 1, 1))
    .get();
    
  let currentRevenue = 0;
  transactionsSnapshot.forEach(doc => {
    currentRevenue += doc.data().amount || 0;
  });
  
  // Chiffre d'affaires du mois précédent
  const previousTransactionsSnapshot = await db
    .collection('entreprises')
    .doc(entrepriseId)
    .collection('transactions')
    .where('type', '==', 'revenue')
    .where('date', '>=', new Date(currentYear, currentMonth - 1, 1))
    .where('date', '<', new Date(currentYear, currentMonth, 1))
    .get();
    
  let previousRevenue = 0;
  previousTransactionsSnapshot.forEach(doc => {
    previousRevenue += doc.data().amount || 0;
  });
  
  const revenueGrowth = previousRevenue > 0 
    ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
    : 0;
  
  return {
    revenue: {
      current: currentRevenue,
      previous: previousRevenue,
      growth: revenueGrowth
    },
    payroll: {
      totalGross,
      totalNet,
      averageSalary: employeeCount > 0 ? totalNet / employeeCount : 0,
      employeeCount
    },
    commercial: {
      pipelineValue,
      dealsWon,
      conversionRate: totalDeals > 0 ? (dealsWon / totalDeals) * 100 : 0,
      averageDealSize: totalDeals > 0 ? pipelineValue / totalDeals : 0
    },
    hr: {
      headcount,
      turnoverRate: 5.2, // Simulation
      recruitmentCost: 2500, // Simulation
      trainingHours: 40 // Simulation
    }
  };
}