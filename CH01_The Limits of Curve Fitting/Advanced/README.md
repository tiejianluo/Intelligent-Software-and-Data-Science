# Logistics Delay Prediction Dataset

## Overview
This synthetic dataset simulates logistics and delivery operations for evaluating machine learning models under various conditions, including in-distribution (IID) and out-of-distribution (OOD) scenarios. The dataset is designed to support exercises in causal modeling, distribution shift robustness, and intervention analysis.

## Dataset Structure

### Main File
- `logistics_delay_dataset.csv`: Main dataset with features and target variable

### Supporting File
- `data_dictionary.csv`: Detailed description of all columns

## Key Features

### Core Predictive Features
- `weather_severity`: Weather conditions (0=good, 1=severe)
- `traffic_congestion`: Road traffic levels
- `warehouse_congestion`: Warehouse processing delays
- `driver_experience`: Driver skill and experience
- `truck_allocation`: Resource allocation (ACTIONABLE feature)
- `route_complexity`: Delivery route difficulty
- `package_volume`: Package size indicator
- `time_sensitivity`: Delivery urgency

### Temporal Features
- `date`: Simulated delivery dates throughout 2024
- `day_of_week`, `month`, `is_weekend`: Temporal indicators

### Scenario Indicators
- `is_holiday_season`: Flags holiday months (OOD scenario)
- `is_extreme_weather`: Flags severe weather conditions (OOD scenario)

### Target Variable
- `delayed`: Binary target (1=delayed, 0=on-time delivery)

## Dataset Splits

### Training and Standard Evaluation
- `train`: Main training data (IID distribution)
- `val_iid`: Validation set (IID distribution)
- `test_iid`: Test set (IID distribution)

### Out-of-Distribution (OOD) Scenarios
- `test_extreme_weather`: Test under extreme weather conditions
- `test_holiday`: Test during holiday seasons

### Intervention Analysis
- `intervention`: Special split for causal intervention experiments on `truck_allocation` feature