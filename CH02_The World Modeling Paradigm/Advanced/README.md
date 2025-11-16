# Solutions of Advanced Exercises in Chapter 2

This directory contains Jupyter Notebook solutions for two advanced exercises in **Chapter 2: The World Modeling Paradigm**, focusing on world model implementation, evaluation, and counterfactual analysis. Each notebook includes complete code, step-by-step explanations, and result visualizations to reproduce the study outcomes.


## Exercise 1: Minimal RSSM/Dreamer Study & Model Comparison
This notebook (`question1_solution.ipynb`) reproduces a minimal **RSSM (Recurrent State Space Model)/Dreamer** study. It compares three RL approaches across key performance metrics to validate the value of world models and object slots.

### Key Inputs
- **Environment**: CartPole-v1 (OpenAI Gym), with customizable friction coefficients to simulate varied physical conditions.
- **Training Parameters**: Configurable hyperparameters including learning rates, discount factor, batch size, and experience buffer capacity.
- **Robustness Testing**: A set of distinct friction coefficients to evaluate model performance under perturbed physical settings.

### Main Outputs
- **Training Performance**: Real-time training curves tracking score progression until the target score (200+) is achieved.
- **Sample Efficiency**: Quantified number of training steps required for each model to reach the target performance.
- **Robustness Analysis**: Metrics (average scores, success rates) for each model across different friction conditions.
- **Planning Latency**: Inference time measurements to assess real-time decision-making capability.
- **Visualization**: Real-time animations of the trained agent balancing the CartPole.

### Compared Approaches
1. **Model-Free RL**: Traditional RL without a world model (baseline).
2. **World Model-Based RL**: RL augmented with an RSSM/Dreamer world model.
3. **World Model + Object Slots**: World model enhanced with object-centric representation for better state disentanglement.


---


## Exercise 2: Counterfactual Analysis Framework
This notebook (`question2_solution.ipynb`) builds a **counterfactual analysis framework** for RL trajectories. It explores "what-if" scenarios by modifying key elements of a fixed factual trajectory and validates consistency with human/physics priors.

### Core Purpose
Evaluate how changes to actions or state variables in a fixed trajectory affect outcomes, and propose model repairs if results conflict with priors.

### Key Inputs
- **Original Policy**: The pre-trained RL policy that generated the factual trajectory.
- **Intervention Specifications**: 
  - Intervention position (timestep in the factual trajectory where changes are applied).
  - Intervention type (swap of key actions, modification of state variables).

### Main Outputs
- **Trajectory Visualization**: Side-by-side comparison of the original factual trajectory and generated counterfactual trajectories.
- **Consistency Scores**: Three quantitative metrics to assess validity:
  1. **Physical Rationality**: Alignment with basic physics laws (e.g., gravity, momentum).
  2. **Temporal Coherence**: Smoothness and logical progression of states over time.
  3. **Causal Consistency**: Compliance with expected cause-effect relationships (e.g., action → state change).
- **Model Repair Recommendations**: If inconsistencies are detected, proposed fixes including:
  - Prior constraints (e.g., enforce physical limits).
  - Structural regularization (e.g., penalize implausible state transitions).
  - Programmatic rules (e.g., hardcode valid action-state mappings).


---


## How to Use
Both notebooks are fully compatible with Google Colab. Simply upload the `.ipynb` files to Colab, run all cells sequentially, and adjust parameters directly within the notebook interfaces:
- For `question1_solution.ipynb`: Modify training configurations and friction parameters in the "Experiment Setup" section.
- For `question2_solution.ipynb`: Adjust intervention settings (position and type) in the "Counterfactual Configuration" section.