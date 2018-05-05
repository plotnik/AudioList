import { Component } from '@angular/core';
import { File, Entry } from '@ionic-native/file';
import { AlertController } from 'ionic-angular';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    /** Path to the current folder */
    path: string = "Music";

    /** List of files in the current folder */
    filelist: Entry[];

    /** Number of `.mp3` files in the current folder */
    numfiles: number;

    /** Name of playlist file to be generated */
    playlist: string;

    /** List of `.mp3` files including ones in subfolders */
    allfiles: Entry[];

    constructor(public file: File,
        public alertCtrl: AlertController) {
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
            });
    }

    clickItem(f: Entry) {
        this.path += '/' + f.name;
        this.reloadPath();
    }

    clickUp() {
        let k = this.path.lastIndexOf('/');
        if (k > 0) {
            this.path = this.path.substring(0, k);
            this.reloadPath();
        }
    }

    generate() {
        // read list of mp3 files recursively
        this.allfiles = [];
        this.listFilesRecursive(this.path).then(() => {
            this.createPlaylist();
        });
    }

    createPlaylist() {
        console.log('createPlaylist');
        // sort files in alphabetic order
        this.allfiles.sort((a: Entry, b: Entry) => {
            if (a.fullPath < b.fullPath) {
                return -1;
            } else
                if (a.fullPath > b.fullPath) {
                    return 1;
                } else {
                    return 0;
                }
        });

        // create file contents
        var text = "#EXTM3U\n";
        for (var i = 0; i < this.allfiles.length; i++) {
            var f = this.allfiles[i];
            text += "#EXTINF:-1," + f.name + "\n" +
                f.fullPath.substring(this.path.length + 1) + "\n";
        }
        var fname = this.path + '/' + this.playlist + '.m3u8';
        this.file.writeFile(this.file.externalRootDirectory, fname, text, { replace: true }).then(value => {
            let alert = this.alertCtrl.create({
                title: 'Playlist saved',
                subTitle: fname + ' (' + this.allfiles.length + ' entries)',
                buttons: ['OK']
            });
            alert.present();

        }).catch(reason => {
            let alert = this.alertCtrl.create({
                title: 'Cannot save file',
                subTitle: fname + ' (reason: ' + reason.message + ')',
                buttons: ['OK']
            });
            alert.present();
        });
    }

    listFilesRecursive(path: string): Promise<boolean> {
        let self = this;
        return new Promise((resolve, reject) => {
            self.file.listDir(self.file.externalRootDirectory, path)
            .then((entries: Entry[]) => {
                var a = [];
                entries.forEach((entry: Entry) => {
                    if (entry.isDirectory) {
                        a.push(this.listFilesRecursive(path + '/' + entry.name));
                    } else
                    if (entry.name.toLowerCase().endsWith('.mp3')) {
                        self.allfiles.push(entry);
                    }
                });
                Promise.all(a).then(() => {
                    resolve(true);
                })
            }).catch(err => {
                reject(err);
            });
        });
    }
}
