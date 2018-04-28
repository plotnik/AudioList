import { Component } from '@angular/core';
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
        let self = this;
        this.file.listDir(this.file.externalRootDirectory, this.path)
            .then((entries: Entry[]) => {
                self.filelist = entries.filter((entry: Entry) => {
                    return entry.isDirectory;
                });
                console.log('-- filelist.length:',this.filelist.length);
            });
    }

    clickItem() {
        console.log('-- click');
    }

}
