import { Component } from '@angular/core';
import { File, Entry } from '@ionic-native/file';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    path: string = "Music";
    message: string;
    filename: string;
    filelist: Entry[];
    numfiles: number;

    constructor(public file: File) {
        this.reloadPath();
    }

    reloadPath() {
        let self = this;
        this.file.listDir(this.file.externalRootDirectory, this.path)
            .then((entries: Entry[]) => {
                this.numfiles = 0;
                self.filelist = entries.filter((entry: Entry) => {
                    if (entry.isFile && entry.name.toLowerCase().endsWith('.mp3')) {
                        this.numfiles++;
                    }
                    return entry.isDirectory;
                });
                //console.log('-- filelist.length:',this.filelist.length);
            });
    }

    clickItem(f: Entry) {
        this.path += '/' + f.name;
        this.reloadPath();
    }

    clickUp() {
        //let k = this.path.substr(0, this.path.length - 1).lastIndexOf('/');
        let k = this.path.lastIndexOf('/');
        if (k > 0) {
            this.path = this.path.substring(0, k);
            this.reloadPath();
        }
    }
}
