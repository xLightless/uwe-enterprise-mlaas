"""
This module handles imputing methods for the processing of datasets.

Written by Reece Turner, 22036698.
"""
# file for preprocessor type 1
# from datetime import datetime
import pandas as pd
from sklearn.impute import SimpleImputer


class Imputer:
    """Imputer class for handling missing values in dataframes."""

    def __drop_impure_records(
        self,
        df: pd.DataFrame,
        cols: list[str] = None
    ) -> pd.DataFrame:
        """
        Remove rows with missing values in columns.

        This internal function handles the removal of records with missing
        cell values, via the specified columns. If no columns are
        specified, the dataset is returned unchanged.

        :param df: The dataframe to filter.
        :return: The filtered dataframe.
        """

        if cols is None:
            return df

        valid_cols = [col for col in cols if col in df.columns]
        if not valid_cols:
            return df

        updated_df = df.dropna(subset=valid_cols, how='any', inplace=False)
        return updated_df

    def impute(
        self,
        df: pd.DataFrame,
        strategy: str = 'most_frequent',
        protected_cols: list[str] = None
    ) -> pd.DataFrame:
        """
        Impute missing values in the dataframe.

        This function uses the SimpleImputer from sklearn to fill in
        missing values in the dataframe. The strategy can be set to
        'mean', 'median', 'most_frequent', or 'constant'.

        :param df: The dataframe to impute.
        :param strategy: The strategy to use for imputation.
        :param protected_cols: List of columns to check for missing values of
            protected characteristics.
        :return: The imputed dataframe.
        """

        # Filter out protected data in each row if specified
        if protected_cols:
            df = self.__drop_impure_records(df, protected_cols)

        imputer = SimpleImputer(strategy=strategy)
        return pd.DataFrame(imputer.fit_transform(df), columns=df.columns)
