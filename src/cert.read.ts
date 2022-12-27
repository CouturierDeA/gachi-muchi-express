import {readFileSync} from 'fs';
import {join} from 'path'

export function getCredentials() {
    const privateKey = readFileSync(join(__dirname, '../cert/alice.key'), 'utf8');
    const certificate = readFileSync(join(__dirname, '../cert/alice.crt'), 'utf8');
    return  {key: privateKey, cert: certificate};
}