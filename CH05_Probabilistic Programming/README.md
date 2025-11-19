# Solutions of Advanced Exercises in Chapter 5: Probabilistic Programming — A Language for Generative Models

This repository contains solutions to two advanced exercises, demonstrating hierarchical Bayesian modeling and causal inference using Pyro.

## 📁 Repository Structure

```
.
├── causal_advertising_data.csv     # Generated advertising scenario dataset
├── question1_solution.ipynb        # Two-level Hierarchical Bayesian Model
├── question2_solution.ipynb        # Causal Inference Analysis
└── README.md                       # This file
```

## 📊 Dataset: causal_advertising_data.csv

The dataset simulates a realistic advertising scenario with clear causal relationships between variables. It contains 1,000 records with the following features:

### Features:
- **user_id**: Unique identifier for each user (e.g., USER_0001)
- **user_segment**: Demographic segments (Young_Professional, Family_Oriented, Student_Budget, Senior_Conservative, Tech_Enthusiast)
- **region**: Geographic regions (North_America, Europe, Asia_Pacific, Latin_America)
- **ad_campaign**: Advertising types (Social_Media_Promo, Search_Engine_Ad, Email_Campaign, Video_Commercial)
- **ad_intensity**: Exposure levels (Light_Exposure, Medium_Exposure, Heavy_Exposure)
- **click_behavior**: User engagement levels (No_Click, Quick_View, Detailed_Engagement, Shared_Content)
- **purchase_decision**: Conversion outcomes (No_Purchase, Small_Order, Medium_Order, Large_Order)
- **customer_satisfaction**: Post-purchase feedback (Very_Unsatisfied, Somewhat_Unsatisfied, Neutral, Somewhat_Satisfied, Very_Satisfied)
- **campaign_date**: Timestamp of ad exposure
- **session_duration_sec**: Duration of user session in seconds

### Causal Structure:
The data follows a clear causal pathway: `ad_campaign → click_behavior → purchase_decision → customer_satisfaction`, making it ideal for causal inference exercises.

## 🧠 Exercise Solutions

### 1. Question 1: Two-Level Hierarchical Bayesian Model (`question1_solution.ipynb`)

**Objective**: Build a two-level hierarchical Bayesian model in Pyro and perform inference.

#### Input:
- `causal_advertising_data.csv`: Advertising scenario dataset
- Encoded categorical variables (user_segment, region, ad_campaign, etc.)
- Numerical features (session_duration_sec)

#### Output:
- Posterior distributions of model parameters
- Hierarchical effects for user segments and ad campaigns
- Model diagnostics and convergence statistics
- Comparison of random effects across levels

#### Key Functions:

##### `prepare_data_for_model(df)`
- **Input**: Raw pandas DataFrame
- **Output**: Encoded numerical data dictionary and label encoders
- **Function**: Preprocesses categorical variables and prepares data for Pyro model

##### `hierarchical_bayesian_model(encoded_data)`
- **Input**: Dictionary of encoded numerical data
- **Output**: Pyro model trace
- **Function**: Implements two-level hierarchical model with:
  - Level 1: User segment random effects
  - Level 2: Ad campaign random effects
  - Fixed effects for click behavior and session duration

##### `run_bayesian_inference(df, num_samples=1000)`
- **Input**: Raw DataFrame and number of MCMC samples
- **Output**: Inference results dictionary with posterior samples and model diagnostics
- **Function**: Performs Bayesian inference using NUTS sampler and analyzes hierarchical effects

#### Main Features:
- **Hierarchical Structure**: Models variability at both user segment and ad campaign levels
- **Bayesian Inference**: Uses MCMC with NUTS sampler for robust parameter estimation
- **Uncertainty Quantification**: Provides full posterior distributions for all parameters
- **Model Comparison**: Compares effect sizes across different hierarchical levels

### 2. Question 2: Causal Inference Analysis (`question2_solution.ipynb`)

**Objective**: Implement generation, intervention, and counterfactual analysis for a causal advertising scenario.

#### Input:
- `causal_advertising_data.csv`: Advertising scenario dataset
- Specific intervention scenarios (e.g., forced ad campaigns)
- Individual user profiles for counterfactual analysis

#### Output:
- Intervention analysis results with Average Treatment Effects (ATE)
- Counterfactual distributions for individual users
- Causal effect estimates and improvement probabilities
- Complete causal inference summary

#### Key Functions:

##### `causal_graphical_model(ad_campaign, user_segment, region)`
- **Input**: Encoded ad campaign, user segment, and region
- **Output**: Generated data point dictionary
- **Function**: Implements Structural Causal Model (SCM) defining causal mechanisms between variables

##### `do_intervention_analysis(df, intervention_ad_campaign)`
- **Input**: DataFrame and specific ad campaign for intervention
- **Output**: Intervention effects across user segments
- **Function**: Performs do-calculus intervention to estimate causal effects and computes Average Treatment Effect (ATE)

##### `counterfactual_analysis(df, user_id, alternative_ad_campaign)`
- **Input**: DataFrame, specific user ID, and alternative ad strategy
- **Output**: Counterfactual results and improvement probabilities
- **Function**: Estimates what would have happened if a specific user received different treatment

##### `run_causal_analysis(df)`
- **Input**: Complete DataFrame
- **Output**: Comprehensive causal analysis results
- **Function**: Integrates all causal reasoning levels (observation, intervention, counterfactuals)

#### Three Levels of Causal Reasoning:

1. **Generation**: Implements SCM to generate data consistent with causal assumptions
2. **Intervention**: Answers "What if?" questions by modeling forced changes to the system
3. **Counterfactuals**: Answers "What would have happened?" for specific individuals under alternative scenarios

## 🛠️ Technical Requirements

```bash
pip install pyro-ppl torch pandas numpy scikit-learn
```

## 🚀 Quick Start

1. **Generate Data** (if needed):
```python
from data_generator import generate_causal_data
df = generate_causal_data(1000)
```

2. **Run Hierarchical Bayesian Analysis**:
```python
# In question1_solution.ipynb
bayesian_results = run_bayesian_inference(df)
```

3. **Perform Causal Inference**:
```python
# In question2_solution.ipynb
causal_results = run_causal_analysis(df)
```

## 📈 Key Insights

### From Hierarchical Model:
- Quantifies variability attributable to different user segments
- Identifies most effective ad campaigns accounting for hierarchical structure
- Provides uncertainty estimates for all model parameters

### From Causal Analysis:
- Estimates causal effects of different advertising strategies
- Identifies heterogeneous treatment effects across user segments
- Provides personalized counterfactual predictions

## 🔬 Educational Value

This repository demonstrates:
- **Probabilistic Programming**: Using Pyro for complex statistical models
- **Hierarchical Modeling**: Accounting for grouped data structures
- **Causal Inference**: Moving beyond correlation to causation
- **Bayesian Methods**: Full uncertainty quantification
- **Real-world Applications**: Practical advertising scenario modeling