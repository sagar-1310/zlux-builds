
# Prepare Zlux-Core 

This action exports certain enviorment variables for the whole workflow to be used.

## Inputs

### `Default Branch Name`

**Optional** - This value will be used to identify which branch of zlux-core you want to clone, there will always be a default.

## Exported environment variables

(global env vars - for subsequent workflow steps to consume)

### `envvars.env`

Environment variables as defined in [envvars.env](./envvars.env)

### `DEFAULT_BRANCHES_JSON_TEXT`

defaultBranches.json transformed to String then exported as environment variable

### `CURRENT_BRANCH`

the branch where workflow is triggered

### `JFROG_CLI_BUILD_NAME`

this is to overwrite jfrog build name while doing jfrog cli commands


### Note

- If you wish to add more global environment variables, please add them in [envvars.env](./envvars.env)\
  Comments starting with `#` and blank lines are allowed for easy reading, they will be sanitized during processing.
- If you wish to export more JSON file, add the file in current directory, then in [action.yml](./action.yml), do

  ```yaml
  echo '{VARIABLE_NAME}<<EOF' >> $GITHUB_ENV
  cat {filename}.json >> $GITHUB_ENV
  echo 'EOF' >> $GITHUB_ENV
  ```