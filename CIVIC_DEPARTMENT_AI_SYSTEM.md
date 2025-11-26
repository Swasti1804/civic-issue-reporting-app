# Civic Department AI Analysis System

## Overview

This feature implements an AI-powered issue analysis and departmental routing system for the Hamara Shehar platform. When citizens report civic issues, the system automatically analyzes them and routes them to the appropriate municipal departments.

## Features

### 1. **Automated AI Analysis**
When an issue is reported, the system automatically performs AI analysis that includes:

- **Severity Classification**: Automatically classifies issues as critical, high, medium, or low priority based on keywords and category
- **Confidence Scoring**: Calculates confidence level (0-100%) based on:
  - Number of photos provided
  - Description length and detail
  - Issue category
- **Issue Detection**: Identifies specific problems based on category and description
- **Risk Factor Assessment**: Highlights potential risks and complications
- **Department Routing**: Automatically assigns the issue to the most appropriate department
- **Resolution Time Estimation**: Provides estimated resolution timeframe

### 2. **Smart Recommendations**
The AI generates actionable recommendations including:

- Immediate action items for critical issues
- Inspection scheduling suggestions
- Resource allocation recommendations
- Safety protocol recommendations
- Evidence collection requests if needed

### 3. **Department Assignment**
Issues are automatically routed to departments based on category:

- **Roads** → Public Works Department
- **Water** → Water Supply Department
- **Electricity** → Electricity Department
- **Garbage** → Waste Management Department
- **Sewage** → Sewage & Drainage Department
- **Pollution** → Environmental Department
- **Safety** → Police & Safety Department
- **Traffic** → Traffic Police Department
- **Other** → Municipal Administration

### 4. **Civic Department Dashboard**
A comprehensive dashboard for viewing and managing analyzed issues:

- **Real-time Statistics**: View counts of issues by severity level
- **Department-wise Filtering**: Filter issues by assigned department
- **Severity-based Filtering**: Filter by issue severity
- **Detailed Issue Cards**: Expandable cards showing:
  - AI-detected issues
  - Risk factors
  - Recommendations
  - Evidence (photos/videos)
  - Assignment details

## File Structure

```
client/src/
├── utils/
│   └── aiAnalysis.ts                 # AI analysis utility functions
├── types/
│   └── index.ts                      # Updated with AIAnalysis type
├── store/
│   └── issueStore.ts                 # Updated createIssue with AI analysis
├── components/
│   └── department/
│       └── CivicDepartmentDashboard.tsx  # Department dashboard component
├── pages/
│   └── DepartmentDashboardPage.tsx   # Department dashboard page
└── data/
    └── mockData.ts                   # Updated with AI analyses
```

## API Integration Points

### Current Implementation (Mock Data)
The system currently uses mock AI analysis data for demonstration. To integrate with a real AI service:

1. **Image Analysis API**
   - Send images to vision API (Google Cloud Vision, Azure Computer Vision)
   - Extract detected objects, text, and scene information
   - Use results to inform severity and issue detection

2. **NLP Analysis**
   - Send title and description to NLP service
   - Perform sentiment analysis
   - Extract entities and key terms
   - Improve severity classification

3. **Department Assignment Logic**
   - Integrate with municipal department database
   - Route to specific sub-departments based on location
   - Consider department workload for load balancing

## Usage

### For Citizens (Reporting)
1. Report an issue via ReportIssuePage
2. System automatically analyzes and assigns to appropriate department
3. Citizen receives confirmation with analysis summary

### For Department Officials
1. Access DepartmentDashboardPage (route: `/department-dashboard`)
2. View all analyzed issues assigned to their department
3. Filter by severity and other criteria
4. Review AI analysis and recommendations
5. Accept issue assignment and take action
6. Update issue status as work progresses

## Severity Determination Logic

### Critical Severity (Highest Priority)
Triggered by keywords like: emergency, danger, critical, severe, collapse, gas leak, fire, injury, death, accident

### High Severity
Triggered by keywords like: urgent, serious, major, blocked, damaged, hazard, unsafe, broken, flooding
Also applied to: electricity, safety, and traffic categories by default

### Medium Severity
Triggered by keywords like: needs repair, maintenance, issue, problem, concern, dirty, poor

### Low Severity (Default)
Applied when no high-priority keywords are detected

## Confidence Scoring

```
Base Score: 70%
+ Image Count Bonus: +20% (if images > 0)
+ Description Detail: +10% (if description > 100 characters)
Maximum: 100%
```

## Future Enhancements

1. **Real AI Integration**
   - Integrate with actual vision APIs for image analysis
   - Use NLP for better text analysis
   - Machine learning models for pattern recognition

2. **Real-time Tracking**
   - WebSocket updates for issue status changes
   - Push notifications for department teams
   - Real-time dashboard updates

3. **Advanced Analytics**
   - Predictive analytics for issue patterns
   - Seasonal trend analysis
   - Department performance metrics

4. **Multi-media Support**
   - Video analysis for complex issues
   - Audio transcription for descriptions
   - 360° imagery support

5. **Community Integration**
   - Crowdsourced verification of AI analysis
   - Community voting on recommendations
   - Similar issue linking

## Testing

To test the feature:

1. Navigate to `/report` and create a new issue
2. Include title, description, category, and location
3. Upload photos (optional but recommended for higher confidence)
4. Submit the issue
5. Navigate to `/department-dashboard` to see AI analysis
6. View the automatically generated analysis and recommendations

## Mock Data Example

The system comes pre-loaded with 6 sample issues, each with:
- AI analysis results
- Assigned departments
- Severity levels
- Recommendations
- Risk factors

You can use these to understand the system's capabilities before integrating real AI services.

## Notes

- The current implementation uses keyword-based analysis for severity determination
- Future versions will integrate with actual AI/ML services for more sophisticated analysis
- All analysis happens client-side in the mock implementation
- For production, analysis should be performed on the backend
- Department officials should have proper authentication before viewing dashboards
