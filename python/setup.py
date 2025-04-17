#!/usr/bin/env python3
"""
Setup script for Adam-X Python interface
"""

from setuptools import setup, find_packages

setup(
    name="adam-x",
    version="1.0.0",
    description="Terminal-based AI coding assistant",
    author="Adam-X Team",
    author_email="info@adam-x.com",
    url="https://github.com/adam/adam-x",
    py_modules=["adam_x"],
    entry_points={
        "console_scripts": [
            "adam-x-py=adam_x:main",
        ],
    },
    install_requires=[
        "readline;platform_system!='Windows'",
        "pyreadline3;platform_system=='Windows'",
    ],
    classifiers=[
        "Development Status :: 4 - Beta",
        "Environment :: Console",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: Apache Software License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Topic :: Software Development :: Code Generators",
    ],
    python_requires=">=3.7",
)
