## Enterprise MLAAS

### Installation
1. Download VSCode.
2. Download VSCode "Docker" Extension.
3. Open the terminal and enter "git clone https://github.com/xLightless/uwe-enterprise-mlaas.git"

3. Download Docker Desktop.
4. Go to the VSCode terminal and enter "docker compose -f "enterprise_mlaas\docker\docker-compose.yaml" up -d --build".
5. Next, type "docker ps". This should show you the postgresql container.
6. Run "docker inspect -f '{{.NetworkSettings.IPAddress}}' docker-postgres-db-1" to check if its connected...

To be continued...