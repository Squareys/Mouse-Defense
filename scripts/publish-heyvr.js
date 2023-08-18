/**
 * Script to publish to HeyVR.
 *
 * Documentation here:
 * https://docs.heyvr.io/en/developer-area/publish-a-game#h-2-upload-via-api
 */

import axios from 'axios';
import FormData from 'form-data';
import {readFileSync} from 'node:fs';

if(!process.argv[2]) {
    console.error("Missing version argument.");
    process.exit(1);
}

let version = 'patch';
if(process.argv[2].endsWith('.0.0')) {
    version = 'major';
} else if(process.argv[2].endsWith('.0')) {
    version = 'minor';
}

const gameFile = readFileSync('../deploy/game.zip');
console.log('Publishing', version, `version (${gameFile.length/1000} kB)`);

const buildData = new FormData();
buildData.append( 'game_slug', 'mouse-defense' );
buildData.append( 'game_file', gameFile, 'game.zip' );
buildData.append( 'version', version );
buildData.append( 'sdk_version', 1 );

const accessToken = process.env.HEYVR_ACCESS_TOKEN;

axios({
    method: 'post',
    url: 'https://heyvr.io/api/developer/game/upload-build',
    data: buildData,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
    },
    onUploadProgress: (e) => {
        console.log('Upload progress:', 100*e.progress.toFixed(2), '%');
    }
})
    .then(res => {
        if(res.status === 200) {
            console.log('Successfully published to HeyVR.');
        } else {
            console.log("Upload failed with code", res.status);
            console.log(res.data)
            process.exit(1);
        }
    })
    .catch(error => {
        console.error("Request failed with error:");
        console.error(error.toString(), `(${error.response?.statusText})`);
        console.log(error.response.data);
        process.exit(1);
    })

