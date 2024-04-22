# Ketcher

1. Checkout `release/2.16` branch if not already as HEAD (to enable 3d spinning)
2. Build ketcher with `npm i && npm run build`
3. If releasing a new image version, update apps-dev.json or apps-prod.json in ../digabi2
4. Run `npm run create-configs` in digabi2 repo
5. Run `./docker_build.sh` to patch ketcher with window.top fix and build and tag a docker image from it. This takes the tag from ../digabi2
