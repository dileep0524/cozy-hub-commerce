import { useState, useMemo, useEffect, useRef } from 'react';

function fmt(value, currency, unit) {
  if (unit && unit !== '') return `${value} ${unit}`;
  if (!currency) return String(value);
  return `${currency}${Number(value).toFixed(2)}`;
}

function AnimatedNumber({ value, currency = '', unit = '', decimals = 2, duration = 450 }) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const target = Number(value) || 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const startTime = { t: null };

    function animate(now) {
      if (!startTime.t) startTime.t = now;
      const elapsed = now - startTime.t;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayed(target * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration]);

  if (unit) return <>{displayed.toFixed(decimals)} {unit}</>;
  if (!currency) return <>{displayed.toFixed(decimals)}</>;
  return <>{currency}{displayed.toFixed(decimals)}</>;
}

function FieldRenderer({ field, value, onChange, allValues }) {
  if (field.type === 'number') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
        <input
          type="number"
          className="input-field"
          value={value}
          min={field.min ?? 0}
          step={field.step ?? 1}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      </div>
    );
  }

  if (field.type === 'date') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
        <input
          type="date"
          className="input-field"
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      </div>
    );
  }

  if (field.type === 'select') {
    const options = field.options.map((o) =>
      typeof o === 'string' ? { value: o, label: o } : o
    );
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
        <select
          className="input-field"
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === 'radio') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
        <div className="flex flex-wrap gap-2">
          {field.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(field.key, opt)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                value === opt
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-brand-400'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

function ResultRow({ row, currency }) {
  const isNumeric = row.unit == null || row.unit === '';
  const decimals = row.unit === '%' ? 1 : 2;

  if (row.type === 'profit') {
    const isPositive = Number(row.value) >= 0;
    return (
      <div className={`flex justify-between items-center px-4 py-3 rounded-lg mt-3 ${isPositive ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
        <span className={`font-bold text-sm ${isPositive ? 'text-emerald-800' : 'text-red-800'}`}>{row.label}</span>
        <span className={`font-extrabold text-lg tabular-nums ${isPositive ? 'text-emerald-700' : 'text-red-700'}`}>
          {isNumeric
            ? <AnimatedNumber value={row.value} currency={currency} unit={row.unit ?? ''} decimals={decimals} />
            : fmt(row.value, '', row.unit)}
        </span>
      </div>
    );
  }

  if (row.type === 'total') {
    return (
      <div className="flex justify-between items-center py-2.5 border-t border-gray-200 mt-1">
        <span className="font-semibold text-sm text-gray-900">{row.label}</span>
        <span className="font-bold text-base text-gray-900 tabular-nums">
          {isNumeric
            ? <AnimatedNumber value={row.value} currency={currency} unit={row.unit ?? ''} decimals={decimals} />
            : fmt(row.value, '', row.unit)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{row.label}</span>
      <span className="text-sm font-semibold text-gray-800 tabular-nums">
        {isNumeric
          ? <AnimatedNumber value={row.value} currency={currency} unit={row.unit ?? ''} decimals={decimals} />
          : fmt(row.value, '', row.unit)}
      </span>
    </div>
  );
}

function AgeResult({ result }) {
  const { ageYears, ageMonths, ageDays } = result;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[{ label: 'Years', value: ageYears }, { label: 'Months', value: ageMonths }, { label: 'Days', value: ageDays }].map(({ label, value }) => (
          <div key={label} className="bg-brand-50 border border-brand-100 rounded-xl p-4 text-center">
            <p className="text-3xl font-extrabold text-brand-700 tabular-nums">{value ?? 0}</p>
            <p className="text-xs text-brand-500 font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500 text-center">
        {ageYears} year{ageYears !== 1 ? 's' : ''}, {ageMonths} month{ageMonths !== 1 ? 's' : ''}, {ageDays} day{ageDays !== 1 ? 's' : ''} old
      </p>
    </div>
  );
}

function PythagoreanResult({ result }) {
  const { label, formula, result: val, unit } = result;
  return (
    <div className="space-y-4">
      {val != null ? (
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-6 text-center">
          <p className="text-xs text-brand-500 font-semibold uppercase tracking-wider mb-2">{label}</p>
          <p className="text-4xl font-extrabold text-brand-700 tabular-nums">{val} {unit}</p>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center text-red-700 text-sm font-medium">
          Invalid inputs — hypotenuse must be longer than any side.
        </div>
      )}
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
        <p className="text-xs text-gray-500 font-medium mb-1">Formula</p>
        <p className="text-sm font-mono text-gray-800">{formula}</p>
      </div>
    </div>
  );
}

function VolumetricResult({ rows, currency }) {
  const chargeableRow = rows.find((r) => r.key === 'chargeable');
  const otherRows = rows.filter((r) => r.key !== 'chargeable');
  return (
    <div className="space-y-1">
      {otherRows.map((row) => (
        <ResultRow key={row.key} row={row} currency={currency} />
      ))}
      {chargeableRow && (
        <div className="bg-brand-50 border border-brand-200 rounded-lg flex justify-between items-center px-4 py-3 mt-3">
          <span className="font-bold text-sm text-brand-800">{chargeableRow.label}</span>
          <span className="font-extrabold text-lg text-brand-700 tabular-nums">{chargeableRow.value} kg</span>
        </div>
      )}
    </div>
  );
}

export default function CalculatorWidget({ config }) {
  const initialInputs = Object.fromEntries(
    config.fields.map((f) => [f.key, f.defaultValue ?? ''])
  );
  const [inputs, setInputs] = useState(initialInputs);

  const results = useMemo(() => {
    try { return config.calculate(inputs); } catch { return null; }
  }, [inputs, config]);

  const handleChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  // For pythagorean: hide side based on mode
  const visibleFields = config.isPythagorean
    ? config.fields.filter((f) => {
        if (f.key === 'sideA' && inputs.mode === 'Find A') return false;
        if (f.key === 'sideB' && inputs.mode === 'Find B') return false;
        if (f.key === 'sideC' && inputs.mode === 'Find C') return false;
        return true;
      })
    : config.fields;

  // For volumetric: hide custom divisor unless Custom carrier selected
  const filteredFields = config.fields.some((f) => f.key === 'customDivisor')
    ? visibleFields.filter((f) => f.key !== 'customDivisor' || inputs.carrier === 'Custom')
    : visibleFields;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Inputs */}
          <div className="card space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-100">Enter Details</h2>
            {filteredFields.map((field) => (
              <FieldRenderer
                key={field.key}
                field={field}
                value={inputs[field.key]}
                onChange={handleChange}
                allValues={inputs}
              />
            ))}
          </div>

          {/* Results */}
          <div className="card lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              {config.isAgeCalc ? 'Your Age' : config.isPythagorean ? 'Result' : config.currency === '' ? 'Shipping Weight' : 'Cost Breakdown'}
            </h2>

            {results && config.isAgeCalc && <AgeResult result={results} />}
            {results && config.isPythagorean && <PythagoreanResult result={results} />}
            {results && config.currency === '' && !config.isAgeCalc && !config.isPythagorean && (
              <VolumetricResult rows={results.rows} currency={config.currency} />
            )}
            {results && config.currency !== '' && !config.isAgeCalc && !config.isPythagorean && (
              <div className="space-y-0.5">
                {results.rows.map((row) => (
                  <ResultRow key={row.key} row={row} currency={config.currency} />
                ))}
                {results.profitPercent != null && (
                  <p className="text-xs text-gray-400 text-right mt-2">
                    Margin: <AnimatedNumber value={results.profitPercent} currency="" unit="%" decimals={2} duration={450} />
                  </p>
                )}
              </div>
            )}

            {!results && (
              <p className="text-sm text-gray-400 text-center py-8">Fill in the details to see your estimate.</p>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Fee rates are indicative and based on publicly available marketplace policies. Always verify with the official seller portal before making pricing decisions.
        </p>
      </div>

      {/* Comparison Tables */}
      {config.comparisons && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
          {config.comparisons.map((comp) => (
            <ComparisonTable
              key={comp.key}
              comp={comp}
              config={config}
              inputs={inputs}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ComparisonTable({ comp, config, inputs }) {
  const rows = useMemo(() => {
    return comp.values.map((val) => {
      const varied = { ...inputs, [comp.key]: val };
      let result = null;
      try { result = config.calculate(varied); } catch { /* ignore */ }
      const totalFees = result?.totalFees ?? result?.rows?.find((r) => r.key === 'total')?.value ?? 0;
      return { val, totalFees, profit: result?.profit ?? 0, profitPercent: result?.profitPercent ?? 0 };
    });
  }, [comp, config, inputs]);

  const currentVal = Number(inputs[comp.key]);

  return (
    <div className="card overflow-hidden p-0">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900">{comp.label}</h3>
        {comp.description
          ? <p className="text-xs text-gray-400 mt-0.5">{comp.description}</p>
          : <p className="text-xs text-gray-400 mt-0.5">Other inputs held at current values</p>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{comp.key === 'price' ? 'Selling Price' : 'Weight'}</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Deductions</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Profit</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Margin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(({ val, totalFees, profit, profitPercent }) => {
              const isCurrent = val === currentVal;
              const isProfit = profit >= 0;
              return (
                <tr key={val} className={isCurrent ? 'bg-brand-50' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-3 font-medium text-gray-900 tabular-nums">
                    {comp.key === 'price' ? `${config.currency}${val}` : `${val}g`}
                    {isCurrent && <span className="ml-2 text-[10px] font-bold text-brand-600 bg-brand-100 px-1.5 py-0.5 rounded-full uppercase">current</span>}
                  </td>
                  <td className="px-6 py-3 text-gray-600 tabular-nums">{config.currency}{Number(totalFees).toFixed(2)}</td>
                  <td className={`px-6 py-3 font-semibold tabular-nums ${isProfit ? 'text-emerald-700' : 'text-red-600'}`}>
                    {config.currency}{Number(profit).toFixed(2)}
                  </td>
                  <td className={`px-6 py-3 tabular-nums ${isProfit ? 'text-emerald-600' : 'text-red-500'}`}>
                    {profitPercent}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
