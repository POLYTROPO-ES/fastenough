import { useMemo, useState, type PointerEvent } from 'react';
import './App.css';

type Locale = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it' | 'ja' | 'zh';
type DistanceUnit = 'km' | 'mi';

type MarkOverlay = {
  key: string;
  speedUnit: number;
  speedKmh: number;
  speedX: number;
  speedY: number;
  timeX: number;
  timeY: number;
  label: string;
  tone: 'neutral' | 'positive' | 'negative';
};

type Translations = {
  languageLabel: string;
  unitLabel: string;
  speedLabel: string;
  speedLimitLabel: string;
  distanceLabel: string;
  speedometerLabel: string;
  ringLegendTitle: string;
  ringLegendScale: string;
  ringLegendLimit: string;
  ringLegendCurrent: string;
  ringLegendTapLimit: string;
  ringLegendTapCurrent: string;
  summaryLabel: string;
  baselineOff: string;
  timeSaved: string;
  timeLost: string;
  noDifference: string;
  currentTravelTime: string;
  baselineTravelTime: string;
  baselineNote: string;
  shareSettings: string;
  shareCopied: string;
  shareReady: string;
  shareError: string;
};

type InitialSettings = {
  distance: number;
  speed: number;
  speedLimit: number;
};

const KM_TO_MI = 0.621371;
const MI_TO_KM = 1.60934;
const BASE_MARKS_KMH = [30, 50, 80, 100, 120, 132, 150, 160, 200, 250, 300];

const languageOptions: Array<{ value: Locale; label: string }> = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Espanol' },
  { value: 'fr', label: 'Francais' },
  { value: 'de', label: 'Deutsch' },
  { value: 'pt', label: 'Portugues' },
  { value: 'it', label: 'Italiano' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Chinese' },
];

const translations: Record<Locale, Translations> = {
  en: {
    languageLabel: 'Language',
    unitLabel: 'Distance unit',
    speedLabel: 'Current speed',
    speedLimitLabel: 'Speed limit',
    distanceLabel: 'Trip distance',
    speedometerLabel: 'Speedometer with time overlay',
    ringLegendTitle: 'Ring legend',
    ringLegendScale: 'Speed scale arc',
    ringLegendLimit: 'Limit ring',
    ringLegendCurrent: 'Current speed ring',
    ringLegendTapLimit: 'Tap orange ring to set limit',
    ringLegendTapCurrent: 'Tap blue ring to set speed',
    summaryLabel: 'Quick summary',
    baselineOff: 'Off',
    timeSaved: 'Time saved',
    timeLost: 'Time lost',
    noDifference: 'No difference',
    currentTravelTime: 'Travel time',
    baselineTravelTime: 'Limit pace time',
    baselineNote: 'Overlay shows difference vs speed limit.',
    shareSettings: 'Share setting',
    shareCopied: 'Link copied',
    shareReady: 'Link ready',
    shareError: 'Could not copy',
  },
  es: {
    languageLabel: 'Idioma',
    unitLabel: 'Unidad de distancia',
    speedLabel: 'Velocidad actual',
    speedLimitLabel: 'Limite de velocidad',
    distanceLabel: 'Distancia del viaje',
    speedometerLabel: 'Velocimetro con capa de tiempo',
    ringLegendTitle: 'Leyenda',
    ringLegendScale: 'Arco de escala',
    ringLegendLimit: 'Anillo limite',
    ringLegendCurrent: 'Anillo velocidad actual',
    ringLegendTapLimit: 'Toca anillo naranja para limite',
    ringLegendTapCurrent: 'Toca anillo azul para velocidad',
    summaryLabel: 'Resumen rapido',
    baselineOff: 'Apagado',
    timeSaved: 'Tiempo ganado',
    timeLost: 'Tiempo perdido',
    noDifference: 'Sin diferencia',
    currentTravelTime: 'Tiempo de viaje',
    baselineTravelTime: 'Tiempo al limite',
    baselineNote: 'La capa muestra diferencia contra el limite.',
    shareSettings: 'Compartir ajuste',
    shareCopied: 'Enlace copiado',
    shareReady: 'Enlace listo',
    shareError: 'No se pudo copiar',
  },
  fr: {
    languageLabel: 'Language',
    unitLabel: 'Distance unit',
    speedLabel: 'Current speed',
    speedLimitLabel: 'Speed limit',
    distanceLabel: 'Trip distance',
    speedometerLabel: 'Speedometer with time overlay',
    ringLegendTitle: 'Ring legend',
    ringLegendScale: 'Speed scale arc',
    ringLegendLimit: 'Limit ring',
    ringLegendCurrent: 'Current speed ring',
    ringLegendTapLimit: 'Tap orange ring to set limit',
    ringLegendTapCurrent: 'Tap blue ring to set speed',
    summaryLabel: 'Quick summary',
    baselineOff: 'Off',
    timeSaved: 'Time saved',
    timeLost: 'Time lost',
    noDifference: 'No difference',
    currentTravelTime: 'Travel time',
    baselineTravelTime: 'Limit pace time',
    baselineNote: 'Overlay shows difference vs speed limit.',
    shareSettings: 'Share setting',
    shareCopied: 'Link copied',
    shareReady: 'Link ready',
    shareError: 'Could not copy',
  },
  de: {
    languageLabel: 'Language',
    unitLabel: 'Distance unit',
    speedLabel: 'Current speed',
    speedLimitLabel: 'Speed limit',
    distanceLabel: 'Trip distance',
    speedometerLabel: 'Speedometer with time overlay',
    ringLegendTitle: 'Ring legend',
    ringLegendScale: 'Speed scale arc',
    ringLegendLimit: 'Limit ring',
    ringLegendCurrent: 'Current speed ring',
    ringLegendTapLimit: 'Tap orange ring to set limit',
    ringLegendTapCurrent: 'Tap blue ring to set speed',
    summaryLabel: 'Quick summary',
    baselineOff: 'Off',
    timeSaved: 'Time saved',
    timeLost: 'Time lost',
    noDifference: 'No difference',
    currentTravelTime: 'Travel time',
    baselineTravelTime: 'Limit pace time',
    baselineNote: 'Overlay shows difference vs speed limit.',
    shareSettings: 'Share setting',
    shareCopied: 'Link copied',
    shareReady: 'Link ready',
    shareError: 'Could not copy',
  },
  pt: {
    languageLabel: 'Language',
    unitLabel: 'Distance unit',
    speedLabel: 'Current speed',
    speedLimitLabel: 'Speed limit',
    distanceLabel: 'Trip distance',
    speedometerLabel: 'Speedometer with time overlay',
    ringLegendTitle: 'Ring legend',
    ringLegendScale: 'Speed scale arc',
    ringLegendLimit: 'Limit ring',
    ringLegendCurrent: 'Current speed ring',
    ringLegendTapLimit: 'Tap orange ring to set limit',
    ringLegendTapCurrent: 'Tap blue ring to set speed',
    summaryLabel: 'Quick summary',
    baselineOff: 'Off',
    timeSaved: 'Time saved',
    timeLost: 'Time lost',
    noDifference: 'No difference',
    currentTravelTime: 'Travel time',
    baselineTravelTime: 'Limit pace time',
    baselineNote: 'Overlay shows difference vs speed limit.',
    shareSettings: 'Share setting',
    shareCopied: 'Link copied',
    shareReady: 'Link ready',
    shareError: 'Could not copy',
  },
  it: {
    languageLabel: 'Language',
    unitLabel: 'Distance unit',
    speedLabel: 'Current speed',
    speedLimitLabel: 'Speed limit',
    distanceLabel: 'Trip distance',
    speedometerLabel: 'Speedometer with time overlay',
    ringLegendTitle: 'Ring legend',
    ringLegendScale: 'Speed scale arc',
    ringLegendLimit: 'Limit ring',
    ringLegendCurrent: 'Current speed ring',
    ringLegendTapLimit: 'Tap orange ring to set limit',
    ringLegendTapCurrent: 'Tap blue ring to set speed',
    summaryLabel: 'Quick summary',
    baselineOff: 'Off',
    timeSaved: 'Time saved',
    timeLost: 'Time lost',
    noDifference: 'No difference',
    currentTravelTime: 'Travel time',
    baselineTravelTime: 'Limit pace time',
    baselineNote: 'Overlay shows difference vs speed limit.',
    shareSettings: 'Share setting',
    shareCopied: 'Link copied',
    shareReady: 'Link ready',
    shareError: 'Could not copy',
  },
  ja: {
    languageLabel: 'Language',
    unitLabel: 'Distance unit',
    speedLabel: 'Current speed',
    speedLimitLabel: 'Speed limit',
    distanceLabel: 'Trip distance',
    speedometerLabel: 'Speedometer with time overlay',
    ringLegendTitle: 'Ring legend',
    ringLegendScale: 'Speed scale arc',
    ringLegendLimit: 'Limit ring',
    ringLegendCurrent: 'Current speed ring',
    ringLegendTapLimit: 'Tap orange ring to set limit',
    ringLegendTapCurrent: 'Tap blue ring to set speed',
    summaryLabel: 'Quick summary',
    baselineOff: 'Off',
    timeSaved: 'Time saved',
    timeLost: 'Time lost',
    noDifference: 'No difference',
    currentTravelTime: 'Travel time',
    baselineTravelTime: 'Limit pace time',
    baselineNote: 'Overlay shows difference vs speed limit.',
    shareSettings: 'Share setting',
    shareCopied: 'Link copied',
    shareReady: 'Link ready',
    shareError: 'Could not copy',
  },
  zh: {
    languageLabel: 'Language',
    unitLabel: 'Distance unit',
    speedLabel: 'Current speed',
    speedLimitLabel: 'Speed limit',
    distanceLabel: 'Trip distance',
    speedometerLabel: 'Speedometer with time overlay',
    ringLegendTitle: 'Ring legend',
    ringLegendScale: 'Speed scale arc',
    ringLegendLimit: 'Limit ring',
    ringLegendCurrent: 'Current speed ring',
    ringLegendTapLimit: 'Tap orange ring to set limit',
    ringLegendTapCurrent: 'Tap blue ring to set speed',
    summaryLabel: 'Quick summary',
    baselineOff: 'Off',
    timeSaved: 'Time saved',
    timeLost: 'Time lost',
    noDifference: 'No difference',
    currentTravelTime: 'Travel time',
    baselineTravelTime: 'Limit pace time',
    baselineNote: 'Overlay shows difference vs speed limit.',
    shareSettings: 'Share setting',
    shareCopied: 'Link copied',
    shareReady: 'Link ready',
    shareError: 'Could not copy',
  },
};

function readInitialSettings(): InitialSettings {
  const defaults: InitialSettings = {
    distance: 100,
    speed: 130,
    speedLimit: 120,
  };

  if (typeof window === 'undefined') {
    return defaults;
  }

  const params = new URLSearchParams(window.location.search);
  const parseParam = (key: string): number | null => {
    const raw = params.get(key);
    if (raw === null || raw.trim() === '') {
      return null;
    }
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const d = parseParam('d');
  const s = parseParam('s');
  const l = parseParam('l');

  return {
    distance: d !== null ? clamp(Math.round(d), 10, 1000) : defaults.distance,
    speed: s !== null ? clamp(Math.round(s), 0, 300) : defaults.speed,
    speedLimit: l !== null ? clamp(Math.round(l), 0, 300) : defaults.speedLimit,
  };
}

function roundTo(value: number, decimals = 1): number {
  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function unitSuffix(unit: DistanceUnit): string {
  return unit === 'km' ? 'km/h' : 'mph';
}

function distanceSuffix(unit: DistanceUnit): string {
  return unit === 'km' ? 'km' : 'mi';
}

function toKmh(speed: number, unit: DistanceUnit): number {
  return unit === 'km' ? speed : speed * MI_TO_KM;
}

function toKm(distance: number, unit: DistanceUnit): number {
  return unit === 'km' ? distance : distance * MI_TO_KM;
}

function toUnitSpeed(speedKmh: number, unit: DistanceUnit): number {
  return unit === 'km' ? speedKmh : speedKmh * KM_TO_MI;
}

function speedometerMax(unit: DistanceUnit): number {
  return unit === 'km' ? 300 : 186;
}

function formatDuration(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) {
    return '0m';
  }

  const totalMinutes = Math.round(hours * 60);
  const wholeHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (wholeHours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${wholeHours}h`;
  }

  return `${wholeHours}h ${minutes}m`;
}

function signedDuration(hours: number): string {
  const abs = Math.abs(hours);
  if (abs < 0.0001) {
    return '0m';
  }
  const sign = hours > 0 ? '+' : '-';
  return `${sign}${formatDuration(abs)}`;
}

function angleForSpeed(speedUnit: number, maxSpeedUnit: number): number {
  const clampedSpeed = clamp(speedUnit, 0, maxSpeedUnit);
  const startAngle = 240; // 7 o'clock
  const slope = 1.05; // 200 km/h -> 30 degrees (2 o'clock)
  return startAngle - clampedSpeed * slope;
}

function dialSpan(maxSpeedUnit: number): number {
  const startAngle = 240;
  const endAngle = angleForSpeed(maxSpeedUnit, maxSpeedUnit);
  return (startAngle - endAngle + 360) % 360;
}

function speedFromAngle(angle: number, maxSpeedUnit: number): number {
  const startAngle = 240;
  const traveled = (startAngle - angle + 360) % 360;
  const span = dialSpan(maxSpeedUnit);
  if (span <= 0) {
    return 0;
  }
  return clamp((traveled / span) * maxSpeedUnit, 0, maxSpeedUnit);
}

function speedFromPointer(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  maxSpeedUnit: number,
): number {
  const scaleX = 600 / rect.width;
  const scaleY = 600 / rect.height;
  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;
  const dx = x - 300;
  const dy = 300 - y;

  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
    return 0;
  }

  const raw = (Math.atan2(dy, dx) * 180) / Math.PI;
  const angle = (raw + 360) % 360;
  return speedFromAngle(angle, maxSpeedUnit);
}

function pointOnArc(cx: number, cy: number, radius: number, angleDeg: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy - radius * Math.sin(rad),
  };
}

function createDisplayMarks(unit: DistanceUnit, maxSpeedUnit: number): Array<{ speedUnit: number; speedKmh: number }> {
  const seen = new Set<number>();
  const marks: Array<{ speedUnit: number; speedKmh: number }> = [];

  for (const speedKmh of BASE_MARKS_KMH) {
    const speedUnitRaw = toUnitSpeed(speedKmh, unit);
    const speedUnit = Math.round(speedUnitRaw);

    if (speedUnit < 1 || speedUnit > maxSpeedUnit || seen.has(speedUnit)) {
      continue;
    }

    seen.add(speedUnit);
    marks.push({ speedUnit, speedKmh });
  }

  return marks;
}

function App() {
  const [dragTarget, setDragTarget] = useState<'current' | 'limit' | null>(null);
  const initialSettings = useMemo(() => readInitialSettings(), []);
  const [locale, setLocale] = useState<Locale>('en');
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('km');
  const [distance, setDistance] = useState(initialSettings.distance);
  const [speed, setSpeed] = useState(initialSettings.speed);
  const [speedLimit, setSpeedLimit] = useState(initialSettings.speedLimit);
  const [shareStatus, setShareStatus] = useState('');

  const t = translations[locale];
  const maxSpeed = speedometerMax(distanceUnit);

  const distanceKm = toKm(distance, distanceUnit);
  const speedKmh = toKmh(speed, distanceUnit);
  const speedLimitKmh = toKmh(speedLimit, distanceUnit);
  const speedLimitActive = speedLimit > 0;

  const currentTravelTimeHours = speedKmh > 0 ? distanceKm / speedKmh : Number.POSITIVE_INFINITY;
  const baselineTravelTimeHours = speedLimitActive && speedLimitKmh > 0 ? distanceKm / speedLimitKmh : 0;
  const currentDiffHours = speedLimitActive ? currentTravelTimeHours - baselineTravelTimeHours : 0;

  const displayMarks = useMemo(() => createDisplayMarks(distanceUnit, maxSpeed), [distanceUnit, maxSpeed]);

  const overlays = useMemo<MarkOverlay[]>(() => {
    const cx = 300;
    const cy = 300;
    const speedLabelRadius = 205;
    const timeLabelRadius = 294;

    return displayMarks.map((mark) => {
      const angle = angleForSpeed(mark.speedUnit, maxSpeed);
      const speedPoint = pointOnArc(cx, cy, speedLabelRadius, angle);
      const timePoint = pointOnArc(cx, cy, timeLabelRadius, angle);
      const travelTime = distanceKm / mark.speedKmh;
      const diffTime = travelTime - baselineTravelTimeHours;
      const label = speedLimitActive ? signedDuration(diffTime) : formatDuration(travelTime);

      let tone: 'neutral' | 'positive' | 'negative' = 'neutral';
      if (speedLimitActive) {
        if (diffTime > 0.0001) {
          tone = 'negative';
        } else if (diffTime < -0.0001) {
          tone = 'positive';
        }
      }

      return {
        key: `${mark.speedUnit}-${mark.speedKmh}`,
        speedUnit: mark.speedUnit,
        speedKmh: mark.speedKmh,
        speedX: speedPoint.x,
        speedY: speedPoint.y,
        timeX: timePoint.x,
        timeY: timePoint.y,
        label,
        tone,
      };
    });
  }, [displayMarks, maxSpeed, distanceKm, baselineTravelTimeHours, speedLimitActive]);

  const ringArc = useMemo(() => {
    const span = dialSpan(maxSpeed);
    const ratio = span / 360;
    const specs = [226, 256, 286];
    return specs.map((radius) => {
      const circumference = 2 * Math.PI * radius;
      return {
        radius,
        strokeDasharray: `${circumference * ratio} ${circumference}`,
      };
    });
  }, [maxSpeed]);

  const needleTip = useMemo(() => {
    const angle = angleForSpeed(speed, maxSpeed);
    return pointOnArc(300, 300, ringArc[2].radius - 2, angle);
  }, [speed, maxSpeed, ringArc]);

  const needleTailTip = useMemo(() => {
    const angle = angleForSpeed(speed, maxSpeed) + 180;
    return pointOnArc(300, 300, 22, angle);
  }, [speed, maxSpeed]);

  const limitMarkOuter = useMemo(() => {
    const angle = angleForSpeed(speedLimit, maxSpeed);
    return pointOnArc(300, 300, ringArc[1].radius + 4, angle);
  }, [speedLimit, maxSpeed, ringArc]);

  const limitMarkInner = useMemo(() => {
    const angle = angleForSpeed(speedLimit, maxSpeed);
    return pointOnArc(300, 300, ringArc[1].radius - 24, angle);
  }, [speedLimit, maxSpeed, ringArc]);

  const limitRingMarker = useMemo(() => {
    const angle = angleForSpeed(speedLimit, maxSpeed);
    return pointOnArc(300, 300, ringArc[1].radius, angle);
  }, [speedLimit, maxSpeed, ringArc]);

  const currentRingMarker = useMemo(() => {
    const angle = angleForSpeed(speed, maxSpeed);
    return pointOnArc(300, 300, ringArc[2].radius, angle);
  }, [speed, maxSpeed, ringArc]);

  const currentState =
    !speedLimitActive || Math.abs(currentDiffHours) < 0.0001
      ? t.noDifference
      : currentDiffHours < 0
        ? t.timeSaved
        : t.timeLost;

  function handleUnitChange(nextUnit: DistanceUnit) {
    if (nextUnit === distanceUnit) {
      return;
    }

    if (nextUnit === 'mi') {
      const nextMax = speedometerMax('mi');
      setDistance(clamp(roundTo(distance * KM_TO_MI, 0), 10, 1000));
      setSpeed(clamp(roundTo(speed * KM_TO_MI, 0), 0, nextMax));
      setSpeedLimit(clamp(roundTo(speedLimit * KM_TO_MI, 0), 0, nextMax));
      setDistanceUnit('mi');
      return;
    }

    const nextMax = speedometerMax('km');
    setDistance(clamp(roundTo(distance * MI_TO_KM, 0), 10, 1000));
    setSpeed(clamp(roundTo(speed * MI_TO_KM, 0), 0, nextMax));
    setSpeedLimit(clamp(roundTo(speedLimit * MI_TO_KM, 0), 0, nextMax));
    setDistanceUnit('km');
  }

  function handleRingSelection(
    event: PointerEvent<SVGCircleElement>,
    target: 'current' | 'limit',
  ) {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) {
      return;
    }

    const value = Math.round(speedFromPointer(event.clientX, event.clientY, svg.getBoundingClientRect(), maxSpeed));

    if (target === 'current') {
      setSpeed(value);
      return;
    }

    setSpeedLimit(value);
  }

  function startRingDrag(
    event: PointerEvent<SVGCircleElement>,
    target: 'current' | 'limit',
  ) {
    setDragTarget(target);
    if (typeof event.currentTarget.setPointerCapture === 'function') {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Ignore capture errors on environments that do not fully support pointer capture.
      }
    }
    handleRingSelection(event, target);
  }

  function continueRingDrag(
    event: PointerEvent<SVGCircleElement>,
    target: 'current' | 'limit',
  ) {
    if (dragTarget !== target) {
      return;
    }
    handleRingSelection(event, target);
  }

  function stopRingDrag(event: PointerEvent<SVGCircleElement>) {
    if (typeof event.currentTarget.releasePointerCapture === 'function') {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore release errors for unsupported environments.
      }
    }
    setDragTarget(null);
  }

  async function shareCurrentSettings() {
    const url = new URL(window.location.href);
    url.searchParams.set('d', String(distance));
    url.searchParams.set('s', String(speed));
    url.searchParams.set('l', String(speedLimit));

    const shareUrl = `${url.origin}${url.pathname}?${url.searchParams.toString()}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus(`${t.shareCopied}: ${shareUrl}`);
        return;
      }
      setShareStatus(`${t.shareReady}: ${shareUrl}`);
    } catch {
      setShareStatus(`${t.shareError}: ${shareUrl}`);
    }
  }

  return (
    <main className="dashboard">
      <header className="topbar">
        <h1>Fast enough</h1>
        <div className="topbar-inline-controls">
          <label>
            {t.languageLabel}
            <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
              {languageOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            {t.unitLabel}
            <select value={distanceUnit} onChange={(event) => handleUnitChange(event.target.value as DistanceUnit)}>
              <option value="km">Kilometers (km/h)</option>
              <option value="mi">Miles (mph)</option>
            </select>
          </label>
        </div>

        <button type="button" className="share-action" onClick={shareCurrentSettings} data-testid="share-settings-btn">
          {t.shareSettings}
        </button>
      </header>

      <section className="top-controls" aria-label="primary controls">
        <label>
          {t.speedLabel}
          <div className="inline-value">
            <strong>{speed} {unitSuffix(distanceUnit)}</strong>
          </div>
          <input
            type="range"
            min={0}
            max={maxSpeed}
            value={speed}
            onChange={(event) => setSpeed(clamp(Number(event.target.value), 0, maxSpeed))}
            data-testid="speed-slider"
          />
        </label>

        <label className="compact-slider">
          {t.speedLimitLabel}
          <div className="inline-value">
            <strong>{speedLimit === 0 ? t.baselineOff : `${speedLimit} ${unitSuffix(distanceUnit)}`}</strong>
          </div>
          <input
            type="range"
            min={0}
            max={maxSpeed}
            value={speedLimit}
            onChange={(event) => setSpeedLimit(clamp(Number(event.target.value), 0, maxSpeed))}
            data-testid="speed-limit-slider"
          />
        </label>
      </section>

      <section className="speed-panel" aria-label={t.speedometerLabel}>
        <aside className="ring-legend" aria-label={t.ringLegendTitle}>
          <p>{t.ringLegendTitle}</p>
          <ul>
            <li>
              <span className="legend-swatch legend-scale" />
              {t.ringLegendScale}
            </li>
            <li>
              <span className="legend-swatch legend-limit" />
              {t.ringLegendLimit}
            </li>
            <li>
              <span className="legend-swatch legend-current" />
              {t.ringLegendCurrent}
            </li>
            <li className="legend-note">{t.ringLegendTapLimit}</li>
            <li className="legend-note">{t.ringLegendTapCurrent}</li>
          </ul>
        </aside>

        <div className="speedo-stack">
          <label className="distance-vertical" aria-label={t.distanceLabel}>
            <span>{t.distanceLabel}</span>
            <div className="distance-vertical-track">
              <input
                type="range"
                min={10}
                max={1000}
                step={10}
                value={distance}
                onChange={(event) => setDistance(clamp(Number(event.target.value), 10, 1000))}
                data-testid="distance-slider"
              />
            </div>
            <strong>
              {distance} {distanceSuffix(distanceUnit)}
            </strong>
          </label>

          <svg className="speedometer" viewBox="0 0 600 600" role="img" aria-label={t.speedometerLabel}>
          <defs>
            <linearGradient id="gaugeStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7ad5ff" />
              <stop offset="45%" stopColor="#ffe06a" />
              <stop offset="100%" stopColor="#ff6252" />
            </linearGradient>
            <linearGradient id="currentRingStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#43c8ff" />
              <stop offset="100%" stopColor="#8bedff" />
            </linearGradient>
            <linearGradient id="limitRingStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff9d56" />
              <stop offset="100%" stopColor="#ff6252" />
            </linearGradient>
          </defs>

          <circle cx="300" cy="300" r="276" fill="none" stroke="#0e1825" strokeWidth="8" />

          <circle cx="300" cy="300" r={ringArc[0].radius} fill="none" stroke="rgba(157, 180, 199, 0.16)" strokeWidth="11" />
          <circle
            cx="300"
            cy="300"
            r={ringArc[0].radius}
            fill="none"
            stroke="url(#gaugeStroke)"
            strokeWidth="11"
            strokeDasharray={ringArc[0].strokeDasharray}
            transform="rotate(-240 300 300)"
            strokeLinecap="round"
          />

          <circle cx="300" cy="300" r={ringArc[1].radius} fill="none" stroke="rgba(157, 180, 199, 0.14)" strokeWidth="10" />
          <circle
            cx="300"
            cy="300"
            r={ringArc[1].radius}
            fill="none"
            stroke="url(#limitRingStroke)"
            strokeWidth="10"
            strokeDasharray={ringArc[1].strokeDasharray}
            transform="rotate(-240 300 300)"
            strokeLinecap="round"
          />
          <circle
            cx="300"
            cy="300"
            r={ringArc[1].radius}
            fill="none"
            stroke="rgba(255, 120, 96, 0.33)"
            strokeWidth="1.4"
            strokeDasharray="5 9"
            className="ring-helper"
          />

          <circle cx="300" cy="300" r={ringArc[2].radius} fill="none" stroke="rgba(157, 180, 199, 0.13)" strokeWidth="10" />
          <circle
            cx="300"
            cy="300"
            r={ringArc[2].radius}
            fill="none"
            stroke="url(#currentRingStroke)"
            strokeWidth="10"
            strokeDasharray={ringArc[2].strokeDasharray}
            transform="rotate(-240 300 300)"
            strokeLinecap="round"
          />
          <circle
            cx="300"
            cy="300"
            r={ringArc[2].radius}
            fill="none"
            stroke="rgba(95, 210, 255, 0.33)"
            strokeWidth="1.4"
            strokeDasharray="5 9"
            className="ring-helper"
          />

          <circle
            cx="300"
            cy="300"
            r={ringArc[1].radius}
            fill="none"
            stroke="transparent"
            strokeWidth="34"
            onPointerDown={(event) => startRingDrag(event, 'limit')}
            onPointerMove={(event) => continueRingDrag(event, 'limit')}
            onPointerUp={stopRingDrag}
            onPointerCancel={stopRingDrag}
            className={`ring-click-target ${dragTarget === 'limit' ? 'dragging' : ''}`}
            data-testid="ring-limit"
          />
          <circle
            cx="300"
            cy="300"
            r={ringArc[2].radius}
            fill="none"
            stroke="transparent"
            strokeWidth="34"
            onPointerDown={(event) => startRingDrag(event, 'current')}
            onPointerMove={(event) => continueRingDrag(event, 'current')}
            onPointerUp={stopRingDrag}
            onPointerCancel={stopRingDrag}
            className={`ring-click-target ${dragTarget === 'current' ? 'dragging' : ''}`}
            data-testid="ring-current"
          />

          <circle cx="300" cy="300" r="180" fill="none" stroke="rgba(166, 196, 220, 0.18)" strokeWidth="2" />

          <circle cx={limitRingMarker.x} cy={limitRingMarker.y} r="9" className="limit-sign-outer" />
          <circle cx={limitRingMarker.x} cy={limitRingMarker.y} r="5.2" className="limit-sign-inner" />
          <circle cx={currentRingMarker.x} cy={currentRingMarker.y} r="7" className="ring-marker current" />

          {Array.from({ length: Math.floor(maxSpeed / 10) + 1 }, (_, index) => index * 10).map((value) => {
            const angle = angleForSpeed(value, maxSpeed);
            const major = value % 20 === 0;
            const outer = pointOnArc(300, 300, 247, angle);
            const inner = pointOnArc(300, 300, major ? 212 : 222, angle);

            return (
              <line
                key={value}
                x1={outer.x}
                y1={outer.y}
                x2={inner.x}
                y2={inner.y}
                stroke={major ? '#eaf4ff' : '#8ea7be'}
                strokeWidth={major ? 2.7 : 1.5}
              />
            );
          })}

          {overlays.map((entry) => (
            <text key={`speed-${entry.key}`} x={entry.speedX} y={entry.speedY} textAnchor="middle" className="overlay-speed-label">
              {entry.speedUnit}
            </text>
          ))}

          {speedLimitActive && (
            <>
              <line
                x1={limitMarkInner.x}
                y1={limitMarkInner.y}
                x2={limitMarkOuter.x}
                y2={limitMarkOuter.y}
                className="limit-indicator"
              />
            </>
          )}

          <line x1="300" y1="300" x2={needleTailTip.x} y2={needleTailTip.y} className="needle-tail" />
          <line x1="300" y1="300" x2={needleTip.x} y2={needleTip.y} className="needle" />
          <circle cx="300" cy="300" r="13" className="needle-center" />

          <text x="300" y="284" textAnchor="middle" className="speed-value" data-testid="speed-value">
            {Math.round(speed)}
          </text>
          <text x="300" y="308" textAnchor="middle" className="speed-unit">
            {unitSuffix(distanceUnit)}
          </text>
          <text x="300" y="329" textAnchor="middle" className="speed-kmh">
            {Math.round(speedKmh)} km/h
          </text>

          {overlays.map((entry) => (
            <text
              key={`time-${entry.key}`}
              x={entry.timeX}
              y={entry.timeY}
              textAnchor="middle"
              className={`overlay-time ${entry.tone}`}
              data-testid={entry.speedKmh === 100 ? 'overlay-100' : undefined}
            >
              {entry.label}
            </text>
          ))}
        </svg>
        </div>

        <div className="drive-controls">
          <div className="share-box">
            {shareStatus ? (
              <p className="share-status" data-testid="share-status">{shareStatus}</p>
            ) : null}
          </div>
        </div>

        <section className="result-card summary-floating" aria-live="polite">
          <p className="label">{t.summaryLabel}</p>
          <p className={`delta ${currentDiffHours < 0 ? 'positive' : ''} ${currentDiffHours > 0 ? 'negative' : ''}`} data-testid="time-saved-value">
            {signedDuration(currentDiffHours)}
          </p>
          <p className="delta-state" data-testid="time-saved-state">{currentState}</p>
          <p className="small-line">{t.currentTravelTime}: <strong>{formatDuration(currentTravelTimeHours)}</strong></p>
          <p className="small-line">
            {speedLimitActive ? t.baselineTravelTime : t.baselineNote}:{' '}
            <strong>{speedLimitActive ? formatDuration(baselineTravelTimeHours) : t.baselineOff}</strong>
          </p>
        </section>
      </section>
    </main>
  );
}

export default App;