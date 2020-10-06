import { Component, OnInit } from '@angular/core';
import { UserConfigService } from 'src/app/modules/idashboard/services/user-config.service';
import { ToastrService } from 'ngx-toastr';
import { parseApiError } from 'src/app/components/util/error.util';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})

export class AdminSettingsComponent implements OnInit {
  constructor(private config: UserConfigService, private toastr: ToastrService) {

  }
  ngOnInit() {
  }

  reloadWhitelist() {
    this.config.reloadWhitelist().subscribe(
      success => this.toastr.success('whitelists successfully reloaded!'),
      error => {
        const parsedError = parseApiError(error, 'error while reloading whitelists!');
        this.toastr.error(parsedError.message, parsedError.title);
      });
  }
}


