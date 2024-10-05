# -*- coding: utf-8 -*-
"""
Created on Fri Oct 4 2024

@author: Micah Webb
Description: A simple python client for uploading data into GridSight

"""


from setuptools import setup

setup(
    name="gridsight",
    version_config=True,
    author="Micah Webb",
    author_email="micah.webb@nrel.gov",
    description="A simple python client for uploading files into gridsight",
    url="https://www.github.com/NREL/GridSight",
    packages=[
        'gridsight_client',
    ],
    install_requires=[
        'requests'
    ]
)
