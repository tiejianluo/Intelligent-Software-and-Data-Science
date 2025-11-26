# Solutions of Advanced Exercises in Chapter 7: The Economics of Intelligence — Model-Based vs. Model-Free Reinforcement Learning

This repository contains implementations and solutions for advanced exercises from Chapter 7: "The Economics of Intelligence — Model-Based vs. Model-Free Reinforcement Learning". The solutions demonstrate practical implementations of Model-Based Reinforcement Learning (MBRL), risk-sensitive RL, and their comparisons in simulated environments.

## 📁 Repository Structure

```
.
├── question1_solution.ipynb     # Solution for Exercise 1: MBRL vs PPO comparison
├── question2_solution.ipynb     # Solution for Exercise 2: Risk-sensitive RL for FastShip
├── fastship_data.csv           # Generated dataset for FastShip logistics scenario
└── README.md                  # This file
```

## 🧪 Exercise 1: MBRL vs MFRL Sample Efficiency Comparison

**File:** `question1_solution.ipynb`

### Problem Statement
Implement a small MBRL system (Dreamer/PlaNet style) on a Gym task and compare its sample efficiency with PPO.

### Solution Overview
This Jupyter notebook provides a comparative analysis between Model-Based Reinforcement Learning (MBRL) and Model-Free Reinforcement Learning (MFRL) using simplified implementations of DreamerV3 and PPO algorithms.

### Key Components

#### Inputs
- **Environment**: OpenAI Gym's `CartPole-v1`
- **Training Episodes**: 50 episodes for each algorithm (reduced for demonstration)
- **State Space**: Cart position, cart velocity, pole angle, pole angular velocity
- **Action Space**: Discrete (left/right)

#### Outputs
- **Training Progress**: Real-time reward tracking during training
- **Comparative Plots**: Visual comparison of learning curves
- **Performance Metrics**: 
  - Average rewards per episode
  - Maximum achieved rewards
  - Sample efficiency analysis

#### Main Functions

1. **`dreamer_v3_simplified_simulation()`**
   - Implements a simplified version of DreamerV3 (MBRL)
   - Features world model prediction and planning in latent space
   - Uses model-based rollouts for action selection

2. **`ppo_simulation()`** 
   - Implements Proximal Policy Optimization (MFRL)
   - Uses policy gradient with clipping for stable updates
   - Direct policy learning from experience

3. **`compare_mbrl_vs_mfrl()`**
   - Orchestrates the comparative experiment
   - Generates visualization plots
   - Computes and displays performance statistics

### Key Findings
- **MBRL (DreamerV3)**: Higher sample efficiency, faster initial learning
- **MFRL (PPO)**: More stable long-term performance, better asymptotic behavior
- **Trade-offs**: MBRL requires more computation per step but learns faster from fewer interactions

## 📊 FastShip Dataset

**File:** `fastship_data.csv`

### Dataset Description
This synthetic dataset simulates a logistics and supply chain scenario for the FastShip intelligent scheduling system, containing 1,000 records of delivery tasks with associated constraints and risk factors.

### Data Schema

| Column | Type | Description |
|--------|------|-------------|
| `order_id` | Integer | Unique identifier for each delivery order |
| `order_volume` | Float | Volume of goods to be delivered (1-10 units) |
| `order_priority` | Integer | Delivery priority (1=highest, 3=lowest) |
| `order_deadline` | Integer | Required delivery time in hours (1-24) |
| `vehicle_capacity` | Float | Maximum carrying capacity of assigned vehicle (5-15 units) |
| `vehicle_speed` | Float | Average vehicle speed in km/h (30-80) |
| `vehicle_cost_per_km` | Float | Operational cost per kilometer ($0.5-2.0) |
| `distance` | Float | Delivery distance in kilometers (5-200) |
| `traffic_condition` | Integer | Road traffic condition (1=clear, 4=congested) |
| `weather_condition` | Integer | Weather condition (1=sunny, 2=rainy, 3=snowy) |
| `time_estimate` | Float | Estimated delivery time in hours |
| `delay_risk` | Float | Probability of delivery delay (0-1) |
| `overload_risk` | Float | Risk of vehicle overload (0-1) |
| `base_reward` | Float | Base reward value for successful delivery |

### Usage
The dataset is used for training and evaluating risk-sensitive reinforcement learning algorithms in logistics optimization scenarios.

## 🛡️ Exercise 2: Risk-Sensitive RL with Safety Constraints

**File:** `question2_solution.ipynb`

### Problem Statement
For the FastShip setting, design a reward with safety constraints and implement risk-sensitive RL (CVaR-RL or Safe RL).

### Solution Overview
This notebook implements Conditional Value at Risk Reinforcement Learning (CVaR-RL) for the FastShip logistics scenario, incorporating safety constraints into the reward function and decision-making process.

### Key Components

#### Inputs
- **Dataset**: `fastship_data.csv` (generated above)
- **Features**: 11-dimensional state representation including volume, priority, constraints, and risk factors
- **CVaR Parameter**: α = 0.05 (focusing on worst 5% of outcomes)

#### Outputs
- **Training Loss Curves**: Convergence behavior of CVaR-RL
- **Risk-Adjusted Decisions**: Comparison between original and risk-sensitive policies
- **Visualization**: Effect of risk adjustment on value estimates

#### Main Functions

1. **`generate_fastship_dataset()`**
   - Creates synthetic logistics data with realistic constraints
   - Computes risk metrics (delay risk, overload risk)
   - Generates base reward signals

2. **`CVaRNetwork` Class**
   - Neural network for risk-adjusted value estimation
   - 3-layer architecture with ReLU activations
   - Outputs CVaR-adjusted state values

3. **`cvar_rl_simulation()`**
   - Implements CVaR-based risk-sensitive learning
   - Combines MSE loss with CVaR penalty
   - Evaluates risk-adjusted decision policies

### Safety Constraints Implementation

#### Reward Design
```python
# Base reward components
base_reward = 100 / (1 + vehicle_cost_per_km * distance)

# Safety penalties
delay_penalty = max(0, time_estimate - order_deadline) * 50
overload_penalty = max(0, order_volume - vehicle_capacity) * 30

# Priority weighting
priority_multiplier = {1: 1.5, 2: 1.0, 3: 0.7}

# Final constrained reward
safe_reward = base_reward * priority_multiplier[order_priority] - delay_penalty - overload_penalty
```

#### Risk Sensitivity
- **CVaR Optimization**: Focuses on improving worst-case scenarios
- **Constraint Handling**: Explicit penalties for deadline violations and capacity overloads
- **Adaptive Risk Threshold**: Configurable risk tolerance level (α parameter)

### Key Findings
- **Risk Adjustment**: CVaR-RL produces more conservative policies that avoid high-risk scenarios
- **Safety Compliance**: Significant reduction in constraint violations compared to standard RL
- **Performance Trade-off**: Lower average rewards but higher minimum guarantees

