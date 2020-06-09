from setuptools import setup, find_packages

with open('requirements.txt') as f:
    requirements = f.readlines()

setup(
    name='cs325_guiviz',
    version='0.0.2',
    packages=find_packages(),
    url='https://github.com/NLPatVCU/cs325_guiviz',
    author='capstone',
    description='',
    install_requires=requirements
)