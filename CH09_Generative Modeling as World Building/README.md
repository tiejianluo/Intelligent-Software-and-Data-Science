# Solutions of Advanced Exercises in Chapter 9: Generative Modeling as World Building

This repository contains solutions to the advanced exercises from Chapter 9: "Generative Modeling as World Building". The solutions demonstrate causal latent variable modeling and reinforcement learning integration in a simulated logistics scenario.

## Repository Structure

```
.
├── fastship_dataset.csv          # Generated dataset for FastShip scenario
├── question1_solution.ipynb      # Solution for Exercise 1: CausalVAE with OoD analysis
├── question2_solution.ipynb      # Solution for Exercise 2: RL integration with generative model
└── README.md                    # This file
```

## Dataset: `fastship_dataset.csv`

The dataset simulates a logistics and transportation scenario with causal relationships between variables. It contains 2,000 samples with the following features:

### Data Columns:

- **region**: Geographic area type (`urban`, `suburban`, `rural`)
- **time_of_day**: Hour of day (0-24, continuous)
- **weather_type**: Weather condition (`sunny`, `rainy`, `snowy`)
- **weather_intensity**: Severity of weather condition (exponential distribution)
- **special_event**: Binary indicator for special events (1 = event present, 0 = absent)
- **road_conditions**: Road quality score (0.1-1.0), causally affected by weather
- **order_density**: Package order concentration (0.1-1.0), influenced by time and region
- **traffic_flow**: Traffic intensity (0.1-1.0), causally dependent on all above factors
- **region_encoded**: Numeric encoding of region (0: urban, 1: suburban, 2: rural)
- **weather_encoded**: Numeric encoding of weather (0: sunny, 1: rainy, 2: snowy)

### Causal Relationships:
- Weather → Road Conditions → Traffic Flow
- Time/Region → Order Density → Traffic Flow
- Special Events → Traffic Flow

## Solution 1: `question1_solution.ipynb`

### Causal Variational Autoencoder (CausalVAE) with OoD Stability Analysis

#### Inputs:
- `fastship_dataset.csv`: Generated FastShip scenario data
- Numerical features: `['time_of_day', 'weather_intensity', 'special_event', 'road_conditions', 'order_density', 'traffic_flow']`

#### Outputs:
- Trained CausalVAE model with separate latent and causal variable spaces
- Training loss curves showing convergence
- Latent space visualization (2D projection)
- Causal variable distribution analysis
- Out-of-Distribution (OoD) stability metrics

#### Key Functionality:

1. **CausalVAE Architecture**:
   - Separate encoders for latent variables and causal factors
   - Combined decoding from both latent and causal spaces
   - Explicit causal variable extraction with sigmoid activation

2. **OoD Stability Analysis**:
   - Tests generation stability under extreme conditions (snowstorms, late-night scenarios)
   - Measures reconstruction error on OoD samples
   - Analyzes causal variable consistency across distributions

3. **Visualization**:
   - Training progress monitoring
   - Latent space structure exploration
   - Causal factor distribution analysis

## Solution 2: `question2_solution.ipynb`

### Reinforcement Learning with Generative Model Integration

#### Inputs:
- `fastship_dataset.csv`: FastShip scenario data for environment simulation
- State features: `['time_of_day', 'weather_intensity', 'special_event', 'road_conditions', 'order_density', 'traffic_flow']`

#### Outputs:
- Trained Q-learning agent with discretized state representation
- Training reward progression over episodes
- Moving average performance metrics
- Policy analysis on test scenarios

#### Key Functionality:

1. **FastShip Environment**:
   - Simulates logistics scheduling decisions
   - State transitions based on real data patterns
   - Reward function considering order density, traffic conditions, and action appropriateness

2. **RL Agent**:
   - Q-learning with ε-greedy exploration
   - State discretization for efficient learning
   - Three action types: reduce scheduling (conservative), maintain, increase scheduling (aggressive)

3. **Simulate–Decide–Validate Loop**:
   - **Simulate**: Environment generates next state based on current conditions
   - **Decide**: Agent selects scheduling action based on learned policy
   - **Validate**: Reward signal validates decision quality for future learning

4. **Performance Analysis**:
   - Training stability and convergence monitoring
   - Final policy evaluation on representative test cases
   - Action recommendations for different operational scenarios


