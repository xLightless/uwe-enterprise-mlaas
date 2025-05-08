"""
Preprocessing module for data preparation tasks.

Written by Reece Turner, 22036698.
"""

from .encoding import Encoder
from .imputing import Imputer
from .scaling import Scaler
from .standardizer import DataStandardizer
from .preprocessor import DataPreprocessor

from ..types.experimental.mars.mars import (
    MARS,
)

__all__ = [
    "DataPreprocessor",
    "DataStandardizer",
    "Encoder",
    "Scaler",
    "Imputer",
    "MARS"
]
