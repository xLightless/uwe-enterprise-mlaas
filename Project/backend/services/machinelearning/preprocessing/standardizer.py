"""
Standardizer class for scaling features to a standard normal distribution.

Written by Reece Turner, 22036698.
"""
# file for preprocessor type 1
from datetime import datetime
import pandas as pd


class DataStandardizer:
    """
    The DataStandardizer class handles the standardization of features in a
    dataframe to a standard normal distribution.

    """

    def __init__(self, df: pd.DataFrame) -> None:
        self.df = df

    def __format_datetime(self, datetime_str: str) -> str | pd.Timestamp:
        try:
            # Skip if the value is NaN or not a string
            if pd.isna(datetime_str) or not isinstance(datetime_str, str):
                return datetime_str

            dt = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M:%S.%f")
            standardized = dt.strftime("%Y-%m-%d %H:%M:%S")
            return standardized
        except ValueError:
            return datetime_str

    def standardize_datetime_columns(
        self,
        datetime_cols: list[str],
        drop_original: bool = True
    ) -> pd.DataFrame:
        """
        Standardizes datetime columns by splitting them into separate columns
        for year, month, day, hour, minute, and second.

        Args:
            datetime_cols (list[str]): List of datetime column names to
                standardize.
            drop_original (bool): Drop original columns.

        Returns:
            pd.DataFrame: The dataframe with datetime columns standardized.
        """
        for col in datetime_cols:
            if col not in self.df.columns:
                raise KeyError(f"Column '{col}' not found in DataFrame.")

            # Ensure the column is in datetime format
            self.df[col] = pd.to_datetime(self.df[col], errors='coerce')

            # Create new columns for year, month, day, etc.
            self.df[f"{col}Year"] = self.df[col].dt.year
            self.df[f"{col}Month"] = self.df[col].dt.month
            self.df[f"{col}Day"] = self.df[col].dt.day
            self.df[f"{col}Hour"] = self.df[col].dt.hour

            # Optionally drop the original datetime column
            if drop_original:
                self.df.drop(columns=[col], inplace=True)

        return self.df
