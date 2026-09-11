import { Routes, Route, Navigate, Link } from 'react-router-dom';

const mockSaleWindow = {
  crop: 'Tomato',
  current_price: 28,
  predicted_7_day_price: 31,
  recommended_range: [29, 32],
  suggested_action: 'Wait 2-3 days',
  confidence_score: 72.4,
};

const farmerOffers = [
  { id: 1, buyer: 'Nutrient Foods', price: 3020, quantity: '1600 kg', region: 'Pune', status: 'Pending' },
  { id: 2, buyer: 'Vara Agro', price: 2950, quantity: '1200 kg', region: 'Nashik', status: 'Countered' },
  { id: 3, buyer: 'Green Basket', price: 3100, quantity: '2000 kg', region: 'Aurangabad', status: 'Accepted' },
];

const buyerMatches = [
  { lot_id: 102, farmer_name: 'Saraswati FPO', matching_score: 94.2, distance_km: 32.5, price_score: 100, verified: true },
  { lot_id: 103, farmer_name: 'Kamal Farms', matching_score: 91.7, distance_km: 46.1, price_score: 92, verified: true },
  { lot_id: 104, farmer_name: 'Rajasthan Co-op', matching_score: 88.9, distance_km: 58.2, price_score: 89, verified: false },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3 font-bold text-2xl">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-lg text-white">↗</div>
          <span>Kisan<span className="text-primary">Setu</span></span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link to="/">Home</Link>
          <Link to="/farmer/dashboard">Farmer</Link>
          <Link to="/buyer/dashboard">Buyer</Link>
          <Link to="/admin/dashboard">Admin</Link>
        </nav>
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Log in</button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft">Start selling</button>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-green-700">
              <span className="h-2 w-2 rounded-full bg-primary" /> Market intelligence for Bharat
            </div>
            <h1 className="text-5xl font-black leading-tight tracking-[-0.08em] text-navy md:text-7xl">
              Discover the right market.<br />
              <span className="text-primary">Match with the right buyer.</span><br />
              Sell at the right time.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              KisanSetu connects farmers and FPOs directly with verified buyers while using market intelligence and AI to improve price realization.
            </p>
            <div className="mt-8 flex gap-4">
              <button className="rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-soft">Start Selling</button>
              <button className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700">Find Produce</button>
            </div>
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-900">RK</span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-green-200 text-[10px] font-bold text-green-900">AS</span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-sky-200 text-[10px] font-bold text-sky-900">MP</span>
              </div>
              <div>
                <div className="font-bold text-navy">12,400+ farmers</div>
                <div className="text-xs text-slate-500">already selling better</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-10 top-10 h-80 w-80 rounded-full bg-amber-200/70 blur-3xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-8 shadow-soft">
              <div className="rounded-2xl bg-white p-5 shadow-md">
                <div className="mb-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500" /> Live market price</span>
                  <span className="rounded bg-green-100 px-2 py-1 text-green-700">+8.4%</span>
                </div>
                <div className="mb-2 flex items-end justify-between">
                  <div>
                    <div className="text-xl font-bold text-navy">Onion</div>
                    <div className="text-xs text-slate-500">Nashik APMC</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black tracking-[-0.06em] text-navy">₹ 2,840</div>
                    <div className="text-[10px] text-slate-500">/ quintal</div>
                  </div>
                </div>
                <div className="mt-4 flex h-10 items-end gap-1">
                  {[24, 28, 26, 31, 33, 36, 40, 48, 52].map((h, i) => (
                    <span key={i} className="flex-1 rounded-t bg-green-400/80" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-[#0F2942] p-4 text-white">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">AI recommendation</div>
                <div className="mt-2 text-xl font-bold">Sell in 3–5 days</div>
                <div className="mt-1 text-sm text-slate-300">Expected price ₹3,120</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">One simple journey</div>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.07em] text-navy">From harvest to <span className="text-primary">higher returns.</span></h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-5">
            {['Discover', 'Match', 'Sell'].map((step, i) => (
              <div key={step} className={`rounded-2xl border p-6 ${i === 0 ? 'bg-green-50' : i === 1 ? 'bg-amber-50' : 'bg-violet-50'}`}>
                <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">0{i + 1}</div>
                <div className="mb-4 text-3xl">{i === 0 ? '⌁' : i === 1 ? '✦' : '◒'}</div>
                <h3 className="text-2xl font-bold text-navy">{step}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {i === 0 ? 'See live prices, demand and price forecasts across nearby markets.' : i === 1 ? 'Get matched with verified buyers who look for your crop profile.' : 'Negotiate, coordinate logistics and track payments in one place.'}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">Data that works for you</div>
                <h2 className="mt-3 text-4xl font-black tracking-[-0.07em] text-navy">Know the market.<br /><span className="text-primary">Know your worth.</span></h2>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-4">
              {[{ label: 'Current market price', value: '₹ 2,840', trend: '↑ 8.4%' }, { label: 'Predicted 7-day price', value: '₹ 3,120', trend: 'High confidence' }, { label: 'Best time to sell', value: '3–5 days', trend: 'Based on demand' }, { label: 'Active buyers', value: '1,284', trend: '↑ 12%' }].map((card) => (
                <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{card.label}</div>
                  <div className="mt-6 text-3xl font-black tracking-[-0.05em] text-navy">{card.value}</div>
                  <div className="mt-2 text-xs text-slate-500">{card.trend}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FarmerDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-6 shadow-soft">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">Farmer dashboard</div>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.06em] text-navy">Good morning, Ramesh</h1>
          </div>
          <Link to="/" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">Home</Link>
        </header>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {[
            ['Active lots', '24'],
            ['Pending offers', '8'],
            ['Avg. realized price', '₹ 2,980'],
            ['Verified lots', '17'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
              <div className="mt-4 text-3xl font-black tracking-[-0.05em] text-navy">{value}</div>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {farmerOffers.map((offer) => (
                <tr key={offer.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium text-slate-800">{offer.buyer}</td>
                  <td className="px-4 py-3">₹ {offer.price}</td>
                  <td className="px-4 py-3">{offer.quantity}</td>
                  <td className="px-4 py-3">{offer.region}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase text-amber-800">{offer.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="rounded bg-primary px-3 py-2 text-xs font-semibold text-white">Accept</button>
                      <button className="rounded border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Counter</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function BuyerDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-6 shadow-soft">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">Buyer dashboard</div>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.06em] text-navy">AI match insights</h1>
          </div>
          <Link to="/" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">Home</Link>
        </header>

        <div className="mb-8 rounded-2xl bg-gradient-to-r from-amber-100 to-yellow-50 p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800">AI sale-window advisor</div>
          <div className="mt-3 flex items-end justify-between gap-5">
            <div>
              <div className="text-4xl font-black tracking-[-0.06em] text-navy">₹ {mockSaleWindow.current_price}</div>
              <div className="text-sm text-slate-600">Current price</div>
            </div>
            <div>
              <div className="text-4xl font-black tracking-[-0.06em] text-navy">₹ {mockSaleWindow.predicted_7_day_price}</div>
              <div className="text-sm text-slate-600">Predicted 7-day price</div>
            </div>
            <div className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white">{mockSaleWindow.suggested_action}</div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {buyerMatches.map((match) => (
            <div key={match.lot_id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-navy">{match.farmer_name}</div>
                <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold uppercase text-green-800">
                  {match.verified ? 'Verified' : 'New'}
                </span>
              </div>
              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Matching score</div>
                <div className="mt-2 text-5xl font-black tracking-[-0.07em] text-primary">{match.matching_score}</div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-600">
                <div><span className="block text-[10px] uppercase tracking-[0.16em] text-slate-400">Distance</span>{match.distance_km} km</div>
                <div><span className="block text-[10px] uppercase tracking-[0.16em] text-slate-400">Price score</span>{match.price_score}</div>
              </div>
              <button className="mt-5 w-full rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-white">View lot</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-6 shadow-soft">
        <h1 className="text-3xl font-black tracking-[-0.06em] text-navy">Admin dashboard</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {['Farmers', 'Buyers', 'Lots', 'Disputes'].map((label, index) => (
            <div key={label} className="rounded-2xl border border-slate-200 p-5">
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
              <div className="mt-4 text-3xl font-black text-navy">{[1240, 410, 583, 6][index]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
      <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
