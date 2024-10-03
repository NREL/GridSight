import sqlite3
import os
from typing import List
from typing import Optional
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy import INT
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select



from uuid import uuid4
class Base(DeclarativeBase):
    pass

class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    public: Mapped[int] = mapped_column(INT)
    name: Mapped[str] = mapped_column(String(30))
    scenarios: Mapped[List["Scenario"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )
    owner: Mapped[str] = mapped_column(String(30))
    display_name: Mapped[Optional[str]]
    description: Mapped[Optional[str]]

    def __repr__(self)-> str:
        return f"Project(id={self.id!r},public={self.public!r}, name={self.name!r}, display_name={self.display_name!r}, description={self.description!r})"


class Scenario(Base):
    __tablename__ = "scenarios"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    project: Mapped["Project"] = relationship(back_populates="scenarios")
    public: Mapped[int] = mapped_column(INT)
    name: Mapped[str] = mapped_column(String(30))
    layers: Mapped[List["Layer"]] = relationship(
        back_populates="scenario", cascade="all, delete-orphan"
    )
    display_name: Mapped[Optional[str]]
    description: Mapped[Optional[str]]


    def __repr__(self)-> str:
        return f"Scenario(id={self.id!r}, project_id={self.project_id!r}, public={self.public!r}, name={self.name!r}, display_name={self.display_name!r}, description={self.description!r})"


class Layer(Base):
    __tablename__ = "layers"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    scenario_id: Mapped[int] = mapped_column(ForeignKey("scenarios.id"))
    scenario: Mapped["Scenario"] = relationship(back_populates="layers")
    timeseries: Mapped[List["Timeseries"]] = relationship(
        back_populates="layer", cascade="all, delete-orphan"
    )
    file_id: Mapped[str] = mapped_column(String(64))
    type: Mapped[str] = mapped_column(String(64))
    public: Mapped[int] = mapped_column(INT)
    name: Mapped[str] = mapped_column(String(30))
    display_name: Mapped[Optional[str]]
    description: Mapped[Optional[str]]

    def __repr__(self)-> str:
        return f"""Layer(
        id={self.id!r},
        scenario_id={self.scenario_id!r}
        file_id={self.file_id!r},
        public={self.public!r},
        name={self.name!r},
        display_name={self.display_name!r},
        description={self.description!r})"""


class Timeseries(Base):
    __tablename__ = "timeseries"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    layer_id: Mapped[int] = mapped_column(ForeignKey("layers.id"))
    layer: Mapped["Layer"] = relationship(back_populates="timeseries")
    file_id: Mapped[str] = mapped_column(String(64))
    public: Mapped[int] = mapped_column(INT)
    name: Mapped[str] = mapped_column(String(30))
    display_name: Mapped[Optional[str]]
    description: Mapped[Optional[str]]

    def __repr__(self)-> str:
        return f"""Timeseries(
        id={self.id!r},
        layer_id



        )"""

class DBManager():
    def __init__(self) -> None:
        self.engine = create_engine("sqlite://", echo=True)
        Base.metadata.create_all(self.engine)

        self.Session = sessionmaker(self.engine)


    def add_row(self, row_object) -> int:

        with self.Session.begin() as session:
            session.add(row_object)
            session.flush()
            session.refresh(row_object)

            return row_object.id

    def create_new_project(self, project_name, owner, isPublic=True):
        p = Project(name=project_name, owner=owner, public=int(isPublic))
        return self.add_row(p)

    def add_scenario_to_project(self, project_id, name, display_name=None, isPublic=True):

        s = Scenario(name=name,
                     project_id = project_id,
                     display_name=display_name,
                     public=isPublic
                     )
        return self.add_row(s)

    def add_layer_to_scenario(self, scenario_id, name, file_id, type='geojson', display_name=None, isPublic=True):
        l = Layer(name=name,
                  scenario_id=scenario_id,
                  display_name=display_name,
                  file_id=file_id,
                  type=type,
                  public = isPublic
                  )
        return self.add_row(l)

    def add_timeseries_to_layer(self, layer_id, name, file_id, display_name=None, isPublic=True):
        t = Timeseries(name=name,
                       layer_id=layer_id,
                       file_id=file_id,
                       display_name=display_name,
                       public=isPublic
                       )
        return self.add_row(t)

    def list_projects_public(self):

        projects = []
        with self.Session() as session:
            statement = select(Project).where(Project.public.is_(1))

            for project in session.scalars(statement=statement):
                projects.append(project)

        return projects

    def list_projects_by_owner(self, owner):
        projects = []
        with self.Session.begin() as session:
            statement = select(Project).where(Project.owner.is_(owner))

            for project in session.scalars(statement=statement):

                projects.append(project)

        return projects




    def list_scenarios_by_project(self, project_id):

        scenarios = []

        with self.Session() as session:
            statement = select(Scenario).where(Scenario.project_id.is_(project_id))

            for scenario in session.scalars(statement=statement):
                scenarios.append(scenario)
        return scenarios

    def get_scenario_layer_props(self, scenario_id):


        # get the all of the layers and properties, name, display_name, file_id, etc.

        # get the timeseries data

        # pydantic model

        """
        [
            {
            id: scenario_id,
            name: name,
            display_name: display_name,
            file_id: geo_file_id,
            timeseries: [{id: timeseries_id, name: name, file_id:file_id}, ...]

            }
            ...
        ]
        """

        layers = []


        with self.Session() as session:
            statement = select(Layer).where(Layer.scenario_id.is_(scenario_id))

            for layer in session.scalars(statement=statement):


                layers.append(layer)
        return scenarios



db = DBManager()

id1 = db.create_new_project("DEMO", owner='demo@example.com')

id2 = db.create_new_project("DEMO2", owner='demo2@example.com')

print(id1, id2)

projects = db.list_projects_public()

proj1 = projects[0].id

print(projects)

print(proj1)

s_id = db.add_scenario_to_project(project_id=proj1, name='S1')

scenarios = db.list_scenarios_by_project(project_id=proj1)

# add layer to scenario
layer_file_id = str(uuid4())
l_id = db.add_layer_to_scenario(scenario_id=s_id, name="layer", file_id=layer_file_id)

# add timeseries to layer
timeseries_file_id = str(uuid4())
t_id = db.add_timeseries_to_layer(layer_id=l_id, name='Timeseries1', file_id=timeseries_file_id)




