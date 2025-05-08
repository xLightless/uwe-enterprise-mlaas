"""
This module contains utilities for handling the preprocessing of data.

Written by Reece Turner, 22036698.
"""
# file for preprocessor type 1


import re
import os
import pandas as pd
import numpy as np
from models.preprocessing.encoding import Encoder
from models.preprocessing.scaling import Scaler
from models.preprocessing.imputing import Imputer
from models.preprocessing.standardizer import DataStandardizer
from models.config import (
    datetime_cols,
)


def add_injury_prognosis_datetimes(df: pd.DataFrame) -> pd.DataFrame:
    """
    Adds datetime columns for injury prognosis to the dataframe.

    :param df: The DataFrame to which the datetime columns will be added.
    :return: Updated DataFrame with datetime columns.
    """
    if not pd.api.types.is_datetime64_any_dtype(df['AccidentDate']):
        df['AccidentDate'] = pd.to_datetime(
            dict(
                year=df['AccidentDateYear'],
                month=df['AccidentDateMonth'],
                day=df['AccidentDateDay'],
                hour=df['AccidentDateHour']
            ),
            errors='coerce'
        )

    # Extract numeric duration from InjuryPrognosis (e.g., "5 months" -> 5)
    df['PrognosisDurationMonths'] = df['InjuryPrognosis'].str.extract(
        r'(\d+)'
    ).astype(float)

    # Calculate the new date by adding the duration to the AccidentDate
    df['PrognosisEndDate'] = df['AccidentDate'] + pd.to_timedelta(
        df['PrognosisDurationMonths'] * 30, unit='D'
    )

    # Drop temporary columns if not needed
    df = df.drop(columns=['PrognosisDurationMonths'])

    return df


def accident_claim_delta(df: pd.DataFrame) -> pd.DataFrame:
    """
    Adds a new column 'AccidentClaimDelta' to the DataFrame, which is the
    difference in days between 'AccidentDate' and 'ClaimDate'.

    :param df: The DataFrame to which the new column will be added.
    :return: Updated DataFrame with the new column.
    """
    df.loc[:, 'AccidentDate'] = pd.to_datetime(
        df['AccidentDate'], errors='coerce'
    )
    df.loc[:, 'ClaimDate'] = pd.to_datetime(
        df['ClaimDate'], errors='coerce'
    )

    # Calculate the difference in days between ClaimDate and AccidentDate
    df.loc[:, 'AccidentClaimDeltaInDays'] = (
        df['ClaimDate'] - df['AccidentDate']
    ).dt.days

    return df


class DataPreprocessor:
    """
    The DataPreprocessor class automatically handles the preprocessing of
    linear/tabular data in the form of numerical, datetime, and
    categorical data.

    Note: Passing the target variable into the constructor will drop
    the data frame column. If you want keep access to it then pass the
    variable directly into the Data Frame.

    Optionally, you can create the target variable before passing
    the Data Frame.
    """

    def __init__(
        self,
        df: pd.DataFrame,
        target_variable: str = None,
        protected_cols: list[str] = None,
    ) -> None:
        self.protected_cols: list[str] = protected_cols
        self._df = df

        self.target_variable: str = target_variable
        if target_variable:
            formatted_target_var = self.__format_column_name_words(
                target_variable
            ).title().replace(' ', '').replace('_', '')
        else:
            formatted_target_var = None

        self.target_variable = self.__set_target_variable(
            formatted_target_var
        )

        # Get the labels/feature columns of the dataframe
        self.labels: dict = self.get_labels(df)

        # Process the dataframe
        if (target_variable and len(target_variable) > 0):
            self.df: pd.DataFrame = self.__process_df(
                df.drop(columns=[target_variable])
            )
        else:
            self.df: pd.DataFrame = self.__process_df(df)

    def __format_column_name_words(
        self,
        cols: str
    ) -> str:
        """
        This internal function seperates words in a string with
        spaces and upper cases each word.

        returns: str
        """
        return re.sub(
            r'(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])', ' ', cols
        )

    def __set_target_variable(self, target_variable: str = None) -> str | None:
        """
        Set the target variable for the dataframe.

        If no target variable is specified, the first column is used as
        the target variable.

        The target variable is the column that we want to predict.

        :param col: The column name of the target variable.
        :return: str | None
        """

        if target_variable is None:
            target_variable = self._df.columns[0]
            return target_variable

        # Check if the column exists in the dataframe
        if target_variable not in self._df.columns:
            raise ValueError(
                f"Column '{target_variable}' does not exist in the dataframe."
            )

        # Set the target variable
        print(f"[INFO] Target variable set to '{target_variable}'.")
        return target_variable

    def __update_column_names(self, df):
        """
        Updates the column names of the dataframe and protected columns.
        """
        updated_cols = [
            self.__format_column_name_words(col)
            .title().replace(' ', '').replace('_', '')
            for col in df.columns
        ]

        if len(updated_cols) != len(df.columns):
            raise ValueError("Column names not updated.")

        df.columns = updated_cols

        if self.protected_cols and len(self.protected_cols) > 0:
            self.protected_cols = [
                self.__format_column_name_words(col)
                .title().replace(' ', '').replace('_', '')
                for col in self.protected_cols
            ]

        return df

    def __handle_missing_values(self, df):
        """
        Handles missing values in the dataframe by imputing them.
        """
        labels = self.get_labels(df)
        missing_values_cols = self.get_missing_value_columns(df)

        if missing_values_cols:
            numerical_cols = labels['numerical']
            datetime_columns = labels['datetime']
            categorical_cols = labels['categorical']
            total_missing_nums = df[numerical_cols].isnull().sum().sum()
            total_missing_datetime = df[datetime_columns].isnull().sum().sum()
            total_missing_cats = df[categorical_cols].isnull().sum().sum()

            print(
                "[WARNING] Missing values found. " +
                "If populating value is 0, " +
                "this does not always mean the existing columns are filled."
            )

            # Impute missing values
            imputer = Imputer()
            df = imputer.impute(
                df,
                strategy='most_frequent',
                protected_cols=self.protected_cols
            )

            print(
                f"[INFO] Imputed {total_missing_nums} numerical, " +
                f"{total_missing_datetime} datetime, " +
                f"{total_missing_cats} categorical values."
            )

        return df

    def __transform_special_data(
        self,
        df: pd.DataFrame,
        column_name: str,
        expected_structure: str,
        transformation_func=None
    ) -> pd.DataFrame:
        """
        Validates and transforms a column in the DataFrame to
        match the expected structure.

        :param df: The DataFrame containing the column.
        :param column_name: The name of the column to validate and transform.
        :param expected_structure: The expected structure of the column.
        :param transformation_func: A function to transform invalid data.
        :return: Updated DataFrame with the transformed column.
        """

        # Identify rows that do not match the expected structure
        invalid_rows = ~df[column_name].astype(str).str.match(
            expected_structure, na=False
        )

        if invalid_rows.any():
            print(
                f"[INFO] Found {invalid_rows.sum()} rows in " +
                f"'{column_name}' that do not match the expected structure."
            )

            if transformation_func:
                # Fix some deprecation warnings
                df[column_name] = df[column_name].astype(object)

                # Apply the transformation function to fix invalid rows
                df.loc[invalid_rows, column_name] = df.loc[
                    invalid_rows, column_name
                ].apply(transformation_func)
            else:
                raise ValueError(
                    f"Column '{column_name}' contains invalid data and " +
                    "no transformation function was provided."
                )

        return df

    def __process_df(self, df):
        """
        Processes the dataframe, returning updated rows, and column names.
        """

        # Format column names
        _df = df.copy()
        df = self.__update_column_names(df)
        df = self.__handle_missing_values(df)
        labels = self.get_labels(df)
        labels2 = self.get_labels(_df)

        # Standardize columns
        # datetime_columns = [col for col in df.columns if "Date" in col]
        datetime_columns = labels['datetime']

        if datetime_columns:
            # Ensure datetime columns are properly converted to datetime type
            for col in datetime_columns:
                df[col] = pd.to_datetime(df[col], errors='coerce')

            # Filter out columns that could not be converted to datetime
            datetime_columns = [
                col for col in datetime_columns
                if pd.api.types.is_datetime64_any_dtype(df[col])
            ]

            # Create new columns for year, month, day, etc.
            if datetime_columns:
                print(
                    f"[INFO] Found {len(datetime_columns)} datetime " +
                    f"columns: {datetime_columns}"
                )
                standardizer = DataStandardizer(df)
                standardized_df = standardizer.standardize_datetime_columns(
                    datetime_cols=datetime_columns,
                    drop_original=False
                )

                # Encode columns
                encoder = Encoder(standardized_df)
                df_copy = df.copy()

                labels = self.get_labels(standardized_df)
                datetime_columns = labels['datetime']

                # Encodes categorical columns - currently disabled for testing.
                encoder.encode_oridinal(labels['categorical'])
                scaler = Scaler(standardized_df)

                date_year_cols = [
                    col for col in scaler.df.columns
                    if "Year" in col
                ]

                scaler.minmax(date_year_cols)
                df_dates = df_copy[datetime_cols]
                df_date_claim_delta = accident_claim_delta(
                    df_dates
                )

                accident_claim_delta_days = df_date_claim_delta[
                    'AccidentClaimDeltaInDays'
                ]

                scaler.df['AccidentClaimDeltaInDays'] = (
                    accident_claim_delta_days
                )

                # Transform Injury Prognosis
                expected_structure = r"^\d+\smonths$"
                scaled_df = self.__transform_special_data(
                    df=scaler.df,
                    column_name="InjuryPrognosis",
                    expected_structure=expected_structure,
                    transformation_func=self.extract_months
                )

                # Convert InjuryPrognosis from months to days
                scaler.df['InjuryPrognosisInDays'] = (
                    scaler.df['InjuryPrognosis']
                    .str.extract(r'(\d+)')  # Extract numeric value
                    .astype(float) * 30     # Convert months to days
                )

                # Apply Min-Max scaling to the InjuryPrognosisInDays column
                scaler.minmax(['InjuryPrognosisInDays'])

                df1 = scaled_df  # Contains encoded columns
                df2 = df_copy

                df2 = add_injury_prognosis_datetimes(df2)

                # After scaling, we can then take the dataframe and encode it.
                encoder = Encoder(df2)
                cyclical_columns = [
                    col for col in datetime_columns
                    if not col.lower().endswith("date")
                ]
                df2 = encoder.encode_cyclical(cyclical_columns)

                # Merge columns from df2 into df1
                df2 = df2.loc[:, ~df2.columns.isin(df1.columns)]
                df1 = pd.concat([df1, df2], axis=1)

                # Standardize the Injury Prognosis columns
                standardizer = DataStandardizer(df1)
                standardizer.standardize_datetime_columns(
                    datetime_cols=["PrognosisEndDate"],
                    drop_original=True
                )

                # Encode the new features
                prognosis_date_columns = []
                for col in df1.columns:
                    if "PrognosisEndDate" in col:
                        prognosis_date_columns.append(col)

                encoder = Encoder(df1)
                encoder.encode_cyclical(
                    prognosis_date_columns
                )

                updated_datetime_cols = []
                for col in datetime_columns:
                    if col not in date_year_cols:
                        updated_datetime_cols.append(col)

                df1 = encoder.df.drop(
                    columns=(
                        datetime_cols +
                        ["InjuryPrognosis"] +
                        updated_datetime_cols
                    )
                )

                # Copy dataframe and updated the original in the function
                scaler = Scaler(df1)
                scaler.minmax(['PrognosisEndDateYear'])

                # Scale any remaining original numerical columns not handled by
                # previous stages, e.g. Special Columns.
                scaler.minmax(labels2['numerical'])
                df = scaler.df.copy()
        return df

    def extract_months(self, value: str | float | int):
        """
        Search function for transforming the month column.
        """
        match = re.search(r'(\d+)', str(value))
        return f"{match.group(1)} months" if match else None

    def get_labels(
        self,
        df: pd.DataFrame
    ) -> dict:
        """
        Get the labels of the dataframe.

        This function processes the labels to remove any
        unnecessary characters, spaces, or other inconsistencies.

        returns: dict
        """

        # Copy the dataframe to avoid modifying the original
        # then remove any inconsistencies in the column names
        data_frame = df.copy()
        data_frame.columns = [
            self.__format_column_name_words(col)
                .title().replace(' ', '')
                .replace('_', '') for col in df.columns
        ]

        numerical_cols = data_frame.select_dtypes(
            include=[np.number]
        ).columns

        # print(f"Numerical columns: {numerical_cols}")

        dt_cols = [
            col for col in data_frame.columns
            if "date" in col.lower()
        ]

        categorical_cols = data_frame.select_dtypes(
            include=[object]
        ).columns.difference(dt_cols)

        return {
            'numerical': numerical_cols,
            'categorical': categorical_cols,
            'datetime': dt_cols,
        }

    def get_categorical_columns(self):
        """
        Get the categorical columns of the dataframe.
        """
        return self.labels['categorical']

    def get_datetime_columns(self):
        """
        Get the datetime columns of the dataframe.
        """
        return datetime_cols

    def get_numerical_columns(self):
        """
        Get the numerical columns of the dataframe.
        """
        return self.labels['numerical']

    def get_missing_value_columns(self, df):
        """
        Get the columns with missing values.
        """
        return df.columns[df.isnull().any()].tolist()

    def download(
        self,
        path: str = "",
        df: pd.DataFrame = None
    ):
        """
        Download the preprocessed data as a CSV file.

        - If path and df are provided, download to the specified path.
        - If only df is provided, download to the current directory.
        - If only path is provided, download the active dataframe to that path.

        returns: None
        """

        # If the previous file exists, remove it, then download the new file
        if len(path) > 0 and os.path.exists(path):
            try:
                os.remove(path)
            except PermissionError:
                print(
                    "[ERROR] The file you are trying to remove " +
                    "is currently open. Please close it and try again."
                )
                return False

        if df is not None and not df.empty and len(path) > 0:
            df.to_csv(path, index=False)
            return None

        elif df is not None and not df.empty and len(path) == 0:
            return df.to_csv(index=False)

        df_cols = self.get_labels(self.df)
        nums = df_cols['numerical'].tolist()
        # dates = df_cols['datetime'].tolist()
        categories = df_cols['categorical'].tolist()

        self.df.columns = nums + categories
        self.df.to_csv(path, index=False)
        return None
