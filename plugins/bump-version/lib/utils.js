const { execSync, spawnSync } = require('child_process')
const fs = require('fs')
const semver = require('semver') 

class utils {

	static sh(cmd, options = {}) {
        return execSync(cmd, options).toString().trim()
	}
	
	static sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    static dateTimeNow() {
        return (new Date()).toISOString().split('.')[0].replace(/[^0-9]/g, "")
    }
	
	static parseSemanticVersion(version) {
        var versionJson = {}
        versionJson['major'] = semver.major(version)
        versionJson['minor'] = semver.minor(version)
        versionJson['patch'] = semver.patch(version)
        const prerelease = semver.prerelease(version);
        versionJson['prerelease'] = prerelease ? (Array.isArray(prerelease) ? prerelease.join('.') : String(prerelease)) : ''
        return versionJson
    }
	
	static combineSemanticVersion(versionJson) {
        let version = `${versionJson['major']}.${versionJson['minor']}.${versionJson['patch']}`;
        if (versionJson['prerelease']) {
            version += `-${versionJson['prerelease']}`;
        }

        return version;
    }
	
	static bumpManifestVersion() {
		
        const version = 'MINOR'
        


        const oldVersionLine = this.sh(`cat manifest.yaml | grep 'version:'`);
        if (!oldVersionLine) {
            console.log(`Version is not defined in ${manifest}`);
            return;
        }
		
        const oldVersion = oldVersionLine.split(':')[1].trim();
        let oldVersionParsed = this.parseSemanticVersion(oldVersion);
		
		console.log(`parseS Version is ${oldVersionParsed}`);
        
		switch (version.toUpperCase()) {
            case 'PATCH':
                oldVersionParsed['patch'] = parseInt(oldVersionParsed['patch'], 10) + 1;
                break;
            case 'MINOR':
                oldVersionParsed['minor'] = parseInt(oldVersionParsed['minor'], 10) + 1;
                break;
            case 'MAJOR':
                oldVersionParsed['major'] = parseInt(oldVersionParsed['major'], 10) + 1;
                break;
            default:
                oldVersionParsed = this.parseSemanticVersion(version);
                break;
        }
        const newVersion = this.combineSemanticVersion(oldVersionParsed);

        const manifestContent = fs.readFileSync('manifest.yaml').toString();
        fs.writeFileSync('manifest.yaml', manifestContent.replace(/^version:.*$/m, `version: ${newVersion}`));
		
		return `v${oldVersion}`;
    }
	
}


module.exports = utils;