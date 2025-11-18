# Causal Graphical Models - Advanced Exercises

This repository contains solutions to two advanced exercises on Causal Graphical Models from Chapter 4, focusing on causal discovery and counterfactual analysis in medical decision-making scenarios.

## 📁 Repository Structure

```
.
├── medical_causal_data.csv          # Simulated medical dataset
├── question1_solution.ipynb         # PC algorithm implementation for causal discovery
├── question2_solution.ipynb         # Counterfactual analysis comparing P(Y|X) vs P(Y|do(X))
├── learned_causal_graph.png         # Generated causal graph visualization
└── README.md                        # This file
```

## 📊 Dataset Description

The `medical_causal_data.csv` file contains simulated medical data with the following variables:

- **Disease**: Underlying medical condition (latent cause)
  - Categories: `No Disease`, `Influenza`, `Pneumonia`, `Bronchitis`
- **Symptoms**: Clinical manifestations observed in patients
  - Categories: `No Symptoms`, `Mild Cough`, `Fever+Cough`, `Fever+Fatigue`, `Cough+Headache`, `High Fever+Cough`, `Chest Pain+Shortness of Breath`, `Persistent Cough`, `Cough+Wheezing`
- **Test_Result**: Diagnostic test outcomes
  - Categories: `Normal`, `Borderline`, `Positive Flu`, `Inconclusive`, `Chest X-ray Abnormal`, `Inflammatory Markers High`, `Lung Function Reduced`
- **Diagnosis**: Final medical decision based on symptoms and test results
  - Categories: `Observation`, `Further Testing`, `Standard Treatment`, `Aggressive Treatment`

### Causal Structure
The data follows the underlying causal graph:
```
Disease → Symptoms
Disease → Test_Result
Symptoms → Diagnosis
Test_Result → Diagnosis
```

## 🧪 Exercise Solutions

### Exercise 1: PC Algorithm for Causal Discovery

**File**: `question1_solution.ipynb`

#### Objective
Implement the PC algorithm on simulated medical data to recover the underlying Directed Acyclic Graph (DAG) and evaluate edge detection performance using precision and recall metrics.

#### Key Features
- **Input**: `medical_causal_data.csv` (medical dataset with categorical variables)
- **Output**: 
  - Learned causal graph structure
  - Precision, Recall, and F1-score evaluation metrics
  - Visualization of the discovered causal graph (`learned_causal_graph.png`)
  - Structural accuracy analysis

#### Main Functionality
1. **Data Preprocessing**: Encodes categorical medical data into numerical format
2. **Causal Discovery**: Applies PC algorithm with chi-squared conditional independence tests
3. **Performance Evaluation**: Compares learned edges against ground truth causal structure
4. **Visualization**: Generates and displays the causal graph
5. **Domain Analysis**: Provides medical interpretation of discovered causal relationships

#### Expected Output
- Adjacency matrix of learned causal structure
- Precision/Recall metrics for edge detection
- Visual graph representation
- Medical domain interpretation of causal directions

### Exercise 2: Counterfactual Analysis in Medical Decision Making

**File**: `question2_solution.ipynb`

#### Objective
Construct a counterfactual medical scenario comparing observational associations P(Y|X) with interventional effects P(Y|do(X)), demonstrating the impact of confounding and the importance of causal reasoning.

#### Key Features
- **Input**: `medical_causal_data.csv` (medical dataset)
- **Output**:
  - Observational probabilities P(Diagnosis | Test_Result)
  - Interventional probabilities P(Diagnosis | do(Test_Result))
  - Comparative analysis and bias quantification
  - Counterfactual scenario predictions
  - Average Treatment Effect (ATE) calculations

#### Main Functionality
1. **Observational Analysis**: Computes conditional probabilities from observed data
2. **Interventional Analysis**: Uses backdoor adjustment to estimate causal effects
3. **Bias Quantification**: Measures confounding bias between observational and interventional estimates
4. **Counterfactual Reasoning**: Predicts outcomes under hypothetical interventions
5. **Treatment Effect Analysis**: Calculates Average Treatment Effects across different test scenarios

#### Expected Output
- Side-by-side comparison of observational vs interventional probabilities
- Visualization of probability differences across test results
- Counterfactual predictions for policy changes
- Confounding bias analysis and ATE calculations

## 🛠️ Installation & Dependencies

To run the code in this repository, install the required packages:

```bash
pip install pandas numpy scikit-learn matplotlib causallearn
```

## 🚀 Usage

1. **Run Exercise 1**:
   ```bash
   jupyter notebook question1_solution.ipynb
   ```
   This will generate the causal graph and performance metrics.

2. **Run Exercise 2**:
   ```bash
   jupyter notebook question2_solution.ipynb
   ```
   This will perform the counterfactual analysis and generate comparative visualizations.

## 📈 Key Findings

### From Exercise 1
- The PC algorithm successfully recovers the underlying causal structure from observational medical data
- Precision and recall metrics quantify the algorithm's performance in edge detection
- Medical domain knowledge validates the directionality of discovered causal relationships

### From Exercise 2
- Significant differences between P(Y|X) and P(Y|do(X)) demonstrate substantial confounding bias
- Backdoor adjustment correctly accounts for the confounding effect of Disease
- Counterfactual analysis provides insights for medical policy decisions and test strategy optimization

## 🎯 Educational Value

This repository demonstrates:
- Practical implementation of causal discovery algorithms
- Importance of distinguishing correlation from causation
- Application of do-calculus and backdoor adjustment in real-world scenarios
- Interpretation of causal graphs in domain-specific contexts
- Counterfactual reasoning for policy and decision analysis