import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  createStrategy,
  updateStrategy,
  getStrategy,
  INSTRUMENT_TYPES,
  CONDITION_TYPES,
} from "../../services/strategyService";
import "./Strategies.css";

const emptyCondition = () => ({ type: "ema_cross", params: {}, direction: "long" });

const defaultForm = {
  name: "",
  instrument_type: "equity",
  entry_conditions: [emptyCondition()],
  exit_conditions: [emptyCondition()],
  stop_loss: "",
  target: "",
  trailing_stop_loss: "",
  risk_per_trade: 1,
  max_daily_loss: "",
  max_positions: 5,
};

function StrategyBuilder() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    getStrategy(id)
      .then((data) => setForm({ ...defaultForm, ...data }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const updateField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const updateCondition = (field, index, key, value) => {
    setForm((f) => {
      const conditions = [...f[field]];
      conditions[index] = { ...conditions[index], [key]: value };
      return { ...f, [field]: conditions };
    });
  };

  const addCondition = (field) => {
    setForm((f) => ({ ...f, [field]: [...f[field], emptyCondition()] }));
  };

  const removeCondition = (field, index) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      stop_loss: form.stop_loss ? Number(form.stop_loss) : null,
      target: form.target ? Number(form.target) : null,
      trailing_stop_loss: form.trailing_stop_loss ? Number(form.trailing_stop_loss) : null,
      max_daily_loss: form.max_daily_loss ? Number(form.max_daily_loss) : null,
      risk_per_trade: Number(form.risk_per_trade),
      max_positions: Number(form.max_positions),
    };

    try {
      if (isEdit) await updateStrategy(id, payload);
      else await createStrategy(payload);
      navigate("/strategies");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading strategy..." />;

  const renderConditions = (field, label) => (
    <div className="form-section">
      <h3>{label}</h3>
      <div className="condition-list">
        {form[field].map((cond, i) => (
          <div key={i} className="condition-row">
            <select
              value={cond.type}
              onChange={(e) => updateCondition(field, i, "type", e.target.value)}
            >
              {CONDITION_TYPES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <select
              value={cond.direction || "long"}
              onChange={(e) => updateCondition(field, i, "direction", e.target.value)}
            >
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
            {form[field].length > 1 && (
              <button type="button" onClick={() => removeCondition(field, i)} aria-label="Remove">×</button>
            )}
          </div>
        ))}
        <button type="button" className="add-condition-btn" onClick={() => addCondition(field)}>
          + Add Condition
        </button>
      </div>
    </div>
  );

  return (
    <div className="strategy-page fade-in">
      <div className="page-header">
        <h1>{isEdit ? "Edit Strategy" : "Strategy Builder"}</h1>
        <p>Configure entry/exit rules, risk management, and instrument type.</p>
      </div>

      {error && <div className="error-state" role="alert"><p>{error}</p></div>}

      <form className="builder-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Info</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Strategy Name</label>
              <input id="name" required value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="My EMA Strategy" />
            </div>
            <div className="form-group">
              <label htmlFor="instrument">Instrument</label>
              <select id="instrument" value={form.instrument_type} onChange={(e) => updateField("instrument_type", e.target.value)}>
                {INSTRUMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {renderConditions("entry_conditions", "Entry Conditions")}
        {renderConditions("exit_conditions", "Exit Conditions")}

        <div className="form-section">
          <h3>Targets & Stop Loss</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stop_loss">Stop Loss (%)</label>
              <input id="stop_loss" type="number" step="0.1" value={form.stop_loss} onChange={(e) => updateField("stop_loss", e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="target">Target (%)</label>
              <input id="target" type="number" step="0.1" value={form.target} onChange={(e) => updateField("target", e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="trailing">Trailing Stop Loss (%)</label>
              <input id="trailing" type="number" step="0.1" value={form.trailing_stop_loss} onChange={(e) => updateField("trailing_stop_loss", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Risk Management</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="risk">Risk Per Trade (%)</label>
              <input id="risk" type="number" step="0.1" min="0.1" max="100" required value={form.risk_per_trade} onChange={(e) => updateField("risk_per_trade", e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="max_loss">Max Daily Loss (₹)</label>
              <input id="max_loss" type="number" value={form.max_daily_loss} onChange={(e) => updateField("max_daily_loss", e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="max_pos">Max Positions</label>
              <input id="max_pos" type="number" min="1" required value={form.max_positions} onChange={(e) => updateField("max_positions", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="builder-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Update Strategy" : "Save Strategy"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/strategies")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default StrategyBuilder;
