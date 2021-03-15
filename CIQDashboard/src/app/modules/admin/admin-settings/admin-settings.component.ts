import { Component, OnInit } from '@angular/core';
import { UserConfigService } from 'src/app/modules/ciqdashboard/services/user-config.service';
import { ToastrService } from 'ngx-toastr';
import { parseApiError } from 'src/app/components/util/error.util';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})

export class AdminSettingsComponent implements OnInit {
  constructor() { }
  ngOnInit() {
  }

}


