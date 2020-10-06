import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'leap-file-upload',
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
  constructor(private sanitizer: DomSanitizer) { }
  ngOnInit() {

  }
  onFileChanged(event) {
    this.valid = true;
    this.selectedFile = event.target.files[0];
    if (this.selectedFile.name.endsWith(this.type)) {
      this.file.emit(this.selectedFile);
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = (fevent: any) => {
        const imageData: string = fevent.target.result;
        this.data = imageData;
        this.dataChange.emit(this.data);
      };
    } else {
      this.valid = false;
    }

  }

}
