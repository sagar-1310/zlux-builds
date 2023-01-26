const core = require('@actions/core')
const utils = require('./lib/utils.js')
const Debug = require('debug')
const actionsGithub = require('@actions/github')




var branch = 'v2.x/staging'
var repo = actionsGithub.context.repo.owner + '/' + actionsGithub.context.repo.repo



// get temp folder for cloning
var tempFolder = `${process.env.RUNNER_TEMP}/.tmp-npm-registry-${utils.dateTimeNow()}`

console.log(`Cloning ${branch} into ${tempFolder} ...`)
// clone to temp folder
github.clone(repo,tempFolder,branch)

console.log(`repo: ${repo}, tmp: ${tempFolder}, branch: ${branch}`)

// run npm version
console.log(`Making a "${version}" version bump ...`)
