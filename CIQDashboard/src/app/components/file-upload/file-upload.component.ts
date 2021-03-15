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
