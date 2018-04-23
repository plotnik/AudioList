import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { File, Entry } from '@ionic-native/file';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    path: string = "Music/";
    message: string;
    filename: string;
    filelist: Entry[];

    constructor(public file: File) {
        this.reloadPath();
    }

    reloadPath() {
        console.log('-- reload path');
        //let self = this;
        this.file.resolveLocalFilesystemUrl(this.path).then(entry => {
            //console.log('entry:',entry);
            //self.filelist = entries; 
        });

    }
    /*
    listDir(path: string): Promise {
        return this.file.resolveLocalFilesystemUrl(path);

    }*/
}
