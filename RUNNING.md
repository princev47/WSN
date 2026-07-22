# Running the WSN Hybrid Clone Detection Project

## Overview
This project is a 3-layer hybrid clone detection system for Wireless Sensor Networks (WSNs).
It uses:

- **Layer 1: Cuckoo Filter** for fast duplicate node ID detection
- **Layer 2: Random Forest ML** for behavioural anomaly detection
- **Layer 3: Blockchain simulation** for identity verification and node revocation

## Environment
The project was validated on the repository root:

`c:\Users\User\OneDrive\Desktop\Hybrid-Clone-Detection-WSNs-main`

A Python virtual environment is configured and the following packages are required:

- pandas
- numpy
- scikit-learn
- joblib
- flask
- flask-cors

## Setup Steps

1. Activate the virtual environment:

```powershell
cd c:\Users\User\OneDrive\Desktop\Hybrid-Clone-Detection-WSNs-main
.venv\Scripts\Activate
```

2. Install required dependencies:

```powershell
pip install pandas numpy scikit-learn joblib flask flask-cors
```

3. Generate the dataset file if it does not already exist:

```powershell
python matlab\generate_sample_data.py
```

This creates `data/wsn_data.csv`.

## Run the Full Pipeline

Execute the main pipeline:

```powershell
python main.py
```

This performs:

- Layer 1: `layer1_filter/layer1_filter.py`
- Layer 2: `layer2_ml/layer2_ml.py`
- Layer 3: `layer3_blockchain/layer3_blockchain.py`

Outputs produced:

- `data/layer1_results.csv`
- `data/layer2_results.csv`
- `data/layer3_results.csv`
- `data/blockchain_ledger.json`
- `data/final_report.json`

## Optional: Run the REST API Server

The repository includes `server.py` which runs a Flask server and exposes an API endpoint at `/detect`.

```powershell
python server.py
```

The server loads the trained model from `data/ml_model.pkl` and the baseline dataset from `data/wsn_data.csv`.

## React Dashboard

A React dashboard is available in the `dashboard/` folder and is wired to the Flask backend using `/api` routes.

```powershell
cd dashboard
npm install
npm run dev
```

Then open the URL shown in the terminal (by default `http://localhost:5173`).

The dashboard uses these backend endpoints:

- `/api/dashboard` for summary counts and metrics
- `/api/layer2` for ML metrics and confusion matrix
- `/api/layer3` for blockchain results
- `/api/records` for node-level records

## Project Workflow

1. **Data Generation**
   - `matlab/generate_sample_data.py` creates synthetic WSN data with normal, clone, and malicious node records.

2. **Layer 1 — Cuckoo Filter**
   - Reads `data/wsn_data.csv`
   - Detects duplicate node IDs per round and simple spatial anomalies
   - Saves flagged records to `data/layer1_results.csv`

3. **Layer 2 — Machine Learning**
   - Reads `data/layer1_results.csv`
   - Builds behavioural features and trains a Random Forest classifier
   - Predicts threats and flags records to forward to Layer 3
   - Saves model to `data/ml_model.pkl` and results to `data/layer2_results.csv`

4. **Layer 3 — Blockchain**
   - Reads `data/layer2_results.csv`
   - Registers legitimate nodes from round 1
   - Verifies suspicious nodes using location, energy, and packet rate checks
   - Revokes bad nodes and records decisions in a simulated blockchain ledger
   - Saves final results to `data/layer3_results.csv`

## Validation Result
The pipeline was executed successfully with the generated dataset and completed in approximately 7–8 seconds.

- Final report saved to `data/final_report.json`
- Blockchain integrity validated successfully

## Notes
- If `data/wsn_data.csv` is missing, run the sample data generator first.
- The server requires `data/ml_model.pkl`, which is created by running `python main.py` or `python layer2_ml\layer2_ml.py`.
