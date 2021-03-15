import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

const types = {
  JenkinsPipeline: {
    ext: 'Jenkinsfile',
    mime: 'application/x-groovy',
    strict: false
  },
  DockerCompose: {
    ext: '.yml',
    mime: 'application/x-yaml',
    strict: true
  }
};
interface FileType { ext: string; mime: string; strict: boolean; }

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor() { }

  private static saveFile(data: string, fileName: string, fType: FileType = types.DockerCompose): void {
    if (fType.strict && !fileName && fileName === '') {
      throw new TypeError(`Invalid/Empty value for fileName`);
    }
    fileName = sanitize(fileName);
    if (!fileName.endsWith(fType.ext)) {
      fileName += fType.ext;
    }
    const blob = new Blob([data], { type: `${fType.mime};charset=utf-8` });
    saveAs(blob, fileName);
  }
  public saveComposeFile(data: string, fileName: string) {
    FilesService.saveFile(data, fileName, types.DockerCompose);
  }
  public saveJenkinsfile(data: string) {
    const blob = new Blob([data], { type: `${types.JenkinsPipeline.mime};charset=utf-8` });
    saveAs(blob, types.JenkinsPipeline.ext);
  }
}

function removeNonWord(str: string) {
  return str.replace(/[^0-9a-zA-Z\xC0-\xFF \-]/g, '');
}

function sanitize(str: string) {
  return removeNonWord(str).trim().replace(/\s[a-z]/g,
    it => String.prototype.toUpperCase.bind(it)()).replace(/\s+/g, '');
}
