import { AIAnalysis, IssueCategory } from '../types';

// Department mapping based on issue category
const departmentMapping: Record<IssueCategory, string> = {
  roads: 'Public Works Department',
  water: 'Water Supply Department',
  electricity: 'Electricity Department',
  garbage: 'Waste Management Department',
  sewage: 'Sewage & Drainage Department',
  pollution: 'Environmental Department',
  safety: 'Police & Safety Department',
  traffic: 'Traffic Police Department',
  other: 'Municipal Administration'
};

// Analysis templates based on category
const categoryAnalysisTemplates: Record<IssueCategory, {
  detectedIssues: string[];
  riskFactors: string[];
  estimatedDays: number;
}> = {
  roads: {
    detectedIssues: ['Road deterioration', 'Safety hazard', 'Pothole damage', 'Pavement damage'],
    riskFactors: ['Traffic congestion', 'Vehicle damage risk', 'Accident hazard'],
    estimatedDays: 7
  },
  water: {
    detectedIssues: ['Water quality issue', 'Supply disruption', 'Water logging', 'Drainage blockage'],
    riskFactors: ['Health hazard', 'Property damage', 'Disease spread risk'],
    estimatedDays: 5
  },
  electricity: {
    detectedIssues: ['Power outage', 'Damaged infrastructure', 'Safety hazard'],
    riskFactors: ['Safety risk', 'Fire hazard', 'Equipment damage'],
    estimatedDays: 3
  },
  garbage: {
    detectedIssues: ['Waste accumulation', 'Sanitation issue', 'Health hazard'],
    riskFactors: ['Disease spread', 'Environmental pollution', 'Pest infestation'],
    estimatedDays: 4
  },
  sewage: {
    detectedIssues: ['Sewage blockage', 'Overflow', 'Drainage issue', 'Pipe damage'],
    riskFactors: ['Health hazard', 'Environmental pollution', 'Disease outbreak risk'],
    estimatedDays: 6
  },
  pollution: {
    detectedIssues: ['Air pollution', 'Water pollution', 'Noise pollution'],
    riskFactors: ['Public health risk', 'Environmental damage', 'Long-term health effects'],
    estimatedDays: 14
  },
  safety: {
    detectedIssues: ['Security concern', 'Public safety issue', 'Crime risk'],
    riskFactors: ['Public harm risk', 'Criminal activity', 'Community threat'],
    estimatedDays: 2
  },
  traffic: {
    detectedIssues: ['Traffic congestion', 'Signal malfunction', 'Road obstruction'],
    riskFactors: ['Accident risk', 'Commute delay', 'Emergency vehicle delay'],
    estimatedDays: 3
  },
  other: {
    detectedIssues: ['General issue', 'Civic infrastructure problem'],
    riskFactors: ['Potential public concern'],
    estimatedDays: 10
  }
};

// Severity determination based on description keywords
const severityKeywords = {
  critical: [
    'emergency',
    'danger',
    'critical',
    'severe',
    'collapse',
    'gas leak',
    'fire',
    'injury',
    'death',
    'accident'
  ],
  high: [
    'urgent',
    'serious',
    'major',
    'blocked',
    'damaged',
    'hazard',
    'unsafe',
    'broken',
    'flooding'
  ],
  medium: [
    'needs repair',
    'maintenance',
    'issue',
    'problem',
    'concern',
    'dirty',
    'poor'
  ]
};

export function determineSeverity(
  title: string,
  description: string,
  category: IssueCategory
): 'low' | 'medium' | 'high' | 'critical' {
  const text = (title + ' ' + description).toLowerCase();

  // Check critical keywords first
  if (
    severityKeywords.critical.some((keyword) => text.includes(keyword))
  ) {
    return 'critical';
  }

  // Check high keywords
  if (severityKeywords.high.some((keyword) => text.includes(keyword))) {
    return 'high';
  }

  // Check medium keywords
  if (severityKeywords.medium.some((keyword) => text.includes(keyword))) {
    return 'medium';
  }

  // Category-based default severity
  if (['electricity', 'safety', 'traffic'].includes(category)) {
    return 'high';
  }

  return 'low';
}

export function generateAIAnalysis(
  issueId: string,
  title: string,
  description: string,
  category: IssueCategory,
  imageCount: number
): AIAnalysis {
  const severity = determineSeverity(title, description, category);
  const template = categoryAnalysisTemplates[category];
  const assignedDepartment = departmentMapping[category];

  // Calculate confidence based on image count and description quality
  let confidence = 70;
  if (imageCount > 0) confidence += 20;
  if (description.length > 100) confidence += 10;
  confidence = Math.min(100, confidence);

  // Select random items from template
  const detectedIssues = template.detectedIssues.slice(0, 2);
  const riskFactors = template.riskFactors.slice(0, 2);

  // Generate recommendations based on severity and category
  const recommendations = generateRecommendations(
    category,
    severity,
    imageCount
  );

  return {
    id: `analysis-${Date.now()}`,
    issueId,
    severity,
    confidence,
    detectedIssues,
    recommendations,
    assignedDepartment,
    estimatedResolutionDays: Math.max(
      2,
      template.estimatedDays - (severity === 'critical' ? 2 : 0)
    ),
    riskFactors,
    analyzedAt: new Date()
  };
}

function generateRecommendations(
  category: IssueCategory,
  severity: string,
  imageCount: number
): string[] {
  const recommendations: string[] = [];

  // Priority handling
  if (severity === 'critical') {
    recommendations.push(
      'URGENT: Dispatch team immediately for on-site assessment'
    );
    recommendations.push('Alert relevant authority for emergency action');
  } else if (severity === 'high') {
    recommendations.push('Schedule urgent inspection within 24 hours');
    recommendations.push('Notify department to prioritize this issue');
  } else {
    recommendations.push('Schedule inspection within 3-5 business days');
  }

  // Image-based recommendations
  if (imageCount === 0) {
    recommendations.push('Request additional photos from reporter for better analysis');
  } else if (imageCount >= 2) {
    recommendations.push('Sufficient visual evidence for assessment');
  }

  // Category-specific recommendations
  switch (category) {
    case 'roads':
      recommendations.push(
        'Conduct structural assessment before repair work'
      );
      recommendations.push('Install temporary warning signs if needed');
      break;
    case 'electricity':
      recommendations.push('Safety protocol: Restrict public access to area');
      recommendations.push('Engage qualified electrician for inspection');
      break;
    case 'water':
      recommendations.push('Test water quality if applicable');
      recommendations.push('Assess drainage capacity');
      break;
    case 'garbage':
      recommendations.push('Schedule immediate waste collection');
      recommendations.push('Identify root cause of delay');
      break;
    case 'safety':
      recommendations.push('Increase police patrolling in the area');
      recommendations.push('Coordinate with local safety officials');
      break;
  }

  return recommendations;
}

export function getPriorityScore(analysis: AIAnalysis): number {
  const severityScore = {
    critical: 100,
    high: 75,
    medium: 50,
    low: 25
  };

  const confidenceBonus = analysis.confidence * 0.2; // Max +20
  return severityScore[analysis.severity] + confidenceBonus;
}
