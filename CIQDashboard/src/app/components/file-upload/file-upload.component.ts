// © [2021] Cognizant. All rights reserved.
 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
 
//     http://www.apache.org/licenses/LICENSE-2.0
 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { Component, OnInit, Output, EventEmitter, Input, NgZone, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-image-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  selectedFile;
  @Output() file = new EventEmitter<any>();
  @Output() dataChange = new EventEmitter<any>();
  @Input() data;
  @Input() type = '*';
  valid = true;
  constructor(private cdRef : ChangeDetectorRef) { }
  ngOnInit() {

  }
  onFileChanged(event) {
    this.verifyImageDataAndUpdate(event.target.files && event.target.files[0])
      .then(imageFile => {
        this.valid = true;
        this.selectedFile = imageFile;
        this.file.emit(this.selectedFile);
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile);
        reader.onload = (fevent: any) => {
          const imageData: string = fevent.target.result;
          this.data = imageData;
          this.dataChange.emit(this.data);
          this.cdRef.detectChanges();
        };
      }).catch(error => {       
          this.valid = false;
          this.selectedFile = null;
          this.data = null;
          this.cdRef.detectChanges();
      });
  }

  private verifyImageDataAndUpdate(file: any) {
    return new Promise((resolve, reject) => {
      if (file) {
        const url = (window as any).URL || (window as any).webkitURL;
        const image = new Image();
        image.onload = function () {
          resolve(file);
        };
        image.onerror = function () {
          reject(new Error('invalid image'));
        };
        image.src = url.createObjectURL(file);
      } else {
        reject(new Error('invalid file'));
      }
    });
  }

}
