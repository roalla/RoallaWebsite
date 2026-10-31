param(
  [Parameter(Mandatory = $true)][string]$WordDir,
  [Parameter(Mandatory = $true)][string]$PdfDir,
  [Parameter(Mandatory = $true)][string]$ManifestPath
)

$ErrorActionPreference = 'Stop'
New-Item -ItemType Directory -Force -Path $PdfDir | Out-Null

$mapping = [ordered]@{
  'ROALLA_Acquisition_Readiness_and_Value_Creation_Guide_2026_Executive_Edition.docx' = 'acquisition-readiness-value-creation.pdf'
  'ROALLA_AI_Agent_Sprawl_and_Cost_Governance_Guide_2027_Executive_Edition.docx' = 'ai-agent-cost-governance-2027.pdf'
  'ROALLA_AI_for_Manufacturing_and_Warehouse_Operations_Guide_2026_Executive_Edition.docx' = 'ai-manufacturing-warehouse-operations.pdf'
  'ROALLA_AI_Readiness_and_Governance_Guide_2026_Executive_Edition.docx' = 'ai-readiness-governance.pdf'
  'ROALLA_AI_Use_Case_Prioritization_Guide_2026_Executive_Edition.docx' = 'ai-use-case-prioritization.pdf'
  'ROALLA_Application_Portfolio_Rationalization_Guide_Executive_Edition.docx' = 'application-portfolio-rationalization.pdf'
  'ROALLA_Business_Continuity_and_Operational_Resilience_Guide_Executive_Edition.docx' = 'business-continuity-operational-resilience.pdf'
  'ROALLA_Canadian_AI_Innovation_Funding_Qualification_Guide_2026_Executive_Edition.docx' = 'canadian-innovation-funding-qualification.pdf'
  'ROALLA_Canadian_Staff_Augmentation_Outlook_2027_Guide_Executive_Edition.docx' = 'canadian-staff-augmentation-outlook-2027.pdf'
  'ROALLA_Combining_Executive_Accountabilities_Without_Creating_Leadership_Gaps_Guide_Executive_Edition.docx' = 'combined-executive-accountabilities.pdf'
  'ROALLA_Contact_Centre_AI_Transformation_Guide_2026_Executive_Edition.docx' = 'contact-centre-ai-transformation.pdf'
  'ROALLA_COO_Readiness_and_Operating_Leadership_Guide_Executive_Edition.docx' = 'coo-readiness-operating-leadership.pdf'
  'ROALLA_Customer_Success_and_Revenue_Retention_Guide_2026_Executive_Edition.docx' = 'customer-success-revenue-retention.pdf'
  'ROALLA_Cybersecurity_and_Digital_Resilience_Guide_2026_Executive_Edition.docx' = 'cybersecurity-digital-resilience.pdf'
  'ROALLA_Designing_the_CTO_Role_Guide_Executive_Edition.docx' = 'designing-cto-role.pdf'
  'ROALLA_Digital_Experience_Modernization_Guide_2026_Executive_Edition.docx' = 'digital-experience-modernization.pdf'
  'ROALLA_Digital_Workplace_and_Collaboration_Optimization_Guide_Executive_Edition.docx' = 'digital-workplace-collaboration-optimization.pdf'
  'ROALLA_Energy_Productivity_and_Facility_Modernization_Guide_2026_Executive_Edition.docx' = 'energy-productivity-facility-modernization.pdf'
  'ROALLA_Enterprise_Sales_Transformation_Guide_2026_Executive_Edition.docx' = 'enterprise-sales-transformation.pdf'
  'ROALLA_Enterprise_User_Adoption_and_Self_Service_Enablement_Guide_Executive_Edition.docx' = 'enterprise-user-adoption-self-service-enablement.pdf'
  'ROALLA_ERP_MES_and_WMS_Integration_Readiness_Guide_2026_Executive_Edition.docx' = 'erp-mes-wms-integration-readiness.pdf'
  'ROALLA_Executive_Decision_Rights_and_Accountability_Design_Guide_Executive_Edition.docx' = 'executive-decision-rights-accountability.pdf'
  'ROALLA_Executive_Hiring_Readiness_and_the_First_100_Days_Guide_Executive_Edition.docx' = 'executive-hiring-first-100-days.pdf'
  'ROALLA_Executive_Leadership_Architecture_for_a_Growing_Company_Guide_Executive_Edition.docx' = 'executive-leadership-architecture-growth.pdf'
  'ROALLA_Executive_Performance_Scorecards_for_Growth_Companies_Guide_Executive_Edition.docx' = 'executive-performance-scorecards.pdf'
  'ROALLA_Founder_Led_to_Leadership_Led_Guide_Executive_Edition.docx' = 'founder-led-leadership-led-evolution.pdf'
  'ROALLA_Fractional_Interim_or_Full_Time_Executive_Leadership_Guide_Executive_Edition.docx' = 'fractional-interim-full-time-executive.pdf'
  'ROALLA_Go_to_Market_Strategy_and_Readiness_Guide_2026_Executive_Edition.docx' = 'go-to-market-strategy-readiness.pdf'
  'ROALLA_Industrial_Technology_Vendor_Selection_and_Business_Case_Guide_2026_Executive_Edition.docx' = 'industrial-technology-vendor-selection.pdf'
  'ROALLA_Leadership_Team_Evolution_by_Growth_Stage_Guide_Executive_Edition.docx' = 'leadership-team-evolution-growth-stage.pdf'
  'ROALLA_Marketing_to_Revenue_Alignment_Guide_2026_Executive_Edition.docx' = 'marketing-revenue-alignment.pdf'
  'ROALLA_Operational_Technology_Cybersecurity_and_Resilience_Guide_2026_Executive_Edition.docx' = 'operational-technology-cybersecurity-resilience.pdf'
  'ROALLA_Player_Coach_Leadership_Guide_Executive_Edition.docx' = 'player-coach-leadership.pdf'
  'ROALLA_Pricing_and_Packaging_Optimization_Guide_2026_Executive_Edition.docx' = 'pricing-packaging-optimization.pdf'
  'ROALLA_Product_Technology_and_Commercial_Leadership_Alignment_Guide_Executive_Edition.docx' = 'product-technology-commercial-alignment.pdf'
  'ROALLA_Responsible_Automation_and_Workforce_Transition_Guide_Executive_Edition.docx' = 'responsible-automation-workforce-transition.pdf'
  'ROALLA_Revenue_Operations_Maturity_and_Forecast_Confidence_Guide_2026_Executive_Edition.docx' = 'revenue-operations-forecast-confidence.pdf'
  'ROALLA_SaaS_SOC_2_Readiness_and_Business_Value_Guide_2026_Executive_Edition.docx' = 'saas-soc-2-readiness.pdf'
  'ROALLA_Sales_Organization_Growth_and_Evolution_Guide_2026_Executive_Edition.docx' = 'sales-organization-growth-evolution.pdf'
  'ROALLA_Smart_Manufacturing_and_Warehouse_Modernization_Readiness_Guide_2026_Executive_Edition.docx' = 'smart-manufacturing-warehouse-modernization.pdf'
  'ROALLA_Supply_Chain_Visibility_and_Resilience_Guide_2026_Executive_Edition.docx' = 'supply-chain-visibility-resilience.pdf'
  'ROALLA_Technology_Due_Diligence_Guide_2026_Executive_Edition.docx' = 'technology-due-diligence.pdf'
  'ROALLA_Technology_Transformation_Readiness_Guide_2026_Executive_Edition.docx' = 'technology-transformation-readiness.pdf'
  'ROALLA_Voice_and_Unified_Communications_Modernization_Guide_2026_Executive_Edition.docx' = 'voice-unified-communications-modernization.pdf'
  'ROALLA_Warehouse_Automation_and_Robotics_Investment_Guide_2026_Executive_Edition.docx' = 'warehouse-automation-robotics-investment.pdf'
}

$actualDocs = @(Get-ChildItem -LiteralPath $WordDir -Filter '*.docx' -File)
if ($actualDocs.Count -ne $mapping.Count) {
  throw "Expected $($mapping.Count) Word files, found $($actualDocs.Count)."
}

foreach ($name in $mapping.Keys) {
  $path = Join-Path $WordDir $name
  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    throw "Missing mapped Word source: $name"
  }
}

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
$results = @()

try {
  foreach ($entry in $mapping.GetEnumerator()) {
    $inputPath = Join-Path $WordDir $entry.Key
    $outputPath = Join-Path $PdfDir $entry.Value
    Write-Output ("EXPORT " + $entry.Value)
    $doc = $word.Documents.Open($inputPath, $false, $true)
    try {
      $lastPage = $doc.ComputeStatistics(2)
      $doc.ExportAsFixedFormat($outputPath, 17, $false, 0, 0, 1, $lastPage, 0, $true, $true, 1, $true, $true, $false)
    }
    finally {
      $doc.Close(0)
    }
    $pdf = Get-Item -LiteralPath $outputPath
    $results += [pscustomobject]@{
      source = $inputPath
      output = $outputPath
      pages = $lastPage
      bytes = $pdf.Length
    }
  }
}
finally {
  $word.Quit()
}

$results | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $ManifestPath -Encoding utf8
Write-Output ("EXPORTED_COUNT=" + $results.Count)
