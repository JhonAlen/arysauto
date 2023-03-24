import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { ColDef} from 'ag-grid-community'
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-contract-service-arys-administration',
  templateUrl: './contract-service-arys-administration.component.html',
  styleUrls: ['./contract-service-arys-administration.component.css']
})
export class ContractServiceArysAdministrationComponent implements OnInit {

  currentUser;
  keyword = 'value';
  search_form : UntypedFormGroup;
  searchStatus: boolean = false;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  chargeList: any[] = [];
  batchList: any[] = [];
  fleetContractList: any[] = [];
  id: number;
  xcliente: string;
  xdocidentidadcliente: number;
  xemailcliente: string;
  xpropietario: string;
  xdocidentidadpropietario: number;
  xemailpropietario: string;
  xplaca: string;
  xmarca: string;
  xmodelo: string;
  xversion: string;
  fano: number;
  xserialcarroceria: string;
  xserialmotor: string;
  xcolor: string;
  ncapacidadpasajeros: number;
  mtotal: number;
  fdesde_pol;
  fhasta_pol;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'age', 'city'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  filterValue: string;
  ELEMENT_DATA = [
    { name: 'Juan', age: 25, city: 'Madrid' },
    { name: 'Sara', age: 32, city: 'Barcelona' },
    { name: 'Lucía', age: 19, city: 'Valencia' },
    { name: 'Pedro', age: 45, city: 'Sevilla' },
    { name: 'María', age: 27, city: 'Bilbao' },
    { name: 'Carlos', age: 37, city: 'Málaga' }
  ];

  constructor(private formBuilder: UntypedFormBuilder,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter() {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

}
