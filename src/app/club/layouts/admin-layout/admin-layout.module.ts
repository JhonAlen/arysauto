import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { VehicleComponent } from '@app/club/vehicle/vehicle.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSelectModule} from '@angular/material/select';
// import { FleetContractBrokerIndexComponent } from './../../../subscription/fleet-contract-broker/fleet-contract-broker-index/fleet-contract-broker-index.component';
// import { FleetContractBrokerDetailComponent } from './../../../subscription/fleet-contract-broker/fleet-contract-broker-detail/fleet-contract-broker-detail.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    VehicleComponent,
    // NotificationsComponent,
    // FleetContractBrokerIndexComponent,
    // FleetContractBrokerDetailComponent,
  ]
})

export class AdminLayoutModule {}
