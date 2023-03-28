import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PermissionErrorComponent } from './permission-error/permission-error.component';
import { UserIndexComponent } from './security/user/user-index/user-index.component';
import { UserDetailComponent } from './security/user/user-detail/user-detail.component';
import { RoleIndexComponent } from './security/role/role-index/role-index.component';
import { RoleDetailComponent } from './security/role/role-detail/role-detail.component';
import { GroupIndexComponent } from './security/group/group-index/group-index.component';
import { GroupDetailComponent } from './security/group/group-detail/group-detail.component';
import { DepartmentIndexComponent } from './security/department/department-index/department-index.component';
import { DepartmentDetailComponent } from './security/department/department-detail/department-detail.component';
import { AccesoryIndexComponent } from './tables/accesory/accesory-index/accesory-index.component';
import { AccesoryDetailComponent } from './tables/accesory/accesory-detail/accesory-detail.component';
import { BusinessActivityIndexComponent } from './tables/business-activity/business-activity-index/business-activity-index.component';
import { BusinessActivityDetailComponent } from './tables/business-activity/business-activity-detail/business-activity-detail.component';
import { BankIndexComponent } from './tables/bank/bank-index/bank-index.component';
import { BankDetailComponent } from './tables/bank/bank-detail/bank-detail.component';
import { CategoryIndexComponent } from './tables/category-index/category-index.component';
import { CategoryDetailComponent } from './tables/category-detail/category-detail.component';
import { CancellationCauseIndexComponent } from './tables/cancellation-cause/cancellation-cause-index/cancellation-cause-index.component';
import { CancellationCauseDetailComponent } from './tables/cancellation-cause/cancellation-cause-detail/cancellation-cause-detail.component';
import { CityIndexComponent } from './tables/city/city-index/city-index.component';
import { CityDetailComponent } from './tables/city/city-detail/city-detail.component';
import { ColorIndexComponent } from './tables/color/color-index/color-index.component';
import { ColorDetailComponent } from './tables/color/color-detail/color-detail.component';
import { CompanyIndexComponent } from './tables/company/company-index/company-index.component';
import { CompanyDetailComponent } from './tables/company/company-detail/company-detail.component';
import { DepreciationIndexComponent } from './tables/depreciation/depreciation-index/depreciation-index.component';
import { DepreciationDetailComponent } from './tables/depreciation/depreciation-detail/depreciation-detail.component';
import { DocumentIndexComponent } from './tables/document/document-index/document-index.component';
import { DocumentDetailComponent } from './tables/document/document-detail/document-detail.component';
import { CivilStatusIndexComponent } from './tables/civil-status/civil-status-index/civil-status-index.component';
import { CivilStatusDetailComponent } from './tables/civil-status/civil-status-detail/civil-status-detail.component';
import { StateIndexComponent } from './tables/state/state-index/state-index.component';
import { StateDetailComponent } from './tables/state/state-detail/state-detail.component';
import { GeneralStatusIndexComponent } from './tables/general-status/general-status-index/general-status-index.component';
import { GeneralStatusDetailComponent } from './tables/general-status/general-status-detail/general-status-detail.component';
import { TaxIndexComponent } from './tables/tax/tax-index/tax-index.component';
import { TaxDetailComponent } from './tables/tax/tax-detail/tax-detail.component';
import { BrandIndexComponent } from './tables/brand/brand-index/brand-index.component';
import { BrandDetailComponent } from './tables/brand/brand-detail/brand-detail.component';
import { ModelIndexComponent } from './tables/model/model-index/model-index.component';
import { ModelDetailComponent } from './tables/model/model-detail/model-detail.component';
import { CountryIndexComponent } from './tables/country/country-index/country-index.component';
import { CountryDetailComponent } from './tables/country/country-detail/country-detail.component';
import { RelationshipIndexComponent } from './tables/relationship/relationship-index/relationship-index.component';
import { RelationshipDetailComponent } from './tables/relationship/relationship-detail/relationship-detail.component';
import { PenaltyIndexComponent } from './tables/penalty/penalty-index/penalty-index.component';
import { PenaltyDetailComponent } from './tables/penalty/penalty-detail/penalty-detail.component';
import { ProcessIndexComponent } from './tables/process/process-index/process-index.component';
import { ProcessDetailComponent } from './tables/process/process-detail/process-detail.component';
import { ReplacementIndexComponent } from './tables/replacement/replacement-index/replacement-index.component';
import { ReplacementDetailComponent } from './tables/replacement/replacement-detail/replacement-detail.component';
import { ServiceIndexComponent } from './tables/service/service-index/service-index.component';
import { ServiceDetailComponent } from './tables/service/service-detail/service-detail.component';
import { ServiceDepletionTypeIndexComponent } from './tables/service-depletion-type/service-depletion-type-index/service-depletion-type-index.component';
import { ServiceDepletionTypeDetailComponent } from './tables/service-depletion-type/service-depletion-type-detail/service-depletion-type-detail.component';
import { AssociateTypeIndexComponent } from './tables/associate-type/associate-type-index/associate-type-index.component';
import { AssociateTypeDetailComponent } from './tables/associate-type/associate-type-detail/associate-type-detail.component';
import { BankAccountTypeIndexComponent } from './tables/bank-account-type/bank-account-type-index/bank-account-type-index.component';
import { BankAccountTypeDetailComponent } from './tables/bank-account-type/bank-account-type-detail/bank-account-type-detail.component';
import { DocumentTypeIndexComponent } from './tables/document-type/document-type-index/document-type-index.component';
import { DocumentTypeDetailComponent } from './tables/document-type/document-type-detail/document-type-detail.component';
import { InspectionTypeIndexComponent } from './tables/inspection-type/inspection-type-index/inspection-type-index.component';
import { InspectionTypeDetailComponent } from './tables/inspection-type/inspection-type-detail/inspection-type-detail.component';
import { NotificationTypeIndexComponent } from './tables/notification-type/notification-type-index/notification-type-index.component';
import { NotificationTypeDetailComponent } from './tables/notification-type/notification-type-detail/notification-type-detail.component';
import { PaymentTypeIndexComponent } from './tables/payment-type/payment-type-index/payment-type-index.component';
import { PaymentTypeDetailComponent } from './tables/payment-type/payment-type-detail/payment-type-detail.component';
import { PlanTypeIndexComponent } from './tables/plan-type/plan-type-index/plan-type-index.component';
import { PlanTypeDetailComponent } from './tables/plan-type/plan-type-detail/plan-type-detail.component';
import { ReplacementTypeIndexComponent } from './tables/replacement-type/replacement-type-index/replacement-type-index.component';
import { ReplacementTypeDetailComponent } from './tables/replacement-type/replacement-type-detail/replacement-type-detail.component';
import { ServiceTypeIndexComponent } from './tables/service-type/service-type-index/service-type-index.component';
import { ServiceTypeDetailComponent } from './tables/service-type/service-type-detail/service-type-detail.component';
import { TransmissionTypeIndexComponent } from './tables/transmission-type/transmission-type-index/transmission-type-index.component';
import { TransmissionTypeDetailComponent } from './tables/transmission-type/transmission-type-detail/transmission-type-detail.component';
import { VehicleTypeIndexComponent } from './tables/vehicle-type/vehicle-type-index/vehicle-type-index.component';
import { VehicleTypeDetailComponent } from './tables/vehicle-type/vehicle-type-detail/vehicle-type-detail.component';
import { VersionIndexComponent } from './tables/version/version-index/version-index.component';
import { VersionDetailComponent } from './tables/version/version-detail/version-detail.component';
import { ConfigurationProcessIndexComponent } from './configuration/process/configuration-process-index/configuration-process-index.component';
import { ConfigurationProcessDetailComponent } from './configuration/process/configuration-process-detail/configuration-process-detail.component';
import { TaxConfigurationIndexComponent } from './configuration/tax-configuration/tax-configuration-index/tax-configuration-index.component';
import { TaxConfigurationDetailComponent } from './configuration/tax-configuration/tax-configuration-detail/tax-configuration-detail.component';
import { AssociateIndexComponent } from './thirdparties/associate/associate-index/associate-index.component';
import { AssociateDetailComponent } from './thirdparties/associate/associate-detail/associate-detail.component';
import { BrokerIndexComponent } from './thirdparties/broker/broker-index/broker-index.component';
import { BrokerDetailComponent } from './thirdparties/broker/broker-detail/broker-detail.component';
import { EnterpriseIndexComponent } from './thirdparties/enterprise/enterprise-index/enterprise-index.component';
import { EnterpriseDetailComponent } from './thirdparties/enterprise/enterprise-detail/enterprise-detail.component';
import { ProviderIndexComponent } from './providers/provider/provider-index/provider-index.component';
import { ProviderDetailComponent } from './providers/provider/provider-detail/provider-detail.component';
import { ClientIndexComponent } from './clients/client/client-index/client-index.component';
import { ClientDetailComponent } from './clients/client/client-detail/client-detail.component';
import { ClientDetailV2Component } from './clients/client/client-detail-v2/client-detail-v2.component';
import { CoverageIndexComponent } from './tables/coverage/coverage-index/coverage-index.component';
import { CoverageDetailComponent } from './tables/coverage/coverage-detail/coverage-detail.component';
import { CoverageConceptIndexComponent } from './tables/coverage-concept/coverage-concept-index/coverage-concept-index.component';
import { CoverageConceptDetailComponent } from './tables/coverage-concept/coverage-concept-detail/coverage-concept-detail.component';
import { ExtraCoverageIndexComponent } from './quotation/extra-coverage/extra-coverage-index/extra-coverage-index.component';
import { ExtraCoverageDetailComponent } from './quotation/extra-coverage/extra-coverage-detail/extra-coverage-detail.component';
import { RoadManagementConfigurationIndexComponent } from './quotation/road-management-configuration/road-management-configuration-index/road-management-configuration-index.component';
import { RoadManagementConfigurationDetailComponent } from './quotation/road-management-configuration/road-management-configuration-detail/road-management-configuration-detail.component';
import { FeesRegisterIndexComponent } from './quotation/fees-register/fees-register-index/fees-register-index.component';
import { FeesRegisterDetailComponent } from './quotation/fees-register/fees-register-detail/fees-register-detail.component';
import { QuoteByFleetIndexComponent } from './quotation/quote-by-fleet/quote-by-fleet-index/quote-by-fleet-index.component';
import { QuoteByFleetDetailComponent } from './quotation/quote-by-fleet/quote-by-fleet-detail/quote-by-fleet-detail.component';
import { QuoteByFleetApprovalIndexComponent } from './quotation/quote-by-fleet-approval/quote-by-fleet-approval-index/quote-by-fleet-approval-index.component';
import { QuoteByFleetApprovalDetailComponent } from './quotation/quote-by-fleet-approval/quote-by-fleet-approval-detail/quote-by-fleet-approval-detail.component';
import { OwnerIndexComponent } from './thirdparties/owner/owner-index/owner-index.component';
import { OwnerDetailComponent } from './thirdparties/owner/owner-detail/owner-detail.component';
import { ProficientIndexComponent } from './thirdparties/proficient/proficient-index/proficient-index.component';
import { ProficientDetailComponent } from './thirdparties/proficient/proficient-detail/proficient-detail.component';
import { FleetContractManagementIndexComponent } from './subscription/fleet-contract-management/fleet-contract-management-index/fleet-contract-management-index.component';
import { FleetContractManagementDetailComponent } from './subscription/fleet-contract-management/fleet-contract-management-detail/fleet-contract-management-detail.component';
import { FleetLoadingComponent} from './subscription/fleet-loading/fleet-loading.component';
import { ClaimCauseIndexComponent } from './tables/claim-cause/claim-cause-index/claim-cause-index.component';
import { ClaimCauseDetailComponent } from './tables/claim-cause/claim-cause-detail/claim-cause-detail.component';
import { DamageLevelIndexComponent } from './tables/damage-level/damage-level-index/damage-level-index.component';
import { DamageLevelDetailComponent } from './tables/damage-level/damage-level-detail/damage-level-detail.component';
import { MaterialDamageIndexComponent } from './tables/material-damage/material-damage-index/material-damage-index.component';
import { MaterialDamageDetailComponent } from './tables/material-damage/material-damage-detail/material-damage-detail.component';
import { NotificationIndexComponent } from './events/notification/notification-index/notification-index.component';
import { NotificationDetailComponent } from './events/notification/notification-detail/notification-detail.component';
import { TracingTypeIndexComponent } from './tables/tracing-type/tracing-type-index/tracing-type-index.component';
import { TracingTypeDetailComponent } from './tables/tracing-type/tracing-type-detail/tracing-type-detail.component';
import { TracingMotiveIndexComponent } from './tables/tracing-motive/tracing-motive-index/tracing-motive-index.component';
import { TracingMotiveDetailComponent } from './tables/tracing-motive/tracing-motive-detail/tracing-motive-detail.component';
import { ConfigurationNotificationTypeIndexComponent } from './configuration/notification-type/configuration-notification-type-index/configuration-notification-type-index.component';
import { ConfigurationNotificationTypeDetailComponent } from './configuration/notification-type/configuration-notification-type-detail/configuration-notification-type-detail.component';
import { QuoteRequestIndexComponent } from './providers/quote-request/quote-request-index/quote-request-index.component';
import { QuoteRequestDetailComponent } from './providers/quote-request/quote-request-detail/quote-request-detail.component';
import { PlanIndexComponent } from './products/plan/plan-index/plan-index.component';
import { PlanDetailComponent } from './products/plan/plan-detail/plan-detail.component';
import { InsurerIndexComponent } from './thirdparties/insurer/insurer-index/insurer-index.component';
import { InsurerDetailComponent } from './thirdparties/insurer/insurer-detail/insurer-detail.component';
import { ConsumerIndexComponent } from './api/consumer/consumer-index/consumer-index.component';
import { ConsumerDetailComponent } from './api/consumer/consumer-detail/consumer-detail.component';
import { ImageIndexComponent } from './tables/image/image-index/image-index.component';
import { ImageDetailComponent } from './tables/image/image-detail/image-detail.component';
import { PaymentMethodologyIndexComponent } from './tables/payment-methodology/payment-methodology-index/payment-methodology-index.component';
import { PaymentMethodologyDetailComponent } from './tables/payment-methodology/payment-methodology-detail/payment-methodology-detail.component';
import { ClubContractManagementIndexComponent } from './subscription/club-contract-management/club-contract-management-index/club-contract-management-index.component';
import { ClubContractManagementDetailComponent } from './subscription/club-contract-management/club-contract-management-detail/club-contract-management-detail.component';
import { ServiceRequestIndexComponent } from './events/service-request/service-request-index/service-request-index.component';
import { ServiceRequestDetailComponent } from './events/service-request/service-request-detail/service-request-detail.component';
import { ClubMenuIndexComponent } from './api/club-menu/club-menu-index/club-menu-index.component';
import { ClubMenuDetailComponent } from './api/club-menu/club-menu-detail/club-menu-detail.component';
import { ClubRoleIndexComponent } from './api/club-role/club-role-index/club-role-index.component';
import { ClubRoleDetailComponent } from './api/club-role/club-role-detail/club-role-detail.component';
import { EmailAlertIndexComponent } from './alerts/email-alert/email-alert-index/email-alert-index.component';
import { EmailAlertDetailComponent } from './alerts/email-alert/email-alert-detail/email-alert-detail.component';
import { TracingIndexComponent } from './business/tracing/tracing-index/tracing-index.component';
import { CollectionOrderFleetContractIndexComponent } from './administration/collection-order-fleet-contract/collection-order-fleet-contract-index/collection-order-fleet-contract-index.component';
import { CollectionOrderFleetContractDetailComponent } from './administration/collection-order-fleet-contract/collection-order-fleet-contract-detail/collection-order-fleet-contract-detail.component';
import { ProviderReportIndexComponent } from './reports/provider/provider-report-index/provider-report-index.component';
import { ServiceOrderIndexComponent } from './events/service-order/service-order-index/service-order-index.component';
import { ServiceOrderDetailComponent } from './events/service-order/service-order-detail/service-order-detail.component';
import { ClausesIndexComponent } from './configuration/clauses/clauses-index/clauses-index.component';
import { ClausesDetailComponent } from './configuration/clauses/clauses-detail/clauses-detail.component';
import { CollectionsIndexComponent } from './tables/collections/collections-index/collections-index.component';
import { CollectionsDetailComponent } from './tables/collections/collections-detail/collections-detail.component';
import { AuthGuard } from './_helpers/auth.guard';
import { SessionGuard } from './_helpers/session.guard';
import { SignInComponent } from './sign-in/sign-in.component';
import { AdminLayoutComponent } from './club/layouts/admin-layout/admin-layout.component';
import { RegisterComponent } from './club/register/register.component';
import { InicioComponent } from './club/pages-statics/inicio/inicio.component';
import { ContactComponent } from './club/pages-statics/contact/contact.component';
import { QsomosComponent } from './club/pages-statics/qsomos/qsomos.component';
import { PlanesComponent } from './club/pages-statics/planes/planes.component';
import { ServicesComponent } from './club/pages-statics/services/services.component';
import { DashboardComponent } from './club/dashboard/dashboard.component';
import { ServicesInsurersIndexComponent } from './tables/services-insurers/services-insurers-index/services-insurers-index.component';
import { ServicesInsurersDetailComponent } from './tables/services-insurers/services-insurers-detail/services-insurers-detail.component';
import { CollectionIndexComponent } from './administration/collection/collection-index/collection-index.component';
import { CollectionDetailComponent } from './administration/collection/collection-detail/collection-detail.component';
import { PlanRcvIndexComponent } from './products/plan-rcv/plan-rcv-index/plan-rcv-index.component';
import { PlanRcvDetailComponent } from './products/plan-rcv/plan-rcv-detail/plan-rcv-detail.component';
import { FleetContractIndividualDetailComponent } from './subscription/fleet-contract-individual/fleet-contract-individual-detail/fleet-contract-individual-detail.component';
import { ReceiptGenerationComponent } from './subscription/fleet-contract-individual/receipt-generation/receipt-generation.component'
import { ParentPolicyIndexComponent } from './subscription/parent-policy/parent-policy-index/parent-policy-index.component';
import { ParentPolicyDetailComponent } from './subscription/parent-policy/parent-policy-detail/parent-policy-detail.component';
import { PaymentRecordIndexComponent } from './administration/payment-record/payment-record-index/payment-record-index.component';
import { PaymentRecordDetailComponent } from './administration/payment-record/payment-record-detail/payment-record-detail.component'
import { BillLoadingComponent } from './administration/bill-loading/bill-loading.component'
import { FleetContractBrokerDetailComponent } from './subscription/fleet-contract-broker/fleet-contract-broker-detail/fleet-contract-broker-detail.component';
import { BrandModelVersionIndexComponent } from './tables/brand-model-version/brand-model-version-index/brand-model-version-index.component';
import { BrandModelVersionDetailComponent } from './tables/brand-model-version/brand-model-version-detail/brand-model-version-detail.component';
import { ExchangeRateIndexComponent } from './administration/exchange-rate/exchange-rate-index/exchange-rate-index.component';
import { ExchangeRateDetailComponent } from './administration/exchange-rate/exchange-rate-detail/exchange-rate-detail.component';
import { PolicyCancellationsComponent } from './subscription/policy-cancellations/policy-cancellations.component';
import { TakersIndexComponent } from './configuration/takers/takers-index/takers-index.component';
import { TakersDetailComponent } from './configuration/takers/takers-detail/takers-detail.component';
import { PendingPaymentsComponent } from './business/pending-payments/pending-payments.component';
import { FleetContractQuotesIndexComponent } from './subscription/fleet-contract-quotes/fleet-contract-quotes-index/fleet-contract-quotes-index.component';
import { FleetContractQuotesDetailComponent } from './subscription/fleet-contract-quotes/fleet-contract-quotes-detail/fleet-contract-quotes-detail.component';
import { ContractServiceArysIndexComponent } from './subscription/contract-service-arys/contract-service-arys-index/contract-service-arys-index.component';
import { ContractServiceArysDetailComponent } from './subscription/contract-service-arys/contract-service-arys-detail/contract-service-arys-detail.component';
import { CorporativeIssuanceComponent } from './subscription/corporative-issuance/corporative-issuance.component';
import { ReportsComponent } from './administration/reports/reports.component';
import { ContractServiceArysAdministrationComponent } from './subscription/contract-service-arys-administration/contract-service-arys-administration.component';
import { InclusionContractComponent } from './subscription/inclusion-contract/inclusion-contract.component';


const routes: Routes = [
 
  { path: '', redirectTo: '/inicio', pathMatch: 'full'}, 
  { path: 'inicio', component: InicioComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'qsomos', component: QsomosComponent},
  { path: 'planes', component: PlanesComponent},
  { path: 'service', component: ServicesComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'dasboard', component: DashboardComponent },
  { path: 'sign-in', component: SignInComponent },

  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]  },
  {path: '',component: AdminLayoutComponent, children: [{ path: '', loadChildren: () => import('./club/layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule) }] },

  { path: 'change-password/:id', component: ChangePasswordComponent, canActivate: [SessionGuard]  },
  { path: 'permission-error', component: PermissionErrorComponent, canActivate: [AuthGuard]  },
  { path: 'security/user-index', component: UserIndexComponent, canActivate: [AuthGuard] },
  { path: 'security/user-detail', component: UserDetailComponent, canActivate: [AuthGuard] },
  { path: 'security/user-detail/:id', component: UserDetailComponent, canActivate: [AuthGuard] },
  { path: 'security/role-index', component: RoleIndexComponent, canActivate: [AuthGuard] },
  { path: 'security/role-detail', component: RoleDetailComponent, canActivate: [AuthGuard] },
  { path: 'security/role-detail/:id', component: RoleDetailComponent, canActivate: [AuthGuard] },
  { path: 'security/group-index', component: GroupIndexComponent, canActivate: [AuthGuard] },
  { path: 'security/group-detail', component: GroupDetailComponent, canActivate: [AuthGuard] },
  { path: 'security/group-detail/:id', component: GroupDetailComponent, canActivate: [AuthGuard] },
  { path: 'security/department-index', component: DepartmentIndexComponent, canActivate: [AuthGuard] },
  { path: 'security/department-detail', component: DepartmentDetailComponent, canActivate: [AuthGuard] },
  { path: 'security/department-detail/:id', component: DepartmentDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/accesory-index', component: AccesoryIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/accesory-detail', component: AccesoryDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/accesory-detail/:id', component: AccesoryDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/business-activity-index', component: BusinessActivityIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/business-activity-detail', component: BusinessActivityDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/business-activity-detail/:id', component: BusinessActivityDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/bank-index', component: BankIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/bank-detail', component: BankDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/bank-detail/:id', component: BankDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/category-index', component: CategoryIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/category-detail', component: CategoryDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/category-detail/:id', component: CategoryDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/cancellation-cause-index', component: CancellationCauseIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/cancellation-cause-detail', component: CancellationCauseDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/cancellation-cause-detail/:id', component: CancellationCauseDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/city-index', component: CityIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/city-detail', component: CityDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/city-detail/:id', component: CityDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/color-index', component: ColorIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/color-detail', component: ColorDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/color-detail/:id', component: ColorDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/company-index', component: CompanyIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/company-detail', component: CompanyDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/company-detail/:id', component: CompanyDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/depreciation-index', component: DepreciationIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/depreciation-detail', component: DepreciationDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/depreciation-detail/:id', component: DepreciationDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/document-index', component: DocumentIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/document-detail', component: DocumentDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/document-detail/:id', component: DocumentDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/civil-status-index', component: CivilStatusIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/civil-status-detail', component: CivilStatusDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/civil-status-detail/:id', component: CivilStatusDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/state-index', component: StateIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/state-detail', component: StateDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/state-detail/:id', component: StateDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/general-status-index', component: GeneralStatusIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/general-status-detail', component: GeneralStatusDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/general-status-detail/:id', component: GeneralStatusDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/tax-index', component: TaxIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/tax-detail', component: TaxDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/tax-detail/:id', component: TaxDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/brand-index', component: BrandIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/brand-detail', component: BrandDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/brand-detail/:id', component: BrandDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/model-index', component: ModelIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/model-detail', component: ModelDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/model-detail/:id', component: ModelDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/country-index', component: CountryIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/country-detail', component: CountryDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/country-detail/:id', component: CountryDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/relationship-index', component: RelationshipIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/relationship-detail', component: RelationshipDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/relationship-detail/:id', component: RelationshipDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/penalty-index', component: PenaltyIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/penalty-detail', component: PenaltyDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/penalty-detail/:id', component: PenaltyDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/process-index', component: ProcessIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/process-detail', component: ProcessDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/process-detail/:id', component: ProcessDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/replacement-index', component: ReplacementIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/replacement-detail', component: ReplacementDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/replacement-detail/:id', component: ReplacementDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/service-index', component: ServiceIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/service-detail', component: ServiceDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/service-detail/:id', component: ServiceDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/services-insurers-index', component: ServicesInsurersIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/services-insurers-detail', component: ServicesInsurersDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/services-insurers-detail/:id', component: ServicesInsurersDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/service-depletion-type-index', component: ServiceDepletionTypeIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/service-depletion-type-detail', component: ServiceDepletionTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/service-depletion-type-detail/:id', component: ServiceDepletionTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/associate-type-index', component: AssociateTypeIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/associate-type-detail', component: AssociateTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/associate-type-detail/:id', component: AssociateTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/bank-account-type-index', component: BankAccountTypeIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/bank-account-type-detail', component: BankAccountTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/bank-account-type-detail/:id', component: BankAccountTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/document-type-index', component: DocumentTypeIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/document-type-detail', component: DocumentTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/document-type-detail/:id', component: DocumentTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/inspection-type-index', component: InspectionTypeIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/inspection-type-detail', component: InspectionTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/inspection-type-detail/:id', component: InspectionTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/notification-type-index', component: NotificationTypeIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/notification-type-detail', component: NotificationTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/notification-type-detail/:id', component: NotificationTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/payment-type-index', component: PaymentTypeIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/payment-type-detail', component: PaymentTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/payment-type-detail/:id', component: PaymentTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/plan-type-index', component: PlanTypeIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/plan-type-detail', component: PlanTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/plan-type-detail/:id', component: PlanTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/replacement-type-index', component: ReplacementTypeIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/replacement-type-detail', component: ReplacementTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/replacement-type-detail/:id', component: ReplacementTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/service-type-index', component: ServiceTypeIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/service-type-detail', component: ServiceTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/service-type-detail/:id', component: ServiceTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/transmission-type-index', component: TransmissionTypeIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/transmission-type-detail', component: TransmissionTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/transmission-type-detail/:id', component: TransmissionTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/vehicle-type-index', component: VehicleTypeIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/vehicle-type-detail', component: VehicleTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/vehicle-type-detail/:id', component: VehicleTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/version-index', component: VersionIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/version-detail', component: VersionDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/version-detail/:id', component: VersionDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/collections-index', component: CollectionsIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/collections-detail', component: CollectionsDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/collections-detail/:id', component: CollectionsDetailComponent, canActivate: [AuthGuard] },
  { path: 'configuration/configuration-process-index', component: ConfigurationProcessIndexComponent, canActivate: [AuthGuard] },
  { path: 'configuration/configuration-process-detail', component: ConfigurationProcessDetailComponent, canActivate: [AuthGuard] },
  { path: 'configuration/configuration-process-detail/:id', component: ConfigurationProcessDetailComponent, canActivate: [AuthGuard] },
  { path: 'configuration/tax-configuration-index', component: TaxConfigurationIndexComponent, canActivate: [AuthGuard] },
  { path: 'configuration/tax-configuration-detail', component: TaxConfigurationDetailComponent, canActivate: [AuthGuard] },
  { path: 'configuration/tax-configuration-detail/:id', component: TaxConfigurationDetailComponent, canActivate: [AuthGuard] },
  { path: 'configuration/clauses-index', component: ClausesIndexComponent, canActivate: [AuthGuard] },
  { path: 'configuration/clauses-detail', component: ClausesDetailComponent, canActivate: [AuthGuard] },
  { path: 'configuration/clauses-detail/:id', component: ClausesDetailComponent, canActivate: [AuthGuard] },
  { path: 'thirdparties/associate-index', component: AssociateIndexComponent, canActivate: [AuthGuard] },
  { path: 'thirdparties/associate-detail', component: AssociateDetailComponent, canActivate: [AuthGuard] },
  { path: 'thirdparties/associate-detail/:id', component: AssociateDetailComponent, canActivate: [AuthGuard] },
  { path: 'thirdparties/broker-index', component: BrokerIndexComponent, canActivate: [AuthGuard] },
  { path: 'thirdparties/broker-detail', component: BrokerDetailComponent, canActivate: [AuthGuard] },
  { path: 'thirdparties/broker-detail/:id', component: BrokerDetailComponent, canActivate: [AuthGuard] },
  { path: 'thirdparties/enterprise-index', component: EnterpriseIndexComponent, canActivate: [AuthGuard] },
  { path: 'thirdparties/enterprise-detail', component: EnterpriseDetailComponent, canActivate: [AuthGuard] },
  { path: 'thirdparties/enterprise-detail/:id', component: EnterpriseDetailComponent, canActivate: [AuthGuard] },
  { path: 'providers/provider-index', component: ProviderIndexComponent, canActivate: [AuthGuard] },
  { path: 'providers/provider-detail', component: ProviderDetailComponent, canActivate: [AuthGuard] },
  { path: 'providers/provider-detail/:id', component: ProviderDetailComponent, canActivate: [AuthGuard] },
  { path: 'clients/client-index', component: ClientIndexComponent, canActivate: [AuthGuard] },
  { path: 'clients/client-detail-v2', component: ClientDetailV2Component, canActivate: [AuthGuard] },
  { path: 'clients/client-detail-v2/:id', component: ClientDetailV2Component, canActivate: [AuthGuard] },
  { path: 'tables/coverage-index', component: CoverageIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/coverage-detail', component: CoverageDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/coverage-detail/:id', component: CoverageDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/coverage-concept-index', component: CoverageConceptIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/coverage-concept-detail', component: CoverageConceptDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/coverage-concept-detail/:id', component: CoverageConceptDetailComponent, canActivate: [AuthGuard] },
  { path: 'quotation/extra-coverage-index', component: ExtraCoverageIndexComponent, canActivate: [AuthGuard] },
  { path: 'quotation/extra-coverage-detail', component: ExtraCoverageDetailComponent, canActivate: [AuthGuard] },
  { path: 'quotation/extra-coverage-detail/:id', component: ExtraCoverageDetailComponent, canActivate: [AuthGuard] },
  { path: 'quotation/road-management-configuration-index', component: RoadManagementConfigurationIndexComponent, canActivate: [AuthGuard] },
  { path: 'quotation/road-management-configuration-detail', component: RoadManagementConfigurationDetailComponent, canActivate: [AuthGuard] },
  { path: 'quotation/road-management-configuration-detail/:id', component: RoadManagementConfigurationDetailComponent, canActivate: [AuthGuard] },
  { path: 'quotation/fees-register-index', component: FeesRegisterIndexComponent, canActivate: [AuthGuard] },
  { path: 'quotation/fees-register-detail', component: FeesRegisterDetailComponent, canActivate: [AuthGuard] },
  { path: 'quotation/fees-register-detail/:id', component: FeesRegisterDetailComponent, canActivate: [AuthGuard] },
  { path: 'quotation/quote-by-fleet-index', component: QuoteByFleetIndexComponent, canActivate: [AuthGuard] },
  { path: 'quotation/quote-by-fleet-detail', component: QuoteByFleetDetailComponent, canActivate: [AuthGuard] },
  { path: 'quotation/quote-by-fleet-detail/:id', component: QuoteByFleetDetailComponent, canActivate: [AuthGuard] },
  { path: 'quotation/quote-by-fleet-approval-index', component: QuoteByFleetApprovalIndexComponent, canActivate: [AuthGuard] },
  { path: 'quotation/quote-by-fleet-approval-detail', component: QuoteByFleetApprovalDetailComponent, canActivate: [AuthGuard] },
  { path: 'quotation/quote-by-fleet-approval-detail/:id', component: QuoteByFleetApprovalDetailComponent, canActivate: [AuthGuard] },
  { path: 'thirdparties/owner-index', component: OwnerIndexComponent, canActivate: [AuthGuard] },
  { path: 'thirdparties/owner-detail', component: OwnerDetailComponent, canActivate: [AuthGuard] },
  { path: 'thirdparties/owner-detail/:id', component: OwnerDetailComponent, canActivate: [AuthGuard] },
  { path: 'thirdparties/proficient-index', component: ProficientIndexComponent, canActivate: [AuthGuard] },
  { path: 'thirdparties/proficient-detail', component: ProficientDetailComponent, canActivate: [AuthGuard] },
  { path: 'thirdparties/proficient-detail/:id', component: ProficientDetailComponent, canActivate: [AuthGuard] },
  { path: 'subscription/fleet-contract-management-detail', component: FleetContractManagementDetailComponent, canActivate: [AuthGuard] },
  { path: 'subscription/fleet-contract-management-detail/:id', component: FleetContractManagementDetailComponent, canActivate: [AuthGuard] },
  { path: 'subscription/fleet-loading', component: FleetLoadingComponent, canActivate: [AuthGuard] },
  { path: 'tables/claim-cause-index', component: ClaimCauseIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/claim-cause-detail', component: ClaimCauseDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/claim-cause-detail/:id', component: ClaimCauseDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/damage-level-index', component: DamageLevelIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/damage-level-detail', component: DamageLevelDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/damage-level-detail/:id', component: DamageLevelDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/material-damage-index', component: MaterialDamageIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/material-damage-detail', component: MaterialDamageDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/material-damage-detail/:id', component: MaterialDamageDetailComponent, canActivate: [AuthGuard] },
  { path: 'events/notification-index', component: NotificationIndexComponent, canActivate: [AuthGuard] },
  { path: 'events/notification-detail', component: NotificationDetailComponent, canActivate: [AuthGuard] },
  { path: 'subscription/fleet-contract-individual-detail', component: FleetContractIndividualDetailComponent, canActivate: [AuthGuard] },
  { path: 'subscription/parent-policy-index', component: ParentPolicyIndexComponent, canActivate: [AuthGuard] },
  { path: 'subscription/parent-policy-detail', component: ParentPolicyDetailComponent, canActivate: [AuthGuard] },
  { path: 'subscription/parent-policy-detail/:id', component: ParentPolicyDetailComponent, canActivate: [AuthGuard] },
  { path: 'events/notification-detail/:id', component: NotificationDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/tracing-type-index', component: TracingTypeIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/tracing-type-detail', component: TracingTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/tracing-type-detail/:id', component: TracingTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/tracing-motive-index', component: TracingMotiveIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/tracing-motive-detail', component: TracingMotiveDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/tracing-motive-detail/:id', component: TracingMotiveDetailComponent, canActivate: [AuthGuard] },
  { path: 'configuration/configuration-notification-type-index', component: ConfigurationNotificationTypeIndexComponent, canActivate: [AuthGuard] },
  { path: 'configuration/configuration-notification-type-detail', component: ConfigurationNotificationTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'configuration/configuration-notification-type-detail/:id', component: ConfigurationNotificationTypeDetailComponent, canActivate: [AuthGuard] },
  { path: 'providers/quote-request-index', component: QuoteRequestIndexComponent, canActivate: [AuthGuard] },
  { path: 'providers/quote-request-detail', component: QuoteRequestDetailComponent, canActivate: [AuthGuard] },
  { path: 'providers/quote-request-detail/:id', component: QuoteRequestDetailComponent, canActivate: [AuthGuard] },
  { path: 'products/plan-index', component: PlanIndexComponent, canActivate: [AuthGuard] },
  { path: 'products/plan-detail', component: PlanDetailComponent, canActivate: [AuthGuard] },
  { path: 'products/plan-detail/:id', component: PlanDetailComponent, canActivate: [AuthGuard] },
  { path: 'thirdparties/insurer-index', component: InsurerIndexComponent, canActivate: [AuthGuard] },
  { path: 'thirdparties/insurer-detail', component: InsurerDetailComponent, canActivate: [AuthGuard] },
  { path: 'thirdparties/insurer-detail/:id', component: InsurerDetailComponent, canActivate: [AuthGuard] },
  { path: 'api/consumer-index', component: ConsumerIndexComponent, canActivate: [AuthGuard] },
  { path: 'api/consumer-detail', component: ConsumerDetailComponent, canActivate: [AuthGuard] },
  { path: 'api/consumer-detail/:id', component: ConsumerDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/image-index', component: ImageIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/image-detail', component: ImageDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/image-detail/:id', component: ImageDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/payment-methodology-index', component: PaymentMethodologyIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/payment-methodology-detail', component: PaymentMethodologyDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/payment-methodology-detail/:id', component: PaymentMethodologyDetailComponent, canActivate: [AuthGuard] },
  { path: 'subscription/club-contract-management-index', component: ClubContractManagementIndexComponent, canActivate: [AuthGuard] },
  { path: 'subscription/club-contract-management-detail', component: ClubContractManagementDetailComponent, canActivate: [AuthGuard] },
  { path: 'subscription/club-contract-management-detail/:id', component: ClubContractManagementDetailComponent, canActivate: [AuthGuard] },
  { path: 'events/service-request-index', component: ServiceRequestIndexComponent, canActivate: [AuthGuard] },
  { path: 'events/service-request-detail', component: ServiceRequestDetailComponent, canActivate: [AuthGuard] },
  { path: 'events/service-request-detail/:id', component: ServiceRequestDetailComponent, canActivate: [AuthGuard] },
  { path: 'api/club-menu-index', component: ClubMenuIndexComponent, canActivate: [AuthGuard] },
  { path: 'api/club-menu-detail', component: ClubMenuDetailComponent, canActivate: [AuthGuard] },
  { path: 'api/club-menu-detail/:id', component: ClubMenuDetailComponent, canActivate: [AuthGuard] },
  { path: 'api/club-role-index', component: ClubRoleIndexComponent, canActivate: [AuthGuard] },
  { path: 'api/club-role-detail', component: ClubRoleDetailComponent, canActivate: [AuthGuard] },
  { path: 'api/club-role-detail/:id', component: ClubRoleDetailComponent, canActivate: [AuthGuard] },
  { path: 'alerts/email-alert-index', component: EmailAlertIndexComponent, canActivate: [AuthGuard] },
  { path: 'alerts/email-alert-detail', component: EmailAlertDetailComponent, canActivate: [AuthGuard] },
  { path: 'alerts/email-alert-detail/:id', component: EmailAlertDetailComponent, canActivate: [AuthGuard] },
  { path: 'business/tracing-index', component: TracingIndexComponent, canActivate: [AuthGuard] },
  { path: 'administration/collection-order-fleet-contract-index', component: CollectionOrderFleetContractIndexComponent, canActivate: [AuthGuard] },
  { path: 'administration/collection-order-fleet-contract-detail', component: CollectionOrderFleetContractDetailComponent, canActivate: [AuthGuard] },
  { path: 'administration/collection-order-fleet-contract-detail/:id', component: CollectionOrderFleetContractDetailComponent, canActivate: [AuthGuard] },
  { path: 'reports/provider/provider-report-index', component: ProviderReportIndexComponent, canActivate: [AuthGuard] },
  { path: 'events/service-order-index', component: ServiceOrderIndexComponent, canActivate: [AuthGuard] },
  { path: 'events/service-order-detail', component: ServiceOrderDetailComponent, canActivate: [AuthGuard] },
  { path: 'events/service-order-detail/:id', component: ServiceOrderDetailComponent, canActivate: [AuthGuard] },
  { path: 'administration/collection-index', component: CollectionIndexComponent, canActivate: [AuthGuard] },
  { path: 'administration/collection-detail', component: CollectionDetailComponent, canActivate: [AuthGuard] },
  { path: 'administration/collection-detail/:id', component: CollectionDetailComponent, canActivate: [AuthGuard] },
  { path: 'products/plan-rcv-index', component: PlanRcvIndexComponent, canActivate: [AuthGuard] },
  { path: 'products/plan-rcv-detail', component: PlanRcvDetailComponent, canActivate: [AuthGuard] },
  { path: 'products/plan-rcv-detail/:id', component: PlanRcvDetailComponent, canActivate: [AuthGuard] },
  { path: 'subscription/receipt-generation', component: ReceiptGenerationComponent, canActivate: [AuthGuard]},
  { path: 'administration/payment-record-index', component: PaymentRecordIndexComponent, canActivate: [AuthGuard] },
  { path: 'administration/payment-record-detail', component: PaymentRecordDetailComponent, canActivate: [AuthGuard] },
  { path: 'administration/payment-record-detail/:id', component: PaymentRecordDetailComponent, canActivate: [AuthGuard] },
  { path: 'administration/bill-loading', component: BillLoadingComponent, canActivate: [AuthGuard] },
  { path: 'subscription/fleet-contract-broker-detail', component: FleetContractBrokerDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/brand-model-version-index', component: BrandModelVersionIndexComponent, canActivate: [AuthGuard] },
  { path: 'tables/brand-model-version-detail', component: BrandModelVersionDetailComponent, canActivate: [AuthGuard] },
  { path: 'tables/brand-model-version-detail/:id', component: BrandModelVersionDetailComponent, canActivate: [AuthGuard] },
  { path: 'administration/exchange-rate-index', component: ExchangeRateIndexComponent, canActivate: [AuthGuard] },
  { path: 'administration/exchange-rate-detail', component: ExchangeRateDetailComponent, canActivate: [AuthGuard] },
  { path: 'administration/exchange-rate-detail/:id', component: ExchangeRateDetailComponent, canActivate: [AuthGuard] },
  { path: 'subscription/policy-cancellations', component: PolicyCancellationsComponent, canActivate: [AuthGuard] },
  { path: 'configuration/takers-index', component: TakersIndexComponent, canActivate: [AuthGuard] },
  { path: 'configuration/takers-detail', component: TakersDetailComponent, canActivate: [AuthGuard] },
  { path: 'configuration/takers-detail/:id', component: TakersDetailComponent, canActivate: [AuthGuard] },
  { path: 'business/pending-payments', component: PendingPaymentsComponent, canActivate: [AuthGuard] },
  { path: 'subscription/fleet-contract-quotes-index', component: FleetContractQuotesIndexComponent, canActivate: [AuthGuard] },
  { path: 'subscription/fleet-contract-quotes-detail', component: FleetContractQuotesDetailComponent, canActivate: [AuthGuard] },
  { path: 'subscription/fleet-contract-quotes-detail/:id', component: FleetContractQuotesDetailComponent, canActivate: [AuthGuard] },
  { path: 'subscription/fleet-contract-management-index', component: FleetContractManagementIndexComponent, canActivate: [AuthGuard] },
  { path: 'subscription/contract-service-arys-index', component: ContractServiceArysIndexComponent, canActivate: [AuthGuard] },
  { path: 'subscription/contract-service-arys-detail', component: ContractServiceArysDetailComponent, canActivate: [AuthGuard] },
  { path: 'subscription/contract-service-arys-detail/:id', component: ContractServiceArysDetailComponent, canActivate: [AuthGuard] },
  { path: 'subscription/corporative-issuance', component: CorporativeIssuanceComponent, canActivate: [AuthGuard] },
  { path: 'administration/reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'subscription/contract-service-arys-administration', component: ContractServiceArysAdministrationComponent, canActivate: [AuthGuard] },
  { path: 'subscription/inclusion-contract', component: InclusionContractComponent, canActivate: [AuthGuard] },

  {path: '',component: AdminLayoutComponent, children: [{ path: '', loadChildren: () => import('./club/layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule) }] },
  { path: 'sign-in', component: SignInComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
