const core = require('@actions/core')
const utils = require('./lib/utils.js')
const github = require('./lib/github.js')
const Debug = require('debug')
const actionsGithub = require('@actions/github')


var version = core.getInput('version')
var branch = core.getInput('branch')
var repo = actionsGithub.context.repo.owner + '/' + actionsGithub.context.repo.repo

console.log(`look at this branch ${branch}`)

if (branch == ''){
	branch = 'v2.x/staging'
}
if (version == '') {
    version = 'MINOR'
}

// get temp folder for cloning
var tempFolder = `${process.env.RUNNER_TEMP}/.tmp-npm-registry-${utils.dateTimeNow()}`
console.log(`${tempFolder}`)
console.log(`Cloning ${branch} into ${tempFolder} ...`)
// clone to temp folder
github.clone(repo,tempFolder,branch)
console.log(`Making a "${version}" version bump ...`)

//test 
var newVersion
var res
var workdir = tempFolder;
var manifest
var pluginDef


// bump *.env 
envFileNames = utils.findAllFiles(`${workdir}`, '*.env')
packageDir = envFileNames.split(' ')

for (let i = 0; i < packageDir.length; i++){
	utils.bumpEnvVersion(`${workdir}/${packageDir[i]}`,version)
	console.log(utils.sh(`cat ${workdir}/${packageDir[i]}`));
}

// bump manifest 
if (utils.fileExists(workdir + '/manifest.template.yaml')) {
	manifest = 'manifest.template.yaml'
} else if (utils.fileExists(workdir + '/manifest.template.yml')) {
	manifest = 'manifest.template.yml'
} else if (utils.fileExists(workdir + '/manifest.template.json')) {
	throw new Error('Bump version on manifest.template.json is not supported yet.')
} else {
	throw new Error('No manifest found.')
}

newVersion = utils.bumpManifestVersion(`${workdir}/${manifest}`, version)
console.log(utils.sh(`cat ${workdir}/${manifest}`));
console.log('New version:', newVersion)
