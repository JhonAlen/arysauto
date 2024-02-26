import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwtInterceptor } from '@app/_helpers/jwt.interceptor';
import { ErrorInterceptor } from '@app/_helpers/error.interceptor';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {MatNativeDateModule} from '@angular/material/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';


import { TablesDocumentsComponent } from './tables-documents/tables-documents.component';
import { AdministrationPaymentComponent } from './administration-payment/administration-payment.component';
import { FleetContractManagementRealcoverageComponent } from './fleet-contract-management-realcoverage/fleet-contract-management-realcoverage.component';
import { NotificationRejectionLetterComponent } from './notification-rejection-letter/notification-rejection-letter.component';
import { BatchComponent } from './batch/batch.component';
import { FleetContractIndividualAccessorysComponent } from './fleet-contract-individual-accessorys/fleet-contract-individual-accessorys.component';
import { FleetContractIndividualAccessoryAmountComponent } from './fleet-contract-individual-accessory-amount/fleet-contract-individual-accessory-amount.component';
import { UserBrokersComponent } from './user-brokers/user-brokers.component';
import { BillLoadingServiceOrderComponent } from './bill-loading-service-order/bill-loading-service-order.component';
import { BillLoadingSettlementComponent } from './bill-loading-settlement/bill-loading-settlement.component';
import { AdministrationBillLoadingComponent } from './administration-bill-loading/administration-bill-loading.component';
import { CauseForCancellationComponent } from './cause-for-cancellation/cause-for-cancellation.component';
import { PlanAmountRcvComponent } from './plan-amount-rcv/plan-amount-rcv.component';
import { NumberOfServiceComponent } from './number-of-service/number-of-service.component';
import { PlanValuationApovComponent } from './plan-valuation-apov/plan-valuation-apov.component';
import { PlanValuationExcesoComponent } from './plan-valuation-exceso/plan-valuation-exceso.component';
import { NotificationQuoteRequestIndexComponent } from './notification-quote-request-index/notification-quote-request-index.component';
import { NotificationQuoteRequestDetailComponent } from './notification-quote-request-detail/notification-quote-request-detail.component';
import { ProvidersDocumentsComponent } from './providers-documents/providers-documents.component';
import { ConfigurationClausesComponent } from './configuration-clauses/configuration-clauses.component';
import { ConfigurationObjetivesComponent } from './configuration-objetives/configuration-objetives.component';
import { NotificationSettlementComponent } from './notification-settlement/notification-settlement.component';
import { ModuleComponent } from './module/module.component';
import { PermissionComponent } from './permission/permission.component';
import { CancellationCauseComponent } from './cancellation-cause/cancellation-cause.component';
import { GeneralStatusComponent } from './general-status/general-status.component';
import { DocumentComponent } from './document/document.component';
import { BankComponent } from './bank/bank.component';
import { ProviderBankComponent } from './provider-bank/provider-bank.component';
import { ProviderBrandComponent } from './provider-brand/provider-brand.component';
import { ProviderContactComponent } from './provider-contact/provider-contact.component';
import { ProviderStateComponent } from './provider-state/provider-state.component';
import { ProviderServiceComponent } from './provider-service/provider-service.component';
import { ClientBankComponent } from './client-bank/client-bank.component';
import { ClientAssociateComponent } from './client-associate/client-associate.component';
import { ClientBondComponent } from './client-bond/client-bond.component';
import { ClientContactComponent } from './client-contact/client-contact.component';
import { ClientBrokerComponent } from './client-broker/client-broker.component';
import { ClientDepreciationComponent } from './client-depreciation/client-depreciation.component';
import { ClientRelationshipComponent } from './client-relationship/client-relationship.component';
import { ClientPenaltyComponent } from './client-penalty/client-penalty.component';
import { ClientExcludedProviderComponent } from './client-excluded-provider/client-excluded-provider.component';
import { ClientExcludedModelComponent } from './client-excluded-model/client-excluded-model.component';
import { ProcessModuleComponent } from './process-module/process-module.component';
import { ClientWorkerComponent } from './client-worker/client-worker.component';
import { ClientDocumentComponent } from './client-document/client-document.component';
import { ClientGrouperComponent } from './client-grouper/client-grouper.component';
import { ClientPlanComponent } from './client-plan/client-plan.component';
import { ExtraCoverageVehicleTypeComponent } from './extra-coverage-vehicle-type/extra-coverage-vehicle-type.component';
import { RoadManagementConfigurationVehicleTypeComponent } from './road-management-configuration-vehicle-type/road-management-configuration-vehicle-type.component';
import { FeesRegisterVehicleTypeComponent } from './fees-register-vehicle-type/fees-register-vehicle-type.component';
import { FeesRegisterVehicleTypeIntervalComponent } from './fees-register-vehicle-type-interval/fees-register-vehicle-type-interval.component';
import { QuoteByFleetExtraCoverageComponent } from './quote-by-fleet-extra-coverage/quote-by-fleet-extra-coverage.component';
import { OwnerDocumentComponent } from './owner-document/owner-document.component';
import { OwnerVehicleComponent } from './owner-vehicle/owner-vehicle.component';
import { FleetContractManagementWorkerComponent } from './fleet-contract-management-worker/fleet-contract-management-worker.component';
import { FleetContractManagementOwnerComponent } from './fleet-contract-management-owner/fleet-contract-management-owner.component';
import { FleetContractManagementVehicleComponent } from './fleet-contract-management-vehicle/fleet-contract-management-vehicle.component';
import { FleetContractManagementAccesoryComponent } from './fleet-contract-management-accesory/fleet-contract-management-accesory.component';
import { FleetContractManagementInspectionComponent } from './fleet-contract-management-inspection/fleet-contract-management-inspection.component';
import { FleetContractManagementInspectionImageComponent } from './fleet-contract-management-inspection-image/fleet-contract-management-inspection-image.component';
import { NotificationVehicleComponent } from './notification-vehicle/notification-vehicle.component';
import { NotificationNoteComponent } from './notification-note/notification-note.component';
import { NotificationThirdpartyComponent } from './notification-thirdparty/notification-thirdparty.component';
import { NotificationMaterialDamageComponent } from './notification-material-damage/notification-material-damage.component';
import { NotificationThirdpartyVehicleComponent } from './notification-thirdparty-vehicle/notification-thirdparty-vehicle.component';
import { NotificationSearchReplacementComponent } from './notification-search-replacement/notification-search-replacement.component';
import { NotificationThirdpartyVehicleReplacementComponent } from './notification-thirdparty-vehicle-replacement/notification-thirdparty-vehicle-replacement.component';
import { NotificationTracingComponent } from './notification-tracing/notification-tracing.component';
import { NotificationReplacementComponent } from './notification-replacement/notification-replacement.component';
import { NotificationTypeServiceComponent } from './notification-type-service/notification-type-service.component';
import { NotificationSearchProviderComponent } from './notification-search-provider/notification-search-provider.component';
import { NotificationProviderComponent } from './notification-provider/notification-provider.component';
import { NotificationSearchExistentReplacementComponent } from './notification-search-existent-replacement/notification-search-existent-replacement.component';
import { UserProviderComponent } from './user-provider/user-provider.component';
import { QuoteRequestReplacementComponent } from './quote-request-replacement/quote-request-replacement.component';
import { PlanServiceComponent } from './plan-service/plan-service.component';
import { InsurerContactComponent } from './insurer-contact/insurer-contact.component';
import { PlanInsurerComponent } from './plan-insurer/plan-insurer.component';
import { PlanServiceCoverageComponent } from './plan-service-coverage/plan-service-coverage.component';
import { ClientGrouperBankComponent } from './client-grouper-bank/client-grouper-bank.component';
import { ConsumerPermissionComponent } from './consumer-permission/consumer-permission.component';
import { OwnerVehicleImageComponent } from './owner-vehicle-image/owner-vehicle-image.component';
import { PlanPaymentMethodologyComponent } from './plan-payment-methodology/plan-payment-methodology.component';
import { ClubContractManagementOwnerComponent } from './club-contract-management-owner/club-contract-management-owner.component';
import { ClubContractManagementPaymentVoucherComponent } from './club-contract-management-payment-voucher/club-contract-management-payment-voucher.component';
import { ClubContractManagementVehicleComponent } from './club-contract-management-vehicle/club-contract-management-vehicle.component';
import { ServiceRequestContractComponent } from './service-request-contract/service-request-contract.component';
import { ServiceRequestProviderComponent } from './service-request-provider/service-request-provider.component';
import { ServiceRequestTracingComponent } from './service-request-tracing/service-request-tracing.component';
import { ClubMenuSubMenuComponent } from './club-menu-sub-menu/club-menu-sub-menu.component';
import { ClubRoleMenuComponent } from './club-role-menu/club-role-menu.component';
import { EmailAlertRoleComponent } from './email-alert-role/email-alert-role.component';
import { CollectionOrderFleetContractPaymentComponent } from './collection-order-fleet-contract-payment/collection-order-fleet-contract-payment.component';
import { NotificationQuoteComponent } from './notification-quote/notification-quote.component';
import { NotificationThirdpartyTracingComponent } from './notification-thirdparty-tracing/notification-thirdparty-tracing.component';
import { NotificationServiceOrderComponent } from './notification-service-order/notification-service-order.component';
import { NotificationQuoteServiceOrderComponent } from './notification-quote-service-order/notification-quote-service-order.component';


export function HttpLoaderFactory(http: HttpClient){
  return new TranslateHttpLoader(http, './../assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    TablesDocumentsComponent,
    AdministrationPaymentComponent,
    FleetContractManagementRealcoverageComponent,
    NotificationRejectionLetterComponent,
    BatchComponent,
    FleetContractIndividualAccessorysComponent,
    FleetContractIndividualAccessoryAmountComponent,
    UserBrokersComponent,
    BillLoadingServiceOrderComponent,
    BillLoadingSettlementComponent,
    AdministrationBillLoadingComponent,
    CauseForCancellationComponent,
    PlanAmountRcvComponent,
    NumberOfServiceComponent,
    PlanValuationApovComponent,
    PlanValuationExcesoComponent,
    NotificationQuoteRequestIndexComponent,
    NotificationQuoteRequestDetailComponent,
    ProvidersDocumentsComponent,
    ConfigurationClausesComponent,
    ConfigurationObjetivesComponent,
    NotificationSettlementComponent,
    ModuleComponent,
    PermissionComponent,
    CancellationCauseComponent,
    GeneralStatusComponent,
    DocumentComponent,
    BankComponent,
    ProviderBankComponent,
    ProviderBrandComponent,
    ProviderContactComponent,
    ProviderStateComponent,
    ProviderServiceComponent,
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
    ExtraCoverageVehicleTypeComponent,
    RoadManagementConfigurationVehicleTypeComponent,
    FeesRegisterVehicleTypeComponent,
    FeesRegisterVehicleTypeIntervalComponent,
    QuoteByFleetExtraCoverageComponent,
    OwnerDocumentComponent,
    OwnerVehicleComponent,
    FleetContractManagementWorkerComponent,
    FleetContractManagementOwnerComponent,
    FleetContractManagementVehicleComponent,
    FleetContractManagementAccesoryComponent,
    FleetContractManagementInspectionComponent,
    FleetContractManagementInspectionImageComponent,
    NotificationVehicleComponent,
    NotificationNoteComponent,
    NotificationThirdpartyComponent,
    NotificationMaterialDamageComponent,
    NotificationThirdpartyVehicleComponent,
    NotificationSearchReplacementComponent,
    NotificationThirdpartyVehicleReplacementComponent,
    NotificationTracingComponent,
    NotificationReplacementComponent,
    NotificationTypeServiceComponent,
    NotificationSearchProviderComponent,
    NotificationProviderComponent,
    NotificationSearchExistentReplacementComponent,
    UserProviderComponent,
    QuoteRequestReplacementComponent,
    PlanServiceComponent,
    InsurerContactComponent,
    PlanInsurerComponent,
    PlanServiceCoverageComponent,
    ClientGrouperBankComponent,
    ConsumerPermissionComponent,
    OwnerVehicleImageComponent,
    PlanPaymentMethodologyComponent,
    ClubContractManagementOwnerComponent,
    ClubContractManagementPaymentVoucherComponent,
    ClubContractManagementVehicleComponent,
    ServiceRequestContractComponent,
    ServiceRequestProviderComponent,
    ServiceRequestTracingComponent,
    ClubMenuSubMenuComponent,
    ClubRoleMenuComponent,
    EmailAlertRoleComponent,
    CollectionOrderFleetContractPaymentComponent,
    NotificationQuoteComponent,
    NotificationThirdpartyTracingComponent,
    NotificationServiceOrderComponent,
    NotificationQuoteServiceOrderComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    MatNativeDateModule,
    HttpClientModule,
    AutocompleteLibModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    TranslateModule.forRoot({
      loader:{
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    AgGridModule
  ],
  providers: [
    NgbActiveModal,
      { provide : HTTP_INTERCEPTORS, useClass : ErrorInterceptor, multi : true },
      { provide : HTTP_INTERCEPTORS, useClass : JwtInterceptor, multi : true}
  ],
})
export class PopUpModule { }
