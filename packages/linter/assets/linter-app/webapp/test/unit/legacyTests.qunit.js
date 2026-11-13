/**
 * Legacy-style test file to demonstrate prefer-test-starter rule.
 * This file uses the old QUnit setup pattern instead of the modern Test Starter.
 */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/demo/todo/test/unit/controller/App.controller"
], function() {
	"use strict";
	QUnit.start();
});
