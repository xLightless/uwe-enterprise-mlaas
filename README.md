# Instructions
## Backend
### Download the project
1. Git clone https://github.com/xLightless/uwe-enterprise-mlaas.git

### Creating Virtual Environments
(x3) For each docker container (except the database) follow below:
1. Change directory `cd "pathName"` to the server folder.
2. Enter `py -m venv .venv`.
3. Enter `cd ".venv/scripts" && "activate.bat" && cd "../.."`.
4. If asked to update Python enter: `py -m pip install --upgrade pip`.
5. [Optional] If theres no automatic installation, enter: `pip install -r requirements.txt`

## Frontend
### Downloading the project files
This will install all the Node Packet Manager (NPM) project dependencies.
1. Change directory `cd "pathName"` to `\project\frontend` and enter `npm install`.



You should now be able to run the network and render the client.

