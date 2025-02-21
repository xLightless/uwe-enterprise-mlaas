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

# Error checking
Please only run these on your local instance. While your testing code may be put on the repository, please do not pull request these installations.

Flake8 is a linter that checks Python code against style guide violations (PEP 8), logical errors, and potential bugs.
- Usage: `pip install flake8`.
- For more information: https://flake8.pycqa.org/en/latest/

Pylint is a static code analysis tool that checks for errors in Python code and enforces coding standards.
- Usage: `pip install pylint`.
- For more information: https://pylint.readthedocs.io/en/stable/

Autopep8 automatically reformats Python code to comply with the PEP 8 style guide.
- Usage: `pip install autopep8`.
- For more information: https://pypi.org/project/autopep8/

# Testing code
Pytest is a testing framework for Python that simplifies writing, running, and organizing tests, providing powerful features like fixtures, assertions, and plugins for efficient test execution and reporting.
- Usage: `pip install pytest`
- For more information: https://docs.pytest.org/en/stable/getting-started.html


