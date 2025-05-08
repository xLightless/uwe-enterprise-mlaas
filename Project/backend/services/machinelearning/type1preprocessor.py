"""
SettlementInputPreprocessor - Implementation for Preprocessor Type 1
"""
import numpy as np
import pandas as pd
import re
from datetime import datetime
from typing import Dict, Any, List, Union  # Add Union import here

class SettlementInputPreprocessor2:
    def __init__(self):
        # Configuration based on preprocessing approach type 1
        self.TARGET_COLUMN = 'SettlementValue'
        self.BINARY_COLS = [
            'ExceptionalCircumstances', 'MinorPsychologicalInjury', 'Whiplash',
            'PoliceReportFiled', 'WitnessPresent'
        ]
        self.CATEGORICAL_COLS = [
            'AccidentType', 'DominantInjury', 'VehicleType', 
            'WeatherConditions', 'AccidentDescription', 'InjuryDescription', 'Gender'
        ]
        self.DATETIME_COLS = ['AccidentDate', 'ClaimDate']
        self.PROGNOSIS_COL = 'InjuryPrognosis'
        self.SPECIAL_COST_COLS = [
            'SpecialHealthExpenses', 'SpecialOverage', 'SpecialAdditionalInjury',
            'SpecialEarningsLoss', 'SpecialUsageLoss', 'SpecialMedications',
            'SpecialAssetDamage', 'SpecialRehabilitation', 'SpecialFixes',
            'SpecialLoanerVehicle', 'SpecialTripCosts',
            'SpecialJourneyExpenses', 'SpecialTherapy'
        ]
        self.expected_feature_count = 112
        
        # Define period mapping for cyclical encoding
        self.period_dict = {
            'Hour': 24,   # Hours of the day (0 to 23)
            'Day': 31,    # Days of the month (1 to 31)
            'Month': 12,  # Months of the year (1 to 12)
        }
        
        # Define binary mapping for ordinal encoding
        self.binary_mapping = {
            'yes': 1, 'Yes': 1, 'true': 1, 'True': 1,
            'no': 0, 'No': 0, 'false': 0, 'False': 0
        }

    def preprocess_input(self, input_data: Dict[str, Any]) -> np.ndarray:
        """
        Process raw input data into model-ready format
        Args:
            input_data: Dictionary of raw input features
        Returns:
            numpy array with exactly 112 features
        """
        try:
            # Convert input to DataFrame
            input_df = pd.DataFrame([input_data])
            
            # Apply full preprocessing pipeline
            df_clean = self.initial_clean(input_df)
            df_imputed = self.apply_imputation(df_clean)
            df_engineered = self.engineer_features(df_imputed)
            df_final = self.apply_final_processing(df_engineered)
            
            # Convert to numpy array with correct dtype
            processed_data = df_final.values.astype(np.float32)
            
            # Ensure correct feature count
            if processed_data.shape[1] < self.expected_feature_count:
                padding = np.zeros((1, self.expected_feature_count - processed_data.shape[1]))
                processed_data = np.hstack([processed_data, padding])
            elif processed_data.shape[1] > self.expected_feature_count:
                processed_data = processed_data[:, :self.expected_feature_count]
                
            return processed_data
            
        except Exception as e:
            raise ValueError(f"Failed to preprocess input: {str(e)}")

    def initial_clean(self, df: pd.DataFrame) -> pd.DataFrame:
        """Initial data cleaning step"""
        df_clean = df.copy()
        
        # Update column names to standardized format
        df_clean.columns = [
            self.format_column_name(col) for col in df_clean.columns
        ]
        
        # Convert binary columns using binary mapping
        for col in self.BINARY_COLS:
            if col in df_clean.columns:
                df_clean[col] = df_clean[col].map(
                    lambda x: self.binary_mapping.get(str(x), 
                              1 if str(x).lower() in ['yes', 'true', '1'] 
                              else 0 if str(x).lower() in ['no', 'false', '0'] 
                              else np.nan)
                ).astype(np.float64)
        
        # Convert categorical columns to strings
        for col in self.CATEGORICAL_COLS:
            if col in df_clean.columns:
                df_clean[col] = df_clean[col].astype(str)
        
        return df_clean

    def format_column_name(self, col: str) -> str:
        """Format column name to standardized CamelCase format"""
        # First separate words with spaces based on camelCase or PascalCase pattern
        col_with_spaces = re.sub(r'(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])', ' ', col)
        # Then convert to title case, remove spaces and underscores
        return col_with_spaces.title().replace(' ', '').replace('_', '')

    def apply_imputation(self, df: pd.DataFrame) -> pd.DataFrame:
        """Apply imputation for missing values"""
        df_imputed = df.copy()
        
        # Impute special costs with 0
        for col in self.SPECIAL_COST_COLS:
            if col in df_imputed.columns:
                df_imputed[col] = df_imputed[col].fillna(0).astype(np.float64)
            else:
                df_imputed[col] = 0.0
                
        # Impute categorical columns with 'Unknown'
        for col in self.CATEGORICAL_COLS:
            if col in df_imputed.columns:
                df_imputed[col] = df_imputed[col].fillna('Unknown')
        
        # Use most_frequent strategy for remaining columns
        numerical_cols = df_imputed.select_dtypes(include=[np.number]).columns
        for col in numerical_cols:
            if df_imputed[col].isnull().any():
                # Use mode for imputation (most_frequent strategy)
                most_freq_value = df_imputed[col].mode()[0]
                df_imputed[col] = df_imputed[col].fillna(most_freq_value)
        
        return df_imputed

    def engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Feature engineering step - creates datetime components and derived features"""
        df_eng = df.copy()
        
        # Process datetime columns
        for col in self.DATETIME_COLS:
            if col in df_eng.columns:
                try:
                    df_eng[col] = pd.to_datetime(df_eng[col], errors='coerce')
                    
                    # Create date components
                    df_eng[f'{col}Year'] = df_eng[col].dt.year.astype(np.float64)
                    df_eng[f'{col}Month'] = df_eng[col].dt.month.astype(np.float64)
                    df_eng[f'{col}Day'] = df_eng[col].dt.day.astype(np.float64)
                    df_eng[f'{col}Hour'] = df_eng[col].dt.hour.astype(np.float64)
                    
                except Exception as e:
                    print(f"Error processing date column {col}: {str(e)}")
                    # Create default columns if date processing fails
                    df_eng[f'{col}Year'] = 2023.0  # Default values
                    df_eng[f'{col}Month'] = 1.0
                    df_eng[f'{col}Day'] = 1.0
                    df_eng[f'{col}Hour'] = 0.0
        
        # Calculate time between accident and claim
        if all(col in df_eng.columns for col in self.DATETIME_COLS):
            if pd.api.types.is_datetime64_any_dtype(df_eng['AccidentDate']) and pd.api.types.is_datetime64_any_dtype(df_eng['ClaimDate']):
                df_eng['AccidentClaimDeltaInDays'] = (df_eng['ClaimDate'] - df_eng['AccidentDate']).dt.days.astype(np.float64)
            else:
                df_eng['AccidentClaimDeltaInDays'] = 30.0  # Default value
        else:
            df_eng['AccidentClaimDeltaInDays'] = 30.0  # Default value
        
        # Process InjuryPrognosis
        if self.PROGNOSIS_COL in df_eng.columns:
            # Ensure the column follows the expected pattern "X months"
            df_eng[self.PROGNOSIS_COL] = df_eng[self.PROGNOSIS_COL].apply(
                lambda x: self.extract_months(x)
            )
            
            # Extract duration in months
            df_eng['PrognosisDurationMonths'] = df_eng[self.PROGNOSIS_COL].str.extract(
                r'(\d+)'
            ).astype(float)
            
            # Calculate prognosis end date
            if 'AccidentDate' in df_eng.columns and pd.api.types.is_datetime64_any_dtype(df_eng['AccidentDate']):
                df_eng['PrognosisEndDate'] = df_eng['AccidentDate'] + pd.to_timedelta(
                    df_eng['PrognosisDurationMonths'] * 30, unit='D'
                )
                
                # Add components for PrognosisEndDate
                df_eng['PrognosisEndDateYear'] = df_eng['PrognosisEndDate'].dt.year.astype(np.float64)
                df_eng['PrognosisEndDateMonth'] = df_eng['PrognosisEndDate'].dt.month.astype(np.float64)
                df_eng['PrognosisEndDateDay'] = df_eng['PrognosisEndDate'].dt.day.astype(np.float64)
                
                # Convert to days for model
                df_eng['InjuryPrognosisInDays'] = df_eng['PrognosisDurationMonths'] * 30
            else:
                # Default values if accident date is not available
                df_eng['InjuryPrognosisInDays'] = df_eng['PrognosisDurationMonths'] * 30
                df_eng['PrognosisEndDateYear'] = 2023.0
                df_eng['PrognosisEndDateMonth'] = 1.0
                df_eng['PrognosisEndDateDay'] = 1.0
        else:
            # Default values if prognosis column is not available
            df_eng['PrognosisDurationMonths'] = 3.0  # Default value
            df_eng['InjuryPrognosisInDays'] = 90.0   # Default value (3 months)
            df_eng['PrognosisEndDateYear'] = 2023.0
            df_eng['PrognosisEndDateMonth'] = 1.0
            df_eng['PrognosisEndDateDay'] = 1.0
        
        # Apply cyclical encoding to relevant columns
        df_eng = self.apply_cyclical_encoding(df_eng)
        
        return df_eng
    
    def apply_cyclical_encoding(self, df: pd.DataFrame) -> pd.DataFrame:
        """Apply sine and cosine transformations to cyclical features"""
        date_components = []
        
        # Find all date component columns
        for col in df.columns:
            for period_key in self.period_dict.keys():
                if period_key in col and 'Year' not in col:
                    date_components.append(col)
        
        # Apply cyclical encoding to each component
        for col in date_components:
            period_key = next((key for key in self.period_dict if key in col), None)
            if period_key:
                period = self.period_dict[period_key]
                df[f'{col}Sine'] = np.sin(2 * np.pi * df[col] / period)
                df[f'{col}Cosine'] = np.cos(2 * np.pi * df[col] / period)
                # Keep original columns for now - we'll handle them in final processing
        
        return df

    # Fix here: change 'str | float | int' to 'Union[str, float, int]'
    def extract_months(self, value: Union[str, float, int]) -> str:
        """Extract months from InjuryPrognosis value and format consistently"""
        if pd.isna(value):
            return "3 months"  # Default value
            
        match = re.search(r'(\d+)', str(value))
        if match:
            return f"{match.group(1)} months"
        return "3 months"  # Default value

    def apply_final_processing(self, df: pd.DataFrame) -> pd.DataFrame:
        """Apply final preprocessing steps including scaling and encoding"""
        df_final = df.copy()
        
        # Apply min-max scaling to numeric columns
        numeric_cols = df_final.select_dtypes(include=[np.number]).columns.tolist()
        
        # Exclude any sine/cosine columns which are already scaled
        numeric_cols = [col for col in numeric_cols 
                        if not (col.endswith('Sine') or col.endswith('Cosine'))]
        
        # Min-max scale numeric columns
        for col in numeric_cols:
            if col in df_final.columns:
                # Simple min-max scaling: (x - min) / (max - min)
                # For simplicity using fixed ranges based on domain knowledge
                if 'Year' in col:
                    df_final[col] = (df_final[col] - 2000) / 50  # Assuming years between 2000-2050
                elif 'Month' in col or 'Day' in col:
                    df_final[col] = df_final[col] / 31  # Normalize by max possible value
                elif 'Hour' in col:
                    df_final[col] = df_final[col] / 24  # Normalize by max possible value
                elif col == 'AccidentClaimDeltaInDays':
                    df_final[col] = df_final[col] / 365  # Normalize by approximately a year
                elif col == 'InjuryPrognosisInDays':
                    df_final[col] = df_final[col] / 1095  # Normalize by approximately 3 years
                elif col in self.SPECIAL_COST_COLS or 'Special' in col:
                    # Apply log1p transformation and then scale (common for monetary values)
                    df_final[col] = np.log1p(df_final[col]) / 10  # Arbitrary scaling
                elif col.startswith('Total_') or col == 'PrognosisDurationMonths':
                    df_final[col] = np.log1p(df_final[col]) / 10  # Arbitrary scaling
        
        # Drop original datetime columns and any intermediate columns
        columns_to_drop = []
        
        # Drop original datetime columns
        columns_to_drop.extend([col for col in self.DATETIME_COLS if col in df_final.columns])
        
        # Drop PrognosisEndDate if it exists
        if 'PrognosisEndDate' in df_final.columns:
            columns_to_drop.append('PrognosisEndDate')
        
        # Drop original cyclical columns after encoding
        for col in df_final.columns:
            for period_key in self.period_dict.keys():
                if period_key in col and not (col.endswith('Sine') or col.endswith('Cosine')) and 'Year' not in col:
                    columns_to_drop.append(col)
        
        # Drop InjuryPrognosis after processing
        if self.PROGNOSIS_COL in df_final.columns:
            columns_to_drop.append(self.PROGNOSIS_COL)
        
        # Drop PrognosisDurationMonths after processing
        if 'PrognosisDurationMonths' in df_final.columns:
            columns_to_drop.append('PrognosisDurationMonths')
        
        # Remove duplicates and drop columns that exist
        columns_to_drop = list(set(columns_to_drop))
        columns_to_drop = [col for col in columns_to_drop if col in df_final.columns]
        df_final = df_final.drop(columns=columns_to_drop)
        
        # One-hot encode the categorical variables
        for col in self.CATEGORICAL_COLS:
            if col in df_final.columns:
                # Get dummies (one-hot encoding)
                dummies = pd.get_dummies(df_final[col], prefix=col, prefix_sep='__')
                
                # Drop the original column and join with dummies
                df_final = df_final.drop(columns=[col])
                df_final = pd.concat([df_final, dummies], axis=1)
        
        # Select only numeric columns for final output
        numeric_cols = df_final.select_dtypes(include=np.number).columns
        df_final = df_final[numeric_cols]
        
        return df_final