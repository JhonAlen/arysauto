import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatNativeDateModule} from '@angular/material/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { JwtInterceptor } from '@app/_helpers/jwt.interceptor';
import { ErrorInterceptor } from '@app/_helpers/error.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SignInComponent } from './sign-in/sign-in.component';
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
import { ModuleComponent } from './pop-up/module/module.component';
import { PermissionComponent } from './pop-up/permission/permission.component';
import { CancellationCauseComponent } from './pop-up/cancellation-cause/cancellation-cause.component';
import { GeneralStatusComponent } from './pop-up/general-status/general-status.component';
import { DocumentComponent } from './pop-up/document/document.component';
import { BankComponent } from './pop-up/bank/bank.component';
import { ProviderIndexComponent } from './providers/provider/provider-index/provider-index.component';
import { ProviderDetailComponent } from './providers/provider/provider-detail/provider-detail.component';
import { ProviderBankComponent } from './pop-up/provider-bank/provider-bank.component';
import { ProviderBrandComponent } from './pop-up/provider-brand/provider-brand.component';
import { ProviderContactComponent } from './pop-up/provider-contact/provider-contact.component';
import { ProviderStateComponent } from './pop-up/provider-state/provider-state.component';
import { ProviderServiceComponent } from './pop-up/provider-service/provider-service.component';
import { ClientIndexComponent } from './clients/client/client-index/client-index.component';
import { ClientDetailComponent } from './clients/client/client-detail/client-detail.component';
import { ClientBankComponent } from './pop-up/client-bank/client-bank.component';
import { ClientAssociateComponent } from './pop-up/client-associate/client-associate.component';
import { ClientBondComponent } from './pop-up/client-bond/client-bond.component';
import { ClientContactComponent } from './pop-up/client-contact/client-contact.component';
import { ClientBrokerComponent } from './pop-up/client-broker/client-broker.component';
import { ClientDepreciationComponent } from './pop-up/client-depreciation/client-depreciation.component';
import { ClientRelationshipComponent } from './pop-up/client-relationship/client-relationship.component';
import { ClientPenaltyComponent } from './pop-up/client-penalty/client-penalty.component';
import { ClientExcludedProviderComponent } from './pop-up/client-excluded-provider/client-excluded-provider.component';
import { ClientExcludedModelComponent } from './pop-up/client-excluded-model/client-excluded-model.component';
import { ProcessModuleComponent } from './pop-up/process-module/process-module.component';
import { ClientWorkerComponent } from './pop-up/client-worker/client-worker.component';
import { ClientDocumentComponent } from './pop-up/client-document/client-document.component';
import { ClientGrouperComponent } from './pop-up/client-grouper/client-grouper.component';
import { ClientPlanComponent } from './pop-up/client-plan/client-plan.component';
import { CoverageIndexComponent } from './tables/coverage/coverage-index/coverage-index.component';
import { CoverageDetailComponent } from './tables/coverage/coverage-detail/coverage-detail.component';
import { CoverageConceptIndexComponent } from './tables/coverage-concept/coverage-concept-index/coverage-concept-index.component';
import { CoverageConceptDetailComponent } from './tables/coverage-concept/coverage-concept-detail/coverage-concept-detail.component';
import { ExtraCoverageIndexComponent } from './quotation/extra-coverage/extra-coverage-index/extra-coverage-index.component';
import { ExtraCoverageDetailComponent } from './quotation/extra-coverage/extra-coverage-detail/extra-coverage-detail.component';
import { ExtraCoverageVehicleTypeComponent } from './pop-up/extra-coverage-vehicle-type/extra-coverage-vehicle-type.component';
import { RoadManagementConfigurationIndexComponent } from './quotation/road-management-configuration/road-management-configuration-index/road-management-configuration-index.component';
import { RoadManagementConfigurationDetailComponent } from './quotation/road-management-configuration/road-management-configuration-detail/road-management-configuration-detail.component';
import { RoadManagementConfigurationVehicleTypeComponent } from './pop-up/road-management-configuration-vehicle-type/road-management-configuration-vehicle-type.component';
import { FeesRegisterIndexComponent } from './quotation/fees-register/fees-register-index/fees-register-index.component';
import { FeesRegisterDetailComponent } from './quotation/fees-register/fees-register-detail/fees-register-detail.component';
import { FeesRegisterVehicleTypeComponent } from './pop-up/fees-register-vehicle-type/fees-register-vehicle-type.component';
import { FeesRegisterVehicleTypeIntervalComponent } from './pop-up/fees-register-vehicle-type-interval/fees-register-vehicle-type-interval.component';
import { QuoteByFleetIndexComponent } from './quotation/quote-by-fleet/quote-by-fleet-index/quote-by-fleet-index.component';
import { QuoteByFleetDetailComponent } from './quotation/quote-by-fleet/quote-by-fleet-detail/quote-by-fleet-detail.component';
import { QuoteByFleetExtraCoverageComponent } from './pop-up/quote-by-fleet-extra-coverage/quote-by-fleet-extra-coverage.component';
import { QuoteByFleetApprovalIndexComponent } from './quotation/quote-by-fleet-approval/quote-by-fleet-approval-index/quote-by-fleet-approval-index.component';
import { QuoteByFleetApprovalDetailComponent } from './quotation/quote-by-fleet-approval/quote-by-fleet-approval-detail/quote-by-fleet-approval-detail.component';
import { OwnerIndexComponent } from './thirdparties/owner/owner-index/owner-index.component';
import { OwnerDetailComponent } from './thirdparties/owner/owner-detail/owner-detail.component';
import { OwnerDocumentComponent } from './pop-up/owner-document/owner-document.component';
import { OwnerVehicleComponent } from './pop-up/owner-vehicle/owner-vehicle.component';
import { ProficientIndexComponent } from './thirdparties/proficient/proficient-index/proficient-index.component';
import { ProficientDetailComponent } from './thirdparties/proficient/proficient-detail/proficient-detail.component';
import { FleetContractManagementIndexComponent } from './subscription/fleet-contract-management/fleet-contract-management-index/fleet-contract-management-index.component';
import { FleetContractManagementDetailComponent } from './subscription/fleet-contract-management/fleet-contract-management-detail/fleet-contract-management-detail.component';
import { ClaimCauseDetailComponent } from './tables/claim-cause/claim-cause-detail/claim-cause-detail.component';
import { ClaimCauseIndexComponent } from './tables/claim-cause/claim-cause-index/claim-cause-index.component';
import { DamageLevelIndexComponent } from './tables/damage-level/damage-level-index/damage-level-index.component';
import { DamageLevelDetailComponent } from './tables/damage-level/damage-level-detail/damage-level-detail.component';
import { MaterialDamageDetailComponent } from './tables/material-damage/material-damage-detail/material-damage-detail.component';
import { MaterialDamageIndexComponent } from './tables/material-damage/material-damage-index/material-damage-index.component';
import { FleetContractManagementWorkerComponent } from './pop-up/fleet-contract-management-worker/fleet-contract-management-worker.component';
import { FleetContractManagementOwnerComponent } from './pop-up/fleet-contract-management-owner/fleet-contract-management-owner.component';
import { FleetContractManagementVehicleComponent } from './pop-up/fleet-contract-management-vehicle/fleet-contract-management-vehicle.component';
import { FleetContractManagementAccesoryComponent } from './pop-up/fleet-contract-management-accesory/fleet-contract-management-accesory.component';
import { FleetContractManagementInspectionComponent } from './pop-up/fleet-contract-management-inspection/fleet-contract-management-inspection.component';
import { FleetContractManagementInspectionImageComponent } from './pop-up/fleet-contract-management-inspection-image/fleet-contract-management-inspection-image.component';
import { NotificationIndexComponent } from './events/notification/notification-index/notification-index.component';
import { NotificationDetailComponent } from './events/notification/notification-detail/notification-detail.component';
import { NotificationVehicleComponent } from './pop-up/notification-vehicle/notification-vehicle.component';
import { NotificationNoteComponent } from './pop-up/notification-note/notification-note.component';
import { NotificationThirdpartyComponent } from './pop-up/notification-thirdparty/notification-thirdparty.component';
import { NotificationMaterialDamageComponent } from './pop-up/notification-material-damage/notification-material-damage.component';
import { NotificationThirdpartyVehicleComponent } from './pop-up/notification-thirdparty-vehicle/notification-thirdparty-vehicle.component';
import { NotificationSearchReplacementComponent } from './pop-up/notification-search-replacement/notification-search-replacement.component';
import { NotificationThirdpartyVehicleReplacementComponent } from './pop-up/notification-thirdparty-vehicle-replacement/notification-thirdparty-vehicle-replacement.component';
import { TracingTypeIndexComponent } from './tables/tracing-type/tracing-type-index/tracing-type-index.component';
import { TracingTypeDetailComponent } from './tables/tracing-type/tracing-type-detail/tracing-type-detail.component';
import { TracingMotiveIndexComponent } from './tables/tracing-motive/tracing-motive-index/tracing-motive-index.component';
import { TracingMotiveDetailComponent } from './tables/tracing-motive/tracing-motive-detail/tracing-motive-detail.component';
import { NotificationTracingComponent } from './pop-up/notification-tracing/notification-tracing.component';
import { ConfigurationNotificationTypeIndexComponent } from './configuration/notification-type/configuration-notification-type-index/configuration-notification-type-index.component';
import { ConfigurationNotificationTypeDetailComponent } from './configuration/notification-type/configuration-notification-type-detail/configuration-notification-type-detail.component';
import { NotificationReplacementComponent } from './pop-up/notification-replacement/notification-replacement.component';
import { NotificationTypeServiceComponent } from './pop-up/notification-type-service/notification-type-service.component';
import { NotificationSearchProviderComponent } from './pop-up/notification-search-provider/notification-search-provider.component';
import { NotificationProviderComponent } from './pop-up/notification-provider/notification-provider.component';
import { NotificationSearchExistentReplacementComponent } from './pop-up/notification-search-existent-replacement/notification-search-existent-replacement.component';
import { UserProviderComponent } from './pop-up/user-provider/user-provider.component';
import { QuoteRequestIndexComponent } from './providers/quote-request/quote-request-index/quote-request-index.component';
import { QuoteRequestDetailComponent } from './providers/quote-request/quote-request-detail/quote-request-detail.component';
import { QuoteRequestReplacementComponent } from './pop-up/quote-request-replacement/quote-request-replacement.component';
import { PlanIndexComponent } from './products/plan/plan-index/plan-index.component';
import { PlanDetailComponent } from './products/plan/plan-detail/plan-detail.component';
import { PlanServiceComponent } from './pop-up/plan-service/plan-service.component';
import { InsurerIndexComponent } from './thirdparties/insurer/insurer-index/insurer-index.component';
import { InsurerDetailComponent } from './thirdparties/insurer/insurer-detail/insurer-detail.component';
import { InsurerContactComponent } from './pop-up/insurer-contact/insurer-contact.component';
import { PlanInsurerComponent } from './pop-up/plan-insurer/plan-insurer.component';
import { PlanServiceCoverageComponent } from './pop-up/plan-service-coverage/plan-service-coverage.component';
import { ClientGrouperBankComponent } from './pop-up/client-grouper-bank/client-grouper-bank.component';
import { ConsumerIndexComponent } from './api/consumer/consumer-index/consumer-index.component';
import { ConsumerDetailComponent } from './api/consumer/consumer-detail/consumer-detail.component';
import { ConsumerPermissionComponent } from './pop-up/consumer-permission/consumer-permission.component';
import { ImageIndexComponent } from './tables/image/image-index/image-index.component';
import { ImageDetailComponent } from './tables/image/image-detail/image-detail.component';
import { OwnerVehicleImageComponent } from './pop-up/owner-vehicle-image/owner-vehicle-image.component';
import { PaymentMethodologyIndexComponent } from './tables/payment-methodology/payment-methodology-index/payment-methodology-index.component';
import { PaymentMethodologyDetailComponent } from './tables/payment-methodology/payment-methodology-detail/payment-methodology-detail.component';
import { PlanPaymentMethodologyComponent } from './pop-up/plan-payment-methodology/plan-payment-methodology.component';
import { ClubContractManagementIndexComponent } from './subscription/club-contract-management/club-contract-management-index/club-contract-management-index.component';
import { ClubContractManagementDetailComponent } from './subscription/club-contract-management/club-contract-management-detail/club-contract-management-detail.component';
import { ClubContractManagementOwnerComponent } from './pop-up/club-contract-management-owner/club-contract-management-owner.component';
import { ClubContractManagementPaymentVoucherComponent } from './pop-up/club-contract-management-payment-voucher/club-contract-management-payment-voucher.component';
import { ClubContractManagementVehicleComponent } from './pop-up/club-contract-management-vehicle/club-contract-management-vehicle.component';
import { ServiceRequestIndexComponent } from './events/service-request/service-request-index/service-request-index.component';
import { ServiceRequestDetailComponent } from './events/service-request/service-request-detail/service-request-detail.component';
import { ServiceRequestContractComponent } from './pop-up/service-request-contract/service-request-contract.component';
import { ServiceRequestProviderComponent } from './pop-up/service-request-provider/service-request-provider.component';
import { ServiceRequestTracingComponent } from './pop-up/service-request-tracing/service-request-tracing.component';
import { ClubMenuIndexComponent } from './api/club-menu/club-menu-index/club-menu-index.component';
import { ClubMenuDetailComponent } from './api/club-menu/club-menu-detail/club-menu-detail.component';
import { ClubMenuSubMenuComponent } from './pop-up/club-menu-sub-menu/club-menu-sub-menu.component';
import { ClubRoleIndexComponent } from './api/club-role/club-role-index/club-role-index.component';
import { ClubRoleDetailComponent } from './api/club-role/club-role-detail/club-role-detail.component';
import { ClubRoleMenuComponent } from './pop-up/club-role-menu/club-role-menu.component';
import { EmailAlertIndexComponent } from './alerts/email-alert/email-alert-index/email-alert-index.component';
import { EmailAlertDetailComponent } from './alerts/email-alert/email-alert-detail/email-alert-detail.component';
import { EmailAlertRoleComponent } from './pop-up/email-alert-role/email-alert-role.component';
import { TracingIndexComponent } from './business/tracing/tracing-index/tracing-index.component';
import { CollectionOrderFleetContractIndexComponent } from './administration/collection-order-fleet-contract/collection-order-fleet-contract-index/collection-order-fleet-contract-index.component';
import { CollectionOrderFleetContractDetailComponent } from './administration/collection-order-fleet-contract/collection-order-fleet-contract-detail/collection-order-fleet-contract-detail.component';
import { CollectionOrderFleetContractPaymentComponent } from './pop-up/collection-order-fleet-contract-payment/collection-order-fleet-contract-payment.component';
import { NotificationQuoteComponent } from './pop-up/notification-quote/notification-quote.component';
import { ProviderReportIndexComponent } from './reports/provider/provider-report-index/provider-report-index.component';
import { NotificationThirdpartyTracingComponent } from './pop-up/notification-thirdparty-tracing/notification-thirdparty-tracing.component';
import { CoinsIndexComponent } from './tables/coins/coins-index/coins-index.component';
import { CoinsDetailComponent } from './tables/coins/coins-detail/coins-detail.component';
import { ServiceOrderIndexComponent } from './events/service-order/service-order-index/service-order-index.component';
import { ServiceOrderDetailComponent } from './events/service-order/service-order-detail/service-order-detail.component';
import { NotificationServiceOrderComponent } from './pop-up/notification-service-order/notification-service-order.component';
import { NotificationQuoteServiceOrderComponent } from './pop-up/notification-quote-service-order/notification-quote-service-order.component';
import { ClausesIndexComponent } from './configuration/clauses/clauses-index/clauses-index.component';
import { ClausesDetailComponent } from './configuration/clauses/clauses-detail/clauses-detail.component';
import { ConfigurationClausesComponent } from './pop-up/configuration-clauses/configuration-clauses.component';
import { ConfigurationObjetivesComponent } from './pop-up/configuration-objetives/configuration-objetives.component';
import { NotificationSettlementComponent } from './pop-up/notification-settlement/notification-settlement.component';
import { CollectionsIndexComponent } from './tables/collections/collections-index/collections-index.component';
import { CollectionsDetailComponent } from './tables/collections/collections-detail/collections-detail.component';
import { AdminLayoutComponent } from './club/layouts/admin-layout/admin-layout.component';
import { RegisterComponent } from './club/register/register.component';
import { ContactComponent } from './club/pages-statics/contact/contact.component';
import { ServicesComponent } from './club/pages-statics/services/services.component';
import { InicioComponent } from './club/pages-statics/inicio/inicio.component';
import { PlanesComponent } from './club/pages-statics/planes/planes.component';
import { QsomosComponent } from './club/pages-statics/qsomos/qsomos.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MaterialExampleModule } from './../material.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TablesDocumentsComponent } from './pop-up/tables-documents/tables-documents.component';
import { ServicesInsurersIndexComponent } from './tables/services-insurers/services-insurers-index/services-insurers-index.component';
import { ServicesInsurersDetailComponent } from './tables/services-insurers/services-insurers-detail/services-insurers-detail.component';
import { FleetLoadingComponent } from './subscription/fleet-loading/fleet-loading.component';
import { CollectionIndexComponent } from './administration/collection/collection-index/collection-index.component';
import { CollectionDetailComponent } from './administration/collection/collection-detail/collection-detail.component';
import { AdministrationPaymentComponent } from './pop-up/administration-payment/administration-payment.component';
import { PlanRcvIndexComponent } from './products/plan-rcv/plan-rcv-index/plan-rcv-index.component';
import { PlanRcvDetailComponent } from './products/plan-rcv/plan-rcv-detail/plan-rcv-detail.component';
import { FleetContractIndividualDetailComponent } from './subscription/fleet-contract-individual/fleet-contract-individual-detail/fleet-contract-individual-detail.component';
import { FleetContractManagementRealcoverageComponent } from './pop-up/fleet-contract-management-realcoverage/fleet-contract-management-realcoverage.component';
import { NotificationRejectionLetterComponent } from './pop-up/notification-rejection-letter/notification-rejection-letter.component';
import { ParentPolicyIndexComponent } from './subscription/parent-policy/parent-policy-index/parent-policy-index.component';
import { ParentPolicyDetailComponent } from './subscription/parent-policy/parent-policy-detail/parent-policy-detail.component';
import { BatchComponent } from './pop-up/batch/batch.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReceiptGenerationComponent } from './subscription/fleet-contract-individual/receipt-generation/receipt-generation.component';
import { FleetContractIndividualAccessorysComponent } from './pop-up/fleet-contract-individual-accessorys/fleet-contract-individual-accessorys.component';
import { FleetContractIndividualAccessoryAmountComponent } from './pop-up/fleet-contract-individual-accessory-amount/fleet-contract-individual-accessory-amount.component';
import { PaymentRecordIndexComponent } from './administration/payment-record/payment-record-index/payment-record-index.component';
import { PaymentRecordDetailComponent } from './administration/payment-record/payment-record-detail/payment-record-detail.component';
import { BillLoadingComponent } from './administration/bill-loading/bill-loading.component'
import {CdkMenuModule} from '@angular/cdk/menu';
import { FleetContractBrokerIndexComponent } from './subscription/fleet-contract-broker/fleet-contract-broker-index/fleet-contract-broker-index.component';
import { FleetContractBrokerDetailComponent } from './subscription/fleet-contract-broker/fleet-contract-broker-detail/fleet-contract-broker-detail.component';
import { UserBrokersComponent } from './pop-up/user-brokers/user-brokers.component';
import { BillLoadingServiceOrderComponent } from './pop-up/bill-loading-service-order/bill-loading-service-order.component';
import { BrandModelVersionIndexComponent } from './tables/brand-model-version/brand-model-version-index/brand-model-version-index.component';
import { BrandModelVersionDetailComponent } from './tables/brand-model-version/brand-model-version-detail/brand-model-version-detail.component';
import { ExchangeRateIndexComponent } from './administration/exchange-rate/exchange-rate-index/exchange-rate-index.component';
import { ExchangeRateDetailComponent } from './administration/exchange-rate/exchange-rate-detail/exchange-rate-detail.component';
import { BillLoadingSettlementComponent } from './pop-up/bill-loading-settlement/bill-loading-settlement.component';
import { AdministrationBillLoadingComponent } from './pop-up/administration-bill-loading/administration-bill-loading.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { PolicyQuotationIndexComponent } from './subscription/policy-quotation/policy-quotation-index/policy-quotation-index.component';
import { PolicyQuotationDetailComponent } from './subscription/policy-quotation/policy-quotation-detail/policy-quotation-detail.component';
import { FooterComponent } from './footer/footer.component';
import { PolicyCancellationsComponent } from './subscription/policy-cancellations/policy-cancellations.component';
import { CauseForCancellationComponent } from './pop-up/cause-for-cancellation/cause-for-cancellation.component';
import { TakersIndexComponent } from './configuration/takers/takers-index/takers-index.component';
import { TakersDetailComponent } from './configuration/takers/takers-detail/takers-detail.component';
import { PendingPaymentsComponent } from './business/pending-payments/pending-payments.component';
import { FleetContractQuotesIndexComponent } from './subscription/fleet-contract-quotes/fleet-contract-quotes-index/fleet-contract-quotes-index.component';
import { FleetContractQuotesDetailComponent } from './subscription/fleet-contract-quotes/fleet-contract-quotes-detail/fleet-contract-quotes-detail.component';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import { PlanAmountRcvComponent } from './pop-up/plan-amount-rcv/plan-amount-rcv.component';
import { ContractServiceArysIndexComponent } from './subscription/contract-service-arys/contract-service-arys-index/contract-service-arys-index.component';
import { ContractServiceArysDetailComponent } from './subscription/contract-service-arys/contract-service-arys-detail/contract-service-arys-detail.component';
import { NumberOfServiceComponent } from './pop-up/number-of-service/number-of-service.component';
import { CorporativeIssuanceComponent } from './subscription/corporative-issuance/corporative-issuance.component';
import { PlanValuationApovComponent } from './pop-up/plan-valuation-apov/plan-valuation-apov.component';
import { PlanValuationExcesoComponent } from './pop-up/plan-valuation-exceso/plan-valuation-exceso.component';
import { ClientDetailV2Component } from './clients/client/client-detail-v2/client-detail-v2.component';
import { IndividualRenovationIndexComponent } from './renovation/individual-renovation/individual-renovation-index/individual-renovation-index.component';
import { IndividualRenovationDetailComponent } from './renovation/individual-renovation/individual-renovation-detail/individual-renovation-detail.component';
import { ReportsComponent } from './administration/reports/reports.component';
import { ContractServiceArysAdministrationComponent } from './subscription/contract-service-arys-administration/contract-service-arys-administration.component';
import { InclusionContractComponent } from './subscription/inclusion-contract/inclusion-contract.component';

export function HttpLoaderFactory(http: HttpClient){
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ToolbarComponent,
    SignInComponent,
    UserIndexComponent,
    UserDetailComponent,
    ChangePasswordComponent,
    RoleIndexComponent,
    RoleDetailComponent,
    GroupIndexComponent,
    GroupDetailComponent,
    DepartmentIndexComponent,
    DepartmentDetailComponent,
    AccesoryIndexComponent,
    AccesoryDetailComponent,
    BusinessActivityIndexComponent,
    BusinessActivityDetailComponent,
    BankIndexComponent,
    BankDetailComponent,
    CategoryIndexComponent,
    CategoryDetailComponent,
    CancellationCauseIndexComponent,
    CancellationCauseDetailComponent,
    CityIndexComponent,
    CityDetailComponent,
    ColorIndexComponent,
    ColorDetailComponent,
    CompanyIndexComponent,
    CompanyDetailComponent,
    DepreciationIndexComponent,
    DepreciationDetailComponent,
    DocumentIndexComponent,
    DocumentDetailComponent,
    CivilStatusIndexComponent,
    CivilStatusDetailComponent,
    StateIndexComponent,
    StateDetailComponent,
    GeneralStatusIndexComponent,
    GeneralStatusDetailComponent,
    TaxIndexComponent,
    TaxDetailComponent,
    BrandIndexComponent,
    BrandDetailComponent,
    ModelIndexComponent,
    ModelDetailComponent,
    CountryIndexComponent,
    CountryDetailComponent,
    RelationshipIndexComponent,
    RelationshipDetailComponent,
    PenaltyIndexComponent,
    PenaltyDetailComponent,
    ProcessIndexComponent,
    ProcessDetailComponent,
    ReplacementIndexComponent,
    ReplacementDetailComponent,
    ServiceIndexComponent,
    ServiceDetailComponent,
    ServiceDepletionTypeIndexComponent,
    ServiceDepletionTypeDetailComponent,
    AssociateTypeIndexComponent,
    AssociateTypeDetailComponent,
    BankAccountTypeIndexComponent,
    BankAccountTypeDetailComponent,
    DocumentTypeIndexComponent,
    DocumentTypeDetailComponent,
    InspectionTypeIndexComponent,
    InspectionTypeDetailComponent,
    NotificationTypeIndexComponent,
    NotificationTypeDetailComponent,
    PaymentTypeIndexComponent,
    PaymentTypeDetailComponent,
    PlanTypeIndexComponent,
    PlanTypeDetailComponent,
    ReplacementTypeIndexComponent,
    ReplacementTypeDetailComponent,
    ServiceTypeIndexComponent,
    ServiceTypeDetailComponent,
    TransmissionTypeIndexComponent,
    TransmissionTypeDetailComponent,
    VehicleTypeIndexComponent,
    VehicleTypeDetailComponent,
    VersionIndexComponent,
    VersionDetailComponent,
    TaxConfigurationIndexComponent,
    TaxConfigurationDetailComponent,
    AssociateIndexComponent,
    AssociateDetailComponent,
    BrokerIndexComponent,
    BrokerDetailComponent,
    EnterpriseIndexComponent,
    EnterpriseDetailComponent,
    PermissionErrorComponent,
    ModuleComponent,
    PermissionComponent,
    ConfigurationProcessIndexComponent,
    ConfigurationProcessDetailComponent,
    CancellationCauseComponent,
    GeneralStatusComponent,
    DocumentComponent,
    BankComponent,
    ProviderIndexComponent,
    ProviderDetailComponent,
    ProviderBankComponent,
    ProviderBrandComponent,
    ProviderContactComponent,
    ProviderStateComponent,
    ProviderServiceComponent,
    ClientIndexComponent,
    ClientDetailComponent,
    ClientBankComponent,
    ClientAssociateComponent,
    ClientBondComponent,
    ClientContactComponent,
    ClientBrokerComponent,
    ClientDepreciationComponent,
    ClientRelationshipComponent,
    ClientPenaltyComponent,
    ClientExcludedProviderComponent,
    ClientExcludedModelComponent,
    ProcessModuleComponent,
    ClientWorkerComponent,
    ClientDocumentComponent,
    ClientGrouperComponent,
    ClientPlanComponent,
    CoverageIndexComponent,
    CoverageDetailComponent,
    CoverageConceptIndexComponent,
    CoverageConceptDetailComponent,
    ExtraCoverageIndexComponent,
    ExtraCoverageDetailComponent,
    ExtraCoverageVehicleTypeComponent,
    RoadManagementConfigurationIndexComponent,
    RoadManagementConfigurationDetailComponent,
    RoadManagementConfigurationVehicleTypeComponent,
    FeesRegisterIndexComponent,
    FeesRegisterDetailComponent,
    FeesRegisterVehicleTypeComponent,
    FeesRegisterVehicleTypeIntervalComponent,
    QuoteByFleetIndexComponent,
    QuoteByFleetDetailComponent,
    QuoteByFleetExtraCoverageComponent,
    QuoteByFleetApprovalIndexComponent,
    QuoteByFleetApprovalDetailComponent,
    OwnerIndexComponent,
    OwnerDetailComponent,
    OwnerDocumentComponent,
    OwnerVehicleComponent,
    ProficientIndexComponent,
    ProficientDetailComponent,
    FleetContractManagementIndexComponent,
    FleetContractManagementDetailComponent,
    ClaimCauseDetailComponent,
    ClaimCauseIndexComponent,
    DamageLevelIndexComponent,
    DamageLevelDetailComponent,
    MaterialDamageDetailComponent,
    MaterialDamageIndexComponent,
    FleetContractManagementWorkerComponent,
    FleetContractManagementOwnerComponent,
    FleetContractManagementVehicleComponent,
    FleetContractManagementAccesoryComponent,
    FleetContractManagementInspectionComponent,
    FleetContractManagementInspectionImageComponent,
    NotificationIndexComponent,
    NotificationDetailComponent,
    NotificationVehicleComponent,
    NotificationNoteComponent,
    NotificationThirdpartyComponent,
    NotificationMaterialDamageComponent,
    NotificationThirdpartyVehicleComponent,
    NotificationSearchReplacementComponent,
    NotificationThirdpartyVehicleReplacementComponent,
    TracingTypeIndexComponent,
    TracingTypeDetailComponent,
    TracingMotiveIndexComponent,
    TracingMotiveDetailComponent,
    NotificationTracingComponent,
    ConfigurationNotificationTypeIndexComponent,
    ConfigurationNotificationTypeDetailComponent,
    NotificationReplacementComponent,
    NotificationTypeServiceComponent,
    NotificationSearchProviderComponent,
    NotificationProviderComponent,
    NotificationSearchExistentReplacementComponent,
    UserProviderComponent,
    QuoteRequestIndexComponent,
    QuoteRequestDetailComponent,
    QuoteRequestReplacementComponent,
    PlanIndexComponent,
    PlanDetailComponent,
    PlanServiceComponent,
    InsurerIndexComponent,
    InsurerDetailComponent,
    InsurerContactComponent,
    PlanInsurerComponent,
    PlanServiceCoverageComponent,
    ClientGrouperBankComponent,
    ConsumerIndexComponent,
    ConsumerDetailComponent,
    ConsumerPermissionComponent,
    ImageIndexComponent,
    ImageDetailComponent,
    OwnerVehicleImageComponent,
    PaymentMethodologyIndexComponent,
    PaymentMethodologyDetailComponent,
    PlanPaymentMethodologyComponent,
    ClubContractManagementIndexComponent,
    ClubContractManagementDetailComponent,
    ClubContractManagementOwnerComponent,
    ClubContractManagementPaymentVoucherComponent,
    ClubContractManagementVehicleComponent,
    ServiceRequestIndexComponent,
    ServiceRequestDetailComponent,
    ServiceRequestContractComponent,
    ServiceRequestProviderComponent,
    ServiceRequestTracingComponent,
    ClubMenuIndexComponent,
    ClubMenuDetailComponent,
    ClubMenuSubMenuComponent,
    ClubRoleIndexComponent,
    ClubRoleDetailComponent,
    ClubRoleMenuComponent,
    EmailAlertIndexComponent,
    EmailAlertDetailComponent,
    EmailAlertRoleComponent,
    TracingIndexComponent,
    CollectionOrderFleetContractIndexComponent,
    CollectionOrderFleetContractDetailComponent,
    CollectionOrderFleetContractPaymentComponent,
    NotificationQuoteComponent,
    ProviderReportIndexComponent,
    NotificationThirdpartyTracingComponent,
    CoinsIndexComponent,
    CoinsDetailComponent,
    ServiceOrderIndexComponent,
    ServiceOrderDetailComponent,
    NotificationServiceOrderComponent,
    NotificationQuoteServiceOrderComponent,
    ClausesIndexComponent,
    ClausesDetailComponent,
    ConfigurationClausesComponent,
    ConfigurationObjetivesComponent,
    NotificationSettlementComponent,
    CollectionsIndexComponent,
    CollectionsDetailComponent,
    AdminLayoutComponent,
    RegisterComponent,
    ContactComponent,
    ServicesComponent,
    InicioComponent,
    PlanesComponent,
    QsomosComponent,
    TablesDocumentsComponent,
    ServicesInsurersIndexComponent,
    ServicesInsurersDetailComponent,
    FleetLoadingComponent,
    CollectionIndexComponent,
    CollectionDetailComponent,
    AdministrationPaymentComponent,
    PlanRcvIndexComponent,
    PlanRcvDetailComponent,
    FleetContractIndividualDetailComponent,
    ReceiptGenerationComponent,
    FleetContractManagementRealcoverageComponent,
    NotificationRejectionLetterComponent,
    ParentPolicyIndexComponent,
    ParentPolicyDetailComponent,
    BatchComponent,
    ReceiptGenerationComponent,
    FleetContractIndividualAccessorysComponent,
    FleetContractIndividualAccessoryAmountComponent,
    PaymentRecordIndexComponent,
    PaymentRecordDetailComponent,
    BillLoadingComponent,
    FleetContractBrokerIndexComponent,
    FleetContractBrokerDetailComponent,
    UserBrokersComponent,
    BillLoadingServiceOrderComponent,
    BrandModelVersionIndexComponent,
    BrandModelVersionDetailComponent,
    ExchangeRateIndexComponent,
    ExchangeRateDetailComponent,
    BillLoadingSettlementComponent,
    AdministrationBillLoadingComponent,
    PolicyQuotationIndexComponent,
    PolicyQuotationDetailComponent,
    FooterComponent,
    PolicyCancellationsComponent,
    CauseForCancellationComponent,
    TakersIndexComponent,
    TakersDetailComponent,
    PendingPaymentsComponent,
    FleetContractQuotesIndexComponent,
    FleetContractQuotesDetailComponent,
    PlanAmountRcvComponent,
    ContractServiceArysIndexComponent,
    ContractServiceArysDetailComponent,
    NumberOfServiceComponent,
    CorporativeIssuanceComponent,
    PlanValuationApovComponent,
    PlanValuationExcesoComponent,
    ClientDetailV2Component,
    IndividualRenovationIndexComponent,
    IndividualRenovationDetailComponent,
    ReportsComponent,
    ContractServiceArysAdministrationComponent,
    InclusionContractComponent
  ],
  imports: [
    BrowserModule,
    NgxChartsModule,
    CdkMenuModule,
    MaterialExampleModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    NgxMatSelectSearchModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    NgbModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    AutocompleteLibModule,
    TranslateModule.forRoot({
      loader:{
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    AgGridModule,
    AppRoutingModule
  ],
  providers: [
    NgbActiveModal,
      { provide : HTTP_INTERCEPTORS, useClass : ErrorInterceptor, multi : true },
      { provide : HTTP_INTERCEPTORS, useClass : JwtInterceptor, multi : true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
