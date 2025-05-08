"""
Encoder class for handling categorical data in dataframes.

Written by Reece Turner, 22036698.
"""

from sklearn.preprocessing import (
    OrdinalEncoder,
)
# from sklearn.compose import ColumnTransformer
# from sklearn.pipeline import Pipeline

import pandas as pd
import numpy as np

# file for preprocessor type 1


class Encoder:
    """
    Encoder class for handling categorical data in dataframes.
    """

    def __init__(self, df: pd.DataFrame):
        self.df = df

    # def encode_numerical(self) -> pd.DataFrame:

    def encode_oridinal(self, columns: list[str]) -> pd.DataFrame:
        """
        Encodes ordinal columns, converting specific values like
        'yes', 'no', 'Yes', 'No', 'True', 'False', 'true', 'false'
        into 1 or 0 before applying ordinal encoding.

        :param columns: List of column names to encode.
        :return: Updated DataFrame with encoded columns.
        """
        binary_mapping = {
            'yes': 1, 'Yes': 1, 'true': 1, 'True': 1,
            'no': 0, 'No': 0, 'false': 0, 'False': 0
        }

        for col in columns:
            self.df[col] = self.df[col].map(lambda x: binary_mapping.get(x, x))

        encoder = OrdinalEncoder()
        self.df[columns] = encoder.fit_transform(self.df[columns])
        return self.df

    def encode_cyclical(self, columns: list[str]) -> pd.DataFrame:
        """
        Encode cyclical features using sine and cosine transformations.
        """

        print(f"Encoding cyclical features: {columns}")

        period_dict = {
            'Hour': 24,       # Hours of the day (0 to 23)
            'Day': 31,        # Days of the month (1 to 31)
            'Month': 12,      # Months of the year (1 to 12)
        }

        for col in columns:
            has_column = next((
                key for key in period_dict
                if key in col
            ), None)

            if not has_column or "Year" in col:
                # raise ValueError(f"Period for {col} not provided.")
                continue

            # Get the time period and calculate sine and cosine features
            period = period_dict[has_column]
            self.df[f'{col}Sine'] = np.sin(2 * np.pi * self.df[col] / period)
            self.df[f'{col}Cosine'] = np.cos(2 * np.pi * self.df[col] / period)
            self.df.drop(columns=[col], inplace=True)

        return self.df
