# Solutions of Advanced Exercises in Chapter 6: Engineering for Robustness — Causality and OoD Generalization

This repository contains solutions to two advanced exercises in Chapter 6. The solutions demonstrate how to build machine learning models that maintain performance under distribution shifts using causal invariance principles and Bayesian uncertainty.

## 📁 Repository Structure

```
.
├── wilds_reviews.csv              # Generated WILDS-style dataset for Question 1
├── fastship_data.csv              # Generated FastShip logistics dataset for Question 2
├── question1_solution.ipynb       # Solution for Advanced Exercise 1
├── question2_solution.ipynb       # Solution for Advanced Exercise 2
└── README.md                      # This file
```

## 🎯 Exercises Solved

### Advanced Exercise 1
**Implement IRM on WILDS dataset and evaluate OOD performance**

- **Objective**: Implement Invariant Risk Minimization (IRM) on a real-world style dataset and evaluate its out-of-distribution generalization capabilities
- **Dataset**: WILDS-style Amazon Reviews simulation
- **Approach**: Compare traditional ERM vs IRM performance across different user groups

### Advanced Exercise 2  
**Embed IRM in PPL model for causal invariance + Bayesian uncertainty**

- **Objective**: Combine causal invariance with Bayesian uncertainty estimation for robust predictions
- **Scenario**: FastShip logistics demand forecasting with holiday effects
- **Approach**: Bayesian IRM that provides both accurate predictions and uncertainty estimates

## 📊 Dataset Descriptions

### WILDS Reviews Dataset (`wilds_reviews.csv`)

Simulated Amazon-style review dataset for studying performance disparities across users:

| Column | Description | Type |
|--------|-------------|------|
| `reviewer_id` | Unique identifier for each reviewer | Integer (0-49) |
| `rating` | Star rating from 1 to 5 | Integer |
| `text_feature_0` to `text_feature_9` | 10-dimensional text embedding features | Float |
| `split` | Data split: 'train' or 'test' | String |

**Key Characteristics**:
- 5,000 total samples, 50 unique reviewers
- Training and test sets have disjoint reviewer sets
- Simulates real-world scenario where models deploy to new users

### FastShip Logistics Dataset (`fastship_data.csv`)

Simulated logistics demand forecasting dataset with distribution shifts:

| Column | Description | Type |
|--------|-------------|------|
| `date` | Daily timestamp | Date |
| `environment` | Environment label: 0=weekday, 1=holiday | Integer |
| `economic_index` | Causal feature: macroeconomic indicator | Float |
| `trend` | Causal feature: long-term trend | Float |
| `spurious_power` | Spurious feature: environment-dependent | Float |
| `orders` | Target variable: daily order volume | Float |
| `split` | Data split: 'train' or 'test' | String |

**Key Characteristics**:
- 3,000 daily samples with holiday/weekday patterns
- Different data generation mechanisms for weekdays vs holidays
- Training set contains mostly weekday data, test set has mixed distribution

## 🛠️ Solution Implementations

### Question 1 Solution (`question1_solution.ipynb`)

**Invariant Risk Minimization on WILDS Dataset**

**Inputs**:
- `wilds_reviews.csv`: Multi-class sentiment classification data
- Training environments: First 25 reviewers
- Test environments: Remaining 25 reviewers (OoD)

**Outputs**:
- Trained IRM model for sentiment classification
- Performance comparison: ERM vs IRM
- OOD generalization metrics across user groups

**Key Features**:
- Implements IRM loss with gradient penalty
- 5-class sentiment classification (ratings 1-5)
- Cross-user generalization evaluation
- Simple neural network architecture

**Main Functions**:
- `generate_wilds_dataset()`: Creates synthetic WILDS-style data
- `irm_loss()`: Computes invariant risk minimization objective
- `train_irm_wilds()`: Trains and evaluates IRM model

### Question 2 Solution (`question2_solution.ipynb`)

**Bayesian IRM for FastShip Logistics Forecasting**

**Inputs**:
- `fastship_data.csv`: Logistics demand data with environment labels
- Features: economic_index, trend, spurious_power
- Target: orders (daily demand volume)

**Outputs**:
- Bayesian IRM model with uncertainty estimates
- Performance analysis: weekday vs holiday environments
- Uncertainty calibration metrics
- OOD generalization analysis

**Key Features**:
- Combines IRM causal invariance with Bayesian uncertainty
- Monte Carlo dropout for approximate Bayesian inference
- Environment-aware risk minimization
- Uncertainty-quantified predictions

**Main Functions**:
- `generate_fastship_dataset()`: Creates logistics forecasting data
- `BayesianIRM`: Neural network with uncertainty estimation
- `bayesian_irm_loss()`: Joint causal + uncertainty objective
- `train_bayesian_irm_fastship()`: End-to-end training and evaluation
