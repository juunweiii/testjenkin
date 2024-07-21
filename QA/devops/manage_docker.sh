#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if the 'backend' network exists
network_exists=$(docker network ls --filter name=^backend$ --format "{{.Name}}")

if [ "$network_exists" != "backend" ]; then
    echo -e "${YELLOW}Creating 'backend' Docker network...${NC}"
    docker network create --driver bridge --attachable --opt com.docker.network.bridge.name=backend backend
else
    echo -e "${GREEN}'backend' network already exists.${NC}"
fi

# Banner
echo -e "${BLUE}**********************************"
echo -e "      SSD-TEAM21 Docker Menu      "
echo -e "**********************************${NC}"

echo -e "${YELLOW}Select the operation you want to perform:${NC}"
echo -e "${GREEN}1) Full setup (standalone)${NC}"
echo -e "${GREEN}2) Full setup (microservices)${NC}"
echo -e "${GREEN}3) Dependencies only (mongodb + redis)${NC}"
echo -e "${GREEN}4) Build Docker image (local development)${NC}"
echo -e "${GREEN}5) Build Docker image from GitHub repo (local or production)${NC}"
echo -e "${GREEN}6) Run Docker container from local image${NC}"
echo -e "${YELLOW}7) Show all running Docker containers${NC}"
echo -e "${RED}8) Delete all Docker containers${NC}"
echo -e "${RED}9) Delete all Docker images${NC}"

read -p "Enter your choice: " choice

case $choice in
  1)
    docker-compose -f docker-compose-standalone.yml --env-file .compose.env up
    ;;
  2)
    docker-compose -f docker-compose-services.yml --env-file .compose.env up
    ;;
  3)
    docker-compose -f docker-compose-depend.yml --env-file .compose.env up
    ;;
  4)
    docker buildx build --tag standalone-threadhub -f standalone.dockerfile --ssh default .
    docker buildx build --tag sap .
    ;;
  5)
    docker buildx build -t sap -f standalone.dockerfile --build-arg NODE_ENV=development --target=development --ssh default .
    ;;
  6)
    docker run --name app -p 0.0.0.0:3010:3010 --network backend -d sap
    ;;
  7)
    echo -e "${YELLOW}Currently running Docker containers:${NC}"
    docker ps
    ;;
  8)
    echo -e "${YELLOW}Stopping and removing all Docker containers...${NC}"
    docker kill $(docker ps -q)
    docker rm $(docker ps -a -q)
    ;;
  9)
    echo -e "${YELLOW}Removing all Docker images...${NC}"
    docker rmi $(docker images -q)
    ;;
  *)
    echo -e "${RED}Invalid choice${NC}"
    ;;
esac