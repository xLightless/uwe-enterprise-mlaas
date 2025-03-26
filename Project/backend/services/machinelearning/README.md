# Setting up the submodule

- `cd project\backend\services\machinelearning`
- `git submodule add https://github.com/xLightless/uwe-enterprise-mlaas-models.git`
- If venv does not exist, enter `py -m venv .venv` in the `machinelearning` directory.
    - `cd .venv/scripts && activate && cd ../../`
- `cd uwe-enterprise-mlaas-models`

# Installing the requirements
- Enter `pip install -r requirements.txt`
- Alternatively, the cool way, run `python main.py --install`.

# Executing a model
One complete, you can start managing models using the command line, for example:
`python main.py --model <model_name> --data <dataset_path> [optional args]`

Click [here](https://github.com/xLightless/uwe-enterprise-mlaas-models) for the ML models GitHub.