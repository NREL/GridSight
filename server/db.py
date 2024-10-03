import os



class dbreader():
    def __init__(self) -> None:


        pass


    def list_projects(user_id):
        return NotImplemented

    def list_scenarios(project_id):
        return NotImplemented

    def list_layers(scenario_id):
        """The layers associated with a scenario. A layer can
        be associated with multiple scenarios. (e.g. weather data by county)"""
        return NotImplemented

    # timeseries attached to a
    # particular
    def list_timeseries(layer_id):
        """
        Timeseries datasets (by uuid),
        that are associated with a particular layer.
        """
        return NotImplemented


    def list_static(layer_id):
        """
        Static datasets that (by uuid),
        that are associated with a particular layer.
        """
