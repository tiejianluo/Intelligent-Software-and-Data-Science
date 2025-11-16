# Solutions of Advanced Exercises in Chapter 3

This repository contains two solutions for the advanced problems from **Chapter 3: Foundations of Probabilistic Modeling**, demonstrating practical implementations of Bayesian inference methods.

## 📁 Files Overview

### 1. `question1_solution.ipynb` - Variational Inference with Gaussian Approximation

**Problem Statement**: Implement a minimal VI routine with a Gaussian `q(θ)`; plot ELBO convergence.

#### 🔧 Key Features
- **Core Algorithm**: Variational Inference with Gaussian variational posterior
- **Distribution**: Uses Gaussian `q(θ) = N(μ, σ²)` to approximate true posterior
- **Optimization**: Maximizes Evidence Lower Bound (ELBO) via gradient descent
- **Visualization**: ELBO convergence tracking and posterior distribution comparison

#### 📊 Inputs
- **Generated Data**: 100 samples from true Gaussian distribution `N(3.0, 1.5)`
- **Prior**: Gaussian prior `p(θ) = N(0, 3)`
- **Likelihood**: Gaussian likelihood with fixed observation noise

#### 📈 Outputs
- **Optimized Parameters**: Variational mean `μ` and standard deviation `σ`
- **Convergence Plot**: ELBO values over training epochs
- **Distribution Comparison**: True posterior vs. variational approximation
- **Performance Metrics**: Final parameter estimates vs. ground truth

#### 🚀 Usage
```python
# Generate data and run training
x = generate_data(n_samples=100)
q, elbo_history = train_vi(x, num_epochs=1000, lr=0.01)

# Access results
final_mu = q.mu.item()
final_sigma = torch.nn.functional.softplus(q.log_sigma).item()
```

---

### 2. `question2_solution.ipynb` - Beta-Binomial Model for FastShip Forecasting

**Problem Statement**: Embed the Beta–Binomial updater into FastShip's rolling forecast; report credible intervals over time.

#### 🔧 Key Features
- **Core Model**: Bayesian Beta-Binomial conjugate model with rolling updates
- **Comparison**: Traditional sliding window model vs. Bayesian approach
- **Anomaly Detection**: Special handling for holiday periods with significant fluctuations
- **Uncertainty Quantification**: 95% credible intervals for all predictions

#### 📊 Inputs
- **Simulated Data**: 14 days of hourly shipment fulfillment data (336 periods)
- **Special Events**: 5 holiday periods with enhanced fulfillment probabilities
- **Base Configuration**: Initial Beta parameters `α=2, β=5`

#### 📈 Outputs
- **Time Series Forecasts**: Rolling probability predictions
- **Credible Intervals**: 95% Bayesian confidence bounds
- **Performance Metrics**: MAE scores (overall and holiday-specific)
- **Comparative Analysis**: Bayesian vs. traditional model performance

#### 📊 Key Metrics
- **Overall MAE**: Model accuracy across entire timeline
- **Holiday MAE**: Specialized performance during anomalous periods
- **Uncertainty Bounds**: Dynamic credible intervals reflecting model confidence

#### 🚀 Usage
```python
# Generate shipment data with holiday effects
timestamps, outcomes, true_probs, holiday_indices = generate_shipment_data()

# Run Bayesian model
bayes_results = beta_binomial_model(outcomes)

# Run traditional model for comparison  
traditional_results = sliding_window_model(outcomes)

# Evaluate performance
bayes_mae = calculate_mae(bayes_results['pred'], true_probs)
```

## 🎯 Problem Solutions

### Question 1 Solution
Demonstrates a complete variational inference pipeline:
- ✅ Implements Gaussian variational posterior `q(θ)`
- ✅ Optimizes ELBO via gradient-based methods
- ✅ Provides convergence monitoring through ELBO plots
- ✅ Shows posterior approximation quality vs. true distribution

### Question 2 Solution  
Shows practical Bayesian forecasting:
- ✅ Embeds Beta-Binomial updater in rolling forecast system
- ✅ Reports time-varying credible intervals
- ✅ Handles real-world challenges (holiday anomalies)
- ✅ Provides comparative analysis vs. traditional methods

## 📋 Dependencies

- **Question 1**: `numpy`, `matplotlib`, `torch`
- **Question 2**: `numpy`, `matplotlib`, `scipy`, `pandas`, `datetime`

Both solutions are self-contained and include all necessary data generation and visualization components.