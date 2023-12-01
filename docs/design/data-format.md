# Data Format

Geo-Cosets

Animated Dispatch* (optional)
Full 8760 (EI, Zone, )

# Definition of a coset


Generation/Scatter Coset:
Should have a type: VRE, Non-VRE, Storage, Demand?, Aggregate?

Aggregate: For cases when we have multiple generation types at a single location.


Transmission/Line Coset:
Should have a rating and/or Voltage Class: Need rating for color scheme.

Timeseries should be in power (MW)



# Server-Side API


Lists all scenarios
https://gpac-viz.nrel.gov/scenarios/

Gets metadata for single scenario (metadata includes )
https://gpac-viz.nrel.gov/scenarios/{scenario_id}


List


# UI

Produce a variable list of filter components based on how many cosets/layers there are.

Have a seperate page for creating a scenario.

Return a list of available animation plots to show


