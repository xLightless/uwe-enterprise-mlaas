"""
This module contains the functionality for scaling numerical data into a
normalised format that models can interpret.

Written by Reece Turner, 22036698.
"""
# file for preprocessor type 1
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, StandardScaler


class Scaler:
    """
    The Scaler class handles various scaling techniques for numerical data
    within a dataframe.
    """

    def __init__(self, df: pd.DataFrame) -> None:
        self.df = df
        self.scalers = {}

    def minmax(self, columns: list[str]) -> None:
        """
        Scale the specified columns of the dataframe using Min-Max scaling.

        Args:
            columns (list[str]): List of column names to scale.
        """
        scaler = MinMaxScaler()
        self.df[columns] = scaler.fit_transform(self.df[columns])
        return self.df

    def standard(self, columns: list[str]) -> None:
        """
        Scale the specified columns of the dataframe using standard scaling.

        Args:
            columns (list[str]): List of column names to scale.
        """
        scaler = StandardScaler()
        self.df[columns] = scaler.fit_transform(self.df[columns])
        return self.df

    def minmax_inverse_transform(
        self,
        column: str,
    ) -> pd.DataFrame:
        """
        Inverse transform the scaled data back to its original form.

        Args:
            column (str): The column name for which to inverse transform.

        Returns:
            pd.DataFrame: A DataFrame with the original data.
        """
        if column not in self.scalers:
            raise ValueError(f"No scaler found for column '{column}'.")
        if column not in self.df.columns:
            raise ValueError(f"Column '{column}' not found in the dataframe.")

        scaler = self.scalers[column]
        scaled_values = self.df[column].values
        original_values = scaler.inverse_transform(
            scaled_values.reshape(-1, 1)
        ).flatten()
        self.df[column] = original_values
        return self.df
