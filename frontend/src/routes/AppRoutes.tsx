import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

// Navigation & Common Components
import { PublicNavbar } from '../components/common/PublicNavbar';
import { PublicFooter } from '../components/common/PublicFooter';
import { AuthenticatedHeader } from '../components/common/AuthenticatedHeader';
import { Sidebar } from '../components/common/Sidebar';
import { MobileNav } from '../components/common/MobileNav';
import { DevDemoDrawer } from '../components/common/DevDemoDrawer';
import { AskSathiDrawer } from '../components/common/AskSathiDrawer';
import { AuthGuard, RoleGuard } from '../components/common/Guards';

// Public & Citizen Views
const PublicHomePage = React.lazy(() => import('../features/public/PublicHomePage').then(module => ({ default: module.PublicHomePage })));
const CitizenHomePage = React.lazy(() => import('../features/citizen/CitizenHomePage').then(module => ({ default: module.CitizenHomePage })));
const ReportProblemWizard = React.lazy(() => import('../features/citizen/ReportProblemWizard').then(module => ({ default: module.ReportProblemWizard })));
const CitizenCasesListPage = React.lazy(() => import('../features/citizen/CitizenCasesListPage').then(module => ({ default: module.CitizenCasesListPage })));
const CitizenCaseDetailPage = React.lazy(() => import('../features/citizen/CitizenCaseDetailPage').then(module => ({ default: module.CitizenCaseDetailPage })));
const ServiceDiscoveryPage = React.lazy(() => import('../features/citizen/ServiceDiscoveryPage').then(module => ({ default: module.ServiceDiscoveryPage })));
const ServiceDetailPage = React.lazy(() => import('../features/citizen/ServiceDetailPage').then(module => ({ default: module.ServiceDetailPage })));
const CitizenNotificationsPage = React.lazy(() => import('../features/citizen/CitizenNotificationsPage').then(module => ({ default: module.CitizenNotificationsPage })));
const CitizenProfilePage = React.lazy(() => import('../features/citizen/CitizenProfilePage').then(module => ({ default: module.CitizenProfilePage })));

// Ward Views
const WardDashboardPage = React.lazy(() => import('../features/ward/WardDashboardPage').then(module => ({ default: module.WardDashboardPage })));
const WardWorkQueuePage = React.lazy(() => import('../features/ward/WardWorkQueuePage').then(module => ({ default: module.WardWorkQueuePage })));
const WardVerificationQueuePage = React.lazy(() => import('../features/ward/WardVerificationQueuePage').then(module => ({ default: module.WardVerificationQueuePage })));
const WardCaseReviewPage = React.lazy(() => import('../features/ward/WardCaseReviewPage').then(module => ({ default: module.WardCaseReviewPage })));
const WardAiReviewHubPage = React.lazy(() => import('../features/ward/WardAiReviewHubPage').then(module => ({ default: module.WardAiReviewHubPage })));
const WardRoutingPage = React.lazy(() => import('../features/ward/WardRoutingPage').then(module => ({ default: module.WardRoutingPage })));
const WardMultiDeptPlannerPage = React.lazy(() => import('../features/ward/WardMultiDeptPlannerPage').then(module => ({ default: module.WardMultiDeptPlannerPage })));
const WardDuplicateManagerPage = React.lazy(() => import('../features/ward/WardDuplicateManagerPage').then(module => ({ default: module.WardDuplicateManagerPage })));
const WardHandoverPage = React.lazy(() => import('../features/ward/WardHandoverPage').then(module => ({ default: module.WardHandoverPage })));
const WardEvidenceReviewPage = React.lazy(() => import('../features/ward/WardEvidenceReviewPage').then(module => ({ default: module.WardEvidenceReviewPage })));
const WardOperationsMapPage = React.lazy(() => import('../features/ward/WardOperationsMapPage').then(module => ({ default: module.WardOperationsMapPage })));
const WardHotspotsPage = React.lazy(() => import('../features/ward/WardHotspotsPage').then(module => ({ default: module.WardHotspotsPage })));
const WardSlaEscalationPage = React.lazy(() => import('../features/ward/WardSlaEscalationPage').then(module => ({ default: module.WardSlaEscalationPage })));
const WardReportsPage = React.lazy(() => import('../features/ward/WardReportsPage').then(module => ({ default: module.WardReportsPage })));
const WardAssistedHistoryPage = React.lazy(() => import('../features/ward/WardAssistedHistoryPage').then(module => ({ default: module.WardAssistedHistoryPage })));

// Officer Views
const OfficerDashboardPage = React.lazy(() => import('../features/officer/OfficerDashboardPage').then(module => ({ default: module.OfficerDashboardPage })));
const OfficerTaskDetailPage = React.lazy(() => import('../features/officer/OfficerTaskDetailPage').then(module => ({ default: module.OfficerTaskDetailPage })));
const OfficerDepartmentRequestsPage = React.lazy(() => import('../features/officer/OfficerDepartmentRequestsPage').then(module => ({ default: module.OfficerDepartmentRequestsPage })));
const OfficerAssignmentQueuePage = React.lazy(() => import('../features/officer/OfficerAssignmentQueuePage').then(module => ({ default: module.OfficerAssignmentQueuePage })));
const OfficerAvailabilityPage = React.lazy(() => import('../features/officer/OfficerAvailabilityPage').then(module => ({ default: module.OfficerAvailabilityPage })));
const OfficerWorkloadPage = React.lazy(() => import('../features/officer/OfficerWorkloadPage').then(module => ({ default: module.OfficerWorkloadPage })));
const OfficerTasksPage = React.lazy(() => import('../features/officer/OfficerTasksPage').then(module => ({ default: module.OfficerTasksPage })));

// Coordinator Views
const CoordinatorDashboardPage = React.lazy(() => import('../features/coordinator/CoordinatorDashboardPage').then(module => ({ default: module.CoordinatorDashboardPage })));
const MultiDepartmentCaseViewPage = React.lazy(() => import('../features/coordinator/MultiDepartmentCaseViewPage').then(module => ({ default: module.MultiDepartmentCaseViewPage })));
const CoordinatorEscalationsPage = React.lazy(() => import('../features/coordinator/CoordinatorEscalationsPage').then(module => ({ default: module.CoordinatorEscalationsPage })));
const CoordinatorHotspotsPage = React.lazy(() => import('../features/coordinator/CoordinatorHotspotsPage').then(module => ({ default: module.CoordinatorHotspotsPage })));
const CoordinatorCaseBoardPage = React.lazy(() => import('../features/coordinator/CoordinatorCaseBoardPage').then(module => ({ default: module.CoordinatorCaseBoardPage })));
const CoordinatorMultiDeptListPage = React.lazy(() => import('../features/coordinator/CoordinatorMultiDeptListPage').then(module => ({ default: module.CoordinatorMultiDeptListPage })));
const CoordinatorSequencePlannerPage = React.lazy(() => import('../features/coordinator/CoordinatorSequencePlannerPage').then(module => ({ default: module.CoordinatorSequencePlannerPage })));
const CoordinatorHandoversPage = React.lazy(() => import('../features/coordinator/CoordinatorHandoversPage').then(module => ({ default: module.CoordinatorHandoversPage })));
const CoordinatorWorkloadPage = React.lazy(() => import('../features/coordinator/CoordinatorWorkloadPage').then(module => ({ default: module.CoordinatorWorkloadPage })));
const CoordinatorDuplicatesPage = React.lazy(() => import('../features/coordinator/CoordinatorDuplicatesPage').then(module => ({ default: module.CoordinatorDuplicatesPage })));
const CoordinatorEvidenceReviewPage = React.lazy(() => import('../features/coordinator/CoordinatorEvidenceReviewPage').then(module => ({ default: module.CoordinatorEvidenceReviewPage })));
const CoordinatorObjectionsPage = React.lazy(() => import('../features/coordinator/CoordinatorObjectionsPage').then(module => ({ default: module.CoordinatorObjectionsPage })));
const CoordinatorReopenedCasesPage = React.lazy(() => import('../features/coordinator/CoordinatorReopenedCasesPage').then(module => ({ default: module.CoordinatorReopenedCasesPage })));
const CoordinatorClosureReviewPage = React.lazy(() => import('../features/coordinator/CoordinatorClosureReviewPage').then(module => ({ default: module.CoordinatorClosureReviewPage })));
const CoordinatorMapPage = React.lazy(() => import('../features/coordinator/CoordinatorMapPage').then(module => ({ default: module.CoordinatorMapPage })));
const CoordinatorDepartmentPerformancePage = React.lazy(() => import('../features/coordinator/CoordinatorDepartmentPerformancePage').then(module => ({ default: module.CoordinatorDepartmentPerformancePage })));
const CoordinatorCaseAuditPage = React.lazy(() => import('../features/coordinator/CoordinatorCaseAuditPage').then(module => ({ default: module.CoordinatorCaseAuditPage })));
const CoordinatorSlaTargetsPage = React.lazy(() => import('../features/coordinator/CoordinatorSlaTargetsPage').then(module => ({ default: module.CoordinatorSlaTargetsPage })));

// Admin Views
const AdminOverviewPage = React.lazy(() => import('../features/admin/AdminOverviewPage').then(module => ({ default: module.AdminOverviewPage })));
const AdminWingsPage = React.lazy(() => import('../features/admin/AdminWingsPage').then(module => ({ default: module.AdminWingsPage })));
const AdminModelLabPage = React.lazy(() => import('../features/admin/AdminModelLabPage').then(module => ({ default: module.AdminModelLabPage })));
const AdminSystemHealthPage = React.lazy(() => import('../features/admin/AdminSystemHealthPage').then(module => ({ default: module.AdminSystemHealthPage })));
const AdminPendingApprovalsPage = React.lazy(() => import('../features/admin/AdminPendingApprovalsPage').then(module => ({ default: module.AdminPendingApprovalsPage })));
const AdminUsersPage = React.lazy(() => import('../features/admin/AdminUsersPage').then(module => ({ default: module.AdminUsersPage })));
const AdminRolesMatrixPage = React.lazy(() => import('../features/admin/AdminRolesMatrixPage').then(module => ({ default: module.AdminRolesMatrixPage })));
const AdminAccountStatusPage = React.lazy(() => import('../features/admin/AdminAccountStatusPage').then(module => ({ default: module.AdminAccountStatusPage })));
const AdminDepartmentDirectoryPage = React.lazy(() => import('../features/admin/AdminDepartmentDirectoryPage').then(module => ({ default: module.AdminDepartmentDirectoryPage })));
const AdminOfficerDirectoryPage = React.lazy(() => import('../features/admin/AdminOfficerDirectoryPage').then(module => ({ default: module.AdminOfficerDirectoryPage })));
const AdminWardAssetRegistryPage = React.lazy(() => import('../features/admin/AdminWardAssetRegistryPage').then(module => ({ default: module.AdminWardAssetRegistryPage })));
const AdminRulesPage = React.lazy(() => import('../features/admin/AdminRulesPage').then(module => ({ default: module.AdminRulesPage })));
const AdminTaskSequencingRulesPage = React.lazy(() => import('../features/admin/AdminTaskSequencingRulesPage').then(module => ({ default: module.AdminTaskSequencingRulesPage })));
const AdminAiGatePage = React.lazy(() => import('../features/admin/AdminAiGatePage').then(module => ({ default: module.AdminAiGatePage })));
const AdminAiSafetyConfigPage = React.lazy(() => import('../features/admin/AdminAiSafetyConfigPage').then(module => ({ default: module.AdminAiSafetyConfigPage })));
const AdminServiceKnowledgePage = React.lazy(() => import('../features/admin/AdminServiceKnowledgePage').then(module => ({ default: module.AdminServiceKnowledgePage })));
const AdminServiceSourcesPage = React.lazy(() => import('../features/admin/AdminServiceSourcesPage').then(module => ({ default: module.AdminServiceSourcesPage })));
const AdminKnowledgeHistoryPage = React.lazy(() => import('../features/admin/AdminKnowledgeHistoryPage').then(module => ({ default: module.AdminKnowledgeHistoryPage })));
const AdminSlaPoliciesPage = React.lazy(() => import('../features/admin/AdminSlaPoliciesPage').then(module => ({ default: module.AdminSlaPoliciesPage })));
const AdminEscalationConfigPage = React.lazy(() => import('../features/admin/AdminEscalationConfigPage').then(module => ({ default: module.AdminEscalationConfigPage })));
const AdminPublicDashboardSettingsPage = React.lazy(() => import('../features/admin/AdminPublicDashboardSettingsPage').then(module => ({ default: module.AdminPublicDashboardSettingsPage })));
const AdminAuditLogPage = React.lazy(() => import('../features/admin/AdminAuditLogPage').then(module => ({ default: module.AdminAuditLogPage })));
const AdminSecurityEventsPage = React.lazy(() => import('../features/admin/AdminSecurityEventsPage').then(module => ({ default: module.AdminSecurityEventsPage })));
const AdminConfigHistoryPage = React.lazy(() => import('../features/admin/AdminConfigHistoryPage').then(module => ({ default: module.AdminConfigHistoryPage })));
const AdminAnalyticsPage = React.lazy(() => import('../features/admin/AdminAnalyticsPage').then(module => ({ default: module.AdminAnalyticsPage })));
const AdminRepeatIssuesPage = React.lazy(() => import('../features/admin/AdminRepeatIssuesPage').then(module => ({ default: module.AdminRepeatIssuesPage })));
const AdminTransparencyMetricsPage = React.lazy(() => import('../features/admin/AdminTransparencyMetricsPage').then(module => ({ default: module.AdminTransparencyMetricsPage })));
const AdminSystemSettingsPage = React.lazy(() => import('../features/admin/AdminSystemSettingsPage').then(module => ({ default: module.AdminSystemSettingsPage })));
const AdminInfrastructureStatusPage = React.lazy(() => import('../features/admin/AdminInfrastructureStatusPage').then(module => ({ default: module.AdminInfrastructureStatusPage })));
const AdminTechnicalConfigPage = React.lazy(() => import('../features/admin/AdminTechnicalConfigPage').then(module => ({ default: module.AdminTechnicalConfigPage })));
const AdminPolicyImplementationsPage = React.lazy(() => import('../features/admin/AdminPolicyImplementationsPage').then(module => ({ default: module.AdminPolicyImplementationsPage })));

// City Governance Head Views (Municipal Policy & Service Governance)
const GovernanceOverviewPage = React.lazy(() => import('../features/governance/GovernanceOverviewPage').then(module => ({ default: module.GovernanceOverviewPage })));
const GovernanceApprovalsPage = React.lazy(() => import('../features/governance/GovernanceApprovalsPage').then(module => ({ default: module.GovernanceApprovalsPage })));
const GovernanceResponsibilityRulesPage = React.lazy(() => import('../features/governance/GovernanceResponsibilityRulesPage').then(module => ({ default: module.GovernanceResponsibilityRulesPage })));
const GovernanceTaskSequencingPage = React.lazy(() => import('../features/governance/GovernanceTaskSequencingPage').then(module => ({ default: module.GovernanceTaskSequencingPage })));
const GovernanceAiGatePage = React.lazy(() => import('../features/governance/GovernanceAiGatePage').then(module => ({ default: module.GovernanceAiGatePage })));
const GovernanceSlaPolicyPage = React.lazy(() => import('../features/governance/GovernanceSlaPolicyPage').then(module => ({ default: module.GovernanceSlaPolicyPage })));
const GovernanceServicePerformancePage = React.lazy(() => import('../features/governance/GovernanceServicePerformancePage').then(module => ({ default: module.GovernanceServicePerformancePage })));
const GovernanceRecurringIssuesPage = React.lazy(() => import('../features/governance/GovernanceRecurringIssuesPage').then(module => ({ default: module.GovernanceRecurringIssuesPage })));
const GovernanceTransparencyPolicyPage = React.lazy(() => import('../features/governance/GovernanceTransparencyPolicyPage').then(module => ({ default: module.GovernanceTransparencyPolicyPage })));
const GovernancePolicyHistoryPage = React.lazy(() => import('../features/governance/GovernancePolicyHistoryPage').then(module => ({ default: module.GovernancePolicyHistoryPage })));

// Maps & Transparency & Auth
const CivicMapPage = React.lazy(() => import('../features/maps/CivicMapPage').then(module => ({ default: module.CivicMapPage })));
const PublicTransparencyPage = React.lazy(() => import('../features/transparency/PublicTransparencyPage').then(module => ({ default: module.PublicTransparencyPage })));
const RoleSelectionPage = React.lazy(() => import('../features/auth/RoleSelectionPage').then(module => ({ default: module.RoleSelectionPage })));
const RoleLoginPage = React.lazy(() => import('../features/auth/RoleLoginPage').then(module => ({ default: module.RoleLoginPage })));
const UnauthorizedPage = React.lazy(() => import('../features/auth/UnauthorizedPage').then(module => ({ default: module.UnauthorizedPage })));

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, activeRole } = useAuth();
  const { t } = useLanguage();
  const isStaffOrAdmin = isAuthenticated && activeRole !== 'citizen';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)] selection:bg-[var(--ink)] selection:text-[var(--paper)] pb-16 md:pb-0 transition-colors duration-200">
      {/* Dynamic Header */}
      {!isAuthenticated ? <PublicNavbar /> : <AuthenticatedHeader />}

      {/* Main Workspace Layout with Sidebar for Staff/Admin */}
      <div className="flex-1 flex w-full items-start">
        {isStaffOrAdmin && <Sidebar />}

        <main className="flex-1 min-w-0 overflow-y-auto">
          <Suspense fallback={<div className="flex min-h-[35vh] items-center justify-center text-sm text-[var(--muted)]">{t('পৃষ্ঠা লোড হচ্ছে…', 'Loading page…')}</div>}>
          <Routes>
            {/* Public Entry & General Routes */}
            <Route
              path="/"
              element={!isAuthenticated ? <PublicHomePage /> : activeRole === 'citizen' ? <CitizenHomePage /> : <Navigate to={getRoleRedirect(activeRole || 'citizen')} replace />}
            />
            <Route
              path="/home"
              element={
                <AuthGuard>
                  <CitizenHomePage />
                </AuthGuard>
              }
            />
            <Route path="/services" element={<ServiceDiscoveryPage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            <Route path="/map" element={<CivicMapPage />} />
            <Route path="/transparency" element={<PublicTransparencyPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Navigate to="/login/citizen" replace />} />
            <Route path="/login/:role" element={<RoleLoginPage />} />
            <Route path="/roles" element={<RoleSelectionPage />} />
            <Route path="/login/roles" element={<RoleSelectionPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/forbidden" element={<UnauthorizedPage />} />

            {/* Citizen Protected Routes */}
            <Route
              path="/report"
              element={
                <AuthGuard>
                  <ReportProblemWizard />
                </AuthGuard>
              }
            />
            <Route
              path="/cases"
              element={
                <AuthGuard>
                  <CitizenCasesListPage />
                </AuthGuard>
              }
            />
            <Route
              path="/cases/:id"
              element={
                <AuthGuard>
                  <CitizenCaseDetailPage />
                </AuthGuard>
              }
            />
            <Route
              path="/notifications"
              element={
                <AuthGuard>
                  <CitizenNotificationsPage />
                </AuthGuard>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthGuard>
                  <CitizenProfilePage />
                </AuthGuard>
              }
            />

            {/* Ward Desk Protected Routes */}
            {/* Overview */}
            <Route
              path="/ward"
              element={
                <RoleGuard allowedRoles={['ward_desk', 'admin']}>
                  <WardDashboardPage />
                </RoleGuard>
              }
            />
            <Route
              path="/ward/work-queue"
              element={
                <RoleGuard allowedRoles={['ward_desk', 'admin']}>
                  <WardWorkQueuePage />
                </RoleGuard>
              }
            />

            {/* Case Operations */}
            <Route
              path="/ward/verification"
              element={
                <RoleGuard allowedRoles={['ward_desk', 'admin']}>
                  <WardVerificationQueuePage />
                </RoleGuard>
              }
            />
            <Route
              path="/ward/cases/:id"
              element={
                <RoleGuard allowedRoles={['ward_desk', 'admin']}>
                  <WardCaseReviewPage />
                </RoleGuard>
              }
            />
            <Route
              path="/ward/ai-review"
              element={
                <RoleGuard allowedRoles={['ward_desk', 'admin']}>
                  <WardAiReviewHubPage />
                </RoleGuard>
              }
            />
            <Route
              path="/ward/routing"
              element={
                <RoleGuard allowedRoles={['ward_desk', 'admin']}>
                  <WardRoutingPage />
                </RoleGuard>
              }
            />
            <Route
              path="/ward/planner"
              element={
                <RoleGuard allowedRoles={['ward_desk', 'admin']}>
                  <WardMultiDeptPlannerPage />
                </RoleGuard>
              }
            />
            <Route
              path="/ward/duplicates"
              element={
                <RoleGuard allowedRoles={['ward_desk', 'admin']}>
                  <WardDuplicateManagerPage />
                </RoleGuard>
              }
            />
            <Route
              path="/ward/handovers"
              element={
                <RoleGuard allowedRoles={['ward_desk', 'admin']}>
                  <WardHandoverPage />
                </RoleGuard>
              }
            />
            <Route
              path="/ward/evidence-review"
              element={
                <RoleGuard allowedRoles={['ward_desk', 'admin']}>
                  <WardEvidenceReviewPage />
                </RoleGuard>
              }
            />

            {/* Ward Intelligence */}
            <Route
              path="/ward/map"
              element={
                <RoleGuard allowedRoles={['ward_desk', 'admin']}>
                  <WardOperationsMapPage />
                </RoleGuard>
              }
            />
            <Route
              path="/ward/hotspots"
              element={
                <RoleGuard allowedRoles={['ward_desk', 'admin']}>
                  <WardHotspotsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/ward/sla-escalations"
              element={
                <RoleGuard allowedRoles={['ward_desk', 'admin']}>
                  <WardSlaEscalationPage />
                </RoleGuard>
              }
            />

            {/* Reports */}
            <Route
              path="/ward/reports"
              element={
                <RoleGuard allowedRoles={['ward_desk', 'admin']}>
                  <WardReportsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/ward/assisted-history"
              element={
                <RoleGuard allowedRoles={['ward_desk', 'admin']}>
                  <WardAssistedHistoryPage />
                </RoleGuard>
              }
            />

            {/* Officer Protected Routes */}
            <Route
              path="/officer"
              element={
                <RoleGuard allowedRoles={['field_officer', 'admin']}>
                  <OfficerDashboardPage />
                </RoleGuard>
              }
            />
            <Route
              path="/officer/requests"
              element={
                <RoleGuard allowedRoles={['field_officer', 'admin']}>
                  <OfficerDepartmentRequestsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/officer/assignment-queue"
              element={
                <RoleGuard allowedRoles={['field_officer', 'admin']}>
                  <OfficerAssignmentQueuePage />
                </RoleGuard>
              }
            />
            <Route
              path="/officer/availability"
              element={
                <RoleGuard allowedRoles={['field_officer', 'admin']}>
                  <OfficerAvailabilityPage />
                </RoleGuard>
              }
            />
            <Route
              path="/officer/workload"
              element={
                <RoleGuard allowedRoles={['field_officer', 'admin']}>
                  <OfficerWorkloadPage />
                </RoleGuard>
              }
            />
            <Route
              path="/officer/tasks"
              element={
                <RoleGuard allowedRoles={['field_officer', 'admin']}>
                  <OfficerTasksPage />
                </RoleGuard>
              }
            />
            <Route
              path="/officer/tasks/:id"
              element={
                <RoleGuard allowedRoles={['field_officer', 'admin']}>
                  <OfficerTaskDetailPage />
                </RoleGuard>
              }
            />

            {/* Coordinator Protected Routes */}
            <Route
              path="/coordinator"
              element={
                <RoleGuard allowedRoles={['coordinator', 'admin']}>
                  <CoordinatorDashboardPage />
                </RoleGuard>
              }
            />
            <Route
              path="/coordinator/cases"
              element={
                <RoleGuard allowedRoles={['coordinator', 'admin']}>
                  <CoordinatorCaseBoardPage />
                </RoleGuard>
              }
            />
            <Route
              path="/coordinator/cases/:id"
              element={
                <RoleGuard allowedRoles={['coordinator', 'admin']}>
                  <MultiDepartmentCaseViewPage />
                </RoleGuard>
              }
            />
            <Route
              path="/coordinator/multi-dept"
              element={
                <RoleGuard allowedRoles={['coordinator', 'admin']}>
                  <CoordinatorMultiDeptListPage />
                </RoleGuard>
              }
            />
            <Route
              path="/coordinator/sequence-planner"
              element={
                <RoleGuard allowedRoles={['coordinator', 'admin']}>
                  <CoordinatorSequencePlannerPage />
                </RoleGuard>
              }
            />
            <Route
              path="/coordinator/handovers"
              element={
                <RoleGuard allowedRoles={['coordinator', 'admin']}>
                  <CoordinatorHandoversPage />
                </RoleGuard>
              }
            />
            <Route
              path="/coordinator/workload"
              element={
                <RoleGuard allowedRoles={['coordinator', 'admin']}>
                  <CoordinatorWorkloadPage />
                </RoleGuard>
              }
            />
            <Route
              path="/coordinator/duplicates"
              element={
                <RoleGuard allowedRoles={['coordinator', 'admin']}>
                  <CoordinatorDuplicatesPage />
                </RoleGuard>
              }
            />
            <Route
              path="/coordinator/evidence-review"
              element={
                <RoleGuard allowedRoles={['coordinator', 'admin']}>
                  <CoordinatorEvidenceReviewPage />
                </RoleGuard>
              }
            />
            <Route
              path="/coordinator/objections"
              element={
                <RoleGuard allowedRoles={['coordinator', 'admin']}>
                  <CoordinatorObjectionsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/coordinator/reopened-cases"
              element={
                <RoleGuard allowedRoles={['coordinator', 'admin']}>
                  <CoordinatorReopenedCasesPage />
                </RoleGuard>
              }
            />
            <Route
              path="/coordinator/closure-review"
              element={
                <RoleGuard allowedRoles={['coordinator', 'admin']}>
                  <CoordinatorClosureReviewPage />
                </RoleGuard>
              }
            />
            <Route
              path="/coordinator/escalations"
              element={
                <RoleGuard allowedRoles={['coordinator', 'admin']}>
                  <CoordinatorEscalationsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/coordinator/map"
              element={
                <RoleGuard allowedRoles={['coordinator', 'admin']}>
                  <CoordinatorMapPage />
                </RoleGuard>
              }
            />
            <Route
              path="/coordinator/hotspots"
              element={
                <RoleGuard allowedRoles={['coordinator', 'admin']}>
                  <CoordinatorHotspotsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/coordinator/department-performance"
              element={
                <RoleGuard allowedRoles={['coordinator', 'admin']}>
                  <CoordinatorDepartmentPerformancePage />
                </RoleGuard>
              }
            />
            <Route
              path="/coordinator/case-audit"
              element={
                <RoleGuard allowedRoles={['coordinator', 'admin']}>
                  <CoordinatorCaseAuditPage />
                </RoleGuard>
              }
            />
            <Route
              path="/coordinator/sla-targets"
              element={
                <RoleGuard allowedRoles={['coordinator', 'admin']}>
                  <CoordinatorSlaTargetsPage />
                </RoleGuard>
              }
            />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<RoleGuard allowedRoles={['admin']}><AdminOverviewPage /></RoleGuard>} />
            <Route path="/admin/wings" element={<RoleGuard allowedRoles={['admin']}><AdminWingsPage /></RoleGuard>} />
            <Route path="/admin/health" element={<RoleGuard allowedRoles={['admin']}><AdminSystemHealthPage /></RoleGuard>} />
            <Route path="/admin/model-lab" element={<RoleGuard allowedRoles={['admin']}><AdminModelLabPage /></RoleGuard>} />
            <Route path="/admin/infrastructure" element={<RoleGuard allowedRoles={['admin']}><AdminInfrastructureStatusPage /></RoleGuard>} />
            <Route path="/admin/technical-config" element={<RoleGuard allowedRoles={['admin']}><AdminTechnicalConfigPage /></RoleGuard>} />
            <Route path="/admin/policy-implementations" element={<RoleGuard allowedRoles={['admin']}><AdminPolicyImplementationsPage /></RoleGuard>} />
            <Route path="/admin/pending-approvals" element={<RoleGuard allowedRoles={['admin']}><AdminPendingApprovalsPage /></RoleGuard>} />

            {/* Admin Identity & Registry */}
            <Route path="/admin/users" element={<RoleGuard allowedRoles={['admin']}><AdminUsersPage /></RoleGuard>} />
            <Route path="/admin/roles" element={<RoleGuard allowedRoles={['admin']}><AdminRolesMatrixPage /></RoleGuard>} />
            <Route path="/admin/accounts" element={<RoleGuard allowedRoles={['admin']}><AdminAccountStatusPage /></RoleGuard>} />
            <Route path="/admin/departments" element={<RoleGuard allowedRoles={['admin']}><AdminDepartmentDirectoryPage /></RoleGuard>} />
            <Route path="/admin/officers" element={<RoleGuard allowedRoles={['admin']}><AdminOfficerDirectoryPage /></RoleGuard>} />
            <Route path="/admin/registry" element={<RoleGuard allowedRoles={['admin']}><AdminWardAssetRegistryPage /></RoleGuard>} />

            {/* Admin Audit & Diagnostics */}
            <Route path="/admin/audit" element={<RoleGuard allowedRoles={['admin']}><AdminAuditLogPage /></RoleGuard>} />
            <Route path="/admin/security-events" element={<RoleGuard allowedRoles={['admin']}><AdminSecurityEventsPage /></RoleGuard>} />
            <Route path="/admin/config-history" element={<RoleGuard allowedRoles={['admin']}><AdminConfigHistoryPage /></RoleGuard>} />
            <Route path="/admin/settings" element={<RoleGuard allowedRoles={['admin']}><AdminSystemSettingsPage /></RoleGuard>} />

            {/* City Governance Head Protected Routes (Municipal Policy & Service Governance) */}
            <Route path="/governance" element={<RoleGuard allowedRoles={['governance_head']}><GovernanceOverviewPage /></RoleGuard>} />
            <Route path="/governance/approvals" element={<RoleGuard allowedRoles={['governance_head']}><GovernanceApprovalsPage /></RoleGuard>} />
            <Route path="/governance/responsibility-rules" element={<RoleGuard allowedRoles={['governance_head']}><GovernanceResponsibilityRulesPage /></RoleGuard>} />
            <Route path="/governance/task-sequencing" element={<RoleGuard allowedRoles={['governance_head']}><GovernanceTaskSequencingPage /></RoleGuard>} />
            <Route path="/governance/ai-gate" element={<RoleGuard allowedRoles={['governance_head']}><GovernanceAiGatePage /></RoleGuard>} />
            <Route path="/governance/sla-policy" element={<RoleGuard allowedRoles={['governance_head']}><GovernanceSlaPolicyPage /></RoleGuard>} />
            <Route path="/governance/service-performance" element={<RoleGuard allowedRoles={['governance_head']}><GovernanceServicePerformancePage /></RoleGuard>} />
            <Route path="/governance/recurring-issues" element={<RoleGuard allowedRoles={['governance_head']}><GovernanceRecurringIssuesPage /></RoleGuard>} />
            <Route path="/governance/transparency-policy" element={<RoleGuard allowedRoles={['governance_head']}><GovernanceTransparencyPolicyPage /></RoleGuard>} />
            <Route path="/governance/history" element={<RoleGuard allowedRoles={['governance_head']}><GovernancePolicyHistoryPage /></RoleGuard>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </main>
      </div>

      {/* Mobile Bottom Navigation for Authenticated Citizens */}
      {isAuthenticated && activeRole === 'citizen' && <MobileNav />}

      {/* Public Footer for Non-authenticated Visitors or Citizen Pages */}
      {!isStaffOrAdmin && <PublicFooter />}
      {isStaffOrAdmin && <div className="border-t border-[var(--line)] bg-[var(--paper)] px-5 py-3 text-right text-[10px] text-[var(--muted)]">Developed by <strong className="font-semibold text-[var(--ink)]">Istiaq Arafat</strong></div>}

      {/* NagarSetu Service Assistant */}
      <AskSathiDrawer />

      {/* Developer Demo Mode Drawer */}
      <DevDemoDrawer />
    </div>
  );
};

function getRoleRedirect(role: string): string {
  switch (role) {
    case 'ward_desk':
      return '/ward';
    case 'field_officer':
      return '/officer';
    case 'coordinator':
      return '/coordinator';
    case 'governance_head':
      return '/governance';
    case 'admin':
      return '/admin';
    default:
      return '/';
  }
}
