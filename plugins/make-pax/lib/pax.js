

const fs = require('fs')
const Debug = require('debug')
const InvalidArgumentException = require('./invalid-argument-exception.js')
const utils = require('./utils.js')
const PATH_CONTENT = 'content'
const PATH_ASCII = 'ascii'

class pax{


    static pack(args) {
        const func = 'pack:'
        
        const job = args.get('job')
        const paxSSHHost = args.get('paxSSHHost')
        const paxSSHPort = args.get('paxSSHPort')
        const paxSSHUsername = args.get('paxSSHUsername')
        const paxSSHPassword = args.get('paxSSHPassword') 
        const filename = args.get('filename')
        const paxOptions = args.get('paxOptions')
        const extraFilesArg = args.get('extraFiles')
        var environmentText = args.get('environments')
        const compress = args.get('compress')
        const compressOptions = args.get('compressOptions')
        var keepTempFolderArg = false
		const currentBranch = args.get('currentBranch')
		const jclBuildNumber = args.get('jclBuildNumber')
		const paxName = args.get('paxName')
		const mvdHomeDir = args.get('mvdHomeDir')
		const buildZSS = args.get('buildZSS')
		

        var paxLocalWorkspace = args.get('paxLocalWorkspace')
        var paxRemoteWorkspace = args.get('paxRemoteWorkspace')
		var paxPackageDir = args.get('paxPackageDir')

        // validate arguments
        if (!paxSSHHost) {
            throw new InvalidArgumentException('paxSSHHost')
        }
        if (!paxSSHPort) {
            throw new InvalidArgumentException('paxSSHPort')
        }
        if (!paxSSHUsername) {
            throw new InvalidArgumentException('paxSSHUsername')
        }
        if (!paxSSHPassword) {
            throw new InvalidArgumentException('paxSSHPassword')
        }
        if (!job) {
            throw new InvalidArgumentException('job')
        }
        if (!paxLocalWorkspace){
            throw new InvalidArgumentException('paxLocalWorkspace')
        }
        if (!paxRemoteWorkspace){
            throw new InvalidArgumentException('paxRemoteWorkspace')
        }
		if (!currentBranch){
            throw new InvalidArgumentException('currentBranch')
        }
		if (!jclBuildNumber){
            throw new InvalidArgumentException('jclBuildNumber')
        }
		if (!paxName){
            throw new InvalidArgumentException('paxName')
        }
		if (!mvdHomeDir){
            throw new InvalidArgumentException('mvdHomeDir')
        }
		if (!buildZSS){
            throw new InvalidArgumentException('buildZSS')
        }
		
		try {
            // Step 1: make packaging folder
			console.log('We are using new container')
			var cmd = `rm -rf ${paxRemoteWorkspace}/${paxName}-${currentBranch}-${jclBuildNumber} && mkdir -p ${paxRemoteWorkspace}/${paxName}-${currentBranch}-${jclBuildNumber}`
            utils.ssh(paxSSHHost,paxSSHPort,paxSSHUsername,paxSSHPassword,cmd)
            console.log(`[Step 1]: make folder created `)

            // Step 2: sand tar files over
			console.log('${buildZSS}')			
			var cmd2 = `put ${mvdHomeDir}/plugin.tar ${paxRemoteWorkspace}/${paxName}-${currentBranch}-${jclBuildNumber}/plugin.tar
put ${mvdHomeDir}/zlux-build.tar ${paxRemoteWorkspace}/${paxName}-${currentBranch}-${jclBuildNumber}/zlux-build.tar
put ${mvdHomeDir}/zowe-install-packaging/scripts/tag-files.sh ${paxRemoteWorkspace}/${paxName}-${currentBranch}-${jclBuildNumber}/tag-files.sh`
			utils.sftp(paxSSHHost,paxSSHPort,paxSSHUsername,paxSSHPassword,cmd2)
            console.log(`[Step 2]: sftp put plugin.tar and zlux-build.tar completed`)

			// step 3: package
            var cmd3 = `cd ${paxRemoteWorkspace}/${paxName}-${currentBranch}-${jclBuildNumber}
chtag -tc iso8859-1 tag-files.sh
chmod +x tag-files.sh
mkdir plugin && cd plugin
tar xpoUf ../plugin.tar
rm ../plugin.tar
_BPXK_AUTOCVT=ON ../tag-files.sh .
pax -o saveext -pp -wf ../plugin.pax *
mkdir ../zlux-build
tar xpoUf ../zlux-build.tar
rm ../zlux-build.tar
_BPXK_AUTOCVT=ON ../tag-files.sh .`
            utils.ssh(paxSSHHost,paxSSHPort,paxSSHUsername,paxSSHPassword,cmd3)
            console.log('[Step 3]: packaging completed')
			
			// step 4: copy back pax file
			var cmd4 = `get ${paxRemoteWorkspace}/${paxName}-${currentBranch}-${jclBuildNumber}/plugin.pax ${mvdHomeDir}/plugin.pax`
			utils.sftp(paxSSHHost,paxSSHPort,paxSSHUsername,paxSSHPassword,cmd4)
            console.log('[Step 4]: copy back files completed')
			
        } catch (ex1) {
            // throw error
            throw new Error(`Pack Pax package failed: ${ex1}`)
        } finally {
			console.log('cleaning up all temporary')
			var cmdClean = `rm -rf ${paxRemoteWorkspace}/${paxName}-${currentBranch}-${jclBuildNumber}`
			utils.ssh(paxSSHHost,paxSSHPort,paxSSHUsername,paxSSHPassword,cmdClean)
			console.log(`Cleaning up remote workspace success`)
        } //FINALLY
        return `${paxRemoteWorkspace}/${paxName}-${currentBranch}-${jclBuildNumber}/plugin.pax`
    } //PACK
}


module.exports = pax;