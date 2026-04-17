import { useMemo, useState } from "react";

const swapPairs = {
  ETH: { USDC: 3512.41, USDT: 3510.88, NOVA: 9500 },
  BNB: { USDC: 635.18, USDT: 634.72, NOVA: 1750 },
  MATIC: { USDC: 1.18, USDT: 1.17, NOVA: 3.25 },
  ARB: { USDC: 2.01, USDT: 2.0, NOVA: 5.43 }
};

const defaultTasks = [
  { id: "x-follow", label: "Follow Arc Nova on X", reward: 20 },
  { id: "x-retweet", label: "Retweet launch post", reward: 25 },
  { id: "linkedin-follow", label: "Follow LinkedIn page", reward: 20 },
  { id: "linkedin-share", label: "Share Arc Nova update", reward: 30 },
  { id: "discord-join", label: "Join Discord", reward: 20 },
  { id: "telegram-join", label: "Join Telegram", reward: 20 },
  { id: "first-liquidity", label: "Add liquidity once", reward: 60 },
  { id: "friend-referral", label: "Invite a friend", reward: 80 }
];

const tierConfig = [
  { name: "Silver", min: 0 },
  { name: "Gold", min: 200 },
  { name: "Platinum", min: 500 },
  { name: "Diamond", min: 1000 }
];

const steps = ["Wallet Signature", "Routing", "On-chain Execution", "Confirmed"];

const walletOptions = ["MetaMask", "WalletConnect", "Coinbase Wallet"];

function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  const setPersistent = (value) => {
    setState((prev) => {
      const resolved = value instanceof Function ? value(prev) : value;
      localStorage.setItem(key, JSON.stringify(resolved));
      return resolved;
    });
  };

  return [state, setPersistent];
}

export default function App() {
  const [wallet, setWallet] = usePersistentState("arc-wallet", "");
  const [points, setPoints] = usePersistentState("arc-points", 0);
  const [doneTasks, setDoneTasks] = usePersistentState("arc-tasks", []);

  const [chain, setChain] = useState("ETH");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");
  const [amount, setAmount] = useState(0.1);

  const [bridgeFrom, setBridgeFrom] = useState("Ethereum");
  const [bridgeTo, setBridgeTo] = useState("Arbitrum");
  const [bridgeToken, setBridgeToken] = useState("USDC");
  const [bridgeAmount, setBridgeAmount] = useState(50);

  const [swapStep, setSwapStep] = useState(0);
  const [bridgeStep, setBridgeStep] = useState(0);

  const rate = useMemo(() => {
    return swapPairs[chain]?.[toToken] ?? 1;
  }, [chain, toToken]);

  const receiveAmount = (Number(amount) * rate).toFixed(4);
  const tier = [...tierConfig].reverse().find((t) => points >= t.min)?.name ?? "Silver";

  const rankData = useMemo(() => {
    const base = [
      { name: "NovaWhale", points: 1280 },
      { name: "BridgeMaster", points: 870 },
      { name: "SwapNinja", points: 640 },
      { name: "TaskHero", points: 520 },
      { name: wallet || "You", points }
    ];
    return base.sort((a, b) => b.points - a.points).map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [points, wallet]);

  const runSteps = (setStep, reward) => {
    setStep(1);
    let current = 1;
    const timer = setInterval(() => {
      current += 1;
      setStep(current);
      if (current === steps.length) {
        clearInterval(timer);
        setTimeout(() => {
          setPoints((p) => p + reward);
          setStep(0);
        }, 800);
      }
    }, 900);
  };

  const connectWallet = (value) => {
    if (!wallet) {
      setPoints((p) => p + 50);
    }
    setWallet(value);
  };

  const completeTask = (id, reward) => {
    if (doneTasks.includes(id)) return;
    setDoneTasks((tasks) => [...tasks, id]);
    setPoints((p) => p + reward);
  };

  const uniqueIdeas = [
    "Intent-based swap matcher: users post intents and solvers fill with best route.",
    "Bridge risk meter: dynamic score using liquidity depth and chain congestion.",
    "Streak quests: complete one task daily for multiplier rewards.",
    "Proof-of-learning tasks: watch DeFi safety mini-lessons to unlock bonus points.",
    "Community vault challenges: team-based milestones that unlock seasonal NFTs."
  ];

  return (
    <div className="app">
      <header className="hero">
        <h1>Arc Nova</h1>
        <p>Swap • Bridge • Social Tasks • Points • Leaderboard</p>
        <div className="wallet-row">
          <span>Wallet:</span>
          {walletOptions.map((w) => (
            <button
              key={w}
              className={wallet === w ? "active" : ""}
              onClick={() => connectWallet(w)}
            >
              {w}
            </button>
          ))}
        </div>
      </header>

      <section className="grid">
        <article className="card">
          <h2>Swap</h2>
          <div className="form-row">
            <label>Chain</label>
            <select value={chain} onChange={(e) => { setChain(e.target.value); setFromToken(e.target.value); }}>
              {Object.keys(swapPairs).map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-row">
            <label>From</label>
            <input value={fromToken} readOnly />
          </div>
          <div className="form-row">
            <label>To</label>
            <select value={toToken} onChange={(e) => setToToken(e.target.value)}>
              <option>USDC</option>
              <option>USDT</option>
              <option>NOVA</option>
            </select>
          </div>
          <div className="form-row">
            <label>Amount</label>
            <input type="number" value={amount} min="0" step="0.01" onChange={(e) => setAmount(e.target.value)} />
          </div>
          <p className="quote">Estimated receive: {receiveAmount} {toToken}</p>
          <button onClick={() => runSteps(setSwapStep, 50)} disabled={swapStep > 0}>Swap Now (+50 PTS)</button>
          <StepProgress current={swapStep} />
        </article>

        <article className="card">
          <h2>Bridge</h2>
          <div className="form-row">
            <label>From</label>
            <select value={bridgeFrom} onChange={(e) => setBridgeFrom(e.target.value)}>
              <option>Ethereum</option>
              <option>BSC</option>
              <option>Polygon</option>
              <option>Arbitrum</option>
            </select>
          </div>
          <div className="form-row">
            <label>To</label>
            <select value={bridgeTo} onChange={(e) => setBridgeTo(e.target.value)}>
              <option>Arbitrum</option>
              <option>Ethereum</option>
              <option>BSC</option>
              <option>Polygon</option>
            </select>
          </div>
          <div className="form-row">
            <label>Token</label>
            <select value={bridgeToken} onChange={(e) => setBridgeToken(e.target.value)}>
              <option>USDC</option>
              <option>USDT</option>
              <option>ETH</option>
            </select>
          </div>
          <div className="form-row">
            <label>Amount</label>
            <input type="number" value={bridgeAmount} min="0" step="1" onChange={(e) => setBridgeAmount(e.target.value)} />
          </div>
          <p className="quote">Route: {bridgeFrom} → {bridgeTo} ({bridgeAmount} {bridgeToken})</p>
          <button onClick={() => runSteps(setBridgeStep, 75)} disabled={bridgeStep > 0}>Bridge Now (+75 PTS)</button>
          <StepProgress current={bridgeStep} />
        </article>

        <article className="card">
          <h2>Tasks & Rewards</h2>
          <ul className="task-list">
            {defaultTasks.map((task) => (
              <li key={task.id}>
                <span>{task.label}</span>
                <button disabled={doneTasks.includes(task.id)} onClick={() => completeTask(task.id, task.reward)}>
                  {doneTasks.includes(task.id) ? "Done" : `+${task.reward} PTS`}
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Profile</h2>
          <p><strong>Points:</strong> {points}</p>
          <p><strong>Tier:</strong> {tier}</p>
          <progress max="1000" value={Math.min(points, 1000)} />
          <h3>Portfolio</h3>
          <ul className="portfolio">
            <li>Ethereum: $2,431.11</li>
            <li>Arbitrum: $1,201.72</li>
            <li>BSC: $531.42</li>
            <li>Polygon: $312.14</li>
          </ul>
        </article>
      </section>

      <section className="card">
        <h2>Leaderboard</h2>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Wallet</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {rankData.map((r) => (
              <tr key={r.rank + r.name}>
                <td>#{r.rank}</td>
                <td>{r.name}</td>
                <td>{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>Unique Ideas (Inspired by top DeFi apps)</h2>
        <ul>
          {uniqueIdeas.map((idea) => <li key={idea}>{idea}</li>)}
        </ul>
      </section>
    </div>
  );
}

function StepProgress({ current }) {
  return (
    <ol className="steps">
      {steps.map((step, idx) => {
        const state = current === 0 ? "" : idx + 1 < current ? "done" : idx + 1 === current ? "active" : "";
        return (
          <li key={step} className={state}>
            {step}
          </li>
        );
      })}
    </ol>
  );
}
