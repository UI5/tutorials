import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import Label from "sap/m/Label";
import Button, { Button$PressEvent } from "sap/m/Button";
import RatingIndicator, { RatingIndicator$LiveChangeEvent } from "sap/m/RatingIndicator";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

/**
 * @namespace ui5.walkthrough.control
 */
export default class ProductRating extends Control {
	// The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
	constructor(idOrSettings?: string | $ProductRatingSettings);
	constructor(id?: string, settings?: $ProductRatingSettings);
	constructor(id?: string, settings?: $ProductRatingSettings) { super(id, settings); }

	static readonly metadata: MetadataOptions = {
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
	}

	init(): void {
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
	}

	setValue(value: "float" ): ProductRating {
		this.setProperty("value", value, true);
		(this.getAggregation("_rating") as RatingIndicator).setValue(value);

		return this;
	}

	reset(): void {
		const resourceBundle = (this?.getModel("i18n") as ResourceModel)?.getResourceBundle() as ResourceBundle;

		this.setValue(0);
		(this.getAggregation("_label") as Label).setDesign("Standard");
		(this.getAggregation("_rating") as RatingIndicator).setEnabled(true);
		(this.getAggregation("_label") as Label).setText(resourceBundle.getText("productRatingLabelInitial"));
		(this.getAggregation("_button") as Button).setEnabled(true);
	}

	_onRate(event: RatingIndicator$LiveChangeEvent): void {
		const resourceBundle = (this?.getModel("i18n") as ResourceModel)?.getResourceBundle() as ResourceBundle;
		const value = event.getParameter("value");

		this.setProperty("value", value, true);

		(this.getAggregation("_label") as Label).setText(resourceBundle.getText("productRatingLabelIndicator", [value, (event.getSource() as RatingIndicator).getMaxValue()]));
		(this.getAggregation("_label") as Label).setDesign("Bold");
	}

	_onSubmit(event: Button$PressEvent): void {
		const resourceBundle = (this?.getModel("i18n") as ResourceModel)?.getResourceBundle() as ResourceBundle;

		(this.getAggregation("_rating") as RatingIndicator).setEnabled(false);
		(this.getAggregation("_label") as Label).setText(resourceBundle.getText("productRatingLabelFinal"));
		(this.getAggregation("_button") as Button).setEnabled(false);
		this.fireEvent("change", {
			value: this.getValue()
		})
	}

	static renderer = {
		apiVersion: 4,
		render: (rm: RenderManager, control: ProductRating) => {
			const tooltip = control.getTooltip_AsString();
			rm.openStart("div", control);
			rm.class("myAppDemoWTProductRating");
			if (tooltip) {
				rm.attr("title", tooltip);
			}
			rm.openEnd();
			rm.renderControl(control.getAggregation("_rating") as Control);
			rm.renderControl(control.getAggregation("_label") as Control);
			rm.renderControl(control.getAggregation("_button") as Control);
			rm.close("div");
		}
	}
};
