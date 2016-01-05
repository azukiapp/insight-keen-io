# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## dev

* Enhancements
  * [Core] Replacing promise for simple node callback;

## v0.8.0 - (2015-12-29)

* Enhancements
  * [Core] Removing unnecessary dependencies;

* Bug
  * [Core] Fixing to use queue and not '_data' to send analytics informations;

## v0.7.2 - (2015-12-29)

* Bug
  * [Background] Adding `jstream` to prevent the data was corrupted in processes communication;

## v0.7.1 - (2015-12-03)

* Enhancements
  * [Core] Removing inquirer. Caller has this responsability now
  * [Options] Removing fork_silent and use_fork for send_in_background
  * [Package.json] Libs updated
