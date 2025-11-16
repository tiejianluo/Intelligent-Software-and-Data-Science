# Solutions of Advanced Exercises in Chapter 1

## Repository Overview
This repository contains complete solutions to the two advanced exercises in Chapter 1, focusing on logistics delay prediction, causal modeling, and out-of-distribution (OOD) robustness. Each exercise solution includes executable code, result analysis, and documentation to reproduce the findings.


## Exercise Solutions Mapping
| Exercise Number | Corresponding File | Core Focus |
|-----------------|--------------------|------------|
| Exercise 1      | `question1_solution.ipynb` | Reproduce "mini logistics delay" study, model comparison (AUC/ECE/abstention/uplift) |
| Exercise 2      | `question2_solution.ipynb` | Virtual intervention on actionable features, causal consistency testing |


## Exercise 1: Reproduce "Mini Logistics Delay" Study
### Task Description
Reproduce the "mini logistics delay" study by comparing 5 model variants across 4 metrics, using both in-distribution (IID) and out-of-distribution (OOD: extreme weather/holidays) data subsets.

### Model Variants to Compare
- Baseline: Standard predictive model without enhancements
- +Calibration: Baseline with probability calibration
- +Abstention: Model with abstention mechanism (avoids uncertain predictions)
- +Causal-Sensitivity: Model optimized for causal sensitivity to distribution shifts
- +Policy-Estimation: Model integrated with policy estimation for decision-making

### Evaluation Metrics
- **AUC**: Area Under ROC Curve (measures classification performance)
- **ECE**: Expected Calibration Error (measures prediction probability calibration)
- **Abstention**: Rate of predictions the model chooses to abstain from
- **Uplift**: Improvement in decision-making outcomes compared to the baseline

### Deliverables in `question1_solution.ipynb`
1. Code for data loading, preprocessing, and model training
2. Environment configuration (dependencies, versions)
3. Tabular results of model performance across IID/OOD subsets
4. Analysis of failure cases (e.g., scenarios where models underperform)


## Exercise 2: Virtual Intervention on Actionable Features
### Task Description
Conduct a **virtual intervention** on the actionable feature `truck_allocation` (vehicle allocation) to test causal consistency, and propose fixes for inconsistencies.

### Key Steps
1. **Define Feasible Bounds**: Identify valid ranges for `truck_allocation` (e.g., 1–10 vehicles per route).
2. **Virtual Intervention**: Systematically vary `truck_allocation` within feasible bounds and record model predictions.
3. **Causal Consistency Check**: Verify if predicted direction (e.g., "more trucks → lower delay") matches **business-feasible actions** (e.g., operational knowledge confirms more trucks reduce delays).
4. **Fix Inconsistencies**: If predictions conflict with business logic, implement one or more of the following fixes:
   - Feature decoupling (separate correlated features affecting `truck_allocation`)
   - Structural regularization (penalize non-causal feature relationships)
   - Policy simulation (validate predictions against simulated business policies)

### Deliverables in `question2_solution.ipynb`
1. Code for virtual intervention setup and execution
2. Visualization of prediction changes as `truck_allocation` varies
3. Causal consistency assessment report
4. Implementation and evaluation of proposed fixes (if inconsistencies exist)


## Dataset: `logistics_delay_dataset.csv`
This synthetic dataset supports both exercises by simulating logistics and delivery operations, including IID and OOD scenarios.

### Overview
The dataset is designed to evaluate machine learning models on:
- Causal modeling
- Distribution shift robustness (IID vs. OOD)
- Intervention analysis on actionable features

### File Structure
| File Name | Purpose |
|-----------|---------|
| `logistics_delay_dataset.csv` | Main dataset with features and target variable |
| `data_dictionary.csv` | Detailed description of all columns (e.g., data types, value ranges) |

### Key Feature Categories
#### 1. Core Predictive Features
- `weather_severity`: Weather conditions (0=good, 1=severe)
- `traffic_congestion`: Road traffic levels (0=low, 5=high)
- `warehouse_congestion`: Warehouse processing delays (minutes)
- `driver_experience`: Driver skill (0=novice, 4=expert)
- `truck_allocation`: Actionable feature (number of trucks allocated to the route)
- `route_complexity`: Route difficulty (0=simple, 3=complex)
- `package_volume`: Package size indicator (0=small, 2=large)
- `time_sensitivity`: Delivery urgency (0=low, 3=high)

#### 2. Temporal Features
- `date`: Simulated delivery dates (2024 calendar year)
- `day_of_week`: Numeric day (0=Monday, 6=Sunday)
- `month`: Numeric month (1=January, 12=December)
- `is_weekend`: Binary flag (1=weekend, 0=weekday)

#### 3. Scenario Indicators (OOD Flags)
- `is_holiday_season`: Binary flag (1=holiday months: Nov–Dec, 0=non-holiday)
- `is_extreme_weather`: Binary flag (1=severe weather events, 0=normal)

#### 4. Target Variable
- `delayed`: Binary target (1=delivery delayed, 0=delivery on time)

### Dataset Splits
The dataset includes pre-defined splits to support exercise tasks:

| Split Name | Distribution Type | Purpose |
|------------|-------------------|---------|
| `train` | IID | Model training |
| `val_iid` | IID | IID validation (hyperparameter tuning) |
| `test_iid` | IID | IID performance evaluation |
| `test_extreme_weather` | OOD | Evaluation under extreme weather |
| `test_holiday` | OOD | Evaluation during holidays |
| `intervention` | Special | Causal intervention experiments on `truck_allocation` |

