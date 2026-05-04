sap.ui.define(["sap/ui/core/Control", "sap/m/Label", "sap/m/Button", "sap/m/RatingIndicator"], function (Control, Label, Button, RatingIndicator) {
  "use strict";

  const ProductRating = Control.extend("ui5.walkthrough.control.ProductRating", {
    renderer: {
      apiVersion: 4,
      render: (rm, control) => {
        const tooltip = control.getTooltip_AsString();
        rm.openStart("div", control);
        rm.class("myAppDemoWTProductRating");
        if (tooltip) {
          rm.attr("title", tooltip);
        }
        rm.openEnd();
        rm.renderControl(control.getAggregation("_rating"));
        rm.renderControl(control.getAggregation("_label"));
        rm.renderControl(control.getAggregation("_button"));
        rm.close("div");
      }
    },
    metadata: {
      properties: {
        value: {
          type: "float",
          defaultValue: 0
        }
      },
      aggregations: {
        _rating: {
          type: "sap.m.RatingIndicator",
          multiple: false,
          visibility: "hidden"
        },
        _label: {
          type: "sap.m.Label",
          multiple: false,
          visibility: "hidden"
        },
        _button: {
          type: "sap.m.Button",
          multiple: false,
          visibility: "hidden"
        }
      },
      events: {
        change: {
          parameters: {
            "value": "float"
          }
        }
      }
    },
    constructor(id, settings) {
      Control.prototype.constructor.call(this, id, settings);
    },
    init() {
      this.setAggregation("_rating", new RatingIndicator({
        value: this.getValue(),
        iconSize: "2rem",
        liveChange: this._onRate.bind(this)
      }));
      this.setAggregation("_label", new Label({
        text: "{i18n>productRatingLabelInitial}"
      }).addStyleClass("sapUiSmallMargin"));
      this.setAggregation("_button", new Button({
        text: "{i18n>productRatingButton}",
        press: this._onSubmit.bind(this)
      }).addStyleClass("sapUiTinyMarginTopBottom"));
    },
    setValue(value) {
      this.setProperty("value", value, true);
      this.getAggregation("_rating").setValue(value);
      return this;
    },
    reset() {
      const resourceBundle = this?.getModel("i18n")?.getResourceBundle();
      this.setValue(0);
      this.getAggregation("_label").setDesign("Standard");
      this.getAggregation("_rating").setEnabled(true);
      this.getAggregation("_label").setText(resourceBundle.getText("productRatingLabelInitial"));
      this.getAggregation("_button").setEnabled(true);
    },
    _onRate(event) {
      const resourceBundle = this?.getModel("i18n")?.getResourceBundle();
      const value = event.getParameter("value");
      this.setProperty("value", value, true);
      this.getAggregation("_label").setText(resourceBundle.getText("productRatingLabelIndicator", [value, event.getSource().getMaxValue()]));
      this.getAggregation("_label").setDesign("Bold");
    },
    _onSubmit(event) {
      const resourceBundle = this?.getModel("i18n")?.getResourceBundle();
      this.getAggregation("_rating").setEnabled(false);
      this.getAggregation("_label").setText(resourceBundle.getText("productRatingLabelFinal"));
      this.getAggregation("_button").setEnabled(false);
      this.fireEvent("change", {
        value: this.getValue()
      });
    }
  });
  return ProductRating;
});
