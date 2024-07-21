# Stim7 Devops

## Introduction

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline for ThreadHub. Our pipeline automates testing and deployment of nodejs applications to Digital Ocean

## Architecture Overview

![image](https://github.com/Ik0nw/ICT2216-SSD/assets/48197340/5eec11bd-bc8e-4967-8b7b-f95c6167b5df)


## Usage

Production: To trigger a build, push changes to the `main` branch: `git push origin main`

Testing: To trigger a build, push changes to the `staging` branch: `git push origin STAGING`

Jenkins Test: To trigger a build, push changes to the `staging-test` branch: `git push origin staging-test`

## Testing and Validation
Tests are executed in the 'Test' stage of the pipeline using: TBD

### Mocha
`pnpm mocha -c .\test\mocha\auth\masterAuthTest.mjs`
### K6
`k6 run .\test\k6\local\master.js`


# Documentation for configuration

## Jenkins configuration

Use `systemctl edit jenkins` to edit configuration under services. After editing perform a restart `systemctl restart jenkins`

## SonarQube docker

For persistence sonarqube docker.

```
docker run -d \
  --name sonarqube \
  -p 127.0.0.1:8888:9000 \
  -v sonarqube_data:/opt/sonarqube/data \
  -v sonarqube_extensions:/opt/sonarqube/extensions \
  -v sonarqube_logs:/opt/sonarqube/logs \
  sonarqube
 ```

