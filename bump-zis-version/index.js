const core = require('@actions/core')
const utils = require('./lib/utils.js')
const github = require('./lib/github.js')
const Debug = require('debug')
const actionsGithub = require('@actions/github')


var version = core.getInput('version')
var branch = core.getInput('branch')
var repo = actionsGithub.context.repo.owner + '/' + actionsGithub.context.repo.repo

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