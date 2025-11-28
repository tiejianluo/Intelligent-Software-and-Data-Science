# Solutions of Advanced Exercises in Chapter 8: Advanced Prediction and Uncertainty Quantification

This repository contains solutions for advanced exercises in Chapter 8, focusing on Out-of-Distribution (OoD) detection and confidence-based decision systems in maritime FastShip operations.

## 📁 Repository Structure

```
├── fastship_dataset.csv          # Synthetic FastShip operational dataset
├── question1_solution.ipynb      # Deep ensembles for OoD uncertainty evaluation
├── question2_solution.ipynb      # Confidence-gated control system implementation
└── README.md                    # This file
```

## 📊 Dataset: fastship_dataset.csv

The synthetic dataset simulates FastShip operational parameters with both normal and abnormal (OoD) conditions:

- **speed**: Ship velocity in knots (normal: ~25±5, abnormal: ~40±8)
- **engine_temp**: Engine temperature in °C (normal: ~85±10, abnormal: ~110±15)
- **fuel_consumption**: Fuel consumption rate (normal: ~120±20, abnormal: ~200±30)
- **vibration**: Vibration levels (normal: ~2±0.5, abnormal: ~5±1)
- **cargo_weight**: Cargo weight in tons (normal: ~5000±1000, abnormal: ~8000±1500)
- **label**: Binary classification (0: normal operation, 1: OoD/abnormal condition)

**Dataset Statistics:**
- Total samples: 1,000
- Normal operations: 800 samples
- OoD/abnormal conditions: 200 samples

## 🔬 Question 1: Deep Ensembles for OoD Uncertainty

**File:** `question1_solution.ipynb`

### Overview
Implements deep ensemble methods to evaluate uncertainty in Out-of-Distribution (OoD) samples and analyzes how ensemble size affects detection performance.

### Inputs
- `fastship_dataset.csv`: Ship operational data with normal and OoD samples
- Ensemble sizes: [1, 3, 5, 10] models

### Outputs
- **Accuracy metrics** for each ensemble size
- **Uncertainty quantification** using predictive entropy
- **Visualizations**:
  - Accuracy vs. Ensemble Size
  - Uncertainty Gap (OoD vs Normal) vs. Ensemble Size
  - Uncertainty distribution across different ensemble sizes
- `ensemble_ood_analysis.png`: Comprehensive analysis plot

### Key Features
- **Multiple Random Forest classifiers** as ensemble members
- **Predictive entropy** calculation for uncertainty measurement
- **Comparative analysis** of ensemble scaling benefits
- **OoD detection performance** evaluation

### Main Findings
- Larger ensembles generally improve OoD detection
- Uncertainty gap between normal and OoD samples increases with ensemble size
- Optimal ensemble size analysis for practical deployment

## 🎯 Question 2: Confidence-Gated Control System

**File:** `question2_solution.ipynb`

### Overview
Implements a confidence-based decision system that uses uncertainty quantification to gate automatic decisions, requiring human intervention for low-confidence predictions.

### Inputs
- `fastship_dataset.csv`: Ship operational data
- Trained ensemble model from Question 1
- Confidence thresholds: 0.5 to 0.95 (in steps of 0.05)

### Outputs
- **Optimal confidence threshold** recommendation
- **Coverage vs. Accuracy trade-off** analysis
- **Human intervention workload** estimation
- **Decision system performance** metrics
- **Visualizations**:
  - Coverage vs. Selective Accuracy across thresholds
  - Human intervention requirements
  - Confidence distribution with threshold markers
- `confidence_based_control.png`: Strategy performance plot

### Key Features
- **Adaptive decision making** based on prediction confidence
- **Threshold optimization** for balancing automation and safety
- **Real-time decision examples** with confidence scores
- **Workload analysis** for human operators

### Practical Applications
- **Automated alert systems** for ship operations
- **Risk-based decision gates** in maritime safety
- **Resource allocation** for human monitoring
- **Uncertainty-aware** autonomous systems

