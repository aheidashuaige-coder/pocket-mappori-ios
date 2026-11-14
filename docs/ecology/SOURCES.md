# Static ecology data provenance and coverage

This is real OpenStreetMap data, not a synthetic demonstration. The shipped
example covers **only a 0.460 km² rectangle in southern Central Park, New York**:
`[west,south,east,north] = [-73.976,40.768,-73.969,40.775]`. It is not worldwide
coverage, all of Manhattan, or even all of Central Park. The v1 coarse grid ID is
an address for this partial extract; neither payload nor manifest claims the
entire coarse grid cell is surveyed. Outside the listed bbox, use generic
fallback. OSM coverage is volunteered and incomplete, and this extract is not a
safety or pedestrian-access certification.

## Origin and exact snapshot

Fetched **2026-10-21T13:18:37+00:00** using TLS-validated requests:

- https://api.openstreetmap.org/api/0.6/map.json?bbox=-73.976,40.768,-73.969,40.775
- https://api.openstreetmap.org/api/0.6/relation/7895705/full.json
- API reference: https://wiki.openstreetmap.org/wiki/API_v0.6#Retrieving_map_data_by_bounding_box:_GET_/api/0.6/map
- Licensing: https://www.openstreetmap.org/copyright
- License: https://opendatacommons.org/licenses/odbl/1-0/

`central-park-south.osm.json.gz` under `sources/` is the original public OSM
response elements merged by `(type,id)`, with request URLs and fetch timestamp.
It is included for **offline** byte-reproducible regeneration; mapping element
versions/timestamps are retained. See `sources/build-report.json` for the snapshot
SHA-256, generated feature/vertex counts and explicit skipped objects. The
snapshot's fetch time is not a claim every mapping object was surveyed that day.
Initial Overpass requests were unavailable, so the shipped source uses the OSM
main API. No game runtime code calls OSM's data API or Overpass.

## Transformation and limits

`python3 scripts/ecology/build.py` reads the pinned compressed snapshot without
network requests, keeps ecological/safety tags and OSM object IDs, converts ways
and multipolygon outer/inner rings, simplifies with GEOS topology preservation
at 0.00001° (~1m latitude), clips to the exact source bbox, and writes a versioned
tile and SHA-256/byte-length manifest. Point and line geometry are retained.
Contact/address metadata is omitted from the derived tile. Invalid or incomplete
objects are skipped and reported; no geometry is invented to repair them. This
snapshot omits two incomplete multipolygon relations (`20056665`, `21188792`),
so completeness is explicitly not guaranteed. The Lake relation is supplemented
from its full endpoint so its water polygon and inner holes can be reconstructed.
There is **no 500m perimeter buffer**; edge influence is incomplete and the data
must not be used beyond the exact manifest bbox. Large source collections must
be split in preprocessing: each output is capped at 1.5MB, 1500 features and
15000 vertices. Current counts and exact bytes are machine-recorded in the report.

Reproduce with Python >=3.9:

```sh
python3 -m venv .local/ecology-venv
.local/ecology-venv/bin/pip install -r scripts/ecology/requirements.txt
.local/ecology-venv/bin/python scripts/ecology/build.py
```

`--download` explicitly refreshes from the public OSM main API and supplements
relevant multipolygon members before building; live data changes and therefore
produces a different data version/hash. Downloading is a maintainer action only.
TLS validation is required. The manifest is the runtime allowlist.

## Grid contract

Band height is 0.25 degrees; `band=floor((lat+90)/.25)` (clamped 0..719), midlat
`-90+(band+.5)*.25`, columns `max(1,ceil(360*cos(midlat)/.25))`; longitude column
`floor((lng+180)/360*columns)` (clamped to the final column at +180). ID is
`v1-${band}-${column}`. Coordinate order is longitude/latitude in GeoJSON, but
latitude/longitude in `grid_id(lat,lng)`. Tests include the shipped NYC coordinate,
equator, and band boundary. Longitude wrapping belongs to the runtime caller;
this offline script accepts [-180,+180] and never uses user location.

## Batch preprocessing for additional regions

`scripts/ecology/batch.py` accepts a JSON list of jobs. Each job specifies
`name`, `bounds: [west,south,east,north]`, and `sourceFile` relative to the job
list. Source files use the same compressed attributed OSM snapshot format as the
shipped source. Example `regions.json` placed in the repository root:

```json
[
  {
    "name": "纽约中央公园南部局部",
    "bounds": [-73.976, 40.768, -73.969, 40.775],
    "sourceFile": "public/ecology/sources/central-park-south.osm.json.gz"
  }
]
```

Generate a separate static directory without changing the shipped assets:

```sh
.local/ecology-venv/bin/python scripts/ecology/batch.py \
  --regions regions.json --output .local/ecology-batch
```

The default is completely offline. Each job must fit one grid cell and the
original snapshot's surveyed bbox, and must not exceed the OSM API limit of
0.25 square degrees. Split larger jobs along grid boundaries. The CLI rejects
sources over 50MB compressed/100MB expanded and enforces the builder's tile
feature/vertex/byte limits. Each output keeps a uniquely named original source
and build report under `sources/`; its `regionConfig` metadata includes the exact
name and bbox in the source hash so distinct extracts cannot reuse the same
same-source version accidentally. Actual OSM elements are preserved. Manifest
updates replace only an entry with the same grid ID **and** bbox, preserving
other footprints and other grid entries. Copy this license and provenance
alongside any separately distributed generated database.

Maintainers may explicitly add `--download` to fetch each job's public bbox
through the OSM main API. This opts into network access and produces a fresh
snapshot before preprocessing; it is never part of game runtime or an automatic
player-location request. `sourceFile` remains required in the job schema but is
not read when downloading. Re-running without `--download` reproduces the pinned
source; updating from live OSM can change geometry and hashes.
