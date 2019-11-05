# node-database

This is a project to construct a very simple graph database in node.js and therefore be able to experiment with different kinds of cardinality estimation, evaluation techniques and memory optimisations.

## Proposed Features
Ideally, this project should allow one to choose which type of estimator, IR compression technique, data structures, join methods, etc. to use and times will be able to be compared between them.

## Setup
In order to be able to run anything, one will need to obtain a `.nt` file containing a graph, with headers in RDF triple format and then a `.csv` file with the RPQs that they want to run (the system does not support CRPQs).

To start the build server simply run:
```
git clone git@github.com:stanrogo/node-database.git
cd node-database
yarn install
yarn start
node dist/index.js
```

Then input the paths to the required files, hit enter and watch it run!
