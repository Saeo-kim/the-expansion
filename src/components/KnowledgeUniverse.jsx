
import { useMemo, useRef, useState } from 'react';

const regions = [
  { id: 'systems', name: 'COMPUTER SCIENCE', sub: 'Systems & Computing', x: 245, y: 205, color: '#a78bfa' },
  { id: 'web', name: 'WEB UNIVERSE', sub: 'Web & Networks', x: 610, y: 155, color: '#67d5ed' },
  { id: 'data', name: 'DATA SPACE', sub: 'Data & Databases', x: 940, y: 320, color: '#8de0b2' },
  { id: 'security', name: 'SECURITY ZONE', sub: 'Identity & Protection', x: 370, y: 570, color: '#f0a4bd' },
  { id: 'infrastructure', name: 'INFRASTRUCTURE', sub: 'Cloud & Deployment', x: 835, y: 600, color: '#f3c879' },
];

const nodes = [
  { id: 'computer', name: 'Computer', region: 'systems', x: 160, y: 155, desc: 'The physical and logical foundations of computing.' },
  { id: 'hardware', name: 'Hardware', region: 'systems', x: 270, y: 95, desc: 'The physical components of a computer system.' },
  { id: 'software', name: 'Software', region: 'systems', x: 340, y: 205, desc: 'Programs and instructions executed by computers.' },
  { id: 'os', name: 'Operating System', region: 'systems', x: 185, y: 300, desc: 'Software that manages hardware and system resources.' },
  { id: 'algorithm', name: 'Algorithms', region: 'systems', x: 365, y: 330, desc: 'Step-by-step procedures for solving computational problems.' },

  { id: 'html', name: 'HTML', region: 'web', x: 485, y: 105, desc: 'The markup language that structures web documents.' },
  { id: 'css', name: 'CSS', region: 'web', x: 600, y: 65, desc: 'The language used to describe the presentation of documents.' },
  { id: 'javascript', name: 'JavaScript', region: 'web', x: 720, y: 115, desc: 'A programming language used to create interactive experiences.' },
  { id: 'browser', name: 'Browser', region: 'web', x: 520, y: 240, desc: 'Software that retrieves and displays web resources.' },
  { id: 'http', name: 'HTTP', region: 'web', x: 680, y: 260, desc: 'The application-layer protocol used for web communication.' },
  { id: 'api', name: 'API', region: 'web', x: 790, y: 200, desc: 'An interface that allows software systems to communicate.' },
  { id: 'web-concept', name: 'WEB', region: 'web', x: 625, y: 175, desc: 'A system of interlinked documents and resources accessed over the Internet.' },

  { id: 'json', name: 'JSON', region: 'data', x: 890, y: 210, desc: 'A lightweight format for exchanging structured data.' },
  { id: 'sql', name: 'SQL', region: 'data', x: 1010, y: 270, desc: 'A language for querying and managing relational data.' },
  { id: 'database', name: 'Database', region: 'data', x: 930, y: 390, desc: 'An organized collection of data.' },
  { id: 'model', name: 'Data Model', region: 'data', x: 1080, y: 405, desc: 'A representation of how data is structured and related.' },

  { id: 'authentication', name: 'Authentication', region: 'security', x: 270, y: 485, desc: 'The process of verifying an identity.' },
  { id: 'authorization', name: 'Authorization', region: 'security', x: 430, y: 485, desc: 'The process of determining what an identity can access.' },
  { id: 'jwt', name: 'JWT', region: 'security', x: 340, y: 635, desc: 'A compact token format for representing claims between parties.' },
  { id: 'oauth2', name: 'OAuth 2.0', region: 'security', x: 485, y: 620, desc: 'A framework for delegated authorization.' },
  { id: 'token', name: 'Token', region: 'security', x: 520, y: 550, desc: 'A data structure or value that represents information, identity, or authorization.' },

  { id: 'server', name: 'Server', region: 'infrastructure', x: 720, y: 500, desc: 'A system that provides resources or services to clients.' },
  { id: 'linux', name: 'Linux', region: 'infrastructure', x: 850, y: 490, desc: 'An open-source family of operating systems.' },
  { id: 'docker', name: 'Docker', region: 'infrastructure', x: 950, y: 570, desc: 'A platform for packaging and running applications in containers.' },
  { id: 'cloud', name: 'Cloud', region: 'infrastructure', x: 760, y: 680, desc: 'On-demand computing resources delivered over a network.' },
];

const connections = [
  // Computer Science
  ['computer', 'hardware'],
  ['computer', 'software'],
  ['computer', 'os'],
  ['software', 'algorithm'],
  ['os', 'server'],

  // Web Universe
  ['web-concept', 'html'],
  ['web-concept', 'css'],
  ['web-concept', 'javascript'],
  ['web-concept', 'browser'],
  ['web-concept', 'http'],
  ['web-concept', 'api'],
  ['web-concept', 'server'],

  ['html', 'css'],
  ['css', 'javascript'],
  ['javascript', 'browser'],
  ['browser', 'http'],
  ['http', 'api'],
  ['api', 'json'],

  // Data Space
  ['json', 'database'],
  ['sql', 'database'],
  ['database', 'model'],

  // Security Zone
  ['authentication', 'authorization'],
  ['authentication', 'jwt'],
  ['authorization', 'oauth2'],

  // JWT relationships
  ['jwt', 'json'],
  ['jwt', 'web-concept'],
  ['jwt', 'token'],
  ['jwt', 'http'],
  ['oauth2', 'api'],

  // Infrastructure
  ['server', 'linux'],
  ['linux', 'docker'],
  ['docker', 'cloud'],
  ['server', 'http'],
  ['database', 'server'],

  // Cross-domain relationships
  ['javascript', 'api'],
  ['software', 'javascript'],
];

export default function KnowledgeUniverse() {
  const [selected, setSelected] = useState('jwt');
  const [query, setQuery] = useState('');
  const [zoom, setZoom] = useState(0.85);
  const [offset, setOffset] = useState({ x: 90, y: 45 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const svgRef = useRef(null);

  const selectedNode = nodes.find((node) => node.id === selected);
  const selectedRegion = regions.find((region) => region.id === selectedNode?.region);

  const related = useMemo(() => {
    return connections
      .filter(([a, b]) => a === selected || b === selected)
      .map(([a, b]) => nodes.find((node) => node.id === (a === selected ? b : a)))
      .filter(Boolean);
  }, [selected]);

  function focusNode(node) {
    setSelected(node.id);
    setZoom(1.45);
    setOffset({
      x: 600 - node.x * 1.45,
      y: 375 - node.y * 1.45,
    });
  }

  function search(event) {
    event.preventDefault();
    const found = nodes.find((node) =>
      node.name.toLowerCase().includes(query.trim().toLowerCase())
    );
    if (found) focusNode(found);
  }

  function handleWheel(event) {
    event.preventDefault();
    const next = Math.min(2.2, Math.max(0.55, zoom - event.deltaY * 0.001));
    setZoom(next);
  }

  function startDrag(event) {
    if (event.target.closest('.universe-node')) return;
    setDragging(true);
    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    };
    svgRef.current?.setPointerCapture(event.pointerId);
  }

  function moveDrag(event) {
    if (!dragging || !dragStart.current) return;
    setOffset({
      x: dragStart.current.offsetX + event.clientX - dragStart.current.x,
      y: dragStart.current.offsetY + event.clientY - dragStart.current.y,
    });
  }

  function stopDrag() {
    setDragging(false);
    dragStart.current = null;
  }

  function resetView() {
    setZoom(0.85);
    setOffset({ x: 90, y: 45 });
    setSelected('jwt');
  }

  const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));

  return (
    <main className="universe">
      <header className="universe-header">
        <a className="universe-brand" href="/">
          <span className="brand-mark">✳</span>
          THE EXPANSION
        </a>
        <div className="header-center">KNOWLEDGE UNIVERSE <span>01 / EXPLORE</span></div>
        <a className="header-back" href="/encyclopedia/">ENCYCLOPEDIA ↗</a>
      </header>

      <section className="universe-toolbar">
        <div>
          <p className="eyebrow">A MAP OF TECHNICAL KNOWLEDGE</p>
          <h1>Explore the connections.</h1>
          <p className="intro">Every concept belongs somewhere. Every idea connects to another.</p>
        </div>
        <form className="universe-search" onSubmit={search}>
          <span>⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a concept... e.g. JWT"
            aria-label="Search concepts"
          />
          <button type="submit">EXPLORE ↗</button>
        </form>
      </section>

      <section className="universe-stage">
        <div className="stage-label">
          <span className="live-dot" /> KNOWLEDGE SPACE
          <span className="stage-count">{nodes.length} CONCEPTS · {connections.length} CONNECTIONS</span>
        </div>

        <svg
          ref={svgRef}
          viewBox="0 0 1200 760"
          className={dragging ? 'universe-svg dragging' : 'universe-svg'}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onWheel={handleWheel}
        >
          <defs>
            <radialGradient id="spaceGlow">
              <stop offset="0%" stopColor="#57438f" stopOpacity=".32" />
              <stop offset="100%" stopColor="#11121c" stopOpacity="0" />
            </radialGradient>
            <filter id="nodeGlow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <rect width="1200" height="760" fill="#11121c" />
          <circle cx="600" cy="370" r="430" fill="url(#spaceGlow)" />

          {Array.from({ length: 85 }, (_, i) => (
            <circle
              key={i}
              cx={(i * 137 + 29) % 1200}
              cy={(i * 83 + 17) % 760}
              r={i % 7 === 0 ? 1.5 : 0.8}
              fill="#b9b1e8"
              opacity={i % 4 === 0 ? 0.55 : 0.2}
            />
          ))}

          <g transform={`translate(${offset.x} ${offset.y}) scale(${zoom})`}>
            {regions.map((region) => (
              <g key={region.id}>
                <circle
                  cx={region.x}
                  cy={region.y}
                  r="125"
                  fill={region.color}
                  opacity=".045"
                  stroke={region.color}
                  strokeOpacity=".24"
                  strokeWidth="1"
                  strokeDasharray="4 9"
                />
                <text x={region.x} y={region.y - 145} textAnchor="middle" className="region-name" fill={region.color}>
                  {region.name}
                </text>
                <text x={region.x} y={region.y - 128} textAnchor="middle" className="region-sub">
                  {region.sub}
                </text>
              </g>
            ))}

            {connections.map(([a, b], i) => {
              const from = nodeMap[a];
              const to = nodeMap[b];
              const active = selected === a || selected === b;
              return (
                <line
                  key={i}
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke={active ? '#bba5ff' : '#78809b'}
                  strokeWidth={active ? 2 : 1}
                  opacity={active ? 0.9 : 0.28}
                />
              );
            })}

            {nodes.map((node) => {
              const region = regions.find((item) => item.id === node.region);
              const active = selected === node.id;
              const connected = related.some((item) => item.id === node.id);
              return (
                <g
                  key={node.id}
                  className="universe-node"
                  onClick={() => focusNode(node)}
                  role="button"
                  tabIndex="0"
                  aria-label={`Explore ${node.name}`}
                  onKeyDown={(event) => event.key === 'Enter' && focusNode(node)}
                  style={{ cursor: 'pointer' }}
                >
                  {(active || connected) && (
                    <circle cx={node.x} cy={node.y} r={active ? 27 : 21} fill={region.color} opacity=".12" filter="url(#nodeGlow)" />
                  )}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={active ? 17 : 10}
                    fill={active ? region.color : '#202538'}
                    stroke={region.color}
                    strokeWidth={active ? 2.5 : 1.2}
                    opacity={active || connected ? 1 : 0.8}
                  />
                  <text
                    x={node.x}
                    y={node.y + (active ? 36 : 27)}
                    textAnchor="middle"
                    className={active ? 'node-label active-label' : 'node-label'}
                    opacity={active || connected ? 1 : 0.78}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        <div className="map-controls">
          <button onClick={() => setZoom((value) => Math.min(2.2, value + 0.15))} aria-label="Zoom in">＋</button>
          <button onClick={() => setZoom((value) => Math.max(0.55, value - 0.15))} aria-label="Zoom out">－</button>
          <button onClick={resetView} aria-label="Reset view">⌖</button>
        </div>

        <div className="map-hint">DRAG TO MOVE <span>·</span> SCROLL TO ZOOM <span>·</span> SELECT A NODE</div>

        {selectedNode && (
          <aside className="node-panel">
            <div className="panel-top">
              <span className="eyebrow">SELECTED CONCEPT</span>
              <button onClick={() => setSelected(null)} aria-label="Close details">×</button>
            </div>
            <p className="panel-region" style={{ color: selectedRegion?.color }}>{selectedRegion?.name}</p>
            <h2>{selectedNode.name}</h2>
            <p className="panel-description">{selectedNode.desc}</p>
            <div className="related-title">CONNECTED CONCEPTS <span>{related.length}</span></div>
            <div className="related-list">
              {related.map((node) => (
                <button key={node.id} onClick={() => focusNode(node)}>
                  {node.name}<span>↗</span>
                </button>
              ))}
            </div>
            <div className="panel-footer">KNOWLEDGE UNIVERSE / THE EXPANSION</div>
          </aside>
        )}
      </section>

      <footer className="universe-footer">
        <span>THE EXPANSION © 2026</span>
        <span>AN EXPLORABLE MAP OF TECHNOLOGY</span>
        <span>PROTOTYPE 01.0</span>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        .universe {
          min-height: 100vh; background: #11121c; color: #f3f0ff;
          font-family: Inter, Arial, sans-serif; overflow: hidden;
        }
        .universe-header {
          height: 68px; padding: 0 4vw; display: flex; align-items: center;
          justify-content: space-between; border-bottom: 1px solid #ffffff18;
        }
        .universe-brand { color: #fff; text-decoration: none; font-size: 14px; letter-spacing: .12em; font-weight: 700; }
        .brand-mark { color: #b7a0ff; font-size: 22px; margin-right: 10px; }
        .header-center { font-size: 11px; letter-spacing: .18em; color: #d8d0f2; }
        .header-center span { color: #77758e; margin-left: 15px; }
        .header-back { color: #aaa5bf; text-decoration: none; font-size: 10px; letter-spacing: .12em; }
        .universe-toolbar {
          display: flex; justify-content: space-between; align-items: end; gap: 30px;
          padding: 48px 5vw 30px;
        }
        .eyebrow { color: #a995e9; font-size: 9px; letter-spacing: .2em; margin: 0 0 12px; }
        .universe-toolbar h1 { font-size: clamp(28px, 4vw, 48px); letter-spacing: -.045em; margin: 0; font-weight: 500; }
        .intro { color: #9998ad; font-size: 13px; margin: 12px 0 0; }
        .universe-search {
          display: flex; align-items: center; width: min(390px, 42vw); min-width: 260px;
          height: 46px; padding: 0 7px 0 14px; border: 1px solid #49445f;
          background: #1b1b2a; border-radius: 5px;
        }
        .universe-search > span { font-size: 24px; color: #a995e9; margin-right: 9px; }
        .universe-search input { flex: 1; min-width: 0; color: white; background: transparent; border: 0; outline: 0; font-size: 12px; }
        .universe-search button { border: 0; background: #9b83e8; color: #151321; padding: 11px 13px; font-size: 9px; letter-spacing: .1em; cursor: pointer; border-radius: 3px; }
        .universe-stage { margin: 0 3vw; height: min(67vw, 690px); min-height: 470px; position: relative; border: 1px solid #343147; border-radius: 8px; overflow: hidden; background: #11121c; }
        .stage-label { position: absolute; z-index: 2; top: 17px; left: 20px; color: #c9c1e4; font-size: 9px; letter-spacing: .15em; pointer-events: none; }
        .live-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #8de0b2; margin-right: 9px; box-shadow: 0 0 10px #8de0b2; }
        .stage-count { color: #77758e; margin-left: 18px; }
        .universe-svg { position: absolute; inset: 0; width: 100%; height: 100%; touch-action: none; cursor: grab; }
        .universe-svg.dragging { cursor: grabbing; }
        .region-name { font-size: 10px; letter-spacing: 2px; font-weight: 700; }
        .region-sub { fill: #85839b; font-size: 9px; letter-spacing: .5px; }
        .node-label { fill: #c8c5d9; font-size: 12px; pointer-events: none; }
        .active-label { fill: white; font-weight: 700; }
        .map-controls { position: absolute; bottom: 22px; right: 20px; display: flex; flex-direction: column; border: 1px solid #514b68; border-radius: 5px; overflow: hidden; }
        .map-controls button { width: 38px; height: 37px; background: #1b1b2b; color: #e7e1ff; border: 0; border-bottom: 1px solid #514b68; cursor: pointer; font-size: 20px; }
        .map-controls button:last-child { border-bottom: 0; font-size: 17px; }
        .map-controls button:hover { background: #37304f; }
        .map-hint { position: absolute; bottom: 30px; left: 22px; color: #77758e; font-size: 9px; letter-spacing: .12em; pointer-events: none; }
        .map-hint span { color: #a995e9; padding: 0 7px; }
        .node-panel {
          position: absolute; top: 50%; right: 22px; transform: translateY(-50%);
          width: 260px; padding: 20px; border: 1px solid #514b68; border-radius: 7px;
          background: #191927ee; backdrop-filter: blur(15px); box-shadow: 0 15px 55px #0008;
        }
        .panel-top { display: flex; justify-content: space-between; align-items: center; }
        .panel-top .eyebrow { margin: 0; }
        .panel-top button { background: none; border: 0; color: #aaa5bf; font-size: 21px; cursor: pointer; }
        .panel-region { font-size: 9px; letter-spacing: .15em; margin: 23px 0 8px; }
        .node-panel h2 { font-size: 25px; font-weight: 500; margin: 0 0 12px; }
        .panel-description { color: #aaa8bd; font-size: 12px; line-height: 1.7; min-height: 60px; }
        .related-title { border-top: 1px solid #ffffff1b; padding-top: 17px; margin-top: 20px; color: #aaa5bf; font-size: 9px; letter-spacing: .12em; }
        .related-title span { color: #b7a0ff; margin-left: 7px; }
        .related-list { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 12px; }
        .related-list button { color: #ded8f4; background: #ffffff0b; border: 1px solid #ffffff20; border-radius: 3px; padding: 7px 9px; font-size: 10px; cursor: pointer; }
        .related-list button:hover { border-color: #a995e9; }
        .related-list button span { color: #a995e9; margin-left: 7px; }
        .panel-footer { color: #66647b; font-size: 8px; letter-spacing: .12em; margin-top: 22px; }
        .universe-footer { padding: 18px 4vw; display: flex; justify-content: space-between; color: #69677d; font-size: 8px; letter-spacing: .13em; }
        @media (max-width: 700px) {
          .header-center { display: none; }
          .universe-toolbar { display: block; padding: 32px 5vw 22px; }
          .universe-search { width: 100%; margin-top: 22px; }
          .universe-stage { margin: 0 12px; height: 650px; min-height: 0; }
          .node-panel { top: auto; bottom: 65px; right: 12px; transform: none; width: min(260px, calc(100% - 24px)); }
          .stage-count { display: block; margin: 8px 0 0 15px; }
          .universe-footer span:nth-child(2) { display: none; }
        }
      `}</style>
    </main>
  );
}
