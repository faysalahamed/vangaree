type Props = {
  defaults: {
    q?: string;
    partType?: string;
    type?: string;
    condition?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  };
};

const PART_TYPES = ["Display", "Battery", "Camera", "Charging Port", "Speaker", "Back Panel"];
const LISTING_TYPES = [
  { value: "SELL", label: "For Sale" },
  { value: "BUY", label: "Looking to Buy" },
  { value: "REPAIR_OFFER", label: "Repair Service" },
  { value: "REPAIR_REQUEST", label: "Needs Repair" }
];
const CONDITIONS = [
  { value: "NEW", label: "New" },
  { value: "USED_GOOD", label: "Used — Good" },
  { value: "USED_FAIR", label: "Used — Fair" },
  { value: "FOR_PARTS", label: "For Parts" }
];
const SORTS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Lowest Price" },
  { value: "price_desc", label: "Highest Price" }
];

export default function SearchFilters({ defaults }: Props) {
  return (
    <form action="/listings" className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-4 mb-6 md:grid-cols-6">
      <div className="md:col-span-2">
        <label className="block text-xs font-semibold text-primary mb-1" htmlFor="q">
          Keyword
        </label>
        <input
          id="q"
          name="q"
          defaultValue={defaults.q}
          placeholder="Model, keyword…"
          className="w-full h-10 rounded-lg border border-neutral-200 px-3 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-primary mb-1" htmlFor="partType">
          Part
        </label>
        <select
          id="partType"
          name="partType"
          defaultValue={defaults.partType ?? ""}
          className="w-full h-10 rounded-lg border border-neutral-200 px-2 text-sm"
        >
          <option value="">Any part</option>
          {PART_TYPES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-primary mb-1" htmlFor="type">
          Listing type
        </label>
        <select
          id="type"
          name="type"
          defaultValue={defaults.type ?? ""}
          className="w-full h-10 rounded-lg border border-neutral-200 px-2 text-sm"
        >
          <option value="">Any type</option>
          {LISTING_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-primary mb-1" htmlFor="condition">
          Condition
        </label>
        <select
          id="condition"
          name="condition"
          defaultValue={defaults.condition ?? ""}
          className="w-full h-10 rounded-lg border border-neutral-200 px-2 text-sm"
        >
          <option value="">Any condition</option>
          {CONDITIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-primary mb-1" htmlFor="location">
          Location
        </label>
        <input
          id="location"
          name="location"
          defaultValue={defaults.location}
          placeholder="Area, city…"
          className="w-full h-10 rounded-lg border border-neutral-200 px-3 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-primary mb-1" htmlFor="minPrice">
          Min price (৳)
        </label>
        <input
          id="minPrice"
          name="minPrice"
          type="number"
          defaultValue={defaults.minPrice}
          className="w-full h-10 rounded-lg border border-neutral-200 px-3 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-primary mb-1" htmlFor="maxPrice">
          Max price (৳)
        </label>
        <input
          id="maxPrice"
          name="maxPrice"
          type="number"
          defaultValue={defaults.maxPrice}
          className="w-full h-10 rounded-lg border border-neutral-200 px-3 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-primary mb-1" htmlFor="sort">
          Sort by
        </label>
        <select
          id="sort"
          name="sort"
          defaultValue={defaults.sort ?? "latest"}
          className="w-full h-10 rounded-lg border border-neutral-200 px-2 text-sm"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end">
        <button type="submit" className="h-10 w-full rounded-lg bg-primary text-white text-sm font-semibold">
          Apply Filters
        </button>
      </div>
    </form>
  );
}
