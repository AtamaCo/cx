#!/bin/bash

npm run changeset version

npm run build --workspaces --if-present

for dir in ./packages/*/
do
  dir=${dir%*/}
  foldername=${dir##*/}
  packagename="@atamaco/${foldername}"
  {
    npm publish --workspace ${packagename} --access public
  } || {
    echo "${packagename} was already published"
  }
done

for dir in ./packages/web/*/
do
  dir=${dir%*/}
  foldername=${dir##*/}
  packagename="@atamaco/${foldername}"
  {
    npm publish --workspace ${packagename} --access public
  } || {
    echo "${packagename} was already published"
  }
done

npm run changeset tag
