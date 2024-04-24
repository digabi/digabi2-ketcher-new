# Ketcher

Development is mainly done in  `release/2.16` branch. This branch contains various fixes regarding the 3d spinning and the Github Actions build pipelines

## Development

The development flow is roughly as follows

1. Make sure you are in `release/2.16` branch.
2. Make your changes
3. To test your changes, rebuild and tag the docker image by running `docker build -t "863419159770.dkr.ecr.eu-north-1.amazonaws.com/ketcher:v$(npm pkg get version | tr -d \")" .`
4. Restart the digabi2 docker compose to make sure that the new image is used.

## Development release

To release a new development version of Ketcher, run `./dev-release.sh`. This will create a new git tag, and build and push a Docker image with that tag into our private ECR. Building and pushing to ECR happens in Github Actions. You can view the workflow progress [here](https://github.com/digabi/ketcher/actions/workflows/dev-release.yml). Once built and pushed, you can update the Ketcher version `apps-dev.json` in the `digabi2` repository to point to the new tag.

## Release

To promote a development version of the image to production (i.e. release it to our public ECR) run `./release.sh`. Choose the tag you want to promote to production, which will trigger a Github Actions workflow. The workflow will push the corresponding private image to our public ECR. You can view the workflow progress [here](https://github.com/digabi/ketcher/actions/workflows/manual-prod-release.yml). After this has completed, update the Ketcher version in `apps-prod.json` in the `digabi2` repository to point to the newly released image tag.